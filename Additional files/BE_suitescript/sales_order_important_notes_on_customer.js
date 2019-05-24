/**
 * Script Author :  Aradhana (aradhana.gautam@inoday.com)
 * Author Desig. :  Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   :  Suitscript (Client event Script)
 * Script Name   :  Sales Order Important Notes on Customer Page
 * Script File   :  sales_order_important_notes_on_customer.js
 * Created Date  :  May 11, 2018
 **/
function soImportantnotesOncustomer(type, name) {
  try{
    if (type == 'create' || type == 'edit') {
      var so_id = nlapiGetRecordId();
      var so_obj = nlapiLoadRecord('salesorder', so_id);
      var so_imp_notes = so_obj.getFieldValue('custbody58');
      var get_cust_id = so_obj.getFieldValue('entity');
      nlapiSubmitField('customer', get_cust_id, 'custentity_so_important_notes', so_imp_notes,true);
    }
  }
  catch(exp)
  {
    nlapiLogExecution('Error','Error is:-',exp.message);
  }
}