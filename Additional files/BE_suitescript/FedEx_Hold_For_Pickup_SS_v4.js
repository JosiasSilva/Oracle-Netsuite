function FedEx_Hold_for_Pickup_Validation()
{
	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_xml");
	
	var cols = [];
	cols.push(new nlobjSearchColumn("custbody_fedex_std_addr_1"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_addr_2"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_city"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_state"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_zip_code"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_country"));
	
	var orderID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_order_id");
	if(orderID!=null && orderID!="")
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",orderID));
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		nlapiLogExecution("debug","Using order internal ID: " + orderID);
		
		var results = nlapiSearchRecord("salesorder",null,filters,cols);
	}
	else
	{
		var results = nlapiSearchRecord("salesorder","customsearch_validate_fedex_hold_for_pu",null,cols);
	}
	
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try
			{
				checkGovernance();
			
				var locationType = null;
				
				var shipValidateObject = {
					address1 : results[x].getValue("custbody_fedex_std_addr_1"),
					address2 : results[x].getValue("custbody_fedex_std_addr_2"),
					city : results[x].getValue("custbody_fedex_std_city"),
					state : results[x].getValue("custbody_fedex_std_state"),
					zip : results[x].getValue("custbody_fedex_std_zip_code"),
					country : results[x].getValue("custbody_fedex_std_country")				
				};
				
				//Check Billing Address
				var templateFile = nlapiLoadFile(templateID);
				var template = templateFile.getValue();
				var xmlTemp = Handlebars.compile(template);
				
				var soap = xmlTemp(shipValidateObject);
				
				if(nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_log_requests")=="T")
				{
					//Create Request Log file
					var requestFile = nlapiCreateFile("Location_Validation_Request.txt","PLAINTEXT",soap);
					requestFile.setFolder("8771896");
					var requestFileId = nlapiSubmitFile(requestFile);
				}
				
				var headers = new Object();
				headers["Content-Type"] = "application/xml";
				
				var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
				
				nlapiLogExecution("debug","Response Code",cResp.getCode());
				nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
				
				var body = cResp.getBody();
				
				if(nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_log_requests")=="T")
				{
					//Create Request Log file
					var responseFile = nlapiCreateFile("Location_Validation_Response.txt","PLAINTEXT",body);
					responseFile.setFolder("8771896");
					var responseFileId = nlapiSubmitFile(responseFile);
				}
				
				var xmlBody = nlapiStringToXML(body);
				
				var resultsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='SearchLocationsReply']/*[name()='AddressToLocationRelationships']");
				
				if(resultsNode==null || resultsNode=="")
				{
					nlapiSubmitField("salesorder",results[x].getId(),"custbody_fedex_location_type","No results returned");
				}
				else
				{
					var addressType = nlapiSelectValue(resultsNode,".//*[name()='Classification']");
				
					var attributeNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='SearchLocationsReply']/*[name()='AddressToLocationRelationships']/*[name()='DistanceAndLocationDetails']");
					for(var i=0; i < attributeNodes.length && i < 1; i++)
					{
						var address1 = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='StreetLines']");
						var city = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='City']");
						var state = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='StateOrProvinceCode']");
						var zip = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='PostalCode']");
						var country = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='CountryCode']");
						
						if(zip.indexOf("-")==-1 && shipValidateObject.zip.indexOf("-")!=-1)
						{
							shipValidateObject.zip = shipValidateObject.zip.substring(0,5);
						}
						
						var locationType = "";
						var locationDesc = nlapiSelectValues(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='AddressAncillaryDetail']/*[name()='AdditionalDescriptions']");
						
						locationType = locationDesc.join(",");
						
						var match = true;
						
						if(address1.toUpperCase()!=shipValidateObject.address1.toUpperCase())
						{
							nlapiLogExecution("debug","Address 1 (FedEx): " + address1,"Address 1 (NetSuite): " + shipValidateObject.address1);
							match = false;
						}
						if(city.toUpperCase()!=shipValidateObject.city.toUpperCase())
						{
							nlapiLogExecution("debug","City (FedEx): " + city,"City (NetSuite): " + shipValidateObject.city);
							match = false;
						}
						if(shipValidateObject.state!=null && shipValidateObject.state!="" && state.toUpperCase()!=shipValidateObject.state.toUpperCase())
						{
							nlapiLogExecution("debug","State (FedEx): " + state,"State (NetSuite): " + shipValidateObject.state);
							match = false;
						}
						if(zip.toUpperCase()!=shipValidateObject.zip.toUpperCase())
						{
							nlapiLogExecution("debug","Zip Code (FedEx): " + zip,"Zip Code (NetSuite): " + shipValidateObject.zip);
							match = false;
						}
						if(country.toUpperCase()!=shipValidateObject.country.toUpperCase())
						{
							nlapiLogExecution("debug","Country (FedEx): " + country,"Country (NetSuite): " + shipValidateObject.country);
							match = false;
						}
						
						if(match===true)
						{
							var so_id=results[x].getId();
							nlapiLogExecution("debug","Match=True","FedEx WS Returned Location Type: " + locationType);
							nlapiSubmitField("salesorder",so_id,"custbody_fedex_location_type",locationType);
							onsiteFlagingUpdate(so_id);//added by sanjeet 05/04/2018
						}
						else
						{
							nlapiSubmitField("salesorder",results[x].getId(),"custbody_fedex_location_type","Not Applicable");
						}
					}
				}
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Checking Hold for PU Location Order ID " + results[x].getId(),"Details: " + err.message);
			}
		}
	}
}
function onsiteFlagingUpdate(so_id){
	 // NS-1143 added by Sanjay
        var so_fields = nlapiLookupField('salesorder',so_id,['custbody_fedex_location_type','custbody_fedex_std_addr_1']);
        var location_type = so_fields.custbody_fedex_location_type;
        var addr1 = so_fields.custbody_fedex_std_addr_1;
        if(location_type)
        {
          //if(location_type.indexOf('FedEx OnSite')>-1)
          if(location_type.indexOf('FedEx')>-1 && location_type.indexOf('FedEx Ship Center')<=-1)
          {
            var ddNotes = "Ship To "+addr1+" is invalid";
            var csFulStatus = nlapiLookupField('salesorder',so_id,'custbody140');
            //Add New Code for check and insert in Multselect list
            if (csFulStatus)
            {
              var arrStatus = [];
              arrStatus.push(csFulStatus);
              var index = arrStatus.indexOf(17);

              if (arrStatus != "")
              {
                if (index ==- 1)
                {
                  // var arrStatus = csFulStatus.split(',');
                  arrStatus = csFulStatus.split(',');
                  arrStatus.push(17);
                  nlapiSubmitField("salesorder", so_id, ["custbody140","custbody150"],[arrStatus,ddNotes]);
                }
              }

            }
            else
            {
              nlapiSubmitField("salesorder", so_id, ["custbody140", "custbody150"], [17, ddNotes]);
            }
       //started by sanjeet for adding TBD in shipping Address 
          var shipaddr1= nlapiLookupField('salesorder',so_id,'shipaddress');           
          var jj=shipaddr1.split('\n');
          var jj1='TBD '+	jj[1];	
          var jj2=jj[0] +'\n'+ jj1 +'\n'+jj[2] +'\n'+ jj[3];
            if(shipaddr1.indexOf('TBD')==-1)
            {
			  nlapiSubmitField("salesorder", so_id,'shipaddress',jj2) 
            }
       //end
          }
        }

        //End
}
function checkGovernance()
{
	var context = nlapiGetContext();
	if(context.getRemainingUsage() < 400)
	{
 		var state = nlapiYieldScript();
		if(state.status == 'FAILURE')
     	{
      		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   			throw "Failed to yield script";
  		} 
  		else if(state.status == 'RESUME')
  		{
   			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  		}
  		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 	}
}