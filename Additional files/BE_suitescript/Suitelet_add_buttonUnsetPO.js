function UnsetPO(request,response)
{   
    try
    {
        var diamondItemId = 0;
	var rId = request.getParameter("record");
        nlapiLogExecution("debug","Return Auth Id is :",rId);
        var objRetAuth = nlapiLoadRecord("returnauthorization",rId);
	var returnAuthNo = objRetAuth.getFieldValue("initialtranid");
        for(var i=1; i <= objRetAuth.getLineItemCount('item'); i++)
		{			
			var retItemType = objRetAuth.getLineItemValue('item','itemtype',i);
			if(retItemType == "InvtPart")
			{
				var retItemId = objRetAuth.getLineItemValue('item','item',i);
				var retItemCategory = nlapiLookupField('inventoryitem',retItemId,'custitem20');
				if(retItemCategory == 7) //Loose Diamond
				{
					diamondItemId = retItemId;
					break;
				}
			}
		}
        var createdFromId = nlapiLookupField('returnauthorization',rId,'createdfrom');
         nlapiLogExecution("debug","Created from Id is :",createdFromId);   
		var createdFrom = nlapiLookupField('returnauthorization',rId,'createdfrom',true); 
                nlapiLogExecution("debug","Created from value is :",createdFrom);   
		if( createdFromId != '' && createdFromId != null)
		{ 
			if(createdFrom.indexOf("Sales Order") != -1)
			{	
				var objSO = nlapiLoadRecord('salesorder',createdFromId);
				var soItemCount = objSO.getLineItemCount('item');
							
							nlapiLogExecution("debug","item count is :",soItemCount);   
				var count = 0;            
				for(var i = 1; i <= soItemCount; i++)
				{
					var itemId = objSO.getLineItemValue('item','item',i);
									nlapiLogExecution("debug","Item Id is :",itemId);
					var itemType = objSO.getLineItemValue('item','itemtype',i);
					if( itemType == 'InvtPart')
					{               
						var poVendor = objSO.getLineItemValue('item','povendor',i);
						var poVendorName = objSO.getLineItemValue('item','povendor_display',i);
						var poId = objSO.getLineItemValue('item','createdpo',i);
						if( poId != null && poId != '')
						{
							var tranno=nlapiLookupField("purchaseorder",poId,"transactionnumber");				
							nlapiLogExecution("debug","Item type is :",itemType);
							var itemCategory = nlapiLookupField('inventoryitem',itemId,'custitem20');
							nlapiLogExecution("debug","itemCategory is :"+itemCategory);											    
							if(itemCategory == 2) // Setting with Large Center Stone
							{
								count = count + 1;
								nlapiLogExecution("debug","itemCategory is :",itemCategory);                                             
								var desc = objSO.getLineItemValue('item','description',i);						
								var comment = objSO.getLineItemValue('item','custcol5',i);
								var insuranceVal = objSO.getLineItemValue('item','custcol_full_insurance_value',i); 	        
								UpdateNewPurchaseOrder(response,itemId,poVendor,desc,comment,insuranceVal,rId,returnAuthNo,diamondItemId,tranno); // Update new purchase order		
							} 
						}
						else
						{								
							nlapiLogExecution("debug","Purchase Order of the related Inventory Item does not exist");
						}					
					}                                
				}//End for loop
				if(count == 0)
				{
					response.sendRedirect("RECORD","returnauthorization",rId);
				}
			}
		} 
		else
		{
			response.sendRedirect("RECORD","returnauthorization",rId);
		}            
	}
        catch(err)
        {
                nlapiLogExecution("debug","Error occur during execution of the script is : ",err.message);
		response.sendRedirect("RECORD","returnauthorization",rId);
        }      
} 

function UpdateNewPurchaseOrder(response,itemId,poVendor,desc,comment,insuranceVal,rId,returnAuthNo,diamondItemId,tranNo)
{
	var PO_id = 0;	
	var currentDateTime = new Date(); //today date
	var extendDate = new Date();
	var day = currentDateTime.getDay();
	//var notes = "Please unset center DIA & return loose setting & DIA back to SF.";
        var notes = "Please unset center DIA & return loose setting & DIA back to SF.\n\n"+"Reference PO:"+tranNo;
	if(comment !=null && comment != "")
	{		
		desc = desc +"\n\n"+comment;
		if(desc.indexOf("Arriving from") != -1)
		{			
			desc = desc.substring(0,desc.indexOf("Arriving from"));
		}
	}
		
	var repairRingId = 0;	
	var filters = [];
	filters.push(new nlobjSearchFilter('itemid',null,'is','Repair Ring'));
	filters.push(new nlobjSearchFilter('displayname',null,'is','.'));
	var cols = [];
	cols.push(new nlobjSearchColumn('internalid'));//no repair needed
	var results =  nlapiSearchRecord('inventoryitem', null, filters, cols);
	if(results!=null)
	{
		repairRingId = results[0].getValue('internalid');
		nlapiLogExecution('DEBUG','Repair Ring ID:',repairRingId);
	}
	
	if(day == 0)
	{       
		extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 4));  
	}
	else if(day == 1 || day == 2)
	{ 
		extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 3));  
	}
	else if(day > 2 && day <= 5)
	{ 
		extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 6));  
	}
	else if(day == 6)
	{
		extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 5));  
	}
	   
    var purchase_order = nlapiCreateRecord('purchaseorder');//create PO 
	purchase_order.setFieldValue('entity',poVendor);
	purchase_order.setFieldValue('customform',107);    
	purchase_order.setFieldValue('trandate',nlapiDateToString(new Date())); 
	purchase_order.setFieldValue('custbody59',extendDate);
        purchase_order.setFieldValue('custbody58',returnAuthNo);
        purchase_order.setFieldValue('custbody_returnauth_ref',rId); //new added
	
	purchase_order.setLineItemValue('item','item',1,repairRingId);//add Repair Ring to SO 
	purchase_order.setLineItemValue('item','amount',1,0);//set unit price 0
	purchase_order.setLineItemValue('item','custcol5',1,notes);//set comments(notes)
	purchase_order.setLineItemValue('item','description',1,desc);//set description
	purchase_order.setLineItemValue("item","custcol_full_insurance_value",1,insuranceVal); //full insurance value
	purchase_order.setLineItemValue("item","custcol18",1,nlapiDateToString(nlapiAddDays(currentDateTime, 0))); //date sent from SF
        if(diamondItemId != 0)
	{
		purchase_order.setLineItemValue("item","custcolitem_link",1,diamondItemId); //item link
	}
    
    try{
        PO_id = nlapiSubmitRecord(purchase_order, true);
        nlapiLogExecution('DEBUG', 'submitted po id ', PO_id);		
		alert("Purchase Order  has been created. Created PO Id is :"+PO_id);
		nlapiSubmitField("returnauthorization",rId,["custbody_unset_po","custbodyunsetgemeta","custbody268"],[PO_id,extendDate,extendDate]);
		alert("Unset PO field on return auth has been updated.");		
		alert("Unset Gem Eta field on return auth has been updated.");
		nlapiLogExecution("debug","Updated Return Auth Id is : ",rId);
		response.sendRedirect("RECORD","purchaseorder",PO_id);
    }catch(e){
		
                nlapiLogExecution('DEBUG',e.getCode(),e.getDetails());
		response.sendRedirect("RECORD","purchaseorder",PO_id);
    }	
}



