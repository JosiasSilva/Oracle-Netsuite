// Call Schedule script 
function CreateItemReceipt()
{
	try
	{
        nlapiLogExecution("debug","Start to create Item Receipt","Ajay");	    
		var searchId = nlapiGetContext().getSetting('SCRIPT','custscript_savedsearch_id');
        nlapiLogExecution("debug","Saved Search Id is :",searchId);
        if(searchId == null || searchId == "")
				return;
	    
	    var searchresults = nlapiSearchRecord('purchaseorder', searchId);
	    if ( searchresults == null )
				return;
	    
	    nlapiLogExecution("debug","Total Records length is :",searchresults.length);

	    for ( var i = 0; i < searchresults.length; i++ )
	    {
		    CreateItemReceiptOfPO(searchresults[i].getId()); //Call function to generate Item Receipt of PO
			
			//Rescheduling concept
		    if (nlapiGetContext().getRemainingUsage() <= 500)
			{
				nlapiLogExecution('debug', 'Get Remaining Usage records are : ', nlapiGetContext().getRemainingUsage());
				var stateMain = nlapiYieldScript(); 
				if( stateMain.status == 'FAILURE')
				{ 
					nlapiLogExecution("debug","Failed to yield script, exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size); 
					throw "Failed to yield script"; 
				} 
				else if ( stateMain.status == 'RESUME' )
				{ 
					nlapiLogExecution("debug", "Resuming script because of " + stateMain.reason+". Size = "+ stateMain.size); 
				} 
			}//ended remaining usage
		}               
	}
	catch(err)
	{
		nlapiLogExecution("error","Generate Item Receipt POST Error","Details: " + err.message);
	}
}

function CreateItemReceiptOfPO(Id)
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
                nlapiLogExecution("debug","Po Status value is : ",poStatus);
               
		if(receive_po == 'T' && (poStatus == 'pendingBilling' || poStatus == 'fullyBilled'))
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
		    }
		}				
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error occur during generation of an Item Receipt of PO id : " + Id + " is : ",ex.message);
	}
}