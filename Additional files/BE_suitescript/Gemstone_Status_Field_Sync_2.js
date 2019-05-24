/*
 * Sync Gemstone Status Fields Between SO and PO
 * 
 * Type: User Event
 * Execution: After Submit (edit and xedit)
 * 
 * Summary: Syncs the Custom Gem Status (custbody172) and Gemstone Status (custbody103) between the SO and PO as edits are made.
 * 
 * Change Log:
 *  - 11/10/2014: Initial script deployment
 */
function Gemstone_Status_Field_Sync(type)
{
	var recid = nlapiGetRecordId();
	var rectype = nlapiGetRecordType();
	
	try
	{
		if(type=="edit")
		{
			if(rectype=="salesorder")
			{
				var order = nlapiGetNewRecord();
				var custom_gem_status = order.getFieldValue("custbody172");
				var gemstone_status = order.getFieldValue("custbody103");
				
				var pos = [];
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					if(order.getLineItemValue("item","poid",x+1)!=null && order.getLineItemValue("item","poid",x+1)!="")
						pos.push(order.getLineItemValue("item","poid",x+1));
				}
				
				for(var x=0; x < pos.length; x++)
				{
					nlapiSubmitField("purchaseorder",pos[x],["custbody172","custbody103"],[custom_gem_status,gemstone_status]);
				}
			}
			else if(rectype=="purchaseorder")
			{
				var po = nlapiGetNewRecord();
				var custom_gem_status = po.getFieldValue("custbody172");
				var gemstone_status = po.getFieldValue("custbody103");
				var date_needed_in_sf = po.getFieldValue("custbody59");
				
				var order = po.getFieldValue("createdfrom");
				if(order!=null && order!="")
				{
					nlapiSubmitField("salesorder",order,["custbody172","custbody103"],[custom_gem_status,gemstone_status]);
					
					//Find related PO's and update Gemstone Status and Date Needed in SF fields
					var filters = [];
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					filters.push(new nlobjSearchFilter("internalid",null,"is",order));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiLogExecution("debug","PO Internal ID",results[x].getValue("purchaseorder",null,"group"));
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody59","custbody103"],[date_needed_in_sf,gemstone_status]);
						}
					}
				}
			}
		}
		else if(type=="xedit")
		{
			if(rectype=="salesorder")
			{
				var order = nlapiGetNewRecord();
				var custom_gem_status = order.getFieldValue("custbody172");
				var gemstone_status = order.getFieldValue("custbody103");
				
				if(custom_gem_status!=null && custom_gem_status!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody172",custom_gem_status);
						}
					}
				}
				else if(gemstone_status!=null && gemstone_status!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody103",gemstone_status);
						}
					}
				}
			}
			else if(rectype=="purchaseorder")
			{
				var po = nlapiGetNewRecord();
				var custom_gem_status = po.getFieldValue("custbody172");
				var gemstone_status = po.getFieldValue("custbody103");
				var date_needed_in_sf = po.getFieldValue("custbody59");
				
				if(custom_gem_status!=null && custom_gem_status!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody172",custom_gem_status);
					}
				}
				else if(gemstone_status!=null && gemstone_status!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody103",gemstone_status);
						
						//Find related PO's and update Gemstone Status and field
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),"custbody103",gemstone_status);
							}
						}
					}
				}
				else if(date_needed_in_sf!=null && date_needed_in_sf!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						//Find related PO's and update Date Needed in SF field
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),"custbody59",date_needed_in_sf);
							}
						}
					}
				}
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Syncing Gemstone Status Fields","Details: " + err.message);
		return true;
	}
}
