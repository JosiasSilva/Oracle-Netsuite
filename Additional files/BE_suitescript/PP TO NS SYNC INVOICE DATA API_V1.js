/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	PP-264 (Invoice Feature)
	@Script Type   				:-	Restlet Script
	@Created Date  				:-	Aug 30, 2017
	@Last Modified Date 		:-  Aug 30, 2017
	@Comments                 	: 	Script will update Purchase Order item details
	@Live Restlet Script		:-	/app/common/scripting/script.nl?id=1993
*/


/*var url ='/app/site/hosting/restlet.nl?script=1293&deploy=1';
var datain = {"Status": [2, 8],"Invoice_Attachment": ["https://testportal.brilliantearth.com/media/po/message/06/15/110test.jpg"],"PurchaseOrder_Id": "11772021","Item_data":{"Total_Cost":11.1,"Invoice_Data" : "6/12/2017","Item" : 30124,"Gram_Weight" : 1.1,"Invoice_Number" : "VBHG123","DWT_Weight" : 1.1}};

var headers = new Array();
headers['Content-type'] = 'application/json';
headers['Authorization'] = 'NLAuth nlauth_email=nsconsultant@brilliantearth.com, nlauth_signature=N58@p9bzu7#x, nlauth_account=666639, nlauth_role=3';
var result = nlapiRequestURL(url,datain, headers);

var t=0;
//var datain = {"Status": [2, 8],"Invoice_Attachment": ["https://testportal.brilliantearth.com/media/po/message/06/15/110test.jpg"],"PurchaseOrder_Id": "11772021","Item_data":{"Total_Cost":11.1,"Invoice_Data" : "6/12/2017","Item" : 30124,"Gram_Weight" : 1.1,"Invoice_Number" : "VBHG123","DWT_Weight" : 1.1}};
var datain = {"Status":[2,8],"Invoice_Attachment":["https://testportal.brilliantearth.com/media/po/message/06/15/110test.jpg"],"PurchaseOrder_Id":"11772021","Item_data":[{"Iine_Id":1,"Total_Cost":11.1,"Invoice_Date":"6/12/2017","Gram_Weight":1.1,"Item_Id":525971,"Invoice_Number":"VBHG123","DWT_Weight":1.1}]}

var h=PP_TO_NS_SYNC_INVOICE_DATA(datain);
var t = 0;
*/

function PP_TO_NS_SYNC_INVOICE_DATA(datain) {
  try 
  {
    nlapiLogExecution('debug', 'Yagya Invoice Request Data ', JSON.stringify(datain));
    // SendEmail(JSON.stringify(datain)); 
    var err = new Object();
    err = {
      "status": "failed",
      "message": "Data Not Found"
    };
    if (datain != null && datain != '') 
    {
      var PurchaseOrder_Id = datain.PurchaseOrder_Id;
      if (PurchaseOrder_Id == '' && PurchaseOrder_Id == null) 
      {
        err.message = 'PurchaseOrder_Id Not Found';
        return err;
      }
      var Item_data = datain.Item_data;
      if (Item_data != '' && Item_data != null) 
      {
        nlapiLogExecution('debug', 'PurchaseOrder_Id', PurchaseOrder_Id);
        var obj = nlapiLoadRecord('purchaseorder', PurchaseOrder_Id);
        obj.setFieldValue('custbody_portal_status', datain.Status);
        obj.setFieldValue('custbodyshipping_cost_per_po', datain.Shipping_Cost);
        var count = obj.getLineItemCount('item');
        if (count != '' && count != null) 
        {
          var LineArr = [];
          for (var z = 1; z <= count; z++) 
          {
            var Item = obj.getLineItemValue('item', 'item', z);
            for(var u=0; u<Item_data.length; u++)
            {
              var  line_id = Item_data[u].Line_Id;
              if(line_id == '' || line_id == null)
              {
                err.message = 'Missing line_id';
                return err;
              }
              if (Item_data[u].Item_Id == Item && LineArr.indexOf(Item_data[u].Line_Id) == -1) 
              {
                obj.setLineItemValue('item', 'custcol24', z, Item_data[u].Gram_Weight);
                obj.setLineItemValue('item', 'custcol14', z, Item_data[u].DWT_Weight);
                obj.setLineItemValue('item', 'rate', z, Item_data[u].Total_Cost);
                obj.setLineItemValue('item', 'custcol_invoice_number', z, Item_data[u].Invoice_Number);

                try
                {
                  obj.setLineItemValue('item', 'custcolvendor_cost', z, Item_data[u].Total_Cost);
                  if(Item_data[u].Total_Cost)
                  {

                    obj.setLineItemValue('item', 'custcolinvoice_portal_sync_complete', z, 'T');
                  }
                  obj.setLineItemValue('item', 'custcolshipping_cost', z, Item_data[u].Sub_Shipping_Cost);
                }
                catch(qwe)
                {
                  nlapiLogExecution("debug", "Vendor cost :");
                }


                if(Item_data[u].Invoice_Date)
                {
                  obj.setLineItemValue('item', 'custcol_invoice_date', z, Item_data[u].Invoice_Date);
                }
                else
                {
                  obj.setLineItemValue('item', 'custcol_invoice_date', z, '');
                }
                LineArr.push(Item_data[u].Line_Id)
                break;
              }
            }
          }
        }
        var id = nlapiSubmitRecord(obj, true, true);
        nlapiLogExecution("debug", "updated PO record id is :", id);
        if (id > 0) 
        {
          if (datain.Invoice_Attachment != null && datain.Invoice_Attachment != "undefined") 
          {
            for (var j = 0; j < datain.Invoice_Attachment.length; j++) 
            {
              var url = datain.Invoice_Attachment[j];
              if (url != null && url != '') 
              {
                url = url.split('/');
                var extn = url[url.length - 1].split('.');
                extn = extn[extn.length - 1];
                var fileName = url[url.length - 1];
                var response = nlapiRequestURL(datain.Invoice_Attachment[j]);
                if (response.code == 200) 
                {
                  var csvDataInBase64 = response.getBody();
                  if (GetExtnType(extn) != "") 
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
        err.status = "OK";
        err.message = "Success";
      }
    }
  } 
  catch (er) 
  {       
    err = {
      "status": "failed",
      "message": er.message
    }
    nlapiLogExecution('DEBUG', 'Error occur during sync from Portal to NS is :  ', er.message);
  }
  nlapiLogExecution("debug", "Response output in catch is :", JSON.stringify(err));
  return err;
}

function GetExtnType(extn) 
{
  var type = "";
  switch (extn) 
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
function SendEmail(body)
{
  try
  {
    if(body)
    {
      nlapiSendEmail('-5' , ['yagya.kumar@inoday.com'] , 'Script 1293' , body , null , null , null , null,true ) ;
      nlapiLogExecution("Debug", "Email has been send to ");
    }
  }
  catch(p){
    nlapiLogExecution("Debug", "Email has been send to ",p);
  }
}