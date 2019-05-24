function Set_QA_Vendor(type)
{
	if (type == "create" || type == "edit") {
		try {
			//Get QA Record Internal ID
			var internalid = nlapiGetRecordId()
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred getting QA record internal ID. Details: " + err.message)
			return
		}
		
		try {
			//Get QA Fields
			var filter = new nlobjSearchFilter("internalid", null, "is", internalid)
			var cols = new Array()
			cols.push(new nlobjSearchColumn("custrecord3")) //Sales Order
			cols.push(new nlobjSearchColumn("custrecord_item"))
			cols.push(new nlobjSearchColumn("custrecord_qa_vendor"))
			var results = nlapiSearchRecord("customrecord32", null, filter, cols)
			if (results != null) {
				var sales_order_id = results[0].getValue("custrecord3")
				var item_id = results[0].getValue("custrecord_item")
				var qa_vendor = results[0].getValue("custrecord_qa_vendor")
				
				//Exit if sales order or item fields are empty
				//Exit if QA vendor field is already present
				if (IsEmpty(sales_order_id) == "" || IsEmpty(item_id) == "" || IsEmpty(qa_vendor) != "") 
					return
			}
			else {
				//If QA record is not found then exit the script
				return
			}
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while retrieving QA field values for QA record internal ID " + internalid + ". Details: " + err.message)
			return
		}
		
		try {
			//Find item vendor on sales order line item
			var filters = new Array()
			filters.push(new nlobjSearchFilter("internalid", null, "is", sales_order_id))
			filters.push(new nlobjSearchFilter("item", null, "is", item_id))
			filters.push(new nlobjSearchFilter("mainname", "purchaseorder", "noneof", "@NONE@"))
			var column = new nlobjSearchColumn("mainname", "purchaseorder")
			var results = nlapiSearchRecord("transaction", null, filters, column)
			if (results != null) {
				var vendor_id = results[0].getValue("mainname", "purchaseorder")
			}
			else {
				//If nothing is found then exit the script as there is no PO vendor to set
				return
			}
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while retrieving QA record item vendor on sales order internal ID " + sales_order_id + ". Details: " + err.message)
			return
		}
		
		try {
			//Update the QA record with vendor information
			var qaRecord = nlapiLoadRecord("customrecord32", internalid)
			qaRecord.setFieldValue("custrecord_qa_vendor", vendor_id)
			nlapiSubmitRecord(qaRecord, false, true)
		} 
		catch (err) {
			nlapiLogExecution("erorr", "QA Vendor Set Error", "An error occurred while setting item vendor on QA record internal ID " + internalid + ". Details: " + err.message)
			return
		}
	}
}

function IsEmpty(value)
{
	if(value==null)
		return ""
	else
		return value
}
