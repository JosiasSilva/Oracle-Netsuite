function Inv_Adj_Approval(type,form)
{
  try
  {
    if(nlapiGetFieldValue('custrecord_pia_status')=='2' && !nlapiGetFieldValue('custrecord_pia_inventory_adjustment_rec'))
    {
      var get_id=nlapiGetRecordId();
      nlapiSetRedirectURL ( 'suitelet' , 'customscript_inventory_adjustment_suitel' , 'customdeploy_inventory_adjustment_suitel' ,null,{get_id:get_id}); 
    }
  }
  catch(er)
  {

  }
}


function Inv_Adj_Approval_Suit(request,responce)
{
  var get_id=request.getParameter("get_id");
  try
  {
    var filters = [];
    filters.push(new nlobjSearchFilter("custrecord_pia_parent",null,"anyof",get_id));
    var cols = [];
    cols.push(new nlobjSearchColumn("custrecord_pia_line_item"));
    cols.push(new nlobjSearchColumn("custrecord_pia_location"));
    cols.push(new nlobjSearchColumn("custrecord_pia_units"));
    cols.push(new nlobjSearchColumn("custrecord_pia_adjust_qty_by"));
    cols.push(new nlobjSearchColumn("custrecord_pia_est_unit_cost"));
    cols.push(new nlobjSearchColumn("custrecord_pia_memo"));
    cols.push(new nlobjSearchColumn("custrecord_pia_date","custrecord_pia_parent"));
    cols.push(new nlobjSearchColumn("custrecord_pia_adjustment_account","custrecord_pia_parent"));
    cols.push(new nlobjSearchColumn("custrecord_pia_header_memo","custrecord_pia_parent"));
    cols.push(new nlobjSearchColumn("custrecord_pia_recon_type","custrecord_pia_parent"));
    var results = nlapiSearchRecord("customrecord_pia_line",null,filters,cols);
    if(results)
    {
      var ia = nlapiCreateRecord("inventoryadjustment",{recordmode:"dynamic"});
      ia.setFieldValue("trandate",results[0].getValue("custrecord_pia_date","custrecord_pia_parent"));
      ia.setFieldValue("account",results[0].getValue("custrecord_pia_adjustment_account","custrecord_pia_parent"));
      ia.setFieldValue("memo",results[0].getValue("custrecord_pia_header_memo","custrecord_pia_parent"));
      ia.setFieldValue("custbody371",results[0].getValue("custrecord_pia_recon_type","custrecord_pia_parent"));
      for(var x=0; x < results.length; x++)
      {
        ia.selectNewLineItem("inventory");
        ia.setCurrentLineItemValue("inventory","item",results[x].getValue("custrecord_pia_line_item"));
        ia.setCurrentLineItemValue("inventory","location",results[x].getValue("custrecord_pia_location"));
        if(results[x].getValue("custrecord_pia_units"))
          ia.setCurrentLineItemValue("inventory","units",results[x].getValue("custrecord_pia_units"));
        ia.setCurrentLineItemValue("inventory","adjustqtyby",results[x].getValue("custrecord_pia_adjust_qty_by"));
        if(results[x].getValue("custrecord_pia_adjust_qty_by") > 0)
          ia.setCurrentLineItemValue("inventory","unitcost",results[x].getValue("custrecord_pia_est_unit_cost"));
        ia.setCurrentLineItemValue("inventory","memo",results[x].getValue("custrecord_pia_memo"));
        ia.commitLineItem("inventory");
      }
      var iaId = nlapiSubmitRecord(ia,true,true);
      //Write IA internal ID back to PIA record
      nlapiSubmitField("customrecord_pending_inventory_adj",get_id,"custrecord_pia_inventory_adjustment_rec",iaId);

    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error Creating IA Transaction","Details: " + err.message);
  }
  nlapiSetRedirectURL ( 'record' , 'customrecord_pending_inventory_adj' , get_id ,'view'); 
}
