nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PushNS_To_Portal_Vendor_Record()
{
		try
		{
			var vendorId = nlapiGetRecordId(); 
           // nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId );

			if (vendorId=='' || vendorId == null)
			{
				nlapiLogExecution('debug','Vendor not found:'+vendorId , vendorId );
				return;
			}
			
			var vendorArrField=["companyname","entityid","email","custentity4"];
            var vendorVal = nlapiLookupField("vendor",vendorId,vendorArrField);
		    var name= vendorVal.entityid;
			var company_name = vendorVal.companyname;
			var vendor_email = vendorVal.email;
			var vendorType = vendorVal.custentity4;
			if(vendorType == 6) //Production vendor/jeweler
			{
				var objJSON = 
				{
				  "vendor_id" : vendorId,"company_name": company_name ,"name":name, "vendor_email" :vendor_email,"script_id" : "932"
				} ;
				var url = "https://testportal.brilliantearth.com/api/production/vendor/";    
				
							//Setting up Headers 
				var headers = new Array(); 
				
				headers['http'] = '1.1';    
				headers['Accept'] = 'application/json';       
				headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';
				headers['Content-Type'] = 'application/json'; 
				headers['User-Agent-x'] = 'SuiteScript-Call';
								 
				var myJSONText = JSON.stringify(objJSON, replacer); 
				var response = nlapiRequestURL(url, myJSONText, headers); 
				if(response.code=='200')
				{			
					nlapiLogExecution('debug','Vendor sync sucess for vendor id:'+ vendorId, 'Successfully pushed' ); 				
				}
				else
				{   
					nlapiLogExecution('debug','Vendor sync error for vendor id:'+ vendorId, response.body ); 	
				}
			}
			else
			{
				nlapiLogExecution('debug','This vendor is not valid for production portal'); 	
			}
		}
		catch(err)
		{
			nlapiLogExecution('error','Error occur during Push Vendor to Portal is :', err.message);
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
