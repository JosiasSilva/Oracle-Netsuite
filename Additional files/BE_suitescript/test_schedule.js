function test_schedule(type)
{
  try
  {
    var context = nlapiGetContext();
    var contextType = context.getExecutionContext();
    nlapiLogExecution("debug","Type", type);
    nlapiLogExecution("debug","Context", contextType);
    var loadObj = nlapiLoadRecord("salesorder", 24883619);
    loadObj.setFieldValue('orderstatus', 'B');
    loadObj.setFieldValue("custbody58","test so notes 11");

    nlapiSubmitRecord(loadObj,true,true);
  }
  catch(ex)
  {
    nlapiLogExecution("debug","error", ex.message);
  }

}