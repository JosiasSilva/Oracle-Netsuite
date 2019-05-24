function Test_Setster(type)
{
  try
  {
    nlapiLogExecution("debug","test setster");
    var i= nlapiRequestURL("https://www.setster.com/api/v2/appointment/19533394865?session_token=k0eq2ga5p0ljsiadpc0k7l9ii7", null,null, null, null );
    nlapiLogExecution("debug","test setster body record",JSON.stringify(i.getBody()));
    nlapiLogExecution("debug","test setster end");
    var j=0;
  }
  catch(ex)
  {
    nlapiLogExecution("debug","test setster error",ex.message);
  }
}