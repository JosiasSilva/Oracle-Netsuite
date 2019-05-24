nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PushPayment_Notification_To_Portal()
{
	try
	{
		var filters = [];
			filters[0] = nlobjSearchFilter("custbody_bill_confirmation",null,'is',2);
			//filters[1] = nlobjSearchFilter("customform",null,'is',126);
		var searchRecords = nlapiSearchRecord("vendorpayment",null,filters,null);
		var duplicateId = 0;
		if(searchRecords != null && searchRecords != "")
		{   
			for(var i=0; i< searchRecords.length; i++)
			{
			    if(searchRecords[i].getId() != duplicateId)
			    {
					duplicateId = searchRecords[i].getId();
				    GetBillPayment(searchRecords[i].getId());				    
			    }
			}   
		}
	}
	catch(err)
	{
	   nlapiLogExecution("debug","Error occur during scheduled execution of Payment API is : ",err.message);
	}
}

function GetBillPayment(billPaymentId)
{
    var billPaymentObj = nlapiLoadRecord("vendorpayment",billPaymentId);
    var count = billPaymentObj.getLineItemCount("apply");
    if( count > 0)
    {
        for(var i=1; i <= count; i++)
        {
			var vendorbillId = billPaymentObj.getLineItemValue("apply","internalid",i);
			var type = billPaymentObj.getLineItemValue("apply","type",i);
                        var apply = billPaymentObj.getLineItemValue("apply","apply",i);
			if( type == "Bill" && apply == 'T')
			{
				GetVendorBillItem(vendorbillId,billPaymentId);
			}
        }
    }
}

function GetVendorBillItem(billId,billPaymentId)
{
        var billObj = nlapiLoadRecord("vendorbill",billId);
	var amount = billObj.getFieldValue("usertotal");
	//var invoiceNum = billObj.getFieldValue("custbody_portal_invoice_number");  
        var invoiceNum = billObj.getFieldValue("tranid");
	var billDate = billObj.getFieldValue("trandate");
	var vendorId = billObj.getFieldValue("entity");
	var vendorName = billObj.getFieldText("entity");			
	var email = nlapiLookupField("vendor",vendorId,"email");
		
	var count = billObj.getLineItemCount("item");
	if(count > 0)
	{
		for(var i=1; i <= count; i++)
		{
			var itemId = billObj.getLineItemValue("item","item",i);
			var vendorStockNo = billObj.getLineItemValue("item","vendorname",i);
			var itemType = billObj.getLineItemValue("item","itemtype",i);
			if(itemType == "InvtPart")
			{
				GetCdpId(itemId,vendorStockNo,amount,invoiceNum,billDate,vendorName,email,billPaymentId);
			}
		}
	}
}

function GetCdpId(itemId,vendorStockNo,amount,invoiceNum,billDate,vendorName,email,billPaymentId)
{
    var filters = [];
        filters[0] = nlobjSearchFilter("custrecord_be_diamond_stock_number",null,'is',itemId);
        //filters[1] = nlobjSearchFilter("custrecord_vendor_stock_number",null,'is',vendorStockNo);
   
    var searchRecords = nlapiSearchRecord("customrecord_custom_diamond",null,filters,null);
    if(searchRecords != null && searchRecords != "")
    {
        var cdpId = searchRecords[0].getId();
        PushPaymentToPortal(cdpId,amount,invoiceNum,billDate,vendorName,email,billPaymentId);	  
    }
}

//Start function of ns payment to portal
function PushPaymentToPortal(cdpId,amount,invoiceNum,billDate,vendorName,email,billPaymentId)
{			
	//Setting up URL of CDP payment 
	//var url = "https://partner.brilliantearth.com/api/order-notify/";
	//var headers = {"User-Agent-x": "SuiteScript-Call","Authorization": "token d499ecd8233123cacd3c5868939fe167b7bf0837","Content-Type": "application/json", "Accept": "application/json"};
	
	//Setting up URL of CDP payment 
	var url = "https://testportal.brilliantearth.com/api/order-notify/"; 
	var headers = {"User-Agent-x": "SuiteScript-Call","Authorization": "Token db9a136f31d2261b7f626bdd76ee7ffb44b00542","Content-Type": "application/json", "Accept": "application/json"};
	
	//Setting up Datainput
	var jsonobj = {"cdp_id": cdpId}
			
	//Stringifying JSON
	var myJSONText = JSON.stringify(jsonobj, replacer); 
	var response = nlapiRequestURL(url, myJSONText, headers, "POST");    
	
	//Below is being used to put a breakpoint in the debugger		  
	if(response.code=='200')
	{
		var responsebody = JSON.parse(response.getBody()) ;
		var retData = responsebody['action_needed'];
		
		nlapiSubmitField('customrecord_custom_diamond',cdpId,'custrecord_action_needed', retData);       
		nlapiLogExecution('debug','Successfully Push On Vendor Portal for CDP and get action_needed value is :'+retData);
		if(email != null && email != "")
		{
			 SendMailToVendor(amount,invoiceNum,billDate,vendorName,email);
                         if(nlapiLookupField('vendorpayment',billPaymentId,'custbody_bill_confirmation') != 3)
			 {
				nlapiSubmitField('vendorpayment',billPaymentId,'custbody_bill_confirmation', 3);			
			 }
		}		
	}
	else 
	{
		//var responsebody = JSON.parse(response.getBody()) ;
		//var retData = responsebody['action_needed'];
		nlapiLogExecution('debug',' Get response to push CdpId on portal is :', response.body);        
		nlapiLogExecution('debug',' CdpId which does not exist on portal is :', cdpId);
	}		
}    	

function SendMailToVendor(amount,invoiceNum,billDate,vendorName,email)
{	    
	var subject = "Bill Payment Summary";                	
	var body = '<table>';
	body += '<tr><td><b>Vendor Name : </b></td><td>'+vendorName+'</td></tr>';
	body += '<tr><td><b>Bill Payment Date : </b></td><td>'+billDate+'</td></tr>';
	body += '<tr><td><b>Bill Payment Amount : </b></td><td>'+amount+'</td></tr>';
	body += '<tr><td><b>Invoice Number : </b></td><td>'+invoiceNum+'</td></tr>';		
	body += '</table>';
			
	nlapiSendEmail( 660195, email, subject, '<html><body style="font-family:Verdana">'+body+'</body></html>',null,null,null,null );
	nlapiLogExecution('debug','Email has been sent to vendor of email id is :', email);		
}

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}


