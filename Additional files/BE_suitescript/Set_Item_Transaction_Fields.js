nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_Item_Transaction_Fields()
{
	var filters = [];
	filters.push(new nlobjSearchFilter("datecreated",null,"on","today"));
	//filters.push(new nlobjSearchFilter("item",null,"is","2035416"));
	filters.push(new nlobjSearchFilter("custitem20","item","is","24"));
	filters.push(new nlobjSearchFilter("type",null,"anyof",["CustCred","CustInvc","ItemShip","PurchOrd","SalesOrd","VendAuth","VendBill","VendCred","ItemRcpt"]));
	
	var cols = [];
	cols.push(new nlobjSearchColumn("item",null,"group"));
	
	var results = nlapiSearchRecord("transaction",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			var item = results[x].getValue("item",null,"group");
			nlapiLogExecution("debug","Item",item);
			
			var fields = [];
			fields[0] = "custitem107"; //Purchase Order
			fields[1] = "custitem108"; //Vendor Bill
			fields[2] = "custitem109"; //Item Receipt
			fields[3] = "custitem110"; //Vendor Return
			fields[4] = "custitem111"; //Invoice
			fields[5] = "custitem112"; //Sales Order
			fields[6] = "custitem113"; //Bill Credit
			fields[7] = "custitem114"; //Credit Memo
			fields[8] = "custitem115"; //Item Fulfillment
			
			var data = [];
			data[0] = "";
			data[1] = "";
			data[2] = "";
			data[3] = "";
			data[4] = "";
			data[5] = "";
			data[6] = "";
			data[7] = "";
			data[8] = "";
			
			var filters1 = [];
			filters1.push(new nlobjSearchFilter("item",null,"is",item));
			filters1.push(new nlobjSearchFilter("type",null,"anyof",["CustCred","CustInvc","ItemShip","PurchOrd","SalesOrd","VendAuth","VendBill","VendCred","ItemRcpt"]));
			
			var cols1 = [];
			cols1.push(new nlobjSearchColumn("trandate"));
			cols1.push(new nlobjSearchColumn("type"));
			
			var results1 = nlapiSearchRecord("transaction",null,filters1,cols1);
			if(results1)
			{
				for(var i=0; i < results1.length; i++)
				{
					switch(results1[i].getRecordType())
					{
						case "purchaseorder":
							data[0] = results1[i].getValue("trandate");
							break;
						case "vendorbill":
							data[1] = results1[i].getValue("trandate");
							break;
						case "itemreceipt":
							data[2] = results1[i].getValue("trandate");
							break;
						case "vendorreturnauthorization":
							data[3] = results1[i].getValue("trandate");
							break;
						case "invoice":
							data[4] = results1[i].getValue("trandate");
							break;
						case "salesorder":
							data[5] = results1[i].getValue("trandate");
							break;
						case "vendorcredit":
							data[6] = results1[i].getValue("trandate");
							break;
						case "creditmemo":
							data[7] = results1[i].getValue("trandate");
							break;
						case "itemfulfillment":
							data[8] = results1[i].getValue("trandate");
							break;
					}
				}
			}
			
			nlapiLogExecution("debug","Fields",JSON.stringify(fields));
			nlapiLogExecution("debug","Data",JSON.stringify(data));
			
			nlapiSubmitField("inventoryitem",item,fields,data);
		}
	}
}
