nlapiLogExecution("audit","FLOStart",new Date().getTime());
//var datain = {"cdp_id" : 2785, "action_needed" : [2,3,4], "item_status": 1, "attachments" :['https://testportal.brilliantearth.com/media/order/attach/01/05/PORTAL_TO_NS_RECORD_API_1.2.pdf','https://testportal.brilliantearth.com/media/order/attach/01/05/Book1.csv'], "tracking_no" : 231456, "ship_date" :"11/01/2016", "clear_ship" :true, "clear_invoice" :false}// New Format
//var datain = { "item_status": 8, "cdp_id" : 63869}
// var f = UpdateRecord(datain);
// var g=0;

function UpdateRecord(datain)
{
  var err = new Object();
  err.status = "failed";
  err.message= "error";
  var actionArr = new Array();
  var diamondStatus = "";
  nlapiLogExecution('DEBUG',"835 Portal json data is : ", JSON.stringify(datain));
  //nlapiLogExecution('DEBUG',"Portal Request Type Value : "+ datain.portal_request_type);
  /*nlapiLogExecution('DEBUG',"Action Needed Value : "+ datain.action_needed);
    nlapiLogExecution('DEBUG',"Ship Date Value : "+ datain.ship_date);
    nlapiLogExecution('DEBUG',"Item Status Value : "+ datain.item_status);
    nlapiLogExecution('DEBUG',"Tracking No Value : "+ datain.tracking_no);
    nlapiLogExecution('DEBUG',"CDP Id is : "+ datain.cdp_id);
    nlapiLogExecution('DEBUG',"Diamond Portal Url is : "+ datain.record_url);
    nlapiLogExecution('DEBUG',"on vendor portal value is : "+ datain.on_vendor_portal);*/
  //start here added new line of code for uncheck vendor checkbox on deletion record from Portal by Anuj Verma 30 Dec 2016
  try
  {
    if(datain.on_vendor_portal==false)
    {
      nlapiSubmitField("customrecord_custom_diamond",datain.cdp_id,"custrecord_on_vendor_portal","F");
      err.status = "OK";
      err.message = "Success";
      jsonResponse = JSON.stringify(err,replacer);
      return jsonResponse;
    }
  }
  catch(err)
  {
    nlapiLogExecution('DEBUG','Error occur during sync from Portal to NS',err.message);
    err.status = "Failed";
    err.message= err.message;
    jsonResponse = JSON.stringify(err,replacer);
    return jsonResponse;
  }
  // ended here new line of code 
  try
  {
    // Validate if mandatory record type is set in the request
    if (!datain.cdp_id)
    {
      err.status = "failed";
      err.message= "missing cdp_id";
      return err;
    }
    if(datain.action_needed =="" && datain.item_status =="" && datain.attachments=="" && datain.tracking_no=="" && datain.ship_date =="")
    {
      err.status = "failed";
      err.message= "missing value to be update";
      return err;
    }	
    var cdpObj = nlapiLoadRecord("customrecord_custom_diamond",datain.cdp_id);
    //Getting old values by ajay 08April 2017
    var mapping_logic = cdpObj.getFieldValue("custrecordoverride_mapping_logic");
    var old_diamond_status = cdpObj.getFieldValue("custrecord_diamond_status");
    var old_ItemStatus = cdpObj.getFieldValue("custrecord_item_status");		
    var requestType = cdpObj.getFieldValue("custrecord_custom_diamond_request_type");
    var old_PortalReqType = cdpObj.getFieldValue("custrecord165");
    var cs_status = cdpObj.getFieldValue("custrecord_custom_diamond_cs_status");
    var paid = cdpObj.getFieldValue("custrecord_custom_diamond_percent_paid");
    if(datain.action_needed != null && datain.action_needed != "undefined")
    {
      for(var i=0; i < datain.action_needed.length; i++)
      {
        if(datain.action_needed[i] =="")
        {
          err.status = "failed";
          err.message= "missing action needed value to be update";
          return err;
        }
        actionArr[i] = datain.action_needed[i];
      }             
      cdpObj.setFieldValue("custrecord_action_needed",actionArr);
    }
    if(datain.item_status != null && datain.item_status != "undefined")
    {                
      diamondStatus = GetDiamondStatus(datain.item_status);
      nlapiLogExecution('DEBUG',"Diamond Status Value : "+ diamondStatus);
      nlapiLogExecution('DEBUG',"Item Status Value : "+ datain.item_status);
      if(datain.item_status == 1){ // Not confirmed
        actionArr[0] = 2; // Confirmation Needed
        nlapiLogExecution("debug","Updated action needed value is :"+actionArr);
        cdpObj.setFieldValue("custrecord_action_needed",actionArr);
        cdpObj.setFieldValue("custrecord_diamond_status",diamondStatus);
        cdpObj.setFieldValue("custrecord_item_status",datain.item_status);
      }
      //Added by ajay 10Nov 2016
      else if(datain.item_status == 8) //EC Unknown
      {
        diamondStatus = 2;
        datain.item_status = 8;
        cdpObj.setFieldValue("custrecord_diamond_status",diamondStatus);
        cdpObj.setFieldValue("custrecord_item_status",datain.item_status);
      }
      //Ended by ajay 10Nov 2016
      else
      {					
        cdpObj.setFieldValue("custrecord_diamond_status",diamondStatus);
        cdpObj.setFieldValue("custrecord_item_status",datain.item_status);
      }               
    }

    if (datain.tracking_no != null && datain.tracking_no != "undefined") // Need to create the field Name
    {                 
      cdpObj.setFieldValue("custrecord_tracking_number",datain.tracking_no);
    }
    if (datain.ship_date !=null && datain.ship_date !="undefined") // Need to create the field Name
    {	        
      cdpObj.setFieldValue("custrecord_shipdate",datain.ship_date);
    }

    if(datain.clear_ship == true)
    {               				
      cdpObj.setFieldValue("custrecord_tracking_number","");
      cdpObj.setFieldValue("custrecord_shipdate","");
      cdpObj.setFieldValue("custrecord_shipping_comments","");
    }
    if(datain.clear_invoice == true)
    {
      var billId = nlapiLookupField("customrecord_custom_diamond",datain.cdp_id,"custrecord_created_bill_no");
      if(billId != null && billId != "")
      {
        var billObj = nlapiLoadRecord("vendorbill",billId);
        billObj.setFieldValue("custbody_portal_invoice_number","");
        billObj.setFieldValue("custbody_portal_shipping_cost","");
        billObj.setFieldValue("custbody_portal_invoice_comments","");
        billObj.setFieldValue("custbody_portal_misc_adjustments","");			

        var bId = nlapiSubmitRecord(billObj,true,true);
        nlapiLogExecution('DEBUG','Clear vendor bill id='+bId);
      }
    } 
    if(datain.record_url != null)
    {
      cdpObj.setFieldValue("custrecord_hidden_portal_url",datain.record_url);
    }
    cdpObj.setFieldValue("custrecord238","835");//Added by ajay 20March 2017
    cdpObj.setFieldValue("custrecord241",nlapiGetContext().getExecutionContext());//Added by ajay 28March 2017

    if(paid!='' && paid!=null)
    {
      paid=paid.split('%')[0];			
    }
    var new_diamond_status = diamondStatus;
    var new_ItemStatus = datain.item_status;
    /*nlapiLogExecution('DEBUG',"requestType Value1 : "+ requestType);
        nlapiLogExecution('DEBUG',"mapping_logic Value1 : "+ mapping_logic);
        nlapiLogExecution('DEBUG',"old_PortalReqType Value1 : "+ old_PortalReqType);
        nlapiLogExecution('DEBUG',"cs_status Value1 : "+ cs_status);
        nlapiLogExecution('DEBUG',"old_ItemStatus Value1 : "+ old_ItemStatus);
        nlapiLogExecution('DEBUG',"new_ItemStatus Value1 : "+ new_ItemStatus);*/
    //if(mapping_logic == 'F')
    //{
    if(old_diamond_status == new_diamond_status)
    {
      cdpObj.setFieldValue('custrecord_item_status',new_ItemStatus);
    }
    else
    {
      if(new_diamond_status == 6) //Not Available Replacement Confirmed
      {
        cdpObj.setFieldValue('custrecord_item_status',6); // Cancellation confirmed
      }
      else if(new_diamond_status == 7 || new_diamond_status == 9) // On-Hold Pending Customer Decision/On-Hold Customer payment pending
      {
        cdpObj.setFieldValue('custrecord_item_status',2); // Confirmed
      }
      else if(new_diamond_status != 2) // Requested Pending
      {
        cdpObj.setFieldValue('custrecord_item_status',new_ItemStatus);
      }
    }
    /*if(old_PortalReqType == 2 && new_PortalReqType == 3 && item_status == 1  &&  old_ItemStatus == 2)
			{
				cdpObj.setFieldValue('custrecord_diamond_status',"");
			}*/

    //Logic for new mapping by ajay 17march 2016							
    if((requestType == 7 || requestType == 8) && old_PortalReqType == 2 && cs_status != 4) //case #1
    {						
      if((old_ItemStatus != 2 || old_ItemStatus == 2) && new_ItemStatus == 2) //From NS/Portal changed 
      {
        //nlapiLogExecution("debug","test ajay");
        cdpObj.setFieldValue('custrecord_diamond_status',7); //On Hold � Pending Customer Decision
      }								
    }
    else if((requestType == 7 || requestType == 8) && old_PortalReqType == 2 && paid < 20) //case #2
    {						
      if((old_ItemStatus != 2 || old_ItemStatus == 2) && new_ItemStatus == 2) //From NS/Portal changed 
      {
        cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold � Customer Payment Pending
      }								
    }
    /*else if(requestType == 7 && old_PortalReqType == 2 && cs_status != 4 && paid >= 20) //case #3
			{
				if(old_CsStatus != 4 && new_CsStatus == 4) //From NS changed
				{
					cdpObj.setFieldValue('custrecord165',3); //Sold
					cdpObj.setFieldValue('custrecord_item_status',1); //Not confirmed
					cdpObj.setFieldValue('custrecord_diamond_status',"");
				}								
			}*/							
    else if(requestType == 1 && old_PortalReqType == 2 && paid < 20) //case #5
    {
      if((old_ItemStatus != 2 || old_ItemStatus == 2) && new_ItemStatus == 2) //From NS/Portal changed
      {
        cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold � Customer Payment Pending
      }								
    }
    else if(requestType == 6 && old_PortalReqType == 2) //case #6
    {
      if((old_ItemStatus != 2 || old_ItemStatus == 2) && new_ItemStatus == 2) //From NS/Portal changed
      {
        cdpObj.setFieldValue('custrecord_diamond_status',7);//On Hold � Pending Customer Decision
        cdpObj.setFieldValue('custrecord_custom_diamond_cs_status',2);//Option Sent to CS
      }								
    }
    /*else if(requestType == 1 && new_diamond_status == 9 && paid > 20)  //sold request type
			{							
				cdpObj.setFieldValue('custrecord_diamond_status',"");																					
			}*/	
    //Ended new mapping by ajay
    //}
    //Ended 
    //cdpObj.setFieldValue('custrecord_portal_response',2);
    var portal_request_type = datain.portal_request_type;
    if(portal_request_type != '' && portal_request_type != null)
    {
      cdpObj.setFieldValue("custrecord165",portal_request_type); //Added by Yagya 19 May 2017
    }
    if(datain.date_expected_at_be)
    {
      cdpObj.setFieldValue("custrecord_date_expected_at_be",datain.date_expected_at_be); //Added by ajay 10May 2017
    }
    else
    {
      cdpObj.setFieldValue("custrecord_date_expected_at_be",''); //Added by ajay 10May 2017
    }
    var id = nlapiSubmitRecord(cdpObj,true,true);
    nlapiLogExecution("debug","updated cdp record id is :",id);
    if(id > 0)
    {
      if (datain.attachments != null && datain.attachments != "undefined") 
      {
        for(var j=0; j< datain.attachments.length; j++)
        {
          var url = datain.attachments[j];
          if(url != null && url != '')
          {
            url = url.split('/');
            var extn = url[url.length-1].split('.');
            extn = extn[extn.length-1];
            var fileName = url[url.length-1];
            var response = nlapiRequestURL(datain.attachments[j]);
            if(response.code == 200)
            {
              var csvDataInBase64 = response.getBody();
              if(GetExtnType(extn) != "")
              {
                var file = nlapiCreateFile(fileName, GetExtnType(extn), csvDataInBase64);				           
                file.setFolder(6707491);
                file.setEncoding('UTF-8');
                var fileId = nlapiSubmitFile(file);
                nlapiAttachRecord('file', fileId, 'customrecord_custom_diamond', id, null);
              }
            }
          }
        }		
      }

      err.status = "OK";
      err.message = "Success";			
    }    
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error occur during sync from Portal to NS',ex.message);
    err.status = "Failed";
    err.message= ex.message;        
  }
  return err;
}

function GetExtnType(extn)
{
  var type = "";
  switch(extn)
  {
    case "txt":
      type = "PLAINTEXT";
      break;
    case "pdf":
      type = "PDF";
      break;
    case "csv":
      type = "CSV";
      break;
    case "xls":
      type = "EXCEL";
      break;
    case "JPG":
      type = "JPGIMAGE";
      break;
    case "jpg":
      type = "JPGIMAGE";
      break;
    case "jpeg":
      type = "JPGIMAGE";
      break;
    case "png":
      type = "PNGIMAGE";
      break;
    case "gif":
      type = "GIFIMAGE";
      break;		
    default:
      break;
  }
  return type;
}

function GetDiamondStatus(itemStatus)
{
  switch (itemStatus)
  {
    case 1:
      itemStatus = '';
      break;
    case 2:
      itemStatus = '1';
      break;
    case 3:
      itemStatus = '4';
      break;
    case 4:
      itemStatus = '8';
      break;
    case 5:
      itemStatus = '2';
      break;
    case 6:
      itemStatus = '5';
      break;
    case 7:
      itemStatus = '3';
      break;
    default:
      itemStatus = '';
      break;
  }
  return itemStatus;
}

function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}
