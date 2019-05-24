/** 
 * Script Author : Sandeep Kumar (sksandy28@gmail.com/sandeep.kumar@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet Script
 * Script Job: Dashboard
 * Created Date  : Apr-24, 2018
 * Last Modified Date :  
 * 
*/

//Global variable declaration
var divided_size = 30;
var paging_size = 29;

var divided_size_others = 1000;
var paging_size_others = 999;

var search_id_owned_diamond='customsearch_dia_return_dash_owned_dia';
var search_id_to_be_returned='customsearch_dia_return_dash_mark_return';
//var search_id_create_return='customsearch_dia_return_dash_create_retu';
var search_id_create_return='customsearch_dia_return_dash_create_retu';
var search_id_return_tracking_confrm='customsearch_dia_return_dash_confirm';

function createDiamondReturnDashboard(request, response) {
  if (request.getMethod() == 'GET') {
    var form = nlapiCreateForm('Diamond Return Dashboard', true, true);
    form.addTab("custpage_owned_diamond_tab", "Owned Diamond");
    form.addTab("custpage_to_be_returned_tab", "To Be Returned");
    form.addTab("custpage_create_return_tab", "Create Return");
    form.addTab("custpage_return_tracking_conf_tab", "Return/Tracking Confirmation");

    //Client Script to work with
    form.setScript('customscript_diamond_return_dash_client');
   
    var results,obj_result, number_of_result,vendors=[];

    if (request.getParameter("machine") == 'custpage_owned_diamond') {
      results=null;
      obj_result=null;
      number_of_result=0;
      results = getResult(request,search_id_owned_diamond);
      obj_result = results[0];
      number_of_result = results[1];
    
      bindOwnedDiamondList(form, obj_result, number_of_result);
    } else if (request.getParameter("machine") == 'custpage_to_be_returned') {
       results=null;
      obj_result=null;
      number_of_result=0;
      results = getResult(request,search_id_to_be_returned);
      obj_result = results[0];
      number_of_result = results[1];
      bindToBeReturnedList(form, obj_result, number_of_result);
    }
    else if (request.getParameter("machine") == 'custpage_create_return') {
      results = getResult(request,search_id_create_return);
      obj_result = results[0];
      number_of_result = results[1];
      bindCreateReturnList(form, obj_result, number_of_result);
    }
    else if (request.getParameter("machine") == 'custpage_return_tracking_conf') {
      results = getResult(request,search_id_return_tracking_confrm);
      obj_result = results[0];
      number_of_result = results[1];
      bindReturnTrackingConfrmList(form, obj_result, number_of_result);
    }
    else {
     /* results = getResult(request,search_id_owned_diamond);
      obj_result = results[0];
      number_of_result = results[1];*/
     // bindOwnedDiamondList(form, obj_result, number_of_result);
      bindOwnedDiamondList(form, null, 0);
      bindToBeReturnedList(form, null, 0);
      bindCreateReturnList(form, null, 0);
      bindReturnTrackingConfrmList(form, null, 0);
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
  var filter=getFilters(request,tab_name);
  var arrVendors=[];

  if (tab_name) {

    var result =getTotalRecordsInSearch(search_id,filter);
    number_of_record=result;
    load_search = nlapiLoadSearch(null, search_id);
   //arrVendors= getListOfVendors(load_search);

  } else {
    var result =getTotalRecordsInSearch(search_id_owned_diamond,filter);//nlapiSearchRecord(null, search_id_owned_diamond,filter,new nlobjSearchColumn('internalid', null, 'COUNT'));
    number_of_record=result;
    
    load_search = nlapiLoadSearch(null, search_id_owned_diamond);
    //arrVendors= getListOfVendors(load_search);
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
  if(search_id!='customsearch_dia_return_dash_owned_dia')
  {
      paging_size=paging_size_others;
  }
  var results_value = resultSet.getResults(index_page, (index_page + (parseInt(paging_size)+1)));

  if (page_number == null || page_number == '')
    page_number = 1;
  
  //Save Number of records and page number index in script parameter
  var deployement = nlapiLoadRecord('scriptdeployment', 9418);
  deployement.setFieldValue('custscript_total_no_records_drd', number_of_record);
  deployement.setFieldValue('custscript_page_index_drd', page_number);
  nlapiSubmitRecord(deployement);

  //Return results
  return [results_value, number_of_record];

}

function getFilters(request,sublist)
{

  var filter=[];
  var gemstone_status=request.getParameter("gemstone_status");//cutpage_other_vendor_custpage_owned_diamond
  var othervendor=request.getParameter("othervendor");
  if(gemstone_status)
  {
    filter.push(new nlobjSearchFilter('custitem40',null,'anyof',gemstone_status));
  }
  if(othervendor)
  {
    if(sublist=='custpage_return_tracking_conf')
      filter.push(new nlobjSearchFilter('mainname',null,'anyof',othervendor));
    else
    	filter.push(new nlobjSearchFilter('othervendor',null,'anyof',othervendor));
  }
  return filter;
}
function getListOfVendors(search)
{
  var filters=search.getFilters();
  var results=nlapiSearchRecord('item',null,filters,[new nlobjSearchColumn('entityid','preferredVendor','group').setSort(),new nlobjSearchColumn('internalid','preferredVendor','group')]);
  var arrVendors=[];
  if(results)
  {
    var cols=results[0].getAllColumns();
    for(var i=0;i<results.length;i++)
    {
      arrVendors.push({
        id: results[i].getValue(cols[1]),
        name:results[i].getValue(cols[0])
      });
    }

  }
  return arrVendors;
}
function getTotalRecordsInSearch(searchId,filters)
{
 		 var srchObj = nlapiLoadSearch(null, searchId);
         if(filters.length>0)
          {
            for(var f=0;f<filters.length;f++)
            {
              srchObj.addFilter(filters[f]);
            }
          }
        var results = srchObj.runSearch();
        var length = 0;
        var count = 0, pageSize = 100;
        var currentIndex = 0;
        do{
                count = results.getResults(currentIndex, currentIndex + pageSize).length;
                currentIndex += pageSize;
                length += count;
        }
        while(count == pageSize);
        return length;
}

function Use_Java_Script(form) {
  var fieldValue = "<script src='https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js'></script>";
  fieldValue += "<style> td.redTxt {color: #ff0000 !important;} td.redTxt a{color: #ff0000 !important;}</style>";
  fieldValue += "<script type='text/javascript'>";

  fieldValue += "jQuery(document).ready(function(){";
  fieldValue +="jQuery('#custpage_owned_diamond_tabtxt').click();";
  fieldValue += "jQuery('input[name=nextcustpage_owned_diamondidx],input[name=nextcustpage_to_be_returnedidx],input[name=nextcustpage_create_returnidx],input[name=nextcustpage_return_tracking_confidx]').attrchange({ ";
  fieldValue += "callback: function(e) {";

   fieldValue += "var elementHighlight='';";
  fieldValue += "var colorCode='';";
  fieldValue += "if(this.name=='nextcustpage_return_tracking_confidx')";
  fieldValue += "{elementHighlight='custpage_highlight_rtc';}";
  fieldValue += "else if (this.name=='nextcustpage_to_be_returnedidx')";
  fieldValue += "{elementHighlight='custpage_highlight_tbr';";
  fieldValue +="jQuery('input[name^=inpt_custpage_reason_for_diamd_ret_custpage_to_be_returned]').each(function() {";
  fieldValue +="jQuery(this).parent().style('width', '300px', 'important');})}";
  
  fieldValue +="if(this.name=='nextcustpage_return_tracking_confidx' || this.name=='nextcustpage_to_be_returnedidx')";
  fieldValue +="{"
  fieldValue += "jQuery('input[name^='+elementHighlight+']').each(function() {";
  fieldValue +="if (jQuery(this).val() != '') {";
 // fieldValue +="colorCode=jQuery(this).val();";
   fieldValue +="colorCode=jQuery(this).val().split('-')[0];";
  fieldValue +="var textHighlight=jQuery(this).val().split('-')[1];";
  fieldValue +="jQuery(this).parent().parent().children().each(function() {";
  fieldValue +="if(colorCode != '')";
  fieldValue +="{";
  fieldValue +="jQuery(this).style('background-color', colorCode, 'important');";
  fieldValue +="}";
   fieldValue +="if(textHighlight=='1')";
  fieldValue +="{";
   fieldValue +="jQuery(this).style('color', '#ff0000', 'important');";
   fieldValue +="jQuery(this).children().style('color', '#ff0000', 'important');";
 //  fieldValue +="jQuery(this).addClass('redTxt');";
  fieldValue +="}";
  fieldValue +="});";
  fieldValue +=" } ";
  fieldValue +="});";
  fieldValue +="}"
   
  
  fieldValue += "var record_page=nlapiLoadRecord('scriptdeployment',9418);";
  fieldValue += "var numOrders=parseInt(record_page.getFieldValue('custscript_total_no_records_drd'));";
  fieldValue += "var selectedPageIndex=parseInt(record_page.getFieldValue('custscript_page_index_drd'));";
  fieldValue += "var page_index=jQuery('.number_of_record').val();";
  fieldValue += "var divided_size=30;var paging_size=29;";
  fieldValue += "if(this.name=='nextcustpage_owned_diamondidx')";
  fieldValue += "{";
  fieldValue += "divided_size=30;var paging_size=29;";
  fieldValue += "}";
  fieldValue += "else";
  fieldValue += "{";
  fieldValue += "divided_size=1000;var paging_size=999;";
  fieldValue += "}";
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

  fieldValue += "jQuery('#custpage_owned_diamond_tabtxt,#custpage_to_be_returned_tabtxt,#custpage_create_return_tabtxt,#custpage_ready_to_ship_tabtxt,#custpage_return_tracking_conf_tabtxt').click(function(){";
  fieldValue +="var load_img='color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:22px;font-weight:bold;';";
  fieldValue += "jQuery('#custpage_owned_diamond_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_to_be_returned_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_create_return_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
    fieldValue += "jQuery('#custpage_return_tracking_conf_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.vendors_all').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_page_index;";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
   fieldValue += "var search_id='';";
  fieldValue += "if(get_id=='custpage_owned_diamond_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_owned_diamond').val();";
  fieldValue += "get_sublist='custpage_owned_diamond';";
  fieldValue += "search_id='customsearch_dia_return_dash_owned_dia';";
   fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_to_be_returned_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_to_be_returned').val();";
  fieldValue += "get_sublist='custpage_to_be_returned';";
   fieldValue += "search_id='customsearch_dia_return_dash_mark_return';";
  fieldValue += "}";
   fieldValue += "else if(get_id=='custpage_create_return_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_create_return').val();";
  fieldValue += "get_sublist='custpage_create_return';";
   fieldValue += "search_id='customsearch_dia_return_dash_create_retu';";
  fieldValue += "}";
    fieldValue += "else if(get_id=='custpage_return_tracking_conf_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_return_tracking_conf').val();";
  fieldValue += "get_sublist='custpage_return_tracking_conf';";
   fieldValue += "search_id='customsearch_dia_return_dash_confirm';";
  fieldValue += "}";
  
   fieldValue += "var search = nlapiLoadSearch(null, search_id);";
   fieldValue += "var filters=search.getFilters();";
   fieldValue += "var results='';";
  fieldValue += "if(get_id=='custpage_return_tracking_conf_tabtxt')";
  fieldValue += "{";
  fieldValue += "results=nlapiSearchRecord('itemfulfillment',null,filters,new nlobjSearchColumn('mainname',null,'group').setSort());";
  fieldValue += "}";
   fieldValue += "else";
    fieldValue += "{";
   fieldValue += "results=nlapiSearchRecord('item',null,filters,[new nlobjSearchColumn('entityid','preferredVendor','group').setSort(),new nlobjSearchColumn('internalid','preferredVendor','group')]);";
  fieldValue += "}";
   
  fieldValue += "var arrVendors=[];";
  fieldValue += " if(results)";
   fieldValue += "{";
    fieldValue += " var cols=results[0].getAllColumns();";
   fieldValue += "var html_vendors='';";
  fieldValue +="var default_value='';";
   fieldValue += "html_vendors+='<option value='+default_value+' selected > </option>';";
    fieldValue += " for(var i=0;i<results.length;i++)";
    fieldValue += "{";
   fieldValue += "if(get_id=='custpage_return_tracking_conf_tabtxt')";
  fieldValue += "{";
   fieldValue += "html_vendors+='<option value='+results[i].getValue(cols[0])+' >'+results[i].getText(cols[0])+'</option>';";
   fieldValue += " }";
   fieldValue += "else";
    fieldValue += "{";
   fieldValue += "html_vendors+='<option value='+results[i].getValue(cols[1])+' >'+results[i].getValue(cols[0])+'</option>';";
    fieldValue += " }";
    fieldValue += " }";
    fieldValue += "jQuery('.vendors_all').html(html_vendors);";
   fieldValue += " }";
  
   fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2318&deploy=1&r=T&machine='+get_sublist;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "jQuery('.page_all_pageing').change(function(){";
  fieldValue +="var load_img='<img src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= />';";
  fieldValue += "jQuery('#custpage_owned_diamond_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_to_be_returned_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_create_return_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_return_tracking_conf_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "var get_page_index;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "if(get_id=='page_all_pageing_owned_diamond')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_owned_diamond').val();";
  fieldValue += "get_sublist='custpage_owned_diamond';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_to_be_returned')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_to_be_returned').val();";
  fieldValue += "get_sublist='custpage_to_be_returned';";
  fieldValue += "}";
   fieldValue += "else if(get_id=='page_all_pageing_create_return')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_create_return').val();";
  fieldValue += "get_sublist='custpage_create_return';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_return_tracking_conf')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_return_tracking_conf').val();";
  fieldValue += "get_sublist='custpage_return_tracking_conf';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2318&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";
  
   fieldValue += "jQuery('#inpt_cutpage_gemstone_status1').change(function(){";
  fieldValue +="var load_img='<img src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= />';";
  fieldValue += "jQuery('#custpage_owned_diamond_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
   fieldValue += "var get_page_index;";
  fieldValue += "var get_id=this.id;";
   fieldValue += "alert(get_id);";
  fieldValue += "var get_sublist='';";
  fieldValue += "jQuery('.selected_records').html('0');";
  fieldValue += "if(get_id=='page_all_pageing_owned_diamond')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_owned_diamond').val();";
  fieldValue += "get_sublist='custpage_owned_diamond';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_to_be_returned')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_to_be_returned').val();";
  fieldValue += "get_sublist='custpage_to_be_returned';";
  fieldValue += "}";
   fieldValue += "else if(get_id=='page_all_pageing_create_return')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_create_return').val();";
  fieldValue += "get_sublist='custpage_create_return';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_return_tracking_conf')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_return_tracking_conf').val();";
  fieldValue += "get_sublist='custpage_return_tracking_conf';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2318&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  //fieldValue += "});";
 // fieldValue += "</script>";
  
  
   fieldValue += "jQuery('#gemstone_status_owned_diamond,#vendors_owned_diamond,#gemstone_status_to_be_returned,#vendors_to_be_returned,#gemstone_status_create_return,#vendors_create_return,#vendors_return_tracking_conf').change(function(){";
   fieldValue += "jQuery('#custpage_owned_diamond_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_to_be_returned_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_create_return_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('#custpage_return_tracking_conf_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var gemstone_status='',othervendor='',get_sublist,get_page_index;";
  fieldValue += "if(get_id=='gemstone_status_owned_diamond' || get_id=='vendors_owned_diamond')";
  fieldValue += "{";
  fieldValue += "gemstone_status=jQuery('#gemstone_status_owned_diamond').val();";
  fieldValue += "othervendor=jQuery('#vendors_owned_diamond').val();";
   fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_owned_diamond';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='gemstone_status_to_be_returned' || get_id=='vendors_to_be_returned')";
  fieldValue += "{";
  fieldValue += "gemstone_status=jQuery('#gemstone_status_to_be_returned').val();";
    fieldValue += "othervendor=jQuery('#vendors_to_be_returned').val();";
     fieldValue += "get_page_index=1;";
    fieldValue += "get_sublist='custpage_to_be_returned';";
  fieldValue += "}";
   fieldValue += "else if(get_id=='gemstone_status_create_return' || get_id=='vendors_create_return')";
  fieldValue += "{";
  fieldValue += "gemstone_status=jQuery('#gemstone_status_create_return').val();";
    fieldValue += "othervendor=jQuery('#vendors_create_return').val();";
     fieldValue += "get_page_index=1;";
    fieldValue += "get_sublist='custpage_create_return';";
  fieldValue += "}";
   fieldValue += "else if( get_id=='vendors_return_tracking_conf')";
  fieldValue += "{";
    fieldValue += "othervendor=jQuery('#vendors_return_tracking_conf').val();";
     fieldValue += "get_page_index=1;";
    fieldValue += "get_sublist='custpage_return_tracking_conf';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2318&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&gemstone_status='+gemstone_status+'&othervendor='+othervendor;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "});";
  fieldValue += "</script>";
  
  form.addField('custpage_test_script', 'INLINEHTML').defaultValue = fieldValue;
}