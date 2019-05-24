function fill_vendor_list(vendor,get_vendor_value)
{
  var all_vendor=[];
  vendor.addSelectOption('','',true);

  var get_line_vendor= nlapiSearchRecord("purchaseorder",null,
                                         [
                                           new nlobjSearchFilter("custcol18",null,"on","today"),
                                           new nlobjSearchFilter("mainline",null,"is","F")
                                         ]
                                         ,new nlobjSearchColumn('mainname',null,'group').setSort('true'));
  if(get_line_vendor)
  {
    var col=get_line_vendor[0].getAllColumns();
    for(var a=0;a<get_line_vendor.length;a++)
    {
      var get_vendor=get_line_vendor[a].getValue(col[0]);
      var get_vendor_text=get_line_vendor[a].getText(col[0]);
      vendor.addSelectOption(get_vendor,get_vendor_text);
      all_vendor.push(get_vendor);
    }
  }

  var get_qa_filter=nlapiLoadSearch(null,'customsearch_qa_search_dashboard').getFilters();
  var filter_qa=[];
  if(all_vendor.length>0)
  {
    filter_qa.push(nlobjSearchFilter("custrecord_qa_vendor",null,"noneOf",all_vendor));
  }
  if(get_qa_filter)
  {
    for(var a=0;a<get_qa_filter.length;a++)
    {
      filter_qa.push(get_qa_filter[a]);
    }
  }



  var searchresult_qa = nlapiSearchRecord('customrecord32',null, filter_qa,new nlobjSearchColumn('custrecord_qa_vendor',null,'group').setSort('true'));
  if(searchresult_qa)
  { 
    var col=searchresult_qa[0].getAllColumns();
    for(var a=0;a<searchresult_qa.length;a++)
    {
      var get_vendor=searchresult_qa[a].getValue(col[0]);
      var get_vendor_text=searchresult_qa[a].getText(col[0]);
      vendor.addSelectOption(get_vendor,get_vendor_text);
      all_vendor.push(get_vendor);
    }
  }



  var get_vendor_filter=nlapiLoadSearch(null,'customsearch_vendor_box_item_search').getFilters();
  var filter_vendor=[];
  if(all_vendor.length>0)
  {
    filter_vendor.push(nlobjSearchFilter("custrecord_vbi_vendor",null,"noneOf",all_vendor));
  }
  if(get_vendor_filter)
  {
    for(var a=0;a<get_vendor_filter.length;a++)
    {
      filter_vendor.push(get_vendor_filter[a]);
    }
  }
  var searchresult_vendor_box = nlapiSearchRecord('customrecord_vendor_box_item',null, filter_vendor,new nlobjSearchColumn('custrecord_vbi_vendor',null,'group').setSort('true'));
  if(searchresult_vendor_box)
  { 
    var col=searchresult_vendor_box[0].getAllColumns();
    for(var a=0;a<searchresult_vendor_box.length;a++)
    {
      var get_vendor=searchresult_vendor_box[a].getValue(col[0]);
      var get_vendor_text=searchresult_vendor_box[a].getText(col[0]);
      vendor.addSelectOption(get_vendor,get_vendor_text);
      all_vendor.push(get_vendor);
    }
  }
  if(get_vendor_value)
  {
    vendor.setDefaultValue(get_vendor_value);
  }
}