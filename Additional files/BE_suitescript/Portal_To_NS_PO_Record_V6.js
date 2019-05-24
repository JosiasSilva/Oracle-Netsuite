//var datain = {"is_revised_po" : true,"po_id" : 2785, "portal_status" : [2,3,4], "ship_date": 11/01/2016, "diamond_eta" : 11/01/2016, "drop_ship" :true, "cad_due_date" :11/01/2016, "date_shipped_from_vendor" :11/01/2016,"certificate_status" :2,"certificate_included":true,wait_cad" :1,"attachments" :['https://testportal.brilliantearth.com/media/order/attach/01/05/PORTAL_TO_NS_RECORD_API_1.2.pdf']}

//var datain = {"wait_cad":null,"attachments":[],"cad_due_date":null,"po_id":"7023678","diamond_eta":"04/18/2016","certificate_status":null,"ship_date":"05/06/2016","portal_status":[4,2],"is_revised_order":false,"date_shipped_from_vendor":null,"drop_ship":false,"certificate_included":[]};


function UpdatePORecord(datain)
{
	nlapiLogExecution('debug','WWW');
    var valueCheck=nlapiLoadRecord('scriptdeployment',7203).getFieldValue('custscript_value_check_ns');
	if(valueCheck=='T')
             return;
    var err = new Object();
    var portalArr = new Array();
	var portalmatch = 0;  var cad_revision = 0; var itemReceipt=0;
    nlapiLogExecution('DEBUG',"JSON ", JSON.stringify(datain));		
    nlapiLogExecution('DEBUG',"PO Id is : "+ datain.po_id);		
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
			err.status = "failed";
			err.message= "missing is_revised_order";
                        nlapiLogExecution("debug","is_revised_order is :",err.message);
			return err;
		}
		if (datain.po_id == "")
		{
			err.status = "failed";
			err.message= "missing po_id";
                        nlapiLogExecution("debug","po_id is :",err.message);
			return err;
		}
		if(datain.portal_status =="")
		{
			err.status = "failed";
			err.message= "missing portal_status values to be update";
                        nlapiLogExecution("debug","portal_status is :",err.message);
			return err;
		}
		if(datain.ship_date =="")
		{
			err.status = "failed";
			err.message= "missing ship_date";
                        nlapiLogExecution("debug","ship_date is :",err.message);
			return err;
		}
		if(String(datain.drop_ship) == "")
		{
			err.status = "failed";
			err.message= "missing drop_ship";
                        nlapiLogExecution("debug","drop_ship is :",err.message);
			return err;
		}
		if(datain.wait_cad =="")
		{
			err.status = "failed";
			err.message= "missing wait_cad";
                        nlapiLogExecution("debug","wait_cad is :",err.message);
			return err;
		}
                nlapiLogExecution("debug","Load PO Record is started");		
		var poObj = nlapiLoadRecord("purchaseorder",parseInt(datain.po_id));
		nlapiLogExecution("debug","Load PO Record");		
		if(datain.portal_status != null)
		{
			var approvedToGrow = poObj.getFieldValue("custbody_grow_confirmation");
			for(var i=0; i < datain.portal_status.length; i++)
			{
				if(datain.portal_status[i] =="")
				{
					err.status = "failed";
					err.message= "missing portal status value to be update";
                        nlapiLogExecution("debug","portal_status1 is :",err.message);
					return err;
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
				// Added by Rahul Panchal on 08 Sep 2016
				if(datain.portal_status[i] == 15)   // Drop Ship Approved 
				{
				  var receiptId=poObj.getLineItemValue("links","tranid",1);
				  if(receiptId==null)
				  {
				    itemReceipt =1;
				  }
				}
				// Ended by Rahul Panchal
				//Added new code by Yagya 25 Aug 16
				if(approvedToGrow != null && approvedToGrow != "")
				{
					if(datain.portal_status[i] != 11) //Approved to Grow
					{
						nlapiLogExecution("debug","approved To Grow",i);
						portalArr.push(datain.portal_status[i]);						
					}					
				}					
				else
				{
					portalArr.push(datain.portal_status[i]);
				}
				//ended

				//portalArr[i] = datain.portal_status[i];
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
			nlapiLogExecution('DEBUG',"Ship Date is : "+ datain.ship_date);
			poObj.setFieldValue("custbody_po_ship_date",datain.ship_date);
		}
		else if(datain.ship_date == null)
		{
			poObj.setFieldValue("custbody_po_ship_date","");
		}
		if (datain.diamond_eta != null && datain.diamond_eta != "undefined") 
		{			
			nlapiLogExecution('DEBUG',"Diamond ETA is : "+ datain.diamond_eta);
			poObj.setFieldValue("custbody146",datain.diamond_eta);
		}
		else if(datain.diamond_eta == null)
		{
			poObj.setFieldValue("custbody146","");
		}
		if (datain.drop_ship == true) 
		{			
			nlapiLogExecution('DEBUG',"Drop Ship value is : "+ datain.drop_ship);
			poObj.setFieldValue("custbody39",nlapiDateToString(new Date()));
		}
		else if(datain.drop_ship == false)
		{
			poObj.setFieldValue("custbody39","");
		}
		if (datain.cad_due_date != null && datain.cad_due_date != "undefined") 
		{			
			nlapiLogExecution('DEBUG',"Cad Due Date is : "+ datain.cad_due_date);
			poObj.setFieldValue("custbody116",datain.cad_due_date);
		}
		else if(datain.cad_due_date == null)
		{
			poObj.setFieldValue("custbody116","");
		}
		if (datain.date_shipped_from_vendor != null && datain.date_shipped_from_vendor != "undefined") 
		{			
			nlapiLogExecution('DEBUG',"Date Shipped from Vendor is : "+ datain.date_shipped_from_vendor);
			poObj.setFieldValue("custbody209",datain.date_shipped_from_vendor);
		}
		else if(datain.date_shipped_from_vendor == null)
		{
			poObj.setFieldValue("custbody209","");
		}
		if (datain.certificate_status != null && datain.certificate_status != "undefined") 
		{			
			nlapiLogExecution('DEBUG',"Certificate Status is : "+ datain.certificate_status);
			poObj.setFieldValue("custbodycertificate_status",datain.certificate_status);
		}
		else if(datain.certificate_status == null)
		{
            nlapiLogExecution('DEBUG',"certificate_status empty is : "+ datain.certificate_status);
			poObj.setFieldValue("custbodycertificate_status","");
		}
		if (datain.wait_cad != null && datain.wait_cad != "undefined") 
		{			
			nlapiLogExecution('DEBUG',"Wait cad value is : "+ datain.wait_cad);
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
					err.status = "failed";
					err.message= "missing certificate included value to be update";
                    nlapiLogExecution('DEBUG',"certificate_included is : "+ err.message);
					return err;
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
		//Added by ajay 10Nov 2016
		if(datain.drop_ship_checklist != null && datain.drop_ship_checklist != "")
        {
          var dropShips = []; //Added by ajay 08Dec 2016
			var dropShipArr =  datain.drop_ship_checklist.split(',');
			//Added by ajay 08Dec 2016
			for(var k=0; k < dropShipArr.length; k++)
			{
                dropShips.push(dropShipArr[k]);
            }
			var dropShipArr =  datain.drop_ship_checklist.split(',');
            //poObj.setFieldValue("custbody_drop_ship_checklist",dropShipArr);
            poObj.setFieldValue("custbody_drop_ship_checklist_v1",dropShips);
        }
		//Ended by ajay 10Nov 2016
      
		nlapiSubmitField ( 'scriptdeployment' ,7203,'custscript_value_check_ns' , 'T' , true );
		var id =nlapiSubmitRecord(poObj,true,true);
		nlapiSubmitField ( 'scriptdeployment' ,7203,'custscript_value_check_ns' , 'F' , true );

		nlapiLogExecution('DEBUG',"Updated PO id is : "+ id);
		// Added by Rahul Panchal on 08 Sep 2016
		if(itemReceipt==1)
		{	  
		   createItem_receipt(poObj);                               
		   nlapiLogExecution("debug","item Receipt created Successfully");			
		}
		//Ended 
		
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
			err.status = "OK";
			err.message= "Successfully Updated Purchase Order";
			nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(err));
			return err;
		}    
    }
    catch(er)
    {
	nlapiSubmitField ( 'scriptdeployment' ,7203,'custscript_value_check_ns' , 'F' , true );
        nlapiLogExecution('DEBUG','Error occur during sync from Portal to NS is :  ',er.message);
        
        resObj = {
			"status" : "failed",
			"message": er.message
		}
		 nlapiLogExecution("debug","JSON Response output in catch is :",JSON.stringify(resObj));
		return resObj;
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

// function added by Rahul Panchal 08 Sep 2016
function createItem_receipt(poObj)
{
    		var poId=poObj.getFieldValue("id");
			if(poId!=''|| poId!=null)
			{
				var receipt = nlapiTransformRecord("purchaseorder",poId,"itemreceipt");
				var count=receipt.getLineItemCount('item');
				for(var t=1;t<=count;t++)
				{
				var location=receipt.getLineItemValue('item','location',t);
				if(location==null)
				{
				   receipt.setLineItemValue('item','location',t,2);
				   
				}
				}
			nlapiSubmitRecord(receipt,true,true);
								
			}
}
