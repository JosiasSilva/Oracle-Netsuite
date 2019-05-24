/*  [NS-1088]
 *   DESCRIPTION
 *   sync the status of BE Engraving Status field from PO to SO
*/
function Update_Be_Engraving_Status_From_PO_To_SO(type,form)
{
  try
  {
    var po_id = nlapiGetRecordId();
    nlapiLogExecution("DEBUG","Purchase Order Internal Id",po_id);
    var so_id = nlapiLookupField("purchaseorder", po_id,"createdfrom");
    nlapiLogExecution("DEBUG","Sales Order Internal Id",so_id);
    var be_engraving_status = nlapiGetFieldValue("custbody348");
    nlapiLogExecution("DEBUG","Be Engraving Status",be_engraving_status);
    nlapiSubmitField("salesorder",so_id,"custbody348",be_engraving_status);
    nlapiLogExecution("DEBUG","Result","BE engraving status field has been updated successfully from PO to SO");
  }
  catch(ex)
  {
    nlapiLogExecution("DEBUG","ERROR",ex.message);
  }
}