nlapiLogExecution("audit","FLOStart",new Date().getTime());
var or_item_materials_id=['13','7','5','6','15','14','12','18'];
var or_item_materials_text=['Antique Appraisal','Cert','Cleaner','Mats','Mats - Reincorporated','Promotional Item' ,'Work and Release of Liability','Promo Item- Reincorporated'];
var or_item_materials_internal=['antique_appraisal_box','cert_box','cleaner_box','mats_box','mats_reincorporated_box','promotional_item_box','work_and_release_of_liability_box','promo_item_reincorporated'];
var or_item_box_id=['9','4','2','3','11','1','10','16','17'];
var or_item_box_text=['2 Single Boxes','Customer Box','Double Box','Extra Small Box','Pendant Box' ,'Single Box','Single Box - Reincorporated','Double Box Reincorporated','Kraft Box'];
var or_item_box_internal=['two_single_boxes_materials','customer_box_materials','double_box_materials','extra_small_box_materials','pendant_box_materials','single_box_materials','single_box_reincorporated_materials','double_box_reincorporated','kraft_box'];
var location_id=['','2','4','11'];
var location_text=['','San Francisco','Item Sent to SF (Ops Only Status)','Denver'];
var divided_size=50;
var paging_size=49
var date_time=new Date();
var sales_search_one='customsearch_custom_package_record_4';
var save_search_two='customsearch_custom_package_record_2_2';////customsearch_custom_package_record_2_2
var save_searh_three='customsearch_custom_package_record_3_2';
var script_deployement_id='7605';
function OpsReceivingDashboard(request,response)
{
	if(request.getParameter("data_save")=='T')
	{
		Data_Save(request,response);
	}
	else if(request.getParameter("open_popup")=='T')
	{
		BULK_UPDATE_CUSTOM_PACKAGE_RECORD(request,response);
	} 
	else if(request.getParameter("open_popup_drop_off")=='T')
	{
		bulkReceiveDropOff(request,response);
	}  
	else if (request.getMethod() == 'GET') 
	{
    var form = nlapiCreateForm('Ops Receiving Dashboard',true,true);
    form.addTab("custpage_all_tab_one","All Packages");
    form.addTab("custpage_all_tab_two","Post Sale Intake");
    form.addTab("custpage_all_tab_three","Incoming International");
    form.setScript('customscript_ops_rece_dash_client');
    nlapiLogExecution ( 'debug' , 1);
    var get_result=Get_Value(request);
    nlapiLogExecution ( 'debug' ,18);
    var obj_get_result,number_of_result;
    var tab_name=request.getParameter("machine");
    if(tab_name=='custpage_post_sale_intake' )
    {
      obj_get_result=get_result[0];
      number_of_result=get_result[1];
    }
    else if(tab_name=='custpage_incoming_international')
    {
      obj_get_result=get_result[0];
      number_of_result=get_result[1];
    }
    else
    {
      obj_get_result=get_result[0];
      number_of_result=get_result[1];
    }
    nlapiLogExecution ( 'debug' , 19);
    nlapiLogExecution ( 'debug' , 'tab_name',tab_name);
   // if(tab_name=='custpage_post_sale_intake'){Sale_intake_List(form,obj_get_result,number_of_result,tab_name);}
   // else if(tab_name=='custpage_incoming_international'){Incoming_international_List(form,obj_get_result,number_of_result,tab_name);}
   // else{ All_packages_List(form,obj_get_result,number_of_result,tab_name);}
    Sale_intake_List(form,obj_get_result,number_of_result,tab_name);
    Incoming_international_List(form,obj_get_result,number_of_result,tab_name);
    All_packages_List(form,obj_get_result,number_of_result,tab_name);
    nlapiLogExecution ( 'debug' , 20);
    Use_Java_Script(form);
    response.writePage(form);
  }
}

function Get_Value(request)
{
  nlapiLogExecution ( 'debug' , 11);
  var filter_value=Filter_get(request);
  var page_number=request.getParameter("get_page_index");
  var tab_name=request.getParameter("machine");
  var droup_of_value_package=request.getParameter("custbody_drop_off");
  var number_of_record='';
  var load_search;
  if(tab_name=='custpage_post_sale_intake' )
  {
    number_of_record=nlapiSearchRecord(null, save_search_two,filter_value,new nlobjSearchColumn('internalid',null,'count'));
    load_search = nlapiLoadSearch(null, save_search_two);
  }
  else if(tab_name=='custpage_incoming_international')
  {
    number_of_record=nlapiSearchRecord(null, save_searh_three,filter_value,new nlobjSearchColumn('internalid',null,'count'));
    load_search = nlapiLoadSearch(null, save_searh_three);
  }
  else
  {
    nlapiLogExecution ( 'debug' , 12);
    number_of_record=nlapiSearchRecord(null, sales_search_one,filter_value,new nlobjSearchColumn('internalid',null,'count'));
    load_search = nlapiLoadSearch(null, sales_search_one);
    nlapiLogExecution ( 'debug' , 13);
  }
  if(filter_value)
  {
    for(var a=0;a<filter_value.length;a++)
    {
      load_search.addFilter(filter_value[a]);
    }
  }
  var resultSet = load_search.runSearch();
  var index_page_package=0;
  if(page_number)
  {
    if(page_number){index_page_package=parseInt(page_number);}
    index_page_package=(index_page_package-1);
  }
  var results_value = resultSet.getResults(index_page_package,(index_page_package+paging_size));
  if(number_of_record)
  {
    var col=number_of_record[0].getAllColumns();
    number_of_record=number_of_record[0].getValue(col[0]);
  }
  nlapiLogExecution ( 'debug' , 14);
  var deployement=nlapiLoadRecord('scriptdeployment',7829);
  nlapiLogExecution ( 'debug' , 15);
  deployement.setFieldValue('custscript_get_data_opps_recive',number_of_record);
  nlapiLogExecution ( 'debug' , 16);
  nlapiSubmitRecord ( deployement) ;
  nlapiLogExecution ( 'debug' , 17);
  return [results_value,number_of_record];

}

function Filter_get(request)
{

  var filter=[];
  var all_searh_key_pakage=request.getParameter("search_key");
  var droup_of_value_package=request.getParameter("custbody_drop_off");
  var custrecord_status=request.getParameter("custrecord_status");
  var all_pakage_team_id=request.getParameter("all_pakage_team_id");
  var tab_name=request.getParameter("machine");

  if(tab_name)
  {

    if(tab_name=='custpage_all_packages' || tab_name=='custpage_post_sale_intake')
    {
      if(droup_of_value_package=='1' || droup_of_value_package=='2')
      {
        filter.push(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','anyof',droup_of_value_package));
        filter.push(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T'));
      }
      else if(droup_of_value_package=='0')
      {
        filter.push(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','noneof','@NONE@')); 
        filter.push(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T'));
      }
      if(tab_name=='custpage_all_packages')
      {

        if(all_pakage_team_id )
        {
          if(all_pakage_team_id=='0' )
          {
            filter.push(new nlobjSearchFilter('custrecord_team',null,'noneof','@NONE@'));
          }
          else
          {
            filter.push(new nlobjSearchFilter('custrecord_team',null,'anyof',all_pakage_team_id));
          }

        }
        if(custrecord_status)
        {
          filter.push(new nlobjSearchFilter('custrecord_status',null,'anyof',custrecord_status));
        }
      }
    }
    if(all_searh_key_pakage)
    {
      // filter.push(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_pakage).setOr(true).setLeftParens('1'));
      filter.push(new nlobjSearchFilter('tranid','custrecord_transaction_record','contains',all_searh_key_pakage).setOr(true).setLeftParens('1'));
      filter.push(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_pakage).setRightParens('1'));
    }

  }
  return filter;
}



function Use_Java_Script(form)
{
  var fieldValue = "<script src='https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js'></script>";
  fieldValue += "<script type='text/javascript'>";

  fieldValue += "jQuery(document).on('keypress', '.search_key', function(e) {";
  fieldValue += "if (e.which == 13) {";
  fieldValue += "jQuery('#custpage_all_packages_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('#custpage_post_sale_intake_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('#custpage_incoming_international_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "jQuery('.date_time_value').html(new Date());";
  fieldValue += "var get_droup_off,get_team,get_status,get_search_key,get_sublist;";
  fieldValue += "var get_id=this.id;";
  fieldValue += "if(get_id=='search_key_all_pakage')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_all_package').val();";
  fieldValue += "get_team=jQuery('#team_all_package').val();";
  fieldValue += "get_status=jQuery('#status_all_package').val();";
  fieldValue += "get_search_key=jQuery('#search_key_all_pakage').val();";
  fieldValue += "get_sublist='custpage_all_packages';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='search_key_sale_intake')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_sales_intake').val();";
  fieldValue += "get_search_key=jQuery('#search_key_sale_intake').val(); ";
  fieldValue += "get_sublist='custpage_post_sale_intake';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='search_key_incoming_international')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_incoming_international').val(); ";
  fieldValue += "get_sublist='custpage_incoming_international'; ";  
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine='+get_sublist+'&custbody_drop_off='+get_droup_off+'&all_pakage_team_id='+get_team+'&custrecord_status='+get_status+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "return false;";
  fieldValue += " }";
  fieldValue += "});";


  fieldValue += "jQuery(document).ready(function(){";
  fieldValue += "jQuery('#refreshcustpage_all_packages,#refreshcustpage_post_sale_intake ,#refreshcustpage_incoming_international').click(function(){";
  fieldValue += "jQuery('#custpage_all_packages_splits').html('<div>Please wait...</div>');";
  fieldValue += "jQuery('#custpage_post_sale_intake_splits').html('<div>Please wait...</div>');";
  fieldValue += "jQuery('#custpage_incoming_international_splits').html('<div>Please wait...</div>');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.date_time_value').html(new Date());";
  fieldValue += "jQuery('.search_key').val('');";
  fieldValue += "jQuery('#status_all_package').val('');";
  fieldValue += "jQuery('#team_all_package').val('');";
  fieldValue += "jQuery('.droup_off_value').val('');";


  fieldValue += "});";


  fieldValue += "jQuery('#custpage_open_popup,input[name=nextcustpage_all_packagesidx],input[name=nextcustpage_post_sale_intakeidx],input[name=nextcustpage_incoming_internationalidx]').attrchange({ ";
  fieldValue += "callback: function(e) {";
  fieldValue += "jQuery('.date_time_value').html(new Date());";
  // fieldValue += "var old_page_data=jQuery('.number_of_record_hide').val();";
  //fieldValue += "if(!old_page_data)";
  // fieldValue += "{";
  fieldValue += "var record_page=nlapiLoadRecord('scriptdeployment',7829);";
  fieldValue += "var numOrders=parseInt(record_page.getFieldValue('custscript_get_data_opps_recive'));";
  fieldValue += "var page_index=jQuery('.number_of_record').val();";
  fieldValue += "var divided_size=50;var paging_size=49;";
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
  fieldValue += "html_index+='<option value='+index+'>'+index + ' - ' + nextIndex+'</option>';";
  fieldValue += "index = nextIndex + 1;";
  fieldValue += "}";
  fieldValue +="jQuery('.page_all_pageing').html(html_index);" ;
  fieldValue += "jQuery('.number_of_record').html(numOrders);";
  fieldValue += "jQuery('.number_of_record_hide').val(numOrders);";
  // fieldValue += "}";
  fieldValue += "}";
  fieldValue += "});";







  fieldValue += "jQuery('#custpage_all_tab_onetxt,#custpage_all_tab_twotxt,#custpage_all_tab_threetxt,.btn_search_key').click(function(){";
  fieldValue += "jQuery('#custpage_all_packages_splits').html('<center><div>Please wait...</div><center>');";
  fieldValue += "jQuery('#custpage_post_sale_intake_splits').html('<center><div>Please wait...</div><center>');";
  fieldValue += "jQuery('#custpage_incoming_international_splits').html('<center><div>Please wait...</div><center>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "jQuery('.date_time_value').html(new Date());";
  fieldValue += "var get_droup_off,get_team,get_status,get_search_key,get_page_index;";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "if(get_id=='custpage_all_tab_onetxt' || get_id=='btn_search_key_all_pakage')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_all_package').val();";
  fieldValue += "get_team=jQuery('#team_all_package').val();";
  fieldValue += "get_status=jQuery('#status_all_package').val();";
  fieldValue += "get_search_key=jQuery('#search_key_all_pakage').val();";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_all_package').val();";
  fieldValue += "get_sublist='custpage_all_packages';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_all_tab_twotxt' || get_id=='btn_search_key_sale_intake')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_sales_intake').val();";
  fieldValue += "get_search_key=jQuery('#search_key_sale_intake').val(); ";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_sale_intake').val();";
  fieldValue += "get_sublist='custpage_post_sale_intake';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='custpage_all_tab_threetxt' || get_id=='btn_search_key_incoming_international')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_incoming_international').val(); ";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_incoming_international').val();";
  fieldValue += "get_sublist='custpage_incoming_international'; ";  
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine='+get_sublist+'&custbody_drop_off='+get_droup_off+'&all_pakage_team_id='+get_team+'&custrecord_status='+get_status+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";



  fieldValue += "jQuery('.page_all_pageing').change(function(){";
  fieldValue += "jQuery('#custpage_all_packages_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('#custpage_post_sale_intake_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('#custpage_incoming_international_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "var get_droup_off,get_team,get_status,get_search_key,get_page_index;";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";
  fieldValue += "if(get_id=='page_all_pageing_all_package')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_all_package').val();";
  fieldValue += "get_team=jQuery('#team_all_package').val();";
  fieldValue += "get_status=jQuery('#status_all_package').val();";
  fieldValue += "get_search_key=jQuery('#search_key_all_pakage').val();";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_all_package').val();";
  fieldValue += "get_sublist='custpage_all_packages';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_sale_intake')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_sales_intake').val();";
  fieldValue += "get_search_key=jQuery('#search_key_sale_intake').val(); ";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_sale_intake').val();";
  fieldValue += "get_sublist='custpage_post_sale_intake';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='page_all_pageing_incoming_international')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_incoming_international').val(); ";
  fieldValue += "get_page_index=jQuery('#page_all_pageing_incoming_international').val();";
  fieldValue += "get_sublist='custpage_incoming_international'; ";  
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine='+get_sublist+'&custbody_drop_off='+get_droup_off+'&all_pakage_team_id='+get_team+'&custrecord_status='+get_status+'&search_key='+get_search_key+'&get_page_index='+get_page_index;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";





  fieldValue += "jQuery('.btn_search_key,.droup_off_value,#status_all_package,#team_all_package').change(function(){";
  fieldValue += "jQuery('#custpage_all_packages_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('#custpage_post_sale_intake_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('#custpage_incoming_international_splits').html('<center><div>Please wait..</div><center>');";
  fieldValue += "jQuery('.page_all_pageing').html('');";
  fieldValue += "jQuery('.number_of_record').html('0');";
  fieldValue += "jQuery('.number_of_record_hide').val('');";
  fieldValue += "jQuery('.date_time_value').html(new Date());";
  fieldValue += "var get_droup_off,get_team,get_status,get_search_key;";
  fieldValue += "var  get_id=this.id;";
  fieldValue += "var get_sublist='';";


  fieldValue += "if(get_id=='status_all_package' || get_id=='team_all_package'  || get_id=='droup_off_value_all_package' ||  get_id=='btn_search_key_all_pakage')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_all_package').val();";
  fieldValue += "get_team=jQuery('#team_all_package').val();";
  fieldValue += "get_status=jQuery('#status_all_package').val();";
  fieldValue += "get_search_key=jQuery('#search_key_all_pakage').val();";
  fieldValue += "get_sublist='custpage_all_packages';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='droup_off_value_sales_intake'|| get_id=='btn_search_key_sale_intake')";
  fieldValue += "{";
  fieldValue += "get_droup_off=jQuery('#droup_off_value_sales_intake').val();";
  fieldValue += "get_search_key=jQuery('#search_key_sale_intake').val(); ";
  fieldValue += "get_sublist='custpage_post_sale_intake';";
  fieldValue += "}";
  fieldValue += "else if(get_id=='btn_search_key_incoming_international')";
  fieldValue += "{";
  fieldValue += "get_search_key=jQuery('#search_key_incoming_international').val(); ";
  fieldValue += "get_sublist='custpage_incoming_international'; ";  
  fieldValue += "}";
  fieldValue += "var url_hit='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine='+get_sublist+'&custbody_drop_off='+get_droup_off+'&all_pakage_team_id='+get_team+'&custrecord_status='+get_status+'&search_key='+get_search_key;";
  fieldValue += "document.getElementById('server_commands').src=url_hit;";
  fieldValue += "});";




  fieldValue += "});";
  fieldValue += "</script>";
  form.addField('custpage_test_script','INLINEHTML').defaultValue=fieldValue;
}




