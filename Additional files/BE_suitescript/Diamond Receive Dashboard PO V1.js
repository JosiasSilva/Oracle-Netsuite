function Update_record()
{
  var value_chk=true;
  var date_to=new Date();
  var update_data=nlapiSearchRecord("customrecord_po_cdp_data");
  if(update_data!=null)
  {
    value_chk=false;
    for(var s=0;s<update_data.length;s++)
    {
      try{ 
        var update_data_load=nlapiLoadRecord('customrecord_po_cdp_data',update_data[s].getId());		  
        var count_line_item=update_data_load.getLineItemCount('recmachcustrecord_po_cdp_id');
        for(var t=1;t<=count_line_item;t++)
        {	
          try
          {						
            var json_obj_cdp=JSON.parse(update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','custrecord_cdp_update',t));	   
            if(json_obj_cdp.internalid!=null && json_obj_cdp.internalid!='' )
            {
              nlapiSubmitField('customrecord_custom_diamond',json_obj_cdp.internalid, 'custrecord_diamond_status',json_obj_cdp.custrecord_diamond_status);
            }
            var json_obj_po=JSON.parse(update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','custrecord_po_data_update',t));
            if(json_obj_po.internalid!=null && json_obj_po.internalid!='' )
            {
              try
              {

                var PO_Data=nlapiLoadRecord('purchaseorder',json_obj_po.internalid);					
                PO_Data.setLineItemValue("item","location",json_obj_po.line_number,json_obj_po.location);
                PO_Data.setLineItemValue("item","custcoldiamondinscription",json_obj_po.line_number,json_obj_po.custcoldiamondinscription);
                PO_Data.setLineItemValue("item","custcol28",json_obj_po.line_number,json_obj_po.custcol28);
                PO_Data.setFieldValue('custbody58',json_obj_po.custbody58);
                PO_Data.setFieldValue('custbody59',json_obj_po.custbody59); 
                nlapiSubmitRecord ( PO_Data , true , true ) ;
                var get_req_line=json_obj_po.line_number;
                var receipt = nlapiTransformRecord("purchaseorder",json_obj_po.internalid,"itemreceipt");
                for(var xx=1; xx <=receipt.getLineItemCount("item") ; xx++)
                {
                  var line_id_get=receipt.getLineItemValue("item","line",xx);
                  if(get_req_line==line_id_get)
                  {
                    if(receipt.getLineItemValue("item","location",xx)==null || receipt.getLineItemValue("item","location",xx)=='')
                    {
                      receipt.setLineItemValue("item","location",xx,2);
                    }		
                    receipt.setLineItemValue("item","itemreceive",xx,"T");
                  }
                  else
                    {
                       receipt.setLineItemValue("item","itemreceive",xx,"F");
                    }
                  
                }
                var idreceipt=nlapiSubmitRecord(receipt ,true,true);	
                nlapiLogExecution ( 'debug' , 'Item Receipt Successfully' ,'PO ID :'+ json_obj_po.internalid+' Receipt ID: '+ idreceipt);
              }
              catch(er){
                nlapiLogExecution ( 'debug' , 'PO ID :'+ json_obj_po.internalid , er.message);
              }
            }
            nlapiDeleteRecord ( 'customrecord_diamond_receive_dashboard' ,update_data_load.getLineItemValue('recmachcustrecord_po_cdp_id','id',t) ) ;
          }
          catch(er){}
        }
        try
        {
          nlapiDeleteRecord ( 'customrecord_po_cdp_data' ,update_data[s].getId()) ;
        }
        catch(er){}
        var usage = nlapiGetContext().getRemainingUsage();
        // If the script's remaining usage points are bellow 1,000 ...       
        if (usage < 100) 
        {
          // ...yield the script
          var state = nlapiYieldScript();
          // Throw an error or log the yield results
          if (state.status == 'FAILURE')
            throw "Failed to yield script";

        }
      } catch(er){}
    }

  }

}
