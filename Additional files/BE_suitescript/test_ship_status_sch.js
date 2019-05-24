function test_ship_status()
{
  try
  {
    var  load_item = nlapiLoadRecord("itemfulfillment",24908155);
    load_item.setFieldValue('custbody14',"new test");
    load_item.setFieldValue('shipstatus',"C"); 
    nlapiSubmitRecord(load_item,false,false);
  }
  catch(ex)
  {
    nlapiLogExecution("debug", "error", ex.message);
  }
}