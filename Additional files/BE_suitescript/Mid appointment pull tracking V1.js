var date_diff_indays = function(date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
var date_diff_inTimes = function(time1, time2) {
  dt1_am_pm ='am';dt2_am_pm ='am';
  if(time1.search('pm')>=0){dt1_am_pm='pm';}
  if(time2.search('pm')>=0){dt2_am_pm='pm';}
  if(dt1_am_pm=='am' && dt2_am_pm=='pm')
  {
    return 1;
  }
  else if(dt1_am_pm == dt2_am_pm)
  {
    time1=time1.split(" ");
    time1=time1[0].split(":");
    time2=time2.split(" ");
    time2=time2[0].split(":");
    if(time1[0]>time2[0])
    {
      return 1;
    }
    else if(time1[0]==time2[0])
    {
      if(time1[1]>=time2[1])
      {
        return 1;
      }
    }
  }
  return 0;
}
function Mid_Appointment_Pull()
{
  try
  {
    var search_record=nlapiSearchRecord('calendarevent',null,new nlobjSearchFilter('internalid',null,'anyof',nlapiGetRecordId ( ) ),
                                        [
                                          new nlobjSearchColumn('startdate'),
                                          new nlobjSearchColumn('starttime'),
                                          new nlobjSearchColumn('created','CUSTRECORD_APPOINTMENT_ITEM_PARENT'),
                                          new nlobjSearchColumn('internalid','CUSTRECORD_APPOINTMENT_ITEM_PARENT')
                                        ]);
    if(search_record)
    {
      for(var a=0;a<search_record.length;a++)
      {

        var item_internalid=search_record[a].getValue('internalid','CUSTRECORD_APPOINTMENT_ITEM_PARENT');
        var get_appointment_start_date=search_record[a].getValue('startdate');		
        var get_create_date_time=search_record[a].getValue('created','CUSTRECORD_APPOINTMENT_ITEM_PARENT');
        var get_create_date=nlapiDateToString (nlapiStringToDate ( get_create_date_time));			
        var diff_value=date_diff_indays (get_appointment_start_date,get_create_date);
        if(diff_value>0)
        {
          nlapiSubmitField ('customrecord_appointment_item' , item_internalid , 'custrecord_mid_appointment_pull' , "T" ); 
        }
        else if(diff_value==0)
        {
          var get_appointment_start_time=search_record[a].getValue('starttime');
          var get_create_time=nlapiDateToString (nlapiStringToDate ( get_create_date_time),'timeofday');
          var diff_value=date_diff_inTimes (get_create_time,get_appointment_start_time);
          if(diff_value>0)
          {
            nlapiSubmitField ('customrecord_appointment_item' , item_internalid , 'custrecord_mid_appointment_pull' , "T" ); 
          }
          else
          {
            nlapiSubmitField ('customrecord_appointment_item' , item_internalid , 'custrecord_mid_appointment_pull' , "F" ); 
          }
        }
        else
        {
          nlapiSubmitField ('customrecord_appointment_item' , item_internalid , 'custrecord_mid_appointment_pull' , "F" ); 
        }
      }
    }
  }
  catch(er)
  {

  }
}



