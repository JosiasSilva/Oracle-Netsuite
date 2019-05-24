nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author 						: 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
 * Author Desig. 						: 	Jr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   						: 	SuiteletScript
 * Created Date  						: 	Feb 01, 2016
 * Last Modified Date 					:  	Feb 01, 2016
 * Comments                 			: 	Script will Create Customer Deposite
 * Sandbox User Interface				:	/app/site/hosting/scriptlet.nl?script=1054&deploy=1
 * Sandbox Suitelet Script URL 			:	/app/common/scripting/script.nl?id=1054
 * Sandbox Client Script URL			:	/app/common/scripting/script.nl?id=1056
 * Sandbox Scheduled Script URL			:	/app/common/scripting/script.nl?id=1111
 * Sandbox Save Search 1 URL			:	/app/common/search/savedsearch.nl?id=4622 
 * Sandbox Save Search 2 URL			:	/app/common/search/savedsearch.nl?id=4624
 * Sandbox Save Search 3 URL			:	/app/common/search/savedsearch.nl?id=4671
 * Production User Interface			:	/app/site/hosting/scriptlet.nl?script=1158&deploy=1
 * Production Suitelet Script URL 		:	/app/common/scripting/script.nl?id=1158
 * Production Client Script URL			:	/app/common/scripting/script.nl?id=1159
 * Production Scheduled Script URL		:	/app/common/scripting/script.nl?id=1163
 * Production Save Search 1 URL			:	/app/common/search/savedsearch.nl?id=5598
 * Production Save Search 2 URL			:	/app/common/search/savedsearch.nl?id=5599
 * Production Save Search 3 URL			:	/app/common/search/savedsearch.nl?id=5609
*/

function Layaway_Customer_Deposit()
{
  try
	{
        //var customer_deposit=nlapiGetContext().getRemainingUsage();
        //nlapiLogExecution("debug",'customer_deposit',JSON.stringify(customer_deposit));
		var Search = nlapiLoadSearch(null, 'customsearch_layaway_customer_deposite');
 		var results = Search.runSearch();
 		var resultsArr = [];
 		var searchid = 0;
		var name = "";
		var email = "";
		var orderNo = "";
		var cd = 0;
		
		var searchResult = new Array();
        do {
			var AllRows = results.getResults(searchid, searchid + 1000);            
            if (AllRows != null && AllRows != '') {
                for (var rs in AllRows) {
					checkforYield();
                    searchResult.push(AllRows[rs]);
                    searchid++;
                }
            }

        } while (AllRows.length >= 1000);

		 if (searchResult != null && searchResult != '') {
			 var date=nlapiDateToString(new Date(),'date');
			 var allCol = searchResult[0].getAllColumns();
			 var flag="Fail";
			  for (var i = 0; i < searchResult.length; i++) {
				  checkforYield();				  
					//var type=AllRows[rs].getValue(allCol[0]);					
					var soId=searchResult[i].getId();
					var customer_id= searchResult[i].getValue(allCol[2]);
					name = searchResult[i].getValue(allCol[3]);
					email = searchResult[i].getValue(allCol[4]);
					orderNo = searchResult[i].getValue(allCol[5]);
                    var currency= searchResult[i].getValue(allCol[6]);
					var custObj = nlapiLoadRecord("customer",customer_id);
					var ccCount = custObj.getLineItemCount("creditcards");

					if(ccCount > 0)
					{	var amount=searchResult[i].getValue(allCol[1]);
						var customer_deposit=nlapiCreateRecord("customerdeposit");
						customer_deposit.setFieldValue('customform','164');
						customer_deposit.setFieldValue('customer',customer_id);
						customer_deposit.setFieldValue('payment',amount);
                     	customer_deposit.setFieldValue('exchangerate','1.00');
						customer_deposit.setFieldValue('trandate',date);
						customer_deposit.setFieldValue('salesorder',soId);
						//receipt.setFieldValue('paymentmethod','4');
						//credit card payment processing

						for(var z=1; z<=ccCount; z++)
						{
							var defaultCreditCard = custObj.getLineItemValue("creditcards","ccdefault",z);
							if(defaultCreditCard == "T")
							{
								cd = 1;
								customer_deposit.setFieldValue('paymentmethod',custObj.getLineItemValue("creditcards","paymentmethod",z));
								customer_deposit.setFieldValue('creditcardprocessor',1);
								customer_deposit.setFieldValue('creditcard',custObj.getLineItemValue("creditcards","internalid",z));
								customer_deposit.setFieldValue('ccnumber',custObj.getLineItemValue("creditcards","ccnumber",z));
								customer_deposit.setFieldValue('ccexpiredate',custObj.getLineItemValue("creditcards","ccexpiredate",z));
								customer_deposit.setFieldValue('ccname',custObj.getLineItemValue("creditcards","ccname",z));
								break;
							}
						}
						var addressCount = custObj.getLineItemCount("addressbook");
						if(addressCount > 0)
						{
							for(var j=1; j<=addressCount; j++)
							{
								var defaultBilling = custObj.getLineItemValue("addressbook","defaultbilling",j);
								if(defaultBilling == "T")
								{
									customer_deposit.setFieldValue('ccstreet',custObj.getLineItemValue("addressbook","addr1_initialvalue",j));
									customer_deposit.setFieldValue('cczipcode',custObj.getLineItemValue("addressbook","zip_initialvalue",j));
									break;
								}
							}
						}						
					}
					try
					{
						if(cd == 1)
						{
							var ID=nlapiSubmitRecord(customer_deposit,true,true);
							flag="Successful";
							nlapiLogExecution("debug","Deposit Created for soId: "+soId,"Deposit ID is : "+ ID+" with : "+amount);
							nlapiSubmitField("salesorder", soId, ["custbodylast_deposit_date", "custbodylast_deposit_status","custbodylast_deposit_amount"], [date, flag,0]);
						}
						else
						{
							nlapiLogExecution("debug","Default Credit Card of customer is not available.");
						}
					}
					catch(err)
					{
                        var msg = err.message;
                        flag="Fail";
                        nlapiLogExecution("debug", "Error Deposit Can't Created ", "Details: " + err.message);
                        SendEmail(name,orderNo,soId,msg);
                        nlapiSubmitField("salesorder", soId, ["custbodylast_deposit_date", "custbodylast_deposit_status","custbodylast_deposit_amount"], [date, flag,0]);
					}
				  
			  }
		 }
        //nlapiLogExecution("debug", 'Record Length : ' + searchid);
	}
	catch(er)
	{
		nlapiLogExecution("debug", "Error on load Record",er.message);
	}
}


function checkforYield() {
    // Checking for remaining usage
    if(nlapiGetContext().getRemainingUsage() < 500) {
        var stateMain = nlapiYieldScript();
        if(stateMain.status == 'FAILURE') {
            nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
            throw "Failed to yield script";
        } else if(stateMain.status == 'RESUME') {
            nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
        }
    }
}

function SendEmail(name,orderNo,soId,msg)
{
    var email = nlapiLookupField("salesorder",soId,"custbody_user_email");
	var subject = "Layaway Payment Error Mail";
	var body = '<table>';
	body += '<tr><td><b>Customer Name : </b></td><td>'+name+'</td></tr>';
	body += '<tr><td><b>Sales Order Number : </b></td><td>'+orderNo+'</td></tr>';
	body += '<tr><td><b>Fail Message : </b></td><td>'+msg+'</td></tr>';	
	body += '</table>';
    nlapiLogExecution("debug","user mail is :",email);
	nlapiSendEmail( 1564077, email, subject, '<html><body style="font-family:Verdana">'+body+'</body></html>',null,null,null,null,true );
	nlapiLogExecution('debug','Email has been sent to customer whose email is  :', email);
}