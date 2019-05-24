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
           var log_message="Sales Order ID =>"+SalesRecord.id +
               ";\n TYPE  =>" +context.type+
               ";\n execution Context  =>" +runtime.executionContext+
               ";\n Start Time  =>  "+ new Date();
           var customer_field_value={};
           var customer = search.lookupFields({
             type: 'customer',
             id: SalesRecord.getValue('entity'),
             columns: ['custentity_sales_order_1', 'custentity_sales_order_2', 'custentity_sales_order_3', 'custentity_sales_order_4','custentity_sales_order_5','custentity41']
           });	   


           try{setAppointmentField_Order(context,SalesRecord,customer_field_value);}// Script Use 61
           catch(er){ log_message+=";\n setAppointmentField_Order Error => "+er.message;}    


           try{setStreetTeam(context,SalesRecord,customer_field_value,customer);}// Script Use 114
           catch(er){ log_message+=";\n setStreetTeam Error => "+er.message;}  

           try{LeadClosingList(customer_field_value);}// Script Use 654
           catch(er){ log_message+=";\n LeadClosingList Error => "+er.message;}  

           try{ Customer_Sales_Fields(context,customer,customer_field_value,SalesRecord);}// Script Use 517
           catch(er){ log_message+=";\n Customer_Sales_Fields Error => "+er.message;}  



           if(customer_field_value)
           {
             var get_val_cust=JSON.stringify(customer_field_value);
             if(get_val_cust.length>3)
             {
               try
               {

                 record.submitFields({
                   type: record.Type.CUSTOMER,
                   id: SalesRecord.getValue('entity'),
                   values:customer_field_value ,
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






function setAppointmentField_Order(context,SalesRecord,customer_field_value)
{
  if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT )
  {
    if(SalesRecord.getValue("class")=="3")
    {
      customer_field_value['custentity46']=true;
    }
  }
}

function setStreetTeam(context,SalesRecord,customer_field_value,customer)
{
  if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT )
  {
    if(SalesRecord.getValue("custbody106"))
    {
      if( !Get_Field_Value(customer.custentity41))
        customer_field_value['custentity41'] =true;
    }
    else if(Get_Field_Value(customer.custentity41))
    {

      customer_field_value['custbody106'] =true
    }
  }
}
function LeadClosingList(customer_field_value)
{
  customer_field_value['custentity89'] =false;
}


function Customer_Sales_Fields(context,customer,customer_field_value,SalesRecord)
{
  if (context.type == context.UserEventType.CREATE)
  {
    for(var a=1;a<=5;a++)
    {			 
      if(!Get_Field_Value(customer['custentity_sales_order_'+a]))
      {			

        customer_field_value['custentity_date_order_'+a]=SalesRecord.getValue('trandate');
        customer_field_value['custentity_amount_order_'+a]=SalesRecord.getValue('subtotal');
        customer_field_value['custentity_type_of_order_'+a]=SalesRecord.getValue('custbody87');
        customer_field_value['custentity_sales_order_'+a]=SalesRecord.id;
        customer_field_value['custentity_place_of_sale_order_'+a]=SalesRecord.getValue('class');
        if(SalesRecord.getValue("custbody154"))
          customer_field_value['custentity_internal_checkout_order_'+a]=true;	
        else
          customer_field_value['custentity_internal_checkout_order_'+a]=false;
        break;					

      }
    }

  }
  else if(context.type == context.UserEventType.EDIT)
  {

    for(var a=1;a<=5;a++)
    {			 
      if(Get_Field_Value(customer['custentity_sales_order_'+a])==SalesRecord.id)
      {			

        customer_field_value['custentity_date_order_'+a]=SalesRecord.getValue('trandate');
        customer_field_value['custentity_amount_order_'+a]=SalesRecord.getValue('subtotal');
        customer_field_value['custentity_type_of_order_'+a]=SalesRecord.getValue('custbody87');
        customer_field_value['custentity_sales_order_'+a]=SalesRecord.id;
        customer_field_value['custentity_place_of_sale_order_'+a]=SalesRecord.getValue('class');
        if(SalesRecord.getValue("custbody154"))
          customer_field_value['custentity_internal_checkout_order_'+a]=true;	
        else
          customer_field_value['custentity_internal_checkout_order_'+a]=false;
        break;
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