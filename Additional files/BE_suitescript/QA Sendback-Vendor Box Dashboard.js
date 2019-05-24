function add_qa_sandbox_sublist(form,get_vendor,get_item,get_status)
{
  var qa_list=form.addSubList("custpage_qa_list","list","QA Sendback");
  qa_list.addField("custpage_qa_list_qa_record_id","select","Qa Record","customrecord32").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_qa_vendor_id","select","QA Vendor","vendor").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_po","text","PO Number");
  qa_list.addField("custpage_qa_list_so","text","Sales Order");
  qa_list.addField("custpage_qa_list_item_master_id","select","Item","item").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_insurance_val","currency","Insurance Value");
  qa_list.addField("custpage_qa_list_qa_type","text","Type Of QA");
  qa_list.addField("custpage_qa_list_qa_box_created","checkbox","Box Created").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_qa_box_id","select","Box ID","customrecord_box_record").setDisplayType("hidden");
  var get_data=Get_Data_QA_SubList(get_vendor,get_item,get_status);
  if(get_data){qa_list.setLineItemValues(get_data);}
}
function Get_Data_QA_SubList(get_vendor,get_item,get_status)
{
  var filters=[];
  if(get_vendor){
    filters.push(new nlobjSearchFilter("custrecord_qa_vendor",null,"anyof",get_vendor));
  }
  filters.push(new nlobjSearchFilter("custrecord_qa_vendor",null,"noneOf",'@NONE@'));
  var searchresult = nlapiSearchRecord(null,'customsearch_qa_search_dashboard',filters);
  if(searchresult)
  {
    var qa_lines=[];
    var col = searchresult[0].getAllColumns();
    for (var t = 0; t < searchresult.length; t++) 
    {
      var check_qa_box="F";
      if(searchresult[t].getValue(col[7]))
      {
        check_qa_box="T";
      }
      qa_lines.push({	
        custpage_qa_list_qa_record_id: searchresult[t].getValue(col[0]),
        custpage_qa_list_qa_vendor_id: searchresult[t].getValue(col[1]),
        custpage_qa_list_po : searchresult[t].getValue(col[2]),
        custpage_qa_list_so : searchresult[t].getValue(col[3]),
        custpage_qa_list_item_master_id: searchresult[t].getValue(col[4]),
        custpage_qa_list_insurance_val : searchresult[t].getValue(col[5]),
        custpage_qa_list_qa_type : searchresult[t].getValue(col[6]),
        custpage_qa_list_qa_box_created :check_qa_box,
        custpage_qa_list_qa_box_id:searchresult[t].getValue(col[7])
      });
    }
    return qa_lines;
  }
}