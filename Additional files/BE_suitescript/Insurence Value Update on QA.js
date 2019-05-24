function Value_Update(type,from)
{
  if(type=='create' || type=='copy')
  {
    try
    {
      var insurance_po=nlapiLookupField ( 'customrecord32' , nlapiGetRecordId ( )  ,['custrecord_purchase_order_insurance_qa','custrecord_qa_po_number'] ); 
      if(!insurance_po.custrecord_purchase_order_insurance_qa && insurance_po.custrecord_qa_po_number)
      {
        var load_po=nlapiLoadRecord('purchaseorder',insurance_po.custrecord_qa_po_number);
        var total_insu=0;
        for(var a=1;a<=load_po.getLineItemCount('item');a++)
        {
          var get_insu=load_po.getLineItemValue('item','custcol_full_insurance_value',a);
          if(get_insu){total_insu+=parseFloat(get_insu)};
        }
        if(total_insu>0)
        {
          nlapiSubmitField ( 'customrecord32' ,  nlapiGetRecordId ( ) , 'custrecord_purchase_order_insurance_qa' , total_insu ); 
        }
      }
    }
    catch(er){}
  }
}