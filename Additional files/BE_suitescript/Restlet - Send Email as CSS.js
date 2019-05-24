/**
 * Script Author : Priti Tiwari (priti.tiwari@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Restlet Script)
 * Script Name   : Generate return label
 * Created Date  : July 28, 2018
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL:https://system.netsuite.com/app/common/scripting/script.nl?id=2411&whence=
 */

var FEDEX_RETURN_TAG_PRODUCTION = "26051782";
var FEDEX_RETURN_TAG_SANDBOX = "26051782";

function generateLabelAndSendEmail(datain) {

  nlapiLogExecution('debug','Data',JSON.stringify(datain));
  //var data=JSON.parse(datain);
  var data=datain;
  var EMAIL_FROM = 20561; // Employee: Brilliant Earth Customer Support & Email: cssupport@brilliantearth.com
  //Load email configurations
  var config = [];

  var filters = [];
  filters.push(new nlobjSearchFilter("isinactive", null, "is", "F"));
  var cols = [];
  cols.push(new nlobjSearchColumn("custrecord_rlec_order_type"));
  cols.push(new nlobjSearchColumn("custrecord_rlec_email_subject"));
  cols.push(new nlobjSearchColumn("custrecord_rlec_email_template"));
  cols.push(new nlobjSearchColumn("custrecord_rlec_email_type"));
  var results = nlapiSearchRecord("customrecord_return_label_email_config", null, filters, cols); //10 Units
  if (results) {
    for (var x = 0; x < results.length; x++) {
      config.push({
        order_type: results[x].getValue("custrecord_rlec_email_type"),
        email_subject: results[x].getValue("custrecord_rlec_email_subject"),
        email_template: results[x].getValue("custrecord_rlec_email_template")
      });
    }
  }

  //40 Units Per Email
  for (var x = 0; x < data.length; x++) {
    // if (request.getLineItemValue("custpage_orders", "custpage_order_rsl_status", x + 1) == "5") 

    if (data[x].custpage_order_rsl_status == "5") //Email customer label
    {

      nlapiLogExecution("debug", "Order: " + data[x].custpage_order_id);

      var templateFound = false;

      //Find email configuration for particular order type
      for (var i = 0; i < config.length; i++) {
        if (config[i].order_type == data[x].custpage_email_type){ //request.getLineItemValue("custpage_orders", "custpage_email_type", x + 1)) {
          templateFound = true;

          var EMAIL_TO = data[x].custpage_order_customer_email; //request.getLineItemValue("custpage_orders", "custpage_order_customer_email", x + 1);
          var SUBJECT = config[i].email_subject;
          var LABEL =data[x].custpage_order_return_label; //request.getLineItemValue("custpage_orders", "custpage_order_return_label", x + 1);

          if (LABEL == null || LABEL == "") {
            //Generate return label
            nlapiLogExecution("debug", "BEGIN Generating Label....");
            LABEL = Gen_Return_Label(data[x].custpage_order_id, data[x].custpage_order_record_type, data[x].custpage_order_tranid, data[x].custpage_order_return_ship_method, data[x].custpage_order_return_insurance);
            nlapiLogExecution("debug", "END Generating Label....");
          }

          LABEL = nlapiLoadFile(LABEL); //10 Units	

          var template = config[i].email_template;

          if (data[x].custpage_email_template != null && data[x].custpage_email_template != "") {
            template = data[x].custpage_email_template;
          }

          //Merge email template
          var emailMerger = nlapiCreateEmailMerger(template);
          emailMerger.setTransaction(data[x].custpage_order_id);
          emailMerger.setEntity("customer", data[x].custpage_order_customer);

          var mergeResult = emailMerger.merge(); //20 Units

          var RECORDS = new Object();
          RECORDS["transaction"] = data[x].custpage_order_id;

          var cc = null;
          if (data[x].custpage_cc_emails != null && data[x].custpage_cc_emails != "")
            cc = data[x].custpage_cc_emails;

          nlapiSendEmail(EMAIL_FROM, EMAIL_TO, SUBJECT, mergeResult.getBody(), cc, null, RECORDS, LABEL); //10 Units
          nlapiLogExecution("debug", "Mail Sent", "Email has been sent.");
          nlapiSubmitField(data[x].custpage_order_record_type, data[x].custpage_order_id, ["custbody138"], ["3"]); //10 Units
          nlapiLogExecution("debug", "Record Submitted", "Record Submitted.");
        }
      }

      if (templateFound == false) {
        if (data[x].custpage_email_template != null && data[x].custpage_email_template != "") {
          var EMAIL_TO = data[x].custpage_order_customer_email;

          var LABEL = data[x].custpage_order_return_label;

          if (LABEL == null || LABEL == "") {
            //Generate return label
            nlapiLogExecution("debug", "BEGIN Generating Label....");
            LABEL = Gen_Return_Label(data[x].custpage_order_id, data[x].custpage_order_record_type, data[x].custpage_order_tranid, data[x].custpage_order_return_ship_method, data[x].custpage_order_return_insurance);
            nlapiLogExecution("debug", "END Generating Label....");
          }

          LABEL = nlapiLoadFile(LABEL); //10 Units

          var template = data[x].custpage_email_template;

          //Merge email template
          var emailMerger = nlapiCreateEmailMerger(template);
          emailMerger.setTransaction(data[x].custpage_order_id);
          emailMerger.setEntity("customer", data[x].custpage_order_customer);

          var mergeResult = emailMerger.merge(); //20 Units

          var RECORDS = new Object();
          RECORDS["transaction"] = data[x].custpage_order_id;

          var cc = null;
          if (data[x].custpage_cc_emails != null && data[x].custpage_cc_emails != "")
            cc = data[x].custpage_cc_emails;

          nlapiSendEmail(EMAIL_FROM, EMAIL_TO, mergeResult.getSubject(), mergeResult.getBody(), cc, null, RECORDS, LABEL); //10 Units
          nlapiLogExecution("debug", "Mail Sent2", "Email has been sent2.");
          nlapiSubmitField(data[x].custpage_order_record_type, data[x].custpage_order_id, ["custbody138"], ["3"]); //10 Units
          nlapiLogExecution("debug", "Record Submitted2", "Record Submitted2.");
        }
      }
    }
  }
  return 'success';//Priti
}

function Gen_Return_Label(internalid, recordType, transId, shipMethod, insuranceAmount) {
  var now = new Date();
  var timestamp = "" + now.getFullYear() + "-";
  var month = now.getMonth();
  month = month + 1;
  if (month < 10)
    timestamp += "0" + month + "-";
  else
    timestamp += month + "-";

  if (now.getDate() < 10)
    timestamp += "0" + now.getDate() + "T";
  else
    timestamp += now.getDate() + "T";

  if (now.getHours() < 10)
    timestamp += "0" + now.getHours() + ":";
  else
    timestamp += now.getHours() + ":";

  if (now.getMinutes() < 10)
    timestamp += "0" + now.getMinutes() + ":";
  else
    timestamp += now.getMinutes() + ":";

  if (now.getSeconds() < 10)
    timestamp += "0" + now.getSeconds();
  else
    timestamp += now.getSeconds();

  var insurance = parseFloat(insuranceAmount);
  var insurance_label = "";
  if (insurance > 15000 && shipMethod == "FEDEX_2_DAY") {
    var diff = insurance - 15000;
    insurance = 15000;

    insurance_label = "RE2014" + parseInt(diff) + "200305";
  } else if (insurance > 50000) {
    var diff = insurance - 50000;
    insurance = 50000;

    insurance_label = "RE2014" + parseInt(diff) + "200305";
  } else {
    insurance_label = "BEF8956" + parseInt(insurance) + "X1560";
  }

  var labelObj = {
    ship_timestamp: timestamp,
    service_type: shipMethod,
    insurance_value: insurance,
    insurance_label: insurance_label,
    tranid: transId,
    ship_to_addressee: "",
    ship_to_address_1: "",
    ship_to_address_2: "",
    ship_to_city: "",
    ship_to_state: "",
    ship_to_zip: "",
    ship_to_country: ""
  };

  //Get return label email config record
  var shipToLocation = "2";
  var typeOfOrder = nlapiLookupField(recordType, internalid, "custbody87");
  var filters = [];
  filters.push(new nlobjSearchFilter("custrecord_rlec_order_type", null, "anyof", typeOfOrder));
  var cols = [];
  cols.push(new nlobjSearchColumn("custrecord_inventory_location_returns"));
  var results = nlapiSearchRecord("customrecord_return_label_email_config", null, filters, cols);
  if (results) {
    if (results[0].getValue("custrecord_inventory_location_returns") != null && results[0].getValue("custrecord_inventory_location_returns") != null)
      shipToLocation = results[0].getValue("custrecord_inventory_location_returns");
  }

  //Get address details from location record
  var shipToFilters = [];
  shipToFilters.push(new nlobjSearchFilter("internalid", null, "is", shipToLocation));
  var shipToCols = [];
  shipToCols.push(new nlobjSearchColumn("address1", "address"));
  shipToCols.push(new nlobjSearchColumn("address2", "address"));
  shipToCols.push(new nlobjSearchColumn("city", "address"));
  shipToCols.push(new nlobjSearchColumn("state", "address"));
  shipToCols.push(new nlobjSearchColumn("zip", "address"));
  shipToCols.push(new nlobjSearchColumn("countrycode", "address"));
  shipToCols.push(new nlobjSearchColumn("phone", "address"));
  shipToCols.push(new nlobjSearchColumn("addressee", "address"));
  shipToCols.push(new nlobjSearchColumn("attention", "address"));
  var shipToResults = nlapiSearchRecord("location", null, shipToFilters, shipToCols);
  if (shipToResults) {
    labelObj.ship_to_addressee = shipToResults[0].getValue("attention", "address");
    labelObj.ship_to_address_1 = shipToResults[0].getValue("address1", "address");
    labelObj.ship_to_address_2 = shipToResults[0].getValue("address2", "address");
    labelObj.ship_to_city = shipToResults[0].getValue("city", "address");
    labelObj.ship_to_state = shipToResults[0].getValue("state", "address");
    labelObj.ship_to_zip = shipToResults[0].getValue("zip", "address");
    labelObj.ship_to_country = shipToResults[0].getValue("countrycode", "address");
    labelObj.ship_to_phone = shipToResults[0].getValue("phone", "address");
  }

  if (nlapiGetContext().getEnvironment() == "SANDBOX")
    templateID = FEDEX_RETURN_TAG_SANDBOX;
  else
    templateID = FEDEX_RETURN_TAG_PRODUCTION;

  nlapiLogExecution("debug", "FedEx Template ID", templateID);
  var templateFile = nlapiLoadFile(templateID);
  var template = templateFile.getValue();
  var xmlTemp = Handlebars.compile(template);

  var soap = xmlTemp(labelObj);

  var headers = new Object();
  headers["Content-Type"] = "application/xml";

  nlapiLogExecution("debug", "Environment", nlapiGetContext().getEnvironment());

  var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services", soap, headers);

  nlapiLogExecution("debug", "Response Code", cResp.getCode());
  nlapiLogExecution("debug", "Response Body (XML)", cResp.getBody());

  var body = cResp.getBody();
  var xmlBody = nlapiStringToXML(body);

  var partsNode = nlapiSelectNode(xmlBody, "//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
  var imageXml = nlapiSelectValue(partsNode, ".//*[name()='Image']");

  nlapiLogExecution("debug", "Image XML", imageXml);

  var trackingNode = nlapiSelectNode(xmlBody, "//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
  var trackingNumber = nlapiSelectValue(trackingNode, ".//*[name()='TrackingNumber']");

  nlapiLogExecution("debug", "Tracking Number", trackingNumber);

  var trackingLast4 = trackingNumber.substr(trackingNumber.length - 4);

  var file = nlapiCreateFile(transId + " return_label " + trackingLast4 + ".pdf", "PDF", imageXml);
  file.setFolder("407735"); //Return Shipping Labels
  var fileID = nlapiSubmitFile(file);

  nlapiSubmitField(recordType, internalid, ["custbody137", "custbody123", "custbody138"], [fileID, trackingNumber, "3"]);

  //Return file internal ID
  return fileID;
}