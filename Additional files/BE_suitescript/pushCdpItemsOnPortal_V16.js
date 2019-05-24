//Set Hyperlink of Portal Record Url
function Before_Load(type,form)
{
    //nlapiLogExecution("debug","event type is :",type);
    if(type == "view" || type == "edit")
    {
	    var url  = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord_hidden_portal_url");
	    //nlapiLogExecution("debug","Portal Diamond Record Url is :",url);

		if(url != null && url != "")
		{
			form.getField('custrecord_portal_record_url').setLinkText(url).setDefaultValue(url);
		}
    }
}

function PushCdpDataNSToPortal(type)
{
    if(type == "create" || type == "edit"  || type == "xedit")
	{
		try
		{
            var scriptId = "874";
            var cdpId = nlapiGetRecordId();
            var context = nlapiGetContext();
            var contextType = context.getExecutionContext();
            nlapiLogExecution("debug","context type is :",contextType);
            if(contextType!="userinterface" && contextType!="userevent")
			{
				nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
				return true;
			}
            nlapiLogExecution('debug','CDP Initiated to push on portal for cdpId:'+cdpId , cdpId );
            var soId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_so_order_number");
			var assetAcct='';
            var soStatus = null;
			if(soId !='' && soId != null)
			{
                soStatus = nlapiLookupField("salesorder",soId,"status");
			    var soObj = nlapiLoadRecord("salesorder",soId);
				var itemCount = soObj.getLineItemCount("item");
				for(var j=1; j<= itemCount; j++)
				{
					var itemType = soObj.getLineItemValue("item","itemtype",j);
					if(itemType == "InvtPart")
					{
						var invItemId=soObj.getLineItemValue("item","item",j);
						if(nlapiLookupField("inventoryitem",invItemId,"custitem20") == 7)
						{
							assetAcct = nlapiLookupField("inventoryitem",soObj.getLineItemValue("item","item",j),"assetaccount");
							break;
						}
					}// end check of itemType
				}// end of loop
			}// end check of soId

			CallCDPToPortal(cdpId,assetAcct,soStatus,type,scriptId); //Call new library function
		}
		catch(err)
		{
		  nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
		}
    }
}
