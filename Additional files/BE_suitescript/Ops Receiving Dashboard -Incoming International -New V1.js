function Incoming_international_List(form,obj_get_result,number_of_result,tab_name)
{
  var Sublist_incoming_international = form.addSubList('custpage_incoming_international', 'list','Incoming International','custpage_all_tab_three');        
  Sublist_incoming_international.addField('custpage_sales_order_link','text','Sales Order Link');//5
  Sublist_incoming_international.addField('custpage_created_form_3','text','CREATED FROM');//5
  Sublist_incoming_international.addField('custpage_tracking_id3','text','Tracking ID');//3
  Sublist_incoming_international.addField('custpage_shipper_dec_status','select',"Shipper's Dec. Status","customlist444");
  Sublist_incoming_international.addField('custpage_shipper_dec_declaration','textarea',"Shipper’s Declaration");
  Sublist_incoming_international.addField('custpage_status3','textarea','Status');//6
  Sublist_incoming_international.addField('custpage_shipped_by3','text','Shipped By');//7
  Sublist_incoming_international.addField('custpage_shipper_address3','text','Shipper Address');//8
  Sublist_incoming_international.addField('custpage_recipient_contact_name3','text','Recipient Contact Name');//9
  Sublist_incoming_international.addField("custpage_recipient_address3", "text","Recipient Address");
  Sublist_incoming_international.addField('custpage_reference3','text','Reference');//11
  Sublist_incoming_international.addField('custpage_shipper_dec_status_hiddden', 'text', 'SDP_PREV').setDisplayType('hidden');
  Sublist_incoming_international.addField('custpage_trans_post_incoming', 'text').setDisplayType('hidden');
  Sublist_incoming_international.addField('custpage_record_type_post_incoming', 'text').setDisplayType('hidden');
  Sublist_incoming_international.addRefreshButton();//12
  Sublist_incoming_international.addButton("custpage_add_package3", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true)");//14
  Sublist_incoming_international.addButton("custpage_update_orders3", "Update Orders","Update_orders_Incoming_International()");//13
  var html_subtab= form.addField('cutpage_subtab_incoming_international','inlineHTML','',null,'custpage_all_tab_three');
  html_subtab.setDefaultValue("<table width='100%' cellpadding='2'>\
<tr>\
<td width='25%'>\
<h1>Last updated : </h1>\
<span class='date_time_value' id='date_time_value_incoming_international'></span>\
</td>\
<td  width='25%'>\
<table width='100%' cellpadding='0'>\
<tr>\
<td>\
<input   style='width:100%' type='text' class='search_key' id='search_key_incoming_international' placeholder='Search By Tracking Id/ Sales order'>\
</td>\
<td>\
<input type='button' class='btn_search_key'  id='btn_search_key_incoming_international' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px -2px;    cursor: pointer;' >\
</td>\
</tr>\
</table>\
</td>\
<td width='10%' align='right'><br/><select class='page_all_pageing'  id='page_all_pageing_incoming_international'></td>\
<td width='10%'><h1>Records : </h1> <span class='number_of_record' id='number_of_record_incoming_international'></span><input type='hidden' value='0' id='number_of_record_hide_incoming_international' class='number_of_record_hide'></td>\
</table>");
  if(tab_name=='custpage_incoming_international')
  {
    All_result_fill_incoming_international(obj_get_result,Sublist_incoming_international,number_of_result);
  }
}


function All_result_fill_incoming_international(results,Sublist_value,number_of_result)
{
  var Sublist_incoming_international_Arr=[];
  if(results)
  {
    try
    {
      var col=results[0].getAllColumns();
      for(var j=0;j<results.length;j++)
      {

        var transction_id_get=results[j].getValue('custrecord_transaction_record');       
        var record_type=results[j].getValue('recordtype','custrecord_transaction_record');
        var get_document_number=results[j].getValue('number','custrecord_transaction_record');
        var sales_order_link='<a href=/app/accounting/transactions/transaction.nl?id=' + transction_id_get + ' target=_blank>'+ get_document_number +'</a>';
        var created_form='';
        if(record_type=='salesorder')
        {
          var get_custom_created_form=results[j].getValue('custbody_created_from','custrecord_transaction_record');
          if(get_custom_created_form)
          {
            var document_number_get=results[j].getText('custbody_created_from','custrecord_transaction_record');
            document_number_get=document_number_get.split('#')[1];
            created_form='<a href=/app/accounting/transactions/transaction.nl?id=' + get_custom_created_form + ' target=_blank>'+ document_number_get +'</a>';
          }
        }
        else
        {
          var get_custom_created_form=results[j].getValue('createdfrom','custrecord_transaction_record');
          if(get_custom_created_form)
          {
            var document_number_get=results[j].getText('createdfrom','custrecord_transaction_record');
            document_number_get=document_number_get.split('#')[1];
            created_form='<a href=/app/accounting/transactions/transaction.nl?id=' + get_custom_created_form + ' target=_blank>'+ document_number_get +'</a>';
          }
        }
        Sublist_incoming_international_Arr.push({
          custpage_sales_order_link : sales_order_link,
          custpage_created_form_3: created_form,  
          custpage_status3            :   results[j].getValue(col[0]),
          custpage_shipper_dec_declaration:results[j].getValue(col[1]),         
          custpage_tracking_id3       :   results[j].getValue(col[2]),    
          custpage_shipper_dec_status : results[j].getValue('custbody297','custrecord_transaction_record'), 
          custpage_shipped_by3        :   results[j].getValue('custrecord_shipped_by'),
          custpage_shipper_address3   :   results[j].getValue('custrecord_shipper_address'),
          custpage_recipient_contact_name3 : results[j].getValue('custrecord_recipient_contact_name'),
          custpage_recipient_address3 :   results[j].getValue('custrecord_recipient_address'),
          custpage_reference3         :   results[j].getValue('custrecord_reference'),
          custpage_shipper_dec_status_hiddden:results[j].getValue('custbody297','custrecord_transaction_record'),
          custpage_trans_post_incoming:results[j].getValue('custrecord_transaction_record'),
          custpage_record_type_post_incoming:results[j].getValue('recordtype','custrecord_transaction_record')
        });
      }
    }
    catch(er){
      nlapiLogExecution ( 'debug' , 'er' , er.message ); 

    }
    Sublist_value.setLineItemValues(Sublist_incoming_international_Arr);
  }
}

