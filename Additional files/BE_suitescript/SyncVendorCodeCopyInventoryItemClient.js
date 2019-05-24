nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SyncVendorCodeCopyInventoryItemClient() 
{
    try 
	{
        var cp = getParameter("cp");
		if(cp=="T")
		{
			var itemID = getParameter("id");
			var vendorname = nlapiLookupField("inventoryitem", itemID, "vendorname");
			nlapiLogExecution("debug", "vendor name", vendorname);
			nlapiSetFieldValue('vendorname', vendorname);
		}       
    } 
	catch (e) 
	{
        nlapiLogExecution("debug", "error", e.message);
    }
}


function getParameter(theParameter) 
{ 
  var params = window.location.search.substr(1).split('&'); 
  for (var i = 0; i < params.length; i++) 
  {
    var p=params[i].split('=');
	if (p[0] == theParameter) 
	{
	  return decodeURIComponent(p[1]);
	}
  }
  return false;
}