var data_send_obj = new Array();
var temp_data_obj = new Array();
var arr_item_ship_sep_value_obj=['','8','6','9','2','5','1','3','7'];
var arr_item_ship_sep_text_obj=['','Cert Kept for Drop Ship','Comped Item','Materials sent via Email','Materials Shipping Separately','Order Shipped without Appraisal','Order Shipped without Cert','Promo Item Shipping Separately','Refund Check'];


function UpdateRecords(sublist_id) {

  var data_update = [];
  var data_update_new = [];
  var flag = 0;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  for (var z = 1; z <= nlapiGetLineItemCount(sublist_id); z++) {
    var custpage_chk = nlapiGetLineItemValue(sublist_id, 'custpage_chk_'+sublist_id, z);
    if (custpage_chk == 'T') {
      var custpage_so_internal_id = nlapiGetLineItemValue(sublist_id, 'custpage_so_internal_id_'+sublist_id, z);
      var custpage_delivery_date_notes = nlapiGetLineItemValue(sublist_id, 'custpage_delivery_date_notes_'+sublist_id, z);
     
      var custpage_item_ship_seperate = document.getElementsByName("custpage_item_ship_seperate_hidden_"+sublist_id+z)[0].value;// nlapiGetLineItemValue(sublist_id, 'custpage_item_ship_seperate_hidden_'+sublist_id, z);
      alert(custpage_item_ship_seperate);
      var custpage_status_item_ship_seperate = nlapiGetLineItemValue(sublist_id, 'custpage_status_item_ship_seperate_'+sublist_id, z);

     // var custpage_materials_tracking_no='',custpage_ship_addr='',custpage_ship_method='',custpage_insurance='';
       var custpage_box_record_hidden='',custpage_ship_method='',custpage_materials_tracking_no='',custpage_insurance='',custpage_attention='',custpage_addressee='',
           custpage_address1='',custpage_address2='',custpage_city='',custpage_state='',custpage_zip='',custpage_country='';
      if(sublist_id=='custpage_ready_to_ship' || sublist_id=='custpage_pending_addr' )
      {
        //custpage_materials_tracking_no=nlapiGetLineItemValue(sublist_id, 'custpage_materials_tracking_no_'+sublist_id, z);
        //custpage_ship_addr=nlapiGetLineItemValue(sublist_id, 'custpage_ship_addr_'+sublist_id, z);
       // custpage_ship_method=nlapiGetLineItemValue(sublist_id, 'custpage_ship_method_'+sublist_id, z);
       // custpage_insurance=nlapiGetLineItemValue(sublist_id, 'custpage_insurance_'+sublist_id, z);
        
       custpage_box_record_hidden = nlapiGetLineItemValue(sublist_id, 'custpage_box_record_hidden_'+sublist_id, z);
	   custpage_ship_method = nlapiGetLineItemValue(sublist_id, 'custpage_ship_method_'+sublist_id, z);
	   custpage_materials_tracking_no = nlapiGetLineItemValue(sublist_id, 'custpage_materials_tracking_no_'+sublist_id, z);
	   custpage_insurance = nlapiGetLineItemValue(sublist_id, 'custpage_insurance_'+sublist_id, z);
       custpage_attention= document.getElementsByName("custpage_attention_"+sublist_id+z)[0].value;
	   custpage_addressee= document.getElementsByName("custpage_addressee_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_addressee_'+sublist_id, z);
	   custpage_address1=document.getElementsByName("custpage_address1_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_address1_'+sublist_id, z);
	   custpage_address2=document.getElementsByName("custpage_address2_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_address2_'+sublist_id, z);
	   custpage_city=document.getElementsByName("custpage_city_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_city_'+sublist_id, z);
	   custpage_state=document.getElementsByName("custpage_state_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_state_'+sublist_id, z);
	   custpage_zip=document.getElementsByName("custpage_zip_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_zip_'+sublist_id, z);
	   custpage_country=document.getElementsByName("custpage_country_"+sublist_id+z)[0].value;//nlapiGetLineItemValue(sublist_id, 'custpage_country_'+sublist_id, z);
       // alert('addresee:' + custpage_addressee + 'Addr1:' + custpage_address1)
      }
      //alert(sublist_id);
      // alert(custpage_status_item_ship_seperate);
      flag = 1;
      data_update.push({
        operation:'Update',
        sublist_id:sublist_id,
        custpage_so_internal_id: custpage_so_internal_id,
        custpage_delivery_date_notes: custpage_delivery_date_notes,
        custpage_item_ship_seperate: custpage_item_ship_seperate,
        custpage_status_item_ship_seperate: custpage_status_item_ship_seperate,
        custpage_box_record_hidden:custpage_box_record_hidden,
        custpage_attention:custpage_attention,
        custpage_addressee:custpage_addressee,
		custpage_address1:custpage_address1,
		custpage_address2:custpage_address2,
		custpage_city:custpage_city,
		custpage_state:custpage_state,
		custpage_zip:custpage_zip,
		custpage_country:custpage_country,
		custpage_ship_method:custpage_ship_method,
		custpage_materials_tracking_no:custpage_materials_tracking_no,
		custpage_insurance:custpage_insurance
        
      });
      temp_data_obj.push('');
    }
  }
  if (data_update) {
    if (flag) {
      document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
      Call_Ajax_data_update(data_update, sublist_id,'Update');
    } else {

      alert('Please select at least one record');
    }
  }

}

function generateLabels(sublist_id) {

  var data_update = [];
  var data_update_new = [];
  var flag = 0;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  for (var z = 1; z <= nlapiGetLineItemCount(sublist_id); z++) {
    var custpage_chk = nlapiGetLineItemValue(sublist_id, 'custpage_chk_'+sublist_id, z);
    if (custpage_chk == 'T') {
      var custpage_so_internal_id = nlapiGetLineItemValue(sublist_id, 'custpage_so_internal_id_'+sublist_id, z);
      var custpage_delivery_date_notes = nlapiGetLineItemValue(sublist_id, 'custpage_delivery_date_notes_'+sublist_id, z);
      var custpage_item_ship_seperate = nlapiGetLineItemValue(sublist_id, 'custpage_item_ship_seperate_hidden_'+sublist_id, z);
      var custpage_status_item_ship_seperate = nlapiGetLineItemValue(sublist_id, 'custpage_status_item_ship_seperate_'+sublist_id, z);
	  var custpage_box_record_hidden = nlapiGetLineItemValue(sublist_id, 'custpage_box_record_hidden_'+sublist_id, z);
	  var custpage_ship_method = nlapiGetLineItemValue(sublist_id, 'custpage_ship_method_'+sublist_id, z);
	  var custpage_materials_tracking_no = nlapiGetLineItemValue(sublist_id, 'custpage_materials_tracking_no_'+sublist_id, z);
	  var custpage_insurance = nlapiGetLineItemValue(sublist_id, 'custpage_insurance_'+sublist_id, z);
      var custpage_attention=nlapiGetLineItemValue(sublist_id, 'custpage_attention_'+sublist_id, z);
	  var custpage_addressee=nlapiGetLineItemValue(sublist_id, 'custpage_addressee_'+sublist_id, z);
	  var custpage_address1=nlapiGetLineItemValue(sublist_id, 'custpage_address1_'+sublist_id, z);
	  var custpage_address2=nlapiGetLineItemValue(sublist_id, 'custpage_address2_'+sublist_id, z);
	  var custpage_city=nlapiGetLineItemValue(sublist_id, 'custpage_city_'+sublist_id, z);
	  var custpage_state=nlapiGetLineItemValue(sublist_id, 'custpage_state_'+sublist_id, z);
	  var custpage_zip=nlapiGetLineItemValue(sublist_id, 'custpage_zip_'+sublist_id, z);
	  var custpage_country=nlapiGetLineItemValue(sublist_id, 'custpage_country_'+sublist_id, z);
	  
      // alert(sublist_id);
      //alert(custpage_status_item_ship_seperate);
      flag = 1;
      data_update.push({
        operation:'generate label',
        custpage_so_internal_id: custpage_so_internal_id,
        custpage_delivery_date_notes: custpage_delivery_date_notes,
        custpage_item_ship_seperate: custpage_item_ship_seperate,
		custpage_box_record_hidden:custpage_box_record_hidden,
        custpage_status_item_ship_seperate: custpage_status_item_ship_seperate,
        custpage_attention:custpage_attention,
		custpage_addressee:custpage_addressee,
		custpage_address1:custpage_address1,
		custpage_address2:custpage_address2,
		custpage_city:custpage_city,
		custpage_state:custpage_state,
		custpage_zip:custpage_zip,
		custpage_country:custpage_country,
		custpage_ship_method:custpage_ship_method,
		custpage_materials_tracking_no:custpage_materials_tracking_no,
		custpage_insurance:custpage_insurance
      });
      temp_data_obj.push('');
    }
  }
  if (data_update) {
    if (flag) {
      document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
      Call_Ajax_data_update(data_update, sublist_id,'generate label');
    } else {

      alert('Please select at least one record');
    }
  }

}


function MarkAll(sublist_id)
{
  var selected = 0;
  for (var j = 1; j <= nlapiGetLineItemCount(sublist_id); j++) {
    nlapiSetLineItemValue(sublist_id,'custpage_chk_'+sublist_id,j,'T');
    selected++;
  }
  document.getElementById('selected_records_'+sublist_id).innerHTML=selected;
}


function UnMarkAll(sublist_id)
{
  var selected = 0;
  for (var j = 1; j <= nlapiGetLineItemCount(sublist_id); j++) {
    nlapiSetLineItemValue(sublist_id,'custpage_chk_'+sublist_id,j,'F');
  }
  document.getElementById('selected_records_'+sublist_id).innerHTML=selected;
}

function removeByAttr(arr, attr1, value1) {
  var i = arr.length;
  while (i--) {
    if (arr[i] &&
        arr[i].hasOwnProperty(attr1) &&
        (arguments.length > 2 && arr[i][attr1] == value1)) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

function fieldChanged(type,name,linenum)
{

  if(name='custpage_chk_'+type)
  {
    var selected = 0;
    var count=nlapiGetLineItemCount(type);
    for(var x=1; x <=count ; x++)
    {
      if(nlapiGetLineItemValue(type,"custpage_chk_"+type,x)=="T")
      {
        selected++;
      }
    }
    document.getElementById('selected_records_'+type).innerHTML=selected;
  }
}

function Call_Ajax_data_update(data_update, sublist,operation) {

  for (var c = 0; c < data_update.length; c++) {
    var send_data = JSON.stringify(data_update[c]);
    nlapiLogExecution('Debug','Data',send_data);
    // alert(send_data);
    loadDoc(send_data, sublist,operation);
  }
}

function loadDoc(send_data, sublist,operation) {
  var restUrl = nlapiResolveURL('RESTLET', 'customscript_restlet_item_ship_sep_dash', 'customdeploy_restlet_item_ship_sep_dash');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: send_data, 
    dataType: "text",
    success: function(msgesem) {
      data_send_obj.push('');
      //alert(data_send_obj.length);
      //alert(temp_data_obj.length);
      //document.getElementById('custpage_items_splits').innerHTML =  '<center style="background-color:white; border-color:white"><table width="400px"><tbody><tr><td><img width="29" height="30" src="/core/media/media.nl?id=20639711&c=666639&h=3290efdac7df9b81bd70&whence="></td><td valign="center" style="color: rgb(77, 95, 121); font-family: Open Sans,Helvetica,sans-serif; font-size: 22px; font-weight: bold;">Creating Invoices '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></tbody></center>';
      if(operation=='Update')
      {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Updating Records '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      else{
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=450 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Generating Labels '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      if (data_send_obj.length == temp_data_obj.length) {

        var flag = true;
        var url_hit = '/app/site/hosting/scriptlet.nl?script=2252&deploy=1&r=T&machine='+sublist;
        // alert(url_hit);
        document.getElementById('server_commands').src = url_hit;
      }

    }
  });
}
function setValueItemShipSep(index_number)
{
  var arr_select_item_ship_sep=[];
  var x=document.getElementById('iss_multi_'+index_number);
  if(x.options[0].selected){
    document.getElementById(item_ship_sep_id).value = [""];
  }
  else
  { 
    for (var i = 1; i < x.options.length; i++) {
      if(x.options[i].selected ==true){
        arr_select_item_ship_sep.push(arr_item_ship_sep_value_obj[i]);
      }
    }
  }
  var result_item_ship_sep=[arr_select_item_ship_sep.join(',')];  

  document.getElementsByName('custpage_item_ship_seperate_hidden_custpage_ready_to_ship'+index_number)[0].value=result_item_ship_sep;
  
}
function setValueItemShipSepPndgAddr(index_number)
{
  var arr_select_item_ship_sep=[];
  var x=document.getElementById('iss_multi_pa_'+index_number);
  if(x.options[0].selected){
    document.getElementById(item_ship_sep_id).value = [""];
  }
  else
  { 
    for (var i = 1; i < x.options.length; i++) {
      if(x.options[i].selected ==true){
        arr_select_item_ship_sep.push(arr_item_ship_sep_value_obj[i]);
      }
    }
  }
  var result_item_ship_sep=[arr_select_item_ship_sep.join(',')];  
 
  document.getElementsByName('custpage_item_ship_seperate_hidden_custpage_pending_addr'+index_number)[0].value=result_item_ship_sep;
  
}
function setValueItemShipSepPI(index_number)
{
  var arr_select_item_ship_sep=[];
  var x=document.getElementById('iss_multi_pi_'+index_number);
  if(x.options[0].selected){
    document.getElementById(item_ship_sep_id).value = [""];
  }
  else
  { 
    for (var i = 1; i < x.options.length; i++) {
      if(x.options[i].selected ==true){
        arr_select_item_ship_sep.push(arr_item_ship_sep_value_obj[i]);
      }
    }
  }
  var result_item_ship_sep=[arr_select_item_ship_sep.join(',')];  
 
  document.getElementsByName('custpage_item_ship_seperate_hidden_custpage_pending_items'+index_number)[0].value=result_item_ship_sep;
  
}

function setValueItemShipSepSS(index_number)
{
  var arr_select_item_ship_sep=[];
  var x=document.getElementById('iss_multi_ss_'+index_number);
  if(x.options[0].selected){
    document.getElementById(item_ship_sep_id).value = [""];
  }
  else
  { 
    for (var i = 1; i < x.options.length; i++) {
      if(x.options[i].selected ==true){
        arr_select_item_ship_sep.push(arr_item_ship_sep_value_obj[i]);
      }
    }
  }
  var result_item_ship_sep=[arr_select_item_ship_sep.join(',')];  
 
  document.getElementsByName('custpage_item_ship_seperate_hidden_custpage_select_status'+index_number)[0].value=result_item_ship_sep;
  
}

