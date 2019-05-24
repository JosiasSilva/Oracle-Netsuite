function setEmailMessage(type,form,request)
{
  if(request)
  {
    var gem_call= request.getParameter("gem_call");
    try
    {
      if(gem_call==1)
      {
        var po_id=request.getParameter("transaction");
        //var po_id = 16370956;
        var objPO = nlapiLoadRecord('purchaseorder', po_id);
        var email_notes = objPO.getFieldValue('custbodyvendor_email_notes');
        var arr_email_notes = email_notes.split('\n');
        var itemCount = objPO.getLineItemCount('item');
        var qty_email_display, price, item_desc,itemDet;
        for (var i = 1; i <= itemCount; i++) {
          var email_notes = arr_email_notes[i - 1].split('-')[1].trim();
          var item_id = objPO.getLineItemValue('item', 'item', i);
          var item_category = nlapiLookupField('inventoryitem', item_id, 'custitem20');
          if (item_category == 1 || item_category == 23 || item_category == 30) {

            qty_email_display = objPO.getLineItemValue('item', 'quantity', i) + ' carats';
            price = '$' + objPO.getLineItemValue('item', 'rate', i) + ' per carat';
          } else {
            qty_email_display = objPO.getLineItemValue('item', 'quantity', i) + ' piece';
            price = '$' + objPO.getLineItemValue('item', 'rate', i) + ' per piece';
          }

          item_desc = objPO.getLineItemValue('item', 'description', i);

          if (i == 1) {
            itemDet =  item_desc + " - " + qty_email_display + " - " + price + " - " + email_notes;

          } else {
            itemDet = itemDet  +'<br/>'+ item_desc + " - " + qty_email_display + " - " + price + " - " + email_notes ;
          }
        }

        var config=nlapiLoadConfiguration('userpreferences');
        var sign= config.getFieldValue('message_signature');

        var body ='Hello, <br/> <br/> Please send us the following items: <br/> <br/> '+itemDet+'<br/><br/>'+sign;

        nlapiSetFieldValue('message',body);
        nlapiSetFieldValue('includetransaction','F');

      }
    }
    catch(ex)
    {
      nlapiLogExecution('Debug','Error',ex.message);
    }
  }
}