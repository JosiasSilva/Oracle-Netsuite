function ignoreWeekends(temp_newDate,weekday,Id)
{
  var etaDate= nlapiDateToString(temp_newDate);
  var filter = new Array();
  filter.push(new nlobjSearchFilter('custrecord_all_location',null,'is','T'));
  var column = new Array();
  column.push(new nlobjSearchColumn('custrecord_holiday_date'));
  var result = nlapiSearchRecord('customrecordholiday_table_child',null,filter,column);
  if(result!=null)
  {
    for(var d=0;d<result.length;d++)
    {
      var holiday_date=  result[d].getValue('custrecord_holiday_date');
      if(etaDate  == holiday_date)
      {
        var temp_etaDate = new Date(etaDate);

        var etaDateDayName = weekday[temp_etaDate.getDay()];
        if(etaDateDayName=="Sunday" || etaDateDayName=="Saturday")
        {
          if(etaDateDayName=="Sunday")
          {
            etaDate=nlapiStringToDate(etaDate);
            etaDate=nlapiAddDays( etaDate, 1);
            etaDate=nlapiDateToString(etaDate);
            etaDate = exclude_holiday_date(result,etaDate,weekday);
            return etaDate;
          }
          if(etaDateDayName=="Saturday")
          {
            etaDate=nlapiStringToDate(etaDate);
            etaDate=nlapiAddDays( etaDate, 2);
            etaDate=nlapiDateToString(etaDate);
            etaDate = exclude_holiday_date(result,etaDate,weekday);
            return etaDate;
          }						
        }
        else
        {
          etaDate=nlapiStringToDate(etaDate);
          etaDate=nlapiAddDays(etaDate, 1);
          etaDate=nlapiDateToString(etaDate);
          etaDate = exclude_holiday_date(result,etaDate,weekday);
          return etaDate;
        }
      }
    }
    etaDate = exclude_holiday_date(result,etaDate,weekday);
  }
  nlapiLogExecution("Debug","In ignoreWeekends() fun Cdp having id:",Id +" ETA date : "+ etaDate);
  return etaDate;    
}
function  exclude_holiday_date(result,etaDate,weekday)
{
  var temp_etaDate = new Date(etaDate);
  var etaDateDayName = weekday[temp_etaDate.getDay()];
  for(var d=0;d<result.length;d++)
  {
    var holiday_date=  result[d].getValue('custrecord_holiday_date');
    if(etaDate == holiday_date)
    {
      if(etaDateDayName=="Sunday" || etaDateDayName=="Saturday")
      {
        if(etaDateDayName=="Sunday")
        {
          etaDate=nlapiStringToDate(etaDate);
          etaDate=nlapiAddDays( etaDate, 1);
          etaDate=nlapiDateToString(etaDate);
          etaDate = exclude_holiday_date(result,etaDate,weekday);
          return etaDate;
        }
        if(etaDateDayName=="Saturday")
        {
          etaDate=nlapiStringToDate(etaDate);
          etaDate=nlapiAddDays( etaDate, 2);
          etaDate=nlapiDateToString(etaDate);
          etaDate = exclude_holiday_date(result,etaDate,weekday);
          return etaDate;
        }						
      }
      else
      {
        etaDate=nlapiStringToDate(etaDate);
        etaDate=nlapiAddDays(etaDate, 1);
        etaDate=nlapiDateToString(etaDate);
        etaDate = exclude_holiday_date(result,etaDate,weekday);
        return etaDate;
      }
    }
  }
  if(etaDateDayName=="Sunday" || etaDateDayName=="Saturday")
  {
    if(etaDateDayName=="Sunday")
    {
      etaDate=nlapiStringToDate(etaDate);
      etaDate=nlapiAddDays( etaDate, 1);
      etaDate=nlapiDateToString(etaDate);
      etaDate = exclude_holiday_date(result,etaDate,weekday);
      return etaDate;
    }
    if(etaDateDayName=="Saturday")
    {
      etaDate=nlapiStringToDate(etaDate);
      etaDate=nlapiAddDays( etaDate, 2);
      etaDate=nlapiDateToString(etaDate);
      etaDate = exclude_holiday_date(result,etaDate,weekday);
      return  etaDate;
    }						
  }
  return etaDate;
}