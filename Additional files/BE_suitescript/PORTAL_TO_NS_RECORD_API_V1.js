//var datain = {"cdp_id" : 2785, "action_needed" : [2,3,4], "item_status": 1, "attachments" :['https://testportal.brilliantearth.com/media/order/attach/01/05/PORTAL_TO_NS_RECORD_API_1.2.pdf','https://testportal.brilliantearth.com/media/order/attach/01/05/Book1.csv'], "tracking_no" : 231456, "ship_date" :"11/01/2016", "clear_ship" :true, "clear_invoice" :false}// New Format

function UpdateRecord(datain)
{
    var err = new Object();
    var actionArr = new Array();
    
    nlapiLogExecution('DEBUG',"Action Needed Value : "+ datain.action_needed);		
    nlapiLogExecution('DEBUG',"Ship Date Value : "+ datain.ship_date);
    nlapiLogExecution('DEBUG',"Item Status Value : "+ datain.item_status);
    nlapiLogExecution('DEBUG',"Tracking No Value : "+ datain.tracking_no);
    nlapiLogExecution('DEBUG',"CDP Id is : "+ datain.cdp_id);
    nlapiLogExecution('DEBUG',"Diamond Portal Url is : "+ datain.record_url);
    
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
		var diamondStatus = GetDiamondStatus(datain.item_status);
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
			cdpObj.setFieldValue("custrecord_diamond_status",2);
			cdpObj.setFieldValue("custrecord_item_status",8);
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
			return err;
		}    
   }
   catch(err)
   {
        nlapiLogExecution('DEBUG','Error occur during sync from Portal to NS',err.message);
        err.status = "Failed";
        err.message= err.message;
        return err;
   }
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
