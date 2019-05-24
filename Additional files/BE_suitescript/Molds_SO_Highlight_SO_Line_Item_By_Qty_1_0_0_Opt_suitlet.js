nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Search_Molds_SO(request,responce)
{
  if (request.getMethod() == 'GET') 
  {

    //Molds SO Script
    var molds = [];
    var item = request.getParameter('item');
    var vendor = request.getParameter('vendor');
    var parent = nlapiLookupField("item",item,["parent","custitem20"]);
    // if(parent==null || parent=="")
    //  continue;
    nlapiLogExecution("debug","PO Vendor",vendor);
   // nlapiLogExecution("debug","parent",parent.parent);
    if( parent && parent.parent!=null && parent.parent!="")
    {
      var filters = [];
      filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent.parent));
      filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
      var cols = [];
      cols.push(new nlobjSearchColumn("name"));
      var results = nlapiSearchRecord("customrecord_mold",null,filters,cols);
      if(results)
      {
        for(var i=0; i < results.length; i++)
        {
          molds.push(results[i].getValue("name"));
        }
        var value_line=[];
        value_line.push(molds.join("\n"));
        response.writeLine(JSON.stringify(value_line));
      }
    }
    response.writeLine("");
  }
}
