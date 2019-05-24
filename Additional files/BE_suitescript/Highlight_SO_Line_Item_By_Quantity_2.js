function Highlight_SO_Line_Item_By_Quantity ( type, form) {
	if ( type == 'view' ) {
		var SO_ID = nlapiGetRecordId();//get record id
		var SO_TYPE = nlapiGetRecordType();//get record type
		var salesOrder = nlapiLoadRecord(SO_TYPE,SO_ID);//get the sales order
		var lineItemCount = salesOrder.getLineItemCount('item');
		var field = form.addField("custpage_highlight_fields_show","inlinehtml","Highlight Fields",null,'custom');
		var fieldValue = "<script type='text/javascript'>";
        fieldValue += 'var items = document.getElementById("item_splits");';
		for ( var i = 1; i <= lineItemCount; i++ ) {
			var quantity = salesOrder.getLineItemValue('item','quantity',i);
			nlapiLogExecution('DEBUG','Current Item Quantity:',quantity);
			if ( quantity > 1 ) {
                try{
					var itemId = salesOrder.getLineItemValue('item','item',i);
					var itemType = 'inventoryitem';
					nlapiLogExecution('DEBUG','Current Item ID:',itemId);
					try{
				    var item = nlapiLoadRecord(itemType,itemId);
					}catch(e)
			        { 
					 continue;
					};
					var category = item.getFieldText('custitem20');
					nlapiLogExecution('DEBUG','Category:',category);
					if (!test_catgetory(category)) {
						fieldValue += 'var row = items.rows[' + i + '];';
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
		nlapiLogExecution('DEBUG','Field Value:',fieldValue);
		field.setDefaultValue(fieldValue);//set default value
	}
}
function test_catgetory(category){
	var regex = /Melee/;
    return regex.test(category);
}