nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com/ shivamupc73@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : SuiteScript
 * Created Date  : Feb 18, 2016
 * Last Modified Date : Feb 18, 2016
 * Comments : Script will update true balance amount of salesorder on creation/edition
 * SB URL-1: /app/common/scripting/script.nl?id=851
 * SB URL-2: /app/common/scripting/script.nl?id=853
 * SB URL-3:  /app/common/scripting/script.nl?id=854
 * SB URL-4:  /app/common/scripting/script.nl?id=908
*/

function cdpTrueBalAmtUpdCML(type,form)
{
	
     try
     {
        if(type=="create"  || type=="edit" || type=="xedit")  
		{
			var cmId=nlapiGetRecordId(); 
			var recordType=nlapiGetRecordType();
			var soId='';
			nlapiLogExecution("debug", "Customer Credit Memo Id: " + cmId+', RecordType:'+recordType);
            if(recordType=='customrecord_credit_memo_link')
            {
				soId=nlapiLookupField("customrecord_credit_memo_link",cmId,"custrecord_credit_memo_link_parent");
				updateCreditMemoLinkAmt(cmId);
            }
			if(soId!=null && soId!='')
			{
				True_Balance_Calculation(soId, type);
            }
        }
     }
     catch(err)
     {
		nlapiLogExecution("debug","Error occur during getting soId on CDP :",err.message); 
     }
}
function updateCreditMemoLinkAmt(cmlId)
{
	//Update Credit memo link amount if salesorder and credit memo are in the same currency
	try
	{  
		nlapiLogExecution("debug", "CML Id: " + cmlId);		
		var cmlObj=nlapiLoadRecord('customrecord_credit_memo_link',cmlId)
		var soId=cmlObj.getFieldValue('custrecord_credit_memo_link_parent');
		amount=cmlObj.getFieldValue('custrecord_credit_memo_link_amount');
		creditMemoId=cmlObj.getFieldValue('custrecord_credit_memo_link_cm');
		customerId=cmlObj.getFieldValue('custrecord_credit_memo_link_customer');
        nlapiLogExecution("debug", "CML Old Amount: " + amount,cmlId);    
		var soFieldArr=["currency"];
		var soFieldArrVal=nlapiLookupField("salesorder",soId,soFieldArr);
		var so_currencyId =soFieldArrVal.currency;

		var cmObj=nlapiLoadRecord('creditmemo',creditMemoId);
		var cm_currencyId =cmObj.getFieldValue('currency');
		var cm_currencySymbol =cmObj.getFieldValue('currencysymbol');
		//var cm_consolidatebalance=cmObj.getFieldValue('consolidatebalance'); //Don't Use this
		var cm_consolidatebalance=cmObj.getFieldValue('origtotal'); // Only for respective credit memo;

		var cm_overallbalance=cmObj.getFieldValue('overallbalance');
		var origcurrency = cmObj.getFieldValue('origcurrency');
		var origexchangerate = cmObj.getFieldValue('origexchangerate');
		var cm_appliedAmt=cmObj.getFieldValue('applied');
		if(cm_appliedAmt=='' || cm_appliedAmt==null)
		{
			cm_appliedAmt=0;
		}
		var cm_unappliedAmt=cmObj.getFieldValue('unapplied');
		if(cm_unappliedAmt=='' || cm_unappliedAmt==null)
		{
			cm_unappliedAmt=0;
		}
		if(so_currencyId==cm_currencyId)
		{
		   //var cmlAmount=cm_consolidatebalance;
		   //Added by Shiv per Rachel's feedback on jira NS-338
		   var cmlAmount=parseFloat(cm_consolidatebalance)+ parseFloat(cm_appliedAmt); //after credtit memo link consider applied amount
		   var FieldArr=['custrecord_credit_memo_link_amount','custrecord_unapplied_amt'];
		   var FieldValArr=[cmlAmount,cm_unappliedAmt];
		   nlapiSubmitField("customrecord_credit_memo_link",cmlId,FieldArr, FieldValArr);
		   nlapiLogExecution("debug", "CML Updated Amount: " + cmlAmount,cmlId);  		   
		  
		   if(creditMemoId!='' && creditMemoId!=null) 
		   {
		    var cmFieldArr=['custbody_creditmemolinked_soid','custbody_creditmemolinked_id'];
			var cmFieldValArr=[soId,cmlId];
            nlapiSubmitField("creditmemo",creditMemoId,cmFieldArr, cmFieldValArr);
			nlapiLogExecution("debug", "Credit Memo respective field updated w.r.t: creditMemoId:"+creditMemoId,cmlId);  
		   }
		   //End
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Error on Credit Memo Link Amount", + err.toString());
		
	}
}
function True_Balance_Calculation(soId,type)
{

       if( type=="create"  || type=="edit" || type=="xedit")  
	{
           
		try{
                      nlapiLogExecution("debug", "Customer Deposit SoId: " + soId);  
					  var salesObj=nlapiLoadRecord('salesorder',soId);
		   
					//Added block to get my A/c Info by Rahul
			          var MyAccount_Status=salesObj.getFieldValue("status");
					  var MyAccount_OrderType=salesObj.getFieldValue("custbody87");
					  var MyAccount_WebInfo=salesObj.getFieldValue("custbody_my_account_info_on_web"); 					  
			        // end 
			
		    var count=salesObj.getLineItemCount('item');
                    var soCustmerId=salesObj.getFieldValue('entity');
                    
                    nlapiLogExecution("debug", "soCustmerId: " + soCustmerId);
                    var myTrueBal= nlapiLookupField('salesorder',soId,'custbody_website_truebalance_amt'); 
                    nlapiLogExecution("debug", "myTrueBal: " + soId+ ' :- ' + myTrueBal);
					//Get True Bal Adjustment
					 var TrueBalAdjustAmount= nlapiLookupField('salesorder',soId,'custbody_website_truebalance_adj_amt'); 
					 if(TrueBalAdjustAmount=='' || TrueBalAdjustAmount==null)
					 {
						 TrueBalAdjustAmount=0;
					 }
					 nlapiLogExecution("debug", "True Balance: "+myTrueBal+", True Balance Adjustment: " + TrueBalAdjustAmount, soId);
			 	     var TrueBalWriteOffAmt= nlapiLookupField('salesorder',soId,'custbody_write_off_adjust_amt'); 
					 if(TrueBalWriteOffAmt=='' || TrueBalWriteOffAmt==null)
					 {
						 TrueBalWriteOffAmt=0;
					 }					
					 //End 
					var consolDepositBalance= nlapiLookupField('customer',soCustmerId,'consoldepositbalance'); 
					if(consolDepositBalance==null || consolDepositBalance=='')
					{
					consolDepositBalance=0;
					}
					var consolUnbilledOrders= nlapiLookupField('customer',soCustmerId,'consolUnbilledOrders');
					if(consolUnbilledOrders==null || consolUnbilledOrders=='')
					{
					consolUnbilledOrders=0;
					}
					var custbody_so_deposit_total =salesObj.getFieldValue('custbody_so_deposit_total');
					var consolidateBalance =salesObj.getFieldValue('consolidatebalance');

					var  totalAmount = 0,totalDiscount=0,discAmount=0,netDiscAmount=0;
					var  taxAmt=0,totalTaxAmt=0,totalShipCost=0,taxrate=0;
					var trueBalanceAmt=0;
					var isTaxable = salesObj.getFieldValue('istaxable'); 
					var taxrate=salesObj.getFieldValue('taxrate')
                    
					var discountRate=salesObj.getFieldValue('discountrate');
					var discountAmount = 0;
                    if(discountRate!=null && discountRate!='' && discountRate.indexOf('%')!=-1)
                    {
                       discountRate=discountRate.replace('%','');
                    }
					else if(discountRate!=null && discountRate!='' && discountRate.indexOf('%')==-1)
					{
						discountAmount = parseFloat(discountRate.replace('-',''));
						discountRate = null;
					}
					nlapiLogExecution("debug","discountRate",discountRate);
					nlapiLogExecution("debug","discountAmount",discountAmount);
					
                    var totalShipCost=0,GrandTot_ShipCost=0;
					GrandTot_ShipCost=salesObj.getFieldValue('shippingcost')
                                        
					var totalDiscount=salesObj.getFieldValue('discounttotal') 
                    var currencyName=salesObj.getFieldValue('currencyname')
                    var currencySymbol=salesObj.getFieldValue('currencysymbol')
                    if(currencySymbol=='USD')
                    {
                        currencySymbol='$';
                    } 
                    else if(currencySymbol=='CAD') 
                    {
                     currencySymbol='CAD';
                    }
                    else if(currencySymbol=='AUD') 
                    {
                     currencySymbol='AUD';
                    }                                    
					var i=0;
					for(i=1; i<=count;i++)
					{						 
						var itemId = salesObj.getLineItemValue('item','item',i);          
						var amount = salesObj.getLineItemValue('item','amount',i);
						var isItemTaxable=salesObj.getLineItemValue('item','istaxable',i);
                        var itemShippingCost=salesObj.getLineItemValue('item','itemshippingcost',i);	  
                        
						if(discountRate!=null && discountRate!='')
                        {
							discountRate=discountRate.replace('-','');
							discAmount= (parseFloat(amount) * parseFloat(discountRate))/100;
                        }
                        netDiscAmount=parseFloat(netDiscAmount) + parseFloat(discAmount);
						nlapiLogExecution("debug","netDiscAmount",netDiscAmount);

                        if(parseFloat(discAmount)>0)
                        {
                            amount =parseFloat(amount)-parseFloat(discAmount)
							nlapiLogExecution("debug","amount - discAmount",amount);
                        }

						totalAmount =parseFloat(totalAmount) + parseFloat(amount);
						if(isTaxable=='T' && isItemTaxable=='T' && parseFloat(taxrate)>0 )
						{
						  taxAmt= (parseFloat(amount) * parseFloat(taxrate))/100;
                                                  totalTaxAmt=parseFloat(totalTaxAmt) + parseFloat(taxAmt);
						}
						
                        if(totalShipCost==0 && GrandTot_ShipCost!=0)  
                        {
                          totalShipCost=GrandTot_ShipCost;
                        }
                        if( parseFloat(totalShipCost)>0 &&  parseFloat(itemShippingCost)>0)
                        {
                            totalShipCost= parseFloat(totalShipCost) + parseFloat(itemShippingCost)
                        }   
							   
					}// end of loop
					if(totalAmount==null || totalAmount=='')
					{
  					  totalAmount=0;
					} 						
					if(totalTaxAmt==null || totalTaxAmt=='')
					{
  					  totalTaxAmt=0;
					}
					if(totalShipCost==null || totalShipCost=='')
					{
  					  totalShipCost=0;
					}
					var trueNetAmt= 0;		   
					trueNetAmt= (parseFloat(totalAmount) - discountAmount + parseFloat(totalTaxAmt) + parseFloat(totalShipCost) ) ;    
					var trueObj=getTrueBalObj(soId,soCustmerId); 
                    var tb_Total= trueObj.total;                   
                    var tb_Payments= trueObj.payments;
                    var tb_depositTotal= trueObj.depositTotal;
                    var tb_refunds= trueObj.refunds;
                    var tb_credit=trueObj.credit;
                    var tb_credit2= trueObj.credit2;
                    var tb_deposit2= trueObj.deposit2;
                    var tb_balance=trueObj.truBal;
					
					trueBalanceAmt = parseFloat(trueNetAmt)+ parseFloat(TrueBalAdjustAmount) + parseFloat(TrueBalWriteOffAmt) - parseFloat(tb_Payments) - parseFloat(tb_depositTotal) + parseFloat(tb_refunds) + parseFloat(tb_credit) - parseFloat(tb_credit2) - parseFloat(tb_deposit2);                    
                                        
					if(trueBalanceAmt != 0)
					{
                        trueBalanceAmt = Math.round(trueBalanceAmt * 100)/100;
                        // trueBalanceAmt =Number(Math.round(trueBalanceAmt +'e2')+'e-2'); // round upto decilmal 2 places (e-2)
						trueBalanceAmt=trueBalanceAmt.toFixed(2);
					}
					nlapiLogExecution("debug", "Event Type : " + soId+ '  ' + type);
					nlapiLogExecution("DEBUG","true Balance Amount: "+ trueBalanceAmt);     
					//Added block to get my A/c Info by Rahul 		
			         if((MyAccount_OrderType==1 ||  MyAccount_OrderType==5) && MyAccount_Status!="Pending Approval")
					 {
						MyAccount_WebInfo="T";						
						nlapiLogExecution("debug","Current value of My Account Web Info is :",MyAccount_WebInfo);
					  }
					  else
					  {						
						 nlapiLogExecution("debug","My Account Web Info field value not updated :",MyAccount_WebInfo);
					  }
			          // End my A/c Info
					if( type=="create"  || type=="edit" || type=="xedit")
					{  
									
                       //salesObj.setFieldValue('custbody_website_truebalance_amt',trueBalanceAmt);    						
					    nlapiSubmitField("salesorder",soId,["custbody_website_truebalance_amt","custbody_website_truebalance_adj_amt","custbody_my_account_info_on_web","custbody_write_off_adjust_amt"], [trueBalanceAmt, TrueBalAdjustAmount, MyAccount_WebInfo,TrueBalWriteOffAmt]);
                    }
                    
			}
			catch(err){
				nlapiLogExecution("error", "Sales Order True Balance Amount Script Error-1", "Error on sales order: " + err.toString())
				//return true
			}
	 
   } 
	nlapiLogExecution("debug", "Last Event Type : " + type);

}
function numberWithCommas(value) {
              if(value==null || value=="" || value=="undefined")
               {
	         return value;
               }
             else
             {
                var  AmtArr="";
                var AmtArr= value.toString().split(".");
                AmtArr[0] = AmtArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                value= AmtArr.join(".");
               return value
            }
}

function getTrueBalObj(orderId,customerId)
{
   
       var returnObj={
            total : null,
            payments : null,  
            depositTotal : null,
            refunds : null,
            credit : null,
            credit2 : null,
            deposit2 : null,
            truBal : null
          }

	var payments = 0.00;
	var deposit_total = 0.00;
	var refunds = 0.00;
	

	//CUSTOMER PAYMENTS
	var filters = [];
	filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
	filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
	var cols = [];
	cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
	var results = nlapiSearchRecord("customerpayment",null,filters,cols);
	if(results)
		payments = results[0].getValue("appliedtoforeignamount",null,"sum");
		
	if(payments==null || payments=="")
		payments = 0.00;
	
	nlapiLogExecution("debug","Customer Payments",payments);
	
	//CUSTOMER REFUNDS
	var deposits = [];
	var filters = [];
	filters.push(new nlobjSearchFilter("salesorder",null,"is",orderId));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("fxamount"));
	var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			deposits.push(results[x].getId());
			deposit_total += parseFloat(results[x].getValue("fxamount"));
		}
			
	}
	
	if(deposits.length > 0)
	{
		var deposit_ids = [];
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",deposits));
		filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
		filters.push(new nlobjSearchFilter("type","applyingtransaction","is","DepAppl"));
		var cols = [];
		cols.push(new nlobjSearchColumn("applyingtransaction"));
		var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
				deposit_ids.push(results[x].getValue("applyingtransaction"));
		}
		
		nlapiLogExecution("debug","Deposit Application ID's",deposit_ids.toString());
		
		if(deposit_ids.length > 0)
		{
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("applyingtransaction",null,"anyof",deposit_ids));
			var cols = [];
			cols.push(new nlobjSearchColumn("applyingforeignamount",null,"sum"));
			var results = nlapiSearchRecord("customerrefund",null,filters,cols);
			if(results)
				refunds = results[0].getValue("applyingforeignamount",null,"sum");
				
			if(refunds==null || refunds=="")
				refunds = 0.00;	
		}
	}
	
	nlapiLogExecution("debug","Customer Refunds",refunds);
	
	//OPEN CREDIT MEMOS
	var credit = 0.00;
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_credit_memo_link_parent",null,"is",orderId));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_credit_memo_link_amount",null,"sum"));
	var results = nlapiSearchRecord("customrecord_credit_memo_link",null,filters,cols);
	if(results)
		credit = results[0].getValue("custrecord_credit_memo_link_amount",null,"sum");
				
	if(credit==null || credit=="")
		credit = 0.00;	
	
	nlapiLogExecution("debug","Credit Memos (Open)",credit);
	
	//APPLIED CREDIT MEMOS
	var credit2 = 0.00;
	var filters = [];
	filters.push(new nlobjSearchFilter("entity",null,"is",customerId));
	filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
	filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","CustInvc"));
	filters.push(new nlobjSearchFilter("status",null,"is","CustCred:B"));
	var cols = [];
	cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
	var results = nlapiSearchRecord("creditmemo",null,filters,cols);
	if(results)
		credit2 = results[0].getValue("appliedtoforeignamount",null,"sum");
				
	if(credit2==null || credit2=="")
		credit2 = 0.00;	
	
	nlapiLogExecution("debug","Credit Memos (Fully Applied)",credit2);
	
	//DEPOSITS WITH SALES ORDER LINK
	var deposit2 = 0.00;
	var filters = [];
	filters.push(new nlobjSearchFilter("entity",null,"is",customerId));
	filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
	filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","CustInvc"));
	filters.push(new nlobjSearchFilter("salesorder","createdfrom","is","@NONE@"));
	var cols = [];
	cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
	var results = nlapiSearchRecord("depositapplication",null,filters,cols);
	if(results)
		deposit2 = results[0].getValue("appliedtoforeignamount",null,"sum");
				
	if(deposit2==null || deposit2=="")
		deposit2 = 0.00;
		
	nlapiLogExecution("debug","Deposits Not Linked to SO",deposit2);
	
	var total = nlapiLookupField("salesorder",orderId,"total");
	nlapiLogExecution("debug","Total",total);
	nlapiLogExecution("debug","Total:"+total+", payments:"+payments+",depositTotal:"+deposit_total+",refunds:"+refunds+",credit:"+credit+",credit2:"+credit2+",deposit2:"+deposit2,orderId);
	var balance = parseFloat(total) - parseFloat(payments) - parseFloat(deposit_total) + parseFloat(refunds) + parseFloat(credit) - parseFloat(credit2) - parseFloat(deposit2);
	
	nlapiLogExecution("debug","Balance",balance);
		
	if(total!=0.00)
		var percent = (total - balance) / total * 100;
	else
		var percent = 100.00;
	
	
	//nlapiLogExecution("debug","% Paid",percent);
	
       returnObj.total=total;
       returnObj.payments=payments;
       returnObj.depositTotal=deposit_total;
       returnObj.refunds=refunds;
       returnObj.credit=credit;
       returnObj.credit2=credit2;
       returnObj.deposit2=deposit2;
       returnObj.truBal=balance;

	return returnObj;
}