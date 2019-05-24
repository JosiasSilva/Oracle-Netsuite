/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define(['N/record','N/search','N/log','N/runtime','N/format'],
       function(record,search,log,runtime,format) {
         function afterSubmit(context) {
           var SalesRecord = record.load({
             type: record.Type.SALES_ORDER, 
             id: context.newRecord.id,
             isDynamic: true
           });
           var Estimate_fields={};
           var log_message="Sales Order ID =>"+context.newRecord.id +
               ";\n TYPE  =>" +context.type+
               ";\n execution Context  =>" +runtime.executionContext+
               ";\n Start Time  =>  "+ new Date();

           try{Customer_Sales_Fields(context,SalesRecord,search,record);}// Script Use 246
           catch(er){ log_message+=";\n Customer_Sales_Fields Error => "+er.message;}

           try{Estimate_Quote_Status_Update(context,SalesRecord,Estimate_fields,search,log);}// Script Use 165
           catch(er){ log_message+=";\n Estimate_Quote_Status_Update Error => "+er.message;}

           try{Custom_Gem_Status_Sync(context,SalesRecord,Estimate_fields);}// Script Use 572
           catch(er){ log_message+=";\n Custom_Gem_Status_Sync Error => "+er.message;}

           if(Estimate_fields)
           {
             var get_val_cust=JSON.stringify(Estimate_fields);
             if(get_val_cust.length>3)
             {
               try
               {

                 record.submitFields({
                   type: record.Type.ESTIMATE,
                   id: SalesRecord.getValue('createdfrom'),
                   values:Estimate_fields ,
                   options: {
                     enableSourcing: false,
                     ignoreMandatoryFields : true
                   }

                 });
               }
               catch(er)
               {
                 log_message+=";\n  Error Save Data => "+er.message;
               }
             }
           }
           log_message+=";\n  End Time  => "+new Date();
           log.debug({ title: 'Message ', details:log_message });

         }
         return {
           afterSubmit: afterSubmit
         };
       });





function Customer_Sales_Fields(context,SalesRecord,search,record)
{

  var info;	
  if(context.type==context.UserEventType.CREATE)
  {
    var new_index;
    info = record.create({type: 'customrecord_customer_order_info', isDynamic: true});
    search.create({	"type": "customrecord_customer_order_info","filters": [['custrecord_cust_order_info_customer','anyof', SalesRecord.getValue("entity")]],"columns":[{name:'custrecord_cust_order_info_index',sort: search.Sort.DESC }]}).run().each(function(result) {
      var current_index = SalesRecord.getValue("custrecord_cust_order_info_index");
      if(current_index)
      {
        new_index = parseInt(current_index) + 1;
        info.setValue("custrecord_cust_order_info_index",new_index);
      }			  
    });

    if(!new_index)
    {
      info.setValue("custrecord_cust_order_info_index","1");
    }

  }
  else if(context.type==context.UserEventType.EDIT)
  {
    search.create({	"type": "customrecord_customer_order_info","filters": [['custrecord_cust_order_info_salesorder','anyof', SalesRecord.id]]}).run().each(function(result) {
      info = record.load({type:'customrecord_customer_order_info',id:result.id});			  
    });			   
  } 
  var order_internal_checkout = SalesRecord.getValue("custbody154");
  if(order_internal_checkout)
    order_internal_checkout = true;
  else
    order_internal_checkout = false;
  if(info)
  {
    info.setValue("custrecord_cust_order_info_salesorder",SalesRecord.id);
    info.setValue("custrecord_cust_order_info_so_date",SalesRecord.getValue("trandate"));
    info.setValue("custrecord_cust_order_info_so_amount",SalesRecord.getValue("subtotal"));
    info.setValue("custrecord_cust_order_info_so_type",SalesRecord.getValue("custbody87"));
    info.setValue("custrecord_cust_order_info_so_place",SalesRecord.getValue("class"));
    info.setValue("custrecord_cust_order_info_so_int_chkout",order_internal_checkout);
    info.setValue("custrecord_cust_order_info_customer",SalesRecord.getValue("entity"));
    info.setValue("custrecord_cust_order_info_category_1",SalesRecord.getValue("custbody_category1"));
    info.setValue("custrecord_cust_order_info_category_2",SalesRecord.getValue("custbody_category2"));
    info.setValue("custrecord_cust_order_info_category_3",SalesRecord.getValue("custbody_category3"));
    info.setValue("custrecord_cust_order_info_category_4",SalesRecord.getValue("custbody_category4"));
    info.setValue("custrecord_cust_order_info_category_5",SalesRecord.getValue("custbody_category5"));
    info.setValue("custrecord_cust_order_info_category_6",SalesRecord.getValue("custbody_category6"));
    info.setValue("custrecord_cust_order_info_metal_1",SalesRecord.getValue("custbody_metal_1"));
    info.setValue("custrecord_cust_order_info_metal_2",SalesRecord.getValue("custbody_metal_2"));
    info.setValue("custrecord_cust_order_info_metal_3",SalesRecord.getValue("custbody_metal_3"));
    info.setValue("custrecord_cust_order_info_metal_4",SalesRecord.getValue("custbody_metal_4"));
    info.setValue("custrecord_cust_order_info_metal_5",SalesRecord.getValue("custbody_metal_5"));
    info.setValue("custrecord_cust_order_info_metal_6",SalesRecord.getValue("custbody_metal_6"));
    info.setText("custrecord_cust_order_info_status","Sales Order:"+SalesRecord.getValue("status"));
    info.setValue("custrecord_cust_order_info_delivery_date",SalesRecord.getValue("custbody6"));
    info.setValue("custrecord_cust_order_info_date_of_if",SalesRecord.getValue("actualshipdate"));
    info.save({
      enableSourcing: true,
      ignoreMandatoryFields: true
    });

  }

}


function Estimate_Quote_Status_Update(context,SalesRecord,Estimate_fields,search,log) {
  if(context.type == context.UserEventType.CREATE  || context.type == context.UserEventType.EDIT ) {
    var created_from =SalesRecord.getValue('createdfrom');
    var create_from_text=SalesRecord.getText('createdfrom');
    if (create_from_text.indexOf('Estimate')!=-1 )
    {
      var Estimate_data = search.lookupFields({
        type: 'estimate',
        id: created_from,
        columns: ['custbodyfinish']
      })
      if(Estimate_data)
      {
        var finish_field=Get_Field_Value(Estimate_data.custbodyfinish) ;		
        if(finish_field)
        {
          Estimate_fields['custbody173']="4";
        }
        else{
          Estimate_fields['custbody173']=["4","7"];
        }
      }
    }

  }
}
function Custom_Gem_Status_Sync(context,SalesRecord,Estimate_fields)
{
  if(context.type == context.UserEventType.CREATE  || context.type == context.UserEventType.EDIT ) {
    if(SalesRecord.getValue('customform')=='152')
    {
      var create_from=SalesRecord.getText('createdfrom');
      if(create_from.indexOf('Estimate')!=-1)
      {
        Estimate_fields['custbody172']=SalesRecord.getValue('custbody172');
        Estimate_fields['custbody173']=SalesRecord.getValue('custbody173');
      }
    }
  }
}



function Get_Field_Value(data_value)
{

  if(data_value)
  {
    if(data_value[0])
    {
      if(data_value[0].value)
      {
        return data_value[0].value;
      }
    }
  }
  return "";
}