/**
 * Script Author : Aradhana (aradhana.gautam@inoday.com)
 * Author Desig. : Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Client Event Script: Validate Line)
 * Script Name   : On Hold Appointment Item
 * Script File   :  on_hold_appointment_item.js
 * Created Date  : Apr 04, 2018
 */
function holdAppointmentItem(type) {
  var date_of_appt = nlapiGetFieldValue('startdate');
  var getAppDate = nlapiStringToDate(date_of_appt);
  var mili_dateApp = getAppDate.getTime();
  if(mili_dateApp!=null)
  {
    var appt_mail = nlapiGetFieldValue('custevent_customer_email');
    var item_id = nlapiGetCurrentLineItemValue('recmachcustrecord_appointment_item_parent', 'custrecord_appointment_item_itemid');
    var fields_Items = nlapiLookupField('inventoryitem', item_id, ['custitem20', 'custitem198', 'custitem86', 'custitemcustomer_email']); //Get the fields from Appoinrment Item page
    var category = fields_Items.custitem20;
    var unique_diamond = fields_Items.custitem198;
    var onHold = fields_Items.custitem86;
    var getHoldDate = nlapiStringToDate(onHold);
    var miliHoldDate = getHoldDate.getTime();
    var cust_mail = fields_Items.custitemcustomer_email;

    if ((category == 7 || category == 24 || unique_diamond == 'T') && (miliHoldDate <= mili_dateApp) && (cust_mail != appt_mail)) {
      alert('This item is not currently available. Item is on hold through ' + onHold + '.');
      return false;

    }
    return true;
  }
}