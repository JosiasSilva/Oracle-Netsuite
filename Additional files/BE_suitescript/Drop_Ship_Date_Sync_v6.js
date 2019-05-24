function Drop_Ship_Date_Sync(type)
{
	if(type=="create" || type=="edit" || type=="xedit")
	{
		try
		{
			var context = nlapiGetContext();
			var contextType = context.getExecutionContext();
			if(contextType!="userinterface")
			{
				nlapiLogExecution("audit","Stopping script execution. Not triggered by UI.");
				return true;
			}
			
			var recid = nlapiGetRecordId();
			var rectype = nlapiGetRecordType();
			
			if(type=="create" && rectype=="purchaseorder")
			{
				//On creation of a NEW PO, set the value to the SO value
				var salesorder = nlapiGetNewRecord().getFieldValue("createdfrom");
				if(salesorder!=null && salesorder!="")
				{
					var so_custbody39 = nlapiLookupField("salesorder",salesorder,"custbody39");
					var po_custbody39 = nlapiGetNewRecord().getFieldValue("custbody39");
					
					if(so_custbody39!=null && so_custbody39!="")
					{
						nlapiSubmitField("purchaseorder",recid,"custbody39",so_custbody39);
					}
				}
			}
			else if(type=="edit")
			{
				var oldValue = nlapiGetOldRecord().getFieldValue("custbody39");
				var newValue = nlapiLookupField(nlapiGetRecordType(),nlapiGetRecordId(),"custbody39");
				
				if(rectype=="salesorder")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					cols.push(new nlobjSearchColumn("custbody39"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);
						}
					}
				}
				else
				{
					if(newValue==null || newValue=="")
					{
						//Ensure the PO is from a production vendor if pushing back blank value
						//Production vendor = USNY, CH, Miracleworks, Trung, Harout
						var vendor = nlapiLookupField(nlapiGetRecordType(),nlapiGetRecordId(),"entity");
						if(vendor!="7773" && vendor!="153" && vendor!="442500" && vendor!="46063" && vendor!="1223843")
						{
							nlapiLogExecution("error","Not syncing back Drop Ship field (blank). Not production vendor.");
							return true;
						}
					}
					
					//Update Sales Order
					var salesorder = nlapiGetNewRecord().getFieldValue("createdfrom");
					if(salesorder!=null && salesorder!="")
					{
						nlapiSubmitField("salesorder",salesorder,"custbody39",newValue);
					}
					
					//Update ALL associated purchase orders
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",salesorder));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					cols.push(new nlobjSearchColumn("custbody39"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);
						}
					}
				}
			}
			else if(type=="xedit")
			{
				nlapiLogExecution("debug","Running Xedit Routine...");
				
				//Get Drop Ship Materials sent to Vendor field value
				var dropShipDate = nlapiLookupField(rectype,recid,"custbody39");
				
				//Update Sales Order if edited from PO, Update PO if edited from SO
				if(rectype=="salesorder")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					cols.push(new nlobjSearchColumn("custbody39"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",dropShipDate);
						}
					}
				}
				else
				{
					if(dropShipDate==null || dropShipDate=="")
					{
						//Ensure the PO is from a production vendor if pushing back blank value
						//Production vendor = USNY, CH, Miracleworks, Trung, Harout
						var vendor = nlapiLookupField(nlapiGetRecordType(),recid,"entity");
						if(vendor!="7773" && vendor!="153" && vendor!="442500" && vendor!="46063" && vendor!="1223843")
						{
							nlapiLogExecution("error","Not syncing back Drop Ship field (blank). Not production vendor.");
							return true;
						}
					}
					
					//Update Sales Order
					var salesorder = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(salesorder!=null && salesorder!="")
					{
						nlapiSubmitField("salesorder",salesorder,"custbody39",dropShipDate);
					}
					
					//Update ALL associated purchase orders
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",salesorder));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					cols.push(new nlobjSearchColumn("custbody39"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Syncing field custbody39","Details: " + err.message);
			return true;
		}
	}
}
