function fill_vendor_list(vendor,get_vendor_value)
{
  var all_vendor=[];

  var search_load=nlapiLoadSearch(null,search_line_item)
  var get_filter=search_load.getFilters();
  var get_line_vendor=nlapiSearchRecord('purchaseorder',null,get_filter,new nlobjSearchColumn('mainname',null,'group').setSort(true));
  if(get_line_vendor)
  {

    for(var a=0;a<get_line_vendor.length;a++)
    {
      var get_vendor=get_line_vendor[a].getValue('mainname',null,'GROUP');
      if(all_vendor.indexOf(get_vendor)==-1)
      {
        var get_vendor_text=get_line_vendor[a].getText('mainname',null,'GROUP');
        vendor.addSelectOption(get_vendor,get_vendor_text);
        all_vendor.push(get_vendor);
      }
    }
  }
  var search_load=nlapiLoadSearch(null,search_qa_sendback)
  var get_filter=search_load.getFilters();
  var get_line_qa_search=nlapiSearchRecord('customrecord32',null,get_filter,new nlobjSearchColumn('custrecord_qa_vendor',null,'group').setSort(true));
  if(get_line_qa_search)
  {
    var col=get_line_qa_search[0].getAllColumns();
    for(var a=0;a<get_line_qa_search.length;a++)
    {
      var get_vendor=get_line_qa_search[a].getValue('custrecord_qa_vendor',null,'group');
      if(all_vendor.indexOf(get_vendor)==-1)
      {
        var get_vendor_text=get_line_qa_search[a].getText('custrecord_qa_vendor',null,'group');
        vendor.addSelectOption(get_vendor,get_vendor_text);
        all_vendor.push(get_vendor);
      }
    }
  }
  var search_load=nlapiLoadSearch(null,search_vendor_box_item)
  var get_filter=search_load.getFilters();
  var searchresult_vendor_box=nlapiSearchRecord('customrecord_vendor_box_item',null,get_filter,new nlobjSearchColumn('custrecord_vbi_vendor',null,'group').setSort(true));
  if(searchresult_vendor_box)
  { 

    for(var a=0;a<searchresult_vendor_box.length;a++)
    {
      var get_vendor=searchresult_vendor_box[a].getValue('custrecord_vbi_vendor',null,'group');
      if(all_vendor.indexOf(get_vendor)==-1)
      {
        var get_vendor_text=searchresult_vendor_box[a].getText('custrecord_vbi_vendor',null,'group');
        vendor.addSelectOption(get_vendor,get_vendor_text);
        all_vendor.push(get_vendor);
      }
    }
  }
  if(get_vendor_value)
  {
    vendor.setDefaultValue(get_vendor_value);
  }
}