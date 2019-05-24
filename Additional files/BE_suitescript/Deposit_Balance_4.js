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
				//Lookup information on sales order
				var depositBalance = nlapiGetFieldValue("custbody_so_deposit_total");
				var soBalance = nlapiGetFieldValue("custbody_so_balance");
				
				var lookupFields = new Array()
				lookupFields[0] = "depositbalance"
				lookupFields[1] = "balance"
				lookupFields[2] = "consolbalance";
				var customer_fields = nlapiLookupField("customer", customer, lookupFields)
			}
			catch(err){
				nlapiLogExecution("error", "Sales Order Balance Script Error", "Error while looking up customer fields on sales order. Details: " + err.message)
				return true
			}
			
			try{
				//Set deposit balance field
				if (IsEmpty(depositBalance) == "" || depositBalance == 0) {
					//Set field to default value is customer has 0 or no deposit balance
					var fieldStr = "<p>Deposit Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
				else {
					//Set field to customer deposit balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p '>Deposit Balance: $" + addCommas(depositBalance) + "</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
			} 
			catch (err) {
				nlapiLogExecution("error", "Sales Order Balance Script Error", "An error occurred while setting deposit balance field on Sales Order. Details: " + err.message)
				return true
			}
			
			try{
				//Set customer balance field
				if(IsEmpty(soBalance) == "" || soBalance == 0){
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_customer_balance", fieldStr)
				}
				else {
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: yellow; font-weight: bold;'>Balance: $" + addCommas(soBalance) + "</p>"
					nlapiSetFieldValue("custbody_customer_balance", fieldStr)
				}
				
				//Set customer consolidated balance fields
				if(IsEmpty(soBalance) == "" || soBalance == 0){
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Consolidated Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
				}
				else {
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: yellow; font-weight: bold;'>Consolidated Balance: $" + addCommas(soBalance) + "</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
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
		}
		catch(err){
			alert("Error getting customer ID. Details: " + err.message)
			return true
		}
		
		try{
			//Set deposit balance field
			if(IsEmpty(customer)!="")
			{
				var deposit_balance = nlapiGetFieldValue("custbody_so_deposit_total");
				if(IsEmpty(deposit_balance)=="" || deposit_balance == 0)
				{
					//Set field to default value is customer has 0 or no deposit balance
					var fieldStr = "<p>Deposit Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_deposit_balance", fieldStr)
				}
				else
				{
					//Set field to customer deposit balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: yellow; font-weight: bold;'>Deposit Balance: $" + addCommas(deposit_balance) + "</p>"
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
				var customer_balance = nlapiGetFieldValue("custbody_so_balance");
				if(IsEmpty(customer_balance)=="" || customer_balance == 0)
				{
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_customer_balance", fieldStr)
				}
				else
				{
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: yellow; font-weight: bold;'>Balance: $" + addCommas(customer_balance) + "</p>"
					nlapiSetFieldValue("custbody_customer_balance", fieldStr)
				}
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
				var customer_balance = nlapiGetFieldValue("custbody_so_balance");
				if(IsEmpty(customer_balance)=="" || customer_balance == 0)
				{
					//Set field to default value is customer has 0 or no balance
					var fieldStr = "<p>Consolidated Balance: $0.00</p>"
					nlapiSetFieldValue("custbody_customer_consolbalance", fieldStr)
				}
				else
				{
					//Set field to customer balance if > $0.00 and highlight in yellow and bold text
					var fieldStr = "<p style='background-color: yellow; font-weight: bold;'>Consolidated Balance: $" + addCommas(customer_balance) + "</p>"
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
