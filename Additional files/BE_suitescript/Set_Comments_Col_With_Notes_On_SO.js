function Set_Comments_Col_With_Notes_On_SO(so_notes,order_id)
{
  nlapiLogExecution("Error","so_notes in lib Set_Comments_Col_With_Notes_On_SO()",so_notes);
  nlapiLogExecution("Error","order_id in lib Set_Comments_Col_With_Notes_On_SO()",order_id);
  var so_Obj = nlapiLoadRecord("salesorder",order_id);
  var so_comments ='';
  for(var h=0;h<so_Obj.getLineItemCount('item');h++)
  {
    var item_id = so_Obj.getLineItemValue('item','item',h+1);
    if(item_id == 2131887)
    {
      /*var comments = so_Obj.getLineItemValue('item','custcol5',h+1);
      if(comments !=null && comments!='')
      {
        so_comments = comments + "\n" + so_notes;
        so_Obj.setLineItemValue("item" ,"custcol5",h+1,so_comments);
      }
      else*/
      so_Obj.setLineItemValue("item" ,"custcol5",h+1,so_notes);
      break;
    }
  }
  so_Obj.commitLineItem('item');
  nlapiSubmitRecord(so_Obj,true,true);
  nlapiLogExecution("Error","Set Comment in Sales order","Set comments in sales order successfully");
}