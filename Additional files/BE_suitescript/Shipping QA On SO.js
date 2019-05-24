function Shipping_QA(nlobjRequest,nlobjResponce)
{
  var get_so_id=nlobjRequest.getParameter ('SO_ID');
  try
  {
    var get_field=[];
    var value_field=[];
    get_field.push("custbody_shipping_qa_employee");
    value_field.push(nlapiGetUser ( ));
    var newStatus = [];
    var csIDs=[];
    var so_get = nlapiLookupField("salesorder",get_so_id,["custbody140","custbody53","custbody_pickup_location","custbody58","custbody39"]);
    var csIDs_get=so_get.custbody140;
    if(csIDs_get.indexOf(",")!=-1)
    {
      csIDs = csIDs_get.split(",");
      newStatus= csIDs_get.split(",");
      get_field.push("custbody_cs_ff_status_pre_qa");
      value_field.push(csIDs);
    }
    newStatus.push("20");
    if(so_get.custbody53=='T' && so_get.custbody_pickup_location!='1')
    {
      newStatus.push("22"); //In Transit
    }
    get_field.push("custbody140");
    value_field.push(newStatus);
    if(so_get.custbody53=="T")
    {
      get_field.push("custbody58");
      value_field.push('At BE - All materials ready. ' + so_get.custbody58);	   
    }
    if(so_get.custbody39 && so_get.custbody53)
    {
      get_field.push("custbody58");
      value_field.push('Drop Ship materials sent. ' + so_get.custbody58);	
    }


    var tracking = null;

    var filters = [];
    filters.push(new nlobjSearchFilter("createdfrom",null,"is",get_so_id));
    filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
    filters.push(new nlobjSearchFilter("status",null,"is","ItemShip:A"));
    var results = nlapiSearchRecord("itemfulfillment",null,filters);
    if(results)
    {
      var itemfulfillment = nlapiLoadRecord("itemfulfillment",results[0].getId());
      itemfulfillment.setFieldValue("shipstatus","B");

      if(itemfulfillment.getLineItemCount("packagefedex") > 0)
      {
        tracking = itemfulfillment.getLineItemValue("packagefedex","packagetrackingnumberfedex","1");
      }

      if(itemfulfillment.getFieldValue("custbody_fedex_ws_tracking_number"))
      {
        tracking = itemfulfillment.getFieldValue("custbody_fedex_ws_tracking_number");
        itemfulfillment.setFieldValue("custbody69",tracking);
      }

      nlapiSubmitRecord(itemfulfillment);
    }
    else
    {
      var filters2 = [];
      filters2.push(new nlobjSearchFilter("createdfrom",null,"is",get_so_id));
      filters2.push(new nlobjSearchFilter("mainline",null,"is","T"));
      var cols2 = [];
      cols2.push(new nlobjSearchColumn("custbody_fedex_ws_tracking_number"));
      var results2 = nlapiSearchRecord("itemfulfillment",null,filters2,cols2);
      if(results2)
      {
        if(results2[0].getValue("custbody_fedex_ws_tracking_number")!=null && results2[0].getValue("custbody_fedex_ws_tracking_number")!="")
        {

          tracking = results2[0].getValue("custbody_fedex_ws_tracking_number");
          nlapiSubmitField("itemfulfillment",results2[0].getId(),"custbody69",results2[0].getValue("custbody_fedex_ws_tracking_number"));
        }
      }
    }

    if(tracking)
    {
      get_field.push("custbody69");
      value_field.push(tracking);

    }

    nlapiSubmitField("salesorder",get_so_id,get_field,value_field,true);
  }

  catch(er){}
  nlapiSetRedirectURL ( 'record' , 'salesorder' , get_so_id ) ;
}
