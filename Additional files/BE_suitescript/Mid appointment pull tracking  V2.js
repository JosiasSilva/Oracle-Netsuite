function Mid_Appointment_Pull()
{
  try
  {
    var search_record=nlapiSearchRecord('calendarevent',null,new nlobjSearchFilter('internalid',null,'anyof',nlapiGetRecordId ( ) ),
                                        [
                                          new nlobjSearchColumn('startdate'),
                                          new nlobjSearchColumn('starttime'),
                                          new nlobjSearchColumn('created','CUSTRECORD_APPOINTMENT_ITEM_PARENT'),
                                          new nlobjSearchColumn('internalid','CUSTRECORD_APPOINTMENT_ITEM_PARENT'),
                                          new nlobjSearchColumn('custevent_calendar_location')
                                        ]);
    if(search_record)
    {
      for(var a=0;a<search_record.length;a++)
      {
        var get_location=search_record[a].getValue('custevent_calendar_location');
        var item_internalid=search_record[a].getValue('internalid','CUSTRECORD_APPOINTMENT_ITEM_PARENT');
        var get_create_date_time=new Date(search_record[a].getValue('created','CUSTRECORD_APPOINTMENT_ITEM_PARENT'));	    
        var appointment_date_time=search_record[a].getValue('startdate')+' '+search_record[a].getValue('starttime');
        var get_appointment_date_time=new Date(appointment_date_time);
        if(get_location && get_location!="8" )
        {
          var get_location_obj=["1","2","3","4","5","6","7"];
          var extra_hour=["0","0","3","2","0","3","1"];
          var index_value= get_location_obj.indexOf(get_location);
          var get_extra_hour=parseInt(extra_hour[index_value]);
          var get_hour=parseInt(get_create_date_time.getHours());
          var sum_hour=get_extra_hour+get_hour;	  
          get_create_date_time.setHours(sum_hour);
        }		
        var diff_value = (get_create_date_time.getTime() - get_appointment_date_time.getTime());
        if(diff_value>=0)
        {
          nlapiSubmitField ('customrecord_appointment_item' , item_internalid , 'custrecord_mid_appointment_pull' , "T" ); 
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



