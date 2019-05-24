nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Highlight_PO_Line_Item_Req_Location_LA(type,form)
{
	if(type=='view')
	{
		var context = nlapiGetContext();
		if(context.getExecutionContext()!="userinterface")
			return true;
		
		var lineItemCount = nlapiGetLineItemCount('item');
		
		var field = form.addField("custpage_highlight_fields_show","inlinehtml","Highlight Fields",null,'custom');
		var fieldValue = "<script type='text/javascript'>";
        fieldValue += 'var items = document.getElementById("item_splits");';
		
		for(var i=1; i <= lineItemCount; i++)
		{
			var req_location = nlapiGetLineItemValue('item','custcol31',i);
			nlapiLogExecution('DEBUG','Current Item Req Location:',req_location);
			
			if(req_location == "2")
			{
				fieldValue += 'var row = items.rows[' + i + '];';
				fieldValue += 'for ( var j = 0; j < row.cells.length; j++ ) {';
				fieldValue += 'var cell = row.cells[j];';
				fieldValue += 'cell.style.setProperty("background-color","yellow","important");';
				fieldValue += '}';
			}
		}
		
		fieldValue += "</script>";
		nlapiLogExecution('DEBUG','Field Value:',fieldValue);
		
		field.setDefaultValue(fieldValue);//set default value
	}
}