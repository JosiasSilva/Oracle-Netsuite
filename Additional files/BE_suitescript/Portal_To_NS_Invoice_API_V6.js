// Update list records of custom Diamond NetSuite for Invoice API
//var datain= {"cdp_data":[{"cdp_id":2756,"action_needed":[2,3]}],"invoice_no":"12345", "shipping_cost":122.0, "comment" :"test comments","misc_adjustments" :1.2,"attachments" :['https://testportal.brilliantearth.com/media/order/attach/01/05/PORTAL_TO_NS_RECORD_API_1.2.pdf','https://testportal.brilliantearth.com/media/order/attach/01/05/Book1.csv']};

//---------------------------------------------------------New Script Code--------------------------------

function UpdateInvoiceRecord(datain)
{
        var err = new Object();
	var actionArr = new Array();
	var newAttachment = new Array();
	var vendorName = '';
        var jsonobj = null;
        var fileIdArr = new Array();
        var invoiceDate = null;
		
        if(datain.invoice_date != null && datain.invoice_date != "")
        {
            var stDate = datain.invoice_date.split('-');
            invoiceDate = stDate[1]+'/'+stDate[2].split(' ')[0]+'/'+stDate[0];
        }
    try
    {	
	    if(datain != null)
	    {
		    fileIdArr = AttachFileInNS(datain);
                    nlapiLogExecution("debug","file array is :",fileIdArr);
                    nlapiLogExecution("debug","file array length is :",fileIdArr.length);
		    //newAttachment.push(fileId);
		    if(datain.cdp_data != null)
		    {
				var pos = [];
				var items = [];
				var cdp_item_map = [];
				var flag = 0;
				for(var i=0; i < datain.cdp_data.length; i++)
				{
                                        nlapiLogExecution("debug","CDP Id is :",datain.cdp_data[i].cdp_id);
                                        // Validate if mandatory record type is set in the request
					if (!datain.cdp_data[i].cdp_id)
					{
						err.status = "failed";
						err.message= "missing cdp_id";
						return err;
					}
					if(datain.cdp_data[i].action_needed != null)
					{
						for(var j=0; j < datain.cdp_data[i].action_needed.length; j++)
						{
							if(datain.cdp_data[i].action_needed[j] =="")
							{
								err.status = "failed";
								err.message= "missing action needed value to be update";
								return err;
							}
							actionArr[j] = datain.cdp_data[i].action_needed[j];
						}				
					}
									
					if(datain.invoice_no =="")
					{
						err.status = "failed";
						err.message= "missing value of invoice number for update";
						return err;
					}
					if(datain.shipping_cost ==""  &&  datain.shipping_cost != '')
					{
						err.status = "failed";
						err.message= "missing value of shipping cost for update";
						return err;
					}
					if(datain.misc_adjustments ==""  &&  datain.misc_adjustments != '')
					{
						err.status = "failed";
						err.message= "missing value of misc adjustments for update";
						return err; 
					}
					if(datain.attachments != null)
					{
						for(var k=0; k < datain.attachments.length; k++)
						{
							if(datain.attachments[k] =="")
							{
								err.status = "failed";
								err.message= "missing attachments value to be update";
								return err;
							}
						}
					}
					
					var itemId = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_be_diamond_stock_number");	
                                        var itemName = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_be_diamond_stock_number",true);				
					var poId = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_diamond_po_number");	
                                        var avgCost = nlapiLookupField("inventoryitem",itemId,"averagecost"); //added by ajay
                                        var grandTotal = parseFloat(avgCost) + parseFloat(datain.shipping_cost) + parseFloat(datain.misc_adjustments);
                                        var vendor_Id = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_custom_diamond_vendor");

					//Added ajay new requirement by client 25july 2016                                        
                                        var filters = new Array();
                                        
                                        //case 1 : invoice # is an exact match of an existing NetSuite bill                                        
                                        filters[0] = nlobjSearchFilter("tranid",null,"is",datain.invoice_no);     
                                        filters[1] = nlobjSearchFilter("entity",null,"is",vendor_Id);  
                                   
                                        var searchRecord = nlapiSearchRecord("vendorbill",null,filters,null);
                                        if(searchRecord != null)
                                        {
                                           var id = searchRecord[0].getId(); 
                                           if(id > 0)
                                           {
                                                SendMail(1,datain.invoice_no,fileIdArr);
                                                err.status = "OK";
						err.message= "Portal invoice is an exact match in NetSuite bill.";
					        return err;
                                           }
                                        }
                                        
                                        //case 2 : date of the invoice and amount of the invoice is an exact match for an existing NetSuite bill
                                        filters = new Array();
                                        filters[0] = nlobjSearchFilter("trandate",null,"on",invoiceDate); 
                                        filters[1] = nlobjSearchFilter("mainline",null,"is","T"); //Added by ajay 23Nov 2016
                                        var searchRecord = nlapiSearchRecord("vendorbill",null,filters,null);
                                        if(searchRecord != null)
                                        {
                                           var prevId = 0;
                                           for(var m=0; m<searchRecord.length; m++)
                                           {
                                               var id = searchRecord[m].getId(); 
                                               if(id > 0)
                                               {
                                                   if(prevId != id)
                                                   {
                                                        var billObj = nlapiLoadRecord("vendorbill",id);
                                                        var usertotal = billObj.getFieldValue("usertotal");
                                                        var shippingCost = billObj.getFieldValue("custbody_portal_shipping_cost");
                                                        var miscAdjustment = billObj.getFieldValue("custbody_portal_misc_adjustments");
                                                        var totalCost = parseFloat(usertotal) + parseFloat(shippingCost) + parseFloat(miscAdjustment);
                                                        if(totalCost == grandTotal)
                                                        {                                                   
                                                            SendMail(2,datain.invoice_no,fileIdArr);
                                                            err.status = "OK";
                                                            err.message= "Portal date of the invoice and amount of the invoice is an exact match for an existing NetSuite bill.";
                                                            return err;
                                                        }
                                                   }
                                                   prevId = id;
                                               }
                                           }//end for loop
                                        }
                                        
                                        //case 3 : item has already been billed on a purchase order                                        
                                        filters = new Array();
                                        filters[0] = nlobjSearchFilter("type","transaction","anyOf","VendBill");                                        
                                        filters[1] = nlobjSearchFilter("internalid",null,"anyOf",itemId);
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid","transaction"));
                                        var searchRecord = nlapiSearchRecord('item',null,filters ,cols);
                                        if(searchRecord != null)
                                        {
                                           var id = searchRecord[0].getValue(cols[0]); 
                                           if(id > 0)
                                           {
                                                SendMail(3,datain.invoice_no,fileIdArr);
                                                err.status = "OK";
						err.message= "Portal diamond item has been already billed on a purchase order.";
					        return err;       
                                           }
                                        }                                        
                                        //Ended by ajay
					
                                        if(poId > 0)
					{
						pos.push(poId);
							items.push(itemId);
							cdp_item_map.push({
								item : itemId,
								cdp : datain.cdp_data[i].cdp_id,
								po : poId,
								itemName : itemName
							});							
					}
					else
					{
						var filters = [];
						filters.push(new nlobjSearchFilter("type",'transaction',"anyOf",'PurchOrd'));
						filters.push(new nlobjSearchFilter("internalid",null,"anyOf",itemId));
						var cols = [];
						cols.push(new nlobjSearchColumn("internalid","transaction"));
						cols.push(new nlobjSearchColumn("trandate","transaction"));
						//var results = nlapiSearchRecord('item',null,filters ,cols);
                                                var results = nlapiSearchRecord('item',4332,filters ,cols);
						if(results != null)
						{
							poId = results[0].getValue(cols[0]);
							if(poId > 0)
							{
								pos.push(poId);
									items.push(itemId);
									cdp_item_map.push({
										item : itemId,
										cdp : datain.cdp_data[i].cdp_id,
										po : poId,
										itemName : itemName
									});							
							}
							else
							{
								flag = 1;
                                                                cdp_item_map.push({
									item : itemId,
									cdp : datain.cdp_data[i].cdp_id,
                                                                        po : poId,
								        itemName : itemName
								});
							}
						}
                                                else
                                                {
                                                       flag = 1;
                                                       cdp_item_map.push({
									item : itemId,
									cdp : datain.cdp_data[i].cdp_id,
                                                                        po : poId,
								        itemName : itemName
								});
                                                }						
					}				                       
				}
				
				//Create Vendor Bills as Necessary
                                var id = 0; // added by ajay
				if(pos.length > 0 && flag == 0)
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"anyof",pos));
					filters.push(new nlobjSearchFilter("item",null,"anyof",items));
					var cols = [];
					cols.push(new nlobjSearchColumn("item"));
					cols.push(new nlobjSearchColumn("line"));
                                        cols.push(new nlobjSearchColumn("status")); // Added by ajay
					cols.push(new nlobjSearchColumn("preferredlocation","item"));
					cols.push(new nlobjSearchColumn("averagecost","item"));
					cols.push(new nlobjSearchColumn("purchasedescription","item"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						var count = 0;
						//Get vendor from one of the CDPs
						var vendorId = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[0].cdp_id,"custrecord_custom_diamond_vendor");
						vendorName = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[0].cdp_id,"custrecord_custom_diamond_vendor",true);
						
						var record = nlapiCreateRecord('vendorbill');
						record.setFieldValue("customform",121);
						record.setFieldValue("entity",vendorId); 
						//record.setFieldValue("trandate",nlapiDateToString(new Date())); 
                                                record.setFieldValue("trandate",invoiceDate); 
						//record.setFieldValue("postingperiod",GetPeriod()); //commented by ajay 30Sept2016
						//Added by ajay 30Sept2016
						if(datain.invoice_date != "" )
						{
							var postingperiod = GetPeriodDate(datain.invoice_date);
							record.setFieldValue("postingperiod",postingperiod);
							nlapiLogExecution('debug','Posting Period Date :', postingperiod);
						}
						//Ended
						record.setFieldValue("exchangerate","1.0");					
						record.setFieldValue("terms", nlapiLookupField("vendor",vendorId,"terms")); 
						record.setFieldValue("tranid", datain.invoice_no);

						record.setFieldValue("custbody_portal_invoice_number",datain.invoice_no);
						record.setFieldValue("custbody_portal_shipping_cost",datain.shipping_cost);					
						record.setFieldValue("custbody_portal_invoice_comments",datain.comment);
						record.setFieldValue("custbody_portal_misc_adjustments",datain.misc_adjustments);
						
						for(var x=0; x < results.length; x++)
						{
                                                        //if(results[x].getValue("status") =="pendingBilling" || results[x].getValue("status") == "pendingReceipt")//added by ajay
							if(results[x].getValue("status") !="closed")//added by ajay
						    {
                                                        count = count + 1; // Added by ajay
							record.selectNewLineItem("item");
							record.setCurrentLineItemValue("item","item",results[x].getValue("item"));
							var loc = results[x].getValue("preferredlocation","item");
							if(loc != "")
							{
								record.setCurrentLineItemValue('item','location', loc);
							}
							else
							{
								record.setCurrentLineItemValue('item','location', 2);
							}
							record.setCurrentLineItemValue("item","description",results[x].getValue("purchasedescription","item"));
							record.setCurrentLineItemValue("item","quantity",1);
							record.setCurrentLineItemValue("item","orderdoc",results[x].getId()); //PO Internal ID
							record.setCurrentLineItemValue("item","orderline",results[x].getValue("line")); //PO Line #
							
							//Look up price from CDP
							for(var i=0; i < cdp_item_map.length; i++)
							{
								if(cdp_item_map[i].item == results[x].getValue("item"))
								{
									var thisCDP = cdp_item_map[i].cdp;
									//record.setCurrentLineItemValue("item","quantity",nlapiLookupField("customrecord_custom_diamond",thisCDP,"custrecord_custom_diamond_price"));
								}
							}							
							record.commitLineItem("item");
                                                    }// ended status logic
						}
						
						if(count == results.length) //Added by ajay
						{
                            //Added By Pankaj Jadaun Jira link (DP-194)
                            var shiping_cost_value=parseFloat(datain.shipping_cost);
							if(shiping_cost_value>0)
                             {							
								record.selectNewLineItem ( 'expense' );
								record.setCurrentLineItemValue ( 'expense' , 'account' , '89' );  
								record.setCurrentLineItemValue ( 'expense' , 'location' , '2' );  
								record.setCurrentLineItemValue ( 'expense' , 'amount' , shiping_cost_value );  
								record.commitLineItem ( 'expense' );
                             }				  
							//End by Pankaj
                            
							id = nlapiSubmitRecord(record , true, true);
							nlapiLogExecution("debug","created vendor bill id is :"+id);
							if(id > 0)
							{
                                                                for(var r=0; r< fileIdArr.length; r++){
								       nlapiAttachRecord('file', fileIdArr[r], 'vendorbill', id, null);
                                                                }
                                                                for(var f=0; f< cdp_item_map.length; f++)
								{																	                          
									//nlapiSubmitField("customrecord_custom_diamond",cdp_item_map[f].cdp,"custrecord_action_needed",actionArr);
									SendInvoicedStatusToPortal(cdp_item_map[f].cdp); //Added by ajay 30Sept2016
								}
							}//End submit record condition								
						}
					}
				}

                                if(id == 0)
				{                                        
					for(var c=0; c<cdp_item_map.length; c++)
					{
                                                //nlapiSubmitField("customrecord_custom_diamond",cdp_item_map[c].cdp,"custrecord_action_needed",actionArr);
                                                var fileIdStr = "";
						var vendor = nlapiLookupField("customrecord_custom_diamond",cdp_item_map[c].cdp,"custrecord_custom_diamond_vendor");
						var pendingBillObj = nlapiCreateRecord("customrecord_pending_inv_for_cdp");
						pendingBillObj.setFieldValue("name",cdp_item_map[c].itemName);
						pendingBillObj.setFieldValue("custrecord_cdp_id",cdp_item_map[c].cdp);
						if(cdp_item_map[c].po != null && cdp_item_map[c].po != "")
						{
							pendingBillObj.setFieldValue("custrecord_pending_po_creation",'F');
						}
						else
						{
							pendingBillObj.setFieldValue("custrecord_pending_po_creation",'T');
						}
						pendingBillObj.setFieldValue("custrecord_diamond_stock_no",cdp_item_map[c].item);
						pendingBillObj.setFieldValue("custrecord_portal_invoice_no",datain.invoice_no);
						pendingBillObj.setFieldValue("custrecord_portal_shipping_cost",datain.shipping_cost);
						pendingBillObj.setFieldValue("custrecord_cdp_portal_comments",datain.comment);
						pendingBillObj.setFieldValue("custrecord_misc_adjustment",datain.misc_adjustments);
						pendingBillObj.setFieldValue("custrecord_cdp_portal_vendor",vendor);
						pendingBillObj.setFieldValue("custrecord_po_number",cdp_item_map[c].po);
						pendingBillObj.setFieldValue("custrecord_invoice_date",GetDateFormat(datain.invoice_date)); // added by ajay 30Sept 2016                      						
						for(var r=0; r < fileIdArr.length; r++){
							if(fileIdStr == "")
							{
								fileIdStr = ''+fileIdArr[r]+'';
							}
							else
							{
								fileIdStr = fileIdStr + ','+''+fileIdArr[r]+'';
							}
						}
						pendingBillObj.setFieldValue("custrecord_attach_files",fileIdStr);
						var customRecId = nlapiSubmitRecord(pendingBillObj,true,true);
                                                nlapiLogExecution("debug","Files array value is :",fileIdArr);
                                                nlapiLogExecution("debug","Files array string value is :",fileIdStr);
                                                nlapiSubmitField("customrecord_pending_inv_for_cdp",customRecId,"custrecord_attach_files",fileIdStr);
						for(var r=0; r < fileIdArr.length; r++){
							  nlapiAttachRecord('file', fileIdArr[r], 'customrecord_pending_inv_for_cdp', customRecId, null);
						}
						nlapiLogExecution("debug","Created custom record Id for portal invoice api is :",customRecId);
					}
				}

                                err.status = "OK";
				err.message= "Successfully created vendor bill in NS";
                                nlapiLogExecution("debug","Successfully created vendor bill in NS.");
				return err;		        
		    }
	    }
    }
    catch(err)
    {		
        nlapiLogExecution("debug","Error occur in an invoice api is :",err.message); 		
		jsonobj = { "status": "failed", 
			"message": err.message										
		  }
		return jsonobj;
    }
}


//Function for file attachment 
function AttachFileInNS(datain)
{
	var fileIdArr = new Array();
        var err = new Object();
	if(datain.attachments != null)
	{
		for(var k=0; k < datain.attachments.length; k++)
		{
			if(datain.attachments[k] =="")
			{
				err.status = "failed";
				err.message= "missing attachments value to be update";
				return err;
			}
			
			var url = datain.attachments[k];
			if(url != null && url != '')
			{
				url = url.split('/');
				var extn = url[url.length-1].split('.');
				extn = extn[extn.length-1];
				var fileName = url[url.length-1];
				var response = nlapiRequestURL(datain.attachments[k]);
				if(response.code == 200)
				{
					var csvDataInBase64 = response.getBody();
					if(GetExtnType(extn) != "")
					{
						var file = nlapiCreateFile(fileName, GetExtnType(extn), csvDataInBase64);													
						file.setFolder(6707491);
						file.setEncoding('UTF-8');
						fileId = nlapiSubmitFile(file);
						//return fileId;
                                                fileIdArr.push(fileId);
					}
				}
			}						
		} 
	}//End Attachment process 
        return fileIdArr;
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

//Added new code by ajay 30Sept2016
function GetPeriodDate(invoiceDate)
{
	var val='';
	var stDate = invoiceDate.split('-');	 
	var invoice_mnth =stDate[1];
	if(invoice_mnth != "10")
	{
		invoice_mnth = invoice_mnth.replace("0","");
	}
	var invoice_mnth=parseInt(invoice_mnth);
    var invoice_year = parseInt(stDate[0]);
	
	var date = nlapiDateToString(new Date());
    var mnth = parseInt(date.split('/')[0]);
    var year = parseInt(date.split('/')[2]);
	
	if(invoice_year > year)
	{
		val = mnth;
	}
	else if(invoice_year == year)
	{
		if(invoice_mnth > mnth)
		{
			val = mnth;
		}
		else if(invoice_mnth == mnth)
		{
			val = mnth;
		}
		else if(invoice_mnth < mnth)
		{
			val = invoice_mnth;
		}		
	}
	else if(invoice_year < year)
	{
		val = invoice_mnth;
	}
	var chk_mnth = String(val);
	
	var val =0;
	switch(chk_mnth)
	{
		case "1":
			val = "181";
			break;
		case "2":
			val = "182";
			break;
		case "3":
			val = "183";
			break;
		case "4":
			val = "185";
			break;
		case "5":
			val = "186";
			break;
		case "6":
			val = "187";
			break;
		case "7":
			val = "189";
			break;
		case "8":
			val = "190";
			break;
		case "9":
			val = "191";
			break;
		case "10":
			val = "193";
			break;
		case "11":
			val = "194";
			break;
		case "12":
			val = "195";
			break;			
		default:
			break;
	}	
	return val;
}
//Ended

//Added by ajay 28Sept 2016
function GetDateFormat(invoiceDate)
{
	var date = new Date();
	if(invoiceDate != null)
	{
		var invDate = invoiceDate.split('-');
		date = invDate[1]+'/'+invDate[2] +'/'+ invDate[0];
	}
	return date;
}
//Ended

function GetPeriod()
{
	var val =0;
	var date = nlapiDateToString(new Date());
    var mnth = date.split('/')[0];
    var year = date.split('/')[2];
	switch(year)
	{
		case "2016":
		    switch(mnth)
			{
				case "1":
					val = "181";
					break;
				case "2":
					val = "182";
					break;
				case "3":
					val = "183";
					break;
				case "4":
					val = "185";
					break;
				case "5":
					val = "186";
					break;
				case "6":
					val = "187";
					break;
				case "7":
					val = "189";
					break;
				case "8":
					val = "190";
					break;
				case "9":
					val = "191";
					break;
				case "10":
					val = "193";
					break;
				case "11":
					val = "194";
					break;
				case "12":
					val = "195";
					break;			
				default:
					break;
			}		    
			break;
		case "2017":
			switch(mnth)
			{
				case "1":
					val = "180";
					break;
				case "2":
					val = "181";
					break;
				case "3":
					val = "182";
					break;
				case "4":
					val = "184";
					break;
				case "5":
					val = "185";
					break;
				case "6":
					val = "186";
					break;
				case "7":
					val = "188";
					break;
				case "8":
					val = "189";
					break;
				case "9":
					val = "190";
					break;
				case "10":
					val = "192";
					break;
				case "11":
					val = "193";
					break;
				case "12":
					val = "194";
					break;			
				default:
					break;
			}
			break;		
	}
	return val;
}

function SendMail(option,invoiceNo,fileIdArr) 
{
     var body = '';
     var subject = 'invoice #'+invoiceNo+' - NS Bill Did Not Create from the Portal';
     
     switch(option)
     {
             case 1:
                   body = 'The invoice #'+invoiceNo+' is an exact match of an existing NetSuite bill.';  
                   break;
             case 2:
                   body = 'The date of the invoice and amount of the invoice is an exact match for an existing NetSuite bill.';
                   break;
             case 3:
                   body = 'The item has already been billed on a purchase order.';
                   break;
             default:
                   body = 'Test body message';
                   break;
     }
        
     var newAttachment = new Array();
     for(var i=0; i<fileIdArr.length; i++)
     {
        newAttachment[i] = nlapiLoadFile(fileIdArr[i]);         
     }
     //nlapiSendEmail(1007557, ['ajay@inoday.com','akansha.singh@inoday.com'], 'Test Message', 'Test description', null, null, null, newAttachment); 
     nlapiSendEmail(1007557, ['diamond.portal@brilliantearth.com','diaops@brilliantearth.com','billing@brilliantearth.com'], subject, body, null, null, null, newAttachment); 
     nlapiLogExecution("debug","send email to receipient.");
}

//Send Action Needed value to PORTAL
function SendInvoicedStatusToPortal(cdpId)
{
	var invoiced = 0; var jsonobj = null;
    var actNeededValue = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");
	actNeededValue = actNeededValue.replace(4,12);	//For Invoiced
	//var actNeedStr = '['+12+']'; //For Invoiced Status
	var actNeedStr = '['+actNeededValue+']';	//Setting up URL of CDP
	
	//Added New code
	if(actNeededValue != null && actNeededValue != "")
	{
		var actNeedArr = actNeededValue.split(',');
		for(var i=0; i<actNeedArr.length; i++)
		{
			if(actNeedArr[i] == 12)
			{
				invoiced = 1;
			}
		}
	}
	//Ended new code
  	
	//Setting up URL of CDP
	//var url = "https://testportal.brilliantearth.com/api/cdp/";   // for Sandbox 
	var url = "https://partner.brilliantearth.com/api/cdp/";    //for production
	//Setting up Headers 
	var headers = new Array(); 
	headers['http'] = '1.1';    
	headers['Accept'] = 'application/json';  	
	//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';   // for Sandbox
	headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //for production
	headers['Content-Type'] = 'application/json'; 
	headers['User-Agent-x'] = 'SuiteScript-Call';

	//Json data
	if(invoiced == 1)
	{
		jsonobj = { "cdp_id": cdpId, 					     
					"action_needed":actNeedStr,
					"manual_override":'T',
                    "has_bills" :'T'
				  }
	}
	else
	{
		jsonobj = { "cdp_id": cdpId, 					     
					"action_needed":actNeedStr,
					"manual_override":'T',
                    "has_bills" :'F'
				  }
	}

	var myJSONText = JSON.stringify(jsonobj, replacer); 
	nlapiLogExecution('debug','Request Input Body:', myJSONText);
	var response = nlapiRequestURL(url, myJSONText, headers); 
	nlapiLogExecution("debug","Response body output is :",response.getBody());
	if(response.code == '200')
	{
	
		var responsebody = JSON.parse(response.getBody());
                nlapiLogExecution("debug","response body from portal side is : ",responsebody);
                var action_needed = responsebody["action_needed"];
		nlapiLogExecution("debug","response body of action needed is : ",action_needed);
		var actionArr = [];
		if(action_needed != null)
		{			
			for(var i=0; i<action_needed.length;i++){
			     if(action_needed[i] != 4){
				actionArr.push(action_needed[i]);
                            }
			}
		}

		nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_action_needed",actionArr);
		nlapiLogExecution("debug","Successfully submited action needed field on CDP for cdpId is : ",cdpId);
	}
}

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}
