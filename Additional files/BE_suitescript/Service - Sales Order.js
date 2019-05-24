function Service_Call(nlobjRequest,nlobjResponce)
{
  if(nlobjRequest.getParameter ('type')=='Shipping_QA' )
  {
    Shipping_QA(nlobjRequest,nlobjResponce);
  }
  else if(nlobjRequest.getParameter ('type')=='Revert_QA')
  {
    Revert_QA(nlobjRequest,nlobjResponce);
  }
  else if(nlobjRequest.getParameter ('type')=='ShippingAddress' && nlobjRequest.getParameter ('location_id'))
  {
    var get_obj= Get_Search_Pick_Up_Location_Link(nlobjRequest.getParameter ('location_id'));
    if(get_obj)
    {
      nlobjResponce.write(JSON.stringify(get_obj));
    }
  }
  else if(nlobjRequest.getParameter ('type')=='Vendor_FC' && nlobjRequest.getParameter ('custcol_cad_item') && nlobjRequest.getParameter ('item') )
  {
    var get_obj= setPreferredVendor_FC(nlobjRequest.getParameter ('custcol_cad_item'),nlobjRequest.getParameter ('item'))
    if(get_obj)
    {
      nlobjResponce.write(get_obj);
    }
  }
  else if(nlobjRequest.getParameter ('type')=='Connection_Opportunity_SO' && nlobjRequest.getParameter ('entity') )
  {
    var get_obj= Connection_Opportunity_SO(nlobjRequest.getParameter ('entity'))
    if(get_obj)
    {
      nlobjResponce.write(get_obj);
    }
  }

}