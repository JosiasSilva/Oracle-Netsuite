function Updated_Date_Time(type,po_id)
{
  if(type == "edit" || type =="xedit")
  {
    try
    {
      nlapiLogExecution("DEBUG","Purchase Order Id",po_id);
      var todayDate      	= new Date();
      var getTodayDate 		= todayDate.getDate();
      var getTodayMonth 	=  todayDate.getMonth()+1;
      var getTodayFullYear 	= todayDate.getFullYear();

      var getCurrentHours 	= todayDate.getHours();  /* Returns the hour (from 0-23) */
      var getCurrentMinutes = todayDate.getMinutes();  /* Returns the minutes (from 0-59) */
      var getCurrentSeconds =  todayDate.getSeconds();

      var getCurrentAmPm = '';
      if(getCurrentHours > 12){
        getCurrentAmPm = 'PM';
        getCurrentHours = (getCurrentHours - 12);

        if(getCurrentHours < 10){
          getCurrentHours = "0" + getCurrentHours ;
        }else if(getCurrentHours == 12){
          //getCurrentHours = "00";
          getCurrentAmPm = 'AM';
        }
      }
      else if(getCurrentHours < 12){
        getCurrentHours = ((getCurrentHours < 10) ? "0" + getCurrentHours : getCurrentHours );
        if(getCurrentHours == "00")
          getCurrentHours = 12;
        getCurrentAmPm = 'AM';
      }else if(getCurrentHours == 12){
        getCurrentAmPm= 'PM';
      }
      if(getCurrentMinutes < 10)
      {
        getCurrentMinutes = "0" + getCurrentMinutes ; 
      }
      if(getCurrentSeconds<10)
      {
        getCurrentSeconds= "0" + getCurrentSeconds; 
      }
      var getCurrentDateTime =getTodayMonth + '/' + getTodayDate + '/' + getTodayFullYear + ' ' + getCurrentHours + ':' + getCurrentMinutes +":"+getCurrentSeconds+ ' ' + getCurrentAmPm;
      nlapiSubmitField("purchaseorder",po_id,"custbody_updated_datetime_on_ns",getCurrentDateTime);
      nlapiLogExecution("DEBUG","Date & Time for pushing to portal", " Date & Time " + getCurrentDateTime + "  has been updated successfully");
      return getCurrentDateTime;
    }
    catch(ex)
    {
      nlapiLogExecution("DEBUG","Error",ex.message);
    }
  }
}