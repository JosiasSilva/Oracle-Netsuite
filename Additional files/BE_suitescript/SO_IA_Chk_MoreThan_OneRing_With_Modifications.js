function SO_IA_Chk_More_Than_One_Ring_With_Modifications(order)
{
  var chk_catOne_catTwo=0;
  var chk_modification= false;
  for(var u=0; u < order.getLineItemCount("item"); u++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",u+1),"custitem20");
    var itemId=order.getLineItemValue("item","item",u+1);
    if(category == 2)
    {
      chk_catOne_catTwo  += 1;
    }
    else if( category== 3 )
    {
      chk_catOne_catTwo += 1;
    }
    else if(category== 12)
    {
      if(itemId == 782)
      {
        chk_modification=true;
      }
    }
  }
  nlapiLogExecution("Debug","More Than one Ring(2 or 3 or 4 ....)(Test) Lib File",chk_catOne_catTwo);
  nlapiLogExecution("Debug","Modifications value (T/F)(Test) Lib File",chk_modification);
  if(parseInt(chk_catOne_catTwo)>= 2 && chk_modification == true)
  {
    return true;
  }
  else 
    return false;
}