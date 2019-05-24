nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-783 (Update Matrix - trigger for csv import)
	@Script Type   				:-	Scheduled Script
	@Created Date  				:-	July 13, 2017
	@Last Modified Date 		:-  July 13, 2017
	@Comments                 	: 	Script will updated all matrix items according to CSV
	
	@UserEvent Script URL	:-	/app/common/scripting/script.nl?id=1597
	@Suitelet Script URL	:-	/app/common/scripting/script.nl?id=1599
	@Scheduled Script URL	:-	/app/common/scripting/script.nl?id=1602
	@Suitelet Script URL	:-	/app/common/scripting/script.nl?id=1839
	@Scheduled Script URL	:-	/app/common/scripting/script.nl?id=1840
*/

function Update_Matrix_Item_Status_Scheduled()
{
	try
	{
		nlapiLogExecution("debug","CSV ", new Date());
		var Rcol= [];
		Rcol.push(new nlobjSearchColumn('custrecord_csv_data'));
		Rcol.push(new nlobjSearchColumn('custrecord_csv_email'));
		var csvResult = nlapiSearchRecord('customrecord_bulk_update_matrix',null,null,Rcol);
		if(csvResult)
		{
			for(var g=0; g<csvResult.length; g++)
			{
				Re_Shedule();
				var csvJSON = csvResult[g].getValue('custrecord_csv_data');
				var csv_email = csvResult[g].getValue('custrecord_csv_email');
				nlapiLogExecution("debug","CSV Data of ID #"+csvResult[g].getId(),csvJSON);
				var body = FilterJSONData(csvJSON);
				SendEmail(csv_email,body)
				nlapiDeleteRecord('customrecord_bulk_update_matrix',csvResult[g].getId());
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Update Matrix Pricing UI POST Error","Details: " + err.message);
	}
}
function FilterJSONData(csvItem)
{
	var body = '';
	try
	{
		if(csvItem)
		{
			csvItem = JSON.parse(csvItem);
			for(var x=0; x< csvItem.length; x++)
			{
				
				var Row = csvItem[x];
				if(Row)
				{
					var fieldValues = [];
					var field = [];
					var ParentItem = '';
					for (var key in Row) 
					{
						var colName = key;
						var colValue = Row[key];
						if(colName.toUpperCase() == 'parent item'.toUpperCase())
						{
							ParentItem = colValue;
						}
						else
						{						
							if(colValue)
							{
								var MapField = GetNSFieldID(colName,colValue);
								if(MapField != null && MapField != '' && MapField.length > 0)
								{
									field.push(MapField[0]);
									fieldValues.push(MapField[1]);						
								}
							}
						}
					}
					if(ParentItem && field && fieldValues)
					{
						nlapiLogExecution("debug", 'ParentItem is '+ParentItem);
						nlapiLogExecution("debug", JSON.stringify(field),JSON.stringify(fieldValues));
						body = Update_Record(ParentItem,field,fieldValues);
						Re_Shedule();
					}
					else
					{
						body =  'Incorrect column Name in CSV.';
					}					
				}
			}
		}
	}
	catch(c)
	{
		nlapiLogExecution('error','Error found to get CSV data from RecordType ',c.message);
		body = 'Script did not get data of CSV from record due to :- '+c.message;
	}
	return body;
}
function GetNSFieldID(key,value)
{
	var Map = [];
	try
	{
		var search_data = nlapiLoadSearch(null,7584); //Sandbox 6346
		var internal_id = [];
		var name_id = [];
		if(search_data)
		{
			var col = search_data.getColumns();
			for(var a=0; a<col.length; a++)
			{
				if(key.toUpperCase() == col[a].getLabel().toUpperCase())
				{
					var id = col[a].getName();
					var type = col[a].getType();
					var MainValue = '';
					if(type == 'select')
					{				
						var LoadObj = nlapiLoadRecord('inventoryitem',39549);
						var FieldObj = LoadObj.getField(id);
						var Options = FieldObj.getSelectOptions();
						var OptionValueArr = [];
						for(var p=0; p<Options.length; p++)
						{
							if(Options[p].getText() == value)
							{
								MainValue = Options[p].getId();
								break;
							}
						}
					}
					else if(type == 'checkbox')
					{
						if(value == 'F' || value == 'T')
						{
							MainValue = value;
						}
					}
					else
					{
						MainValue = value;
					}
					Map.push(id);
					Map.push(MainValue);
				}
			}
		}
	}
	catch(exce)
	{
		nlapiLogExecution('error','Error found for field ' + key,exce.message);
	}
	return Map;
}

function Update_Record(ParentItem,field,fieldValues)
{
	var body = '';
	try
	{
		var filter = new Array();
		filter.push(new nlobjSearchFilter('name',null,'is',ParentItem));
		var search = nlapiSearchRecord('inventoryitem',null,filter);
		var load_item = nlapiLoadRecord('inventoryitem',search[0].getId());
		nlapiSubmitField('inventoryitem',search[0].getId(),field,fieldValues);
		var matrix_count = load_item.getLineItemCount('matrixmach');
		for(var w=1; w <= matrix_count; w++)
		{
			try
			{
				var link_matrix_id = load_item.getLineItemValue('matrixmach','mtrxid',w);
				nlapiSubmitField('inventoryitem',link_matrix_id,field,fieldValues);
				nlapiLogExecution("debug", "Updated inventoryitem : " + link_matrix_id);
				Re_Shedule();
			}
			catch (a)
			{
				nlapiLogExecution("error","Inventoryitem field not update #"+ link_matrix_id, a.message);
			}
	   }
	   body = 'The matrix update is complete.';
	}
	catch(c)
	{
		nlapiLogExecution('error','Error found to get CSV data from RecordType ',c.message);
		body = 'All the items of ' + ParentItem + ' not updated due to :- '+c.message;
	}
	return body;
}
function SendEmail(csv_email,body)
{
	if(csv_email)
	{
	  nlapiSendEmail(1564077, csv_email , 'Update Matrix' , body , null , null , null , null,true ) ;
      nlapiLogExecution("Debug", "Email has been send to " + csv_email);
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