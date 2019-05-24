nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_Cuurent_Value(type,form)
{
  try
  {
    if(type=='create')
    {
      if(nlapiGetFieldValue('custpage138_custom'))
      {
        nlapiSetFieldValue('custbody138',nlapiGetFieldValue('custpage138_custom'),true,true);
      }
    }
  }
  catch(er){}
}

function Set_Field(type,form,request)
{
  if(type=='create')
  {
    try
    {
      if(request)
      {
        var get_transform=request.getParameter('transform');
        var sales_id=request.getParameter('id');
        if(get_transform && sales_id)
        {
          var get_not_show=['2','3','6','7'];
          var get_field=form.getField('custbody138');
          get_field.setDisplayType('hidden');
          var get_obj=get_field.getSelectOptions();
          var add_new_field=form.addField('custpage138_custom','select','RETURN SHIPPING LABEL STATUS');
          add_new_field.setMandatory ( true ); 
          add_new_field.addSelectOption('','',true);
          var shipping_address= nlapiGetFieldValue('shipaddress');
          var get_index=shipping_address.search('United States');
          if(get_index==-1)
          {
            get_not_show.push('5');
          }
          for(var z=0;z<get_obj.length;z++)
          {
            var get_value=get_obj[z].getId();
            if(get_not_show.indexOf(get_value)==-1)
            {
              add_new_field.addSelectOption(get_value,get_obj[z].getText());
            }
          }
        }
      }
    }
    catch(er){

    }
  }
}

function After_submit(type)
{
  if (type == 'create') {
    var custbody_val=nlapiLookupField ( nlapiGetRecordType ( )  , nlapiGetRecordId ( )  , ['custbody138','createdfrom','createdfrom.type'] ) ;
    nlapiLogExecution('debug','return Value',JSON.stringify(custbody_val));
    var type_creted=custbody_val['createdfrom.type'] ;//  'SalesOrd'
    nlapiLogExecution('debug','type from creation is',JSON.stringify(custbody_val));
    if(custbody_val.custbody138=='5' && type_creted=='SalesOrd')
    {
      var search_itemfulfillment=nlapiSearchRecord('itemfulfillment',null,[new nlobjSearchFilter('createdfrom',null,'anyof',custbody_val['createdfrom']),new nlobjSearchFilter('mainline',null,'is','T')],new nlobjSearchColumn('trandate'));
      if(search_itemfulfillment)
      {
        nlapiSetRedirectURL ( 'suitelet' , 'customscript_return_level_slip_pdf' ,'customdeploy_return_level_slip_pdf' ,null,{order:nlapiGetRecordId ( ),itemfulfillment_date:search_itemfulfillment[0].getValue('trandate')} ) ;
      }


    }
  }
}



function FedEx_Return_Label(request,response)
{

  try
  {
    var custpage_record_id =request.getParameter("order");
     var dateToShip=request.getParameter("itemfulfillment_date");
    var custpage_record_type='returnauthorization';
    try
    {
      nlapiLogExecution('debug','FedEx_Return_Label',custpage_record_id);
      var custpage_service_type;
      var custpage_insurance=0.00;
      var custpage_tranid;
      var customerId;
      var now = new Date();
      var daysAgo25 = nlapiAddDays(now,-25);		
      var fullInsuranceValue = 0.00;
      var prodInsuranceValue = 0.00;		
      if(custpage_record_id!=null && custpage_record_id!="")
      {
        var filters = [];
        filters.push(new nlobjSearchFilter("internalid",null,"is",custpage_record_id));
        filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
        var cols = [];
        cols.push(new nlobjSearchColumn("custbody_full_insurance_amount"));
        cols.push(new nlobjSearchColumn("trandate"));
        cols.push(new nlobjSearchColumn("tranid"));
        cols.push(new nlobjSearchColumn("entity"));
        cols.push(new nlobjSearchColumn("custcol_category"));
        cols.push(new nlobjSearchColumn("custbody87")); //Type of 
        cols.push(new nlobjSearchColumn("custbody35")); //Type of Send Back
        cols.push(new nlobjSearchColumn("custbody_return_label_insurance"));
        cols.push(new nlobjSearchColumn("total"));
        var results = nlapiSearchRecord(custpage_record_type,null,filters,cols);
        if(results)
        {
          order = results[0];
          var hasDiamond = false;
          custpage_insurance = results[0].getValue("custbody_return_label_insurance");

          var typeOfOrder = results[0].getValue("custbody87");
          var typeOfSendback = results[0].getValue("custbody35");
          customerId =results[0].getValue("entity");

          for(var x=0; x < results.length; x++)
          {
            if(results[x].getValue("custcol_category")=="7") //Loose Diamond
            {
              hasDiamond = true;
              break;
            }
          }
          if(!custpage_insurance || custpage_insurance==0){custpage_insurance=parseFloat(custpage_insurance)*.80;}else{custpage_insurance=parseFloat(custpage_insurance);}
          //Determine service level
          var insurance_label = "";
          if(nlapiStringToDate(dateToShip) <= daysAgo25 && hasDiamond==true)
          {
            //If Date to Ship is older than 25 days and has a Category = LOOSE DIAMOND item then use FedEx Priority Overnight service
            custpage_service_type="PRIORITY_OVERNIGHT";
          }
          else if(custpage_insurance < 250)
          {
            custpage_service_type="FEDEX_GROUND";
          }
          else
          {
            custpage_service_type="FEDEX_2_DAY";
          }

          if(custpage_insurance > 15000 && custpage_service_type=="FEDEX_2_DAY")
          {
            var diff = custpage_insurance - 15000;

            insurance_label = "RE2014" + parseInt(diff) + "200305";
          }
          else if(custpage_insurance > 50000)
          {
            var diff = custpage_insurance - 50000;
            insurance_label = "RE2014" + parseInt(diff) + "200305";
          }
          else
          {
            insurance_label = "BEF8956" + parseInt(custpage_insurance) + "X1560";
          }

          custpage_tranid=results[0].getValue("tranid");	
          var now = new Date();
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

          var dsr = "";
          if(custpage_service_type!="FEDEX_GROUND")
            dsr = true;

          if(!custpage_insurance){  
            custpage_insurance= (parseFloat(results[0].getValue("total"))*(.8)*(-1));
            custpage_insurance=custpage_insurance.toFixed(2);
          }
          var labelObj = {
            ship_timestamp : timestamp,
            service_type : custpage_service_type,
            insurance_value : custpage_insurance,
            insurance_label : insurance_label,
            tranid : custpage_tranid,
            dsr : dsr
          };

          var templateID ='18934560';// nlapiGetContext().getSetting("SCRIPT","custscript_fedex_return_xml");
          var templateFile = nlapiLoadFile(templateID);
          var template = templateFile.getValue();
          var xmlTemp = Handlebars.compile(template);

          var soap = xmlTemp(labelObj);

          var headers = new Object();
          headers["Content-Type"] = "application/xml";
          // var cResp = nlapiRequestURL("https://wsbeta.fedex.com:443/web-services",soap,headers);
          var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);

          //  nlapiLogExecution("debug","Response Code",cResp.getCode());
          // nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());

          var body = cResp.getBody();
          var xmlBody = nlapiStringToXML(body);
          var partsNode = nlapiSelectNode(xmlBody, "//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
          // nlapiLogExecution("debug", "Image XML", partsNode);
          var imageXml = nlapiSelectValue(partsNode, ".//*[name()='Image']");

          try{
            var file_id=nlapiLookupField ( 'returnauthorization' , custpage_record_id,'custbody137'  ) ;
            if(file_id)
            {
              nlapiDeleteFile ( file_id );
            }

          }catch(er){}
		  
		  var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
		  var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
		
		  nlapiLogExecution("debug","Tracking Number",trackingNumber);
		
		  var trackingLast4 = trackingNumber.substr(trackingNumber.length - 4);

          var file = nlapiCreateFile(custpage_tranid + " return_label " + trackingLast4 + ".pdf","PDF",imageXml);	  
		  
          file.setFolder("407735"); //Return Shipping Labels
          var fileID = nlapiSubmitFile(file);
          nlapiSubmitField ( 'returnauthorization' , custpage_record_id , ['custbody138','custbody137'] , ['3',fileID] ) ;
          sendEmail(custpage_record_id, customerId, fileID,results[0].getValue("total"));
        }
      }
    }
    catch(er){
      nlapiLogExecution("debug", "error", er);
    }
    nlapiLogExecution('debug','nlapiSetRedirectURL',custpage_record_id);
    nlapiSetRedirectURL ( 'record' , 'returnauthorization' , custpage_record_id ) ;
  }catch(er){}
}


function sendEmail(custpage_record_id, customerId, fileID,total_amount) {
  if(fileID)
  {
    try {
      var userMail=nlapiGetUser ( ) ;
      total_amount=parseFloat(total_amount)*(-1);
      var label_email_config_id;
      if(total_amount>=250)
      {
        label_email_config_id='6';
      }
      else
      {
        label_email_config_id='7';
      }	  
      var EmailTemplate = nlapiLoadRecord('customrecord_return_label_email_config', label_email_config_id);
      var emailSubj = EmailTemplate.getFieldValue('custrecord_rlec_email_subject');
      var templateId = EmailTemplate.getFieldValue('custrecord_rlec_email_template');
      var emailTemp = nlapiLoadRecord('emailtemplate',templateId); 
      var emailBody = emailTemp.getFieldValue('content');

      var records = new Object();
      records['transaction'] = custpage_record_id; //internal id of Transaction
      var Order = nlapiLoadRecord('returnauthorization', custpage_record_id);
      var renderer = nlapiCreateTemplateRenderer();
      renderer.addRecord('transaction', Order );
      var custoer_record=Order.getFieldValue('entity');
      var firstname=nlapiLookupField ('customer',custoer_record,'firstname');
      emailBody = emailBody.replace("${customer.firstName}",firstname);
      renderer.setTemplate(emailSubj);
      renderSubj_en= renderer.renderToString();
      var renderSubj = htmlDecoder(renderSubj_en) // this is where the function is called 
      renderer.setTemplate(emailBody);
      var renderBody = renderer.renderToString();  
      nlapiSendEmail(userMail,customerId,renderSubj,renderBody,null,null,records,nlapiLoadFile(fileID),true);
    } catch (error) {
      nlapiLogExecution('debug', 'Error in Sending Email', error);
    }
  }
}
function htmlDecoder(html) { 
  html = html.replace(/ /g, ' '); // decodes it to ordinary space
  html = html.replace(/&/g, '&'); // ampersand 
  html = html.replace(/</g, '<'); // less than 
  html = html.replace(/>/g, '>'); // greater than 
  html = html.replace(/"/g, '"'); //double quotes 
  html = html.replace(/'/g, "'"); // single quotes 
  return html; //returns the decoded value 
}
function attachEmailOnSOMessageTab(userMail, customerId, subject, body,custpage_record_id,fileID)
{
  try{
    var msgRecord = nlapiCreateRecord('message');
    msgRecord.setFieldValue('transaction',custpage_record_id);
    msgRecord.setFieldValue('authoremail',userMail);
    msgRecord.setFieldValue('recipientemail',customerId);
    msgRecord.setFieldValue('message', body);
    msgRecord.setFieldValue('subject',subject);
    msgRecord.selectNewLineItem('mediaitem');
    msgRecord.setCurrentLineItemValue('mediaitem','mediaitem',fileID);
    msgRecord.commitLineItem('mediaitem');
    var messageId = nlapiSubmitRecord(msgRecord);
  }
  catch(error){
    nlapiLogExecution("Debug","Message attachment error",error); 
  }
}

