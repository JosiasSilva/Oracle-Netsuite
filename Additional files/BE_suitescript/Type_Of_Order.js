nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setTypeOfOrder(type)
{
	if(type=="create")
	{
		try
		{
			var Place_Of_Sale = nlapiGetNewRecord().getFieldValue("class");
			var Order_Number = nlapiGetNewRecord().getFieldValue("tranid");
			
			if(Place_Of_Sale=="1")
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","1");
			else if(Order_Number.indexOf("SZ")!=-1 || Order_Number.indexOf("sz")!=-1)
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","2");
			else if(Order_Number.indexOf("RP")!=-1 || Order_Number.indexOf("rp")!=-1)
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","3");
			else if(Order_Number.indexOf("EX")!=-1 || Order_Number.indexOf("ex")!=-1)
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","4");
			else if(Order_Number.indexOf("UP")!=-1 || Order_Number.indexOf("up")!=-1)
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","10");
			else if(Order_Number.indexOf("WB")!=-1 || Order_Number.indexOf("wb")!=-1)
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","5");
			else if(/^\d+$/.test(Order_Number))
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","1"); //If no string values, set to New Order
			/*
			else if(Order_Number.length==9 || Order_Number.length==10)
				nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody87","1");
			*/
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Order Type","Details: " + err.message);
			return true;
		}
	}
}
