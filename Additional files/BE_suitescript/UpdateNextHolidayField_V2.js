nlapiLogExecution("audit","FLOStart",new Date().getTime());

/**
/app/common/search/savedsearch.nl?id=6294
/app/common/scripting/script.nl?id=1575
*/

function UpdateNextHolidayDate()
{
	try 
	{
		var soArr = ['SalesOrd:G','SalesOrd:H','SalesOrd:C'];
		var soname = 'salesorder';
		var poArr = ['PurchOrd:G','PurchOrd:H'];
		var poname = 'purchaseorder';
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
				var current = [];
				current.push(Location_Date[c].date);
				UpdateField(current,Location_Date[c].location,soArr,soname);
				Re_Shedule();
				UpdateField(current,Location_Date[c].location,poArr,poname);
				tempArr.push(Location_Date[c].date);
			}
		}
		if(All_Location_Date != null && All_Location_Date != '' && All_Location_Date.length > 0)
		{
			tempArr.push(All_Location_Date[0].date);
			tempArr.sort(function(a,b) { 
				return new Date(a).getTime() - new Date(b).getTime() 
			});
			UpdateField(tempArr,null,soArr,soname);
			Re_Shedule();
			UpdateField(tempArr,null,poArr,poname);
		}
	}
    catch (w)
	{
        nlapiLogExecution("error", "Error from Getting Date : " , w.message);
    }
}

function UpdateField(NextHolidayDate,location,Arr,name)
{
	try 
	{
		nlapiLogExecution("debug", "NextHolidayDate " + JSON.stringify(NextHolidayDate), "location " + location);
		var HolidayDate;
		var fil = [];
		if(location != '' && location != null)
		{
			fil.push(new nlobjSearchFilter('custbody_delivery_location',null,'is',location));			
		}
		for(var f=0; f<NextHolidayDate.length; f++)
		{
			HolidayDate = NextHolidayDate[f];
			fil.push(new nlobjSearchFilter('custbody_next_holiday_date',null,'noton',HolidayDate ));
			fil.push(new nlobjSearchFilter('status',null,'noneof',Arr));
			fil.push(new nlobjSearchFilter('mainline',null,'is','T'));		
			fil.push(new nlobjSearchFilter('memorized',null,'is','F'));
			var search = nlapiCreateSearch(name, fil);
			var searchResults = search.runSearch();

			var resultIndex = 0; 
			var resultStep = 1000;
			var resultSet;
			do 
			{	
				resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
				for(var p=0; p<resultSet.length; p++)
				{
					try
					{
						nlapiSubmitField(name,resultSet[p].getId(),'custbody_next_holiday_date',HolidayDate);
						nlapiLogExecution("debug", "Updated "+name+" : " + resultSet[p].getId(),HolidayDate);
						Re_Shedule();
					}
					catch (a)
					{
						nlapiLogExecution("error", name +" field not update #"+ Search[v].getId(), a.message);
					}
				}
				
				resultIndex = resultIndex + resultStep;
				
				nlapiLogExecution('DEBUG', 'resultSet returned', resultSet.length  + ' records returned');
				
			} 
			while (resultSet.length > 0)
		}
    }
    catch (err)
	{
        nlapiLogExecution("error", "Error on getting sales order record from saved search is : " , err.message);
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
