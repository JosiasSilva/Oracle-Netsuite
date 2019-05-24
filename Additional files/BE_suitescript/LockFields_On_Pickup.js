/***
 * Script Author :  Sanjay Singh (sanjay.singh@inoday.com)
 * Author Desig. :  Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   :  Client Event Script
 * Script Name   :  Lock fields when pick up is selected on Sales Order
 * Script File   :  LockFields_On_Pickup.js
 * Created Date  :  Apr 25, 2018
 ***/

nlapiLogExecution("audit","FLOStart",new Date().getTime());
function pageInit()
{
  var baseRecordType = '';

  try
    {
     baseRecordType = window.opener.document.getElementById('baserecordtype').value;
    }
  catch(ex)
   {
     nlapiLogExecution('debug','error : ',ex.message);
   // baseRecordType = document.getElementById('baserecordtype').value;
   }

    if(baseRecordType =='salesorder')
    {
      var so_id = window.opener.document.getElementById('id').value;
      var pickAtBE = nlapiLookupField('salesorder',so_id,'custbody53');

      if(pickAtBE == 'T')
      {
        document.getElementById("country_fs").style='pointer-events: none' ;
        document.getElementById("inpt_country1").disabled = true;
        document.getElementById("addr1").disabled = true;
        document.getElementById("addr2").disabled = true;
        document.getElementById("city").disabled = true;
        document.getElementById("dropdownstate_fs").style='pointer-events: none' ;
        document.getElementById("inpt_dropdownstate2").disabled = true;
        document.getElementById("zip").disabled = true;
      }
   }
}
