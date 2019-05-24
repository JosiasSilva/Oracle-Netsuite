/**
 *@NApiVersion 2.x
*@NScriptType UserEventScript
*/

define(['N/record','N/log'],
       function(record,log) {
         function afterSubmit(context) {
           log.debug({ title: 'Start Time- ', details: new Date()});
           var Return_Authorization_Record = context.newRecord;
           try{
             var get_insu_value= Return_Label_Insurance(context,Return_Authorization_Record);
             if(get_insu_value)
             {
               var id= record.submitFields({
                 type: 'returnauthorization',
                 id: Return_Authorization_Record.id,
                 values:{
                   custbody_return_label_insurance:get_insu_value
                 } ,
                 options: {
                   enableSourcing: false,
                   ignoreMandatoryFields : true
                 }
               });

             }

           }catch(er){}  //Script Use 1082
           log.debug({ title: 'End Time- ', details: new Date()});
         }
         return {
           afterSubmit: afterSubmit
         };
       });

function Return_Label_Insurance(context,Return_Authorization_Record)
{
  if( context.type == context.UserEventType.CREATE|| context.type == context.UserEventType.EDIT)
  {
    var returnInsurance = 0.00;		

    for(var x=0; x < Return_Authorization_Record.getLineCount({sublistId: 'item'}); x++)
    {
      var get_ret=Return_Authorization_Record.getSublistValue({sublistId: 'item',fieldId: 'custcol_full_insurance_value',line: x});
      if(get_ret)
      {
        returnInsurance += parseFloat(get_ret);
      }
    }
    var field_value_ret=Return_Authorization_Record.getValue('custbody_return_label_insurance');
    if(returnInsurance!=field_value_ret)
    {
      return returnInsurance;
    }

  }
}
