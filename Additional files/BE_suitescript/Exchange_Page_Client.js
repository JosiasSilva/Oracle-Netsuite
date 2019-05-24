function Exchange_Page_FC(type,name,linenum)
{
	try
	{
		if(type=="custpage_new_items" && name=="custpage_new_items_item")
		{
			var itemdata = nlapiLookupField("item",nlapiGetCurrentLineItemValue("custpage_new_items","custpage_new_items_item"),["description","baseprice"]);
			nlapiSetCurrentLineItemValue("custpage_new_items","custpage_new_items_desc",itemdata.description);
			nlapiSetCurrentLineItemValue("custpage_new_items","custpage_new_items_qty",1);
			nlapiSetCurrentLineItemValue("custpage_new_items","custpage_new_items_rate",itemdata.baseprice);
			nlapiSetCurrentLineItemValue("custpage_new_items","custpage_new_items_amount",itemdata.baseprice);
		}
		if(type=="custpage_new_items" && (name=="custpage_new_items_qty" || name=="custpage_new_items_rate"))
		{
			var quantity = parseFloat(nlapiGetCurrentLineItemValue("custpage_new_items","custpage_new_items_qty"));
			var rate = parseFloat(nlapiGetCurrentLineItemValue("custpage_new_items","custpage_new_items_rate"));
			var amount = quantity * rate;
			
			nlapiSetCurrentLineItemValue("custpage_new_items","custpage_new_items_amount",nlapiFormatCurrency(amount));
		}
	}catch(e){}
}
