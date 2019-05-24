function Fedex_Label_Queue(request,response)
{
	if(request.getMethod()=="GET")
	{
		var form = nlapiCreateForm("Print Fedex Labels");
		form.setScript("customscript_fedex_label_print_queue_cs");
		
		var fld = form.addField("custpage_allow_reprinting","checkbox","Allow Reprinting");
		if(request.getParameter("reprint")=="T")
			fld.setDefaultValue(request.getParameter("reprint"));
			
		fld = form.addField("custpage_selected","integer","Selected");
		fld.setDisplayType("inline");
		fld.setDefaultValue("0");
		
		var numOrders = 0;
		
		var list = form.addSubList("custpage_labels","list","Labels");
		list.addField("custpage_print","checkbox","Print");
		list.addField("custpage_transaction","select","Transaction","transaction").setDisplayType("hidden");
		list.addField("custpage_sales_order","text","Sales Order");
		list.addField("custpage_customer","text","Customer");
		list.addField("custpage_cs_ff_status","textarea","CS Fulfillment Status");
		list.addField("custpage_dd_notes","textarea","Delivery Date Notes");
		list.addField("custpage_delivery_instr","textarea","Delivery Instructions");
		list.addField("custpage_fraud_check_new","text","Fraud Check New");
		list.addField("custpage_website_balance","currency","Website Balance");
		list.addField("custpage_ship_country","text","Shipping Country");
		list.addField("custpage_drop_ship","date","Drop Ship");
		list.addField("custpage_shipping_label_id","text","Shipping Label ID").setDisplayType("hidden");
		
		if(request.getParameter("reprint")=="T")
		{
			var filters = [
				["custbody_fedex_shipping_label","noneof","@NONE@"],
				"and",["type","anyof",["RtnAuth","ItemShip"]],
				"and",["mainline","is","T"],
				"and",["status","is",["ItemShip:A","ItemShip:B"]],
				"and",["trandate","onorafter","09/01/2016"],
				"and",["custbody140","noneof","20"]
			];
		}
		else
		{
			var filters = [
				["custbody_fedex_shipping_label","noneof","@NONE@"],
				"and",["type","anyof",["RtnAuth","ItemShip"]],
				"and",["mainline","is","T"],
				"and",["custbody_fedex_label_printed","is","F"],
				"and",["status","is",["ItemShip:A","ItemShip:B"]],
				"and",["trandate","onorafter","09/01/2016"],
				"and",["custbody140","noneof","20"]
			];
		}
		
		
		var cols = [];
		cols.push(new nlobjSearchColumn("tranid","createdfrom"));
		cols.push(new nlobjSearchColumn("trandate","createdfrom"));
		cols.push(new nlobjSearchColumn("entity","createdfrom"));
		cols.push(new nlobjSearchColumn("custbody_fedex_shipping_label"));
		cols.push(new nlobjSearchColumn("custbodyfraud_check_new","createdfrom"));
		cols.push(new nlobjSearchColumn("custbody194","createdfrom"));
		cols.push(new nlobjSearchColumn("custbody150","createdfrom"));
		cols.push(new nlobjSearchColumn("custbody140","createdfrom"));
		cols.push(new nlobjSearchColumn("custbody_website_truebalance_amt","createdfrom"));
		cols.push(new nlobjSearchColumn("custbody39","createdfrom"));
		cols.push(new nlobjSearchColumn("shipcountry","createdfrom"));
		cols.push(new nlobjSearchColumn("firstname","customer"));
		cols.push(new nlobjSearchColumn("lastname","customer"));
		
		
		var labels = [];
		
		var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
		if(results)
		{
			numOrders = results.length;
			var page = request.getParameter("page");
			if(page!=null && page!="" && page!="null")
				page = parseFloat(page);
			
			nlapiLogExecution("debug","# Results",results.length);
			
			for(var x=0; x < results.length; x++)
			{
				if(page==null || page=="" || page==0 || page==1 || page=="null")
				{
					if(x < 50)
					{
						labels.push({
							custpage_transaction : results[x].getId(),
							custpage_sales_order : results[x].getValue("tranid","createdfrom"),
							custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
							custpage_shipping_label_id : results[x].getValue("custbody_fedex_shipping_label"),
							custpage_fraud_check_new : results[x].getText("custbodyfraud_check_new","createdfrom"),
							custpage_delivery_instr : results[x].getText("custbody194","createdfrom"),
							custpage_dd_notes : results[x].getValue("custbody150","createdfrom"),
							custpage_cs_ff_status : results[x].getText("custbody140","createdfrom"),
							custpage_website_balance : results[x].getValue("custbody_website_truebalance_amt","createdfrom"),
							custpage_drop_ship : results[x].getValue("custbody39","createdfrom"),
							custpage_ship_country : results[x].getValue("shipcountry","createdfrom")
						});
					}
				}
				else
				{
					if(x >= page && x < (page + 50))
					{
						labels.push({
							custpage_transaction : results[x].getId(),
							custpage_sales_order : results[x].getValue("tranid","createdfrom"),
							custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
							custpage_shipping_label_id : results[x].getValue("custbody_fedex_shipping_label"),
							custpage_fraud_check_new : results[x].getText("custbodyfraud_check_new","createdfrom"),
							custpage_delivery_instr : results[x].getText("custbody194","createdfrom"),
							custpage_dd_notes : results[x].getValue("custbody150","createdfrom"),
							custpage_cs_ff_status : results[x].getText("custbody140","createdfrom"),
							custpage_website_balance : results[x].getValue("custbody_website_truebalance_amt","createdfrom"),
							custpage_drop_ship : results[x].getValue("custbody39","createdfrom"),
							custpage_ship_country : results[x].getValue("shipcountry","createdfrom")
						});
					}
				}	
			}
			
			var index = 1;
		
			if(numOrders > 50)
			{
				var pageFld = form.addField("custpage_page","select","Select Page");
				
				if(request.getParameter("page")!=null && request.getParameter("page")!="")
					var defaultSel = request.getParameter("page");
				else
					var defaultSel = 1;
				
				for(var i=0; i < Math.ceil(numOrders / 50); i++)
				{
					var isDefault = false;
					if(defaultSel == index)
						isDefault = true;
					
					var nextIndex = index + 49;
					if(nextIndex > numOrders)
						nextIndex = numOrders;
					pageFld.addSelectOption(index,index + " - " + nextIndex,isDefault);
					index = nextIndex + 1;
				}
			}
			
			list.setLineItemValues(labels);
		}
		
		//list.addMarkAllButtons();
		
		form.addButton("custpage_mark_all","Mark All","FL_Print_Queue_Mark_All()");
		form.addButton("custpage_unmark_all","Unmark All","FL_Print_Queue_Unmark_All()");
		
		form.addSubmitButton("Print Selected");
		
		response.writePage(form);
	}
	else
	{
		var toPrint = [];
		var fulfillments = [];
		
		for(var x=0; x < request.getLineItemCount("custpage_labels"); x++)
		{
			if(request.getLineItemValue("custpage_labels","custpage_print",x+1)=="T")
			{
				if(request.getLineItemValue("custpage_labels","custpage_shipping_label_id",x+1)!=null && request.getLineItemValue("custpage_labels","custpage_shipping_label_id",x+1)!="")
				{
					toPrint.push(request.getLineItemValue("custpage_labels","custpage_shipping_label_id",x+1));
					fulfillments.push(request.getLineItemValue("custpage_labels","custpage_transaction",x+1));
				}
			}
		}
		
		var xml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
		xml+= "<pdfset>";
		
		for(var x=0; x < toPrint.length; x++)
		{
			var fileObj = nlapiLoadFile(toPrint[x]); //10 Units
			var fileUrl = fileObj.getURL();
			if(nlapiGetContext().getEnvironment()=="PRODUCTION")
				fileUrl = "https://system.netsuite.com" + fileUrl.replace(/&/g,"&amp;");
			else
				fileUrl = "https://system.sandbox.netsuite.com" + fileUrl.replace(/&/g,"&amp;");
			nlapiLogExecution("debug","File URL",fileUrl);
			
			xml+= "<pdf src='" + fileUrl + "' />";
		}
		
		xml+= "</pdfset>";
		
		var pdf = nlapiXMLToPDF(xml);
		
		for(var x=0; x < fulfillments.length; x++)
		{
			nlapiSubmitField("itemfulfillment",fulfillments[x],"custbody_fedex_label_printed","T");
		}
	
		response.setContentType("PDF","Shipping_Labels.pdf","inline");
		response.write(pdf.getValue());
	}
}
