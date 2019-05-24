function Update_weightinlb(type)
{
	if(type == 'create' || type == 'edit')
	{
		var count = nlapiGetLineItemCount('item') ;
		for(var x=1; x<=count; x++)
		{
			nlapiSetLineItemValue('item', 'weightinlb', x, 0);	
		}
		nlapiLogExecution('debug','SO ID is #'+nlapiGetRecordId());
	}
}