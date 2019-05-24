function Add_field_on_Sublist_incoming_international(form,results)
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
  Sublist_incoming_international.addRefreshButton();//12
  Sublist_incoming_international.addButton("custpage_add_package3", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true)");//14
  Sublist_incoming_international.addButton("custpage_update_orders3", "Update Orders","Update_orders3()");//13
  var Sublist_incoming_international_Arr=[];
  if(results)
  {
    try
    {
      var col=results[0].getAllColumns();
      for(var j=0;j<results.length;j++)
      {
        var transction_id_get=results[j].getValue('custrecord_transaction_record');
        var sales_order_link='';       
        var created_form='';
        if(transction_id_get)
        {

          var get_trans_info= nlapiLookupField ( 'transaction' , transction_id_get ,['type','createdfrom','tranid','createdfrom.type','createdfrom.tranid','custbody_created_from','custbody_created_from.type', 'custbody_created_from.tranid' ] );
          var type_value=get_trans_info.type;
          type_value=type_value.toLowerCase();           
          sales_order_link='<a href=/app/accounting/transactions/'+type_value+'.nl?id=' + transction_id_get + ' target=_blank>'+ get_trans_info.tranid +'</a>';
          if(type_value=='salesord')
          {
            var get_created_form_value=get_trans_info.custbody_created_from;
            if(get_created_form_value)
            {
              var get_type_created_form=get_trans_info['custbody_created_from.type'];
              get_type_created_form=get_type_created_form.toLowerCase();
              var get_created_document=get_trans_info['custbody_created_from.tranid'];			   
              created_form='<a href=/app/accounting/transactions/'+get_type_created_form+'.nl?id=' + get_created_form_value + ' target=_blank>'+ get_created_document +'</a>';
            }
          }
          else
          {
            var get_created_form_value=get_trans_info.createdfrom;
            if(get_created_form_value)
            {
              var get_type_created_form=get_trans_info['createdfrom.type'];
              get_type_created_form=get_type_created_form.toLowerCase();
              var get_created_document=get_trans_info['createdfrom.tranid'];			   
              created_form='<a href=/app/accounting/transactions/'+get_type_created_form+'.nl?id=' + get_created_form_value + ' target=_blank>'+ get_created_document +'</a>';
            }	
          }

        }        
        Sublist_incoming_international_Arr.push({
          custpage_sales_order_link	:	sales_order_link,
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
        });
      }
    }
    catch(er){
      nlapiLogExecution ( 'debug' , 'er' , er.message ); 
      
    }

    Sublist_incoming_international.setLineItemValues(Sublist_incoming_international_Arr);
  }
}
function Paging_third(numOrders,form,page_index,search_key)
{
  var html_subtab= form.addField('cutpage_subtab_incoming_international','inlineHTML','',null,'custpage_all_tab_three');
  var index = 1;
  var defaultSel = 1;
  if(page_index)
  {
    defaultSel = parseInt(page_index);
  }
  if(numOrders > divided_size)
  {
    var html="<select style='width:100%' onchange='cutpage_incoming_international(this.value)'>";
    for(var i=0; i < Math.ceil(numOrders / divided_size); i++)
    {
      var isDefault = false;
      if(defaultSel == index)
        isDefault = true;
      var nextIndex = index + paging_size;
      if(nextIndex > numOrders)
        nextIndex = numOrders;
      html+="<option value="+index+">"+index + " - " + nextIndex+"</option>";
      index = nextIndex + 1;
    }
    html+"</select>";
    html_subtab.setDefaultValue("<table width='100%' cellpadding='2'><tr><td width='25%'><h1>Last updated : </h1><span id='span_incoming_international'>"+date_time+"</span></td><td  width='25%'><table width='100%' cellpadding='0'><tr><td><input   style='width:100%' type='text' id='myInputinternationale_search' placeholder='Search By Tracking Id/ Sales order' value="+search_key+"  ></td><td><input type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px 2px;    cursor: pointer;' onclick=Search_All('myInputinternationale_search',false,false,false,'custpage_all_tab_three',event)></td></tr></table></td> <td  width='30%'></td><td  width='10%' align='right'><br/>"+html+"</td></tr><td width='10%'><h1>Records : </h1> <span>"+numOrders+"</span></td></table>");
  }
  else
  {


    html_subtab.setDefaultValue("<table width='100%' cellpadding='2'><tr><td width='25%'><h1>Last updated : </h1> <span id='span_incoming_international'>"+date_time+"</span></td><td width='15%'><table width='100%' cellpadding='0'><tr><td><input   style='width:100%' type='text' id='myInputinternationale_search' placeholder='Search By Tracking Id/ Sales order' value="+search_key+"  ></td><td><input type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px -2px;    cursor: pointer;' onclick=Search_All('myInputinternationale_search',false,false,false,'custpage_all_tab_three',event)></td></tr></table></td> <td  width='10%' align='right'></td><td width='10%'><h1>Records : </h1> <span>"+numOrders+"</span></td></tr></table>");

  }

}
function Add_Sub_List_empty_incoming_international(form)
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
  Sublist_incoming_international.addField('cust_page_soid', 'text', 'soid').setDisplayType('hidden');
  Sublist_incoming_international.addField('custpage_shipper_dec_status_hiddden', 'text', 'SDP_PREV').setDisplayType('hidden');
  Sublist_incoming_international.addRefreshButton();//12
  Sublist_incoming_international.addButton("custpage_add_package3", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true)");//14
  Sublist_incoming_international.addButton("custpage_update_orders3", "Update Orders","Update_orders3()");//13

}