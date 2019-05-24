function add_line_sublist(form,get_vendor,get_item,get_status)
{
  var list = form.addSubList("custpage_list","list","Line Items");
  list.addField("custpage_list_po","select","Purchase Order","purchaseorder").setDisplayType("hidden");
  list.addField("custpage_list_po_number","text","Purchase Order");
  list.addField("custpage_list_vendor","select","Vendor","vendor").setDisplayType("inline");
  list.addField("custpage_list_item","select","Item","item").setDisplayType("inline");
  list.addField("custpage_list_description","textarea","Description");
  list.addField("custpage_list_status","select","Status","customlist_vbd_status");
  list.addField("custpage_list_notes","textarea","Notes").setDisplayType("entry");
  list.addField("custpage_list_so_imp_notes","textarea","SO Important Notes");

  list.addField("custpage_list_item_link","text","Item Link");
  list.addField("custpage_list_date_sent_from_sf","date","Date Sent from SF").setDisplayType("entry");
  list.addField("custpage_list_delivery_date","date","Delivery Date");
  list.addField("custpage_list_item_link_id","select","Item Link ID").setDisplayType("hidden");;
  list.addField("custpage_list_insurance_value","currency","Insurance Value").setDisplayType("entry");
  list.addField("custpage_list_created_from","select","Created From","salesorder").setDisplayType("hidden");
  list.addField("custpage_list_so_status","text","SO Status").setDisplayType("hidden"); //Added by ajay 03Jan 2017
  list.addField("custpage_list_so_number","text","Sales Order");
  list.addField("custpage_list_gem_notif","text","Customer Selected Gem Notification");
  list.addField("custpage_list_po_line","text","PO Line #").setDisplayType("hidden");
  list.addField("custpage_list_changed","checkbox","Changed?");
  list.addField("custpage_list_history","text","History");
  list.addField("custpage_list_box_created","checkbox","Box Created").setDisplayType('inline');
  list.addField("custpage_list_box_id","select","Box ID","customrecord_box_record").setDisplayType('hidden');
  list.addField("custpage_list_po_document_number","text").setDisplayType('hidden');
  var get_data=Get_Data_Line_SubList(get_vendor,get_item,get_status);
  if(get_data){list.setLineItemValues(get_data);}
}
function Get_Data_Line_SubList(get_vendor,get_item,get_status)
{
  var filters=[];
  filters.push(new nlobjSearchFilter("custcol18",null,"on","today"));
  filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
  if(get_vendor){filters.push(new nlobjSearchFilter("mainname",null,"anyof",get_vendor));}
  if(get_status){filters.push(new nlobjSearchFilter("custcol_vbd_status",null,"anyof",get_status));}
  if(get_item){filters.push(new nlobjSearchFilter("custcolitem_link",null,"anyof",get_item));}
  var cols = [];
  cols.push(new nlobjSearchColumn("mainname"));
  cols.push(new nlobjSearchColumn("item"));
  cols.push(new nlobjSearchColumn("tranid"));
  cols.push(new nlobjSearchColumn("trandate"));
  cols.push(new nlobjSearchColumn("entity"));
  cols.push(new nlobjSearchColumn("custcol18"));
  cols.push(new nlobjSearchColumn("custbody6"));
  cols.push(new nlobjSearchColumn("line"));
  cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
  cols.push(new nlobjSearchColumn("memo"));
  cols.push(new nlobjSearchColumn("custcolitem_link"));
  cols.push(new nlobjSearchColumn("custcol5"));
  cols.push(new nlobjSearchColumn("custcol_vbd_notes"));
  cols.push(new nlobjSearchColumn("createdfrom"));
  cols.push(new nlobjSearchColumn("tranid","createdfrom"));
  cols.push(new nlobjSearchColumn("custcol_vbd_status"));
  cols.push(new nlobjSearchColumn("custcol_vbd_int_notes"));
  cols.push(new nlobjSearchColumn("custbody58"));
  cols.push(new nlobjSearchColumn("custbody244","createdfrom"));
  cols.push(new nlobjSearchColumn("status","createdfrom")); //Added by ajay 10Jan 2017
  cols.push(new nlobjSearchColumn("custcol_box_record_po"));
  cols.push(new nlobjSearchColumn("baseprice","custcolitem_link"));
  var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
  if(results)
  {
    var lines=[];
    for(var x=0; x < results.length; x++)
    {
      var notes = "";
      var box_created="F";
      if(results[x].getValue("custcol_vbd_notes"))
        notes = results[x].getValue("custcol_vbd_notes");
      else
        notes = results[x].getValue("custcol5");
      if(results[x].getValue("custcol_box_record_po")){box_created="T";}
      var isurence= results[x].getValue("custcol_full_insurance_value");
      if(results[x].getValue("custcolitem_link"))
      {
        var get_isurence=  results[x].getValue("baseprice","custcolitem_link");
        if(get_isurence)
        {
          isurence=(parseFloat(get_isurence)*(.8)).toFixed(2);
        }
      }
      lines.push({
        custpage_list_po : results[x].getId(),
        custpage_list_po_number : "<a href='/app/accounting/transactions/purchord.nl?id=" + results[x].getId() + "'>" + results[x].getValue("tranid") + "</a>",
        custpage_list_vendor : results[x].getValue("mainname"),
        custpage_list_item : results[x].getValue("item"),
        custpage_list_description : notes,//results[x].getValue("memo"),
        custpage_list_status : results[x].getValue("custcol_vbd_status"),
        custpage_list_notes : notes,
        custpage_list_so_imp_notes : results[x].getValue("custbody58"),
        custpage_list_item_link :  "<a href=' /app/common/item/item.nl?id=" + results[x].getValue("custcolitem_link") + "'>" + results[x].getText("custcolitem_link") + "</a>",
        custpage_list_date_sent_from_sf : results[x].getValue("custcol18"),
        custpage_list_delivery_date: results[x].getValue("custbody6"),		
        custpage_list_insurance_value : isurence,//results[x].getValue("custcol_full_insurance_value"),
        custpage_list_created_from : results[x].getValue("createdfrom"),
        custpage_list_so_status : results[x].getValue("status","createdfrom"), //Added by ajay 03Jan 2017
        custpage_list_so_number : "<a href='/app/accounting/transactions/salesord.nl?id=" + results[x].getValue("createdfrom") + "'>" + results[x].getValue("tranid","createdfrom") + "</a>",	
        custpage_list_gem_notif : results[x].getText("custbody244","createdfrom"),
        custpage_list_po_line : results[x].getValue("line"),
        custpage_list_history : "<a class='dottedlink' href='javascript:void nlOpenWindow(%22/app/accounting/transactions/history.nl?id=" + results[x].getId() + "&amp;line=" + results[x].getValue("line") + "%22,%22historypopup%22,%22width=750,height=1000,resizable=yes,scrollbars=yes%22)' onclick='setWindowChanged(window,false);'>History</a>",
        custpage_list_box_created :box_created,
        custpage_list_po_document_number:results[x].getValue("tranid"),
        custpage_list_box_id:results[x].getValue("custcol_box_record_po"),
        custpage_list_item_link_id:results[x].getValue("custcolitem_link"),
      });
    }
    return lines;
  }
}