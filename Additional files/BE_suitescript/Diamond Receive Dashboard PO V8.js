nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_record()
{
  var value_chk=true;
  var date_to=new Date();
  var update_data=nlapiSearchRecord("customrecord_po_cdp_data");
  if(update_data)
  {
    value_chk=false;
    for(var s=0;s<update_data.length;s++)
    {
      ReShedule_Script();
      try{ 
        var update_data_load=nlapiLoadRecord('customrecord_po_cdp_data',update_data[s].getId());		  
        var count_line_item=update_data_load.getLineItemCount('recmachcustrecord_po_cdp_id');
        for(var t=1;t<=count_line_item;t++)
        {
          ReShedule_Script();
          try
          {		

            var json_obj_cdp=JSON.parse(update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','custrecord_cdp_update',t));	   
            if(json_obj_cdp.internalid!=null && json_obj_cdp.internalid!='' )
            {
              nlapiSubmitField('customrecord_custom_diamond',json_obj_cdp.internalid, 'custrecord_diamond_status',json_obj_cdp.custrecord_diamond_status);
            }
            ReShedule_Script();
            var json_obj_po=JSON.parse(update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','custrecord_po_data_update',t));
            if(json_obj_po.internalid)
            {
              ReShedule_Script();
              try
              {
                Update_PurchaseOrder(json_obj_po);
              }
              catch(er)
              {
                try{Update_PurchaseOrder(json_obj_po);}catch(er){}
              }
              ReShedule_Script();
              try
              {
                Create_Item_Recipt(json_obj_po);
              }
              catch(er)
              {
                var er=0;
                //Create_Item_Recipt(json_obj_po);
              }


              ReShedule_Script();
            }

            ReShedule_Script();
            var json_obj_so=JSON.parse(update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','custrecord_so_data_update',t));	 
            if(json_obj_so)
            {
              var get_so=json_obj_so.internalid;
              if(get_so)
              {
                try
                {
                  Update_Sales_Order(json_obj_so);
                }
                catch(er)
                {
                  try{ Update_Sales_Order(json_obj_so);}catch(er){}
                }
              }
            }
            try { 
              nlapiDeleteRecord ( 'customrecord_diamond_receive_dashboard' ,update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','id',t) ) ;
            } catch(er){}
            try
            {
              nlapiDeleteRecord ( 'customrecord_po_cdp_data' ,update_data[s].getId()) ;
            }
            catch(er){}
          } catch(er){}
        }

      }catch(er){}

    }
  }
}


function ReShedule_Script()
{
  var usage = nlapiGetContext().getRemainingUsage();
  // If the script's remaining usage points are bellow 1,000 ...       
  if (usage < 500) 
  {
    // ...yield the script
    var state = nlapiYieldScript();
    // Throw an error or log the yield results
    if (state.status == 'FAILURE')
      throw "Failed to yield script";
  }
}

function Update_PurchaseOrder(json_obj_po)
{
  var PO_Data=nlapiLoadRecord('purchaseorder',json_obj_po.internalid);
  ReShedule_Script();
  if(!json_obj_po.location){json_obj_po.location="2";}
  PO_Data.setLineItemValue("item","location",json_obj_po.line_number,json_obj_po.location);
  PO_Data.setLineItemValue("item","custcoldiamondinscription",json_obj_po.line_number,json_obj_po.custcoldiamondinscription);
  PO_Data.setLineItemValue("item","custcol28",json_obj_po.line_number,json_obj_po.custcol28);
  PO_Data.setFieldValue('custbody58',json_obj_po.custbody58);
  PO_Data.setFieldValue('custbody59',json_obj_po.custbody59); 
  nlapiSubmitRecord ( PO_Data , true , true ) ;	
  
  //Update Diamond Inscription on Item Master
  var item_id=PO_Data.getLineItemValue('item','item',json_obj_po.line_number);
  nlapiSubmitField('inventoryitem',item_id,'custitemdiamond_inscription',json_obj_po.custcoldiamondinscription);
  nlapiLogExecution('debug','Item Master Update with Id',item_id);
  
  
  
}

function Update_Sales_Order(json_obj_so)
{

  var get_so_data=nlapiLoadRecord('salesorder',json_obj_so.internalid);
  var linenum=get_so_data.findLineItemValue ( 'item', 'item', json_obj_so.line_id); 
  if(!json_obj_so.location){json_obj_so.location="2";}
  get_so_data.setLineItemValue("item","location",linenum,json_obj_so.location);				  
  get_so_data.setLineItemValue ( 'item' , 'custcol_diamond_in_hold_binder' , linenum , json_obj_so.diamond_in_hold_binder); 
  if(json_obj_so.diamond_in_hold_binder=="T")
  {
    var get_item=get_so_data.getLineItemText ( 'item' , 'item' , linenum ); 
    var old_value_get=get_so_data.getFieldValue('custbody58');
    var data_up_field=nlapiDateToString (new Date()) +' '+get_item+' '+'diamond in hold binder';
    var set_field_value_notes='';
    if(!old_value_get)
    {
      set_field_value_notes=data_up_field;
    }
    else
    {
      if(old_value_get.search(data_up_field)==-1)
      {
        set_field_value_notes=old_value_get+'<br>'+data_up_field;  
      }
      else
      {
        set_field_value_notes=old_value_get;
      }

    }
    get_so_data.setFieldValue('custbody58',set_field_value_notes);
  }
  nlapiSubmitRecord (get_so_data,true,true ); 
}

function Create_Item_Recipt(json_obj_po)
{
  var get_req_line=json_obj_po.line_number;
  var receipt = nlapiTransformRecord("purchaseorder",json_obj_po.internalid,"itemreceipt");
  ReShedule_Script();
  var stone_received_by=json_obj_po.stone_received_by; //Added By Sandeep
  receipt.setFieldValue('custbody357',stone_received_by); // Added By Sandeep
  for(var xx=1; xx <=receipt.getLineItemCount("item") ; xx++)
  {
    var line_id_get=receipt.getLineItemValue("item","line",xx);
    if(get_req_line==line_id_get)
    {
      receipt.setLineItemValue("item","location",xx,json_obj_po.location);	
      receipt.setLineItemValue("item","itemreceive",xx,"T");
      receipt.setLineItemValue("item","custcol_diamond_in_hold_binder",xx,json_obj_po.diamond_in_hold_binder);
    }
    else
    {
      receipt.setLineItemValue("item","itemreceive",xx,"F");
    }
  }
  var idreceipt=nlapiSubmitRecord(receipt ,true,true);	
}

