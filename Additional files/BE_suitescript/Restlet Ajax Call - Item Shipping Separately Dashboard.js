function UpdateRecords(datain) {
  try {
    nlapiLogExecution('DEBUG', "JSON ", JSON.stringify(datain));
    //var update_data = JSON.parse(datain);	 
   if (datain) {
      var operation = datain.operation;
      if (operation == 'Update') {
        var custpage_so_internal_id = datain.custpage_so_internal_id;
        var custpage_delivery_date_notes = datain.custpage_delivery_date_notes;
        var custpage_item_ship_seperate = datain.custpage_item_ship_seperate;
        var custpage_status_item_ship_seperate = datain.custpage_status_item_ship_seperate;

         var custpage_materials_tracking_no = datain.custpage_materials_tracking_no;
          
        var sublist_id = datain.sublist_id;
        if (sublist_id == 'custpage_ready_to_ship' || sublist_id == 'custpage_pending_addr') {
          var boxId= updateBoxRecord(datain);
        } 
        nlapiSubmitField('salesorder', custpage_so_internal_id, ['custbody150', 'custbody304', 'custbody305','custbody257'], [custpage_delivery_date_notes, custpage_item_ship_seperate.split(','), custpage_status_item_ship_seperate,custpage_materials_tracking_no]);
        nlapiLogExecution('debug', 'Sucess Summary 2', 'Successfully updated on ' + sublist_id);

      } else {
        var boxInternalID= updateBoxRecord(datain);
        if(boxInternalID)
        {
          generateShippingLabel(boxInternalID);
          var tracking_id=nlapiLookupField('customrecord_box_record',boxInternalID,'custrecord_box_tracking_id');
          nlapiSubmitField('salesorder', datain.custpage_so_internal_id, 'custbody257', tracking_id);
          
        }
      }
    }
  
} catch (er) {
  nlapiLogExecution('debug', 'error', er.message);
}
return 'success';
}

function getTodayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var format1 = mm + '/' + dd + '/' + yyyy;
  var format2 = mm + '_' + dd + '_' + yyyy;
  return [format1, format2];
}
function updateBoxRecord(datain)
{
  var so_id = datain.custpage_so_internal_id;
  var box_id = datain.custpage_box_record_hidden;
  var boxInternalID='';
  if(box_id)
  {
    var custpage_attention = datain.custpage_attention;
    var custpage_addressee = datain.custpage_addressee;
    var custpage_address1 = datain.custpage_address1;
    var custpage_address2 = datain.custpage_address2;
    var custpage_city = datain.custpage_city;
    var custpage_state = datain.custpage_state;
    var custpage_zip = datain.custpage_zip;
    var custpage_country = datain.custpage_country;
    var custpage_ship_method = datain.custpage_ship_method;
    var custpage_materials_tracking_no = datain.custpage_materials_tracking_no;
    var custpage_insurance = datain.custpage_insurance;

    var objBox = nlapiLoadRecord('customrecord_box_record',box_id);
    objBox.setFieldValue('custrecord_box_country', custpage_country);
    objBox.setFieldValue('custrecord_box_attention', custpage_attention);
    objBox.setFieldValue('custrecord_box_addressee', custpage_addressee);
    objBox.setFieldValue('custrecord_box_address1', custpage_address1);
    objBox.setFieldValue('custrecord_box_address2', custpage_address2);
    objBox.setFieldValue('custrecord_box_city', custpage_city);
    objBox.setFieldValue('custrecord_box_state', custpage_state);
    objBox.setFieldValue('custrecord_box_zip', custpage_zip);
    objBox.setFieldValue('custrecord_box_shipping_method', custpage_ship_method);
    objBox.setFieldValue('custrecord_box_tracking_id', custpage_materials_tracking_no);
    objBox.setFieldValue('custrecord_box_insurance_value', custpage_insurance);

    var boxInternalID = nlapiSubmitRecord(objBox, true, true);
     nlapiLogExecution('debug', 'Box Record Updated', boxInternalID);
  }
  return boxInternalID;
}