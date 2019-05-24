nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateLPPFields(rec_type,rec_id)
{
	try
	{
		var parentItem = rec_id;
		var itemrec = nlapiLoadRecord(rec_type,rec_id);
		
		//Last Purchase Price 18KW (no CAD)
		var filters = new Array();
		filters.push(new nlobjSearchFilter("parent",null,"is",parentItem));
		filters.push(new nlobjSearchFilter("custitem1",null,"anyof","1")); //18KW
		filters.push(new nlobjSearchFilter("type","transaction","is","PurchOrd"));
		filters.push(new nlobjSearchFilter("status","transaction","anyof","PurchOrd:G"));
		filters.push(new nlobjSearchFilter("custcol10","transaction","isempty"));
		
		var cols = new Array();
		cols.push(new nlobjSearchColumn("trandate","transaction"));
		cols.push(new nlobjSearchColumn("internalid","transaction"));
		cols.push(new nlobjSearchColumn("rate","transaction"));
		cols[0].setSort(true);
		
		var results = nlapiSearchRecord("item",null,filters,cols);
		if(results!=null)
		{
			nlapiLogExecution("debug","Rate",results[0].getValue("rate","transaction"))
			itemrec.setFieldValue("custitem_last_purch_price_18kw_nocad",results[0].getValue("rate","transaction"));
		}
		else			
		{
			nlapiLogExecution("debug","No results found...")
		}
		
		//Last Purchase Price PT (no CAD)
		var filters = new Array();
		filters.push(new nlobjSearchFilter("parent",null,"is",parentItem));
		filters.push(new nlobjSearchFilter("custitem1",null,"anyof","3")); //PT
		filters.push(new nlobjSearchFilter("type","transaction","is","PurchOrd"));
		filters.push(new nlobjSearchFilter("status","transaction","anyof","PurchOrd:G"));
		filters.push(new nlobjSearchFilter("custcol10","transaction","isempty"));
		
		var cols = new Array();
		cols.push(new nlobjSearchColumn("trandate","transaction"));
		cols.push(new nlobjSearchColumn("internalid","transaction"));
		cols.push(new nlobjSearchColumn("rate","transaction"));
		cols[0].setSort(true);
		
		var results = nlapiSearchRecord("item",null,filters,cols);
		if(results!=null)
		{
			nlapiLogExecution("debug","Rate",results[0].getValue("rate","transaction"))
			itemrec.setFieldValue("custitem_last_purch_price_pt_nocad",results[0].getValue("rate","transaction"));
		}
		else			
		{
			nlapiLogExecution("debug","No results found...")
		}
		
		//Last Purchase Price 18KW (CAD)
		var filters = new Array();
		filters.push(new nlobjSearchFilter("parent",null,"is",parentItem));
		filters.push(new nlobjSearchFilter("custitem1",null,"anyof","1")); //18KW
		filters.push(new nlobjSearchFilter("type","transaction","is","PurchOrd"));
		filters.push(new nlobjSearchFilter("status","transaction","anyof","PurchOrd:G"));
		filters.push(new nlobjSearchFilter("custcol10","transaction","isnotempty"));
		
		var cols = new Array();
		cols.push(new nlobjSearchColumn("trandate","transaction"));
		cols.push(new nlobjSearchColumn("internalid","transaction"));
		cols.push(new nlobjSearchColumn("rate","transaction"));
		cols[0].setSort(true);
		
		var results = nlapiSearchRecord("item",null,filters,cols);
		if(results!=null)
		{
			nlapiLogExecution("debug","Rate",results[0].getValue("rate","transaction"))
			itemrec.setFieldValue("custitem_last_purch_price_18kw_cad",results[0].getValue("rate","transaction"));
		}
		else			
		{
			nlapiLogExecution("debug","No results found...")
		}
		
		//Last Purchase Price PT (CAD)
		var filters = new Array();
		filters.push(new nlobjSearchFilter("parent",null,"is",parentItem));
		filters.push(new nlobjSearchFilter("custitem1",null,"anyof","3")); //PT
		filters.push(new nlobjSearchFilter("type","transaction","is","PurchOrd"));
		filters.push(new nlobjSearchFilter("status","transaction","anyof","PurchOrd:G"));
		filters.push(new nlobjSearchFilter("custcol10","transaction","isnotempty"));
		
		var cols = new Array();
		cols.push(new nlobjSearchColumn("trandate","transaction"));
		cols.push(new nlobjSearchColumn("internalid","transaction"));
		cols.push(new nlobjSearchColumn("rate","transaction"));
		cols[0].setSort(true);
		
		var results = nlapiSearchRecord("item",null,filters,cols);
		if(results!=null)
		{
			nlapiLogExecution("debug","Rate",results[0].getValue("rate","transaction"))
			itemrec.setFieldValue("custitem_last_purch_price_pt_cad",results[0].getValue("rate","transaction"));
		}
		else			
		{
			nlapiLogExecution("debug","No results found...")
		}
		
		//Average Purchase Price 18KW (over previous 6 months)
		var filters = new Array();
		filters.push(new nlobjSearchFilter("parent","item","is",parentItem));
		filters.push(new nlobjSearchFilter("custitem1","item","anyof","1")); //18KW
		filters.push(new nlobjSearchFilter("status",null,"anyof","PurchOrd:G"));
		filters.push(new nlobjSearchFilter("trandate",null,"onorafter","monthsago06")); //Six months ago+
		
		var cols = new Array();
		cols.push(new nlobjSearchColumn("rate",null,"avg"));
		
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
		if(results!=null)
		{
			nlapiLogExecution("debug","Rate",results[0].getValue("rate",null,"avg"))
			itemrec.setFieldValue("custitem_avg_purch_price_18kw",results[0].getValue("rate",null,"avg"));
		}
		else			
		{
			nlapiLogExecution("debug","No results found...")
		}
		
		//Average Purchase Price PT (over previous 6 months)
		var filters = new Array();
		filters.push(new nlobjSearchFilter("parent","item","is",parentItem));
		filters.push(new nlobjSearchFilter("custitem1","item","anyof","3")); //PT
		filters.push(new nlobjSearchFilter("status",null,"anyof","PurchOrd:G"));
		filters.push(new nlobjSearchFilter("trandate",null,"onorafter","monthsago06")); //Six months ago+
		
		var cols = new Array();
		cols.push(new nlobjSearchColumn("rate",null,"avg"));
		
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
		if(results!=null)
		{
			nlapiLogExecution("debug","Rate",results[0].getValue("rate",null,"avg"))
			itemrec.setFieldValue("custitem_avg_purch_price_pt",results[0].getValue("rate",null,"avg"));
		}
		else			
		{
			nlapiLogExecution("debug","No results found...")
		}
		
		nlapiSubmitRecord(itemrec,false,true);	
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Setting Last Purchase Price Fields","Error setting last purchase price fields on item record Internal ID " + nlapiGetRecordId() + ". Details: " + err.message);
		return true;
	}
}
