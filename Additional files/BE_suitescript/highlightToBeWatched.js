function highlightToBeWatched(type,form)
{
	if(type=="view" || type=="edit")
	{
		try
		{
			var orderID = nlapiGetRecordId();
			
			var results = nlapiSearchRecord("customer","customsearch707",new nlobjSearchFilter("internalid","transaction","is",orderID));
			if(results)
			{
				nlapiLogExecution("debug","Highlighting Field...")
				//fld = form.addField("custpage_to_be_watched_html","inlinehtml","To Be Watched");
				fld = form.getField("custbody_to_be_watched_so_only");
				fld.setDefaultValue("<span style='background-color: yellow; font-weight: bold; font-size: 9pt;'>To Be Watched <span class='checkbox_read_ck'><img class='checkboximage' src='/images/nav/ns_x.gif'/></span></span>");
				//fld.setLayoutType("outsideabove","none");
			}
			else
			{
				nlapiLogExecution("debug","No Results Found")
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Highlighting To Be Watched","Detailed: " + err.message);
			return true;
		}
	}
}
