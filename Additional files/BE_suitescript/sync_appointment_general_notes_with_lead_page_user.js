nlapiLogExecution("audit","FLOStart",new Date().getTime());
function saverecord(type,form){
  try{
    if(type == 'edit' || type =='create')
    {
      var leadId = nlapiGetFieldValue('company');
      var general_notes = nlapiGetFieldValue('custevent_general_notes');
      nlapiLogExecution('Debug','General notes- ',general_notes);
      var str1=general_notes.replace(/(?:\r\n|\r|\n)/g, '^');
      var arr_appt_notes=str1.split('^');
      if(general_notes &&  leadId)
      {
        var appointment_notes = nlapiLookupField('customer',leadId,'custentity_appointment_notes');
        var str = appointment_notes.replace(/(?:\r\n|\r|\n)/g, '^');
        var arr_cust_notes=str.split('^');
        var str_new_notes='';
        var flag=false;
        for(j=0;j<arr_appt_notes.length;j++)
        {
          for(var i=0;i<arr_cust_notes.length;i++)
          {
            if(arr_appt_notes[j]==arr_cust_notes[i])
            {
              flag=true;
              break;
            }
            flag=false;
          }
          if(flag==false)
          {
            if(str_new_notes=='')
            {
              str_new_notes=arr_appt_notes[j];
            }
            else{
              str_new_notes=str_new_notes+"\r\n"+arr_appt_notes[j];
            }
          }
        }
        nlapiLogExecution('Debug','Appointment notes- before add',str_new_notes);
        str_new_notes=str_new_notes+"\r\n"+appointment_notes;
        nlapiSubmitField('customer',leadId,'custentity_appointment_notes',str_new_notes);
      }
    }
  }
  catch (errw)
  {
    nlapiLogExecution("debug", "Error Occurs While Getting Data", errw.message);
  }
}
