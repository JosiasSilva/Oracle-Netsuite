function chk_LooseDiamond_For_SO_IA(order,currency,pages,email,customer_name,today,statement_of_value_temp_so_ia_temp,type)
{ 
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var total_line_item_count = parseInt(order.getLineItemCount("item"));
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    if(category == 7)
    {
      var current_line_item_count = parseInt(x+1) ;
      if(current_line_item_count == total_line_item_count)
      {
        return SO_IA_Create_Statement_Of_Value_For_Loose_Diamond(order,currency,pages,email,customer_name,today,statement_of_value_temp_so_ia_temp,type);
      }
      else
      {
        continue;
      }
    }
    else if(category != 7)
    {
      break;
    }
  }
  return '';
}