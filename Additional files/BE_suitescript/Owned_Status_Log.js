function Owned_Status_Log(type)
{
	var recordType = nlapiGetRecordType();
	nlapiLogExecution("debug","Record Type: " + recordType,"Event: " + type);
	
	if(type=="create")
	{
		if(recordType=="inventoryitem")
		{
			var item = nlapiGetNewRecord();
		
			if(item.getFieldValue("custitem20")=="7")
			{
				try
				{
					//Create owned status log upon initial item creation
					var log = nlapiCreateRecord("customrecord_owned_status_log");
					log.setFieldValue("custrecord_owned_status_log_item",nlapiGetRecordId());
					log.setFieldValue("custrecord_owned_status_log_memo_owned",item.getFieldValue("custitemmemovsowned"));
					log.setFieldValue("custrecord_owned_status_log_paid_not_pd",item.getFieldValue("custitempaidvsnotpaid"));
					log.setFieldValue("custrecord_owned_status_log_sold_not_sld",item.getFieldValue("custitemsoldvsnotsold"));
					log.setFieldValue("custrecord_owned_status_log_qoh","0");
					var logId = nlapiSubmitRecord(log,true,true);
				}
				catch(err)
				{
					nlapiLogExecution("error","Error Creating Owned Status Log (Create)","Item: " + nlapiGetRecordId() + "\n\n Details: " + err.message);
				}
			}
		}
		else if(recordType=="itemreceipt" || recordType=="itemfulfillment")
		{
			nlapiLogExecution("debug","In IR/IF function...");
			
			var recordType = nlapiGetRecordType();
		
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
			filters.push(new nlobjSearchFilter("custitem20","item","is","7"));
			filters.push(new nlobjSearchFilter("cogs",null,"is","F"));
			filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
			filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
			filters.push(new nlobjSearchFilter("type","createdfrom","noneof","TrnfrOrd")); //Exclude transfer orders
			var cols = [];
			cols.push(new nlobjSearchColumn("item"));
			cols.push(new nlobjSearchColumn("custitemmemovsowned","item"));
			cols.push(new nlobjSearchColumn("custitempaidvsnotpaid","item"));
			cols.push(new nlobjSearchColumn("custitemsoldvsnotsold","item"));
			var results = nlapiSearchRecord(recordType,null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					var log = nlapiCreateRecord("customrecord_owned_status_log");
					log.setFieldValue("custrecord_owned_status_log_item",results[x].getValue("item"));
					log.setFieldValue("custrecord_owned_status_log_memo_owned",results[x].getValue("custitemmemovsowned","item"));
					log.setFieldValue("custrecord_owned_status_log_paid_not_pd",results[x].getValue("custitempaidvsnotpaid","item"));
					log.setFieldValue("custrecord_owned_status_log_sold_not_sld",results[x].getValue("custitemsoldvsnotsold","item"));
					log.setFieldValue("custrecord_owned_status_log_qoh",checkOnHand(results[x].getValue("item")));
					var logId = nlapiSubmitRecord(log,true,true);
					
					nlapiLogExecution("debug","Finished creating custom log record...");
				}
			}
		}
	}
	else if((type=="edit" || type=="xedit") && recordType=="inventoryitem")
	{
		nlapiLogExecution("debug","In EDIT/XEDIT FUNCTION...");
		
		if(type=="edit")
			var item = nlapiGetNewRecord();
		else
			var item = nlapiLoadRecord("inventoryitem",nlapiGetRecordId());
		
		var oldItem = nlapiGetOldRecord();
		
		try
		{
			if(item.getFieldValue("custitem20")=="7")
			{
				if(type=="xedit")
				{
					nlapiLogExecution("debug","New Paid: " + item.getFieldValue("custitempaidvsnotpaid"),"Old Paid: " + oldItem.getFieldValue("custitempaidvsnotpaid"));
				}
				
				var update = false;
			
				if(item.getFieldValue("custitemmemovsowned")!=oldItem.getFieldValue("custitemmemovsowned"))
					update = true;
				if(item.getFieldValue("custitempaidvsnotpaid")!=oldItem.getFieldValue("custitempaidvsnotpaid"))
					update = true;
				if(item.getFieldValue("custitemsoldvsnotsold")!=oldItem.getFieldValue("custitemsoldvsnotsold"))
					update = true;
					
				if(update==true)
				{
					//Create owned status log upon initial item creation
					var log = nlapiCreateRecord("customrecord_owned_status_log");
					log.setFieldValue("custrecord_owned_status_log_item",nlapiGetRecordId());
					log.setFieldValue("custrecord_owned_status_log_memo_owned",item.getFieldValue("custitemmemovsowned"));
					log.setFieldValue("custrecord_owned_status_log_paid_not_pd",item.getFieldValue("custitempaidvsnotpaid"));
					log.setFieldValue("custrecord_owned_status_log_sold_not_sld",item.getFieldValue("custitemsoldvsnotsold"));
					log.setFieldValue("custrecord_owned_status_log_qoh",checkOnHand(nlapiGetRecordId()));
					var logId = nlapiSubmitRecord(log,true,true);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Owned Status Log (Create)","Item: " + nlapiGetRecordId() + "\n\n Details: " + err.message);
		}
	}
}

function checkOnHand(item)
{
	var qoh = 0;
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",item));
	var cols = [];
	cols.push(new nlobjSearchColumn("locationquantityonhand",null,"sum"));
	var results = nlapiSearchRecord("item",null,filters,cols);
	if(results)
	{
		if(results[0].getValue("locationquantityonhand",null,"sum")!=null && results[0].getValue("locationquantityonhand",null,"sum")!="")
			qoh = results[0].getValue("locationquantityonhand",null,"sum");
	}
	
	return qoh;
}
