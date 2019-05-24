nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateEngravingStatus(type,form)
{
	if(type=='view')
	{
		try
		{
			var PO_Id	= nlapiGetRecordId();
			var SO_Id   = nlapiLookupField('purchaseorder',PO_Id,'createdfrom');
			
			if(SO_Id)
				var engravingstatus = nlapiLookupField('salesorder',SO_Id,'custbody348');
			
			if(engravingstatus)
			{
				nlapiSubmitField('purchaseorder',PO_Id,'custbody348',engravingstatus,false);
				nlapiLogExecution('debug','below submit');
			}
			else 
			{
				nlapiSubmitField('purchaseorder',PO_Id,'custbody348','',false);
				nlapiLogExecution('debug','else condition');
			}
		}
		catch(ee)
		{
			nlapiLogExecution('error','Error',ee.message);
		}
	}
}