nlapiLogExecution("audit","FLOStart",new Date().getTime());
var save_search_id='6145'
//var save_search_id='6315'   //Testting
var internal_counter=0;
var max_internal_counter=0;
var scriptdeployment='8611';
function Auto_Approval()
{
  var load_record=nlapiLoadRecord('scriptdeployment',scriptdeployment);   
  var get_date_old= load_record.getFieldValue('custscript_script_run_date'); 
  var get_internal_counter=load_record.getFieldValue('custscript_usage_limit_counter'); 
  var get_max_internal_counter=load_record.getFieldValue('custscript_maual_usage_limit');
  var get_new_date=nlapiDateToString (new Date());
  if(get_date_old!=get_new_date) 
  {
    load_record.setFieldValue('custscript_usage_limit_counter',internal_counter);
    load_record.setFieldValue('custscript_script_run_date',get_new_date);
    nlapiSubmitRecord (load_record); 
  }
  else
  {  
    if(get_internal_counter)
    {
      internal_counter=get_internal_counter;
    }
  } 
  if(get_max_internal_counter)
  {
    max_internal_counter=get_max_internal_counter;
  }
  var data_sales_order=[];
  Reset_Script();
  var search_record=nlapiSearchRecord(null,save_search_id);
  if(search_record)
  {
    for(var a=0;a<search_record.length;a++)
    {
      var get_so=search_record[a].getId();
      if(data_sales_order.indexOf(get_so)==-1){
        data_sales_order.push(get_so);         
      }
    }
    if(data_sales_order.length>0)
    {
      try
      {
        for(var m=0;m<data_sales_order.length;m++)
        {

          try
          {

            var get_parent_item=nlapiSearchRecord('salesorder',null,
                                                  [
                                                    new nlobjSearchFilter('internalid',null,'anyof',data_sales_order[m]),
                                                    new nlobjSearchFilter('parent','item','noneof','@NONE@'),
                                                    new nlobjSearchFilter('custitem20','item','anyof','2')]
                                                  ,[
                                                    new nlobjSearchColumn('parent','item'),
                                                    new nlobjSearchColumn('item'),
                                                    new nlobjSearchColumn('vendor','item'),

                                                  ]);
                                                    if(get_parent_item)
                                                    {
                                                    var get_so_measurement= Get_measurment(data_sales_order[m]);		 
            if(get_so_measurement)
            {
              var get_molds_obj=Get_Mold_width_length(get_parent_item);
              if(get_molds_obj)
              {
                var get_width=get_molds_obj[0];
                var get_length=get_molds_obj[1];
                var get_vendor=get_molds_obj[2];
                var get_item_id=get_molds_obj[3];
                var obj_valid= getCompair_value(get_so_measurement,get_width,get_length) ;
                if(obj_valid)
                {
                  create_po_so_update_mods(get_vendor,get_item_id,data_sales_order[m]);
                  continue; 
                }
              }
              if(internal_counter>max_internal_counter)
              {
                create_po_so_update_cads(get_parent_item[0].getValue('vendor','item'),get_parent_item[0].getValue('item'),data_sales_order[m],'39');
                continue; 
              }
              else
              {
                var get_cads_obj=Get_CAD_width_length(get_parent_item);
                if(get_cads_obj)
                {
                  var get_width=get_cads_obj[0];
                  var get_length=get_cads_obj[1];
                  var get_vendor=get_cads_obj[2];
                  var get_item_id=get_cads_obj[3];
                  var obj_valid= getCompair_value(get_so_measurement,get_width,get_length) ;
                  if(obj_valid)
                  {
                    create_po_so_update_cads(get_vendor,get_item_id,data_sales_order[m],'40');
                    internal_counter++;
                    continue; 
                  }
                  else
                  {
                    create_po_so_update_cads(get_vendor,get_item_id,data_sales_order[m],'39');
                    continue; 
                  }
                }
              }
            }
            create_po_so_update_cads(get_parent_item[0].getValue('vendor','item'),get_parent_item[0].getValue('item'),data_sales_order[m],'39');
          }		     
        }
        catch(er){nlapiLogExecution("debug","error",er.message);}
      }
    }
    catch(er){nlapiLogExecution("debug","error",er.message);}
  }
}
var load_record=nlapiLoadRecord('scriptdeployment',scriptdeployment);
load_record.setFieldValue('custscript_usage_limit_counter',internal_counter);
nlapiSubmitRecord (load_record); 
}




function  getCompair_value(get_measurment,obj_width,obj_length) 
{
  if(get_measurment && obj_width && obj_length)
  {
    var get_mold_width=parseFloat(obj_width);
    var get_mold_length=parseFloat(obj_length);
    var val_mes=get_measurment;
    get_measurment=get_measurment.split('x');
    var get_measurment_length=parseFloat(get_measurment[0]);
    var get_measurment_width=parseFloat(get_measurment[1]);

    var get_diff=((get_mold_width-get_measurment_width)-(get_mold_length-get_measurment_length));
    if(get_diff<=.25 && get_diff>=-.25)
    {
      // nlapiLogExecution ( 'debug' , 'measurment   > width  >  length  > ' , val_mes  +' >  ' +get_mold_width +' >  ' +obj_length+ '  >  '+ true) ;
      return true;
    }
    //nlapiLogExecution ( 'debug' , 'measurment   > width  >  length  > ' , val_mes  +' >  ' +get_mold_width +' >  ' +obj_length +'  >  '+ false) ;
  }
}


function  Create_PO(get_vendor,get_item_id,so_id,status_value) {

  if(get_vendor && get_item_id)
  {

    var search_po=nlapiSearchRecord('purchaseorder',null,
                                    new nlobjSearchFilter('createdfrom',null,'anyof',so_id ),[new nlobjSearchColumn('entity'),new nlobjSearchColumn('item')]); 
    var get_po_details=[];
    var get_po_id_get=[];
    var check_validation=true;
    if(search_po)
    {
      for(var a=0;a<search_po.length;a++)
      {
        if(get_po_id_get.indexOf(search_po[a].getId()))
        {
          get_po_id_get.push(search_po[a].getId());
          get_po_details.push({internalid:search_po[a].getId(),entity:search_po[a].getValue('entity')});
        }
        var get_item=search_po[a].getValue('item');
        if(get_item==get_item_id)
        {
          check_validation=false;
        }
      }
    }
    if(check_validation)
    {
      var create_po_rec=nlapiCreateRecord('purchaseorder',{recordmode: 'dynamic'});
      create_po_rec.setFieldValue('entity',get_vendor);
      var type_of_contact=nlapiLookupField ('vendor', get_vendor , 'custentity4' );
      Reset_Script();
      if(type_of_contact=='6')
      {
        create_po_rec.setFieldValue('custbody41',status_value);
      }
      else
      {
        create_po_rec.setFieldValue('custbody41','');
      }
      create_po_rec.setFieldValue('createdform',so_id);
      create_po_rec.setFieldValue('custbody59',nlapiDateToString (new Date()));
      create_po_rec.selectNewLineItem('item');
      create_po_rec.setCurrentLineItemValue ( 'item','item',get_item_id) ;
      create_po_rec.commitLineItem ( 'item' ) ;
      var  id=nlapiSubmitRecord(create_po_rec,true,true);
      nlapiLogExecution("debug","NEW PO-ID -so_id ",id + '  -  '+so_id);
    }
    if(get_po_details.length>0)
    {
      for(var b=0;b<get_po_details.length;b++)
      {
        var get_vendor=get_po_details[b].entity;
        var type_of_contact=nlapiLookupField ('vendor', get_vendor , 'custentity4' );
        Reset_Script();
        if(type_of_contact=='6')
        {
          nlapiSubmitField ( 'purchaseorder' ,get_po_details[b].internalid , 'custbody41' , status_value) ;
        }
        else
        {
          nlapiSubmitField ( 'purchaseorder' , get_po_details[b].internalid, 'custbody41' , '') ;
        }
      }
    }
  }

}


function Get_measurment(sales_order)
{

  var search_mess=nlapiSearchRecord('salesorder',null,[
    new nlobjSearchFilter('custitem30','item','isnotempty'),
    new nlobjSearchFilter('internalid','null','anyof',sales_order)
  ],new nlobjSearchColumn('custitem30','item'));
  if(search_mess)
  {
    return search_mess[0].getValue('custitem30','item');
  }

}

function Get_Mold_width_length(get_parent_item)
{
  if(get_parent_item)
  {
    for(var a=0;a<get_parent_item.length;a++)
    {

      var parent_item=get_parent_item[a].getValue('parent','item');

      var get_vendor;
      var search_vendor=nlapiSearchRecord('item',null,new nlobjSearchFilter('internalid',null,'anyof',parent_item),new nlobjSearchColumn('vendor'));
      if(search_vendor){ get_vendor=search_vendor[0].getValue('vendor');}
      if(parent_item && get_vendor)
      {
        var search_mold=nlapiSearchRecord('customrecord_mold',null,
                                          [
                                            new nlobjSearchFilter('custrecord_mold_item',null,'anyof',parent_item),
                                            // new nlobjSearchFilter('custrecord_length',null,'isnotempty'),
                                            // new nlobjSearchFilter('custrecord_width',null,'isnotempty'),
                                            new nlobjSearchFilter('mainline','custrecord_mold_purchase_order','is','T'),
                                            new nlobjSearchFilter('custrecord_mold_purchase_order',null,'noneof','@NONE@'),
                                            new nlobjSearchFilter('custrecord_mold_vendor',null,'anyof',get_vendor),
                                          ],
                                            [
                                              new nlobjSearchColumn('internalid','custrecord_mold_purchase_order').setSort(true),
                                              new nlobjSearchColumn('custrecord_length'),
                                              new nlobjSearchColumn('custrecord_width'),
                                              new nlobjSearchColumn('custrecord_mold_vendor')			
                                            ]);
                                            if(search_mold)
                                            {
                                            var get_width=parseFloat(search_mold[0].getValue('custrecord_width'));
        var get_length=parseFloat(search_mold[0].getValue('custrecord_length'));
        var get_vendor=get_parent_item[a].getValue('vendor','item');	
        var get_item=get_parent_item[a].getValue('item');
        if(get_width && get_length && get_vendor && get_item)
        {
          return [get_width,get_length,get_vendor,get_item];
        }
      } 
    }
  }	
}
}
function Get_CAD_width_length(get_parent_item)
{
  if(get_parent_item)
  {
    for(var a=0;a<get_parent_item.length;a++)
    {
      var parent_item=get_parent_item[a].getValue('parent','item');
      var get_vendor;
      var search_vendor=nlapiSearchRecord('item',null,new nlobjSearchFilter('internalid',null,'anyof',parent_item),new nlobjSearchColumn('vendor'));
      if(search_vendor){ get_vendor=search_vendor[0].getValue('vendor');}
      if(parent_item && get_vendor)
      {
        var search_cad=nlapiSearchRecord('customrecord_internal_cad',null,
                                         [
                                           new nlobjSearchFilter('custrecord_icr_parent_sku',null,'anyof',parent_item),
                                           //new nlobjSearchFilter('custrecord_icr_length',null,'isnotempty'),
                                           //new nlobjSearchFilter('custrecord_icr_width',null,'isnotempty'),
                                           new nlobjSearchFilter('mainline','custrecord_icr_purchase_order','is','T'),
                                           new nlobjSearchFilter('custrecord_icr_purchase_order',null,'noneof','@NONE@'),
                                           new nlobjSearchFilter('custrecord_icr_vendor',null,'anyof',get_vendor)
                                         ],
                                         [
                                           new nlobjSearchColumn('internalid','custrecord_icr_purchase_order').setSort(true),
                                           new nlobjSearchColumn('custrecord_icr_length'),
                                           new nlobjSearchColumn('custrecord_icr_width'),
                                           new nlobjSearchColumn('custrecord_icr_vendor')
                                         ]);
        if(search_cad)
        {
          var get_width=parseFloat(search_cad[0].getValue('custrecord_icr_width'));
          var get_length=parseFloat(search_cad[0].getValue('custrecord_icr_length'));
          var get_vendor=get_parent_item[a].getValue('vendor','item');
          var get_item=get_parent_item[a].getValue('item');
          if(get_width && get_length &&  get_vendor && get_item )
          {
            return [get_width,get_length,get_vendor,get_item];
          }
        }
      }
    }
  }
}



function create_po_so_update_cads(get_vendor,get_item,so_id,status_value)
{
  if(get_vendor && get_item && so_id)
  {  

    var type_of_contact=nlapiLookupField ('vendor', get_vendor , 'custentity4' );
    Reset_Script();
    if(type_of_contact=='6')
    {
      nlapiSubmitField ( 'salesorder' , so_id , ['orderstatus','custbody41'] , ['B',status_value]) ;
    }
    else
    {
      nlapiSubmitField ( 'salesorder' ,  so_id, 'orderstatus' , 'B') ;
    }
    Reset_Script();
    Create_PO(get_vendor,get_item,so_id,status_value);
    Reset_Script();
  }
}
function create_po_so_update_mods(get_vendor,get_item,so_id)
{
  if(get_vendor && get_item && so_id)
  {  
    nlapiSubmitField ( 'salesorder' ,  so_id, 'orderstatus' , 'B') ;
    Reset_Script();
    Create_PO(get_vendor,get_item,so_id,'');
    Reset_Script();
  }
}


