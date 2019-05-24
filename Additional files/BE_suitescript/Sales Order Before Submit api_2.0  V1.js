/**
       *@NApiVersion 2.x
       *@NScriptType UserEventScript
 */
define(['N/record','N/search','N/log','N/ui/serverWidget','N/runtime'],
       function(record,search,log,serverWidget,runtime) {
         function beforeSubmit(context) {
           if(runtime.executionContext != "USERINTERFACE" )
             return true;
           var SalesRecord = context.newRecord;	
           try{Gift_Item_Line_Checkbox(context,SalesRecord,log);}catch(er){} // Script Use 1042
         }
         return {
           beforeSubmit: beforeSubmit
         };
       });


function Gift_Item_Line_Checkbox(context,SalesRecord,log)
{
  if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT)
  {
    for(var x=0; x < SalesRecord.getLineCount({sublistId: 'item'}); x++)
    {
      var category = SalesRecord.getSublistValue({sublistId:"item",fieldId:"custcol_category",line:x});
      var amount = SalesRecord.getSublistValue({sublistId:"item",fieldId:"amount",line:x});
      if(amount==0.00 && (category=="4" || category=="5" || category=="9" || category=="34"))
      {
        SalesRecord.setSublistValue({sublistId:"item",fieldId:"custcol_gift_item",line:x,value:true});
      }
    }
  }
}

