var outgoing_to_dashboard ='customsearch_outgoing_to_dashboards';
var incoming_to_dashboard ='customsearch_incoming_to_dashboard';
var sort_by = function(field, reverse, primer){
  var key = primer ? 
      function(x) {return primer(x[field])} :
  function(x) {return x[field]};
  reverse = !reverse ? 1 : -1;
  return function (a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}
function GET_DATA(datain)
{

  if(datain.type=='getlocation_user')
  {
    var send_data=datain.send_data;
    var get_location="";
    try
    {
      get_location= nlapiLookupField ( 'employee' , send_data.employee , 'custentity85' ); 

    }
    catch(er){}
    return get_location
  }


  else if(datain.type=='new_record')
  {
    var send_data=JSON.stringify(datain.send_data);
    create_box_api(send_data);
    return true;
  }
  else if(datain.type=='old_record')
  {
    var send_data=JSON.stringify(datain.send_data);
    update_box_api(send_data);
    return true;
  }
  else if(datain.type=='all_trans_print_id')
  {
    return Get_Pdf_File(datain.send_data)
  }
  else if(datain.type=='all_trans_receive')
  {
    return Get_Receive(datain.send_data)
  }
  else if(datain.type=='all_trans_fulfill')
  {
    return Get_Fulfill(datain.send_data)
  }
  else if(datain.type=='print_pick_slip')
  {
    var obj_result_id=[];
    var search_record=Get_Result_Search(datain.send_data);
    if(search_record)
    {
      for(var a=0;a<search_record.length;a++)
      {
        var status=search_record[a].getValue('status');
        if(status=='pendingFulfillment')
        {
          var get_box_id_pick_slip=search_record[a].getId();
          if(obj_result_id.indexOf(get_box_id_pick_slip)==-1)
          {
            obj_result_id.push(get_box_id_pick_slip);
          }
        }
      }
    }
    if(obj_result_id.length>0)
    {
      return Get_Pdf_File(obj_result_id);
    }
    return false;
  }
  else if(datain.type=='custitem_outgoing_packing_slip')
  {
    var obj_result_id=[];
    var search_record=Get_Result_Search(datain.send_data);
    if(search_record)
    {
      for(var a=0;a<search_record.length;a++)
      {
        var get_box_id_pick_slip=search_record[a].getValue('custrecord_box_packing_slip','custbody_box_record');
        if(obj_result_id.indexOf(get_box_id_pick_slip)==-1)
        {
          obj_result_id.push(get_box_id_pick_slip);
        }
      }
    }
    if(obj_result_id.length>0)
    {
      return Get_Pdf_Packing_Shiping_File(obj_result_id);
    }
    return false;
  }
  else if(datain.type=='custitem_outgoing_shipping_label')
  {
    var obj_result_id=[];
    var search_record=Get_Result_Search(datain.send_data);
    if(search_record)
    {
      for(var a=0;a<search_record.length;a++)
      {
        var get_box_id_pick_slip=search_record[a].getValue('custrecord_box_shipping_label','custbody_box_record');
        if(obj_result_id.indexOf(get_box_id_pick_slip)==-1)
        {
          obj_result_id.push(get_box_id_pick_slip);
        }
      }
    }
    if(obj_result_id.length>0)
    {
      return Get_Pdf_Packing_Shiping_File(obj_result_id);
    }
    return false;
  }
}
function Get_Receive(obj_trans)
{
  try
  {
    var itemreceipt = nlapiTransformRecord("transferorder",obj_trans,"itemreceipt");
    nlapiSubmitRecord(itemreceipt ,true,true);	
  }
  catch(er)
  {

  }
  return true;
}
function Get_Fulfill(obj_trans)
{
  try
  {
    var itemreceipt = nlapiTransformRecord("transferorder",obj_trans,"itemfulfillment");
    itemreceipt.setFieldValue('shipstatus','C');
    nlapiSubmitRecord(itemreceipt ,true,true);	
  }
  catch(er)
  {

  }
  return true;
}







function Get_Result_Search(data_val)
{
  var filter_outgoing=[];
  if(data_val.search_document)
  {
    filter_outgoing.push(new nlobjSearchFilter("tranid",null,"contains",data_val.search_document));
  }
  if(data_val.search_ship_date)
  {
    filter_outgoing.push(new nlobjSearchFilter("trandate",null,"on",data_val.search_ship_date));
  }
  if(data_val.from_location)
  {

    var get_filter_location_obj=[];
    var location_get_field=data_val.from_location;
    get_filter_location_obj.push(location_get_field);
    var get_ex_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'noneof','2'),
                                                           new nlobjSearchFilter('isinactive',null,'is','F'),
                                                           new nlobjSearchFilter('custrecordshowroom_inventory_location',null,'noneof','@NONE@'),
                                                           new nlobjSearchFilter('internalid',null,'anyof',location_get_field)
                                                          ],
                                          new nlobjSearchColumn('custrecordshowroom_inventory_location'));
    if(get_ex_location)
    {
      for(var a=0;a<get_ex_location.length;a++)
      {
        get_filter_location_obj.push(get_ex_location[a].getValue('custrecordshowroom_inventory_location'));
      }
    }
    filter_outgoing.push(new nlobjSearchFilter("location",null,"anyof",get_filter_location_obj));
  }

  if(data_val.to_location)
  {
    var get_filter_location_obj=[];
    var location_get_field=data_val.to_location;
    get_filter_location_obj.push(location_get_field);
    var get_ex_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'noneof','2'),
                                                           new nlobjSearchFilter('isinactive',null,'is','F'),
                                                           new nlobjSearchFilter('custrecordshowroom_inventory_location',null,'noneof','@NONE@'),
                                                           new nlobjSearchFilter('internalid',null,'anyof',location_get_field)
                                                          ],
                                          new nlobjSearchColumn('custrecordshowroom_inventory_location'));
    if(get_ex_location)
    {
      for(var a=0;a<get_ex_location.length;a++)
      {
        get_filter_location_obj.push(get_ex_location[a].getValue('custrecordshowroom_inventory_location'));
      }
    }
    filter_outgoing.push(new nlobjSearchFilter("transferlocation",null,"anyof",get_filter_location_obj));
  }
  var search_records=nlapiSearchRecord(null,outgoing_to_dashboard,filter_outgoing);
  return search_records;
}