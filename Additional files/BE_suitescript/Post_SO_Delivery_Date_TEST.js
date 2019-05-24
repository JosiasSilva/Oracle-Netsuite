function Post_SO_Delivery_Date(type)
{
	if(type=="view")
	{
		try
		{
			var createdFrom = "something";

			if(createdFrom!=null && createdFrom!="")
			{
				var resizerepair = false;
				
				for(var x=0; x < nlapiGetLineItemCount("item"); x++)
				{
					if(nlapiGetLineItemValue("item","item",x+1)=="1093360" || nlapiGetLineItemValue("item","item",x+1)=="1087131")
						resizerepair = true;
				}
				
				nlapiLogExecution("debug","resizerepair",resizerepair);
				
				var today = new Date();
				var newDate;
				
				if(!resizerepair)
				{
					nlapiLogExecution("debug","Not a repair/resize order");
					
					//If not a resize/repair order, add 10 business days
					switch(today.getDay())
					{
						case 0: //Sunday, add 12 calendar days
							newDate = nlapiAddDays(today,12);
							break;
						case 1: //Monday
							newDate = nlapiAddDays(today,14);
							break;
						case 2: //Tuesday
							newDate = nlapiAddDays(today,14);
							break;
						case 3: //Wednesday
							newDate = nlapiAddDays(today,14);
							break;
						case 4: //Thursday
							newDate = nlapiAddDays(today,14);
							break;
						case 5: //Friday
							newDate = nlapiAddDays(today,14);
							break;
						case 6: //Saturday, add 13 calendar days
							newDate = nlapiAddDays(today,13);
							break;
					}
				}
				else
				{
					nlapiLogExecution("debug","Hours: " + today.getHours());
					
					if(today.getHours() < 15)
					{
						nlapiLogExecution("debug","Resize/repair before 3:00PM");
						
						//If approved prior to 3:00pm, then set delivery date to 8 business days
						switch(today.getDay())
						{
							case 0: //Sunday, add 10 calendar days
								newDate = nlapiAddDays(today,10);
								break;
							case 1: //Monday, add 10 calendar days
								newDate = nlapiAddDays(today,10);
								break;
							case 2: //Tuesday, add 10 calendar days
								newDate = nlapiAddDays(today,10);
								break;
							case 3: //Wednesday, add 12 calendar days
								newDate = nlapiAddDays(today,12);
								break;
							case 4: //Thursday, add 12 calendar days
								newDate = nlapiAddDays(today,12);
								break;
							case 5: //Friday, add 12 calendar days
								newDate = nlapiAddDays(today,12);
								break;
							case 6: //Saturday, add 11 calendar days
								newDate = nlapiAddDays(today,11);
								break;
						}
					}
					else
					{
						nlapiLogExecution("debug","Resize/repair after 3:00PM");
						
						//If approved after to 3:00pm, then set delivery date to 9 business days
						switch(today.getDay())
						{
							case 0: //Sunday, add 11 calendar days
								newDate = nlapiAddDays(today,11);
								break;
							case 1: //Monday, add 11 calendar days
								newDate = nlapiAddDays(today,11);
								break;
							case 2: //Tuesday, add 13 calendar days
								newDate = nlapiAddDays(today,13);
								break;
							case 3: //Wednesday, add 13 calendar days
								newDate = nlapiAddDays(today,13);
								break;
							case 4: //Thursday, add 13 calendar days
								newDate = nlapiAddDays(today,13);
								break;
							case 5: //Friday, add 13 calendar days
								newDate = nlapiAddDays(today,13);
								break;
							case 6: //Saturday, add 12 calendar days
								newDate = nlapiAddDays(today,12);
								break;
						}
					}
				}
				
				nlapiLogExecution("debug","New Date",nlapiDateToString(newDate,"date"));
				
				//Check to see if the new date is a holiday
				if(isHoliday(nlapiDateToString(newDate,"date")))
				{
					//Add days to push to Monday if holiday occurs on Friday
					if(newDate.getDay()==5)
						newDate = nlapiAddDays(newDate,3);
					else
						newDate = nlapiAddDays(newDate,1);
				}
				
				nlapiLogExecution("debug","New Date",nlapiDateToString(newDate,"date"));
				
				//nlapiSetFieldValue("custbody6",nlapiDateToString(newDate,"date"));
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Delivery Date","Details: " + err.message);
			return true;
		}
	}
}

function isHoliday(myDate)
{
	switch(myDate)
	{
		case "09/01/2014":
		case "11/27/2014":
		case "12/25/2014":
		case "01/01/2015":
		case "05/25/2015":
		case "07/04/2015":
		case "09/07/2015":
		case "11/26/2015":
		case "12/25/2015":
		case "01/01/2016":
		case "05/30/2016":
		case "07/04/2016":
		case "09/05/2016":
		case "11/24/2016":
		case "12/25/2016":
		case "01/01/2017":
		case "05/29/2017":
		case "07/04/2017":
		case "09/04/2017":
		case "11/23/2017":
		case "12/25/2017":
		case "01/01/2018":
		case "05/28/2018":
		case "07/04/2018":
		case "09/03/2018":
		case "11/22/2018":
		case "12/25/2018":
		case "01/01/2019":
		case "05/27/2019":
		case "07/04/2019":
		case "09/02/2019":
		case "11/28/2019":
		case "12/25/2019":
		case "01/01/2020":
		case "05/25/2020":
		case "07/04/2020":
		case "09/07/2020":
		case "11/26/2020":
		case "12/25/2020":
			return true;
	}
	
	return false;
}
