/*
Script Author : 	Sandeep Kumar ([sandeep.kumar@inoday.com](mailto:sandeep.kumar@inoday.com))
Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
Script Type : 		Suitescript (Library Script)
Script Name :		PO Receive Dashboard - Suitelet.js
Comments :		Suitelet for PO Receive Dashboard
SS URL :		
Script URL:		

Modification Details:
Modified On:		06/27/2018
Modified By:		Nikhil Bhutani
Task Related:		NS-1240
Script Name :		PO Receive Dashboard - Suitelet_V1.js
Description:		Adding Delivery Date Column and highlighting the rows based on certain conditions

*/

var divided_size = 100;
var paging_size = 99;
//var saved_item_search='customsearch_gemstone_melee_reorder_sear'; // Production
var saved_po_search='customsearch_po_receive_dash' // Sandbox - 8019

function bindPOReceiveDashboard(request, response) {
  if (request.getMethod() == 'GET') {
    var form = nlapiCreateForm('Purchase Order Receive Dashboard', false, false);
   // form.addTab("custpage_items_tab", "Items");
    form.addTab("custpage_pos_tab", "POs");
    
    //Run Scheduled Script 
     nlapiLogExecution('debug','Schedule Script',request.getParameter("scheduled"));
    var IsScheduled=request.getParameter("scheduled");
    
    if(IsScheduled)
      {
    	if(IsScheduled=='Yes')
        {
           nlapiLogExecution('debug','Schedule Script','Start Running');
          nlapiScheduleScript('customscript_auto_rec_po_schld' , 'customdeploy_auto_rec_po_schld');
        }
      }
  
    
    //Client Script to work with
    form.setScript('customscript_po_rec_dash_client');
   
    var results = getResult(request);
    var obj_result, number_of_result,vendorArr;
    obj_result = results[0];
    number_of_result = results[1];
    vendorArr=results[2];
    nlapiLogExecution('debug','No of Result',number_of_result);
	
   bindPOslist(form, obj_result, number_of_result,vendorArr);
   
   
      Use_Java_Script(form);
    response.writePage(form);
  }
}

function getResult(request) {

  var page_number = request.getParameter("get_page_index");
 // var tab_name = request.getParameter("machine");
  var number_of_record = '';
  var load_search;
	  var filter=getFilter(request);
	 var result=  nlapiSearchRecord(null, 'customsearch_po_receive_dash', filter, new nlobjSearchColumn('internalid', null, 'COUNT'));

	  if (result) {
        var col=result[0].getAllColumns();
		number_of_record = result[0].getValue(col[0]);
	  } else {
		number_of_record = 0; // nlapiSearchRecord(null, saved_item_search);
	  }
	  nlapiLogExecution('debug','filter lenght',filter.length);
	  load_search = nlapiLoadSearch(null, saved_po_search);

      var searchFilters=load_search.getFilters();
      var vendors=  nlapiSearchRecord('purchaseorder', null,searchFilters,  new nlobjSearchColumn('name',null,'group'));
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
	  if(filter.length>0)
	  {
		for(var f=0;f<filter.length;f++)
		{
		  load_search.addFilter(filter[f]);
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
  var deployement = nlapiLoadRecord('scriptdeployment', 8945);
  deployement.setFieldValue('custscript_po_rec_no_of_records', number_of_record);
  deployement.setFieldValue('custscript_po_rec_page_index', page_number);
  nlapiSubmitRecord(deployement);

  return [results_value, number_of_record,arrVendors];

}

function getFilter(request)
{

  var filter=[];
  var search_key=request.getParameter("search_key");
  var vendor_id=request.getParameter("vendor_id");

  
 if(vendor_id)
  {
    filter.push(new nlobjSearchFilter('name',null,'anyof',vendor_id)); 
  }
  

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
  fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_search_key,get_sublist;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var vendor_id,get_sublist,get_page_index;";
  fieldValue += "if(get_id=='search_key_items')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_items').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2100&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&vendor_id='+vendor_id+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "return false;";
  fieldValue += " }";
  fieldValue += "});";

  fieldValue += "jQuery(document).ready(function(){";

  fieldValue += "jQuery('input[name=nextcustpage_posidx]').attrchange({ ";
  fieldValue += "callback: function(e) {";
   fieldValue +="jQuery('input[id^=inpt_custpage_dropship_new]').each(function(){";
	 fieldValue +="var dropship = jQuery(this).val();";
    
	 fieldValue +="if(dropship=='Yes'){";
     
	fieldValue +="jQuery(this).parent().parent().parent().children().each(function(){";
	fieldValue +="jQuery(this).style('background-color','#ffe0e3','important');";
	// code added by Bhutani NS-1240 on 27/6/18 
	fieldValue +=" });";
	fieldValue +="}";  
	fieldValue +=" });";
  	fieldValue +="jQuery('input[name^=custpage_delivery_date_flag]').each(function(){";
	fieldValue +="var deliverydate_flag = jQuery(this).val();";
	fieldValue +="if(deliverydate_flag=='1'){";
	fieldValue +="jQuery(this).parent().parent().children().each(function(){";
	fieldValue +="jQuery(this).style('background-color','#ffeead','important');";
	// end code added by Bhutani NS-1240 on 27/6/18 
	fieldValue +=" });";
	fieldValue +="}";
	fieldValue +="});";
 
  fieldValue +="var hit_from= jQuery('#custpage_is_receive').val();";
  fieldValue +="if(hit_from=='receive'){";
  fieldValue +="jQuery('#lst_vendors').val('');";
   fieldValue +="jQuery('#custpage_is_receive').val('');";
   fieldValue +="}";
  
  fieldValue += "var record_page=nlapiLoadRecord('scriptdeployment',8945);";
  fieldValue += "var numOrders=parseInt(record_page.getFieldValue('custscript_po_rec_no_of_records'));";
  fieldValue += "var selectedPageIndex=parseInt(record_page.getFieldValue('custscript_po_rec_page_index'));";
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

  fieldValue += "jQuery('#custpage_pos_tabtxt,.btn_search_key').click(function(){";
  fieldValue +="var load_img='color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:22px;font-weight:bold;';";
  fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var get_page_index;";
  fieldValue += "var vendor_id='',get_search_key='';";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "if(get_id=='custpage_pos_tabtxt')";
  fieldValue += "{";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "}";
   fieldValue += "else if(get_id=='btn_search_key_items')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_items').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendor').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2100&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&vendor_id='+vendor_id+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "jQuery('.page_all_pageing').change(function(){";
   fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "var get_page_index;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "var vendor_id='';";
  fieldValue += "if(get_id=='page_all_pageing_pos')";
  fieldValue += "{";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_pos').val();";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2100&r=T&deploy=1&machine=custpage_pos&get_page_index='+get_page_index+'&vendor_id='+vendor_id;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";


  fieldValue += "jQuery('#lst_vendors').change(function(){";
  fieldValue += "jQuery('#custpage_pos_splits').html('<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "var vendor_id,get_sublist,get_page_index;";
  fieldValue += "vendor_id=jQuery('#lst_vendors').val();";
  fieldValue += "get_page_index=1;";
  fieldValue += "get_sublist='custpage_pos';";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=2100&deploy=1&r=T&machine='+get_sublist+'&get_page_index='+get_page_index+'&vendor_id='+vendor_id;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";

  fieldValue += "});";
  fieldValue += "</script>";
  form.addField('custpage_test_script', 'INLINEHTML').defaultValue = fieldValue;
}