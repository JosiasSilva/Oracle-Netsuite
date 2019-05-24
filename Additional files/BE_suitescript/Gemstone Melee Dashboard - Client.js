var data_send_obj = new Array();
var temp_data_obj = new Array();

function createPOs() {

  var data_update = [];
  var data_update_new = [];
  var flag = 0;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  if(validateFields()=='Yes')
  {
    for (var z = 1; z <= nlapiGetLineItemCount('custpage_items'); z++) {
      var custpage_create_po_chk = nlapiGetLineItemValue('custpage_items', 'custpage_items_chk', z);
      if (custpage_create_po_chk == 'T') {

        var custpage_item_name_number = nlapiGetLineItemValue('custpage_items', 'custpage_item_name', z);
        var custpage_item_id = nlapiGetLineItemValue('custpage_items', 'custpage_item_id', z);
        var custpage_vendor = nlapiGetLineItemValue('custpage_items', 'custpage_vendor', z);
        var custpage_vendor_purchasing_notes = nlapiGetLineItemValue('custpage_items', 'custpage_vendor_purchasing_notes', z);
        var custpage_amount_to_order = nlapiGetLineItemValue('custpage_items', 'custpage_amount_to_order', z);
        var custpage_carats_to_order = nlapiGetLineItemValue('custpage_items', 'custpage_carats_to_order', z);
        var custpage_date_needed_in_sf= nlapiGetLineItemValue('custpage_items', 'custpage_date_needed_in_sf', z);
        var custpage_last_purchase_price = nlapiGetLineItemValue('custpage_items', 'custpage_last_purchase_price', z);
        var custpage_item_desc = nlapiGetLineItemValue('custpage_items', 'custpage_item_desc', z);
        


        flag = 1;
        data_update.push({
          custpage_item_name_number: custpage_item_name_number,
          custpage_item_id: custpage_item_id,
          custpage_vendor: custpage_vendor,
          custpage_vendor_purchasing_notes: custpage_vendor_purchasing_notes,
          custpage_amount_to_order: custpage_amount_to_order,
          custpage_carats_to_order: custpage_carats_to_order,
          custpage_last_purchase_price: custpage_last_purchase_price,
          custpage_date_needed_in_sf:custpage_date_needed_in_sf,
          custpage_item_desc:custpage_item_desc
        });
        //temp_data_obj.push('');


      }
    }

    if (data_update) {
      var len = data_update.length;
      while (len > 0) {
        var temp = data_update.filter(function(item) {
          return (item.custpage_vendor == data_update[0].custpage_vendor);
        });
        data_update_new.push({
          custpage_vendor: data_update[0].custpage_vendor,
          items: temp

        });
        temp_data_obj.push('');
        data_update = removeByAttr(data_update, 'custpage_vendor', data_update[0].custpage_vendor);
        len = data_update.length;
      }
    }

    if (flag) {
      // document.getElementById('custpage_items_splits').innerHTML = '<center style=background-color:white; border-color:white><div><img src=/core/media/media.nl?id=20629559&c=666639&h=293fd0cf75f11ad4a6a9&whence= /></div><center>';
      document.getElementById('custpage_items_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
      Call_Ajax_data_update(data_update_new, 'custpage_items');
    } else
    {
      alert('Please select at least one record');
    }
  }
}

function validateFields()
{
  var isValid='Yes';
  for (var z = 1; z <= nlapiGetLineItemCount('custpage_items'); z++) {
    var custpage_create_po_chk = nlapiGetLineItemValue('custpage_items', 'custpage_items_chk', z);
    if (custpage_create_po_chk == 'T' ) {
      var custpage_amount_to_order = nlapiGetLineItemValue('custpage_items', 'custpage_amount_to_order', z);
      var custpage_carats_to_order= nlapiGetLineItemValue('custpage_items', 'custpage_carats_to_order', z);
      var custpage_last_purchase_price = nlapiGetLineItemValue('custpage_items', 'custpage_last_purchase_price', z);
      var custpage_date_needed_in_sf = nlapiGetLineItemValue('custpage_items', 'custpage_date_needed_in_sf', z);
      if( (custpage_amount_to_order=='' || custpage_amount_to_order=='0')  && (custpage_carats_to_order=='' || custpage_carats_to_order=='0'))
      {
        isValid='No';
        alert('Please enter value for at least one field from "Pieces to order" and "Carats to order".');
        break;
      }
      else if(custpage_last_purchase_price=='' || custpage_last_purchase_price=='0.00')
      {
        isValid='No';
        alert('Price Per Unit cannot be left blank or zero for selected item.');
        break;
      }
      else if(custpage_date_needed_in_sf=='' || custpage_date_needed_in_sf==null)
      {
        isValid='No';
        alert('Please enter date for the field "Date Needed in SF".');
        break;
      }

    }

  }
  return isValid;
}

function removeByAttr(arr, attr1, value1) {
  var i = arr.length;
  while (i--) {
    if (arr[i] &&
        arr[i].hasOwnProperty(attr1) &&
        (arguments.length > 2 && arr[i][attr1] === value1)) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

function MarkAllItems()
{
  var selected = 0;
  for (var j = 1; j <= nlapiGetLineItemCount('custpage_items'); j++) {
    nlapiSetLineItemValue('custpage_items','custpage_items_chk',j,'T');
    selected++;
  }

  //document.getElementById('selected_records_items').innerHTML=selected;
}

function UnMarkAllItems()
{
  for (var j = 1; j <= nlapiGetLineItemCount('custpage_items'); j++) {
    nlapiSetLineItemValue('custpage_items','custpage_items_chk',j,'F');
  }

  //document.getElementById('selected_records_items').innerHTML=selected;
}

function Call_Ajax_data_update(data_update, sublist) {

  for (var c = 0; c < data_update.length; c++) {
    var send_data = JSON.stringify(data_update[c]);
    loadDoc(send_data, sublist);
  }
}

function loadDoc(send_data, sublist) {
  var restUrl = nlapiResolveURL('RESTLET', 'customscript_restlet_gemstone_melee_dash', 'customdeploy_restlet_gemstone_melee_dash');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: send_data, //    
    dataType: "text",
    success: function(msgesem) {
      data_send_obj.push('');
      if(sublist=='custpage_items')
      {
        document.getElementById('custpage_items_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Creating POs '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      if (data_send_obj.length == temp_data_obj.length) {
        var url_hit= '/app/site/hosting/scriptlet.nl?script=2023&deploy=1&r=T&machine=custpage_pos';
        document.getElementById('server_commands').src = url_hit;
      }

    }
  });
}
