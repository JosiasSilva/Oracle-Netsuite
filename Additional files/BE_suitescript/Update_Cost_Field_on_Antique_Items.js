nlapiLogExecution("audit","FLOStart",new Date().getTime());
// /app/common/scripting/script.nl?id=1908
//var t = Update_Cost_Field_on_Antique_Items();
//var k =0;
function Update_Cost_Field_on_Antique_Items()
{
	try
	{		
		var col = [];
		col.push(new nlobjSearchColumn('custitem20',null));
		col.push(new nlobjSearchColumn('internalid',null).setSort(true));		
		col.push(new nlobjSearchColumn('custitem142', null));
		col.push(new nlobjSearchColumn('custitem144', null));
		col.push(new nlobjSearchColumn('custitem146', null));
		col.push(new nlobjSearchColumn('cost', null));
		col.push(new nlobjSearchColumn('lastpurchaseprice', null));
		var fil = [['custitem20', 'is', '24'], 'and', [['cost', 'noneof', '@NONE@'], 'or', ['lastpurchaseprice', 'noneof', '@NONE@']] ,'and', [['custitem142', 'noneof', '@NONE@'], 'or', ['custitem144', 'noneof', '@NONE@'], 'or', ['custitem146', 'noneof', '@NONE@']] ];
		var SavedSearch = nlapiCreateSearch('inventoryitem',fil,col);
		var RunSavedSearch = SavedSearch.runSearch();
		var Result= 0;
		var index = 0;
		do
		{
			Result= RunSavedSearch.getResults(index, index + 1000);
			for(var x=0; x < Result.length; x++)
			{
				RescheduleScript();
				var ItemId = Result[x].getId();
				//if(ItemId == '1577902' || ItemId == '2201736' || ItemId == '4194308'  || ItemId == '1269795' )
				{
					var cost = 0;
					var PurchasePrice = Result[x].getValue('cost');
					var LastPurchasePrice = Result[x].getValue('lastpurchaseprice');
					if(PurchasePrice != null && PurchasePrice != '' && parseFloat(PurchasePrice) > 0)
					{
						cost = parseFloat(PurchasePrice);
					}
					else if(LastPurchasePrice != null && LastPurchasePrice != '' && parseFloat(LastPurchasePrice) > 0)
					{
						cost = parseFloat(LastPurchasePrice);
					}
					if(cost > 0)
					{
						var PO = [];
						if(Result[x].getValue('custitem142'))
						{
							PO.push(Result[x].getValue('custitem142'));
						}
						if(Result[x].getValue('custitem144'))
						{
							PO.push(Result[x].getValue('custitem144'));
						}
						if(Result[x].getValue('custitem146'))
						{
							PO.push(Result[x].getValue('custitem146'));
						}
						UpdateField(cost,ItemId,PO);					
					}
				}
			}
			index = index + 1000;			
		}
		while (Result.length == 1000)
		
		//nlapiLogExecution('debug','Script Runing Completed '+Data.length,JSON.stringify(Data));		
	}
	catch(ex)
	{
		nlapiLogExecution('error','Error in Script',ex.message);
	}
}
//var s = UpdateField(15,5195818,14706285);
//var t =0;
function UpdateField(cost,ItemId,PO)
{
	try
	{
		var filter = [];
		var column = [];
		filter.push(new nlobjSearchFilter('mainline', null, 'is', 'F'));
		filter.push(new nlobjSearchFilter('internalid', null, 'anyof', PO));
		//filter.push(new nlobjSearchFilter('status', null, 'noneof', 'PurchOrd:G'));
		//filter.push(new nlobjSearchFilter('internalid', 'item', 'is', ItemId));
      filter.push(new nlobjSearchFilter('custcolitem_link', null, 'anyof', ItemId));
		//filter.push(new nlobjSearchFilter('rate', null, 'greaterthan', '0'));
		filter.push(new nlobjSearchFilter('quantitybilled', null, 'greaterthan', '0'));
		column.push(new nlobjSearchColumn('rate',null,'group'));
		var PO_Result = nlapiSearchRecord('purchaseorder',null,filter,column);
		if(PO_Result != null && PO_Result != '' && PO_Result.length > 0 )
		{
			for(var z = 0; z < PO_Result.length; z++)
			{
				var col = PO_Result[z].getAllColumns();
				var PORate = PO_Result[z].getValue(col[0]);
				if(PORate != null && PORate != '' && parseFloat(PORate) > 0)
				{
					cost += parseFloat(PORate);
				}
			}
			nlapiLogExecution('debug','Update Full Item Cost of Item #'+ItemId,cost);
			nlapiSubmitField('inventoryitem', ItemId, 'custitem_full_item_cost', cost);			
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','Error in Updating Field',e.message);
	}
}

//Rescheduling Concept
function RescheduleScript()
{
	try
	{
		var context = nlapiGetContext();
		if (context.getRemainingUsage() <= 500)
		{
			var stateMain = nlapiYieldScript();
			if( stateMain.status == 'FAILURE')
			{
				//nlapiLogExecution("debug","Failed to yield script (do-while), exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
				throw "Failed to yield script";
			}
			else if ( stateMain.status == 'RESUME' )
			{
				//nlapiLogExecution("debug", "Resuming script (do-while) because of " + stateMain.reason+". Size = "+ stateMain.size);
			}
		}
	}
	catch(e)
	{
		if (e instanceof nlobjError)
		{
			nlapiLogExecution('debug', 'System Error', e.getCode() + '\n' + e.getDetails());
		}
		else
		{
			nlapiLogExecution('debug', 'Unexpected Error', e.toString());
		}
	}
}