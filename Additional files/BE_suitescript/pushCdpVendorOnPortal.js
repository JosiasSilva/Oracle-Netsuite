nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : pushCdpVendorToPortal.js
 * Created Date  : December 30, 2015
 * Last Modified Date : Jan 16, 2016
 * Comments : Script will push NS CDPID along with SO Items to web portal w.r.t all field mapping conditions 
 * URL: /app/common/scripting/script.nl?id=839&whence=
 */
function PushCdpVendorToPortal(type)
{

    if(type == "create" || type == "edit")
    {
		try
		{
			var vendorId =nlapiGetRecordId();
            nlapiLogExecution('debug',"Vendor Id is : ",vendorId);
			if(vendorId != '' && vendorId != null)
			{
				var cdpArrField=["companyname","entityid","custentity101","custentity4","email","terms","custentity_date_on_portal"];
				var cdpVal = nlapiLookupField("vendor",vendorId,cdpArrField);
				var companyName=cdpVal.companyname;
				var vendorName=cdpVal.entityid;
                var paymentTerms=cdpVal.terms; // on production
				var vendorType=cdpVal.custentity4; // get vendorType=1=> Diamond Supplier
				var vendorEmail=cdpVal.email;
                var dateOnPortal = cdpVal.custentity_date_on_portal;

				if(vendorType=='1' && vendorName!='' && companyName!=''  && paymentTerms!='')
				{
					//Setting up URL of CDP
					var url = "https://testportal.brilliantearth.com/api/vendor/";  //Test portal url
					//var url = "https://partner.brilliantearth.com/api/vendor/";  //production portal url

					//Setting up Headers
					var headers = new Array();
					headers['http'] = '1.1';
					headers['Accept'] = 'application/json';
                    headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; // for Sandbox
					//headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //production portal
					headers['Content-Type'] = 'application/json';
					headers['User-Agent-x'] = 'SuiteScript-Call';

					 //Setting up Datainput
					 var jsonobj = {"vendor_id": parseInt(vendorId),
					 "name": vendorName,
					 "company_name":companyName,
					 "payment_terms":paymentTerms,
					 "vendor_email":vendorEmail,
                     "date_on_portal": dateOnPortal
					  }

					 //Stringifying JSON
					 var myJSONText = JSON.stringify(jsonobj, replacer);
                     nlapiLogExecution('debug','CDP Response Body:', myJSONText);
					 var response = nlapiRequestURL(url, myJSONText, headers);
					 //Below is being used to put a breakpoint in the debugger
					 var htmStr=response.body;
					 if(response.code=='200')
					 {
                           nlapiLogExecution('debug','Successfully Pushed CDP Vendor  Id: ' +vendorId+ ', Email : '+vendorEmail, vendorId);
					 }
                     else
                     {
                           nlapiLogExecution('debug','Vendor name that does not push on portal is : '+vendorName); 
                           nlapiLogExecution('debug','Vendor Id that does not push on portal is : '+vendorId);  
                           nlapiLogExecution('debug','Vendor does not push on portal because : '+htmStr); 
                     }
				}
			} // end check of VendorId
		}
		catch(err)
		{
		   nlapiLogExecution('error','Error occur during Push CDP Vendor to Portal is :', err.message);
		}
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