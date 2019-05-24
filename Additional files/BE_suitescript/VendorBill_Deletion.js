nlapiLogExecution("audit","FLOStart",new Date().getTime());
// /app/common/scripting/script.nl?id=1170

function BillDeletion(type)
{
	//nlapiLogExecution('debug','type is : '+type, type);
	if(type=="delete")
	{
		try
		{						
			var billId = nlapiGetRecordId();
			var billDates = [];
			
			var billObj = nlapiLoadRecord('vendorbill',billId);	
			var Itemcount = billObj.getLineItemCount('item');
			for(var z=1; z<=Itemcount; z++)
			{		
				var itemid=billObj.getLineItemValue('item','item',z);
				var Category=nlapiLookupField('inventoryitem',itemid,'custitem20' );	
				nlapiLogExecution('debug','Inventoryitem Category is : '+Category, Category);
				if(Category=='7') //Loose Diamond
				{              
					var filters = [];
					filters[0] = nlobjSearchFilter("type","transaction","anyOf","VendBill");
					filters[1] = nlobjSearchFilter("internalid","null","anyOf",itemid);
					
					var cols = [];
					//cols[0] =  nlobjSearchColumn("internalid","transaction");
					//cols[1] =  nlobjSearchColumn("trandate","transaction");
					cols.push(new nlobjSearchColumn("internalid","transaction"));
					cols.push(new nlobjSearchColumn("trandate","transaction"));
					var searchRecord = nlapiSearchRecord("item",null,filters,cols);
					for(var i=0; i< searchRecord.length; i++)
					{
						var vendBillId = searchRecord[i].getValue(cols[0]);
						if(vendBillId != billId)
						{
							var billDate = searchRecord[i].getValue(cols[1]);
							var Dates = new Date(billDate);
							billDates.push(Dates);  
						}
					}
					//Get Max bill date
					if(billDates.length > 0)
					{
						var newbillDate=new Date(Math.max.apply(null,billDates));
						var date=formatDate(newbillDate);
						nlapiLogExecution('debug','New Bill Date is : '+date, date);
						nlapiSubmitField('inventoryitem',itemid, "custitem108", date);
					}
					else
					{
						nlapiLogExecution('debug','No New Bill Date found', "");
						nlapiSubmitField('inventoryitem',itemid, "custitem108", "") ;
					}
				}		
			} 
		}	
		catch(e)
		{
			 nlapiLogExecution('error','exception in BillDeletion is', e.message);
		}
	}	
}

function formatDate(newbillDate)
{
   return newbillDate.getMonth()+1 + "/" + newbillDate.getDate() + "/" + newbillDate.getFullYear();
}