function Drop_Ship_ZPL_Sticker_Print_Queue(request,response)
{
	var form = nlapiCreateForm("Drop Ship Sticker Print Queue");
	form.setScript("customscript_dropship_zpl_queue_cs");
	
	var list = form.addSubList("custpage_pos","list","Purchase Orders");
	list.addField("custpage_print","checkbox","Print?");
	list.addField("custpage_vendor","text","Vendor");
	list.addField("custpage_purchaseorder","text","Purchase Order");
	list.addField("custpage_salesorder","text","Sales Order");
	list.addField("custpage_customer","text","Customer Name");
    list.addField("custpage_deliverydate","text","Delivery Date");
	list.addField("custpage_include_comped_item","checkbox","Include Comped Item").setDisplayType("inline");
    list.addField("custpage_mats_ready","checkbox","Materials Ready").setDisplayType("inline");
	list.addField("custpage_ship_country","text","Shipping Country").setDisplayType("hidden");
	list.addField("custpage_delivery_date","date","Delivery Date").setDisplayType("hidden");
	
	//var filters = [];
	//filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	//filters.push(new nlobjSearchFilter("custentity4","vendor","is","6")); //Vendor:Type of Contact = Production Vendor/Jewelry
	//filters.push(new nlobjSearchFilter("custbody39",null,"isnotempty"));
	//filters.push(new nlobjSearchFilter("custbody110",null,"is","today"));
	//filters.push(new nlobjSearchFilter("status",null,"noneof",["PurchOrd:G","PurchOrd:H"]));
	
	var filters = [
		["mainline","is","T"],
		"and",["vendor.custentity4","is","6"],
		"and",["custbody39","isnotempty",null],
		"and",["status","noneof",["PurchOrd:G","PurchOrd:H"]],
		"and",
		[
			[
				["createdfrom","noneof","@NONE@"],
				"and",["createdfrom.custbody110","is","today"],
				"and",["createdfrom.custbody140","noneof","20"]
			],
			"or",
			[
				["custbody_disconnected_po_so","noneof","@NONE@"],
				"and",["custbody_disconnected_po_so.custbody110","is","today"],
				"and",["custbody_disconnected_po_so.custbody140","noneof","20"]
			]
		]
	];
	
	var cols = [];
	cols.push(new nlobjSearchColumn("mainname"));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("createdfrom"));
	cols.push(new nlobjSearchColumn("entity","createdfrom"));
	cols.push(new nlobjSearchColumn("shipcountry","createdfrom"));
	cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody319"));
	cols.push(new nlobjSearchColumn("custbody6")); //Delivery Date
	cols.push(new nlobjSearchColumn("custbody_disconnected_po_so"));
    cols.push(new nlobjSearchColumn("custbody_materials_ready","createdfrom"));
	cols.push(new nlobjSearchColumn("entity","custbody_disconnected_po_so"));
	cols.push(new nlobjSearchColumn("tranid","custbody_disconnected_po_so"));
	cols.push(new nlobjSearchColumn("shipcountry","custbody_disconnected_po_so"));
	var results = nlapiSearchRecord("purchaseorder","customsearch8073",null,cols);
	if(results)
	{
		var lines = [];
		
		for(var x=0; x < results.length; x++)
		{
			var salesorder, customer, shipcountry;
			
			if(results[x].getValue("custbody_disconnected_po_so")!=null && results[x].getValue("custbody_disconnected_po_so")!="")
			{
				salesorder = results[x].getValue("tranid","custbody_disconnected_po_so");
				customer = results[x].getText("entity","custbody_disconnected_po_so");
					customer = customer.substr(customer.indexOf(" ") + 1);
				shipcountry = results[x].getValue("shipcountry","custbody_disconnected_po_so");
			}
			else
			{
				salesorder = results[x].getValue("tranid","createdfrom");
				customer = results[x].getText("entity","createdfrom");
					customer = customer.substr(customer.indexOf(" ") + 1);
				shipcountry = results[x].getValue("shipcountry","createdfrom");
			}
			
			lines.push({
				custpage_vendor : results[x].getText("mainname"),
				custpage_purchaseorder : results[x].getValue("tranid"),
				custpage_salesorder : salesorder,
				custpage_customer : customer,
				custpage_ship_country : shipcountry,
                custpage_deliverydate : results[x].getValue("custbody6"),
				custpage_include_comped_item : results[x].getValue("custbody319"),
				//custpage_delivery_date : results[x].getValue("custbody6")
                custpage_mats_ready : results[x].getValue("custbody_materials_ready","createdfrom")
			});
		}
		
		list.setLineItemValues(lines);
	}
	
	list.addMarkAllButtons();
	
	form.addButton("custpage_print","Print Label(s)","printLabels()");
	
	response.writePage(form);
}

function printLabels()
{
	try
	{
		var now = new Date();
		
		var zpl = '';
		
		for(var x=0; x < nlapiGetLineItemCount("custpage_pos"); x++)
		{
			if(nlapiGetLineItemValue("custpage_pos","custpage_print",x+1)=="T")
			{
				zpl+= '^XA\n';
	            zpl+= '^CFB,20\n';
				if(nlapiGetLineItemValue("custpage_pos","custpage_ship_country",x+1)!="US")
	            	zpl+= '^FO10,75^FD* International *^FS\n';
	            zpl+= '^FO10,115^FD' + nlapiGetLineItemValue("custpage_pos","custpage_vendor",x+1) + '^FS\n';
				zpl+= '^FO10,155^FD' + nlapiGetLineItemValue("custpage_pos","custpage_purchaseorder",x+1) + '^FS\n';
              zpl+= '^FO10,195^FDDD:' + nlapiGetLineItemValue("custpage_pos","custpage_deliverydate",x+1) + '^FS\n';
	            zpl+= '^FO5,100^GB385,125,2^FS'
				zpl+= '^CFA,15\n';
				zpl+= '^FO10,235^FD' + nlapiGetLineItemValue("custpage_pos","custpage_salesorder",x+1) + '^FS\n';
				zpl+= '^FO10,275^FD' + nlapiGetLineItemValue("custpage_pos","custpage_customer",x+1) + '^FS\n';
				zpl+= '^CFB,20\n';
				if(nlapiGetLineItemValue("custpage_pos","custpage_include_comped_item",x+1)=="T")
				{
					zpl+= '^FO10,305^FDInclude Comped^FS\n';
					zpl+= '^FO10,345^FD     Item^FS\n';	
				}
				zpl+= '^XZ'; 
			}
		}
		
		if(zpl!='')
	    {
	        //Save file for debugging purposes only
	        var zplRecord = nlapiCreateRecord("customrecord_zpl_label_holder");
	        zplRecord.setFieldValue("custrecord_zpl_filename",now.toString() + ".zpl");
	        nlapiLogExecution("debug","File Name",now.toString() + ".zpl");
	        zplRecord.setFieldValue("custrecord_zpl_data",zpl);
	        var zplRecordId = nlapiSubmitRecord(zplRecord,true,true);
	
	        var url = nlapiResolveURL("SUITELET","customscript_diamond_rcv_db_label_print","customdeploy_diamond_rcv_db_label_print") + "&fileid=" + zplRecordId;
	
	        var newWin = window.open(url,"printWin","width=400,height=400");
	        setTimeout(function(){ newWin.close(); }, 5000);
	    }	
	}
	catch(err)
	{
		alert("Error: " + err.message);
	}
}
