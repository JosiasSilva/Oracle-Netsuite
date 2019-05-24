nlapiLogExecution("audit","FLOStart",new Date().getTime());
function extSyncPerMessage(type,form)
{
   try
     {
       var ctx = nlapiGetContext().getExecutionContext();
       nlapiLogExecution("DEBUG", "Execution Context" , ctx);

	   if(ctx!="userinterface")
		return true;

       var newMessageId = nlapiGetRecordId();
       nlapiLogExecution("debug", "New Message Id" , newMessageId);

       form.addField("custpage_checkbox","checkbox"," EXTERNAL SYNC");

       var filters = [];
       var columns =[];
       filters.push(new nlobjSearchFilter("custrecord_new_message_id",null,"is",newMessageId));
       columns.push(new nlobjSearchColumn("custrecord_ext_sync"));
       var results = nlapiSearchRecord("customrecord_extsyncpermessage",null,filters,columns);
       if(results)
       {
             var extSync = results[0].getValue('custrecord_ext_sync');
             nlapiLogExecution("DEBUG", "Information" , "External Sync : " + extSync);
            nlapiSetFieldValue("custpage_checkbox",extSync) ;
        }
         else
              nlapiLogExecution("DEBUG", "Information" , "Message Id : "+ newMessageId +" does not exist in custom record");
     }
     catch(ex)
     {
       nlapiLogExecution("DEBUG", "Error" , ex.message);
     }
}