/**
       *@NApiVersion 2.x
       *@NScriptType UserEventScript
 */
define(['N/record','N/search','N/log','N/ui/serverWidget','N/runtime'],
       function(record,search,log,serverWidget,runtime) {
         function beforeSubmit(context) {
           var SalesRecord = context.newRecord;
           var log_message="Sales Order ID =>"+context.newRecord.id +
               ";\n TYPE  =>" +context.type+
               ";\n execution Context  =>" +runtime.executionContext+
               ";\n Start Time  =>  "+ new Date();
           try{ 
             Customer_Sales_Fields_Delete(context,SalesRecord,search,record); // Script Use 246
           }catch(er){
             log_message+="\n Customer_Sales_Fields_Delete  Error  => "+er.message; 
           }
           log_message+="\n End Time  => "+new Date();
           log.debug({ title: 'Message', details: log_message});
         }
         return {
           beforeSubmit: beforeSubmit
         };
       });



function Customer_Sales_Fields_Delete(context,SalesRecord,search,record)
{

  if(context.type==context.UserEventType.DELETE)
  {

    search.create({
      type:'customrecord_customer_order_info',
      filters:[['custrecord_cust_order_info_salesorder','anyof',SalesRecord.id]]
    }).run().each( function(result){		
      record.delete({type: 'customrecord_customer_order_info',   id: result.id});
    });

  }
}
