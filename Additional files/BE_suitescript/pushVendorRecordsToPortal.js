/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : pushVendorRecordsToPortal.js
 * Created Date  : December 29, 2015
 * Last Modified Date : December 29, 2015
 * Comments : Script will push NS CDP Vendors Record to web portal link "https://partner.brilliantearth.com/api/vendor/"
 * Sandbox URL: https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=812&whence=
 * Production URL: https://system.netsuite.com/app/common/scripting/script.nl?id=829&whence=
 */
 
function pushVendorsRecordToPortal()
{
	try
	{
	 var results = null;	
	  var retObj = [];    	
	  var searchResult = new Array();
	  // Loading the Given saved search of Diamond & Gemstone Vendors
	  var searchObj = nlapiLoadSearch(null, 'customsearch1098');
	  // Running the Saved Search
	  var searchResultSet = searchObj.runSearch();
	  // Getting the All Results into one Array.
	  var vendorIdArr=new Array();
	  var searchId = 0;
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
		 var serchCount=resultslice.length;
		 // Checking whether Searchresult Array is null or not
		   var vendIdArr = new Array();
		 if (searchResult != null && searchResult != '') 
		 {
			nlapiLogExecution('debug', 'Length of Search result is ',searchResult.length);
			var columns = searchResult[0].getAllColumns();
			//var k=0;
		   
		var count =0;
		// Getting the All Vendor internal id's
			   var duplicateVendorId = 0;
		for ( var i = 0; i < searchResult.length; i++) 
			{
				
			 vendorIdArr[vendorIdArr.length] = searchResult[i].getId();
			 var vendorFieldArr = ["entityid","companyname","custentity101","custentity4"];
			 var vendorFieldVal = nlapiLookupField("vendor",vendorIdArr[i],vendorFieldArr);
			 if(vendorFieldVal.custentity4 == '1')
			 {
					   if(duplicateVendorId !=searchResult[i].getId())
					   {
						 vendIdArr.push(searchResult[i].getId());                   
						 count =count + 1;
					   } 
				 }
				duplicateVendorId =searchResult[i].getId();
			  }
		   
		   cdpVendorCount=vendIdArr.length;
		   for(k=0;k<cdpVendorCount;k++)
		   {
			 var cdpVendorId=vendIdArr[k];
			 pushCdpVendorDataNS2Portal(cdpVendorId);
		   }
		  //var k=0;
		 }
	}
	 catch(err)
	 {
		  nlapiLogExecution("debug","Error iDetails :",err.message); 
	 }
}
 
function pushCdpVendorDataNS2Portal(vendorId)
{   

 if(vendorId != '' && vendorId !=null)
 {
    var cdpArrField=["companyname","entityid","custentity101","email"];
    var cdpVal = nlapiLookupField("vendor",vendorId,cdpArrField);
    var companyName=cdpVal.companyname;
    var vendorName=cdpVal.entityid;
    var paymentTerms=cdpVal.custentity101;
    var vendorEmail=cdpVal.email;
    if(vendorId!='' && vendorName!='' && companyName!=''  && paymentTerms!='') 
    {
         //Setting up URL of CDP             
        // var url = "https://testportal.brilliantearth.com/api/vendor/"; db9a136f31d2261b7f626bdd76ee7ffb44b00542    
        var url = "https://partner.brilliantearth.com/api/vendor/";     
        
        //Setting up Headers 
         var headers = new Array(); 
        headers['http'] = '1.1';    
        headers['Accept'] = 'application/json';       
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
        headers['Content-Type'] = 'application/json'; 
        headers['User-Agent-x'] = 'SuiteScript-Call';
                
         //Setting up Datainput
         var jsonobj = {"vendor_id": parseInt(vendorId),      
         "name": vendorName,
         "company_name":companyName,
         "payment_terms":paymentTerms,
        "vendor_email":vendorEmail
          }
                
         //Stringifying JSON
         var myJSONText = JSON.stringify(jsonobj, replacer); 
         var response = nlapiRequestURL(url, myJSONText, headers);    
         //Below is being used to put a breakpoint in the debugger
        var htmStr=response.body;
         if(response.code=='200')
         {           
            nlapiLogExecution('debug','Successfully Pushed CDP Vendor  Id: '+vendorId+', Email: '+vendorEmail, vendorId);
         } 
    }
   } // end check of VendorId
}

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
        return String(value);
   }
   return value;
}