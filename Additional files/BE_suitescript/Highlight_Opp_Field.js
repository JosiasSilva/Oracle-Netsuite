function Highlight_Opportunity_Field(type,form)
{
	if(type=="view" || type=="edit")
	{
		try
		{
			var customer = nlapiGetFieldValue("entity");
			var opportunity = nlapiGetFieldValue("opportunity");
			
			if(opportunity==null || opportunity=="")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("entity",null,"is",customer));
				filters.push(new nlobjSearchFilter("status",null,"anyof",["A","B"]));
				var results = nlapiSearchRecord("opportunity",null,filters);
				if(results)
				{
					if(results.length > 1)
					{
						nlapiLogExecution("debug","Highlighting field...")
						var	field = form.addField("custpage_highlight_opportunity","inlinehtml","Highlight Opportunity");
						field.setDefaultValue("<script type='text/javascript'>document.getElementById('opportunity_lbl').parentNode.parentNode.style.backgroundColor='lightblue';</script>");
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Highlighting Opportunity Field","Details: " + err.message);
			return true;
		}
	}
}
