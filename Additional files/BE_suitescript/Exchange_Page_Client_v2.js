nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
		/*if(name=="custpage_pickup_at_be")
		{
			if(nlapiGetFieldValue("custpage_pickup_at_be")=="T")
			{
				nlapiSetFieldValue("custpage_addressee","Pick-up at BE");
				nlapiSetFieldValue("custpage_address_1","26 O'Farrell Street, Floor 10");
				nlapiSetFieldValue("custpage_address_2","");
				nlapiSetFieldValue("custpage_city","San Francisco");
				nlapiSetFieldValue("custpage_state","CA");
				nlapiSetFieldValue("custpage_zip","94108");
				nlapiSetFieldValue("custpage_country","US");
			}
		}*/
		
		if(name=="custpage_pickup_at_be" || name=="custpage_pickup_location")
		{
			if(nlapiGetFieldValue("custpage_pickup_at_be")=="T" && nlapiGetFieldValue("custpage_pickup_location")!=null && nlapiGetFieldValue("custpage_pickup_location")!="")
			{
								
			switch(nlapiGetFieldValue("custpage_pickup_location"))
			{
				case "1": //San Francisco
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","26 O'Farrell Street, Floor 10");
					nlapiSetFieldValue("custpage_city","San Francisco");
					nlapiSetFieldValue("custpage_state","CA");
					nlapiSetFieldValue("custpage_zip","94108");
					nlapiSetFieldValue("custpage_country","US");
					break;
				case "2": //Los Angeles
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","8787 Beverly Blvd., Ste 206");
					nlapiSetFieldValue("custpage_city","West Hollywood");
					nlapiSetFieldValue("custpage_state","CA");
					nlapiSetFieldValue("custpage_zip","90048");
					nlapiSetFieldValue("custpage_country","US");
					break;
				case "3": //Boston
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","38 Newbury St, Ste 603");
					nlapiSetFieldValue("custpage_city","Boston");
					nlapiSetFieldValue("custpage_state","MA");
					nlapiSetFieldValue("custpage_zip","02116");
					nlapiSetFieldValue("custpage_country","US");
					break;
				case "4": //Chicago
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","34 East Oak St, 2nd Fl");
					nlapiSetFieldValue("custpage_city","Chicago");
					nlapiSetFieldValue("custpage_state","IL");
					nlapiSetFieldValue("custpage_zip","60611");
					nlapiSetFieldValue("custpage_country","US");
					break;
				}
			}
		}
		
	}catch(e){}
}

function Exchange_Page_SR()
{
	try
	{
		if(nlapiGetFieldValue("custpage_date_received_at_be")!=null && nlapiGetFieldValue("custpage_date_received_at_be")!="" && (nlapiGetFieldValue("custpage_location_received_at_be")==null || nlapiGetFieldValue("custpage_location_received_at_be")==""))
		{
			alert("Please select Location Received at BE from Customer.");
			return false;
		}
		
		return true;
		
	}catch(e){ return true; }
}
