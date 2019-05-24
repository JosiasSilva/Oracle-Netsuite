/** 
 * Script Author : Ajay kumar (ajay@inoday.com)
 * Author Desig. : Sr. Developer, inoday Consultancy Services Pvt. Ltd.
 * Script Type   : Scheduler
 * Script Name   : PushCDPRecordWithPaymentToPortal.js
 * Created Date  : December 31, 2015
 * Last Modified Date : January 28, 2016
 * Comments : Script will push NS CDP Record with payment to web portal link "https://testportal.brilliantearth.com/api/order-notify/"
 * //URL: https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=809&whence=
 */
function PushCDPRecordWithPaymentToPortal()
{ 
	try
	{
		var results = null; var retObj = [];      
		var searchResult = new Array();
		// Loading the Given saved search of Custom Diamond    
		var searchObj = nlapiLoadSearch(null, 'customsearch3661_2');
		// Running the Saved Search
		var searchResultSet = searchObj.runSearch();
		// Getting the All Results into one Array.
		var searchId = 0;
		var cdpIdArr=new Array();
		do {
	   var resultslice = searchResultSet.getResults(searchId,searchId + 1000);
	   if (resultslice != null && resultslice != '')
	   {
		  for ( var rs in resultslice) 
		  {
		   searchResult.push(resultslice[rs]);
		   searchId++;
		  }
		}
		 
		 } while (resultslice.length >= 1000);
		var searchCount=resultslice.length ;
		// Checking whether Search Result Array is null or not
		if (searchResult != null && searchResult != '') 
		{
			nlapiLogExecution('debug', 'Length of Search result is',searchResult.length);
		 var columns = searchResult[0].getAllColumns();
		 // Used to store the CDP Internal id's and it's numbers     
		 var duplicateCdpId = 0;
		 var count =0; var assetAcct = 0;
		 // Getting the All CDP Internal id's
		 for ( var i = 0; i < searchResult.length; i++) 
		 {    
			var cdp_Id= searchResult[i].getId();  
			if(cdp_Id!=duplicateCdpId) 
			{     
		              cdpIdArr.push(cdp_Id);   
			} 
		       duplicateCdpId =cdp_Id; 
		}

	           nlapiLogExecution("debug","Total CDP Count :",count);        
	}
	  
	   var totCdpCount=cdpIdArr.length;
	   for (var k=0;k<totCdpCount;k++)
	   {
			var CId=cdpIdArr[k];
			PushPaymentToPortal(CId);
	   }
			
	  }
	 catch(err)
	 {
	  nlapiLogExecution("debug","Error occur during getting cdpid list is :",err.message); 
	 }
 }
 
 
    function PushPaymentToPortal(cdpId)
    {			
		//Setting up URL of CDP payment 
		//var url = https://partner.brilliantearth.com/api/order-notify/;          
		//var url = "https://testportal.brilliantearth.com/api/order-notify/"; 
        //var headers['Authorization'] = 'token d499ecd8233123cacd3c5868939fe167b7bf0837';		
		//Setting up Headers 
		//var headers = {"User-Agent-x": "SuiteScript-Call","Authorization": "Token db9a136f31d2261b7f626bdd76ee7ffb44b00542","Content-Type": "application/json", "Accept": "application/json"};
		
		//Setting up URL of CDP payment 
		var url = "https://partner.brilliantearth.com/api/order-notify/";
		var headers = {"User-Agent-x": "SuiteScript-Call","Authorization": "token d499ecd8233123cacd3c5868939fe167b7bf0837","Content-Type": "application/json", "Accept": "application/json"};
					
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
                        SendMailToVendor(cdpId);			
		}
		else 
		{
			var responsebody = JSON.parse(response.getBody()) ;
			var retData = responsebody['action_needed'];
			nlapiLogExecution('debug','CDP Id does not exists on portal.The CDP Id is :', cdpId);        
		}		
    }

    function replacer(key, value)
    {
	    if (typeof value == "number" && !isFinite(value))
	    {
			return String(value);
	    }
	   return value;
    }
	
     

       function SendMailToVendor(cdpId)
	{
	        var vendorId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_vendor");
		var billId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_created_bill_no");      
				
		if(billId != null && billId != '')
		{		
			var billObj = nlapiLoadRecord("vendorbill",billId);
			var amount = billObj.getFieldValue("usertotal");
			var invoice_num = billObj.getFieldValue("custbody_portal_invoice_number");
			var billDate = billObj.getFieldValue("trandate");
			var vendorName = billObj.getFieldText("entity");			
			var email = nlapiLookupField("vendor",vendorId,"email");
			if(email != null && email != '')
			{
			    SendMail(invoice_num,amount,billDate,vendorName,email);
			}
		}        	
	}
	
	function SendMail(invoice_num,amount,date,vendorName,email)
       {	    
                var subject = "Bill Payment Summary";                	
	        var body = '<table>';
		body += '<tr><td><b>Vendor Name : </b></td><td>'+vendorName+'</td></tr>';
		body += '<tr><td><b>Bill Payment Date : </b></td><td>'+date+'</td></tr>';
		body += '<tr><td><b>Bill Payment Amount : </b></td><td>'+amount+'</td></tr>';
		body += '<tr><td><b>Invoice Number : </b></td><td>'+invoice_num+'</td></tr>';		
		body += '</table>';
                
		nlapiSendEmail( -5, email, subject, '<html><body style="font-family:Verdana">'+body+'</body></html>',null,null,null,null );
		nlapiLogExecution('debug','Email has been sent to vendor :', email);		
    }	
	
	
	