nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Test_Picked(request,response)
{
	var fulfillment = nlapiTransformRecord("salesorder",nlapiGetContext().getSetting("SCRIPT","custscript_test_ff_order"),"itemfulfillment");
	
	//fulfillment.setFieldValue("shipstatus","B"); //Packed
	
	fulfillment.setFieldValue("generateintegratedshipperlabel","T");
	
	fulfillment.selectNewLineItem("packagefedex");
	fulfillment.setCurrentLineItemValue("packagefedex","packageweightfedex","2"); //Package Weight
	fulfillment.setCurrentLineItemValue("packagefedex","reference1fedex","Testing Reference Information Field..."); //Reference Information
	fulfillment.setCurrentLineItemValue("packagefedex","deliveryconffedex","5"); //Delivery Confirmation = Signature Required
	fulfillment.setCurrentLineItemValue("packagefedex","signatureoptionsfedex","1"); //FedEx Delivery Signature Options = Direct Signature
	fulfillment.commitLineItem("packagefedex");
	
	//fulfillment.setFieldValue("shipstatus","B"); //Picked
	
	nlapiSubmitRecord(fulfillment,true,true);
}
