function Vendor_Box_Dashboard(request,response)
{
	if(request.getMethod()=="GET")
	{
		
		var lines = [];
		
		var vendors = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("custcol18",null,"on","today"));
		filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
		if(request.getParameter("vendor")!=null && request.getParameter("vendor")!="")
			filters.push(new nlobjSearchFilter("mainname",null,"is",request.getParameter("vendor")));
		
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
		cols.push(new nlobjSearchColumn("createdfrom"));
		cols.push(new nlobjSearchColumn("custcol_vbd_status"));
		
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				var notes = "";
				if(results[x].getValue("custcol_vbd_notes")!=null && results[x].getValue("custcol_vbd_notes")!="")
					notes = results[x].getValue("custcol_vbd_notes");
				else
					notes = results[x].getValue("custcol5");
				
				lines.push({
					custpage_po_id : results[x].getId(),
					custpage_item : results[x].getValue("item"),
					custpage_date_sent_from_sf : results[x].getValue("custcol18"),
					custpage_po_line : results[x].getValue("line"),
					custpage_vendor : results[x].getValue("mainname"),
					custpage_insurance_value : results[x].getValue("custcol_full_insurance_value"),
					custpage_status : results[x].getValue("custcol_vbd_status"),
					custpage_notes : notes,
					custpage_item_link : results[x].getValue("custcolitem_link"),
					custpage_description : results[x].getValue("memo"),
					custpage_created_from : results[x].getValue("createdfrom"),
					custpage_history : "<a class='dottedlink' href='javascript:void nlOpenWindow(%22/app/accounting/transactions/history.nl?id=" + results[x].getId() + "&amp;line=" + results[x].getValue("line") + "%22,%22historypopup%22,%22width=750,height=1000,resizable=yes,scrollbars=yes%22)' onclick='setWindowChanged(window,false);'>History</a>"
				});
				
				vendors.push({
					id : results[x].getValue("mainname"),
					name : results[x].getText("mainname")
				});
			}
		}
		
		var form = nlapiCreateForm("Vendor Box Dashboard");
		form.setScript("customscript_vendor_box_client");
		
		vendors = _(vendors).groupBy(function (item){ return item.id; });
		vendors = _(vendors).map(function (myitems){
			var item = myitems[0];
			
			item.name = 		item.name;
			
			return item;
		});
		
		var vendor_fld = form.addField("custpage_vendor","select","Vendor");
		vendor_fld.addSelectOption("","",true);
		for(var x=0; x < vendors.length; x++)
		{
			vendor_fld.addSelectOption(vendors[x].id,vendors[x].name,false);
		}
		if(request.getParameter("vendor")!=null && request.getParameter("vendor")!="")
			vendor_fld.setDefaultValue(request.getParameter("vendor"));
		
		var list = form.addSubList("custpage_list","list","Line Items");
		list.addField("custpage_po_id","select","Purchase Order","purchaseorder").setDisplayType("inline");
		list.addField("custpage_vendor","select","Vendor","vendor").setDisplayType("inline");
		list.addField("custpage_item","select","Item","item").setDisplayType("inline");
		list.addField("custpage_description","textarea","Description");
		list.addField("custpage_status","select","Status","customlist_vbd_status");
		list.addField("custpage_notes","textarea","Notes").setDisplayType("entry");
		list.addField("custpage_item_link","select","Item Link","item");
		list.addField("custpage_date_sent_from_sf","date","Date Sent from SF").setDisplayType("entry");
		list.addField("custpage_insurance_value","currency","Insurance Value");
		list.addField("custpage_created_from","select","Created From","salesorder").setDisplayType("inline");
		list.addField("custpage_po_line","text","PO Line #").setDisplayType("hidden");
		list.addField("custpage_changed","checkbox","Changed?");
		list.addField("custpage_history","text","History");
		
		list.setLineItemValues(lines);
		
		form.addSubmitButton("Update Date Sent from SF");
		
		form.addButton("custpage_print","Print","VBD_Print();");
		
		response.writePage(form);
	}
	else
	{
		try
		{
			for(var x=0; x < request.getLineItemCount("custpage_list"); x++)
			{
				if(request.getLineItemValue("custpage_list","custpage_changed",x+1)=="T")
				{
					var po = nlapiLoadRecord("purchaseorder",request.getLineItemValue("custpage_list","custpage_po_id",x+1));
					for(var i=0; i < po.getLineItemCount("item"); i++)
					{
						if(po.getLineItemValue("item","line",i+1)==request.getLineItemValue("custpage_list","custpage_po_line",x+1))
						{
							po.setLineItemValue("item","custcol18",i+1,request.getLineItemValue("custpage_list","custpage_date_sent_from_sf",x+1));
							po.setLineItemValue("item","custcol_vbd_notes",i+1,request.getLineItemValue("custpage_list","custpage_notes",x+1));
							po.setLineItemValue("item","custcolitem_link",i+1,request.getLineItemValue("custpage_list","custpage_item_link",x+1));
							po.setLineItemValue("item","custcol_vbd_status",i+1,request.getLineItemValue("custpage_list","custpage_status",x+1));
							break;
						}
					}
					nlapiSubmitRecord(po,true,true);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Date Sent from SF","Details: " + err.message);
		}
		
		response.sendRedirect("SUITELET","customscript_vendor_box_dashboard","customdeploy_vendor_box_dashboard");
	}
}
