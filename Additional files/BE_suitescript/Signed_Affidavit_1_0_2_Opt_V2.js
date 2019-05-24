nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Signed_Affidavit_Automation(type)
{
  var ctx = nlapiGetContext().getExecutionContext();
  if(ctx!="userinterface" && ctx!="webserivces" && ctx!="suitelet")
    return true;

  if(type=="create" || type=="edit")
  {
    try
    {
     
      var order = nlapiGetNewRecord();
      var affidavit = null;

      var custbody125 = order.getFieldValue("custbody125");

      //shavez
      //27-01-2017
      var filters = [];
	  var results=null;
	  if(type=="edit")
	  {
		  var internalid = nlapiGetRecordId();
		  filters.push(new nlobjSearchFilter("internalid", null, "is", internalid));
		  // var results = nlapiSearchRecord(null,4774, filters, null);//Sandbox
		  results = nlapiSearchRecord(null,5583, filters, null);//Production
		  nlapiLogExecution("debug","results",results)
	  }
      if (results)
      {
        affidavit = "5";
      }
      else
      {
        if(custbody125==null || custbody125=='' )
        {
          affidavit = "1";
        }
        else
        {
          affidavit=null;
        }
      }
      //shavez
      if(affidavit!=null)
        nlapiSetFieldValue("custbody125",affidavit);
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Setting Signed Affidavit field values","Details: " + err.message);
      return true;
    }
  }
}