//Global variable declaration
var divided_size = 100;
var paging_size = 99
var search_id_select_status='customsearch_item_ship_dash_slct_status'; 
//var search_id_cert_ordered='customsearch_item_ship_dash_cert_ordered'; 
var search_id_pending_items='customsearch_item_ship_dash_pndg_items'; //8275-Sandbox
var search_id_pending_addr='customsearch_item_ship_dash_pndg_addr'; //8372-Sandbox
var search_id_ready_to_ship='customsearch_item_ship_dash_ready_ship'; 

var arr_item_ship_sep_value=['','8','6','9','2','5','1','3','7'];
var arr_item_ship_sep_text=['','Cert Kept for Drop Ship','Comped Item','Materials sent via Email','Materials Shipping Separately','Order Shipped without Appraisal','Order Shipped without Cert','Promo Item Shipping Separately','Refund Check'];

function ItemShippingSepDashboard(request, response) {
  if (request.getMethod() == 'GET') {
    var form = nlapiCreateForm('Items Shipping Separately Dashboard', true, true);
    form.addTab("custpage_select_status_tab", "Select Status");
    form.addTab("custpage_cert_ordered_tab", "Cert Ordered");
    form.addTab("custpage_pending_items_tab", "Pending Item(s)");
    form.addTab("custpage_pending_addr_tab", "Pending Address");
    form.addTab("custpage_ready_to_ship_tab", "Ready to Ship");
    //Client Script to work with
    form.setScript('customscript_item_ship_sep_dash_client');

    var results,obj_result, number_of_result;

    if (request.getParameter("machine") == 'custpage_select_status') {
      results=null;
      obj_result=null;
      number_of_result=0;
      results = getResult(request,search_id_select_status);
      obj_result = results[0];
      number_of_result = results[1];
      bindSelectStatusList(form, obj_result, number_of_result);
    } else if (request.getParameter("machine") == 'custpage_pending_items') {
      results = getResult(request,search_id_pending_items);
      obj_result = results[0];
      number_of_result = results[1];
      bindPendingItemsList(form, obj_result, number_of_result);
    }
    else if (request.getParameter("machine") == 'custpage_pending_addr') {
      results = getResult(request,search_id_pending_addr);
      obj_result = results[0];
      number_of_result = results[1];
      bindPendingAddrList(form, obj_result, number_of_result);
    }
    else if (request.getParameter("machine") == 'custpage_ready_to_ship') {
      results = getResult(request,search_id_ready_to_ship);
      obj_result = results[0];
      number_of_result = results[1];
      bindReadyToShipList(form, obj_result, number_of_result);
    }
    else {
      results = getResult(request,search_id_select_status);
      //	results = getResult(request,search_id_pending_from_vendor);
      obj_result = results[0];
      number_of_result = results[1];
      bindSelectStatusList(form, obj_result, number_of_result);
     // bindCertOrderedList(form, null, null);
      //bindPendingFromVendorList(form, obj_result, number_of_result);
      bindPendingItemsList(form, null, null);
      bindPendingAddrList(form, null, null);
      bindReadyToShipList(form, null, null);
    }
    Use_Java_Script(form);
    response.writePage(form);
  }
}

function getResult(request,search_id) {

  var page_number = request.getParameter("get_page_index");
  var tab_name = request.getParameter("machine");
  var number_of_record = '';
  var load_search;
  var filter=getFilters(request);
  if (tab_name) {

    var result = nlapiSearchRecord(null, search_id, filter,new nlobjSearchColumn('internalid', null, 'COUNT'));
    if (result) {
      var col=result[0].getAllColumns();
      number_of_record = result[0].getValue(col[0]);
    } else {
      number_of_record = 0; 
    }
    load_search = nlapiLoadSearch(null, search_id);

  } else {
    var result = nlapiSearchRecord(null, search_id_select_status,filter,new nlobjSearchColumn('internalid', null, 'COUNT'));
    if (result) {
      var col=result[0].getAllColumns();
      number_of_record = result[0].getValue(col[0]);
    } else {
      number_of_record = 0; 
    }

    load_search = nlapiLoadSearch(null, search_id_select_status);
  }

  //Add filters to the search
  if(filter.length>0)
  {
    for(var f=0;f<filter.length;f++)
    {
      load_search.addFilter(filter[f]);
    }
  }

  // Run search
  var resultSet = load_search.runSearch();
  var index_page = 0;
  if (page_number) {
    index_page = parseInt(page_number);
    index_page = (index_page - 1);
  }
  var results_value = resultSet.getResults(index_page, (index_page + (parseInt(paging_size)+1)));

  if (page_number == null || page_number == '')
    page_number = 1;

  //Save Number of records and page number index in script parameter
  var deployement = nlapiLoadRecord('scriptdeployment', 9265);
  deployement.setFieldValue('custscript_total_no_records_isd', number_of_record);
  deployement.setFieldValue('custscript_page_index_isd', page_number);
  nlapiSubmitRecord(deployement);

  return [results_value, number_of_record];

}

function getFilters(request)
{

  var filter=[];
  var search_key=request.getParameter("search_key");

  if(search_key)
  {
    filter.push(new nlobjSearchFilter('tranid',null,'contains',search_key));
  }

  return filter;
}


function Use_Java_Script(form) {
  var fieldValue = "<script src='https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js'></script>";
  fieldValue += "<script type='text/javascript'>";

  fieldValue += "jQuery(document).on('keypress', '.search_key', function(e) {";
  fieldValue += "if (e.which == 13) {";
  fieldValue += "jQuery('#custpage_select_status_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_addr_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_ready_to_ship_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_search_key,get_sublist;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var item_category,inventory_loc,type_of_gem,get_sublist,get_page_index;";
  fieldValue += "if(get_id=='search_key_select_status')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_select_status').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_select_status';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='search_key_pending_addr')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_pending_addr').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pending_addr';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='search_key_pending_items')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_pending_items').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pending_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='search_key_ready_to_ship')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_ready_to_ship').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_ready_to_ship';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2252&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "return false;";
  fieldValue += " }";
  fieldValue += "});";

  fieldValue += "jQuery(document).ready(function(){";
  fieldValue += "jQuery('input[name=nextcustpage_select_statusidx],input[name=nextcustpage_pending_addridx],input[name=nextcustpage_pending_itemsidx],input[name=nextcustpage_ready_to_shipidx]').attrchange({ ";
  fieldValue += "callback: function(e) {";
  fieldValue += "var record_page=nlapiLoadRecord('scriptdeployment',9265);";
  fieldValue += "var numOrders=parseInt(record_page.getFieldValue('custscript_total_no_records_isd'));";
  fieldValue += "var selectedPageIndex=parseInt(record_page.getFieldValue('custscript_page_index_isd'));";
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
    fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "}";
  fieldValue += "});";

  fieldValue += "jQuery('#custpage_select_status_tabtxt,#custpage_pending_addr_tabtxt,#custpage_pending_items_tabtxt,#custpage_ready_to_ship_tabtxt').click(function(){";
  fieldValue +="var load_img='color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:22px;font-weight:bold;';";
  fieldValue += "jQuery('#custpage_select_status_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_addr_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_ready_to_ship_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_page_index;";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "if(get_id=='custpage_select_status_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_select_status').val();";
  fieldValue += "get_sublist='custpage_select_status';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_pending_addr_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_pending_addr').val();";
  fieldValue += "get_sublist='custpage_pending_addr';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_pending_items_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_pending_items').val();";
  fieldValue += "get_sublist='custpage_pending_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_ready_to_ship_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_ready_to_ship').val();";
  fieldValue += "get_sublist='custpage_ready_to_ship';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2252&deploy=1&r=T&machine='+get_sublist;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "jQuery('.page_all_pageing').change(function(){";
  fieldValue +="var load_img='<img src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= />';";
  fieldValue += "jQuery('#custpage_select_status_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_addr_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_ready_to_ship_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "var get_page_index;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "if(get_id=='page_all_pageing_select_status')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_select_status').val();";
  fieldValue += "get_sublist='custpage_select_status';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_pending_addr')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_pending_addr').val();";
  fieldValue += "get_sublist='custpage_pending_addr';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_pending_items')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_pending_items').val();";
  fieldValue += "get_sublist='custpage_pending_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_ready_to_ship')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_ready_to_ship').val();";
  fieldValue += "get_sublist='custpage_ready_to_ship';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2252&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";
  
  
   fieldValue += "jQuery('.btn_search_key').click(function(){";
   fieldValue += "jQuery('#custpage_select_status_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_addr_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pending_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_ready_to_ship_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_search_key,get_sublist;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var item_category,inventory_loc,type_of_gem,get_sublist,get_page_index;";
  fieldValue += "if(get_id=='btn_search_key_select_status')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_select_status').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_select_status';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='btn_search_key_pending_addr')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_pending_addr').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pending_addr';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='btn_search_key_pending_items')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_pending_items').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pending_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='btn_search_key_ready_to_ship')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_ready_to_ship').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_ready_to_ship';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2252&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "return false;";
  fieldValue += "});";
  
  fieldValue += "});";
  fieldValue += "</script>";
  form.addField('custpage_test_script', 'INLINEHTML').defaultValue = fieldValue;
}