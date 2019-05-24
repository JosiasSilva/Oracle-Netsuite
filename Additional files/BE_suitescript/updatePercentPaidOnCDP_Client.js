nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updatePercentPaidOnCDP_Client(type,name)
{
    if(name =="custrecord_diamond_so_order_number")
     {
          var soId =  nlapiGetFieldValue('custrecord_diamond_so_order_number');
          nlapiLogExecution('Debug',"Sales Order Id",soId);
          var  custId=nlapiLookupField('salesorder',soId,'entity');
          nlapiLogExecution('Debug',"Customer Id",custId);
          if(soId == null || soId =='')
          {
            nlapiLogExecution('Debug',"SO Id","Sales Order Id does not exists.");
             return ;
          }
         if(custId == null || custId =='')
         {
           nlapiLogExecution('Debug',"Cust Id","Customer Id does not exists.");
           return ;
         }
	     if((soId != null && soId !='') && (custId !=null && custId !=''))
	    {
         /*
          var websiteBal =  nlapiLookupField('salesorder',soId,'custbody_website_truebalance_amt');
          if(websiteBal==''|| websiteBal==null)
            websiteBal = 0;
          nlapiLogExecution('Debug',"SO Website Balance",websiteBal);
          */
          var trueObj=getTrueBalObj(soId,custId);
          var total= trueObj.total;
          nlapiLogExecution('Debug',"SO Total",total);
          var websiteBal = trueObj.balance;
          nlapiLogExecution('Debug',"SO Website Balance 2",websiteBal);
          if(total != 0)
          {
            var perCdp= (total-websiteBal)/total * 100;
            nlapiLogExecution('Debug',"Per % Cdp",perCdp);
            nlapiSetFieldValue('custrecord_custom_diamond_percent_paid',parseFloat(perCdp).toFixed(2));
          }
	    }
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
            balance : null
          }

	var payments = 0.00;
	var deposit_total = 0.00;
	var refunds = 0.00;
    var total = 0.00;

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
      var currency = nlapiLookupField("salesorder",orderId,"currency");
    /*
     * USA                  1 
     * Canadian Dollar      3
     * Australian Dollar    5
     */ 
      if(currency=="3" || currency=="5")
     {
         total = nlapiLookupField("salesorder",orderId,"fxamount");
     }
     else if(currency=="1")
    {
	     total = nlapiLookupField("salesorder",orderId,"total");
    }
	nlapiLogExecution("debug","Total",total);
	nlapiLogExecution("debug","Total:"+total+", payments:"+payments+",depositTotal:"+deposit_total+",refunds:"+refunds+",credit:"+credit+",credit2:"+credit2+",deposit2:"+deposit2,orderId);

         var TrueBalAdjustAmount = nlapiLookupField('salesorder',orderId,'custbody_website_truebalance_adj_amt'); 
		 nlapiLogExecution('debug','True Bal AdjustAmount 1',TrueBalAdjustAmount);

		 var TrueBalWriteOffAmt =  nlapiLookupField('salesorder',orderId,'custbody_write_off_adjust_amt'); 
		 nlapiLogExecution('debug','True Bal WriteOff Amt 1',TrueBalWriteOffAmt);

        if(TrueBalAdjustAmount=='' || TrueBalAdjustAmount==null)
		{
		  TrueBalAdjustAmount=0;
		}
        if(TrueBalWriteOffAmt=='' || TrueBalWriteOffAmt==null)
		{
		  TrueBalWriteOffAmt=0;
		}

	var balance = parseFloat(total) + parseFloat(TrueBalAdjustAmount)+ parseFloat(TrueBalWriteOffAmt) - parseFloat(payments) - parseFloat(deposit_total) + parseFloat(refunds) + parseFloat(credit) - parseFloat(credit2) - parseFloat(deposit2);

	   nlapiLogExecution("debug","Balance",balance);
       returnObj.total=total;
       returnObj.payments=payments;
       returnObj.depositTotal=deposit_total;
       returnObj.refunds=refunds;
       returnObj.credit=credit;
       returnObj.credit2=credit2;
       returnObj.deposit2=deposit2;
       returnObj.balance=balance;

	   return returnObj;
}