/**  
 *      custom id = (id=2631)
 * 
 *      TYPE ---> Suitelet
        NAME ---> suiteletafterSublistItem
        ID -----> customscript_suiteletaftersublistitem
 */



function suiteletafterSublistItem(request, response) {
  var form = nlapiCreateForm("Suitelet - After NEXT Button");

  form.setScript("customscript2630");

  // Add a button
  form.addButton('custpage_nextButton1', 'SAVE', 'saveRecord();');
  form.addButton('custpage_nextButton2', 'BACK', 'back();');
  form.addButton('custpage_nextButton3', 'CLOSE', 'closeWindow();');

  var group = form.addFieldGroup('custpage_sample_subtab', 'Order Information');

  // form.addSubTab('custpage_sample_subtab', 'Order Information');

  //Add a select field to the subtab
  var mandatory1 = form.addField('custpage_sample_field', 'select', 'CUSTOMER NAME', 'customer', 'custpage_sample_subtab');
  mandatory1.setMandatory(true);

  form.addField('custpage_field1', 'date', 'ACTUAL SHIP DATE', null, 'custpage_sample_subtab');

  var field = form.addField('custpage_selectfield', 'select', 'DROP OFF', null, 'custpage_sample_subtab');
  field.addSelectOption('0', '', true);
  field.addSelectOption('1', 'HOME', false);
  field.addSelectOption('2', 'OFFICE', false);
  field.addSelectOption('3', 'POST-OFFICE', false);
  field.addSelectOption('4', 'HEAD-OFFICE', false);
  field.setMandatory(true);

  var field2 = form.addField('custpage_selectfield1', 'select', 'PLACE OF SALE', null, 'custpage_sample_subtab');
  field2.addSelectOption('0', '', true);
  field2.addSelectOption('1', 'AMAZON', false);
  field2.addSelectOption('2', 'FLIPKART', false);
  field2.addSelectOption('3', 'SNAPDEAL', false);
  field2.addSelectOption('4', 'MYNTRA', false);
  field2.setMandatory(true);

  var field3 = form.addField('custpage_selectfield2', 'select', 'SALES REP', null, 'custpage_sample_subtab');
  field3.addSelectOption('0', '', true);
  field3.addSelectOption('1', 'WAREHOUSE', false);
  field3.addSelectOption('2', 'INVENTORY', false);

  form.addField('custpage_field6', 'text', 'NUMBER OF TIMES REPAIRED', null, 'custpage_sample_subtab');

  var textfield15 = form.addField('custpage_textfield15', 'text', 'WHAT IS THE CUSTOMERS REPORTED REPAIR ISSUE?', null, 'custpage_sample_subtab');
  textfield15.setMandatory(true);
  textfield15.setLayoutType('normal', 'startcol')

  var mandatory2 = form.addField('custpage_textfield', 'integer', 'WEAR HABITS', null, 'custpage_sample_subtab');
  mandatory2.setMandatory(true);

  var mandatory3 = form.addField('custpage_field2', 'text', 'WHEN DID THEY NOTICE ISSUE?', null, 'custpage_sample_subtab');
  mandatory3.setMandatory(true);

  var mandatory4 = form.addField('custpage_field3', 'text', 'CUSTOMER TEMP?', null, 'custpage_sample_subtab');
  mandatory4.setMandatory(true);

  var mandatory5 = form.addField('custpage_field4', 'text', 'INSURANCE OR BBESP?', null, 'custpage_sample_subtab');
  mandatory5.setMandatory(true);

  var mandatory6 = form.addField('custpage_field5', 'text', 'WHO TO CONTACT AFTER INSPECTION?', null, 'custpage_sample_subtab');
  mandatory6.setMandatory(true);

  var checkbox1 = form.addField("makeinventoryavailable", "checkbox", "BLOCK AUTO EMAILS", null, 'custpage_sample_subtab');

  checkbox1.setLayoutType('normal', 'startcol')

  form.addField('custpage_field_textarea', 'textarea', 'SALES ORDER NOTES', null, 'custpage_sample_subtab');

  form.addField('custpage_field_textarea1', 'textarea', 'OR NOTES', null, 'custpage_sample_subtab');


  // ---------------------------------------second tab------------------------------------------------------
  // form.addSubTab('custpage_sample_subtab1', 'Delivery/Shipping');
  var group2 = form.addFieldGroup('custpage_sample_subtab1', 'Delivery/Shipping');

  var mandatory7 = form.addField('custpage_date', 'date', 'DELIVERY DATE', null, 'custpage_sample_subtab1');
  mandatory7.setMandatory(true);

  form.addField("custpage_delivery", "checkbox", "DELIVERY DATE FROM", null, 'custpage_sample_subtab1');

  var field6 = form.addField('custpage_selectfield6', 'select', 'DELIVERY INSTRUCTIONS', null, 'custpage_sample_subtab1');
  field6.addSelectOption('0', '-New-', true);
  field6.addSelectOption('1', 'Saturday Delivery Only', false);
  field6.addSelectOption('2', 'Delivery on specific date', false);
  field6.addSelectOption('2', 'Delivery after a specific date', false);

  form.addField('custpage_field_textarea3', 'textarea', 'DELIVERY DATE NOTES', null, 'custpage_sample_subtab1');

  form.addField("custpage_pickup", "checkbox", "PICKUP AT BE", null, 'custpage_sample_subtab1');

  var field8 = form.addField('custpage_selectfield8', 'select', 'PICKUP LOCATION', null, 'custpage_sample_subtab1');
  field8.addSelectOption('0', '', true);
  field8.addSelectOption('1', 'San Francisco', false);
  field8.addSelectOption('2', 'Los Angeles', false);
  field8.addSelectOption('2', 'item Sent to SF', false);

  var field4 = form.addField('custpage_selectfield4', 'select', 'COUNTRY', null, 'custpage_sample_subtab1');
  field4.addSelectOption('0', 'UNITED STATES', true);
  field4.addSelectOption('1', 'INDIA', false);
  field4.addSelectOption('2', 'UK', false);

  field4.setLayoutType('normal', 'startcol');

  form.addField('custpage_field7', 'text', 'ATTENTION', null, 'custpage_sample_subtab1');

  form.addField('custpage_field9', 'text', 'ADDRESSES', null, 'custpage_sample_subtab1');

  form.addField('custpage_field10', 'text', 'ADDRESS LINE 1', null, 'custpage_sample_subtab1');

  form.addField('custpage_field11', 'text', 'ADDRESS LINE 2', null, 'custpage_sample_subtab1');

  form.addField('custpage_field12', 'text', 'CITY', null, 'custpage_sample_subtab1');

  form.addField('custpage_field13', 'text', 'STATE', null, 'custpage_sample_subtab1');

  form.addField('custpage_field14', 'text', 'ZIPCODE', null, 'custpage_sample_subtab1');

  var field5 = form.addField('custpage_selectfield5', 'select', 'RETURN LABEL STATUS', null, 'custpage_sample_subtab1');
  field5.addSelectOption('0', '', true);
  field5.addSelectOption('1', 'abc', false);
  field5.addSelectOption('2', 'xyz', false);
  field5.setLayoutType('normal', 'startcol');
  field5.setMandatory(true);

  form.addField('custpage_field8', 'text', 'DATE RECIEVED AT BE FROM CUSTOMER', null, 'custpage_sample_subtab1');

  var field7 = form.addField('custpage_selectfield7', 'select', 'LOCATION RECIEVED AT BE FROM CUSTOMER', null, 'custpage_sample_subtab1');
  field7.addSelectOption('0', '-New-', true);
  field7.addSelectOption('1', 'San Francisco', false);
  field7.addSelectOption('2', 'Los Angeles', false);
  field7.addSelectOption('2', 'item Sent to SF', false);

  form.addField('custpage_field15', 'text', 'STATUS OF INTERNATIONAL TAXES', null, 'custpage_sample_subtab1');

  // ---------------------------------------------------------------------------****

  var sublist = form.addSubList('sublist', 'inlineeditor', null, 'custpage_sample_subtab1');
  sublist.addField('sublist1', 'text', 'SHIPPING TO BE');
  sublist.addField('sublist2', 'select', 'item','ITEM');
  sublist.addField('sublist3', 'text', 'DESCRIPTION');
  sublist.addField('sublist4', 'currency', 'AMOUNT');
  sublist.addField('sublist5', 'currency', 'SALES AMOUNT');
  sublist.addField('sublist6', 'float', 'QUANTITY');
  sublist.addField('sublist7', 'float', 'PRODUCTION ISURANCE VALUE');
  sublist.addField('sublist8', 'text', 'ITEM SKU');
  sublist.addField('sublist9', 'text', 'CREATED FROM');
  sublist.addField('sublist10', 'text', 'CENTRE STONE SKU');
  sublist.addField('sublist11', 'text', 'RELATED SALES ORDER');

  response.writePage(form);
}
