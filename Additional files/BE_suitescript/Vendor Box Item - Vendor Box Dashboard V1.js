function add_vendor_box_sublist(form,get_vendor,get_item,get_status,record_content)
{
  var vendor_box_list=form.addSubList("custpage_vendor_list","inlineeditor","Vendor Box Item");


  vendor_box_list.addField("custpage_vendor_box_item_name","select","Item Name/Number",'item').setDisplayType("entry").setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_insurance","currency","Insurance").setDisplayType("entry").setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_insurance_old","currency","Insurance").setDisplayType("hidden");
  vendor_box_list.addField("custpage_vendor_box_vendor_master","select","Vendor",'vendor').setDisplayType("entry").setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_note","textarea","Notes").setDisplayType("entry");
  var get_date_send=vendor_box_list.addField("custpage_vendor_box_sf_date","date","Date Sent From SF");
  get_date_send.setDisplayType("entry");
  get_date_send.setDefaultValue(new Date());
  get_date_send.setMandatory ( true ) ;
  vendor_box_list.addField("custpage_vendor_box_po_number","select","PURCHASE ORDER","purchaseorder");
  vendor_box_list.addField("custpage_vendor_box_desc","textarea","Description").setDisplayType("entry");
  vendor_box_list.addField("custpage_vendor_box_vendor_box_created","checkbox","Box created").setDisplayType("disabled");
  vendor_box_list.addField("custpage_vendor_box_vendor_box_id","select","Box ID","customrecord_box_record").setDisplayType("hidden");
  vendor_box_list.addField("custpage_line_internal_id","text").setDisplayType("hidden");
  vendor_box_list.addField("custpage_old_record","text").setDisplayType("hidden");
  //vendor_box_list.addField("custpage_vendor_box_po_number","text").setDisplayType("hidden");
  var get_data=Get_Data_vendor_box_SubList(get_vendor,get_item,get_status);
  if(get_data){vendor_box_list.setLineItemValues(get_data);record_content[2]='VENDER BOX ITEMS: '+get_data.length;}
}
function Get_Data_vendor_box_SubList(get_vendor,get_item,get_status)
{
  var filters=[];
  if(get_vendor){filters.push(new nlobjSearchFilter("custrecord_vbi_vendor",null,"anyof",get_vendor));}
  var searchresult = nlapiSearchRecord(null,search_vendor_box_item,filters);
  if(searchresult)
  {

    get_old_current=true;
    var vendor_lines=[];
    var col = searchresult[0].getAllColumns();
    for (var t = 0; t < searchresult.length; t++) 
    {
      //  var po_value=searchresult[t].getText('custrecord_vbi_po_number');
      //   if(po_value)
      //  {
      //  po_value=po_value.replace('Purchase Order #','');
      // }
      var vendor_box_created="F";
      if(searchresult[t].getValue('custrecord_vbi_box_record'))
      {
        vendor_box_created="T";
        button_update_or_create=true;
      }


      vendor_lines.push({
        //   custpage_vendor_box_purchase_order_link:searchresult[t].getValue('custrecord_vbi_po_number'),
        custpage_vendor_box_item_name : searchresult[t].getValue('custrecord_vbi_item_name_numb'),
        custpage_vendor_box_insurance : searchresult[t].getValue('custrecord_vbi_insurance'),
        custpage_vendor_box_insurance_old : searchresult[t].getValue('custrecord_vbi_insurance'),
        custpage_vendor_box_vendor_master : searchresult[t].getValue('custrecord_vbi_vendor'),
        custpage_vendor_box_note : searchresult[t].getValue('custrecord_vbi_notes'),
        custpage_vendor_box_sf_date : searchresult[t].getValue('custrecord_vbi_date_sent_from_sf'),
        custpage_vendor_box_desc : searchresult[t].getValue('custrecord_vbi_item_description'),
        custpage_vendor_box_vendor_box_created :vendor_box_created,
        custpage_vendor_box_vendor_box_id:searchresult[t].getValue('custrecord_vbi_box_record'),
        custpage_line_internal_id:searchresult[t].getId(),
        custpage_vendor_box_po_number:searchresult[t].getValue('custrecord_vbi_po_number'),
        custpage_old_record:"T"
      });
    }
    return vendor_lines;
  }

}