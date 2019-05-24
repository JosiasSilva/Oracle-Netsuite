nlapiLogExecution("audit","FLOStart",new Date().getTime());
function RefreshAmtAfterCMLRemove(type)
{
  
 
if(type=='view')
 { 
   
   var salesObj=nlapiLoadRecord('salesorder',nlapiGetRecordId ( ));
   var value_check_return=True_Balance_Calculation(salesObj);
	var count=salesObj.getLineItemCount('recmachcustrecord_credit_memo_link_parent');
	if(count>0)
	{
		var field = form.addField("custpage_page_refresh","inlinehtml");
        form.addField("custpage_page_true_balance_page_value","inlinehtml").setDefaultValue(value_check_return[0]); 
		var set_value="<script type='text/javascript'>var setinterval= setInterval(function (){ if (document.readyState === 'complete'){document.getElementById('custbody_website_truebalance_amt_fs_lbl_uir_label').parentNode.getElementsByTagName('span')[2].innerHTML=nlapiGetFieldValue('custpage_page_true_balance_page_value') ;  var i=1;var value_change=0;var change_done=false; do{var tbl=document.getElementById('recmachcustrecord_credit_memo_link_parentrow'+value_change);if(tbl){var cells= tbl.getElementsByTagName('td')[4];if(cells.innerHTML.indexOf('recmachcustrecord_credit_memo_link_parent_remove_record_update')==-1){ cells.innerHTML=cells.innerHTML.replace('recmachcustrecord_credit_memo_link_parent_remove_record','recmachcustrecord_credit_memo_link_parent_remove_record_update');value_change=value_change+1;change_done=true;}}else{ i=0;}}while(i>0); if(change_done){;clearInterval(setinterval);}}}, 1000); function recmachcustrecord_credit_memo_link_parent_remove_record_update(id){var recordid = document.forms['main_form'].elements['id'].value;document.getElementById('server_commands').src='/app/common/custom/attachrecord.nl?id='+id+'&custfield=CUSTRECORD_CREDIT_MEMO_LINK_PARENT&machine=recmachcustrecord_credit_memo_link_parent&recordid='+recordid+'&action=remove';location.reload();}  </script>";
		field.setDefaultValue(set_value);
	}
else
{
        var field = form.addField("custpage_page_refresh","inlinehtml");
        form.addField("custpage_page_true_balance_page_value","inlinehtml").setDefaultValue(value_check_return[0]); 
		var set_value="<script type='text/javascript'>var setinterval= setInterval(function (){ if (document.readyState === 'complete'){document.getElementById('custbody_website_truebalance_amt_fs_lbl_uir_label').parentNode.getElementsByTagName('span')[2].innerHTML=nlapiGetFieldValue('custpage_page_true_balance_page_value') ;clearInterval(setinterval);}}, 1000);</script>";
		field.setDefaultValue(set_value);
}
}
}
function True_Balance_Calculation(salesObj)
{
        soId=nlapiGetRecordId ( );
		var  totalAmount = 0,totalDiscount=0,discAmount=0,netDiscAmount=0;
		var  taxAmt=0,totalTaxAmt=0,totalShipCost=0,taxrate=0;
		var trueBalanceAmt=0;
		var isTaxable = salesObj.getFieldValue('istaxable'); 
		var taxrate=salesObj.getFieldValue('taxrate')
		var discountRate=salesObj.getFieldValue('discountrate')
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
		GrandTot_ShipCost=salesObj.getFieldValue('shippingcost');   	
		
		totalAmount = salesObj.getFieldValue("subtotal");
		nlapiLogExecution("debug","totalAmount",totalAmount);
		
		totalTaxAmt = salesObj.getFieldValue("taxtotal");
		nlapiLogExecution("debug","totalTaxAmt",totalTaxAmt);
		
		discountAmount = salesObj.getFieldValue("discounttotal");
		nlapiLogExecution("debug","discountAmount",discountAmount);
		
		totalShipCost = salesObj.getFieldValue("altshippingcost");
		nlapiLogExecution("debug","totalShipCost",totalShipCost);

		if(!totalAmount){totalAmount=0;}			
		if(!totalTaxAmt){totalTaxAmt=0;}
		if(!totalShipCost){totalShipCost=0;}
		var trueNetAmt= 0;		   
		trueNetAmt= (parseFloat(totalAmount) - discountAmount + parseFloat(totalTaxAmt) + parseFloat(totalShipCost) ) ;    
		var trueObj=getTrueBalObj(soId,salesObj.getFieldValue('entity'));              
		var tb_Payments= trueObj.payments;
		var tb_depositTotal= trueObj.depositTotal;
		var tb_refunds= trueObj.refunds;
		var tb_credit=trueObj.credit;
		var tb_credit2= trueObj.credit2;
		var tb_deposit2= trueObj.deposit2;
		var TrueBalAdjustAmount= salesObj.getFieldValue('custbody_website_truebalance_adj_amt');
		if(!TrueBalAdjustAmount){ TrueBalAdjustAmount=0;}
		var TrueBalWriteOffAmt= salesObj.getFieldValue('custbody_write_off_adjust_amt');
		if(TrueBalWriteOffAmt=='' || TrueBalWriteOffAmt==null)
		{
		  TrueBalWriteOffAmt=0;
		}
		trueBalanceAmt = parseFloat(trueNetAmt)+ parseFloat(TrueBalAdjustAmount)+ parseFloat(TrueBalWriteOffAmt) - parseFloat(tb_Payments) - parseFloat(tb_depositTotal) + parseFloat(tb_refunds) + parseFloat(tb_credit) - parseFloat(tb_credit2) - parseFloat(tb_deposit2);

			trueBalanceAmt = Math.round(trueBalanceAmt * 100)/100;
			trueBalanceAmt=trueBalanceAmt.toFixed(2);
		    nlapiLogExecution('debug','True Bal Amt',trueBalanceAmt);

            nlapiSubmitField("salesorder",soId,["custbody_website_truebalance_amt","custbody_website_truebalance_adj_amt","custbody_write_off_adjust_amt"], [trueBalanceAmt, TrueBalAdjustAmount,TrueBalWriteOffAmt]);
                   return [trueBalanceAmt, TrueBalAdjustAmount];

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




