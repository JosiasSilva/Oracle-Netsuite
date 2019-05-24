nlapiLogExecution("audit","FLOStart",new Date().getTime());
//var datain = {"is_revised_order": false, "revise_count": 0, "wait_cad": null, "attachments": [], "cad_due_date": null, "promo_item": "", "date_shipped_from_vendor": null, "diamond_eta": null, "po_id": "8175025", "drop_ship": true, "record_url": "", "ship_date": "12/19/2016", "portal_status": [2, 13], "certificate_included": [], "drop_ship_checklist": "", "certificate_status": null};

function UpdatePORecord(datain)
{
  //nlapiLogExecution('debug','WWW');
  //var valueCheck=nlapiLoadRecord('scriptdeployment',7203).getFieldValue('custscript_value_check_ns');
  //if(valueCheck=='T')
  //return;
  var err = new Object();
  err = {
    "status" : "",
    "message": ""
  }
  var portalArr = new Array();
  var portalmatch = 0;  var cad_revision = 0; var itemReceipt=0;
  nlapiLogExecution('DEBUG',"JSON ", JSON.stringify(datain));		
  /*nlapiLogExecution('DEBUG',"PO Id is : "+ datain.po_id);		
	nlapiLogExecution('DEBUG',"wait_cad is : "+ datain.wait_cad);		
	nlapiLogExecution('DEBUG',"attachments is : "+ datain.attachments);		
	nlapiLogExecution('DEBUG',"cad_due_date is : "+ datain.cad_due_date);		
	nlapiLogExecution('DEBUG',"diamond_eta is : "+ datain.diamond_eta);		
	nlapiLogExecution('DEBUG',"certificate_status is : "+ datain.certificate_status);		
	nlapiLogExecution('DEBUG',"ship_date is : "+ datain.ship_date);		
	nlapiLogExecution('DEBUG',"portal_status is : "+ datain.portal_status);		
	nlapiLogExecution('DEBUG',"is_revised_order is : "+ datain.is_revised_order);		
	nlapiLogExecution('DEBUG',"date_shipped_from_vendor is : "+ datain.date_shipped_from_vendor);		
	nlapiLogExecution('DEBUG',"drop_ship is : "+ datain.drop_ship);		
	nlapiLogExecution('DEBUG',"certificate_included is : "+ datain.certificate_included);
    nlapiLogExecution('DEBUG',"portal record url is : "+ datain.record_url);
    nlapiLogExecution('DEBUG',"drop ship checklist is : "+ datain.drop_ship_checklist);
	nlapiLogExecution('DEBUG',"cad approval date is : "+ datain.cad_approval_date);
    */
  //Date logic
  var currentDate = new Date();
  var day = currentDate.getDay();
  var newDate = null;
  if(0<= day  &&  day <= 4)
  {
    newDate = nlapiAddDays(currentDate,1);
    newDate = nlapiDateToString(newDate);
  }
  else if(day == 5)
  {
    newDate = nlapiAddDays(currentDate,3);
    newDate = nlapiDateToString(newDate);
  }
  else if(day == 6)
  {
    newDate = nlapiAddDays(currentDate,2);
    newDate = nlapiDateToString(newDate);
  }
  currentDate= nlapiDateToString(currentDate);
  //ended logic
  try
  {
    // Validate if mandatory record type is set in the request
    if (String(datain.is_revised_order) == "")
    {
      err = {
        "status" : "failed",
        "message": "missing"
      }
      //nlapiLogExecution("debug","is_revised_order is :",err.message);
      return JSON.stringify(err);
    }
    if (datain.po_id == "")
    {
      err = {
        "status" : "failed",
        "message": "missing"
      }
      //nlapiLogExecution("debug","po_id is :",err.message);
      return JSON.stringify(err);
    }
    if(datain.portal_status =="")
    {
      err = {
        "status" : "failed",
        "message": "missing"
      }
      //nlapiLogExecution("debug","portal_status is :",err.message);
      return JSON.stringify(err);
    }
    if(datain.ship_date =="")
    {
      err = {
        "status" : "failed",
        "message": "missing"
      }
      //nlapiLogExecution("debug","ship_date is :",err.message);
      return JSON.stringify(err);
    }
    if(String(datain.drop_ship) == "")
    {
      err = {
        "status" : "failed",
        "message": "missing"
      }
      //nlapiLogExecution("debug","drop_ship is :",err.message);
      return JSON.stringify(err);
    }
    if(datain.wait_cad =="")
    {
      err = {
        "status" : "failed",
        "message": "missing"
      }
      //nlapiLogExecution("debug","wait_cad is :",err.message);
      return JSON.stringify(err);
    }

    var poObj = nlapiLoadRecord("purchaseorder",parseInt(datain.po_id));
    if(datain.portal_status != null)
    {
      var approvedToGrow = poObj.getFieldValue("custbody_grow_confirmation");
      for(var i=0; i < datain.portal_status.length; i++)
      {
        if(datain.portal_status[i] =="")
        {
          err = {
            "status" : "failed",
            "message": "missing"
          }
          nlapiLogExecution("debug","portal_status1 is :",err.message);
          return JSON.stringify(err);
        }
        if(datain.portal_status[i] == 11)
        {
          portalmatch = 1;
        }
        if(datain.portal_status[i] == 10) //CAD Revision Needed
        {
          cad_revision = 1;
        }
        if(datain.portal_status[i] == 9) //CAD Approval Needed
        {
          datain.wait_cad = 37;
        }

        if(datain.portal_status[i] == 15)   // Drop Ship Approved 
        {
          poObj.setFieldValue("custbody365","15");
          itemReceipt = 1;
          nlapiLogExecution("debug","Drop Ship Approved matched");

          /*var filters = [];
                    filters.push(new nlobjSearchFilter("createdfrom",null,"is",parseInt(datain.po_id)));
                    filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
                    var cols = [];
                    cols.push(new nlobjSearchColumn("internalid"));
                    var searchResult = nlapiSearchRecord("itemreceipt",null,filters,cols);
                    if(searchResult != null)
                    {
                       var irId = searchResult[0].getValue(cols[0]);
                       nlapiLogExecution("debug","Existing old Item Receipt Id is :",irId);
                    }
                    else
                    {
                       poObj.setFieldValue("custbody365","15");
                       itemReceipt = 1;
                       nlapiLogExecution("debug","Drop Ship Approved matched");
                    }*/
        }
        //Added new code by Yagya 25 Aug 16
       /* if(approvedToGrow != null && approvedToGrow != "")
        {
          if(datain.portal_status[i] != 11) //Approved to Grow
          {
            //nlapiLogExecution("debug","approved To Grow",i);
            portalArr.push(datain.portal_status[i]);
          }
        }
        else
        {
          portalArr.push(datain.portal_status[i]);
        }*/
        // Modified on 21 APR 2018 [PP-331]
        portalArr.push(datain.portal_status[i]);
        //ended
      }
      nlapiLogExecution("debug","Set PORTAL STATUS : "+datain.po_id,JSON.stringify(portalArr));
      poObj.setFieldValue("custbody_portal_status",portalArr);
    }
    else if(datain.portal_status == null)
    {
      poObj.setFieldValue("custbody_portal_status","");
    }
    if(datain.ship_date != null && datain.ship_date != "undefined")
    {
      //nlapiLogExecution('DEBUG',"Ship Date is : "+ datain.ship_date);
      poObj.setFieldValue("custbody_po_ship_date",datain.ship_date);
    }
    else if(datain.ship_date == null)
    {
      poObj.setFieldValue("custbody_po_ship_date","");
    }
    if (datain.diamond_eta != null && datain.diamond_eta != "undefined") 
    {
      //nlapiLogExecution('DEBUG',"Diamond ETA is : "+ datain.diamond_eta);
      poObj.setFieldValue("custbody146",datain.diamond_eta);
    }
    else if(datain.diamond_eta == null)
    {
      poObj.setFieldValue("custbody146","");
    }
    if (datain.drop_ship == true) 
    {
      //nlapiLogExecution('DEBUG',"Drop Ship value is : "+ datain.drop_ship);
      poObj.setFieldValue("custbody39",nlapiDateToString(new Date()));
    }
    else if(datain.drop_ship == false)
    {
      poObj.setFieldValue("custbody39","");
    }
    if (datain.cad_due_date != null && datain.cad_due_date != "undefined") 
    {
      //nlapiLogExecution('DEBUG',"Cad Due Date is : "+ datain.cad_due_date);
      poObj.setFieldValue("custbody116",datain.cad_due_date);
    }
    else if(datain.cad_due_date == null)
    {
      poObj.setFieldValue("custbody116","");
    }
    if (datain.date_shipped_from_vendor != null && datain.date_shipped_from_vendor != "undefined") 
    {
      //nlapiLogExecution('DEBUG',"Date Shipped from Vendor is : "+ datain.date_shipped_from_vendor);
      poObj.setFieldValue("custbody209",datain.date_shipped_from_vendor);
    }
    else if(datain.date_shipped_from_vendor == null)
    {
      poObj.setFieldValue("custbody209","");
    }
    if (datain.certificate_status != null && datain.certificate_status != "undefined") 
    {
      //nlapiLogExecution('DEBUG',"Certificate Status is : "+ datain.certificate_status);
      poObj.setFieldValue("custbodycertificate_status",datain.certificate_status);
    }
    else if(datain.certificate_status == null)
    {
      //nlapiLogExecution('DEBUG',"certificate_status empty is : "+ datain.certificate_status);
      poObj.setFieldValue("custbodycertificate_status","");
    }
    if (datain.wait_cad != null && datain.wait_cad != "undefined") 
    {
      //nlapiLogExecution('DEBUG',"Wait cad value is : "+ datain.wait_cad);
      poObj.setFieldValue("custbody41",datain.wait_cad);
    }
    else if(datain.wait_cad == null)
    {
      nlapiLogExecution('DEBUG',"Unset Wait cad value:");
      poObj.setFieldValue("custbody41","");
      poObj.setFieldValue("custbody116",""); // CAD Due Date
    }
    if(portalmatch == 1 || cad_revision == 1)
    {
      poObj.setFieldValue("custbody124",nlapiDateToString(new Date()));
    }
    if(cad_revision == 1)
    {
      poObj.setFieldValue("custbody116",newDate); // CAD Due Date
    }

    if (datain.certificate_included != null && datain.certificate_included != "undefined")
    {
      for(var i=0; i < datain.certificate_included.length; i++)
      {
        if(datain.certificate_included[i] =="")
        {
          err = {
            "status" : "failed",
            "message": "missing"
          }
          nlapiLogExecution('DEBUG',"certificate_included is : "+ err.message);
          return JSON.stringify(err);
        }
        var item = datain.certificate_included[i].item_id;
        var certificate_included = datain.certificate_included[i].certificate_included;

        for(var j=1; j<= poObj.getLineItemCount('item'); j++)
        {
          var poItem = poObj.getLineItemValue('item','item',j);
          if(item == poItem)
          {
            poObj.setLineItemValue('item','custcol28',j,certificate_included);
          }
        }
      }
    }
    if(datain.record_url != null)
    {
      poObj.setFieldValue("custbody_po_portal_url",datain.record_url);
    }
    if(datain.drop_ship_checklist != null && datain.drop_ship_checklist != "")
    {
      poObj.setFieldValue("custbody_drop_ship_checklist_v1",datain.drop_ship_checklist);
    }
    if(datain.cad_approval_date != null && datain.cad_approval_date != "")
    {
      poObj.setFieldValue("custbody_cad_approval_date",datain.cad_approval_date);
    }
    //Added by ajay 30March 2017
    if(datain.date_needed_in_sf != null && datain.date_needed_in_sf != "undefined")
    {
      poObj.setFieldValue("custbody59",datain.date_needed_in_sf);
    }
    /*else if(datain.date_needed_in_sf == null)
        {
           poObj.setFieldValue("custbody59","");
        }*/
    if(datain.due_by_date_firm == true){
      poObj.setFieldValue("custbody81","T");
    }
    else if(datain.due_by_date_firm == false){
      poObj.setFieldValue("custbody81","F");
    }
    //ended
    //poObj.setFieldValue("custbody363",JSON.stringify(datain));
    poObj.setFieldValue("custbody369","936");
    //nlapiSubmitField ( 'scriptdeployment' ,7203,'custscript_value_check_ns' , 'T' , true );
    //Addded on 05 feb 2018 for DD Push Reason
    //if(datain.dd_push_reason!=null && datain.dd_push_reason!='')
    poObj.setFieldValue("custbody251",datain.dd_push_reason);
    //Addded on 05 feb 2018 for Delivery Date
    if(datain.delivery_date!=null && datain.delivery_date!='')
      poObj.setFieldValue("custbody6",datain.delivery_date);

    var id = nlapiSubmitRecord(poObj,true,true);
    //nlapiSubmitField ( 'scriptdeployment' ,7203,'custscript_value_check_ns' , 'F' , true );

    nlapiLogExecution('DEBUG',"Updated PO id is : "+ id);

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
                nlapiAttachRecord('file', fileId, 'purchaseorder', id, null);
              }
            }
          }
        }
      }
    }

    if(itemReceipt==1)
    {
      nlapiSubmitField("purchaseorder",id,"custbody364",'T');
      err = CreateItem_Receipt(id,err);
      nlapiLogExecution("debug","item Receipt created Successfully");
    }
    if(id > 0)
    {
      err = {
        "status" : "OK",
        "message": "Successfully Updated Purchase Order"
      }
      nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(err));
    }
    else
    {
      err = {
        "status" : "failed",
        "message": "Purchase Order did not updated"
      }
      nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(err));
    }
  }
  catch(er)
  {
    //nlapiSubmitField ( 'scriptdeployment' ,7203,'custscript_value_check_ns' , 'F' , true );
    nlapiLogExecution('DEBUG','Error occur during sync from Portal to NS is :  ',er.message);

    err = {
      "status" : "failed",
      "message": er.message
    }
    nlapiLogExecution("debug","JSON Response output in catch is :",JSON.stringify(err));
  }
  return JSON.stringify(err);
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
    case "PNG":
      type = "PNGIMAGE";
      break;
    case "gif":
      type = "GIFIMAGE";
      break;
    case "GIF":
      type = "GIFIMAGE";
      break;
    default:
      break;
  }
  return type;
}

//Added by ajay 21March 2017
function CreateItem_Receipt(pId,err)
{
  try{

    var obj = nlapiLookupField("purchaseorder",pId,["custbody39","entity"]);
    var dropShip = obj.custbody39;
    nlapiLogExecution("debug","dropShip is  : "+dropShip);
    var vendorId = obj.entity;
    var vendorLoc = nlapiLookupField("vendor",vendorId,"custentity138");

    var receipt = nlapiTransformRecord("purchaseorder",pId,"itemreceipt");
    if(dropShip != "" )
    {			
      for(var x=0; x < receipt.getLineItemCount("item"); x++)
      {
        nlapiLogExecution("debug","vendor location is  : "+vendorLoc);
        receipt.setLineItemValue("item","itemreceive",x+1,"T");				
        receipt.setLineItemValue('item','location',x+1,vendorLoc); //vendor location				
      }						
    }
    else 
    {
      for(var x=0; x < receipt.getLineItemCount("item"); x++)
      {			
        receipt.setLineItemValue("item","itemreceive",x+1,"T");				
        receipt.setLineItemValue('item','location',x+1,2); //San Francisco				
      }		
    }
    var irId = nlapiSubmitRecord(receipt,true,true);
    nlapiLogExecution("debug","PO is received successfully and created item receipt id is : "+irId);
    irId = Update_ItemReceipt(irId,dropShip,vendorLoc);
    if(irId > 0)
    {
      err = {
        "status" : "OK",
        "message": "Item Receipt created successfully"
      }
    }
  }catch(ex)
  {
    err = {
      "status" : "failed",
      "message": ex.message
    }
  }
  return err;
}
//Ended by ajay 21March 2017

function Update_ItemReceipt(irId,dropShip,vendorLoc)
{
  var receipt = nlapiLoadRecord("itemreceipt",irId);
  for(var x=0; x < receipt.getLineItemCount("item"); x++)
  {
    if(dropShip != "")
    {
      receipt.setLineItemValue("item","itemreceive",x+1,"T");                
      receipt.setLineItemValue('item','location',x+1,vendorLoc); //vendor location
    }
    else
    {
      receipt.setLineItemValue("item","itemreceive",x+1,"T");                
      receipt.setLineItemValue('item','location',x+1,2); //San Francisco
    }                
  } 
  var id = nlapiSubmitRecord(receipt);
  return id;
}


