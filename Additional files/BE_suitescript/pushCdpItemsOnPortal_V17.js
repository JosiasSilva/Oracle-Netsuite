nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
			/***************************** Start Added by Yagya Kumar 18 April 17 for DP-296 ************************/
			var filter = new Array();
			filter.push(new nlobjSearchFilter('custrecord_cdp_id' , null , 'equalto' ,cdpId));
			var result = nlapiSearchRecord('customrecord_pending_inv_for_cdp',null,filter,null);
			if(result)
			{
				var recordId = result[0].id;
				var poId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_po_number");	
				if(poId != null && poId != "")
				{					
					nlapiSubmitField('customrecord_pending_inv_for_cdp',recordId,'custrecord_po_number',poId);
					nlapiLogExecution('debug','PO field Set for pending_inv_for_cdp' , 'CDP #'+cdpId );
				}
			}
			/***************************** End Added by Yagya Kumar 18 April 17 for DP-296 ************************/
			
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
