/** 
 * Script Author 						: 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
 * Author Desig. 						: 	Jr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   						: 	SuiteletScript
 * Created Date  						: 	Feb 01, 2016
 * Last Modified Date 					:  	Feb 01, 2016
 * Comments                 			: 	Script will Create Customer Deposite
 * Sandbox User Interface				:	https://debugger.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=1054&deploy=1
 * Sandbox Suitelet Script URL 			:	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1054
 * Sandbox Client Script URL			:	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1056
 * Sandbox Scheduled Script URL			:	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1111
 * Sandbox Save Search 1 URL			:	https://debugger.sandbox.netsuite.com/app/common/search/savedsearch.nl?id=4622 
 * Sandbox Save Search 2 URL			:	https://debugger.sandbox.netsuite.com/app/common/search/savedsearch.nl?id=4624
 * Sandbox Save Search 3 URL			:	https://debugger.sandbox.netsuite.com/app/common/search/savedsearch.nl?id=4671
 * Production User Interface			:	https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=11584&deploy=1
 * Production Suitelet Script URL 		:	https://system.netsuite.com/app/common/scripting/script.nl?id=1158
 * Production Client Script URL			:	https://system.netsuite.com/app/common/scripting/script.nl?id=1169
 * Production Scheduled Script URL		:	https://system.netsuite.com/app/common/scripting/script.nl?id=1163
 * Production Save Search 1 URL			:	https://system.netsuite.com/app/common/search/savedsearch.nl?id=5598
 * Production Save Search 2 URL			:	https://system.netsuite.com/app/common/search/savedsearch.nl?id=5599
 * Production Save Search 3 URL			:	https://system.netsuite.com/app/common/search/savedsearch.nl?id=5609
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

		do
		{
			var AllRows = results.getResults(searchid, searchid + 1000);
			if (AllRows != null && AllRows != '')
			{
				var date=nlapiDateToString(new Date(),'date');
			 	for (var rs in AllRows)
				{
					var allCol = AllRows[rs].getAllColumns();
					//var type=AllRows[rs].getValue(allCol[0]);

					var flag="Fail";
					var soId=AllRows[rs].getId();
					var customer_id= AllRows[rs].getValue(allCol[2]);
					name = AllRows[rs].getValue(allCol[3]);
					email = AllRows[rs].getValue(allCol[4]);
					orderNo = AllRows[rs].getValue(allCol[5]);
                    var currency= AllRows[rs].getValue(allCol[6]);
					var custObj = nlapiLoadRecord("customer",customer_id);
					var ccCount = custObj.getLineItemCount("creditcards");

					if(ccCount > 0)
					{	var amount=AllRows[rs].getValue(allCol[1]);
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
						//customer_deposit.setFieldValue('chargeit',"T");
					}
					try
					{
						var ID=nlapiSubmitRecord(customer_deposit,true,true);
						flag="Successful";
						nlapiLogExecution("debug","Deposit Created for soId: "+soId,"Deposit ID is : "+ ID+" with : "+amount);
                        nlapiSubmitField("salesorder", soId, ["custbodylast_deposit_date", "custbodylast_deposit_status","custbodylast_deposit_amount"], [date, flag,0]);
					}
					catch(err)
					{
                        var msg = err.message;
                        flag="Fail";
                        nlapiLogExecution("debug", "customer name is :", name);
                        nlapiLogExecution("debug", "Order Number is :", orderNo);
                        nlapiLogExecution("debug", "Error Deposit Can't Created ", "Details: " + err.message);
                        SendEmail(name,orderNo,soId,msg);
                        nlapiSubmitField("salesorder", soId, ["custbodylast_deposit_date", "custbodylast_deposit_status","custbodylast_deposit_amount"], [date, flag,0]);
					}
					searchid++;
				}
            }
        } while (AllRows.length >= 1000);
        //nlapiLogExecution("debug", 'Record Length : ' + searchid);
	}
	catch(er)
	{
		nlapiLogExecution("debug", "Error on load Record",er.message);
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