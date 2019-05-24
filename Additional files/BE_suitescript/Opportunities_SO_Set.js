function Connection_Opportunity_SO(entity)
{
  var filters = [];
  filters.push(new nlobjSearchFilter("entity",null,"anyof",entity));
  filters.push(new nlobjSearchFilter("entitystatus",null,"anyof",[7,6,11,8,9,17,15]));
  var results = nlapiSearchRecord("opportunity",null,filters);
  if(results)
  {					
    if(results.length==1)
      return results[0].getId();
  }
}