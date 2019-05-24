nlapiLogExecution("audit","FLOStart",new Date().getTime());

function Molds_SO(type,form)
{
  if(type=="view")
  {
    try
    {
      if(nlapiGetContext().getExecutionContext()!="userinterface")
        return true;
      var field = form.addField("custpage_highlight_fields_show_2015","inlinehtml","Highlight Fields",null,'custom');
      var fieldValue = "<script type='text/javascript'>";
      fieldValue += 'var items = document.getElementById("item_splits");';
      var lineItemCount = nlapiGetLineItemCount('item');
	  var validCategories=["32","33","35","36","2","3"];
      for(var x=0; x < lineItemCount; x++)
      {
        var quantity = nlapiGetLineItemValue('item','quantity',x+1);
        if ( quantity > 1 ) {
          try{
            var itemId = nlapiGetLineItemValue('item','item',x+1);
            var category = nlapiLookupField('item',itemId,'custitem20',false);
            if (validCategories.indexOf(category)>-1) {
              fieldValue += 'var row = items.rows[' + (x+1) + '];';
              fieldValue += 'for ( var j = 0; j < row.cells.length; j++ ) {';
              fieldValue += 'var cell = row.cells[j];';
              fieldValue += 'cell.style.setProperty("background-color","yellow","important");';
              fieldValue += '}';
            }
          }catch(e){
            nlapiLogExecution("ERROR",e.getCode(),e.getDetails());
          }
        }
      }
      fieldValue += "</script>";
      field.setDefaultValue(fieldValue);//set default value
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Showing Molds On SO","Details: " + err.message);
      return true;
    }
  }
}

function test_catgetory(category){
  var regex = /Melee/;
  return regex.test(category);
}



