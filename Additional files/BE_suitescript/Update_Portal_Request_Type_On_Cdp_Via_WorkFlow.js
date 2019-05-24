function Update_Portal_Request_Type_On_Cdp_Via_WF(type)
{
  var cdpId = nlapiGetRecordId();
  var context = nlapiGetContext();
  var contextType = context.getExecutionContext();
  var recordType = nlapiGetRecordType();
  nlapiLogExecution("DEBUG","Cdp Id(WorkFlow) :",cdpId);
  nlapiLogExecution("debug","Record type (WorkFlow)",recordType); 
  nlapiLogExecution("debug","Context type (WorkFlow)",contextType); 
  nlapiLogExecution("debug","Type (WorkFlow)",type);
  Push_To_Portal_Via_WorkFlow(cdpId,type,recordType,contextType) ;
}