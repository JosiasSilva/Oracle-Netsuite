function add_vendor_box_sublist(form,get_vendor,get_item,get_status)
{
  var vendor_box_list=form.addSubList("custpage_vendor_list","inlineeditor","Vendor Box Item");
  vendor_box_list.addField("custpage_vendor_box_item_name","select","Item Name/Number",'item').setDisplayType("entry").setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_insurance","currency","Insurance").setDisplayType("entry").setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_vendor_master","select","Vendor",'vendor').setDisplayType("entry").setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_note","textarea","Notes").setDisplayType("entry");
  var get_date_send=vendor_box_list.addField("custpage_vendor_box_sf_date","date","Date Sent From SF");
  get_date_send.setDisplayType("entry");
  get_date_send.setDefaultValue(new Date());
  get_date_send.setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_desc","textarea","Description").setDisplayType("entry");
  vendor_box_list.addField("custpage_vendor_box_vendor_box_created","checkbox","Box created").setDisplayType("disabled");
  vendor_box_list.addField("custpage_vendor_box_vendor_box_id","select","Box ID","customrecord_box_record").setDisplayType("hidden");
  var get_data=Get_Data_vendor_box_SubList(get_vendor,get_item,get_status);
  if(get_data){vendor_box_list.setLineItemValues(get_data);}
}
function Get_Data_vendor_box_SubList(get_vendor,get_item,get_status)
{
  var filters=[];
  if(get_vendor){filters.push(new nlobjSearchFilter("custrecord_vbi_vendor",null,"anyof",get_vendor));}
  var searchresult = nlapiSearchRecord(null,'customsearch_vendor_box_item_search',filters);
  if(searchresult)
  {
    var vendor_lines=[];
    var col = searchresult[0].getAllColumns();
    for (var t = 0; t < searchresult.length; t++) 
    {
      vendor_lines.push({
        custpage_vendor_box_item_name : searchresult[t].getValue('custrecord_vbi_item_name_number'),
        custpage_vendor_box_insurance : searchresult[t].getValue('custrecord_vbi_insurance'),
        custpage_vendor_box_vendor_master : searchresult[t].getValue('custrecord_vbi_vendor'),
        custpage_vendor_box_note : searchresult[t].getValue('custrecord_vbi_notes'),
        custpage_vendor_box_sf_date : searchresult[t].getValue('custrecord_vbi_date_sent_from_sf'),
        custpage_vendor_box_desc : searchresult[t].getValue('custrecord_vbi_item_description'),
        custpage_vendor_box_vendor_box_created :"T",
        custpage_vendor_box_vendor_box_id:searchresult[t].getValue('custrecord_vbi_box_record'),
      });
    }
    return vendor_lines;
  }
}