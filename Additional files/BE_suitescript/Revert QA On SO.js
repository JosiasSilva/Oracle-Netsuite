function Revert_QA(nlobjRequest,nlobjResponce)
{
  var get_so_id=nlobjRequest.getParameter ('SO_ID'); 
  var filters = [];
  filters.push(new nlobjSearchFilter("createdfrom",null,"anyof",get_so_id));
  filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
  var results = nlapiSearchRecord("itemfulfillment",null,filters);
  if(results)
  {
    for(var a=0;a<results.length;a++)
    {
      nlapiDeleteRecord("itemfulfillment",results[a].getId());

    }
  }
  var csIDs = nlapiLookupField("salesorder",get_so_id,"custbody_cs_ff_status_pre_qa");
  if(csIDs.indexOf(",")!=-1)
  {
    csIDs = csIDs.split(",");
  }
  else if(csIDs)
  {
    var temp = csIDs;
    csIDs = [];
    csIDs.push(temp);
  }
  nlapiSubmitField ('salesorder' ,get_so_id , ["custbody140","custbody_shipping_qa_employee"] , [csIDs,""] ,true);
  nlapiSetRedirectURL ( 'record' , 'salesorder' , get_so_id ) ;
}