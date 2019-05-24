nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
https://debugger.sandbox.netsuite.com/app/common/search/savedsearch.nl?id=6294
https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1575
*/


var index = 0;
var indexPO = 0;
function UpdateNextHolidayDate()
{
	try 
	{
		var HoliDayDate;
		var tempDate = null;
		var tempArr = [];
		var All_Location_Date = GetHolidayDate('T',null);
		if(All_Location_Date != null && All_Location_Date != '' && All_Location_Date.length > 0)
		{
			tempDate = All_Location_Date[0].date;
		}	
		var Location_Date = GetHolidayDate('F',tempDate);
		if(Location_Date != null && Location_Date != '' && Location_Date.length > 0)
		{
			for(var c=0; c < Location_Date.length; c++)
			{
				UpdateField(Location_Date[c].date,Location_Date[c].location);
				POUpdateField(Location_Date[c].date,Location_Date[c].location);
				tempArr.push(Location_Date[c].date);
			}
		}
		if(All_Location_Date != null && All_Location_Date != '' && All_Location_Date.length > 0)
		{
			tempArr.push(All_Location_Date[0].date);
			tempArr.sort(function(a,b) { 
				return new Date(a).getTime() - new Date(b).getTime() 
			});
			UpdateField(tempArr,null);
			POUpdateField(tempArr,null);
		}
	}
    catch (w)
	{
        nlapiLogExecution("error", "Error from Getting Date : " , w.message);
    }
}

function UpdateField(NextHolidayDate,location)
{
	try 
	{
		nlapiLogExecution("debug", "NextHolidayDate " + NextHolidayDate, "location " + location);
		var HolidayDate = NextHolidayDate;
		var fil = [];
		if(location != '' && location != null)
		{
			fil.push(new nlobjSearchFilter('custbody_delivery_location',null,'is',location));			
		}
		else
		{
			HolidayDate = NextHolidayDate[index];
			index++;
		}
		fil.push(new nlobjSearchFilter('custbody_next_holiday_date',null,'noton',NextHolidayDate ));
		fil.push(new nlobjSearchFilter('status',null,'noneof',['SalesOrd:G','SalesOrd:H','SalesOrd:C']));
		fil.push(new nlobjSearchFilter('mainline',null,'is','T'));		
		fil.push(new nlobjSearchFilter('memorized',null,'is','F'));
		var col = [];
		col.push(new nlobjSearchColumn('custbody_next_holiday_date'));
		col.push(new nlobjSearchColumn('status'));
		var Search = nlapiSearchRecord('salesorder',null,fil, col );		
		if(Search)
		{
			nlapiLogExecution("debug", "Total Record is "+ Search.length);
			for(var v=0; v < Search.length; v++)
			{
				try
				{
					nlapiSubmitField('salesorder',Search[v].getId(),'custbody_next_holiday_date',HolidayDate);
					nlapiLogExecution("debug", "Updated SO : " + Search[v].getId(),HolidayDate);
					Re_Shedule();
				}
				catch (a)
				{
					nlapiLogExecution("error", "SO field not update #"+ Search[v].getId(), a.message);
				}
			}
			if(Search.length == 1000)
			{
				UpdateField(NextHolidayDate,location);
			}
		}
		else
		{
			nlapiLogExecution("debug", "All records already updated with ", NextHolidayDate);
		}
    }
    catch (err)
	{
        nlapiLogExecution("error", "Error on getting sales order record from saved search is : " , err.message);
    }
	return;
}

function POUpdateField(NextHolidayDate,location)
{
	try 
	{
		nlapiLogExecution("debug", "NextHolidayDate " + NextHolidayDate, "location " + location);
		var HolidayDate = NextHolidayDate;
		var fil = [];
		if(location != '' && location != null)
		{
			fil.push(new nlobjSearchFilter('custbody_delivery_location',null,'is',location));			
		}
		else
		{
			HolidayDate = NextHolidayDate[indexPO];
			indexPO++;
		}
		fil.push(new nlobjSearchFilter('custbody_next_holiday_date',null,'noton',NextHolidayDate ));
		fil.push(new nlobjSearchFilter('status',null,'noneof',['PurchOrd:G','PurchOrd:H']));
		fil.push(new nlobjSearchFilter('mainline',null,'is','T'));		
		fil.push(new nlobjSearchFilter('memorized',null,'is','F'));
		var col = [];
		col.push(new nlobjSearchColumn('custbody_next_holiday_date'));
		col.push(new nlobjSearchColumn('status'));
		var Search = nlapiSearchRecord('purchaseorder',null,fil, col );		
		if(Search)
		{
			nlapiLogExecution("debug", "Total Record is "+ Search.length);
			for(var v=0; v < Search.length; v++)
			{
				try
				{
					nlapiSubmitField('purchaseorder',Search[v].getId(),'custbody_next_holiday_date',HolidayDate);
					nlapiLogExecution("debug", "Updated PO : " + Search[v].getId(),HolidayDate);
					Re_Shedule();
				}
				catch (a)
				{
					nlapiLogExecution("error", "PO field not update #"+ Search[v].getId(), a.message);
				}
			}
			if(Search.length == 1000)
			{
				POUpdateField(NextHolidayDate,location);
			}
		}
		else
		{
			nlapiLogExecution("debug", "All PO records already updated with ", NextHolidayDate);
		}
    }
    catch (err)
	{
        nlapiLogExecution("error", "Error on getting purchase order record from saved search is : " , err.message);
    }
	return;
}


function GetHolidayDate(location,date)
{
	var Arr = [];
	var filter = [];
	if(date != '' && date != null)
	{
		filter.push(new nlobjSearchFilter('custrecord_holiday_date',null,'noton',date));
	}
	filter.push(new nlobjSearchFilter('custrecord_holiday_date',null,'after',nlapiDateToString( new Date())));
	filter.push(new nlobjSearchFilter('custrecord_all_location',null,'is',location));
	var HoliDaySearch = nlapiSearchRecord(null,5046,filter);
	if(HoliDaySearch != null && HoliDaySearch != '' && HoliDaySearch.length > 0)
	{
		if(location=='F')
		{
			for(var k=0; k < HoliDaySearch.length; k++)
			{
				var LocName = HoliDaySearch[k].getValue('custrecord_location','CUSTRECORD_HOLIDAY_TABLE_JOIN_2');
				if(LocName != '' && LocName != null)
				{
					Arr.push({
						date		:	HoliDaySearch[k].getValue('custrecord_holiday_date'),
						location	:	HoliDaySearch[k].getValue('custrecord_location','CUSTRECORD_HOLIDAY_TABLE_JOIN_2')
					});
				}
			}
		}
		else
		{
			Arr.push({
						date		:	HoliDaySearch[0].getValue('custrecord_holiday_date'),
						location	:	''
					});
		}		
	}
	return Arr;
}

function Re_Shedule()
{
  if (nlapiGetContext().getRemainingUsage() < 500) {
    var stateMain = nlapiYieldScript();
    if (stateMain.status == 'FAILURE') {
      nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
      throw "Failed to yield script";
    } else if (stateMain.status == 'RESUME') {
      nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
    }
  }
}
