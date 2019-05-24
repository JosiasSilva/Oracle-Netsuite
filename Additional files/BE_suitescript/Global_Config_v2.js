function isTest(styleNumber) {
	return (styleNumber.indexOf('test') == 0);
}

//get the request url from BE according to criteria
function getBeHost(styleNumber) {
	if (isTest(styleNumber)) {
		return "http://4be.aragoncs.com";
//[http://new13605.brilliantearth.com,http://4be.aragoncs.com]
	} else {
		return "https://www.brilliantearth.com";
	}
}

//get the style_number that will be showed in BE end
function getBeStyleNumber(style_number) {
	if (typeof style_number == "string"){
		if (isTest(style_number)) {
			style_number = style_number.replace("test_", "");
		}
	}
	return style_number;
}

//get the authentication information
function getAuthInfo(styleNumber)
{
	if (isTest(styleNumber))
	{
		return {_key: 'test', test: true};
	} else {
		return {_key: 'DDDE5D1219612C978B8AA6D2E727088A'};
	}
}
/*
 *get the real amount of the customer deposit according to the internalid field
 *internalid field type:string
 */
function getRealAmount(internalid){
	nlapiLogExecution('DEBUG', 'internalid', internalid);
	var recordType = 'customerdeposit';
    var filters = new Array();
    filters[0] = nlobjSearchFilter('internalid',null,'is',internalid);
    var recordResult = nlapiSearchRecord(recordType, null, filters);
	var payment = 0;


	if(recordResult != null){
        var customerDeposit = nlapiLoadRecord(recordType, recordResult[0].getId());
		payment = customerDeposit.getFieldValue('payment');//get the payment field value
		nlapiLogExecution('DEBUG', 'Payment Value', payment);
	}
	return payment;
}
/*
 *judge whether the related deposit of sales order equal to 150,used in task 88
 */
function depositEqualCriteria(salesOrder){
	var returnFlag = false;//default value is 'false'
	var orderStatus = salesOrder.getFieldText('orderstatus');


	if ( orderStatus == 'Billed' ) {
		var relatedRecordCount = salesOrder.getLineItemCount('links');
		for ( i = 1; i <= relatedRecordCount; i++ ) {
			var currItemType = salesOrder.getLineItemValue('links', 'type', i);
			if ( currItemType == 'Customer Deposit' ) {
				var currItemAmount = salesOrder.getLineItemValue('links','total',i);
				nlapiLogExecution('DEBUG','Current Item Amount:',currItemAmount);
				if ( currItemAmount == 150 ) {
					returnFlag = true;
					break;
				}
			}
		}
	}

	return returnFlag;
}
