function Get_Search_Pick_Up_Location_Link(location_id)
{
  var filters = [];
  filters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"anyof",location_id));
  var results = nlapiSearchRecord("location",null,filters);
  if(results)
  {
    return  Get_Location_Value(results[0].getId());
  }
}

function Get_Location_Value(location_id)
{
  var location = nlapiLoadRecord("location",location_id);
  var get_location={
    "id":location_id,
    "addr1":location.getFieldValue("addr1"),
    "addr2":location.getFieldValue("addr2"),
    "country":location.getFieldValue("country"),
    "city":location.getFieldValue("city"),
    "state":location.getFieldValue("state"),
    "zip":location.getFieldValue("zip")
  }
  return get_location;
}
