function Vendor_Box_Dashboard_Print(request,response)
{
	var vendors = [];
		
	var filters = [];
	filters.push(new nlobjSearchFilter("custcol18",null,"on","today"));
	filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
	
	var cols = [];
	cols.push(new nlobjSearchColumn("mainname",null,"group"));
	
	var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			vendors.push(results[x].getValue("mainname",null,"group"));
		}
	}
	
	var xml = "";
		xml += "<?xml version=\"1.0\"?>";
		xml += "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">";
		xml += "<pdf>";
		xml += "<head>";
		xml += "</head>";
		xml += "<body size='letter'>";
	
	
	for(var x=0; x < vendors.length; x++)
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("mainname",null,"is",vendors[x]));
		filters.push(new nlobjSearchFilter("custcol18",null,"on","today"));
		filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
		
		var cols = [];
		cols.push(new nlobjSearchColumn("mainname"));
		cols.push(new nlobjSearchColumn("item"));
		cols.push(new nlobjSearchColumn("tranid"));
		cols.push(new nlobjSearchColumn("trandate"));
		cols.push(new nlobjSearchColumn("entity"));
		cols.push(new nlobjSearchColumn("custcol18"));
		cols.push(new nlobjSearchColumn("line"));
		cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
		cols.push(new nlobjSearchColumn("memo"));
		cols.push(new nlobjSearchColumn("custcolitem_link"));
		cols.push(new nlobjSearchColumn("custcol5"));
		cols.push(new nlobjSearchColumn("custcol_vbd_notes"));
		
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
		if(results)
		{
			xml += "<p text-align='center'>Sending from SF " + nlapiEscapeXML(results[0].getText("mainname")) + "</p>";
			
			xml += "<table cellpadding='1' cellmargin='0' cellborder='1'><tr><th width='0.75in'>No.</th><th width='1.25in'>Order #</th><th width='3.5in'></th><th width='1.25in'>Ins Value</th></tr>";
			
			for(var i=0; i < results.length; i++)
			{
				var notes = "";
				if(results[i].getValue("custcol_vbd_notes")!=null && results[i].getValue("custcol_vbd_notes")!="")
					notes = results[i].getValue("custcol_vbd_notes");
				else
					notes = results[i].getValue("custcol5");
				
				xml += "<tr><td>" + (i+1) + "</td><td>" + results[i].getValue("tranid") + "</td><td>" + nlapiEscapeXML(notes) + "</td><td>$ "+nlapiFormatCurrency(results[i].getValue("custcol_full_insurance_value"))+"</td></tr>";
			}
			
			xml += "</table>";
		}
		
		if(x+1 < vendors.length)
			xml += "<pbr/>";
	}
	
	xml += "</body></pdf>";
		
	var file = nlapiXMLToPDF(xml);
	response.setContentType("PDF","Vendor_List.pdf","inline");
	response.write(file.getValue());
}
