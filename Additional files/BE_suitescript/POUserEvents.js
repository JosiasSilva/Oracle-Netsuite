nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*jsl:option explicit*/

function poBeforeSubmit(type){
	if(type == 'create' || type == 'edit' || type == 'xedit'){
		var itemCount = nlapiGetLineItemCount('item');
		for(var i = 1; i<= itemCount; i++){// shadow entered item description for reporting.
			nlapiSetLineItemValue('item', 'custcol_line_description', i, nlapiGetLineItemValue('item', 'description', i));
		}
	}
}

