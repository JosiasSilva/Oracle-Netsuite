nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setBasePrice() {
	nlapiLogExecution('debug','script','Entered before Submit');
	try {
		nlapiLogExecution('debug','script','Entered before Submit1');
		var price = nlapiGetFieldValue('custitem_custom_base_price');
		nlapiLogExecution('debug','price #'+nlapiGetRecordId(),price);
		if (price)
			nlapiSetLineItemValue('price', 'price_1_', 1, price);
	} catch (e) {
	nlapiLogExecution('debug','exception',e);}
}
