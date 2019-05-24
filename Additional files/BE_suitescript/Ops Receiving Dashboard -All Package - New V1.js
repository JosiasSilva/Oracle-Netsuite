function All_packages_List(form,obj_get_result,number_of_result)
{

  //parent.document.getElementById('number_of_record_all_package').innerHTML ="hi";

  var html_subtab= form.addField('cutpage_subtab_all_package','inlineHTML','',null,'custpage_all_tab_one');
  var Sublist_all_package = form.addSubList('custpage_all_packages', 'list',"All Packages","custpage_all_tab_one");
  Sublist_all_package.addField('custpage_received_chk','checkbox','Received');
  Sublist_all_package.addField('custpage_team','select','Team','customlist_team');
  Sublist_all_package.addField('custpage_sales_order_all_package','text','Transaction Link');   
  Sublist_all_package.addField('custpage_cdp_all_package','text','CPR LINK'); 
  Sublist_all_package.addField('custpage_tracking_id','text','Tracking ID');
  Sublist_all_package.addField('custpage_status','textarea','Status');
  Sublist_all_package.addField('custpage_shipped_by','text','Shipped by').setDisplayType('entry');
  Sublist_all_package.addField('custpage_shipper_address','text','Shipper Address');
  Sublist_all_package.addField('custpage_recipient_contact_name','text','Recipient Contact Name').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_recipient_address','text','Recipient Address');
  Sublist_all_package.addField('custpage_account_number','text','Account_Number').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_reference','text','Reference');
  Sublist_all_package.addField('custpage_or_items_package','textarea','OR Items').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_or_items_old_package','textarea').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_internal_id', 'text', 'ID').setDisplayType('hidden');
  Sublist_all_package.addField('custpage_received_chk_old', 'checkbox').setDisplayType('hidden');
  Sublist_all_package.addField('custpage_team_old','select','Team','customlist_team').setDisplayType('hidden');
  Sublist_all_package.addField('custpage_shipped_by_old','text','Shipped by').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_record_type_all_package','text').setDisplayType("hidden");
  Sublist_all_package.addRefreshButton();

  Sublist_all_package.addButton("custpage_add_package", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_open_popup','Package Record',800,500,'custpage_open_popup',true)");
  // Sublist_all_package.addButton("custpage_add_package", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true)");
  Sublist_all_package.addButton("custpage_update_package", "Update Orders","Update_Order_All_Package()");
  Sublist_all_package.addButton("custpage_bulk_recive", "Bulk Receive","window.open('/app/site/hosting/scriptlet.nl?script=1169&deploy=1&open_popup=T','Bulk Receive','height=500,width=500,left=10,top=10,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=no')");
  All_result_fill(obj_get_result,Sublist_all_package,number_of_result);
  var index = 1;
  var html_index;
  for(var i=0; i < Math.ceil(number_of_result / divided_size); i++)
  {
    var nextIndex = index + paging_size;
    if(nextIndex > number_of_result)
      nextIndex = number_of_result;
    html_index+='<option value='+index+'>'+index + ' - ' + nextIndex+'</option>';
    index = nextIndex + 1;
  }
  html_subtab.setDefaultValue("<table width='100%' cellpadding='2'><tr>\
<td width='15%'>\
<h1>Last updated : </h1><span id='date_time_value_all_package' class='date_time_value'>"+new Date()+"</span>\
</td>\
<td width='25%'>\
<br/>\
<table  width='100%' cellpadding='0'>\
<tr>\
<td>\
<input  style='width:100%' type='text' class='search_key' id='search_key_all_pakage'  placeholder='Search By Tracking Id/ Sales order'>\
</td>\
<td>\
<input class='btn_search_key'  id='btn_search_key_all_pakage'  type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px -2px;    cursor: pointer;'>\
</td>\
</tr>\
</table>\
</td>\
<td  width='15%' align='right'>\
<table width='100%'>\
<tr>\
<td width='100%'>\
STATUS\
<select  style='width:100%' id='status_all_package'>\
<option value=''></option>\
<option value=1>LABEL CREATED</option>\
<option value=2>PICKED UP</option>\
<option value=3>IN TRANSIT </option>\
<option value=4>EXCEPTION/DELAY</option>\
<option value=5>HELD FOR PICKUP</option>\
<option value=6>DELIVERED</option>\
</select>\
</td>\
</tr>\
</table>\
</td>\
<td  width='15%' align='right'> \
<table width='100%'>\
<tr>\
<td width='100%'>\
TEAM\
<select  style='width:100%' id='team_all_package'>\
<option value=''></option><option value=0>All</option>\
<option value=1>OPS RECEIVING</option>\
<option value=2>PRODUCTION</option>\
<option value=3>GR</option>\
<option value=4>INVENTORY</option>\
<option value=5>PERSONAL/MISC</option>\
</select>\
</td>\
</tr>\
</table>\
</td>\
<td  width='10%' align='right'>\
<table width='100%'>\
<tr>\
<td width='100%'>\
DROP OFF\
<select class='droup_off_value' id='droup_off_value_all_package' style='width:100%'>\
<option value=''></option>\
<option value='0'>ALL</option>\
<option value=1>YES</option>\
<option value=2>NO</option>\
</select>\
</td>\
</tr>\
</table>\
</td>\
<td width='10%' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_all_package'>"+html_index+"</select>\
</td>\
<td width='7%'>\
<table  width='100%' cellpadding='0'>\
<tr>\
<td>\<h1>Records :</h1></td>\
<td>\<h1><span class='number_of_record' id='number_of_record_all_package'>"+number_of_result+"</span></h1>\
<input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_all_package'></td>\
</tr>\
</table>\
</td>\
</tr>\
</table>");
}


function All_result_fill(results,Sublist_all_package,number_of_result)
{
  if(results)
  {
    // nlapiLogExecution ( 'debug' ,'results',results );
    var Sublist_all_package_Arr=[];
    try
    {
      var col=results[0].getAllColumns();  
      for(var i=0;i<results.length;i++)
      {

        var sales_order_link='';
        var transction_id_get=results[i].getValue('custrecord_transaction_record');
        if(transction_id_get)
        {
          var document_number_get=results[i].getValue('number' ,'CUSTRECORD_TRANSACTION_RECORD');
          sales_order_link='<a href=/app/accounting/transactions/transaction.nl?id=' + transction_id_get + ' target=_blank>'+ document_number_get +'</a>';
        }
        Sublist_all_package_Arr.push({
          custpage_cdp_all_package        :   results[i].getValue(col[0]),
          custpage_tracking_id		    :	results[i].getValue(col[1]),
          custpage_status				    :	results[i].getValue(col[2]),
          custpage_internal_id            :   results[i].getId(),
          custpage_team				    :	results[i].getValue('custrecord_team'),
          custpage_team_old:results[i].getValue('custrecord_team'),
          custpage_shipped_by			    :	results[i].getValue('custrecord_shipped_by'),
          custpage_shipper_address	    :	results[i].getValue('custrecord_shipper_address'),
          custpage_recipient_contact_name :	results[i].getValue('custrecord_recipient_contact_name'),
          custpage_recipient_address	    :	results[i].getValue('custrecord_recipient_address'),
          custpage_account_number		    :	results[i].getValue('custrecord_account_number'),
          custpage_reference			    :	results[i].getValue('custrecord_reference'),
          custpage_received_chk_old       :   results[i].getValue('custrecord_received'),
          custpage_sales_order_all_package:   sales_order_link,
          custpage_shipped_by_old:results[i].getValue('custrecord_shipped_by'),
          custpage_record_type_all_package:results[i].getValue('recordtype' ,'CUSTRECORD_TRANSACTION_RECORD'),
        });
      }
    }
    catch(er){nlapiLogExecution ( 'debug' ,'er_all_package',er.message ) ;}
    Sublist_all_package.setLineItemValues(Sublist_all_package_Arr);
  }
}
