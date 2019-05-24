nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetRepairResize()
{ 
    try
    {	
		var obj = nlapiLoadRecord('returnauthorization',nlapiGetRecordId());
		var count = obj.getLineItemCount('item');
		var match = 0;
		var itemObj = '';
		var itemCategory = 0;
		nlapiLogExecution("DEBUG","Total Item Count : "+ count); 

		for(var i = 1; i <= count; i++) 
		{
			var itemId = obj.getLineItemValue('item','item',i);
			var itemType = obj.getLineItemValue('item','itemtype',i);
			
			if( itemType == 'InvtPart')
			{				
				itemCategory = nlapiLookupField("inventoryitem",itemId,"custitem20");
				if(itemCategory == 1 || itemCategory==2 || itemCategory==3 || itemCategory==4 || itemCategory==5 || itemCategory==23 || itemCategory==30)
				{
				   match = match+1;                           
				}
			}
			else if(itemType == 'Assembly')
			{				
				itemCategory = nlapiLookupField("inventoryitem",itemId,"custitem20");
				if(itemCategory == 1 || itemCategory==2 || itemCategory==4 || itemCategory==5 || itemCategory==23 || itemCategory==30)
				{
				   match = match+1;                           
				}
			}                
		}   
		if(match==count)
		{
		  obj.setFieldValue('custbody142',''); 
		}
		else
		{
		  obj.setFieldValue('custbody142',15);
		}    
		var id = nlapiSubmitRecord(obj, true,true); 
		nlapiLogExecution("DEBUG","Updated Return authorization Id : "+ id);
		if(id > 0)
		{
			ReceiveAction(id,obj);
		}		
	}
	catch(err)
	{
		nlapiLogExecution("DEBUG","Error Occur during approve,receive and refund is : "+ err.message);
	}
}

function ReceiveAction(id,obj)
{	
	var receiptRecord = nlapiTransformRecord("returnauthorization",id,"itemreceipt");
	    receiptRecord.setFieldValue("customform",119);
		receiptRecord.setFieldValue("createdfrom",id);
		receiptRecord.setFieldValue("trandate",nlapiDateToString(new Date()));
		//receiptRecord.setFieldValue("entity",nlapiLookupField("returnauthorization",id,"entity"));
    //var obj = nlapiLoadRecord('returnauthorization',id);

	if(obj != null)
	{
		//count line item
		var count = obj.getLineItemCount('item');
		/*/*Logic added by Sandeep - Task -NS-653*/
		
		
		var filters=new Array();
		filters.push(new nlobjSearchFilter('createdfrom',null,'is',obj.getFieldValue('createdfrom')));
		filters.push(new nlobjSearchFilter('status',null,'anyOf','ItemShip:C'));
		filters.push(new nlobjSearchFilter('type','appliedtotransaction','anyOf','SalesOrd'));

		var cols=new Array();
		cols.push(new nlobjSearchColumn('item'));
		cols.push(new nlobjSearchColumn('location'));
		//cols.push(new nlobjSearchColumn('line'));
        var items=[];
       var itemfulfillment=nlapiSearchRecord('itemfulfillment',null,filters,cols);
		for(var i=0;i<itemfulfillment.length;i++)
		{
		 // var columns=itemfulfillment[0].getAllColumns();
		  var itemId=itemfulfillment[i].getValue('item');
		  var location=itemfulfillment[i].getValue('location');
		 // var lineid=itemfulfillment[i].getValue('line');
		  items.push(
			  {
				  id:itemId,
				  location:location			 
			  }
		  );
		}
		
		//nlapiLogExecution("DEBUG","Location Id : "+ inventoryLocationId);
		nlapiLogExecution("DEBUG","Total Item Count for Item Receipt : "+ count);
		if( count > 0)
		{
			for(var i=1; i<= count; i++) 
			{
                var itemId = obj.getLineItemValue('item','item',i);
				var line=obj.getLineItemValue('item','line',i);
                var itemType = obj.getLineItemValue('item','itemtype',i);			
				if( itemType == 'InvtPart')
				{					
					var itemCategory = nlapiLookupField("inventoryitem",itemId,"custitem20");				
					if(itemCategory ==1 || itemCategory==23 || itemCategory==30)
					{   						
						receiptRecord.setLineItemValue('item','location', i, 3);
						receiptRecord.setLineItemValue('item','restock', i, 'F');						
					}
					else
					{ 	
						/*Logic changed by Sandeep - Task -NS-653*/
						 var temp = items.filter(function(item) {
                            return (item.id==itemId);
                        });
						receiptRecord.setLineItemValue('item','location', i, temp[0].location);
						
						/*if(inventoryLocationId)
						{
							receiptRecord.setLineItemValue('item','location', i, inventoryLocationId);
						}
						else{
							receiptRecord.setLineItemValue('item','location', i, 2);
						}*/						
					
						receiptRecord.setLineItemValue('item','restock', i, 'T');						
					}				
				}
			}
			var receiptId = nlapiSubmitRecord(receiptRecord,true,true);
			if(receiptId > 0)
			{
				nlapiLogExecution("DEBUG","Created Item Receipt Id is : "+ receiptId);
				RefundAction(id);
			}		    
		}		
	}
}

function RefundAction(Id)
{
	var refundRecord = nlapiTransformRecord("returnauthorization",Id,"creditmemo");
	var salesrep = nlapiLookupField('returnauthorization',Id,'salesrep');
	if(salesrep != null && salesrep != '')
    {                      
        var invtLocation = nlapiLookupField("employee",salesrep,"location");                      
        refundRecord.setFieldValue("location",invtLocation);                      
    }
    else
    {                      
        refundRecord.setFieldValue("location",2);                      
    }	
	var refundId = nlapiSubmitRecord(refundRecord,true,true);
	if(refundId > 0)
	{
		nlapiLogExecution("DEBUG","Created Credit Memo Id is : "+ refundId);
                nlapiSubmitField("returnauthorization",Id,"custbody_credit_memo_link",refundId);				
	}
}
