var data_send_obj = new Array();
var temp_data_obj = new Array();

function Create_Invoice() {
  //document.getElementById('selected_records_items').innerHTML=0;
  var data_update = [];
  var data_update_new = [];
  var flag = 0;
  var validate = 1;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  for (var z = 1; z <= nlapiGetLineItemCount('custpage_items'); z++) {
    var custpage_create_invoice_chk = nlapiGetLineItemValue('custpage_items', 'custpage_create_invoice_chk', z);
    if (custpage_create_invoice_chk == 'T') {

      var custpage_purchase_order = nlapiGetLineItemValue('custpage_items', 'custpage_purchase_order', z);
      var custpage_po_id = nlapiGetLineItemValue('custpage_items', 'custpage_po_id', z);
      var custpage_item = nlapiGetLineItemValue('custpage_items', 'custpage_item', z);
      var custpage_item_id = nlapiGetLineItemValue('custpage_items', 'custpage_item_id', z);
      var custpage_vendor_stock_number = nlapiGetLineItemValue('custpage_items', 'custpage_vendor_stock_number', z);
      var custpage_description = nlapiGetLineItemValue('custpage_items', 'custpage_description', z);
      var custpage_vendor_return_status = nlapiGetLineItemValue('custpage_items', 'custpage_vendor_return_status', z);

      var custpage_vendor_id = nlapiGetLineItemValue('custpage_items', 'custpage_vendor_id', z);
      var custpage_certificate_number = nlapiGetLineItemValue('custpage_items', 'custpage_certificate_number', z);

      flag = 1;
      data_update.push({
        custpage_vendor_id: custpage_vendor_id,
        custpage_purchase_order: custpage_purchase_order,
        custpage_po_id: custpage_po_id,
        custpage_item: custpage_item,
        custpage_item_id: custpage_item_id,
        custpage_vendor_stock_number: custpage_vendor_stock_number,
        custpage_description: custpage_description,
        custpage_vendor_return_status: custpage_vendor_return_status,
        custpage_certificate_number: custpage_certificate_number
      });

    }
  }
  if (data_update) {
    var len = data_update.length;
    while (len > 0) {
      var temp = data_update.filter(function(item) {
        return (item.custpage_vendor_id == data_update[0].custpage_vendor_id);
      });
      data_update_new.push({
        tab:'items',
        custpage_vendor_id: data_update[0].custpage_vendor_id,
        items: temp

      });
      temp_data_obj.push('');
      data_update = removeByAttr(data_update, 'custpage_vendor_id', data_update[0].custpage_vendor_id);
      len = data_update.length;
    }
  }
  if (flag) {
    // document.getElementById('custpage_items_splits').innerHTML = '<center style=background-color:white; border-color:white><div><img src=/core/media/media.nl?id=20629559&c=666639&h=293fd0cf75f11ad4a6a9&whence= /></div><center>';
    document.getElementById('custpage_items_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(data_update_new, 'custpage_items');
  } else {
    {
      alert('Please select at least one record');
    }

  }
}

function updateRecords()
{
  var data_update_new = [];
  var flag = 0;
  var validate = 1;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  for (var z = 1; z <= nlapiGetLineItemCount('custpage_items'); z++) {
    var custpage_create_invoice_chk = nlapiGetLineItemValue('custpage_items', 'custpage_create_invoice_chk', z);
    if (custpage_create_invoice_chk == 'T') {

      var custpage_item_id = nlapiGetLineItemValue('custpage_items', 'custpage_item_id', z);
      var custpage_description = nlapiGetLineItemValue('custpage_items', 'custpage_description', z);
      var custpage_vendor_return_status = nlapiGetLineItemValue('custpage_items', 'custpage_vendor_return_status', z);
      flag = 1;
      data_update_new.push({
        tab:'items-update',
        custpage_item_id: custpage_item_id,
        custpage_description: custpage_description,
        custpage_vendor_return_status: custpage_vendor_return_status,
      });
      temp_data_obj.push('');
    }
  }

  if (flag) {
    // document.getElementById('custpage_items_splits').innerHTML = '<center style=background-color:white; border-color:white><div><img src=/core/media/media.nl?id=20629559&c=666639&h=293fd0cf75f11ad4a6a9&whence= /></div><center>';
    document.getElementById('custpage_items_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(data_update_new, 'custpage_items_update');
  } else {
    {
      alert('Please select at least one record');
    }

  }

}

function fieldChanged(type, name, linenum) {
  if (name == 'custpage_email_status') {
    data_send_obj = new Array();
    temp_data_obj = new Array();
    var data_update = [];
    //alert('FieldChange');
    temp_data_obj.push('');
    data_update.push({
      tab: 'invoices',
      invoice_id: nlapiGetLineItemValue('custpage_invoices', 'custpage_id', linenum),
      email_status: nlapiGetLineItemValue('custpage_invoices', 'custpage_email_status', linenum)
    });

    document.getElementById('custpage_invoices_splits').innerHTML = '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(data_update, 'custpage_invoices');
  }
  else if(name == 'custpage_create_invoice_chk')
  {
    var selected = 0;
    var Count_page=nlapiGetLineItemCount("custpage_items");
    for(var x=1; x <=Count_page ; x++)
    {
      if(nlapiGetLineItemValue("custpage_items","custpage_create_invoice_chk",x)=="T")
      {
        selected++;
      }
    }
    document.getElementById('selected_records_items').innerHTML=selected;
  }
}
function MarkAll()
{
  data_send_obj = new Array();
  temp_data_obj = new Array();
  var data_update = [];
  for (var j = 1; j <= nlapiGetLineItemCount('custpage_invoices'); j++) {
    //alert('mark');
    temp_data_obj.push('');
    data_update.push({
      tab: 'invoices',
      invoice_id: nlapiGetLineItemValue('custpage_invoices', 'custpage_id', j),
      email_status: '1'
    });

    document.getElementById('custpage_invoices_splits').innerHTML = '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
  }
  Call_Ajax_data_update(data_update, 'custpage_invoices');

}
function MarkAllItems()
{
  var selected = 0;
  for (var j = 1; j <= nlapiGetLineItemCount('custpage_items'); j++) {
    nlapiSetLineItemValue('custpage_items','custpage_create_invoice_chk',j,'T');
    selected++;
  }
  document.getElementById('selected_records_items').innerHTML=selected;
}
function UnMarkAll()
{
  data_send_obj = new Array();
  temp_data_obj = new Array();
  var data_update = [];
  for (var j = 1; j <= nlapiGetLineItemCount('custpage_invoices'); j++) {
    // alert('unmark');
    temp_data_obj.push('');
    data_update.push({
      tab: 'invoices',
      invoice_id: nlapiGetLineItemValue('custpage_invoices', 'custpage_id', j),
      email_status: ''
    });

    document.getElementById('custpage_invoices_splits').innerHTML = '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
  }
  Call_Ajax_data_update(data_update, 'custpage_invoices');

}

function UnMarkAllItems()
{
  var selected = 0;
  for (var j = 1; j <= nlapiGetLineItemCount('custpage_items'); j++) {
    nlapiSetLineItemValue('custpage_items','custpage_create_invoice_chk',j,'F');
  }
  document.getElementById('selected_records_items').innerHTML=selected;
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


function Call_Ajax_data_update(data_update, sublist) {

  for (var c = 0; c < data_update.length; c++) {

    // var send_data = '&sublist=' + sublist + '&send_data=' + encodeURIComponent(JSON.stringify(data_update[c]));
    var send_data = JSON.stringify(data_update[c]);
    loadDoc(send_data, sublist);

  }
}

function loadDoc(send_data, sublist) {
  var restUrl = nlapiResolveURL('RESTLET', 'customscript_restlet_diamond_retur_inv', 'customdeploy_restlet_diamond_retur_inv');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl, // url: '/app/site/hosting/scriptlet.nl?script=2048&deploy=1&data_save=T',
    data: send_data, //    
    dataType: "text",
    success: function(msgesem) {
      data_send_obj.push('');
      if(sublist=='custpage_items')
      {
        document.getElementById('custpage_items_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Creating invoices '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      else if(sublist=='custpage_items_update')
      {
        document.getElementById('custpage_items_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Updating records '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      if (data_send_obj.length == temp_data_obj.length) {

        var flag = true;
        var url_hit ='';
        if(sublist=='custpage_items_update')
        {
           var vendor_status=document.getElementById('vendor_return_status').value;
          document.getElementById('custpage_items_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
          url_hit = '/app/site/hosting/scriptlet.nl?script=2006&deploy=1&r=T&machine=custpage_items&vr_status='+vendor_status;
        }
        else 
        {
          url_hit = '/app/site/hosting/scriptlet.nl?script=2006&deploy=1&r=T&machine=custpage_invoices';
        }
        document.getElementById('server_commands').src = url_hit;
      }

    }
  });
}
