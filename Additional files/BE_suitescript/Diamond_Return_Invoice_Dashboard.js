var divided_size = 100;
var paging_size = 99
var saved_item_search='customsearchdiamonds_to_be_returned_da_2'; //Production
//var saved_item_search = 'customsearchiamonds_to_be_returned_das_2'; //Sandbox
var saved_invoice_search='customsearchreturn_invoice_dashboard_2'; //Production
//var saved_invoice_search = 'customsearchreturn_invoice_dashboard_2';//Sandbox

function diamondReturnInvDashboard(request, response) {
  if (request.getParameter("data_save") == 'T') {
    Data_Save(request, response);
  } else if (request.getParameter("open_popup") == 'T') {
    BULK_UPDATE_CUSTOM_PACKAGE_RECORD(request, response);
  } else if (request.getMethod() == 'GET') {
    var form = nlapiCreateForm('Diamond Return Invoice Dashboard', true, true);
    form.addTab("custpage_items_tab", "Items");
    form.addTab("custpage_invoices_tab", "Invoices");
    //Client Script to work with
    form.setScript('customscript_diamond_return_invce_client'); //Sandbox
    //  form.setScript('customscript_diamond_return_invce_client'); //Production
    var results = getResult(request);
    var obj_result, number_of_result;
    obj_result = results[0];
    number_of_result = results[1];

    if (request.getParameter("machine") == 'custpage_invoices') {
      bindInvoiceslist(form, obj_result, number_of_result);
    } else if (request.getParameter("machine") == 'custpage_items') {
      bindItemslist(form, obj_result, number_of_result);
    } else {
      bindItemslist(form, obj_result, number_of_result);
      bindInvoiceslist(form, null, null);
    }

    Use_Java_Script(form);
    response.writePage(form);
  }
}

function getResult(request) {

  var page_number = request.getParameter("get_page_index");
  var tab_name = request.getParameter("machine");
  var number_of_record = '';
  var load_search;
  if (tab_name == 'custpage_invoices') {
    var result = nlapiSearchRecord(null, saved_invoice_search);
    if (result) {
      number_of_record = result.length;
    } else {
      number_of_record = 0; // nlapiSearchRecord(null, saved_invoice_search);
    }

    load_search = nlapiLoadSearch(null, saved_invoice_search);
  } else {
    var filter=[];
    var vr_status=request.getParameter("vr_status");
    nlapiLogExecution('debug','vr status',vr_status);
    if(vr_status)
    {
      filter.push(new nlobjSearchFilter('custitem_vendor_return_status',null,'anyof',vr_status));
    }
    var result = nlapiSearchRecord(null, saved_item_search,filter);
    if (result) {
      number_of_record = result.length;
    } else {
      number_of_record = 0; // nlapiSearchRecord(null, saved_item_search);
    }

    load_search = nlapiLoadSearch(null, saved_item_search);
    if(filter.length>0)
    {
      load_search.addFilter(filter[0]);
    }
  }

  var resultSet = load_search.runSearch();
  var index_page = 0;
  if (page_number) {
    if (page_number) {
      index_page = parseInt(page_number);
    }
    index_page = (index_page - 1);
  }
  var results_value = resultSet.getResults(index_page, (index_page + paging_size));

  if (page_number == null || page_number == '')
    page_number = 1;

  //Save Number of records and page number index in script parameter
  //var deployement = nlapiLoadRecord('scriptdeployment', 8789);//Sandbox 
  var deployement = nlapiLoadRecord('scriptdeployment', 8816);//Production
  deployement.setFieldValue('custscript_number_of_records', number_of_record);
  deployement.setFieldValue('custscript_page_index', page_number);
  nlapiSubmitRecord(deployement);

  return [results_value, number_of_record];

}



function Use_Java_Script(form) {
  var fieldValue = "<script src='https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js'></script>";
  fieldValue += "<script type='text/javascript'>";

  fieldValue += "jQuery(document).ready(function(){";

  fieldValue += "jQuery('input[name=nextcustpage_itemsidx],input[name=nextcustpage_invoicesidx]').attrchange({ ";
  fieldValue += "callback: function(e) {";
  fieldValue += "document.getElementById('selected_records_items').innerHTML=0;";
  fieldValue += "var record_page=nlapiLoadRecord('scriptdeployment',8816);";
  fieldValue += "var numOrders=parseInt(record_page.getFieldValue('custscript_number_of_records'));";
  fieldValue += "var selectedPageIndex=parseInt(record_page.getFieldValue('custscript_page_index'));";
  fieldValue += "var page_index=jQuery('.number_of_record').val();";
  fieldValue += "var divided_size=100;var paging_size=99;";
  fieldValue += "var index = 1;";
  fieldValue += "var defaultSel = 1;";
  fieldValue += "if(page_index)";
  fieldValue += "{";
  fieldValue += "defaultSel = parseInt(page_index);";
  fieldValue += "}";
  fieldValue += "var html_index='';";
  fieldValue += "for(var i=0; i < Math.ceil(numOrders / divided_size); i++)";
  fieldValue += "{";
  fieldValue += " var isDefault = false;";
  fieldValue += "if(defaultSel == index)";
  fieldValue += "isDefault = true;";
  fieldValue += "var nextIndex = index + paging_size;";
  fieldValue += "if(nextIndex > numOrders)";
  fieldValue += "nextIndex = numOrders;";
  fieldValue += "if(index==selectedPageIndex)";
  fieldValue += "html_index+='<option value='+index+' selected >'+index + ' - ' + nextIndex+'</option>';";
  fieldValue += "else ";
  fieldValue += "html_index+='<option value='+index+' >'+index + ' - ' + nextIndex+'</option>';";
  fieldValue += "index = nextIndex + 1;";
  fieldValue += "}";
  fieldValue += "jQuery('.page_all_pageing').html(html_index);";
  fieldValue += "jQuery('.number_of_record').html(numOrders);";
  fieldValue += "jQuery('.number_of_record_hide').val(numOrders);";
  fieldValue += "}";
  fieldValue += "});";

  fieldValue += "jQuery('#custpage_items_tabtxt,#custpage_invoices_tabtxt').click(function(){";
  fieldValue += "document.getElementById('selected_records_items').innerHTML=0;";
  fieldValue +="var load_img='color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:22px;font-weight:bold;';";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_invoices_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "jQuery('#vendor_return_status').val('');";
  fieldValue += "var get_page_index;";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "if(get_id=='custpage_items_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_items').val();";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_invoices_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_invoices').val();";
  fieldValue += "get_sublist='custpage_invoices';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2006&deploy=1&r=T&machine='+get_sublist;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "jQuery('.page_all_pageing').change(function(){";
  fieldValue += "document.getElementById('selected_records_items').innerHTML=0;";
  fieldValue +="var load_img='<img src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= />';";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_invoices_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "var get_page_index;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "var vr_status='';";
  fieldValue += "if(get_id=='page_all_pageing_items')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_items').val();";
  fieldValue += "vr_status=jQuery('#vendor_return_status').val();";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_invoices')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_invoices').val();";
  fieldValue += "get_sublist='custpage_invoices';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2006&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&vr_status='+vr_status;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "jQuery('#vendor_return_status').change(function(){";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_invoices_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var vr_status,get_sublist,get_page_index;";
  fieldValue += "vr_status=jQuery('#vendor_return_status').val();";
  //fieldValue += "get_page_index=jQuery('#page_all_pageing_items').val();";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2006&deploy=1&r=T&machine='+get_sublist+'&vr_status='+vr_status;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "});";
  fieldValue += "</script>";
  form.addField('custpage_test_script', 'INLINEHTML').defaultValue = fieldValue;
}