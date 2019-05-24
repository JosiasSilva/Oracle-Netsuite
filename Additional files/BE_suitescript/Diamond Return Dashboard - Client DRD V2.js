var data_send_obj = new Array();
var temp_data_obj = new Array();

function PageInit(type)
{
  document.getElementById('custpage_owned_diamond_tabtxt').click();
}

function UpdateRecords(sublist_id) {

  var data_update = [];
  var data_update_new = [];
  var flag = 0;
  data_send_obj = new Array();
  temp_data_obj = new Array();

  for (var z = 1; z <= nlapiGetLineItemCount(sublist_id); z++) {

    var item_internal_id='';
    var custpage_reason_for_diamd_ret=  '';
    var custpage_reason_for_diamd_ret_hidden= '';
    
    var custpage_vendor_ret_status='';
    var custpage_vendor_ret_status_hidden='';

    var custpage_exptd_ret_date= '';
    var custpage_exptd_ret_date_hidden=  '';

    var custpage_notes=  '';
    var custpage_notes_hidden=  '';

    var custpage_gemstone_status=  '';
    var custpage_gemstone_status_hidden=  '';

    if(sublist_id=='custpage_owned_diamond')
    {
      custpage_reason_for_diamd_ret=  nlapiGetLineItemValue(sublist_id, 'custpage_reason_for_diamd_ret_custpage_owned_diamond', z);
      custpage_reason_for_diamd_ret_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_reason_for_diamd_ret_hidden_custpage_owned_diamond', z);

      custpage_exptd_ret_date=  nlapiGetLineItemValue(sublist_id, 'custpage_exptd_ret_date_custpage_owned_diamond', z);
      custpage_exptd_ret_date_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_exptd_ret_date_hidden_custpage_owned_diamond', z);

      custpage_notes=  nlapiGetLineItemValue(sublist_id, 'custpage_notes_custpage_owned_diamond', z);
      custpage_notes_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_notes_hidden_custpage_owned_diamond', z);

      custpage_gemstone_status=  nlapiGetLineItemValue(sublist_id, 'custpage_gemstone_status_custpage_owned_diamond', z);
      custpage_gemstone_status_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_gemstone_status_hidden_custpage_owned_diamond', z);
  
      if(custpage_reason_for_diamd_ret!=custpage_reason_for_diamd_ret_hidden || custpage_exptd_ret_date!=custpage_exptd_ret_date_hidden|| custpage_notes!=custpage_notes_hidden||
         custpage_gemstone_status!=custpage_gemstone_status_hidden)
      {
  
        item_internal_id=nlapiGetLineItemValue(sublist_id, 'custpage_internalid_custpage_owned_diamond', z);
     // alert('Internal Id -'+item_internal_id+'custpage_reason_for_diamd_ret - ' +custpage_reason_for_diamd_ret+' custpage_reason_for_diamd_ret_hidden -'+custpage_reason_for_diamd_ret_hidden+' custpage_exptd_ret_date -' +custpage_exptd_ret_date+' custpage_exptd_ret_date_hidden -'+custpage_exptd_ret_date_hidden+' custpage_notes -'+custpage_notes+' custpage_notes_hidden -'+ custpage_notes_hidden+' custpage_gemstone_status-'+custpage_gemstone_status+' custpage_gemstone_status_hidden-'+custpage_gemstone_status_hidden);
        flag = 1;
        data_update.push({
          operation:'Update',
          sublist_id:sublist_id,
          item_internal_id: item_internal_id,
          custpage_reason_for_diamd_ret: custpage_reason_for_diamd_ret,
          custpage_exptd_ret_date: custpage_exptd_ret_date,
          custpage_notes: custpage_notes,
          custpage_gemstone_status:custpage_gemstone_status

        });
        temp_data_obj.push('');
      }
    }
    else  if(sublist_id=='custpage_to_be_returned')
    {
      
      
      custpage_reason_for_diamd_ret=  nlapiGetLineItemValue(sublist_id, 'custpage_reason_for_diamd_ret_custpage_to_be_returned', z);
      custpage_reason_for_diamd_ret_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_reason_for_diamd_ret_hidden_custpage_to_be_returned', z);
      
      custpage_vendor_ret_status=  nlapiGetLineItemValue(sublist_id, 'custpage_vendor_ret_status_custpage_to_be_returned', z);
      custpage_vendor_ret_status_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_vendor_ret_status_hidden_custpage_to_be_returned', z);

      custpage_exptd_ret_date=  nlapiGetLineItemValue(sublist_id, 'custpage_exptd_ret_date_custpage_to_be_returned', z);
      custpage_exptd_ret_date_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_exptd_ret_date_hidden_custpage_to_be_returned', z);


      custpage_gemstone_status=  nlapiGetLineItemValue(sublist_id, 'custpage_gemstone_status_custpage_to_be_returned', z);
      custpage_gemstone_status_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_gemstone_status_hidden_custpage_to_be_returned', z);

      if(custpage_reason_for_diamd_ret!=custpage_reason_for_diamd_ret_hidden || custpage_exptd_ret_date!=custpage_exptd_ret_date_hidden||
         custpage_gemstone_status!=custpage_gemstone_status_hidden)
      {
        item_internal_id=nlapiGetLineItemValue(sublist_id, 'custpage_internalid_custpage_to_be_returned', z);

        flag = 1;
        data_update.push({
          operation:'Update',
          sublist_id:sublist_id,
          item_internal_id: item_internal_id,
          custpage_reason_for_diamd_ret: custpage_reason_for_diamd_ret,
          custpage_exptd_ret_date: custpage_exptd_ret_date,
          custpage_gemstone_status:custpage_gemstone_status,
          custpage_vendor_ret_status:custpage_vendor_ret_status

        });
        temp_data_obj.push('');
      }
    }
    else if(sublist_id=='custpage_create_return')
    {

      custpage_exptd_ret_date=  nlapiGetLineItemValue(sublist_id, 'custpage_exptd_ret_date_custpage_create_return', z);
      custpage_exptd_ret_date_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_exptd_ret_date_hidden_custpage_create_return', z);

      custpage_notes=  nlapiGetLineItemValue(sublist_id, 'custpage_notes_custpage_create_return', z);
      custpage_notes_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_notes_hidden_custpage_create_return', z);

      custpage_gemstone_status=  nlapiGetLineItemValue(sublist_id, 'custpage_gemstone_status_custpage_create_return', z);
      custpage_gemstone_status_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_gemstone_status_hidden_custpage_create_return', z);

      if(custpage_notes!=custpage_notes_hidden|| custpage_exptd_ret_date!=custpage_exptd_ret_date_hidden||
         custpage_gemstone_status!=custpage_gemstone_status_hidden)
      {
        item_internal_id=nlapiGetLineItemValue(sublist_id, 'custpage_internalid_custpage_create_return', z);

        flag = 1;
        data_update.push({
          operation:'Update',
          sublist_id:sublist_id,
          item_internal_id: item_internal_id,
          custpage_notes: custpage_notes,
          custpage_exptd_ret_date: custpage_exptd_ret_date,
          custpage_gemstone_status:custpage_gemstone_status

        });
        temp_data_obj.push('');
      }
    }
    else if(sublist_id=='custpage_return_tracking_conf')
    {

      var custpage_tracking_no=  nlapiGetLineItemValue(sublist_id, 'custpage_tracking_no_custpage_return_tracking_conf', z);
      var custpage_tracking_no_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_tracking_no_hidden_custpage_return_tracking_conf', z);

      var custpage_aes_eei=  nlapiGetLineItemValue(sublist_id, 'custpage_aes_eei_custpage_return_tracking_conf', z);
      var custpage_aes_eei_hidden=  nlapiGetLineItemValue(sublist_id, 'custpage_aes_eei_hidden_custpage_return_tracking_conf', z);



      if(custpage_tracking_no!=custpage_tracking_no_hidden|| custpage_aes_eei!=custpage_aes_eei_hidden)
      {
        item_internal_id=nlapiGetLineItemValue(sublist_id, 'custpage_internalid_custpage_return_tracking_conf', z);

        flag = 1;
        data_update.push({
          operation:'Update',
          sublist_id:sublist_id,
          item_internal_id: item_internal_id,
          custpage_tracking_no: custpage_tracking_no,
          custpage_aes_eei: custpage_aes_eei
        });
        temp_data_obj.push('');
      }
    }


  }

  if (data_update) {
    if (flag) {
      document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
      Call_Ajax_data_update(data_update, sublist_id,'Update');
    } else {

      alert('You did not make any chnage to update');
    }
  }

}
function fieldChanged(type,name)
{
  var sublist='';

  if(name.indexOf('custpage_owned_diamond')>-1){ sublist='custpage_owned_diamond'; }
  else if(name.indexOf('custpage_to_be_returned')>-1){ sublist='custpage_to_be_returned'; }
  else if(name.indexOf('custpage_create_return')>-1){ sublist='custpage_create_return'; }
  else if(name.indexOf('custpage_return_tracking_conf')>-1){ sublist='custpage_return_tracking_conf'; } 
  //alert(sublist);
  if(name=='custpage_gemstone_status_filter_'+sublist || name=='custpage_other_vendor_filter_'+sublist)
  {

    document.getElementById(''+sublist+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    var parameters='';
    var othervendor=nlapiGetFieldValue('custpage_other_vendor_filter_'+sublist);
    var gemstone_status=nlapiGetFieldValue('custpage_gemstone_status_filter_'+sublist);
    if(gemstone_status)
    {
      parameters+='&gemstone_status='+gemstone_status;
    }
    if(othervendor)
    {
      parameters+='&othervendor='+othervendor;
    }
    var url_hit = '/app/site/hosting/scriptlet.nl?script=2318&deploy=1&compid=666639&r=T&machine='+sublist+parameters;
    //alert(url_hit);
    document.getElementById('server_commands').src = url_hit;
  }

}

function CreateLabels(sublist_id) {

  var arrRecords=[];
  temp_data_obj = new Array();
  data_send_obj= new Array();

  for (var i = 1; i <= nlapiGetLineItemCount(sublist_id); i++) {
    var internal_id=nlapiGetLineItemValue(sublist_id,'custpage_internalid_custpage_return_tracking_conf',i);
    arrRecords.push(
      {
        operation:'Create Label',
        internal_id:internal_id
      });
    temp_data_obj.push('');
  }


  if(arrRecords.length>0)
  { 
    document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(arrRecords, sublist_id,"Create Label");

  }

}

function CreateInternalReq(sublist_id) {

  var data_update = [];
  var flag = 0;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  var arrItems=new Array();

  var check_box_name=document.getElementsByName("custpage_chk_req_to_inv");
  for(var a=0;a<check_box_name.length;a++)
  {
    if(check_box_name[a].className =='checkbox_ck')
    {
      var get_check_box_id=check_box_name[a].id;
      var line_number=get_check_box_id.replace('custpage_chk_req_to_inv_','');
     // alert(line_number);
      var custpage_internalid = nlapiGetLineItemValue(sublist_id, 'custpage_internalid_'+sublist_id, line_number);
      flag = 1;
      arrItems.push({
        custpage_internalid: custpage_internalid,
      });

    }
  }

  if (arrItems) {

    if (flag) {
      data_update.push({
        operation:'Create Internal Request Form',
        items:arrItems
      });
      temp_data_obj.push('');

      document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
      Call_Ajax_data_update(data_update, sublist_id,'Create Internal Request Form');
    } else {

      alert('Please select at least one record');
    }
  }

}

function CreateReturn(sublist_id)
{
  var arrRecords=[];
  temp_data_obj = new Array();
  data_send_obj= new Array();
 // alert(sublist_id);
  //alert(nlapiGetLineItemCount(sublist_id));
  for (var i = 1; i <= nlapiGetLineItemCount(sublist_id); i++) {
    var vendor_id=nlapiGetLineItemValue(sublist_id,'custpage_other_vendor_internalid_custpage_create_return',i);
	var vra_vendor=nlapiGetLineItemValue(sublist_id,'custpage_vra_vendor_create_return',i);
	if(vra_vendor)
      vendor_id=vra_vendor;
	//alert(vra_vendor);
	var cararts=nlapiGetLineItemValue(sublist_id,'custpage_carats_create_return',i);
	//alert(cararts);
    var item_id=nlapiGetLineItemValue(sublist_id,'custpage_internalid_custpage_create_return',i);
    var insurance_value=nlapiGetLineItemValue(sublist_id,'custpage_cost_custpage_create_return',i);

    var country=nlapiLookupField('vendor',vendor_id,'shipcountry',true);
	var search='';
	
	if(country=='United States')
	{
	  search=nlapiSearchRecord('customrecord_shipping_country_insurance',null,[new nlobjSearchFilter('formulatext',null,'is',country).setFormula('{custrecord_insurance_limit_country}'),new nlobjSearchFilter('internalid',null,'anyof',302)],[new nlobjSearchColumn('custrecord_fedex_insurance_limit'),new nlobjSearchColumn('custrecord_parcel_pro_insurance_limit')]);
	}
	else
	{
     search=nlapiSearchRecord('customrecord_shipping_country_insurance',null,new nlobjSearchFilter('formulatext',null,'is',country).setFormula('{custrecord_insurance_limit_country}'),[new nlobjSearchColumn('custrecord_fedex_insurance_limit'),new nlobjSearchColumn('custrecord_parcel_pro_insurance_limit')]);
	}


    var country_limit=71000;
    if(search)
    {
      country_limit=parseFloat(search[0].getValue('custrecord_fedex_insurance_limit'))+ parseFloat(search[0].getValue('custrecord_parcel_pro_insurance_limit'));
    }
    
    //Get Available Location
    var itemSearch = nlapiSearchRecord("item",null,
    [
       ["internalid","anyof",item_id],
       "AND", 
       ["locationquantityavailable","greaterthan","0"]
    ],
    [
       new nlobjSearchColumn("internalid","inventoryLocation",null)
    ]
    );
    var location_id='2';
    if(itemSearch)
    {
      var cols=itemSearch[0].getAllColumns();
      location_id=itemSearch[0].getValue(cols[0]);
    }

    arrRecords.push(
      {
        vendor_id:vendor_id,
        item_id:item_id,
        shipping_country_limit:country_limit,
        insurance_val:insurance_value,
        carats:cararts,
        location_id:location_id
      });
  }

 // alert(JSON.stringify(arrRecords));
  var data_to_send= createVRAObjects(arrRecords);
  document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
  Call_Ajax_data_update(data_to_send, sublist_id,"Create Return");
  //alert(JSON.stringify(data_to_send));
}

function createVRAObjects(records)
{
  var arrSendRecords = [];

  if (records) {
    var len = records.length;
    while (len > 0) {
      var temp = records.filter(function(obj) {
        return (obj.vendor_id == records[0].vendor_id && obj.location_id==records[0].location_id);
      });

      var total_insurance_val = temp.reduce(function(prev, cur) {
        return prev + parseFloat(cur.insurance_val);
      }, 0);

      var ship_country_limit=temp[0].shipping_country_limit;
      var ins_val = 0;
      var arrItems = [];
      var tempLen = temp.length;
      while (tempLen > 0) {
        var compare_val = 0;
        var tot_ins_val = temp.reduce(function(prev, cur) {
          return prev +  parseFloat(cur.insurance_val);
        }, 0);

        if(ship_country_limit>=70000)
        {
          if (tot_ins_val > 70000) {
            compare_val = 50000;
          } else {
            compare_val = 70000;
          }
        }
        else{
          compare_val = ship_country_limit;
          /*  if(ship_country_limit>=50)
                      {

                      }
					compare_val = ship_country_limit;*/
        }

        var arrVendors = [];
        for (var x = 0; x < temp.length; x++) {
          var arrItems = [];
          var item_id = temp[x].item_id;
          var item_ins_val = temp[x].insurance_val;
          arrItems.push({
            item_id: temp[x].item_id,
            insurance_val: temp[x].insurance_val
          });
          var ins_val = item_ins_val;
          for (z = 0; z < temp.length; z++) {

            if (temp[z].item_id != item_id) {
              var temp_ins = parseFloat(ins_val) + parseFloat(temp[z].insurance_val);

              if (temp_ins <= compare_val) {
                ins_val = parseFloat(ins_val) + parseFloat(temp[z].insurance_val);
                arrItems.push({
                  item_id: temp[z].item_id,
                  insurance_val: temp[z].insurance_val
                });

              }
            }
          }

          var item_ins_tot = arrItems.reduce(function(prev, cur) {
            return prev + parseFloat(cur.insurance_val);
          }, 0);
          arrVendors.push({
            vendor_id: temp[0].vendor_id,
			location_id:temp[0].location_id,
            tot_insurance: item_ins_tot,
            items: []
          });
          for (var l = 0; l < arrItems.length; l++) {
            arrVendors[arrVendors.length - 1].items.push(arrItems[l]);
          }

        }
        var arrResult = arrVendors.reduce(function(prev, curr) {
          return parseFloat(prev.tot_insurance) > parseFloat(curr.tot_insurance) ? prev : curr;
        });


        arrSendRecords.push({
          operation:"Create Return",
          vendor_id: arrResult.vendor_id,
		  location_id:arrResult.location_id,
          items: []
        });
        temp_data_obj.push('');
        for (var j = 0; j < arrResult.items.length; j++) {
          arrSendRecords[arrSendRecords.length - 1].items.push({
            item_id: arrResult.items[j].item_id,
            insurance_val: arrResult.items[j].insurance_val
          });

          temp = removeByAttr(temp, 'item_id', arrResult.items[j].item_id);
        }
        tempLen = temp.length;

      }
      records = removeByAttr1(records, 'vendor_id','location_id', records[0].vendor_id,records[0].location_id);
      len = records.length;
    }
  }
  return arrSendRecords;

}
function removeByAttr(arr, attr1, value1) {
  var i = arr.length;
  while (i--) {
    if (arr[i] &&
        arr[i].hasOwnProperty(attr1) && (arguments.length > 2 && arr[i][attr1] === value1)) {
      arr.splice(i, 1);
    }
  }
  return arr;
}
function removeByAttr1(arr, attr1,attr2,value1,value2) {
  var i = arr.length;
  while (i--) {
    if (arr[i] &&
        arr[i].hasOwnProperty(attr1)&& arr[i].hasOwnProperty(attr2) && (arguments.length > 2 && arr[i][attr1] == value1) && (arguments.length > 2 && arr[i][attr2] == value2)) {
      arr.splice(i, 1);
    }
  }
  return arr;
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

function printPackingSlip(sublist_id)
{
  var arrRecords=[];
  var data_update=[];
  temp_data_obj = new Array();
  data_send_obj= new Array();

  for (var i = 1; i <= nlapiGetLineItemCount(sublist_id); i++) {
    var internal_id=nlapiGetLineItemValue(sublist_id,'custpage_internalid_custpage_return_tracking_conf',i);
    arrRecords.push(
      {
        internal_id:internal_id
      });

  }


  if(arrRecords.length>0)
  { 
    temp_data_obj.push('');
    data_update.push(
      {
        operation:'Print Packing Slip',
        fulfillments:arrRecords
      });
    document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(data_update, sublist_id,"Print Packing Slip");

  }
}

function PrintLabel(sublist_id)
{
  var arrRecords=[];
  var data_update=[];
  temp_data_obj = new Array();
  data_send_obj= new Array();

  for (var i = 1; i <= nlapiGetLineItemCount(sublist_id); i++) {
    var internal_id=nlapiGetLineItemValue(sublist_id,'custpage_internalid_custpage_return_tracking_conf',i);
    arrRecords.push(
      {
        internal_id:internal_id
      });

  }


  if(arrRecords.length>0)
  { 
    temp_data_obj.push('');
    data_update.push(
      {
        operation:'Print Label',
        fulfillments:arrRecords
      });
    document.getElementById(''+sublist_id+'_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(data_update, sublist_id,"Print Label");

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
  var restUrl = nlapiResolveURL('RESTLET', 'customscript_restlet_diamond_ret_dash', 'customdeploy_restlet_diamond_ret_dash');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: send_data, 
    dataType: "json",
    success: function(returned_value) {
      data_send_obj.push('');
     // alert(returned_value);

      if(operation=='Update')
      {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Updating Records '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      else if(operation=='Create Internal Request Form')
      {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Creating Internal Request '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      else if(operation=='Create Return')
      {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Creating Return  '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      else if(operation=='Create Label') {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=450 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Creating Labels '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      }
      else if(operation=='Print Packing Slip')
      {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=450 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Printing Packing Slips...</td></tr></table></div><center></td></tr>';
      }
      else if(operation=='Print Label')
      {
        document.getElementById(''+sublist+'_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=450 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Printing Labels...</td></tr></table></div><center></td></tr>';
      }
      if (data_send_obj.length == temp_data_obj.length) {

        if(operation=='Print Packing Slip' || operation=='Print Label')
        {
          if(returned_value==false)
          {
            alert('There is no document to print.')
          }
          else
          {
            window.onbeforeunload = null;
            window.open(returned_value);
          }
        }
        var flag = true;
        var url_hit = '/app/site/hosting/scriptlet.nl?script=2318&deploy=1&r=T&machine='+sublist;
        // alert(url_hit);
        document.getElementById('server_commands').src = url_hit;
      }

    }
  });
}

(function($) {
  if ($.fn.style) {
    return;
  }

  // Escape regex chars with \
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority != '') {
        // Add priority manually
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                              '(\\s*;)?', 'gmi');
        this.cssText =
          this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                            'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
      return this;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
      if (typeof value != 'undefined') {
        // Set style property
        priority = typeof priority != 'undefined' ? priority : '';
        style.setProperty(styleName, value, priority);
        return this;
      } else {
        // Get style property
        return style.getPropertyValue(styleName);
      }
    } else {
      // Get CSSStyleDeclaration
      return style;
    }
  };
})(jQuery);
