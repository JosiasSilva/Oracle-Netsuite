/**
	@UserEvent Script URL	:-	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1597
	@Suitelet Script URL	:-	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1599
	@Scheduled Script URL	:-	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1602
	@Suitelet Script URL	:-	https://system.netsuite.com/app/common/scripting/script.nl?id=1839
	@Scheduled Script URL	:-	https://system.netsuite.com/app/common/scripting/script.nl?id=1840
*/
function Update_Matrix_Item_Status_Scheduled()
{
	try
	{
		nlapiLogExecution("debug","CSV ", new Date());
		var csvResult = nlapiSearchRecord('customrecord_bulk_update_matrix',null,null,[new nlobjSearchColumn('custrecord_csv_data')]);
		if(csvResult)
		{
			for(var g=0; g<csvResult.length; g++)
			{
				Re_Shedule();
				var csvJSON = csvResult[g].getValue('custrecord_csv_data');
				nlapiLogExecution("debug","CSV Data of ID #"+csvResult[g].getId(),csvJSON);
				Update_Record(csvJSON);
				nlapiDeleteRecord('customrecord_bulk_update_matrix',csvResult[g].getId());
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Update Matrix Pricing UI POST Error","Details: " + err.message);
	}
}
function Update_Record(csvItem)
{
	if(csvItem)
	{
		csvItem = JSON.parse(csvItem);
		for(var x=0; x< csvItem.length; x++)
		{
			Re_Shedule();
			var ParentItem = csvItem[x]['Parent Item'];
			if(ParentItem)
			{
				var Gender = csvItem[x]['Gender'];
				var SettingStyle = csvItem[x]['Setting Style'];
				var Activestatus = csvItem[x]['Active status'];
				var fieldValues = [];
				var field = [];
				
				if(Gender)
				{
					var objGender = nlapiSearchRecord('customlist3',null,[new nlobjSearchFilter('name',null,'is',Gender)]);
					if(objGender)
					{
						fieldValues.push(objGender[0].getId());
						field.push('custitem3');
					}
				}
				if(SettingStyle)
				{
					var objSettingStyle = nlapiSearchRecord('customlist335',null,[new nlobjSearchFilter('name',null,'is',SettingStyle)]);
					if(objSettingStyle)
					{
						fieldValues.push(objSettingStyle[0].getId());
						field.push('custitem164');
					}
				}
				if(Activestatus)
				{
					var objActivestatus = nlapiSearchRecord('customlist329',null,[new nlobjSearchFilter('name',null,'is',Activestatus)]);
					if(objActivestatus)
					{
						fieldValues.push(objActivestatus[0].getId());
						field.push('custitem160');
					}
				}
				nlapiLogExecution("debug", "Row No. :- "+x+" field",JSON.stringify(field));
				nlapiLogExecution("debug", "Row No. :- "+x+" fieldValues",JSON.stringify(fieldValues));
				ParentItem = ParentItem + " : ";
				var filter = new Array();
				filter.push(new nlobjSearchFilter('name',null,'contains',ParentItem));
				var search = nlapiCreateSearch('inventoryitem', filter);
				var searchResults = search.runSearch();

				var resultIndex = 0; 
				var resultStep = 1000;
				var resultSet;
				do 
				{	
					resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
					for(var w=0; w<resultSet.length; w++)
					{
						try
						{
							nlapiSubmitField('inventoryitem',resultSet[w].getId(),field,fieldValues);
							nlapiLogExecution("debug", "Updated inventoryitem : " + resultSet[w].getId());
							Re_Shedule();
						}
						catch (a)
						{
							nlapiLogExecution("error","Inventoryitem field not update #"+ resultSet[w].getId(), a.message);
						}
					}					
					resultIndex = resultIndex + resultStep;					
					nlapiLogExecution('DEBUG', 'resultSet returned', resultSet.length  + ' records returned');					
				} 
				while (resultSet.length > 0)				
			}	
		}
	}
}
function Re_Shedule()
{
	if (nlapiGetContext().getRemainingUsage() < 500) 
	{
		var stateMain = nlapiYieldScript();
		if (stateMain.status == 'FAILURE') 
		{
			nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
			throw "Failed to yield script";
		} 
		else if (stateMain.status == 'RESUME') 
		{
			nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
		}
	}
}