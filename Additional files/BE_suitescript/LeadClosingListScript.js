nlapiLogExecution("audit","FLOStart",new Date().getTime());
function LeadClosingList()
{
   var salesObj = nlapiLoadRecord('salesorder',nlapiGetRecordId());
   var entityId = salesObj.getFieldValue("entity");

   //var leadObj = nlapiLoadRecord('lead',entityId);
   var leadObj = nlapiLoadRecord('customer',entityId);
   leadObj.setFieldValue("custentity89",'F');
   var leadId = nlapiSubmitRecord(leadObj,true,true);
   nlapiLogExecution("debug","Lead Closing List Id :", leadId );
}