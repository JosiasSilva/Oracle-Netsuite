var restUrl = '/app/site/hosting/restlet.nl?script=2168&deploy=1';
var responce_records=[];
var send_data_qty,tranfer_id_obj,insurence_amount,temp_data_obj;
function Check_url(type_val)
{
  if(type_val)
  {
    return '/app/site/hosting/scriptlet.nl?script=2170&deploy=1&r=T&machine=custitem_list_incoming&from_location='+nlapiGetFieldValue('custitem_incoming_location_from')+'&to_location='+nlapiGetFieldValue('custitem_incoming_location_to')+'&search_document='+nlapiGetFieldValue('custitem_incoming_search')+'&search_ship_date='+nlapiGetFieldValue('custitem_incoming_ship_date');
  }
  else
  {
    return '/app/site/hosting/scriptlet.nl?script=2170&deploy=1&r=T&machine=custitem_list_outgoing&from_location='+nlapiGetFieldValue('custitem_outgoing_location_from')+'&to_location='+nlapiGetFieldValue('custitem_outgoing_location_to')+'&search_document='+nlapiGetFieldValue('custitem_outgoing_search')+'&search_ship_date='+nlapiGetFieldValue('custitem_outgoing_ship_date');
  }
}
function Location_Change(type,name)
{

  if(name=='custitem_incoming_location_from' || name=='custitem_incoming_location_to' || name=='custitem_incoming_ship_date')
  {
    Change_Data_Search('custitem_incoming_search');
  }
  else if(name=='custitem_outgoing_location_from' || name=='custitem_outgoing_location_to' || name=='custitem_outgoing_ship_date')
  {
    Change_Data_Search('custitem_outgoing_search');
  }

}

function Field_Change(type,name)
{
  if(name=='custitem_incoming_search')
  {
    Change_Data_Search('custitem_incoming_search');
  }
  else if(name=='custitem_outgoing_search')
  {
    Change_Data_Search('custitem_outgoing_search');
  }

  return true;
}

function Change_Data_Search(name)
{

  if(name=='custitem_incoming_search')
  {
    var incoming_url= Check_url(true);
    document.getElementById('server_commands').src =incoming_url;
    Get_Update_Records('records_incoming','records_incoming_page',false);

  }
  else if(name=='custitem_outgoing_search')
  {
    var outgoing_url= Check_url(false);
    document.getElementById('server_commands').src = outgoing_url;
    Get_Update_Records('records_outgoing','records_outgoing_page',true);
  }
}



function Field_Style()
{
  document.getElementById('tbl_custitem_outgoing_print_pick_slip').style='display:none';
  document.getElementById('tbl_custitem_outgoing_fulfill').style='display:none';
  document.getElementById('tbl_custitem_outgoing_print_picking_slip').style='display:none';
  document.getElementById('tbl_custitem_outgoing_shipping_label').style='display:none';
  document.getElementById('tbl_custitem_outgoing_create_box_recordss').style='display:none';
  document.getElementById('tbl_custitem_outgoing_update_box_records').style='display:none';

  var elem = document.createElement('div');
  elem.id='id_wait'
  elem.innerHTML = "<div style='background: rgba(255,255,255,.5);position: fixed; width: 100%;height: 100%;display: block; z-index: 9;top: 12em; left: 0; margin: auto;bottom: 0; text-align: center; vertical-align: middle'><div  style='font-size:30px;font-weight: bold ;position: absolute;top: 0;right: 0;bottom: 0;left: 0;height: 50px;margin: auto;'> <span id='id_wait_message'>Please Wait</span></div></div>";
  elem.style="display:none";
  document.body.appendChild(elem);
  document.getElementById('custitem_incoming_search').placeholder = "Search by Transfer Order";
  document.getElementById('custitem_outgoing_search').placeholder = "Search by Transfer Order";
  //custitem_list_incomingunmarkall
  var custitem_incoing_fulfill = document.getElementById("refreshcustitem_list_incoming").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  var td_inner = custitem_incoing_fulfill.insertCell(-1);
  var add_html="<span>";
  add_html+="TOTAL: <span id='records_incoming'  style='padding-right:10px'>0</span>";
  add_html+="<span style='padding-right:12px'><select width='200px' id='records_incoming_page' style='width:75px' onchange=page_index_change(this) > </select> </span>";
  add_html+="</span>";
  td_inner.innerHTML = add_html;
  td_inner.width = "100%";
  td_inner.align = "right";
  var custitem_outgoing_fulfill = document.getElementById("custitem_list_outgoingunmarkall").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  var td_outer = custitem_outgoing_fulfill.insertCell(-1);
  var add_html_outer="<span>";
  add_html_outer+="TOTAL: <span id='records_outgoing'  style='padding-right:10px'>0</span>";
  add_html_outer+="<span style='padding-right:12px'><select width='200px' id='records_outgoing_page' style='width:75px' onchange=page_index_change(this) > </select> </span>";
  add_html_outer+="</span>";
  td_outer.innerHTML = add_html_outer;
  td_outer.width = "100%";
  td_outer.align = "right";
  Get_Update_Records('records_incoming','records_incoming_page',false);
}

function Get_Update_Records(field_records,field_select,outgoing)
{

  var url;
  if(outgoing)
  {
    url= Check_url(false);
  }
  else
  {
    url= Check_url(true);
  }
  url+="&type=get_page_data";
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:url,
    dataType: "json",
    success: function(get_return_value) {
      var no_of_records=parseInt(get_return_value[0]);
      Droup_select_field(no_of_records,null,field_records,field_select);
      if(outgoing)
      {
        var print_packing_slip_fulfill_btn=parseInt(get_return_value[1]);
        var box_records_btn=parseInt(get_return_value[2]);
        var update_box_records_btn=parseInt(get_return_value[3]);
        var print_packing_slip_btn=parseInt(get_return_value[4]);
        var print_shipping_lable=parseInt(get_return_value[5]);
        if(print_packing_slip_fulfill_btn)
        {
          document.getElementById('tbl_custitem_outgoing_print_pick_slip').style='';
          document.getElementById('tbl_custitem_outgoing_fulfill').style='';
        }
        else
        {
          document.getElementById('tbl_custitem_outgoing_print_pick_slip').style='display:none';
          document.getElementById('tbl_custitem_outgoing_fulfill').style='display:none';
        }
        if(print_packing_slip_btn)
        {
          document.getElementById('tbl_custitem_outgoing_print_picking_slip').style='';
        }
        else
        {
          document.getElementById('tbl_custitem_outgoing_print_picking_slip').style='display:none';
        }
        if(print_shipping_lable)
        {
          document.getElementById('tbl_custitem_outgoing_shipping_label').style='';
        }
        else
        {
          document.getElementById('tbl_custitem_outgoing_shipping_label').style='display:none';
        }
        if(box_records_btn)
        {

          if(update_box_records_btn)
          {
            document.getElementById('tbl_custitem_outgoing_update_box_records').style='';
            document.getElementById('tbl_custitem_outgoing_create_box_recordss').style='display:none';
          }
          else
          {
            document.getElementById('tbl_custitem_outgoing_create_box_recordss').style='';
            document.getElementById('tbl_custitem_outgoing_update_box_records').style='display:none';
          }
        }
        else
        {
          document.getElementById('tbl_custitem_outgoing_create_box_recordss').style='display:none';
          document.getElementById('tbl_custitem_outgoing_update_box_records').style='display:none';
        }



      }

    }
  });

}
function Droup_select_field(numOrders,page_index,field_records,field_select)
{

  var obj_select=document.getElementById(field_select);
  var option_value=obj_select.options;
  if(option_value)
  {
    option_value.length = 0;
  }
  var divided_size=50;var paging_size=49;
  var index = 1;
  var defaultSel = 1;
  if(page_index)
  {
    defaultSel = parseInt(page_index);
  }
  var html_index='';
  for(var i=0; i < Math.ceil(numOrders / divided_size); i++)
  {
    var isDefault = false;
    if(defaultSel == index)
      isDefault = true;
    var nextIndex = index + paging_size;
    if(nextIndex > numOrders)
      nextIndex = numOrders;
    //html_index+='<option value='+index+'>'+index + ' - ' + nextIndex+'</option>';
    if(obj_select.options)
    {
      obj_select.options[obj_select.options.length] = new Option(index + ' - ' + nextIndex, index, false, false);
    }
    index = nextIndex + 1;
  }
  if(document.getElementById(field_records) && numOrders)
  {
    document.getElementById(field_records).innerHTML =numOrders;
  }
}

function page_index_change(val)
{
  var machine;
  if(val.id=='records_incoming_page')
  {
    var incoming_url=Check_url(true);
    incoming_url+='&page_index='+val.value
    document.getElementById('server_commands').src =incoming_url;
  }
  else
  {
    var outgoing_url=Check_url(false);
    outgoing_url+='&page_index='+val.value
    document.getElementById('server_commands').src =outgoing_url;
  }
}


function refreshmachine(val)
{
  var objsend_data={
    type:'getlocation_user',
    send_data:{employee:nlapiGetUser ( ) }
  }

  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: JSON.stringify(objsend_data),
    dataType: "json",
    success: function(get_return_value) { 

      var get_hit_url=""
      if(val=='custitem_list_incoming')
      {
        nlapiSetFieldValue('custitem_incoming_location_to',get_return_value,false,true);
        nlapiSetFieldValue('custitem_incoming_location_from','',false,true);
        nlapiSetFieldValue('custitem_incoming_search','',false,true);
        nlapiSetFieldValue('custitem_incoming_ship_date','' ,false,true);
        Get_Update_Records('records_incoming','records_incoming_page',false);
        document.getElementById('server_commands').src =Check_url(true);
      }
      else
      {
        nlapiSetFieldValue('custitem_outgoing_location_to','',false,true);
        nlapiSetFieldValue('custitem_outgoing_location_from',get_return_value,false,true);
        nlapiSetFieldValue('custitem_outgoing_search','',false,true);
        nlapiSetFieldValue('custitem_outgoing_ship_date','' ,false,true);      
        Get_Update_Records('records_outgoing','records_outgoing_page',true);
        document.getElementById('server_commands').src =Check_url(false); 
      }
    }
  });
}

function Print_Doc(val)
{
  if(!nlapiGetFieldValue('custitem_outgoing_location_from'))
  {
    alert('Please select a From Location');
    return;
  }
  var obj_send_data={
    from_location:nlapiGetFieldValue('custitem_outgoing_location_from'),
    to_location:nlapiGetFieldValue('custitem_outgoing_location_to'),
    search_document:nlapiGetFieldValue('custitem_outgoing_search'),
    search_ship_date:nlapiGetFieldValue('custitem_outgoing_ship_date')
  }
  if(val=='custitem_outgoing_packing_slip')
  {
    document.getElementById("id_wait_message").innerText='Creating Packing Slips...';
  }
  else
  {
    document.getElementById("id_wait_message").innerText='Creating Shipping Labels ...';
  }
  document.getElementById("id_wait").style='';
  var objsend_data={
    type:val,
    send_data:obj_send_data
  }
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: JSON.stringify(objsend_data),
    dataType: "json",
    success: function(get_return_value) { 
      document.getElementById("id_wait").style='display:none';
      if(get_return_value)
      {
        window.onbeforeunload = null;
        window.open(get_return_value);
      }
      else
      {
        if(val=='custitem_outgoing_packing_slip')
        {
          alert('No Packing Slips Available');
        }
        else
        {
          alert('No Shipping Labels Available');
        }
      }
    }
  });
}


function Print_Pick_Slip() {
  if(!nlapiGetFieldValue('custitem_outgoing_location_from'))
  {
    alert('Please select a From Location');
    return;
  }
  var obj_send_data={
    from_location:nlapiGetFieldValue('custitem_outgoing_location_from'),
    to_location:nlapiGetFieldValue('custitem_outgoing_location_to'),
    search_document:nlapiGetFieldValue('custitem_outgoing_search'),
    search_ship_date:nlapiGetFieldValue('custitem_outgoing_ship_date')
  }

  document.getElementById("id_wait_message").innerText='Creating Picking Slips...';
  document.getElementById("id_wait").style='';
  var objsend_data={
    type:'print_pick_slip',
    send_data:obj_send_data
  }
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: JSON.stringify(objsend_data),
    dataType: "json",
    success: function(get_return_value) { 
      document.getElementById("id_wait").style='display:none';
      if(get_return_value)
      {
        window.onbeforeunload = null;
        window.open(get_return_value);
      }
    }
  });
}




function Print_Picking_Slip() {

  if(!nlapiGetFieldValue('custitem_outgoing_location_from'))
  {
    alert('Please select a From Location');
    return;
  }

  var file_id_obj = [];
  var responce_get_count=[];
  var trans_id=[];
  for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {

    var Transfer_Order_status = nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_status', t);
    if (Transfer_Order_status == 'Pending Fulfillment') {
      trans_id.push(nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t));
    }
  }
  if(trans_id.length>0)
  {
    document.getElementById("id_wait_message").innerText='Creating Packing Slips...';
    document.getElementById("id_wait").style='';
    var objsend_data={
      type:'all_trans_print_id',
      send_data:trans_id
    }
    jQuery.ajax({
      type: 'POST',
      contentType: "application/json;",
      url:restUrl,
      data: JSON.stringify(objsend_data),
      dataType: "json",
      success: function(get_return_value) { 
        document.getElementById("id_wait").style='display:none';
        if(get_return_value)
        {
          window.onbeforeunload = null;
          window.open(get_return_value);
        }
      }
    });
  }
}


function Receive_Records()
{

  var trans_id=[];
  for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_incoming'); t++) {

    var Transfer_Order_status = nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_receive', t);
    if (Transfer_Order_status == 'T') {
      trans_id.push(nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_internalid', t));
    }
  }

  if(trans_id.length>0)
  {
    responce_records=[];
    document.getElementById("id_wait").style='';
    document.getElementById("id_wait_message").innerText='Updating  '+(responce_records.length)+' of '+trans_id.length+' Records...';
    Get_Update_Records_Service(trans_id,0,'all_trans_receive','custitem_list_incoming')
  }
}

function Fulfillment_Records()
{

  var trans_id=[];
  var check_box_name=document.getElementsByName("check_box_outgoing_value");
  for(var a=0;a<check_box_name.length;a++)
  {
    if(check_box_name[a].className =='checkbox_ck')
    {
      var get_check_box_id=check_box_name[a].id;
      var get_inde_number=get_check_box_id.replace('outgoing_check','');
      trans_id.push(nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', get_inde_number));
    }
  }






  if(trans_id.length>0)
  {
    responce_records=[];
    document.getElementById("id_wait").style='';
    document.getElementById("id_wait_message").innerText='Updating  '+(responce_records.length)+' of '+trans_id.length+' Records...';
    Get_Update_Records_Service(trans_id,0,'all_trans_fulfill','custitem_list_outgoing')
  }
}

function Get_Update_Records_Service(trans_id,index_trans,type_call,sublist_id)
{
  var objsend_data={
    type:type_call,
    send_data:trans_id[index_trans]
  }
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: JSON.stringify(objsend_data),
    dataType: "json",
    success: function(get_return_value) {
      responce_records.push(get_return_value);
      document.getElementById("id_wait_message").innerText='Updating  '+(responce_records.length)+' of '+trans_id.length+' Records...';
      if(trans_id.length>responce_records.length)
      {
        Get_Update_Records_Service(trans_id,responce_records.length,type_call,sublist_id);
      }
      else
      {
        document.getElementById("id_wait").style='display:none';
        if(sublist_id=='custitem_list_incoming')
        {
          refreshmachine_incoming();
        }
        else
        {
          refreshmachine_outgoing();
        }
        //refreshmachine(sublist_id);

      }
    }
  });
}























//---------------------------------------------------------------------------------------//

function check_value_insert_create(user)
{
  if(!nlapiGetFieldValue('custitem_outgoing_location_from'))
  {
    alert('Please select a From Location');
    return;
  }
  send_data_qty=0;
  tranfer_id_obj=new Array();
  insurence_amount=new Array();
  var get_all_record=List_Without_box_record('false');
  if(get_all_record && get_all_record.length>0)
  {
    temp_data_obj=new Array();
    var new_record_create=Create_Box_Record_Obj(get_all_record);
    //alert(new_record_create);
    if(new_record_create && temp_data_obj.length>0)
    {
      Call_Ajax_data_update(new_record_create,'new_record',user);
    }
  }
}
function check_value_insert_update(user)
{  

  if(!nlapiGetFieldValue('custitem_outgoing_location_from'))
  {
    alert('Please select a From Location');
    return;
  }
  send_data_qty=0;
  tranfer_id_obj=new Array();
  insurence_amount=new Array();
  var get_all_old_record=List_Without_box_record('true');
  if(get_all_old_record && get_all_old_record.length>0)
  {
    var get_all_new_record=List_Without_box_record('false');
    get_all_old_record=Old_Record_marge_box(get_all_old_record);
    if( (get_all_new_record &&  get_all_new_record.length>0) || (get_all_old_record && get_all_old_record.length>0) )
    {
      temp_data_obj=new Array();
      var update_record_create=Update_Box_Record_Obj(get_all_new_record,get_all_old_record);
      if(update_record_create)
      {
        var old_record=update_record_create[0];
        var new_record=update_record_create[1];
        new_record=Create_Box_Record_Obj(new_record);
        if(old_record && old_record.length>0 )
        {
          Call_Ajax_data_update(old_record,'old_record',user);
        }	
        if(new_record && new_record.length>0)
        {
          Call_Ajax_data_update(new_record,'new_record',user);
        }
      }
    }
  }
}
function List_Without_box_record(chek_type)
{
  var record_item=[];
  var form_to_location_id=[]; 
  for(var a=1;a<=nlapiGetLineItemCount('custitem_list_outgoing');a++)
  {
    try
    {
      if(nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_box_record_have',a)==chek_type && nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_status',a)!='Pending Fulfillment')
      {		

        var form_location=nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_from_location',a);
        var to_location=nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_to_location',a);
        var box_form_to_location='-'+nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_to_same_location',a);
        var index_no= form_to_location_id.indexOf(box_form_to_location);
        var get_insu_value=nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_insurence_total',a);
        if(get_insu_value){get_insu_value=parseFloat(get_insu_value);}else{get_insu_value=0;}
        if(get_insu_value>70000 || index_no==-1)
        {
          record_item.push({
            "box_form_to_location":box_form_to_location,
            "total_insurence_val":0,
            "box_id":0,
            "box_to_location":to_location,
            "box_from_location":form_location,
            "line_item":[]}) 
          index_no=record_item.length-1;	
          if(get_insu_value<=70000)
          {
            form_to_location_id.push(box_form_to_location);  
          }
        }		  
        record_item[index_no].total_insurence_val+=get_insu_value;	
        var transfer_id_get=nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_internalid',a);
        var index_transfer_id=tranfer_id_obj.indexOf(transfer_id_get);
        if(index_transfer_id==-1)
        {
          tranfer_id_obj.push(transfer_id_get);
          insurence_amount.push(get_insu_value);
        }
        else
        {
          insurence_amount[index_transfer_id]+=get_insu_value;
        }
        record_item[index_no].line_item.push({
          "tranfer_id":nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_internalid',a),
          "tranfer_doc":nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_document_number',a),          
          "memo":encodeURIComponent(nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_memo',a)),
          "insurance_value":get_insu_value,
          "box_id_value":nlapiGetLineItemValue('custitem_list_outgoing','custitem_outgoing_box_records_id',a),
          "checked":false,
        });

      }
    }
    catch(er)
    {
    }
  }
  return record_item;
}
function Number_of_box_create(insu_value,vendor)
{
  var get_insu_val=[];
  var get_insu_check=50000;
  var get_val= parseInt(insu_value/50000);
  for(var a=1;a<=get_val;a++)
  {
    get_insu_val.push(50000);                  
    insu_value=insu_value-get_insu_check;
    if(insu_value<=70000)
    {
      break;
    }
  }
  get_insu_val.push(70000);

  return get_insu_val;
}

function Create_Box_Record_Obj(record_item)
{
  var send_record=[];
  if(record_item)
  {
    for(var a=0;a<record_item.length;a++)
    {

      var total_insurence_val=record_item[a].total_insurence_val;
      var line_item_count=record_item[a].line_item.length;
      var box_form_to_location=record_item[a].box_form_to_location;
      if(total_insurence_val>70000 && line_item_count==1)
      {
        //alert('22');
        temp_data_obj.push('1');
        send_record.push({	
          "box_form_to_location":box_form_to_location,
          "total_insurence_val":total_insurence_val,
          "box_id":0,
          "box_to_location":record_item[a].box_to_location,
          "box_from_location":record_item[a].box_from_location,
          "line_item":[]
        });
        var get_line_item=record_item[a].line_item;
        for(var b=0;b<get_line_item.length;b++)
        {
          get_line_item[b].checked=true;
          send_record[send_record.length-1].line_item.push(get_line_item[b]);
        }
      }
    }
    for(var a=0;a<record_item.length;a++)
    {
      var box_form_to_location=record_item[a].box_form_to_location;
      var get_insu_amount=record_item[a].total_insurence_val;
      var get_line_item=record_item[a].line_item;
      var chek_number_of_insurence=Number_of_box_create(get_insu_amount,box_form_to_location);
      for(var c=0;c<chek_number_of_insurence.length;c++)
      {
        var amount_compair=chek_number_of_insurence[c];
        var bool_val=true;
        var insu_value=0;
        for(var b=0;b<get_line_item.length;b++)
        {
          if(!get_line_item[b].checked)
          {

            if(bool_val)
            {
              temp_data_obj.push('1');
              send_record.push({
                "box_form_to_location":box_form_to_location,
                "total_insurence_val":0,
                "box_id":0,
                "box_to_location":record_item[a].box_to_location,
                "box_from_location":record_item[a].box_from_location,
                "line_item":[]
              });
              bool_val=false;
            }
            var get_insu=parseFloat(get_line_item[b].insurance_value);
            var ck_get_insu=parseFloat(get_line_item[b].insurance_value);	
            var insu_value_temp=ck_get_insu+insu_value;
            if(insu_value_temp<=amount_compair)
            {
              insu_value=get_insu+insu_value;
              get_line_item[b].checked=true;
              send_record[send_record.length-1].total_insurence_val=insu_value;
              send_record[send_record.length-1].line_item.push(get_line_item[b]);
            }
          }
        }
      }
    }
  }
  return send_record;
}
function Old_Record_marge_box(record)
{

  var get_marge_record=[];
  var get_box_obj=[];
  if(record)
  {
    for(var a=0;a<record.length;a++)
    {
      var line_item=record[a].line_item;
      if(line_item)
      {

        for(var b=0;b<line_item.length;b++)
        {

          var get_box_id_value=line_item[b].box_id_value;
          var index_number=get_box_obj.indexOf(get_box_id_value);
          if(index_number==-1)
          {
            get_box_obj.push(get_box_id_value);
            get_marge_record.push({
              "box_form_to_location":record[a].box_form_to_location,
              "total_insurence_val":line_item[b].insurance_value,
              "box_id":get_box_id_value,
              "box_to_location":record[a].box_to_location,
              "box_from_location":record[a].box_from_location,
              "line_item":[]
            });
            get_marge_record[get_marge_record.length-1].line_item.push(line_item[b]);

          }
          else
          {
            get_marge_record[index_number].line_item.push(line_item[b]);	
            get_marge_record[index_number].total_insurence_val+= parseFloat(line_item[b].insurance_value);
          }
        }
      }
    }

    return get_marge_record;
  }
}

function Update_Box_Record_Obj(get_all_new_record,get_all_old_record)
{
  var get_data_update=[];
  for(var a=0;a<get_all_old_record.length;a++)
  { 
    var flag=false;
    var box_form_to_location=get_all_old_record[a].box_form_to_location;
    var get_insu_val=get_all_old_record[a].total_insurence_val;
    if(get_insu_val){get_insu_val=parseFloat(get_insu_val)}else{get_insu_val=0;}
    var get_insu_compare=0;
    if(get_insu_val>50000 && get_insu_val<70000)
    {
      get_insu_compare=70000;
    }
    else if(get_insu_val<50000)
    {
      get_insu_compare=50000;
    }

    if(get_insu_compare==50000 || get_insu_compare==70000)
    {
      for(var b=0;b<get_all_new_record.length;b++)
      {
        var child_box_form_to_location=get_all_new_record[b].box_form_to_location;       
        if(child_box_form_to_location==box_form_to_location)
        {

          var get_line=get_all_new_record[b].line_item;
          if(get_line)
          {
            for(var c=0;c<get_line.length;c++)
            {
              if(!get_line[c].checked)
              {
                var get_ins_child=get_line[c].insurance_value;
                if(get_ins_child){get_ins_child=parseFloat(get_ins_child)}else{get_ins_child=0;}

                var ck_get_insu=get_ins_child;			
                var index_obj;			

                var get_tranfer_id=get_line[c].tranfer_id;
                index_obj=tranfer_id_obj.indexOf(get_tranfer_id);
                var get_max_insurence= parseFloat(insurence_amount[index_obj]);	
                if(get_max_insurence>=get_ins_child)			
                {
                  ck_get_insu=get_max_insurence;
                }					
                var temp_bj_new=get_insu_val+ck_get_insu;

                if((get_insu_compare==70000 && temp_bj_new<=70000)|| (get_insu_compare==50000 && temp_bj_new<=50000))
                {

                  if(index_obj>=0)
                  {
                    insurence_amount[index_obj]-=get_ins_child;
                  }
                  get_insu_val +=get_ins_child;
                  get_all_new_record[b].total_insurence_val-=get_ins_child;
                  get_line[c].checked=true;
                  get_all_old_record[a].line_item.push(get_line[c]);
                  get_all_old_record[a].total_insurence_val+=get_ins_child;
                  flag=true;
                }	
              }
            }
          }
        }
      }
    }
    if(flag)
    {
      temp_data_obj.push('1');
      get_data_update.push(get_all_old_record[a]);
    }
  }
  return [get_data_update,get_all_new_record]
}
function Call_Ajax_data_update(data_update,url_string,user)
{
  document.getElementById("id_wait").style='';
  document.getElementById("id_wait_message").innerText="Creating Box Record "+send_data_qty+" out of "+temp_data_obj.length;
  var send_data_record=[];
  for(var c=0;c<data_update.length;c++)
  {
    var send_data={
      type:url_string,
      send_data:data_update[c]
    }
    var send_data=JSON.stringify(send_data);
    send_data_record.push(send_data);

  }
  if(send_data_record.length>0)
  {
    send_data_qty=0;
    loadDoc(send_data_record,user);
  }
}

function loadDoc(send_data,user) {

  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: send_data[send_data_qty],
    dataType: "json",
    success: function(get_return_value) { 
      send_data_qty++;
      document.getElementById("id_wait_message").innerText="Creating  Box Record "+send_data_qty+" out of "+temp_data_obj.length;
      if(send_data_qty<(send_data.length))
      {
        loadDoc(send_data,user);
      }
      else
      {
        refreshmachine('custitem_list_outgoing');
        document.getElementById("id_wait").style='display:none';
        //document.getElementById('tbl_custitem_outgoing_print_picking_slip').style='';
        // document.getElementById('tbl_custitem_outgoing_shipping_label').style='';
        // refreshmachine_outgoing();
      }
    }

  });

}


function refreshmachine_outgoing()
{ 
  var outgoing_url=Check_url(false);
  document.getElementById('server_commands').src =outgoing_url
  Get_Update_Records(outgoing_url,'records_outgoing','records_outgoing_page',true);
}

function refreshmachine_incoming()
{
  var incoming_url=Check_url(true);; 
  document.getElementById('server_commands').src =incoming_url;
  Get_Update_Records(incoming_url,'records_incoming','records_incoming_page',false);
}


function ShowTab(lname, bIgnoreInited) {

  NS.jQuery('.uir_form_tab_container:eq(0)').trigger({
    type: "nsSelect",
    message: "nsSelect fired.",
    time: new Date()
  }, {}
                                                    );

  if ((bIgnoreInited || NS.form.isInited()) && NS.form.isValid()) {
    if(lname == sCurrentlySelectedTab) return;
    ShowHideTab(lname, true);
    ShowHideTab(sCurrentlySelectedTab, false);
    sCurrentlySelectedTab = lname;
    if (window.NLMachine_clearFocus) {
      NLMachine_clearFocus();
    }
    if (lname == 'custitem_incoming') {
      setSelectFocus(document.forms['custitem_incoming_form'].elements['custitem_incoming_location_to']);
      refreshmachine('custitem_list_incoming')



    }
    else if (lname == 'custitem_outgoing') {
      setSelectFocus(document.forms['custitem_outgoing_form'].elements['custitem_outgoing_location_to']);
      refreshmachine('custitem_list_outgoing')

    }
  }
}

function custitem_list_outgoingMarkAll(val)
{
  var class_name='checkbox_unck';
  if(val){class_name='checkbox_ck'}
  var check_box_name=document.getElementsByName("check_box_outgoing_value");
  for(var a=0;a<check_box_name.length;a++)
  {
    check_box_name[a].className =class_name;
  }
}


