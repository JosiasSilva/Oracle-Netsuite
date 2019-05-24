var prod_subtab = "custom95";
var sb_subtab = "custom91";

function TO_SO_Sublist(type,form)
{
	if(type=="view" || type=="edit")
	{
		try
		{
			var orders = [];
			
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
			filters.push(new nlobjSearchFilter("mainline","custcol38","is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("internalid","custcol38","group").setSort());
			var results = nlapiSearchRecord("transferorder",null,filters,cols);
			if(results)
			{
				nlapiSetFieldValue("custbody_to_so_count",results.length,true,true);
			}
			else
			{
				nlapiSetFieldValue("custbody_to_so_count",0.00,true,true);
			}
			
			var subtab;
			if(nlapiGetContext().getEnvironment()=="PRODUCTION")
				subtab = prod_subtab;
			else
				subtab = sb_subtab;
			
			var sublist = form.addSubList("custpage_orders","list","Linked Sales Orders",subtab);
			sublist.addField("custpage_tranid","text","SO#");
			sublist.addField("custpage_trandate","date","Date");
			sublist.addField("custpage_entity","text","Customer");
			
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
			filters.push(new nlobjSearchFilter("mainline","custcol38","is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("internalid","custcol38","group").setSort());
			cols.push(new nlobjSearchColumn("trandate","custcol38","group"));
			cols.push(new nlobjSearchColumn("entity","custcol38","group"));
			cols.push(new nlobjSearchColumn("tranid","custcol38","group"));
			var results = nlapiSearchRecord("transferorder",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					orders.push({
						custpage_tranid : results[x].getValue("tranid","custcol38","group"),
						custpage_trandate : results[x].getValue("trandate","custcol38","group"),
						custpage_entity : results[x].getText("entity","custcol38","group")
					});
				}
				
				sublist.setLineItemValues(orders);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing SO Count Fld + Sublist","Details: " + err.message);
		}
	}
}
