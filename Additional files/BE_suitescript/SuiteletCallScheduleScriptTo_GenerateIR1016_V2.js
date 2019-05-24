nlapiLogExecution("audit","FLOStart",new Date().getTime());
// Call Schedule script 
function CreateItemReceipt()
{
	try
	{
            nlapiLogExecution("debug","Start to create Item Receipt","Ajay");
	    var context = nlapiGetContext();
	    var searchId = nlapiGetContext().getSetting('SCRIPT','custscript_savedsearch_id1');
            nlapiLogExecution("debug","Saved Search Id is :",searchId);
            if(searchId == null || searchId == "")
                        return;
	   
	    var searchresults = nlapiSearchRecord('purchaseorder', searchId);
	    if ( searchresults == null )
			return;

	     var reschedulePoint = nlapiGetContext().getSetting('SCRIPT','custscript_reschedule_point1');
	     reschedulePoint = (reschedulePoint!=null && reschedulePoint!=undefined) ? parseInt(reschedulePoint) : 0;
	     nlapiLogExecution("debug","Reschedule Point is :",reschedulePoint);

	    for ( var i = reschedulePoint; i < searchresults.length; i++ )
	    {
		    CreateItemReceiptOfPO(searchresults[i].getId(),i);
		    if ( context.getRemainingUsage() <= 0 && (i+1) < searchresults.length )
		    {
                                var params = new Array();
                                params['custscript_reschedule_point1'] = i;
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
		var poFields = ["custbody_receive_po","custbody_create_ir","status","entity","custbody39"];
		var poFieldsVal = nlapiLookupField("purchaseorder",Id,poFields);
		var receive_po = poFieldsVal.custbody_receive_po;
		var create_ir = poFieldsVal.custbody_create_ir;
		// Added By Rahul Panchal on dated 28/7/2017 as per NS-796
		var date_sent=poFieldsVal.custbody39;
		var ven_inv_loc='';
		if(date_sent!='')
		{
			var vendorId=poFieldsVal.entity;
			ven_inv_loc=nlapiLookupField("vendor",vendorId,"custentity138");
		}
		else
		{
			ven_inv_loc=2;
		}
		// Ended By Rahul Panchal
		var poStatus = poFieldsVal.status;
		nlapiLogExecution("debug","Receive PO value is : ",receive_po);
		nlapiLogExecution("debug","Create IR value is : ",create_ir);
                nlapiLogExecution("debug","Record count is : ",i);
                nlapiLogExecution("debug","PO Status is : ",poStatus);

		if(receive_po == 'T' && (poStatus != 'pendingBilling' || poStatus != 'fullyBilled'))
		{
			var receipt = nlapiTransformRecord("purchaseorder",Id,"itemreceipt");
			for(var x=0; x < receipt.getLineItemCount("item"); x++)
			{
				receipt.setLineItemValue("item","itemreceive",x+1,"T");
				receipt.setLineItemValue("item","location",x+1,ven_inv_loc);
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
