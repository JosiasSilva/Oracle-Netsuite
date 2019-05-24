nlapiLogExecution("audit","FLOStart",new Date().getTime());
 function SyncFromInventoryToReturnAuth()
 {
   nlapiLogExecution("DEBUG","Inventory Item Id : "+ nlapiGetRecordId());
   var obj = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());   
   var form = obj.getFieldValue('customform');
   var category = obj.getFieldValue('custitem20');
        
   if(form == 21 || form == 1)
   {
     //Get Previous Return Estate Status
     var ctx = nlapiGetContext();
     var returnEstateStatusOld = ctx.getSessionObject('returnEstateStatus');
     nlapiLogExecution("DEBUG","Old Return Estate Status : "+ returnEstateStatusOld);
     var returnEstateStatus = obj.getFieldValue('custitem179');
     nlapiLogExecution("DEBUG","Current Return Estate Status : "+ returnEstateStatus);
	 
     if((returnEstateStatus != 4 && returnEstateStatus != 2) && (returnEstateStatusOld == returnEstateStatus))
     {
	nlapiLogExecution("DEBUG","No any change on return estate status field.");
     }
     else if((returnEstateStatus == 4 || returnEstateStatus == 2) && (returnEstateStatus != returnEstateStatusOld))
     {
       var filters = [];
       filters[0] = new nlobjSearchFilter('item', null, 'is', nlapiGetRecordId());
       var searchresults = nlapiSearchRecord('returnauthorization', null, filters, []); 
       if(searchresults != null)
       {
         for(var i=0; i < searchresults.length; i++)
         {
            var internalId = searchresults[i].id;
            UpdateReturnAuthorization(internalId);
         }               
       } 
     }
     else if((returnEstateStatus == 4 || returnEstateStatus == 2) && (returnEstateStatus == returnEstateStatusOld))
     {
       var filters = [];
       filters[0] = new nlobjSearchFilter('item', null, 'is', nlapiGetRecordId());
       var searchresults = nlapiSearchRecord('returnauthorization', null, filters, []); 
       if(searchresults != null)
       {
         for(var i=0; i < searchresults.length; i++)
         {
            var internalId = searchresults[i].id;
            SyncReturnAuthorization(internalId);
         }               
       } 
     }
   }
 }
 
 //Update Return Auth Page
 function UpdateReturnAuthorization(id)
 {
   var retAuthObj = nlapiLoadRecord('returnauthorization',id);
   var statusOnRepairResize = retAuthObj.getFieldValue('custbody142');   
   retAuthObj.setFieldValue('custbody142',20);
   
   var Id = nlapiSubmitRecord(retAuthObj,true,true);
   nlapiLogExecution("DEBUG","Updated Return Authorization Id : "+ Id);
 }

 //Sync Return Auth Page
 function SyncReturnAuthorization(id)
 {
   var retAuthObj = nlapiLoadRecord('returnauthorization',id);
   var statusOnRepairResize = retAuthObj.getFieldValue('custbody142');
   if(statusOnRepairResize != 15 && statusOnRepairResize != null)
   {
     retAuthObj.setFieldValue('custbody142',20);
     var Id = nlapiSubmitRecord(retAuthObj,true,true);
     nlapiLogExecution("DEBUG","Synced Return Authorization Id : "+ Id);
   }   
 }  
 
 //Function to get old value
 function GetOldValue()
 {   
   nlapiLogExecution("DEBUG","Inventory Item Id before submit : "+ nlapiGetRecordId());
   var objInvt = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
   var form = objInvt.getFieldValue('customform');
   
   if(form == 1 || form == 21)
   {    
     var returnEstateStatus = objInvt.getFieldValue('custitem179');     
     var ctx = nlapiGetContext();
     ctx.setSessionObject('returnEstateStatus',returnEstateStatus);
   }
 }

