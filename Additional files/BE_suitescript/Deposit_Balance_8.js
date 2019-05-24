nlapiLogExecution("audit","FLOStart",new Date().getTime());
//BEFORE LOAD
function Deposit_Balance_Before_Load(type)
{
	if(type=="create" || type=="edit" || type=="copy" || type=="view")
	{
		try{
			//Get customer ID
			var customer = nlapiGetFieldValue("entity")	
		}
		catch(err){
			nlapiLogExecution("error", "Sales Order Balance Script Error", "An error occurred while getting customer ID. Details: " + err.message)
			return true
		}
		
		
		if(IsEmpty(customer) != "")
		{
			try{
				//Lookup information on customer record
				var lookupFields = new Array()
				lookupFields[0] = "depositbalance"
				lookupFields[1] = "balance"
				lookupFields[2] = "consolbalance";
				var customer_fields = nlapiLookupField("customer", customer, lookupFields)
				
				var depositBalance = nlapiGetFieldValue("custbody_so_deposit_total");
				if(depositBalance==null || depositBalance=="")
					depositBalance = 0.00;
					
				var soBalance = nlapiGetFieldValue("custbody_so_balance");
				if(soBalance==null || soBalance=="")
					soBalance = 0.00;
			}
			catch(err){
				nlapiLogExecution("error", "Sales Order Balance Script Error", "Error while looking up customer fields on sales order. Details: " + err.message)
				return true
			}
			
			try{
				//Set deposit balance field
				if (IsEmpty(customer_fields["depositbalance"]) == "" || customer_fields["depositbalance"] == 0) {
					//Set field to default value is customer has 0 or no deposit balance
					var fieldStr = "<p>Deposit Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
				else {
					//Set field to customer deposit balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: lightpink; font-weight: bold;'>Deposit Balance: $" + addCommas(customer_fields["depositbalance"]) + "</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
			} 
			catch (err) {
				nlapiLogExecution("error", "Sales Order Balance Script Error", "An error occurred while setting deposit balance field on Sales Order. Details: " + err.message)
				return true
			}
			
			try{
				//Set customer balance field
				if(IsEmpty(customer_fields["balance"]) == "" || customer_fields["balance"] == 0){
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Balance: $0.00</p>"
				}
				else {
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p>Balance: $" + addCommas(customer_fields["balance"]) + "</p>"
				}
				
				if(IsEmpty(soBalance) == "" || soBalance == 0){
					//Set field to default value is customer has 0 or no balance
					fieldStr+= "<p>New Balance: $0.00</p>"
				}
				else {
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					fieldStr+= "<p>New Balance: $" + addCommas(soBalance) + "</p>"
					
				}
				
				nlapiSetFieldValue("custbody_customer_balance", fieldStr)
				
				//Set customer consolidated balance fields
				if(IsEmpty(customer_fields["consolbalance"]) == "" || customer_fields["consolbalance"] == 0){
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Consolidated Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
				}
				else {
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p>Consolidated Balance: $" + addCommas(customer_fields["consolbalance"]) + "</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
				}
				
				//Set "true balance" fields
				if(type=="create")
				{
					var fieldStr = "<p>True Balance: $0.00</p>";
					nlapiSetFieldValue("custbody_true_balance", fieldStr);
					return true;
				}
				
				var payments = 0.00;
				var deposit_total = 0.00;
				var refunds = 0.00;
				
				//CUSTOMER PAYMENTS
				var filters = [];
				filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
				filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",nlapiGetRecordId()));
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
				filters.push(new nlobjSearchFilter("salesorder",null,"is",nlapiGetRecordId()));
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
				filters.push(new nlobjSearchFilter("custrecord_credit_memo_link_parent",null,"is",nlapiGetRecordId()));
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
				filters.push(new nlobjSearchFilter("entity",null,"is",nlapiGetFieldValue("entity")));
				filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",nlapiGetRecordId()));
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
				filters.push(new nlobjSearchFilter("entity",null,"is",nlapiGetFieldValue("entity")));
				filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",nlapiGetRecordId()));
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
					
				var balance = parseFloat(nlapiGetFieldValue("total")) - parseFloat(payments) - parseFloat(deposit_total) + parseFloat(refunds) + parseFloat(credit) - parseFloat(credit2) - parseFloat(deposit2);
				
				nlapiLogExecution("debug","Balance",balance);
				
				if(balance <= 0 ){
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>True Balance: $" + addCommas(nlapiFormatCurrency(balance)) + "</p>"
					nlapiSetFieldValue("custbody_true_balance", fieldStr)
				}
				else {
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: lawngreen; font-weight: bold;'>True Balance: $" + addCommas(nlapiFormatCurrency(balance)) + "</p>"
					nlapiSetFieldValue("custbody_true_balance", fieldStr)
				}
			}
			catch(err){
				nlapiLogExecution("error", "Sales Order Balance Script Error", "An error occurred while setting customer balance field on Sales Order. Details: " + err.message)
				return true
			}
		}
	}
}

//POST SOURCING
function Deposit_Balance_Post_Sourcing(type, name)
{
	if(name=="entity")
	{
		try{
			//Get customer ID
			var customer = nlapiGetFieldValue("entity")
			var customer_balance_new = nlapiGetFieldValue("custbody_so_balance");	
		}
		catch(err){
			alert("Error getting customer ID. Details: " + err.message)
			return true
		}
		
		try{
			//Set deposit balance field
			if(IsEmpty(customer)!="")
			{
				var deposit_balance = nlapiLookupField("customer", customer, "depositbalance")
				if(IsEmpty(deposit_balance)=="" || deposit_balance == 0)
				{
					//Set field to default value is customer has 0 or no deposit balance
					var fieldStr = "<p>Deposit Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
				else
				{
					//Set field to customer deposit balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: lightpink; font-weight: bold;'>Deposit Balance: $" + addCommas(deposit_balance) + "</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
			}
			else{
				//Set field to default value is customer has 0 or no deposit balance
				var fieldStr = "<p style='padding-left: 40px;'>Deposit Balance: $0.00</p>"
				nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
			}	
		}
		catch(err){
			alert("Error setting customer deposit balance field (custbody_deposit_balance). Details: " + err.message)
			return true
		}
		
		try{
			//Set customer balance field
			if(IsEmpty(customer)!="")
			{
				var customer_balance = nlapiLookupField("customer", customer, "balance")
				if(IsEmpty(customer_balance)=="" || customer_balance == 0)
				{
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Balance: $0.00</p>"
				}
				else
				{
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: lawngreen; font-weight: bold;'>Balance: $" + addCommas(customer_balance) + "</p>"					
				}
				if(IsEmpty(customer_balance_new)=="" || customer_balance_new == 0)
				{
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>New Balance: $0.00</p>"
				}
				else
				{
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: yellow; font-weight: bold;'>New Balance: $" + addCommas(customer_balance_new) + "</p>"
				}
				
				nlapiSetFieldValue("custbody_customer_balance", fieldStr)
			}
			else{
				//Set field to default value is customer has 0 or no balance
				var fieldStr = "<p style='padding-left: 40px;'>Balance: $0.00</p>"
				nlapiSetFieldValue("custbody_customer_balance", fieldStr)
			}	
		}
		catch(err){
			alert("Error setting customer balance field (custbody_customer_balance). Details: " + err.message)
			return true
		}
		
		try{
			//Set customer consolidated balance field
			if(IsEmpty(customer)!="")
			{
				var customer_balance = nlapiLookupField("customer", customer, "consolbalance")
				if(IsEmpty(customer_balance)=="" || customer_balance == 0)
				{
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Consolidated Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
				}
				else
				{
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: lawngreen; font-weight: bold;'>Consolidated Balance: $" + addCommas(customer_balance) + "</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
				}
			}
			else{
				//Set field to default value is customer has 0 or no balance
				var fieldStr = "<p style='padding-left: 40px;'>Consolidated Balance: $0.00</p>"
				nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
			}	
		}
		catch(err){
			alert("Error setting customer balance field (custbody_customer_consolbalance). Details: " + err.message)
			return true
		}	
	}
}

function IsEmpty(value)
{
	if(value==null)
		return ""
	else
		return value
}

function addCommas(value)
{
	if(value==null || value=="" || value=="undefined")
		return value
	
	value += ""
	x = value.split(".")
	x1 = x[0]
	x2 = x.length > 1 ? "." + x[1] : ""
	var rgx = /(\d+)(\d{3})/
	while(rgx.test(x1))
		x1 = x1.replace(rgx, "$1" + "," + "$2")
	
	return x1 + x2
}

function padZeros(value)
{
	if(value==null || value=="" || value=="undefined")
	{
		if(/\d/.test(value))
			return "0.00"
		else
			return value
	}
	
	var j = value.split(".")
	if(j.length == 1)
		return value + ".00"
	else if(j[1].length < 2)
		return value + "0"
	else
		return value
}
