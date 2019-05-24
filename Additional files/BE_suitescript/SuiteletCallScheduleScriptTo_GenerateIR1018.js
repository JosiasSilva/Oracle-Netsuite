// Call Schedule script 
function CreateItemReceipt()
{
	try
	{
            nlapiLogExecution("debug","Start to create Item Receipt","Ajay");
	    var context = nlapiGetContext();
	    var searchId = nlapiGetContext().getSetting('SCRIPT','custscript_savedsearch_id3');
            nlapiLogExecution("debug","Saved Search Id is :",searchId);
            if(searchId == null || searchId == "")
                        return;
	    //var searchresults = nlapiSearchRecord('purchaseorder', 4453);
	    var searchresults = nlapiSearchRecord('purchaseorder', searchId);
	    if ( searchresults == null )
			return;

	     var reschedulePoint = nlapiGetContext().getSetting('SCRIPT','custscript_reschedule_point3');
	     reschedulePoint = (reschedulePoint!=null && reschedulePoint!=undefined) ? parseInt(reschedulePoint) : 0;
	     nlapiLogExecution("debug","Reschedule Point is :",reschedulePoint);

	    for ( var i = reschedulePoint; i < searchresults.length; i++ )
	    {
		    CreateItemReceiptOfPO(searchresults[i].getId(),i);
		    if ( context.getRemainingUsage() <= 0 && (i+1) < searchresults.length )
		    {
                                var params = new Array();
                                params['custscript_reschedule_point3'] = i;
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(),params);
				if ( status == 'QUEUED' )
				{
                                        nlapiLogExecution("debug","scheduled script status is :",status);					
					break;
				}					     
			}
		}
                reschedulePoint = 0;
	}
	catch(err)
	{
		nlapiLogExecution("error","Generate Item Receipt POST Error","Details: " + err.message);
	}
}

function CreateItemReceiptOfPO(Id,i)
{
	try
	{		
		var poFields = ["custbody_receive_po","custbody_create_ir","status"];
		var poFieldsVal = nlapiLookupField("purchaseorder",Id,poFields);
		var receive_po = poFieldsVal.custbody_receive_po;
		var create_ir = poFieldsVal.custbody_create_ir;
		var poStatus = poFieldsVal.status;
		nlapiLogExecution("debug","Receive PO value is : ",receive_po);
		nlapiLogExecution("debug","Create IR value is : ",create_ir);
                nlapiLogExecution("debug","Record count is : ",i);
		nlapiLogExecution("debug","PO Status value is : ",poStatus);

		if(receive_po == 'T' && (poStatus != 'pendingBilling' || poStatus != 'fullyBilled'))
		{
			var receipt = nlapiTransformRecord("purchaseorder",Id,"itemreceipt");
			for(var x=0; x < receipt.getLineItemCount("item"); x++)
			{
				receipt.setLineItemValue("item","itemreceive",x+1,"T");
			}
			var irId = nlapiSubmitRecord(receipt,true,true);
                       
			if(irId > 0)
		        {
				//nlapiSubmitField("purchaseorder",Id,"custbody_create_ir",'T');
				nlapiLogExecution("debug","Created Item Receipt Id is : ", irId);
                                nlapiLogExecution("debug","Created Item Receipt count is : ", i);
		        }
		}				
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error occur during generation of an Item Receipt of PO id : " + Id + " is : ",ex.message);
	}
}