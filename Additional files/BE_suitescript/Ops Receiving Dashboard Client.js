var or_item_materials_id=['13','7','5','6','15','14','12','18'];
var or_item_materials_text=['Antique Appraisal','Cert','Cleaner','Mats','Mats - Reincorporated','Promotional Item' ,'Work and Release of Liability','Promo Item- Reincorporated'];
var or_item_materials_internal=['antique_appraisal_box','cert_box','cleaner_box','mats_box','mats_reincorporated_box','promotional_item_box','work_and_release_of_liability_box','promo_item_reincorporated'];
var or_item_box_id=['9','4','2','3','11','1','10','16','17'];
var or_item_box_text=['2 Single Boxes','Customer Box','Double Box','Extra Small Box','Pendant Box' ,'Single Box','Single Box - Reincorporated','Double Box Reincorporated','Kraft Box'];
var or_item_box_internal=['two_single_boxes_materials','customer_box_materials','double_box_materials','extra_small_box_materials','pendant_box_materials','single_box_materials','single_box_reincorporated_materials','double_box_reincorporated','kraft_box'];

var location_id_obj=['','2','3','4','6'];
var location_text_obj=['','San Francisco','Los Angeles','Item Sent to SF (Ops Only Status)','Boston'];
var data_send_obj=new Array();
var temp_data_obj=new Array();
var tab_name;

function TEAM(value_id)
{
  var search_key= document.getElementById('myInputpackage').value;
  var droup_off=document.getElementById('all_package_droup_off').value;
  var status_value=document.getElementById('custrecord_status').value;
  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  window.onbeforeunload = null; 	 
  window.location=url+'&search_key='+search_key+'&team_id='+value_id+'&custbody_drop_off='+droup_off+'&custrecord_status='+status_value+'&tab=custpage_all_tab_one';
}
function Droup_Off_Pakage(value_id,tab_number)
{
  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  url+='&search_key='+document.getElementById('myInputpackage').value;
  url+='&team_id='+document.getElementById('all_package_team').value;
  url+='&tab=custpage_all_tab_one';
  url+='&custbody_drop_off='+value_id;
  url+='&custrecord_status='+document.getElementById('custrecord_status').value;
  window.onbeforeunload = null;
  window.location=url

}

function Droup_Off(value_id,tab_number)
{

  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  url+='&search_key='+document.getElementById('myInputintakee').value;
  url+='&tab=custpage_all_tab_two';
  url+='&custbody_drop_off='+value_id;
  window.onbeforeunload = null;
  window.location=url
}

function Droup_Off(value_id)
{

  var search_key= document.getElementById('myInputintakee').value;
  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  window.onbeforeunload = null;
  window.location=url+'&search_key='+search_key+'&custbody_drop_off='+value_id+'&tab=custpage_all_tab_two';
}

function cutpage_package_paging(value_field)
{
  document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine=custpage_all_packages&cutpage_page_package='+value_field;
}
function cutpage_sale_intake(value_field)
{

  document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine=custpage_post_sale_intake&cutpage_page_sale_intake='+value_field;
}
function cutpage_incoming_international(value_field)
{
  document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine=custpage_incoming_international&cutpage_page_internationale='+value_field;
}


function location_set(index_number)
{

  var select_location=[];
  var x=document.getElementById('location_multi_'+index_number);
  if(x.options[0].selected){
    document.getElementById(location_id).value = [""];
  }
  else
  { 
    for (var i = 1; i < x.options.length; i++) {
      if(x.options[i].selected ==true){
        select_location.push(location_id_obj[i]);
      }
    }
  }
  var result_location=[select_location.join(',')];  
  document.getElementsByName('custpage_location'+index_number)[0].value=result_location;
}


function Page_Init()
{



  var a=document.createElement("style");a.type="text/css",a.innerHTML=".save_button_class {width:100px;font-family:Verdana, Geneva, sans-serif;cursor:pointer;background-color: #008CBA;color:#ffffff;border-color:#008CBA;padding:5px;}.modal {    display: none;     position: fixed;     z-index: 1;    padding-top: 100px;     left: 0;    top: 0;    width: 100%;    height: 100%;    overflow: auto;    background-color: rgb(0,0,0);     background-color: rgba(0,0,0,0.4); }.modal-content { background-color: #fefefe;    margin: auto;    padding: 20px;    border: 1px solid #888;    width: 500px;}.close_sumarry {    color: #aaaaaa;    float: right;    font-size: 28px;    font-weight: bold;}.close_sumarry:hover,.close_sumarry:focus {    color: #000;    text-decoration: none;    cursor: pointer;}#custpage_all_tab_two_wrapper{z-index:1 !important} #custpage_all_tab_three_wrapper{z-index:1 !important}  #custpage_all_tab_one_wrapper{z-index:1 !important}",document.body.appendChild(a);

  var d=document.createElement("div");d.innerHTML="<div id='myModal_data' class='modal'> <div class='modal-content'><center><h1>Please Wait...</h1></center></div></div>";  
  document.body.appendChild(d);  


  var b=document.createElement("div");b.innerHTML="<input type='hidden' id='index_number_pop_up_box'/><div id='myModal' class='modal'>  <div class='modal-content'><div id='myModalTestTest'><table width='100%'><tbody><tr><td><input type='button' class='save_button_class'  id='save_button' name='Save Data'  value='Save' onclick='or_item_data()' /></td><td align='right'><span class='close_sumarry'  onclick=document.getElementById('myModal').style.display='none'; >×</span></td></tr><tr><td><input id='"+or_item_box_internal[0]+"'  type='checkbox' />"+or_item_box_text[0]+"</td><td><input id='"+or_item_box_internal[1]+"'  type='checkbox' />"+or_item_box_text[1]+"</td></tr><tr><td><input id='"+or_item_box_internal[2]+"'  type='checkbox' />"+or_item_box_text[2]+"</td><td><input id='"+or_item_box_internal[3]+"'  type='checkbox' />"+or_item_box_text[3]+"</td></tr><tr><td><input id='"+or_item_box_internal[4]+"'  type='checkbox' />"+or_item_box_text[4]+"</td><td><input id='"+or_item_box_internal[5]+"'  type='checkbox' />"+or_item_box_text[5]+"</td></tr><tr><td><input id='"+or_item_box_internal[6]+"'  type='checkbox' />"+or_item_box_text[6]+"</td><td><input id='"+or_item_box_internal[7]+"'  type='checkbox' />"+or_item_box_text[7]+"</td></tr><tr><td><input id='"+or_item_box_internal[8]+"'  type='checkbox' />"+or_item_box_text[8]+"</td><td></td></tr></tbody></table></div></div></div>",document.body.appendChild(b);


  var c=document.createElement("div");c.innerHTML="<input type='hidden' id='index_number_pop_up_materials'/><div id='myModal_materials' class='modal'> <div class='modal-content'><div id='myModalTest'><table width='100%'><tbody><tr><td><input type='button' class='save_button_class'  id='save_button_materials' name='Save Data' value='Save' onclick='or_item_data_materials()' /></td><td  align='right'><span class='close_sumarry'  onclick=document.getElementById('myModal_materials').style.display='none'; >×</span></td></tr><tr><td><input id='"+or_item_materials_internal[0]+"'  type='checkbox' />"+or_item_materials_text[0]+"</td><td><input id='"+or_item_materials_internal[1]+"'  type='checkbox' />"+or_item_materials_text[1]+"</td></tr><tr><td><input id='"+or_item_materials_internal[2]+"'  type='checkbox' />"+or_item_materials_text[2]+"</td><td><input id='"+or_item_materials_internal[3]+"'  type='checkbox' />"+or_item_materials_text[3]+"</td></tr><tr><td><input id='"+or_item_materials_internal[4]+"'  type='checkbox' />"+or_item_materials_text[4]+"</td><td><input id='"+or_item_materials_internal[5]+"'  type='checkbox' />"+or_item_materials_text[5]+"</td></tr><tr><td><input id='"+or_item_materials_internal[6]+"'  type='checkbox' />"+or_item_materials_text[6]+"</td><td><input id='"+or_item_materials_internal[7]+"'  type='checkbox' />"+or_item_materials_text[7]+"</td></tr></tbody></table></div></div></div>",document.body.appendChild(c);

  var tab_name=getUrlParameter('tab');
  if(tab_name)
  {
    ShowTab_load(tab_name, false);
  }
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};





function Update_Order_Package()
{
  var data_update=[];
  var flag=0;
  var validate=1;
  data_send_obj=new Array();
  temp_data_obj=new Array();
  for(var z=1;z<=nlapiGetLineItemCount('custpage_all_packages');z++)
  {
    var line_id=nlapiGetLineItemValue('custpage_all_packages','custpage_current_line_package',z);
    var custrecord_received=nlapiGetLineItemValue('custpage_all_packages','custpage_received_chk',z);
    var custrecord_received_old=nlapiGetLineItemValue('custpage_all_packages','custpage_received_chk_old',z);
    var custrecord_team=nlapiGetLineItemValue('custpage_all_packages','custpage_team',z);
    var custrecord_team_old=nlapiGetLineItemValue('custpage_all_packages','custpage_team_old',z);
    var internalid=nlapiGetLineItemValue('custpage_all_packages','custpage_internal_id',z);
    var custpage_shipped_by_old=nlapiGetLineItemValue('custpage_all_packages','custpage_shipped_by_old',z);
    var custpage_shipped_by=nlapiGetLineItemValue('custpage_all_packages','custpage_shipped_by',z);
    if(!custrecord_team && custrecord_received=='T')
    {
      validate=0;
      break;
    }
    if(custrecord_team!=custrecord_team_old || custrecord_received_old!=custrecord_received || custpage_shipped_by_old!=custpage_shipped_by)
    {
      temp_data_obj.push('');
      flag=1;
      data_update.push({
        custrecord_received:custrecord_received,
        custrecord_team:custrecord_team,
        custrecord_shipped_by:custpage_shipped_by,
        internalid:internalid,
      });
    }
  }
  if(flag && validate)
  {
    tab_name='custpage_all_packages';
    var date_change=new Date();
    document.getElementById("span_all_package").innerHTML=date_change;
    document.getElementById('myModal_data').style.display="block";
    Call_Ajax_data_update(data_update,'all_package=true&',true,tab_name);
  }
  else
  {
    alert('Please select team for checked CPR');
  }

}

function status_change(value_id)
{
  var search_key= document.getElementById('myInputpackage').value;
  var team_id= document.getElementById('all_package_team').value;
  var droup_off=document.getElementById('all_package_droup_off').value;
  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  window.onbeforeunload = null; 	 
  window.location=url+'&search_key='+search_key+'&team_id='+team_id+'&custbody_drop_off='+droup_off+'&custrecord_status='+value_id+'&tab=custpage_all_tab_one';
}


function Update_Team(type,name)
{
  if(name=='custpage_team')
  {
    temp_data_obj=new Array();
    data_send_obj=new Array();
    var data_update=[];
    var custrecord_received=nlapiGetCurrentLineItemValue('custpage_all_packages','custrecord_received_old');
    var custrecord_team=nlapiGetCurrentLineItemValue('custpage_all_packages','custpage_team');
    var  internalid=nlapiGetCurrentLineItemValue('custpage_all_packages','custpage_internal_id');
    data_update.push({
      update_team:'OK',
      custrecord_team:custrecord_team,
      internalid:internalid,
    });
    var tab_name='custpage_all_packages';
    var date_change=new Date();
    document.getElementById("span_all_package").innerHTML=date_change;
    document.getElementById('myModal_data').style.display="block";
    temp_data_obj.push('');
    Call_Ajax_data_update(data_update,'all_package=true&',false,tab_name);
  }
  return true;
}



function Update_Order()
{
  tab_name='';
  var data_update=[];
  var flag=0;
  data_send_obj=new Array();
  temp_data_obj=new Array();
  for(var z=1;z<=nlapiGetLineItemCount('custpage_post_sale_intake');z++)
  {
    var line_id=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_current_line',z);
    //var data_share=Get_shared_name(line_id);    

    var custbody129=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_tbw_firm',z);
    var custbody36=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_date_received',z);
    var custbody245=document.getElementsByName("custpage_location"+line_id)[0].value;//nlapiGetLineItemValue('custpage_post_sale_intake','custpage_location',z);
    var custbody254=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_or_notes',z);
    var custbody142=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_status_of_repairs_resizes',z);
    var custpage_select_box_id=document.getElementsByName("custpage_select_box_id"+line_id)[0].value
    var custpage_select_materials_id=document.getElementsByName("custpage_select_materials_id"+line_id)[0].value
    var custbody129_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_tbw_firm_old',z);
    var custbody36_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_date_received_old',z);
    var custbody245_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_location_old',z);
    var custbody254_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_or_notes_old',z);
    var custbody142_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_status_of_repairs_resizes_old',z);
    var custpage_select_box_id_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_select_box_id_old',z);
    var custpage_select_materials_id_old=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_select_materials_id_old',z);
    var custpage_undelivered=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_undelivered',z);
    var sales_order_id=nlapiGetLineItemValue('custpage_post_sale_intake','custpage_trans_post_sales',z);
    if(custpage_undelivered=='T' || custbody129!=custbody129_old || custbody36!=custbody36_old || custbody245!=custbody245_old ||custbody254!=custbody254_old || custbody142!=custbody142_old ||  custpage_select_box_id!=custpage_select_box_id_old || custpage_select_materials_id!=custpage_select_materials_id_old)
    {
      flag=1;
      var or_item_data=[];
      if(custpage_select_box_id)
      {
        var temp_custpage_select_box_id=custpage_select_box_id.split(',');
        for(var p=0;p<temp_custpage_select_box_id.length;p++)
        {
          or_item_data.push(temp_custpage_select_box_id[p]);
        }
      }
      if(custpage_select_materials_id)
      {
        var temp_custpage_select_materials_id=custpage_select_materials_id.split(',');

        for(var p=0;p<temp_custpage_select_materials_id.length;p++)
        {
          or_item_data.push(temp_custpage_select_materials_id[p]);
        }
      }
      var location_obj_new_value=[];
      if(custbody245)
      {
        var temp_custbody245=custbody245.split(',');

        for(var p=0;p<temp_custbody245.length;p++)
        {
          location_obj_new_value.push(temp_custbody245[p]);
        }
      }
      temp_data_obj.push('');
      data_update.push({
        custbody253:or_item_data,
        custbody129:custbody129,
        custbody36:custbody36,
        custbody245:location_obj_new_value,
        custbody254: custbody254,
        custbody142:custbody142,
        custpage_salesorder_id:sales_order_id,
        custpage_undelivered:custpage_undelivered
      });

      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_tbw_firm_old',z,custbody129);
      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_date_received_old',z,custbody36);
      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_location_old',z,custbody245);
      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_or_notes_old',z,custbody254);
      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_status_of_repairs_resizes_old',z,custbody142);
      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_select_box_id_old',z,custpage_select_box_id);
      nlapiSetLineItemValue('custpage_post_sale_intake','custpage_select_materials_id_old',z,custpage_select_materials_id);
    }
  }
  if(flag)
  {
    var date_change=new Date();
    document.getElementById("span_sale_intake").innerHTML=date_change;
    document.getElementById('myModal_data').style.display="block";

    Call_Ajax_data_update(data_update,'postsaleintake=true&',true,'custpage_post_sale_intake');
  }


}

function Call_Ajax_data_update(data_update,type_value,flag_value,tab_name)
{
  for(var c=0;c<data_update.length;c++)
  {
    var send_data=type_value+'send_data='+encodeURIComponent(JSON.stringify(data_update[c]));
    loadDoc(send_data,true,flag_value,tab_name);
  }
}


function Update_orders3()
{
  tab_name='';
  var data_update=[];
  var flag=0;
  data_send_obj=new Array();
  temp_data_obj=new Array();
  for(var x=1; x <= nlapiGetLineItemCount('custpage_incoming_international'); x++)
  {

    var svalue=nlapiGetLineItemValue('custpage_incoming_international', 'custpage_shipper_dec_status', x);
    var Pre_dec_status_val=nlapiGetLineItemValue('custpage_incoming_international', 'custpage_shipper_dec_status_hiddden', x);
    if(svalue != Pre_dec_status_val)
    {
      flag=1;
      temp_data_obj.push('');
      data_update.push({
        custbody297:nlapiGetLineItemValue('custpage_incoming_international','custpage_shipper_dec_status', x),
        custpage_salesorder_id:nlapiGetLineItemValue('custpage_incoming_international', 'custpage_trans_post_incoming', x),
      });
      nlapiSetLineItemValue('custpage_incoming_international', 'custpage_shipper_dec_status_hiddden', x,svalue);
    }
  }
  if(flag)
  {
    var date_change=new Date();
    document.getElementById("span_incoming_international").innerHTML=date_change;
    document.getElementById('myModal_data').style.display="block";
    Call_Ajax_data_update(data_update,'incoming_international=true&',true,'custpage_incoming_international');
  }
  return true;
}

function loadDoc(send_data,message,flag_value,sublist) {  

  jQuery.ajax({
    type: 'POST',
    url: '/app/site/hosting/scriptlet.nl?script=1171&deploy=1',
    data: send_data,
    dataType: "text",
    success: function(msgesem) {

      if(message)
      {
        data_send_obj.push('');
        if(data_send_obj.length==temp_data_obj.length)
        {
          document.getElementById('myModal_data').style.display="none";
          if(flag_value)
          {
            var tab_name='';
            if (sublist == 'custpage_all_packages') {
              tab_name='custpage_all_tab_one';
            }
            else if (sublist == 'custpage_post_sale_intake') {
              tab_name='custpage_all_tab_two';
            }
            else if (sublist == 'custpage_incoming_international') {
              tab_name='custpage_all_tab_three';
            }

            var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
            window.onbeforeunload = null; 	 
            window.location=url+'&tab='+tab_name;
          }
        }
      }

    }
  });
}






function on_field_change(type, name,form)
{

  return true;
}


function Show_Data_Use(tab_name)
{
  document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine='+tab_name;
}




//  OR ITEM //
function box_plus(index_value)
{
  document.getElementById('myModal').style.display="block";
  document.getElementById('index_number_pop_up_box').value=index_value+'';
  Bin_pop_value_box(index_value);
}

function materials_plus(index_value)
{
  document.getElementById('myModal_materials').style.display="block";
  document.getElementById('index_number_pop_up_materials').value=index_value+'';
  Bin_pop_value_materials(index_value);
}



function or_item_data()
{
  var cr_index=document.getElementById('index_number_pop_up_box').value;
  var value_fatch=[];
  var value_fatch_value=[];
  for(var b=0;b<or_item_box_internal.length;b++)
  {
    if(document.getElementById(or_item_box_internal[b]).checked)
    {
      value_fatch.push(or_item_box_id[b]);
      value_fatch_value.push(or_item_box_text[b]);
    };
  }	  
  document.getElementsByName('custpage_select_box_id'+cr_index)[0].value=value_fatch.join(',');	   
  document.getElementById('box_value'+cr_index).innerHTML=value_fatch_value.join(', ');
  document.getElementById('myModal').style.display="none";
}

function Bin_pop_value_box(cr_index)
{

  for(var b=0;b<or_item_box_internal.length;b++)
  {
    document.getElementById(or_item_box_internal[b]).checked=false;
  }	
  var value_fatch=[];
  var value_fatch_value=[];
  var select_box_id=document.getElementsByName('custpage_select_box_id'+cr_index)[0].value;
  if(select_box_id)
  {
    select_box_id=select_box_id.split(',');
    for(var b=0;b<select_box_id.length;b++)
    {
      var index_no=or_item_box_id.indexOf(select_box_id[b]);
      document.getElementById(or_item_box_internal[index_no]).checked=true;
    }
  }
}



function or_item_data_materials()
{
  var cr_index=document.getElementById('index_number_pop_up_materials').value;  
  var value_fatch=[];
  var value_fatch_value=[];
  for(var b=0;b<or_item_materials_internal.length;b++)
  {
    if(document.getElementById(or_item_materials_internal[b]).checked)
    {
      value_fatch.push(or_item_materials_id[b]);
      value_fatch_value.push(or_item_materials_text[b]);
    };
  }
  document.getElementsByName('custpage_select_materials_id'+cr_index)[0].value=value_fatch.join(',');
  document.getElementById('materials_value'+cr_index).innerHTML=value_fatch_value.join(', ');
  document.getElementById('myModal_materials').style.display="none";
}


function Bin_pop_value_materials(cr_index)
{
  for(var b=0;b<or_item_materials_internal.length;b++)
  {
    document.getElementById(or_item_materials_internal[b]).checked=false;
  }	
  var value_fatch=[];
  var value_fatch_value=[];
  var select_box_id=document.getElementsByName('custpage_select_materials_id'+cr_index)[0].value;
  if(select_box_id)
  {
    select_box_id=select_box_id.split(',');
    for(var b=0;b<select_box_id.length;b++)
    {
      var match_value=select_box_id[b];
      var index_no=or_item_materials_id.indexOf(match_value);  
      document.getElementById(or_item_materials_internal[index_no]).checked=true;
    }
  }
}



function refreshmachine(sublist)
{
  var tab_name='';
  if (sublist == 'custpage_all_packages') {
    tab_name='custpage_all_tab_one';
  }
  else if (sublist == 'custpage_post_sale_intake') {
    tab_name='custpage_all_tab_two';
  }
  else if (sublist == 'custpage_incoming_international') {
    tab_name='custpage_all_tab_three';
  }
  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  window.onbeforeunload = null; 	 
  window.location=url+'&tab='+tab_name;
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
    if (lname == 'custpage_all_tab_one') {
      var date_change=new Date();
      document.getElementById("span_all_package").innerHTML=date_change;
      document.getElementById('myInputpackage').value='';
      document.getElementById('all_package_team').selectedIndex="0";
      document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine=custpage_all_packages';
    }
    else if (lname == 'custpage_all_tab_two') {
      var date_change=new Date();
      document.getElementById("span_sale_intake").innerHTML=date_change;
      document.getElementById('myInputintakee').value='';
      document.getElementById('post_sales_droup_off').selectedIndex="0";
      document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine=custpage_post_sale_intake';
    }
    else if (lname == 'custpage_all_tab_three') {
      var date_change=new Date();
      document.getElementById("span_incoming_international").innerHTML=date_change;
      document.getElementById('myInputinternationale_search').value='';
      document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=1169&deploy=1&r=T&machine=custpage_incoming_international';
    }
  }

}

function Search_All(search_key,team,all_package_droupoff,post_sales_intak_droupoff,tab_name,event)
{
  var url = nlapiResolveURL('SUITELET', 'customscript_ops_receiving_dashboard', 'customdeploy_ops_receiving_dashboard');
  window.onbeforeunload = null;
  if(search_key)
  {
    url+='&search_key='+document.getElementById(search_key).value;
  }
  if(team)
  {
    url+='&team_id='+document.getElementById('all_package_team').value;
  }
  if(post_sales_intak_droupoff)
  {
    url+='&custbody_drop_off='+document.getElementById('post_sales_droup_off').value;
  }
  if(all_package_droupoff)
  {
    url+='&custbody_drop_off='+document.getElementById('all_package_droup_off').value;
  }

  var custrecord_status=document.getElementById('custrecord_status').value;
  if(custrecord_status)
  {
    url+='&custrecord_status='+custrecord_status;
  }

  url+="&tab="+tab_name;
  window.location=url;
}
function ShowTab_load(lname, bIgnoreInited) {

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

  }

}

function urlencode (str) {
  str = (str+'').toString();
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}



