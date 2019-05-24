function Shipping_Label_file_Create(load_box_rec,shipFromResults)
{
  var obj_return=
      {
        custrecord_box_shipping_label:load_box_rec.getFieldValue('custrecord_box_shipping_label'),
        custrecord_box_shipping_label_png:load_box_rec.getFieldValue('custrecord_box_shipping_label_png'),
        custrecord_box_tracking_id:load_box_rec.getFieldValue('custrecord_box_tracking_id'),
        custrecord_box_fedex_error_message:load_box_rec.getFieldValue('custrecord_box_fedex_error_message'),
        custrecord_box_declared_value:load_box_rec.getFieldValue('custrecord_box_declared_value'),
      }

  try
  {  
    var labelObj = {
      ship_timestamp : "",
      service_type : "PRIORITY_OVERNIGHT",
      insurance_value : "",
      insurance_label : "",
      tranid : "",
      ship_addressee : "",
      ship_attention : "",
      ship_address1 : "",
      ship_address2 : "",
      ship_city : "",
      ship_state : "",
      ship_zipcode : "",
      ship_country : "",
      ship_phone : "",
      ship_from_addressee : "",
      ship_from_address1 : "",
      ship_from_address2 : "",
      ship_from_city : "",
      ship_from_state : "",
      ship_from_zipcode : "",
      ship_from_country : "",
      ship_from_phone : "",
      saturday_delivery : "",
      signature_required : true,
      key : "",
      password : "",
      accountnumber : "",
      meternumber : "",
      package_type : "FEDEX_BOX"
    };

    var location,to_location;
    var FEDEX_ENDPOINT_TYPE;
    if(load_box_rec)
    {
      location = load_box_rec.getFieldValue("custrecord_box_from_location");
      to_location = load_box_rec.getFieldValue("custrecord_box_location");
      var to_location_txt = load_box_rec.getFieldText("custrecord_box_location");

      //Get FedEx API information from custom record for that location
      var apiFilters = [];
      if(to_location==null || to_location=="" || to_location_txt.substring(0,14)=="BE Fulfillment")
        apiFilters.push(new nlobjSearchFilter("custrecord_fedex_integration_vendor_acct",null,"is","T"));
      else
        apiFilters.push(new nlobjSearchFilter("custrecord_fedex_int_location",null,"is",to_location));
      var apiCols = [];
      apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_account_number"));
      apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_meter_number"));
      apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_key"));
      apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_password"));
      apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_endpoint_type"));
      var apiResults = nlapiSearchRecord("customrecord_fedex_integration_key",null,apiFilters,apiCols);
      if(apiResults)
      {
        labelObj.key = apiResults[0].getValue("custrecord_fedex_int_key");
        labelObj.password = apiResults[0].getValue("custrecord_fedex_int_password");
        labelObj.accountnumber = apiResults[0].getValue("custrecord_fedex_int_account_number");
        labelObj.meternumber = apiResults[0].getValue("custrecord_fedex_int_meter_number");
        FEDEX_ENDPOINT_TYPE = apiResults[0].getValue("custrecord_fedex_int_endpoint_type");
      }
      else
      {
        //If no match found, use SF credentials
        var sfCredentials = nlapiLookupField("customrecord_fedex_integration_key","1",["custrecord_fedex_int_key","custrecord_fedex_int_password","custrecord_fedex_int_account_number","custrecord_fedex_int_meter_number"]);

        labelObj.key = sfCredentials.custrecord_fedex_int_key;
        labelObj.password = sfCredentials.custrecord_fedex_int_password;
        labelObj.accountnumber = sfCredentials.custrecord_fedex_int_account_number;
        labelObj.meternumber = sfCredentials.custrecord_fedex_int_meter_number;

        FEDEX_ENDPOINT_TYPE = "PRODUCTION";
      }

      var now = nlapiStringToDate(load_box_rec.getFieldValue("custrecord_box_ship_date"));
      var timestamp = "" + now.getFullYear() + "-";
      var month = now.getMonth();
      month = month + 1;
      if(month < 10)
        timestamp += "0" + month + "-";
      else
        timestamp += month + "-";

      if(now.getDate() < 10)
        timestamp += "0" + now.getDate() + "T";
      else
        timestamp += now.getDate() + "T";

      if(now.getHours() < 10)
        timestamp += "0" + now.getHours() + ":";
      else
        timestamp += now.getHours() + ":";

      if(now.getMinutes() < 10)
        timestamp += "0" + now.getMinutes() + ":";
      else
        timestamp += now.getMinutes() + ":";

      if(now.getSeconds() < 10)
        timestamp += "0" + now.getSeconds();
      else
        timestamp += now.getSeconds();

      labelObj.ship_timestamp = timestamp;

      var shipService;
      switch(load_box_rec.getFieldValue("custrecord_box_shipping_method"))
      {
        case "2221264":
        case "6":
        case "5668897":
          shipService = "FEDEX_2_DAY";
          break;
        case "2":
        case "1965157":
        case "5668896":
          shipService = "PRIORITY_OVERNIGHT";
          break;
        case "5668899":
          shipService = "FEDEX_GROUND";
          labelObj.package_type = "YOUR_PACKAGING";
          break;
        case "5668900":
          shipService = "FIRST_OVERNIGHT";
          break;
        case "5668898":
          shipService = "FEDEX_EXPRESS_SAVER";
          labelObj.package_type = "YOUR_PACKAGING";
          break;
        default:
          shipService = "PRIORITY_OVERNIGHT";
          break;
      }

      labelObj.service_type = shipService;

      var insurance = load_box_rec.getFieldValue("custrecord_box_insurance_value");
      var insurance_label = load_box_rec.getFieldValue("custrecord_box_insurance_value");
      if(insurance > 50000 && insurance <= 120000)
      {
        insurance_label =  insurance - 50000;
        insurance = 50000;
      }
      var insurance_label = "RE2014" + parseInt(insurance_label) + "200305";

      labelObj.insurance_value = insurance;
      labelObj.insurance_label = insurance_label;
      obj_return.custrecord_box_declared_value=insurance;
      if(insurance < 50000)
      {
        labelObj.insurance_label = "";
      }
      labelObj.ship_addressee = load_box_rec.getFieldValue("custrecord_box_addressee");
      labelObj.ship_attention = load_box_rec.getFieldValue("custrecord_box_attention");
      labelObj.ship_address1 = load_box_rec.getFieldValue("custrecord_box_address1");
      labelObj.ship_address2 = load_box_rec.getFieldValue("custrecord_box_address2");
      labelObj.ship_city = load_box_rec.getFieldValue("custrecord_box_city");
      labelObj.ship_state = stateAbbrev(load_box_rec.getFieldValue("custrecord_box_state"));
      labelObj.ship_zipcode = load_box_rec.getFieldValue("custrecord_box_zip");
      labelObj.ship_country = load_box_rec.getFieldValue("custrecord_box_country");
      if(labelObj.ship_country=="230")
        labelObj.ship_country = "US";
      labelObj.ship_phone = load_box_rec.getFieldValue("custrecord_box_phone");
      labelObj.tranid = load_box_rec.getId();
      if(shipFromResults)
      {
        labelObj.ship_from_addressee = shipFromResults.getValue("attention","address");
        labelObj.ship_from_address1 = shipFromResults.getValue("address1","address");
        labelObj.ship_from_address2 = shipFromResults.getValue("address2","address");
        labelObj.ship_from_city = shipFromResults.getValue("city","address");
        labelObj.ship_from_state = shipFromResults.getValue("state","address");
        labelObj.ship_from_zipcode = shipFromResults.getValue("zip","address");
        labelObj.ship_from_country = shipFromResults.getValue("countrycode","address");
        labelObj.ship_from_phone = shipFromResults.getValue("phone","address");	
      }
      if(load_box_rec.getFieldValue("custrecord_box_special_instructions")!=null && load_box_rec.getFieldValue("custrecord_box_special_instructions")!="")
      {
        var specInstruc = load_box_rec.getFieldText("custrecord_box_special_instructions");
        if(specInstruc.indexOf("Saturday Delivery")!=-1)
          labelObj.saturday_delivery = true;
        if(specInstruc.indexOf("Direct Signature NOT Required")!=-1)
          labelObj.signature_required = "";
      }
    }
    var templateID = "20357148"; //Old: 16756534
    var folderID = "8762529";
    var templateFile = nlapiLoadFile(templateID);
    var template = templateFile.getValue();
    var xmlTemp = Handlebars.compile(template);
    var soap = xmlTemp(labelObj);
    var requestFile = nlapiCreateFile(labelObj.tranid + "_Request.txt","PLAINTEXT",soap);
    requestFile.setFolder("8762529");
    var requestFileId = nlapiSubmitFile(requestFile);
    var headers = new Object();
    headers["Content-Type"] = "application/xml";

    if(FEDEX_ENDPOINT_TYPE=="PRODUCTION")
      var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
    else
      var cResp = nlapiRequestURL("https://wsbeta.fedex.com:443/web-services",soap,headers);
    var body = cResp.getBody();

    var xmlBody = nlapiStringToXML(body);

    //Check for errors and handle appropriately
    var errors = [];
    var errorNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='Notifications']");
    for(var x=0; x < errorNodes.length; x++)
    {
      var code = nlapiSelectValue(errorNodes[x],".//*[name()='Code']");
      var message = nlapiSelectValue(errorNodes[x],".//*[name()='Message']");
      var severity = nlapiSelectValue(errorNodes[x],".//*[name()='Severity']");
      if(code=="0000")
        continue;

      if(severity=="WARNING")
        continue;

      errors.push({
        code : code,
        message : message
      });
    }

    if(errors.length == 0)
    {
      var partsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
      var imageXml = nlapiSelectValue(partsNode,".//*[name()='Image']");
      var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
      var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
      if(load_box_rec.getFieldValue('custrecord_box_shipping_label'))
        nlapiDeleteFile(load_box_rec.getFieldValue('custrecord_box_shipping_label'));
      if(load_box_rec.getFieldValue('custrecord_box_shipping_label_png'))
        nlapiDeleteFile(load_box_rec.getFieldValue('custrecord_box_shipping_label_png'));
      var labelfile = nlapiCreateFile(load_box_rec.getId() + "_shipping_label.png","PNGIMAGE",imageXml);
      labelfile.setFolder(folderID);
      labelfile.setIsOnline(true);
      var labelFileID = nlapiSubmitFile(labelfile);
      var labelFileObj = nlapiLoadFile(labelFileID);
      var labelImageUrl = labelFileObj.getURL();
      if(nlapiGetContext().getEnvironment()=="PRODUCTION")
        labelImageUrl = "https://system.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
      else
        labelImageUrl = "https://system.sandbox.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");

      var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
      pdfxml+= "<pdf>";
      pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
      pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
      pdfxml+= "</body>";
      pdfxml+= "</pdf>";
      //Get last 4 digits of tracking #
      var last4 = trackingNumber.substring(trackingNumber.length - 4);

      var pdfFileObj = nlapiXMLToPDF(pdfxml);
      pdfFileObj.setName(load_box_rec.getId() + "_SL_" + last4 + ".pdf");
      pdfFileObj.setFolder(folderID);
      pdfFileObj.setIsOnline(true);
      var pdfFileId = nlapiSubmitFile(pdfFileObj);

    }
    obj_return.custrecord_box_shipping_label=pdfFileId;
    obj_return.custrecord_box_shipping_label_png=labelFileID;
    obj_return.custrecord_box_tracking_id=trackingNumber;
    obj_return.custrecord_box_fedex_error_message="";
  }
  catch(er){}
  return obj_return;
}

function stateAbbrev(stateStr)
{

  var statesList = [
    {text:'Alabama',id:'AL'},
    {text:'Alaska',id:'AK'},
    {text:'Arizona',id:'AZ'},
    {text:'Arkansas',id:'AR'},
    {text:'Armed Forces Americas',id:'AA'},
    {text:'Armed Forces Europe',id:'AE'},
    {text:'Armed Forces Pacific',id:'AP'},
    {text:'California',id:'CA'},
    {text:'Colorado',id:'CO'},
    {text:'Connecticut',id:'CT'},
    {text:'Delaware',id:'DE'},
    {text:'District of Columbia',id:'DC'},
    {text:'Florida',id:'FL'},
    {text:'Georgia',id:'GA'},
    {text:'Hawaii',id:'HI'},
    {text:'Idaho',id:'ID'},
    {text:'Illinois',id:'IL'},
    {text:'Indiana',id:'IN'},
    {text:'Iowa',id:'IA'},
    {text:'Kansas',id:'KS'},
    {text:'Kentucky',id:'KY'},
    {text:'Louisiana',id:'LA'},
    {text:'Maine',id:'ME'},
    {text:'Maryland',id:'MD'},
    {text:'Massachusetts',id:'MA'},
    {text:'Michigan',id:'MI'},
    {text:'Minnesota',id:'MN'},
    {text:'Mississippi',id:'MS'},
    {text:'Missouri',id:'MO'},
    {text:'Montana',id:'MT'},
    {text:'Nebraska',id:'NE'},
    {text:'Nevada',id:'NV'},
    {text:'New Hampshire',id:'NH'},
    {text:'New Jersey',id:'NJ'},
    {text:'New Mexico',id:'NM'},
    {text:'New York',id:'NY'},
    {text:'North Carolina',id:'NC'},
    {text:'North Dakota',id:'ND'},
    {text:'Ohio',id:'OH'},
    {text:'Oklahoma',id:'OK'},
    {text:'Oregon',id:'OR'},
    {text:'Pennsylvania',id:'PA'},
    {text:'Puerto Rico',id:'PR'},
    {text:'Rhode Island',id:'RI'},
    {text:'South Carolina',id:'SC'},
    {text:'South Dakota',id:'SD'},
    {text:'Tennessee',id:'TN'},
    {text:'Texas',id:'TX'},
    {text:'Utah',id:'UT'},
    {text:'Vermont',id:'VT'},
    {text:'Virginia',id:'VA'},
    {text:'Washington',id:'WA'},
    {text:'West Virginia',id:'WV'},
    {text:'Wisconsin',id:'WI'},
    {text:'Wyoming',id:'WY'}
  ];

  var abbrev = "";
  for(var x=0; x < statesList.length; x++)
  {
    if(statesList[x].text == stateStr)
    {
      abbrev = statesList[x].id;
      break;
    }
  }

  if(abbrev=="")
    abbrev = stateStr;

  return abbrev;
}
