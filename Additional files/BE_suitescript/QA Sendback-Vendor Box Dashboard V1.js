function add_qa_sandbox_sublist(form,get_vendor,get_item,get_status,record_content)
{
  var qa_list=form.addSubList("custpage_qa_list","list","QA Sendback");
  qa_list.addField("custpage_qa_list_qa_record_id","select","Qa Record","customrecord32").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_qa_vendor_id","select","QA Vendor","vendor").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_po","text","PO Number");
  qa_list.addField("custpage_qa_list_so","text","Sales Order");
  qa_list.addField("custpage_qa_list_item_master_id","select","Item","item").setDisplayType("inline");
  qa_list.addField("custpage_qa_list_insurance_val","currency","Insurance Value").setDisplayType('entry');
  qa_list.addField("custpage_qa_list_qa_type","text","Type Of QA");
  qa_list.addField("custpage_qa_list_qa_box_created","checkbox","Box Created").setDisplayType("inline");
    qa_list.addField("custpage_qa_list_insurance_val_old","currency","Insurance Value").setDisplayType('hidden');
  qa_list.addField("custpage_qa_list_qa_box_id","select","Box ID","customrecord_box_record").setDisplayType("hidden");
  qa_list.addField("memo","textarea","memo").setDisplayType("hidden");
  qa_list.addField("custpage_qa_list_po_id","text","po id").setDisplayType("hidden");
  var get_data=Get_Data_QA_SubList(get_vendor,get_item,get_status);
  if(get_data)
  {
    qa_list.setLineItemValues(get_data);
    record_content[1]='QA SENDBACKS: '+get_data.length;
  }
}
function Get_Data_QA_SubList(get_vendor,get_item,get_status)
{
  var filters=[];
  if(get_vendor){
    filters.push(new nlobjSearchFilter("custrecord_qa_vendor",null,"anyof",get_vendor));
  }
  filters.push(new nlobjSearchFilter("custrecord_qa_vendor",null,"noneOf",'@NONE@'));	
  //var searchresult = nlapiSearchRecord(null,'customsearch_qa_search_dashboard_2',filters,new nlobjSearchColumn('custrecord_box_record_qa',null,'group'));
  var searchresult = nlapiSearchRecord(null,search_qa_sendback,filters);
  if(searchresult)
  {
    get_old_current=true;
    var qa_lines=[];
    var col = searchresult[0].getAllColumns();
    for (var t = 0; t < searchresult.length; t++) 
    {

      var check_qa_box="F";
      if(searchresult[t].getValue('custrecord_box_record_qa',null,'group'))
      {
        check_qa_box="T";
        button_update_or_create=true;
      }
      //5/8
      var insurence=0;
      if(searchresult[t].getValue('custrecord_purchase_order_insurance_qa',null,'group')){insurence=searchresult[t].getValue('custrecord_purchase_order_insurance_qa',null,'group');}
      // else if(searchresult[t].getValue(col[8])){insurence=searchresult[t].getValue(col[8]);}
      qa_lines.push({	
        custpage_qa_list_qa_record_id: searchresult[t].getValue('internalid',null,'group'),
        custpage_qa_list_qa_vendor_id: searchresult[t].getValue('custrecord_qa_vendor',null,'group'),
        custpage_qa_list_po : searchresult[t].getValue('tranid','custrecord_qa_po_number','group'),
        custpage_qa_list_po_id : searchresult[t].getValue('internalid','custrecord_qa_po_number','MAX'),
        custpage_qa_list_so : searchresult[t].getValue('custrecord3',null,'MAX'),
        custpage_qa_list_item_master_id: searchresult[t].getValue('custrecord_item',null,'group'),
        custpage_qa_list_insurance_val :insurence ,
        custpage_qa_list_insurance_val_old :insurence ,
        custpage_qa_list_qa_type : searchresult[t].getText('custrecordtype_of_qa',null,'group'),
        custpage_qa_list_qa_box_created :check_qa_box,
        custpage_qa_list_qa_box_id:searchresult[t].getValue('custrecord_box_record_qa',null,'group'),
        memo:searchresult[t].getValue(col[9]),
      });
    }
    return qa_lines;
  }
}

