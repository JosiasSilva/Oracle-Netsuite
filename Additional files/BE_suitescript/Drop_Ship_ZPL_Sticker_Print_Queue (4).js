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
	list.addField("custpage_ship_country","text","Shipping Country").setDisplayType("hidden");
	list.addField("custpage_delivery_date","date","Delivery Date").setDisplayType("hidden");
	
	var filters = [];
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	filters.push(new nlobjSearchFilter("custentity4","vendor","is","6")); //Vendor:Type of Contact = Production Vendor/Jewelry
	filters.push(new nlobjSearchFilter("custbody39",null,"isnotempty"));
	filters.push(new nlobjSearchFilter("status",null,"noneof",["PurchOrd:G","PurchOrd:H"]));
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
	cols.push(new nlobjSearchColumn("entity","custbody_disconnected_po_so"));
	cols.push(new nlobjSearchColumn("tranid","custbody_disconnected_po_so"));
	cols.push(new nlobjSearchColumn("shipcountry","custbody_disconnected_po_so"));
	var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
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
				custpage_delivery_date : results[x].getValue("custbody6")
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
	            	zpl+= '^FO10,10^FD* International *^FS\n';
	            zpl+= '^FO10,75^FD' + nlapiGetLineItemValue("custpage_pos","custpage_vendor",x+1) + '^FS\n';
				zpl+= '^FO10,105^FD' + nlapiGetLineItemValue("custpage_pos","custpage_purchaseorder",x+1) + '^FS\n';
				zpl+= '^FO10,135^FD' + nlapiGetLineItemValue("custpage_pos","custpage_delivery_date",x+1) + '^FS\n';
	            zpl+= '^FO5,65^GB295,100,2^FS\n'
				zpl+= '^CFA,15\n';
				zpl+= '^FO10,180^FD' + nlapiGetLineItemValue("custpage_pos","custpage_salesorder",x+1) + '^FS\n';
				zpl+= '^FO10,200^FD' + nlapiGetLineItemValue("custpage_pos","custpage_customer",x+1) + '^FS\n';
				zpl+= '^CFB,20\n';
				if(nlapiGetLineItemValue("custpage_pos","custpage_include_comped_item",x+1)=="T")
				{
					zpl+= '^FO10,240^FDInclude Comped^FS\n';
					zpl+= '^FO10,270^FD     Item^FS\n';	
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
