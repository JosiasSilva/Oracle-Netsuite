function Sale_intake_List(form,obj_get_result,number_of_result,tab_name)
{
  var Sublist_post_sale_intake = form.addSubList('custpage_post_sale_intake', 'list','Post Sale Intake','custpage_all_tab_two');
  Sublist_post_sale_intake.addField('custpage_received_droup_of','checkbox').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_team2','select','Team','customlist_team').setDisplayType('inline');
  Sublist_post_sale_intake.addField('custpage_tracking_id2','text','Tracking#');
  Sublist_post_sale_intake.addField('custpage_box','textarea','Box');
  Sublist_post_sale_intake.addField('custpage_customer','text','Customer');
  Sublist_post_sale_intake.addField('custpage_sales_order_link','text','Transaction Link');
  Sublist_post_sale_intake.addField('custpage_created_form','text','Created From');
  Sublist_post_sale_intake.addField('custpage_tbw_firm_html','textarea','TBW/Firm');
  Sublist_post_sale_intake.addField('custpage_sales_order_notes','textarea','Sales Order Notes');
  Sublist_post_sale_intake.addField('custpage_date_received','date','Date Received').setDisplayType("entry");
  Sublist_post_sale_intake.addField("custpage_location", "textarea", "Location").setDisplayType("hidden");
  Sublist_post_sale_intake.addField("custpage_location_html", "textarea", "Location");
  Sublist_post_sale_intake.addField('custpage_or_items','textarea','OR Items');
  Sublist_post_sale_intake.addField('custpage_status_of_repairs_resizes', 'select', 'Status Of Repairs/Resizes', 'customlist132' );
  Sublist_post_sale_intake.addField('custpage_or_notes','textarea','OR Notes').setDisplayType("entry");
  Sublist_post_sale_intake.addField('custpage_undelivered','checkbox','Undelivered ').setDisplayType("entry");
  Sublist_post_sale_intake.addField('custpage_internal_id_2','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_select_box_id','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_select_materials_id','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_current_line','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_salesorder_id','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_or_items_old','textarea').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_date_received_old','textarea').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_location_old','textarea').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_or_notes_old','textarea').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_status_of_repairs_resizes_old','textarea').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_select_box_id_old','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_select_materials_id_old','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_trans_post_sales','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addField('custpage_record_type_post_sales','text').setDisplayType("hidden");
  Sublist_post_sale_intake.addRefreshButton(); 
  Sublist_post_sale_intake.addButton("custpage_update", "Update Orders","Update_Order_Post_Sale_Intake()");
  var html_subtab= form.addField('cutpage_subtab_post_sale','inlineHTML','',null,'custpage_all_tab_two');
  html_subtab.setDefaultValue("<table width='100%' cellpadding='2'>\
<tr>\
<td width='25%'>\
<h1>Last updated : </h1>\
<span class='date_time_value' id='date_time_value_post_sale_intake'></span>\
</td>\
<td width='25%'><br/>\
<table width='100%' cellpadding='0'>\
<tr>\
<td>\
<input style='width:100%' type='text' class='search_key' id='search_key_sale_intake' placeholder='Search By Tracking Id/ Sales order'>\
</td>\
<td>\
<input type='button' class='btn_search_key' id='btn_search_key_sale_intake' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px -2px;    cursor: pointer;'>\
</td>\
</tr>\
</table>\
</td>\
<td  width='10%' align='right'>\
<table width='100%'>\
<tr>\
<td width='100%'>\
DROP OFF\
<select class='droup_off_value' id='droup_off_value_sales_intake' style='width:100%'>\
<option value=''></option>\
<option value='0'>ALL</option>\
<option value=1>YES</option>\
<option value=2>NO</option>\
</select>\
</td>\
</tr>\
</table>\
</td> \
<td width='10%' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_sale_intake'></select></td>\
<td width='10%'><h1>Records : </h1> <span class='number_of_record' id='number_of_record_post_sale_intake'></span><input type='hidden' value='0' id='number_of_record_hide_post_sale_intake' class='number_of_record_hide'></td>\
</tr>\
</table>");
  if(tab_name=='custpage_post_sale_intake')
  {
    All_result_fill_sales_intake(obj_get_result,Sublist_post_sale_intake,number_of_result);
  }
}

function All_result_fill_sales_intake(results,Sublist_value,number_of_result)
{
  var Sublist_post_sale_intake_Arr=[];
  if(results)
  {
    try
    {
      var col=results[0].getAllColumns();
      for(var i=0;i<results.length;i++)
      {
        var or_item_value=match_box_id_value(results[i].getValue('custbody253','custrecord_transaction_record'));
        var or_item_value_materials=match_box_id_value_materials(results[i].getValue('custbody253','custrecord_transaction_record'));
        var internal_id=results[i].id;
        var index_value_new=(i+1)+'';
        var or_item_value_get=Add_Or_Item(index_value_new,internal_id,or_item_value[1],or_item_value_materials[1]); 
        var location_obj=[];
        var get_location_value=results[i].getValue('custbody245','custrecord_transaction_record');
        if(get_location_value){location_obj=get_location_value.split(','); }    
        var location_html= Location_Bind(location_obj,index_value_new);
        var transction_id_get=results[i].getValue('custrecord_transaction_record');       
        var record_type=results[i].getValue('recordtype','custrecord_transaction_record');
        var get_document_number=results[i].getValue('number','custrecord_transaction_record');
        var sales_order_link='<a href=/app/accounting/transactions/transaction.nl?id=' + transction_id_get + ' target=_blank>'+ get_document_number +'</a>';
        var created_form='';
        if(record_type=='salesorder')
        {
          var get_custom_created_form=results[i].getValue('custbody_created_from','custrecord_transaction_record');
          if(get_custom_created_form)
          {
            var document_number_get=results[i].getText('custbody_created_from','custrecord_transaction_record');
            document_number_get=document_number_get.split('#')[1];
            created_form='<a href=/app/accounting/transactions/transaction.nl?id=' + get_custom_created_form + ' target=_blank>'+ document_number_get +'</a>';
          }
        }
        else
        {
          var get_custom_created_form=results[i].getValue('createdfrom','custrecord_transaction_record');
          if(get_custom_created_form)
          {
            var document_number_get=results[i].getText('createdfrom','custrecord_transaction_record');
            document_number_get=document_number_get.split('#')[1];
            created_form='<a href=/app/accounting/transactions/transaction.nl?id=' + get_custom_created_form + ' target=_blank>'+ document_number_get +'</a>';
          }
        }
        var customer_name=(results[i].getText('entity','custrecord_transaction_record'));
        if(customer_name){
          customer_name=customer_name.split(' ');
          if(customer_name.length>1)
          {
            customer_name.splice(0,1);
            customer_name=customer_name.join(' ');
          } 
        }
        var custpage_customer_link='<a href=/app/common/entity/custjob.nl?id='+results[i].getValue('entity','custrecord_transaction_record')+' target=_blank>'+customer_name+'</a>';
        Sublist_post_sale_intake_Arr.push({
          custpage_customer:custpage_customer_link,
          custpage_received_chk2      : results[i].getValue('custrecord_received'),
          custpage_team2          : results[i].getValue('custrecord_team'),
          custpage_tracking_id2         : results[i].getValue(col[1]),
          custpage_box                    :   BOXAPI(record_type,transction_id_get,results[i].getValue('entity','custrecord_transaction_record'),                                                   results[i].getValue('email','custrecord_transaction_record'),get_document_number,index_value_new),
          custpage_sales_order_link       : sales_order_link,
          custpage_created_form           : created_form,
          custpage_sales_order_notes      : results[i].getValue('custbody58','custrecord_transaction_record'),
          custpage_internal_id_2:results[i].getId(),
          custpage_salesorder_id:results[i].getValue('custrecord_transaction_record'),
          custpage_or_items               : or_item_value_get,
          custpage_date_received          : results[i].getValue('custbody36','custrecord_transaction_record'),
          custpage_location:get_location_value,
          custpage_location_html:location_html,
          custpage_or_notes:results[i].getValue('custbody254','custrecord_transaction_record'),
          custpage_status_of_repairs_resizes:results[i].getValue('custbody142','custrecord_transaction_record'),
          custpage_select_box_id:or_item_value[0].join(','),
          custpage_select_materials_id:or_item_value_materials[0].join(','),
          custpage_or_items_old:or_item_value_get,
          custpage_date_received_old:results[i].getValue('custbody36','custrecord_transaction_record'),
          custpage_location_old:get_location_value,
          custpage_or_notes_old:results[i].getValue('custbody254','custrecord_transaction_record'),
          custpage_status_of_repairs_resizes_old:results[i].getValue('custbody142','custrecord_transaction_record'),
          custpage_select_box_id_old:or_item_value[0].join(','),
          custpage_select_materials_id_old:or_item_value_materials[0].join(','),
          custpage_tbw_firm_html:results[i].getValue(col[0]),
          custpage_current_line:index_value_new,
          custpage_trans_post_sales:results[i].getValue('custrecord_transaction_record'),
          custpage_record_type_post_sales:results[i].getValue('recordtype','custrecord_transaction_record'),
        });
      }
    }
    catch(er){
      nlapiLogExecution ( 'debug' , 'er Post Sale Intake' , er.message ); 

    }
  }

  Sublist_value.setLineItemValues(Sublist_post_sale_intake_Arr);
}
function Location_Bind(location_value_id,index_number)
{

  var function_call= "onclick=location_set("+index_number+")";
  var location_field="<select multiple width='100px' id='location_multi_"+index_number+"' "+function_call+">";
  for(var c=0;c<location_id.length;c++)
  {
    var select_value='';
    if(location_value_id.indexOf(location_id[c])!=-1)
    {
      select_value="selected='true'";
    }     
    location_field+="<option value="+location_id[c]+"  "+select_value+">"+location_text[c]+"</option>";
  }
  location_field+="</select>";
  return location_field;
}
function BOXAPI(record_type,record_id,entityid,email,tranid,index_value_new)
{
  if(entityid)
  {
    var currentContext = nlapiGetContext();
    var company_id = currentContext.getCompany();
    var record_name = entityid;
    var record_email = email;
    var start_time = (new Date()).getTime();
    record_name = tranid;
    record_name = record_name.replace(/:/g, '-');
    var end_time = (new Date()).getTime();
    var sso_name = 'customssoboxlive';
    var context = nlapiGetContext();
    var environment = context.getEnvironment();
    var context_email = context.getEmail();
    var role_center = context.getRoleCenter();
    var url_params = {
      'record_id': record_id
      ,'record_type': record_type
      ,'record_email': record_email
      ,'record_name': record_name
      ,'role': nlapiGetRole()
      ,'sso_name': sso_name
      ,'environment': environment
      ,'company_id': company_id
    };
    if (role_center == 'CUSTOMER' || role_center == 'PARTNERCENTER')
    {
      url_params['context_email'] = context_email;
    }
    var url_params_string = '';
    for (key in url_params)
    {
      url_params_string += '&' + key + '=' + escape(encodeURIComponent(url_params[key]));
    }
    var url = nlapiResolveURL('SUITELET', 'customscriptboxsuiteletlive', 'customdeployboxsuiteletlive', null) + url_params_string;
    var ifram_id="boxnet_widget_frame"+index_value_new;
    var content = '<iframe id='+ifram_id+' class="pankaj" name='+ifram_id+' src="' + url + '" align="center" style="width:300px; height:300px; margin:0; border:0; padding:0" frameborder="0"></iframe>';
    return content;
  }
}

function Add_Or_Item(i,internal_id,value_text,value_text_materials)
{
  var html_value="<table width='200px'>\
<tr>\
<td>\
Select Box \
<a  href='javascript:void(0)' onclick=box_plus("+i+");  id='imgplusbox"+i+"'>\
<img style='height:15px;' src='/core/media/media.nl?id=17798306&c=666639&h=b71f470fa33eae40de33&whence=' />\
</a>\
</td>\
</tr>\
<tr>\
<td>\
<span id='box_value"+i+"'>"+value_text.join(', ')+"</span>\
</td>\
</tr>\
<tr>\
<td>\
Select Materials\
<a  href='javascript:void(0)' onclick=materials_plus("+i+");  id='imgplusmaterials"+i+"'>\
<img style='height:15px;' src='/core/media/media.nl?id=17798306&c=666639&h=b71f470fa33eae40de33&whence=' />\
</a>\
</td>\
</tr>\
</tr>\
<tr>\
<td>\
<span id='materials_value"+i+"'>"+value_text_materials.join(', ')+"</span>\
</td>\
</tr>\
</table>";
  return  html_value;
}


function match_box_id_value(value_id)
{ 
  var value_array=[];
  var text_array=[];
  if(value_id)
  {
    var value_fatch=value_id.split(',');
    for(var a=0;a<value_fatch.length;a++)
    {
      var index_no=or_item_box_id.indexOf(value_fatch[a]);
      if(index_no!=-1)
      {
        value_array.push(or_item_box_id[index_no]);
        text_array.push(or_item_box_text[index_no]);
      }

    }
  }
  return  [value_array,text_array];
}

function match_box_id_value_materials(value_id)
{ 
  var value_array=[];
  var text_array=[];
  if(value_id)
  {
    var value_fatch=value_id.split(',');
    for(var a=0;a<value_fatch.length;a++)
    {
      var index_no=or_item_materials_id.indexOf(value_fatch[a]);
      if(index_no!=-1)
      {
        value_array.push(or_item_materials_id[index_no]);
        text_array.push(or_item_materials_text[index_no]);
      }

    }
  }
  return  [value_array,text_array];
}