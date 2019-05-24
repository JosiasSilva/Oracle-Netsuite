/**
               *@NApiVersion 2.x
               *@NScriptType UserEventScript
               */
var flag_update=false;
define(['N/record','N/search','N/log','N/ui/serverWidget','N/runtime'],
       function(record,search,log,serverWidget,runtime) {
         function afterSubmit(context) {
          // log.debug({ title: 'TYPE', details: record.Type});
           log.debug({ title: 'Start Time- ', details: new Date()});
           var Return_Authorization_Record = context.newRecord;           
           var field_value=[Return_Authorization_Record.getValue('custcol_full_insurance_value')];
           try{Return_Label_Insurance(context,Return_Authorization_Record,field_value);}catch(er){}  //Script Use 1082
        //   log.debug({ title: 'Start - ' +flag_update, details: field_value});
           if(flag_update)
           {
             try
             {
               var id= record.submitFields({
                 type: 'returnauthorization',
                 id: Return_Authorization_Record.id,
                 values:{
                   custcol_full_insurance_value:field_value[0]
                 } ,
                 options: {
                   enableSourcing: false,
                   ignoreMandatoryFields : true
                 }
               });
             }
             catch(er)
             {
               log.debug({ title: 'submitFields', details: er.message});
             }
           }
           log.debug({ title: 'End Time- ', details: new Date()});
         }
         return {
           afterSubmit: afterSubmit
         };
       });

function Return_Label_Insurance(context,Return_Authorization_Record,field_value)
{
  if( context.type == context.UserEventType.CREATE|| context.type == context.UserEventType.EDIT)
  {
    var returnInsurance = 0.00;		

    for(var x=0; x < Return_Authorization_Record.getLineCount({sublistId: 'item'}); x++)
    {
      returnInsurance += parseFloat(Return_Authorization_Record.getSublistValue({sublistId: 'item',fieldId: 'custcol_full_insurance_value',line: x}));
    }
    if(returnInsurance!=field_value[0])
    {
      flag_update=true;
      field_value[0]=returnInsurance;
    }

  }
}
