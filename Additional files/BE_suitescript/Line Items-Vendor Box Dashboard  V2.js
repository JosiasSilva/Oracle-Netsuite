function add_line_sublist(form,get_vendor,get_item,get_status,record_content)
{
  var list = form.addSubList("custpage_list","list","Line Items");
  /* NS-1278 - 07/25/2018 Start */
  list.addButton('custpage_list_bulkupdate','Bulk Update','onclick_bulkupdate()');
  /* NS-1278 - 07/25/2018 End */
  list.addField("custpage_list_po_number","text","Purchase Order");
  list.addField("custpage_list_vendor","select","Vendor","vendor").setDisplayType("inline");
  list.addField("custpage_list_item","select","Item","item").setDisplayType("inline");
  list.addField("custpage_list_description","textarea","Description");
  list.addField("custpage_list_status","select","Status","customlist_vbd_status");
  list.addField("custpage_old_list_status","select","Status","customlist_vbd_status").setDisplayType("hidden");
  list.addField("custpage_list_notes","textarea","Notes").setDisplayType("entry");
  list.addField("custpage_old_list_notes","textarea","Notes").setDisplayType("hidden");
  list.addField("custpage_list_so_imp_notes","textarea","SO Important Notes");
  list.addField("custpage_list_item_link","text","Item Link");
  list.addField("custpage_list_date_sent_from_sf","date","Date Sent from SF").setDisplayType("entry");
  list.addField("custpage_old_list_date_sent_from_sf","date","Date Sent from SF").setDisplayType("hidden");
  list.addField("custpage_list_delivery_date","textarea","Delivery Date");
  list.addField("custpage_list_insurance_value","currency","Insurance Value").setDisplayType("entry");
  list.addField("custpage_list_insurance_value_old","currency","Insurance Value").setDisplayType("hidden");
  list.addField("custpage_list_so_number","text","Sales Order");
  list.addField("custpage_list_gem_notif","select","Customer Selected Gem Notification",'customlist337').setDisplayType("inline");
  list.addField("custpage_old_list_gem_notif","select","Customer Selected Gem Notification",'customlist337').setDisplayType("hidden");
  list.addField("custpage_specific_gem_pulled","textarea","Specific Gem Pulled");
  list.addField("custpage_list_changed","checkbox","Changed?");
  list.addField("custpage_list_history","text","History");
  list.addField("custpage_list_box_created","checkbox","Box Created").setDisplayType('inline');
  list.addField("custpage_list_box_id","select","Box ID","customrecord_box_record").setDisplayType('hidden');
  list.addField("custpage_list_po_document_number","text").setDisplayType('hidden');
  list.addField("custpage_list_packing_slip_description","textarea","Packing Slip Discription").setDisplayType('hidden');
  list.addField("custpage_list_packing_slip_insurnce_value","currency","insurnce_value_update").setDisplayType('hidden');
  list.addField("custpage_list_po","select","Purchase Order","purchaseorder").setDisplayType("hidden");
  list.addField("custpage_list_po_line","text","PO Line #").setDisplayType("hidden");
  var get_data=Get_Data_Line_SubList(get_vendor,get_item,get_status);
  if(get_data){list.setLineItemValues(get_data);record_content[0]='PO ITEMS: '+get_data.length;}
}
function Get_Data_Line_SubList(get_vendor,get_item,get_status)
{
  var filters=[];
  if(get_vendor){filters.push(new nlobjSearchFilter("mainname",null,"anyof",get_vendor));}
  if(get_status){filters.push(new nlobjSearchFilter("custcol_vbd_status",null,"anyof",get_status));}
  if(get_item){filters.push(new nlobjSearchFilter("custcolitem_link",null,"anyof",get_item));}
  var results = nlapiSearchRecord("purchaseorder",search_line_item,filters);//,new nlobjSearchColumn('custbody244'));
  if(results)
  {
    get_old_current=true;
    var lines=[];
    var get_col=results[0].getAllColumns();
    for(var x=0; x < results.length; x++)
    {
      if(results[x].getValue("custcol_box_record_po"))
      {
        box_record_create=true;
        button_update_or_create=true;
      }
      else
      {
        box_record_not_create=true;
      }
      
      var packing_insurec=results[x].getValue(get_col[10]);
      if(!packing_insurec){packing_insurec=0;}      
      var insurec=results[x].getValue('custcol_full_insurance_value');
      if(insurec){insurec=parseFloat(insurec);}else{insurec=0;}
      lines.push({
        custpage_list_po_number : results[x].getValue(get_col[0]),
        custpage_list_vendor : results[x].getValue("mainname"),
        custpage_list_item : results[x].getValue("item"),
        custpage_list_description : results[x].getValue(get_col[22]),
        custpage_list_status : results[x].getValue("custcol_vbd_status"),
        custpage_old_list_status:results[x].getValue("custcol_vbd_status"),
        custpage_list_notes : results[x].getValue(get_col[3]),
        custpage_old_list_notes : results[x].getValue(get_col[3]),
        custpage_list_so_imp_notes : results[x].getValue("custbody58"),
        custpage_list_item_link : results[x].getValue(get_col[7]),
        custpage_list_date_sent_from_sf : results[x].getValue("custcol18"),
        custpage_old_list_date_sent_from_sf:results[x].getValue("custcol18"),
        custpage_list_delivery_date: results[x].getValue(get_col[9]),
        custpage_list_insurance_value : insurec,
        custpage_list_insurance_value_old:insurec,
        custpage_list_so_number : results[x].getValue(get_col[11]),
        custpage_list_gem_notif : results[x].getValue("custbody244","createdfrom"),
        custpage_old_list_gem_notif : '',
        custpage_specific_gem_pulled: results[x].getValue(get_col[23]),
        custpage_list_changed:'F',
        custpage_list_history : "<a class='dottedlink' href='javascript:void nlOpenWindow(%22/app/accounting/transactions/history.nl?id=" + results[x].getId() + "&amp;line=" + results[x].getValue("line") + "%22,%22historypopup%22,%22width=750,height=1000,resizable=yes,scrollbars=yes%22)' onclick='setWindowChanged(window,false);'>History</a>",
        custpage_list_box_created :results[x].getValue(get_col[13]),
        custpage_list_box_id:results[x].getValue("custcol_box_record_po"),
        custpage_list_po_document_number:results[x].getValue("tranid"),
        custpage_list_packing_slip_description:results[x].getValue(get_col[4]),
        custpage_list_packing_slip_insurnce_value: packing_insurec,
        custpage_list_po : results[x].getId(),
        custpage_list_po_line : results[x].getValue("lineuniquekey"),
      });
    }
    return lines;
  }
}