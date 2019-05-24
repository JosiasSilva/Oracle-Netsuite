/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget', 'N/url','N/search'],
/**
 * @param {record} record
 * @param {serverWidget} serverWidget
 * @param {url} url
 */
function(record, serverWidget, url,search) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {
    if (scriptContext.type == 'view') {
    var rec = scriptContext.newRecord;
   // var recTranType = rec.type;
    
    var messageId = rec.id;
    var recordTyEntity,recordTyTransaction,recordTyAuth;
    var entityEmail="";
    var empEmail = "";
   // log.debug('Context', rec);
    //log.debug('Msg Id', messageId);
    //  return;
    
    var mesRec = record.load({type:record.Type.MESSAGE,id:messageId});
    var tx_Id = mesRec.getText({fieldId:'transaction'});
     log.debug("Transaction ID",tx_Id);
    var entityVal = mesRec.getValue({fieldId:'entity'});
     log.debug("Entity",entityVal)
    var author = mesRec.getValue({fieldId:'author'});
      if (entityVal){
       var entitySearchObjRec = search.create({
   type: "entity",
   filters:
   [
      ["internalidnumber","equalto",entityVal]
   ],
   columns:
   [
      search.createColumn({name: "email", label: "Email"})
   ]
});


entitySearchObjRec.run().each(function(result){
    recordTyEntity = result.recordType;
    log.debug("Entity",recordTyEntity)
    entityEmail = result.getValue({name:'email'});
});
      }
      if (tx_Id){
       var transSearchObjRec = search.create({
   type: "transaction",
   filters:
   [
      ["internalidnumber","equalto",tx_Id]
   ],
   columns:
   [
      search.createColumn({name: "custbody2", label: "Email"})
   ]
});
    transSearchObjRec.run().each(function(result){
    recordTyTransaction = result.recordType;
    log.debug('Transaction Type',recordTyTransaction)
    entityEmail = result.getValue({name:'custbody2'});
});  
      }   
   
      if(author){
         var empSearchObjRec = search.create({
   type: "entity",
   filters:
   [
      ["internalidnumber","equalto",author]
   ],
   columns:
   [
      search.createColumn({name: "email", label: "Email"})
   ]
});


empSearchObjRec.run().each(function(result){
    recordTyAuth = result.recordType;
    empEmail = result.getValue({name:'email'});
});
        
        
      }
      
    
    var form = scriptContext.form;
      
     var fld = form.addField({
 id: 'custpage_htmlfield',
 type: serverWidget.FieldType.INLINEHTML,
 label: 'Inline'
});
      
     // fld.updateDisplayType({displayType:serverWidget.FieldDisplayType.NORMAL});

    form.addButton({
    	id:'custpage_sendmailasop',
    	label: 'Reply as OP',
    	functionName: 'openCustomOpEmailSuiteletPage("'+messageId+'","'+recordTyEntity+'","'+recordTyTransaction+'","'+entityVal+'","'+tx_Id+'","'+entityEmail+'","'+author+'","'+empEmail+'","'+recordTyAuth+'")'
    });
    
    // Made changes to the if condition in Str - Bharath
    var str='\
    	function openCustomOpEmailSuiteletPage(messageId,recordTyEntity,recordTyTransaction,entityVal,tx_Id,entityEmail,author,empEmail,recordTyAuth)\
    	{console.log(messageId);console.log(entityVal);console.log(entityEmail);\
    	var url_string = window.location.href;\
    	var url = new URL(url_string);\
         if(recordTyTransaction && tx_Id){\
    	custpage_recordid = tx_Id;\
    	custpage_recordtype=recordTyTransaction;\
}\
else if(entityVal && recordTyEntity){\
    custpage_recordid = entityVal;\
    custpage_recordtype =recordTyEntity;\
}\
  else {\
      custpage_recordid = author;\
    custpage_recordtype=recordTyAuth;\
    }\
    	if(messageId){\
    	window.open("/app/site/hosting/scriptlet.nl?script=2533&deploy=1&msgId="+messageId+"&custpage_recid="+custpage_recordid+"&custpage_rectype="+custpage_recordtype+"&customerEmail="+entityEmail+"&reply=yes",\"Reply As OP\",\"width=700,height=500\");\
		}\
}';
    
   fld.defaultValue = "<script>"+str+"</script>"
    }
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {

    }

    return {
        beforeLoad: beforeLoad
        //beforeSubmit: beforeSubmit,
        //afterSubmit: afterSubmit
    };
    
});