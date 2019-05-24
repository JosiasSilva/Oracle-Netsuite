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
function Add_Button(type,form,nlobjRequest)
{

  try
  {
    if(type=='view')
    {
      var get_value= nlobjRequest.getParameter ('transfer_update_record'); 
      nlapiLogExecution ( 'debug' , 'get_value' , get_value ) ;
      if(get_value)
      {
        try
        {
          create_box_api();
        }
        catch(er){nlapiLogExecution ( 'debug' ,' er-1' , er ) }
        nlapiSetRedirectURL ( 'RECORD' , 'customrecord_box_record' , nlapiGetRecordId ( )) ;
      }
      else
      {
        try
        {
          var data_obj=nlapiLookupField ( 'customrecord_box_record' , nlapiGetRecordId ( ) , 'custrecord_type_of_box'); 
          if(data_obj=='2')
          {
            form.addButton('custpage_button','Update Record',"window.location.href='/app/common/custom/custrecordentry.nl?rectype=707&transfer_update_record=true&id="+nlapiGetRecordId ( ) +"';");
          }
        }
        catch(er){nlapiLogExecution ( 'debug' ,' er-2' , er ) }
      }
    }
  }
  catch(er){nlapiLogExecution ( 'debug' ,' er-3' , er ) }
}

function create_box_api()
{
  try
  {	
    var load_box_rec=nlapiLoadRecord('customrecord_box_record',nlapiGetRecordId ( ));
    var ship_date=load_box_rec.getFieldValue('custrecord_box_ship_date');
    if(ship_date)
    {
      var ToDate= nlapiStringToDate ( ship_date); 
      var To_days= ToDate.getDay();
      if(To_days==6)
      {
        load_box_rec.setFieldValue('custrecord_box_special_instructions','1');
      }
    }
    var index_to_location=0;
    var index_from_location=0;
    var from_location_text;
    var to_location_text;
    var obj_location=[];
    load_box_rec.setFieldValue('custrecord_transaction_total','0');
    var update_data={	
      "box_form_to_location":0,
      "total_insurence_val":0,
      "box_id":load_box_rec.getId(),
      "box_to_location":load_box_rec.getFieldValue('custrecord_box_location'),
      "box_from_location":load_box_rec.getFieldValue('custrecord_box_from_location'),
      "line_item":[]
    };

    var columns=[];
    columns.push(new nlobjSearchColumn('custbody_insurance_total'));
    columns.push(new nlobjSearchColumn('tranid'));
    columns.push(new nlobjSearchColumn('memo'));
    var search_transfer=nlapiSearchRecord('transferorder',null,
                                          [
                                            new nlobjSearchFilter('custbody_box_record',null,'anyof',load_box_rec.getId())
                                            ,new nlobjSearchFilter('mainline',null,'is','T')
                                          ]
                                          ,columns);  
    if(search_transfer) 
    {
      load_box_rec.setFieldValue('custrecord_transaction_total',search_transfer.length);
      var insurence_value=0;
      for(var a=0;a<search_transfer.length;a++)
      {
        var get_insurece_value=search_transfer[a].getValue('custbody_insurance_total');
        if(get_insurece_value)
        {
          insurence_value+=parseFloat(get_insurece_value);
        }
        update_data.line_item.push({
          "tranfer_id":search_transfer[a].getId(),
          "tranfer_doc":search_transfer[a].getValue('tranid'),          
          "memo":search_transfer[a].getValue('memo'),
          "insurance_value":get_insurece_value,
          "box_id_value":load_box_rec.getId(),
          "checked":true,
        })
      }
      update_data.total_insurence_val=insurence_value;
    }



    if(update_data.box_to_location)
    {
      obj_location.push(update_data.box_to_location);
    }
    if(update_data.box_from_location)
    {
      obj_location.push(update_data.box_from_location);
    }

    var get_city_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'anyof','2'),
                                                             new nlobjSearchFilter('isinactive',null,'is','F'),
                                                             new nlobjSearchFilter('custrecord_city_location',null,'noneof','@NONE@'),
                                                             new nlobjSearchFilter('internalid',null,'anyof',obj_location)
                                                            ],
                                            new nlobjSearchColumn('custrecord_city_location'));

    if(get_city_location)
    {
      for(var a=0;a<get_city_location.length;a++)
      {
        var get_location_id=get_city_location[a].getId();
        if(get_location_id==update_data.box_to_location)
        {
          update_data.box_to_location=get_city_location[a].getValue('custrecord_city_location');
        }
        else
        {
          update_data.box_from_location=get_city_location[a].getValue('custrecord_city_location');
        }

      }
    }


    var get_line_item=update_data.line_item;
    var column=[];
    column.push(new nlobjSearchColumn('address','address'));
    column.push(new nlobjSearchColumn('address1','address'));
    column.push(new nlobjSearchColumn('address2','address'));
    column.push(new nlobjSearchColumn('addressee','address'));
    column.push(new nlobjSearchColumn('attention','address'));
    column.push(new nlobjSearchColumn('city','address'));
    column.push(new nlobjSearchColumn('phone','address'));
    column.push(new nlobjSearchColumn('state','address'));
    column.push(new nlobjSearchColumn('zip','address'));
    column.push(new nlobjSearchColumn('country','address'));
    column.push(new nlobjSearchColumn('countrycode','address'));
    var search_record_location=nlapiSearchRecord('location',null,new nlobjSearchFilter('internalid',null,'anyof',[update_data.box_to_location,update_data.box_from_location]),column);
    var get_search_first_location_value=search_record_location[0].getId();
    if(get_search_first_location_value==update_data.box_to_location)
    {
      index_from_location=1;
    }
    else
    {
      index_to_location=1;
    }
    from_location_text=search_record_location[index_from_location].getValue('address','address');
    to_location_text=search_record_location[index_to_location].getValue('address','address');
    var vendor_shipping_label= Shipping_Label_file_Create(load_box_rec,search_record_location[index_from_location]);
    if(vendor_shipping_label)
    {
      load_box_rec.setFieldValue('custrecord_box_shipping_label',vendor_shipping_label.custrecord_box_shipping_label);
      load_box_rec.setFieldValue('custrecord_box_shipping_label_png',vendor_shipping_label.custrecord_box_shipping_label_png);
      load_box_rec.setFieldValue('custrecord_box_tracking_id',vendor_shipping_label.custrecord_box_tracking_id);
      load_box_rec.setFieldValue('custrecord_box_fedex_error_message',vendor_shipping_label.custrecord_box_fedex_error_message);
      load_box_rec.setFieldValue('custrecord_box_declared_value',vendor_shipping_label.custrecord_box_declared_value);
    }
    var packing_slip_file=Packing_slip_file_Create(get_line_item,load_box_rec,from_location_text,to_location_text);
    if(packing_slip_file)
    {
      load_box_rec.setFieldValue('custrecord_box_packing_slip',packing_slip_file);
    }
    for(var a=0;a<get_line_item.length;a++)
    {
      try { nlapiSubmitField ('transferorder' , get_line_item[a].tranfer_id , ['custbody_box_record','custbody69'] , [load_box_rec.getId(),load_box_rec.getFieldValue('custrecord_box_tracking_id')]); 	}
      catch(er){}
    }
    load_box_rec.setFieldValue('custrecord_box_insurance_value',update_data.total_insurence_val);
    nlapiSubmitRecord(load_box_rec,true,true);
  }
  catch(er)
  {
    nlapiLogExecution("debug","Box Create error -3 ",er.message);
  }
  return true;
}
