var divided_size = 1000;
var paging_size = 999;
//var saved_item_search='customsearch_gemstone_melee_reorder_sear'; // Production
var saved_gemstone_search = 'customsearch_gemstones'; //Sandbox- 7832
var saved_melee_search = 'customsearch_melee'; //Sandbox- 7832
var saved_po_search='customsearch_po_created_from_gem_dash_1' // Sandbox - 7842

function bindGemstoneMeleeDashboard(request, response) {
  if (request.getMethod() == 'GET') {
    var form = nlapiCreateForm('Gemstone/Melee Dashboard', true, true);
    form.addTab("custpage_items_tab", "Gemstones");
    form.addTab("custpage_melee_tab", "Melee");
    form.addTab("custpage_pos_tab", "POs");
    //Client Script to work with
    form.setScript('customscript_gemstone_melee_dash_client');
    nlapiLogExecution('debug','Hit',request.getParameter("machine"));
    var results = getResult(request);
    var obj_result, number_of_result,vendorArr,vendorMeleeArr;
    obj_result = results[0];
    number_of_result = results[1];
    vendorArr=results[2];
     vendorMeleeArr=results[3];
    nlapiLogExecution('debug','No of Result',number_of_result);

    if (request.getParameter("machine") == 'custpage_items') {
      bindGemstoneslist(form, obj_result, number_of_result,vendorArr);
    }
    else if(request.getParameter("machine") == 'custpage_melee')
    {
      bindMeleelist(form, obj_result, number_of_result,vendorMeleeArr);
    }
    else if (request.getParameter("machine") == 'custpage_pos'){
      bindPOslist(form, obj_result, number_of_result);
    }else 
    {
      bindGemstoneslist(form, obj_result, number_of_result,vendorArr);
      bindMeleelist(form, null, null,vendorMeleeArr);
      bindPOslist(form, null, null);
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
  var arrVendors=[]; var arrVendorsMelee=[];

  if (tab_name == 'custpage_pos') {
    var result = nlapiSearchRecord(null, saved_po_search);
    if (result) {
      number_of_record = result.length;
    } else {
      number_of_record = 0; // nlapiSearchRecord(null, saved_invoice_search);
    }

    load_search = nlapiLoadSearch(null, saved_po_search);
  } else {
    var search_id =saved_gemstone_search;
    if(tab_name=='custpage_items') 
    {
      search_id=saved_gemstone_search;
      load_search = nlapiLoadSearch(null, search_id);
      arrVendors=getVendorsList(load_search);
    }else if(tab_name=='custpage_melee')
    {
      search_id=saved_melee_search;
      load_search = nlapiLoadSearch(null, search_id);
      arrVendorsMelee=getVendorsList(load_search);
    }
    else
    {
      load_search = nlapiLoadSearch(null, saved_gemstone_search);
      var  load_search1 = nlapiLoadSearch(null, saved_melee_search);

      arrVendors=getVendorsList(load_search);
      arrVendorsMelee=getVendorsList(load_search1);
    }
    var filter=getFilter(request);
    var result = nlapiSearchRecord(null, search_id,filter);
    if (result) {
      number_of_record =  result.length;
    } else {
      number_of_record = 0; // nlapiSearchRecord(null, saved_item_search);
    }
    nlapiLogExecution('debug','filter lenght',filter.length);



    if(filter.length>0)
    {
      for(var f=0;f<filter.length;f++)
      {
        load_search.addFilter(filter[f]);
      }
    }


  }
  var resultSet = load_search.runSearch();
  var index_page = 0;
  if (page_number) {
    index_page = parseInt(page_number);
    index_page = (index_page - 1);
  }
  var results_value='';
  try
  {
    results_value = resultSet.getResults(index_page, (index_page + (parseInt(paging_size)+1)));
  }
  catch(ex)
  {
    nlapiLogExecution('debug','Error',ex.message);
  }

  if (page_number == null || page_number == '')
    page_number = 1;

  nlapiLogExecution('debug','page number',page_number);
  //Save Number of records and page number index in script parameter
  var deployement = nlapiLoadRecord('scriptdeployment', 8846);
  deployement.setFieldValue('custscript_gem_melee_no_records', number_of_record);
  deployement.setFieldValue('custscript_gem_melee_page_index', page_number);
  nlapiSubmitRecord(deployement);

  return [results_value, number_of_record,arrVendors,arrVendorsMelee];

}
function getVendorsList(load_search)
{
  //Get Vendors
  var searchFilters=load_search.getFilters();
  var vendors=  nlapiSearchRecord('inventoryitem', null,searchFilters,  new nlobjSearchColumn('othervendor',null,'group'));
  var arrVendors=[];
  if(vendors)
  {
    var cols=vendors[0].getAllColumns();
    for(var i=0;i<vendors.length;i++)
    {
      arrVendors.push({
        vendor_id:vendors[i].getValue(cols[0]),
        vendor_name:vendors[i].getText(cols[0])
      });
    }
  }
  //End
  return arrVendors;
}

function getFilter(request)
{

  var filter=[];
  var search_key=request.getParameter("search_key");
  var item_category=request.getParameter("item_category");
  var inventory_loc=request.getParameter("inventory_loc");
  var type_of_gem=request.getParameter("type_of_gem");
  var vendor_id=request.getParameter("vendor_id");

  if(type_of_gem)
  {
    filter.push(new nlobjSearchFilter('custitem4',null,'anyof',type_of_gem)); 
    nlapiLogExecution('debug','Type of Gemstone',type_of_gem);
  }
  if(item_category)
  {
    filter.push(new nlobjSearchFilter('custitem20',null,'anyof',item_category)); 
    nlapiLogExecution('debug','item Categry',item_category);
  }
  if(inventory_loc)
  {
    filter.push(new nlobjSearchFilter('location',null,'anyof',inventory_loc)); 
  }
  if(vendor_id)
  {
    filter.push(new nlobjSearchFilter('othervendor',null,'anyof',vendor_id)); 
  }

  if(search_key)
  {
    filter.push(new nlobjSearchFilter('itemid',null,'contains',search_key));
  }


  return filter;
}


function Use_Java_Script(form) {
  var fieldValue = "<script src='https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js'></script>";
  fieldValue += "<script type='text/javascript'>";

  fieldValue += "jQuery(document).on('keypress', '.search_key', function(e) {";
  fieldValue += "if (e.which == 13) {";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_melee_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_search_key,get_sublist;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var item_category,inventory_loc,vendor_id,type_of_gem,get_sublist,get_page_index;";
  fieldValue += "if(get_id=='search_key_items')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_items').val();";
  fieldValue += "item_category=jQuery('#item_category').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='search_key_melee')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_melee').val();";
  fieldValue += "item_category=jQuery('#item_category_melee').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location_melee').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone_melee').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors_melee').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_melee';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2023&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&item_category='+item_category+'&inventory_loc='+inventory_loc+'&type_of_gem='+type_of_gem+'&vendor_id='+vendor_id+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "return false;";
  fieldValue += " }";
  fieldValue += "});";

  fieldValue += "jQuery(document).ready(function(){";
  fieldValue += "jQuery('input[name=nextcustpage_itemsidx],input[name=nextcustpage_meleeidx],input[name=nextcustpage_posidx]').attrchange({ ";
  fieldValue += "callback: function(e) {";
  
  fieldValue += "var elementHighlight='';";
  fieldValue += "if(this.name=='nextcustpage_itemsidx')";
  fieldValue += "{elementHighlight='custpage_highlight';}";
  fieldValue += "else if (this.name=='nextcustpage_meleeidx')";
  fieldValue += "{elementHighlight='custpage_highlight_melee';}";
  
  fieldValue += "jQuery('input[name^='+elementHighlight+']').each(function() {";
  fieldValue +="if (jQuery(this).val() == 'Yes') {";
  fieldValue +="jQuery(this).parent().parent().children().each(function() {";
  fieldValue +="jQuery(this).style('background-color', '#FFFF33', 'important');";
  fieldValue +="});";
  fieldValue +=" } ";
  fieldValue +="});";
  
  
  fieldValue += "var record_page=nlapiLoadRecord('scriptdeployment',8846);";
  fieldValue += "var numOrders=parseInt(record_page.getFieldValue('custscript_gem_melee_no_records'));";
  fieldValue += "var selectedPageIndex=parseInt(record_page.getFieldValue('custscript_gem_melee_page_index'));";
  fieldValue += "var page_index=jQuery('.number_of_record').val();";
  fieldValue += "var divided_size=1000;var paging_size=999;";
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

  fieldValue += "jQuery('#custpage_items_tabtxt,#custpage_melee_tabtxt,#custpage_pos_tabtxt,.btn_search_key').click(function(){";
  fieldValue +="var load_img='color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:22px;font-weight:bold;';";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_melee_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_page_index;";
  fieldValue += "var item_category='',inventory_loc='',type_of_gem='',vendor_id='',get_search_key='';";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "if(get_id=='custpage_items_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_pos_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_melee_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_melee';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='btn_search_key_items')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_items').val();";
  fieldValue += "item_category=jQuery('#item_category').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='btn_search_key_melee')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_melee').val();";
  fieldValue += "item_category=jQuery('#item_category_melee').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location_melee').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone_melee').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors_melee').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_melee';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2023&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&item_category='+item_category+'&inventory_loc='+inventory_loc+'&type_of_gem='+type_of_gem+'&vendor_id='+vendor_id+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "jQuery('.page_all_pageing').change(function(){";
  fieldValue +="var load_img='<img src=/core/media/media.nl?id=20629559&c=666639&h=293fd0cf75f11ad4a6a9&whence= />';";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_melee_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "var get_page_index;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "var item_category='';";
  fieldValue += "var inventory_loc='';";
  fieldValue += "var vendor_id='';";
  fieldValue += "var type_of_gem='';";
  fieldValue += "if(get_id=='page_all_pageing_items')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_items').val();";
  fieldValue += "item_category=jQuery('#item_category').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_melee')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_melee').val();";
  fieldValue += "item_category=jQuery('#item_category_melee').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location_melee').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone_melee').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors_melee').val();";
  fieldValue += "get_sublist='custpage_melee';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_pos')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_pos').val();";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2023&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&item_category='+item_category+'&inventory_loc='+inventory_loc+'&type_of_gem='+type_of_gem+'&vendor_id='+vendor_id;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";


  fieldValue += "jQuery('#item_category,#inventory_location,#type_of_gemstone,#item_category_melee,#inventory_location_melee,#type_of_gemstone_melee,#lst_vendors,#lst_vendors_melee').change(function(){";
  fieldValue += "jQuery('#custpage_items_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_melee_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var item_category,inventory_loc,type_of_gem,vendor_id,get_sublist,get_page_index;";
  fieldValue += "if(get_id=='item_category' || get_id=='inventory_location' || get_id=='type_of_gemstone' || get_id=='lst_vendors')";
  fieldValue += "{";
  fieldValue += "item_category=jQuery('#item_category').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_items';";
  fieldValue += "}";
  fieldValue += "else";
  fieldValue += "{";
  fieldValue += "item_category=jQuery('#item_category_melee').val();";
  fieldValue += "inventory_loc=jQuery('#inventory_location_melee').val();";
  fieldValue += "type_of_gem=jQuery('#type_of_gemstone_melee').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors_melee').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_melee';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2023&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&item_category='+item_category+'&inventory_loc='+inventory_loc+'&type_of_gem='+type_of_gem+'&vendor_id='+vendor_id;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "});";
  fieldValue += "</script>";
  form.addField('custpage_test_script', 'INLINEHTML').defaultValue = fieldValue;
}