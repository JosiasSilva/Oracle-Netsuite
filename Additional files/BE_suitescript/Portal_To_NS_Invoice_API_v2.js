// Update list records of custom Diamond NetSuite for Invoice API
//var datain= {"cdp_data":[{"cdp_id":2756,"action_needed":[2,3]}],"invoice_no":"12345", "shipping_cost":122.0, "comment" :"test comments","misc_adjustments" :1.2,"attachments" :['https://testportal.brilliantearth.com/media/order/attach/01/05/PORTAL_TO_NS_RECORD_API_1.2.pdf','https://testportal.brilliantearth.com/media/order/attach/01/05/Book1.csv']};

function UpdateInvoiceRecord(datain)
{
    var err = new Object();
	var actionArr = new Array();
    try
    {	
	    if(datain != null)
	    {
		    if(datain.cdp_data != null)
		    {
				var pos = [];
				var items = [];
				var cdp_item_map = [];
				
				for(var i=0; i < datain.cdp_data.length; i++)
				{
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
										   //file.setFolder(5793401); //On sandbox 
										   file.setFolder(6707491);
										   file.setEncoding('UTF-8');
										   var fileId = nlapiSubmitFile(file);
										   nlapiAttachRecord('file', fileId, 'customrecord_custom_diamond', datain.cdp_data[i].cdp_id, null);
									  }
								}
							}						
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
					
					var itemId = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_be_diamond_stock_number");					
					var poId = 0;
					var filters = [];
					filters[0] = nlobjSearchFilter("custrecord_be_diamond_stock_number",null,'is',itemId);
					var columns = [];
					columns[0] = new nlobjSearchColumn("custrecord_diamond_po_number");
					var searchRecords = nlapiSearchRecord("customrecord_custom_diamond",null,filters,columns);
					for(var i=0; i< searchRecords.length; i++)
					{
					   poId = searchRecords[i].getValue(columns[0]);
					   if(poId > 0)
					   {
					   		pos.push(poId);
							items.push(itemId);
							cdp_item_map.push({
								item : itemId,
								cdp : datain.cdp_data[i].cdp_id
							});
							break;
					   }   
						      
					}
					
					/*
					if(poId > 0)
					{
						nlapiLogExecution("debug","purchase order Id is : "+poId);
						var poStatus = nlapiLookupField("purchaseorder",poId,'status');
						nlapiLogExecution("debug","purchase order status is : "+poStatus);
						if(poStatus == "pendingBilling" || poStatus == "pendingReceipt")
						{		
							var cdpFieldArr = ["custrecord_custom_diamond_vendor","custrecord_diamond_po_number","custrecord_custom_diamond_price","custrecord_cdp_quantity_available","custrecord_vendor_stock_number"];
							var cdpFieldVal = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,cdpFieldArr);
						
							var vendorId = cdpFieldVal.custrecord_custom_diamond_vendor;
							var amount = cdpFieldVal.custrecord_custom_diamond_price; 
							var qnty = cdpFieldVal.custrecord_cdp_quantity_available;
							var vendorStockNo = cdpFieldVal.custrecord_vendor_stock_number;

							var vendorTerms = nlapiLookupField("vendor",vendorId,"terms");
							var vendorName = nlapiLookupField("vendor",vendorId,'entityid');
							
							var itemArr = ["preferredlocation","averagecost","purchasedescription"];
							var itemArrVal = nlapiLookupField("inventoryitem",itemId,itemArr);
							var loc = itemArrVal.preferredlocation;
							
							var desc = itemArrVal.purchasedescription;
							nlapiLogExecution("debug","CDP Id is : "+datain.cdp_data[i].cdp_id);        
							
							//Bill Create
                                                        var record = nlapiTransformRecord("purchaseorder",poId,"vendorbill");
					                 //var record = nlapiCreateRecord('vendorbill');
							record.setFieldValue("customform",121);
							record.setFieldValue("entity",vendorId); 
							record.setFieldValue("trandate",nlapiDateToString(new Date())); 
							record.setFieldValue("postingperiod",GetPeriod());
							//record.setFieldValue("postingperiod",181);
							record.setFieldValue("exchangerate","1.0");					
							record.setFieldValue("terms", vendorTerms); 
							record.setFieldValue("tranid", datain.invoice_no);

							record.setFieldValue("custbody_portal_invoice_number",datain.invoice_no);
							record.setFieldValue("custbody_portal_shipping_cost",datain.shipping_cost);					
							record.setFieldValue("custbody_portal_invoice_comments",datain.comment);
							record.setFieldValue("custbody_portal_misc_adjustments",datain.misc_adjustments);
																
					                record.setLineItemValue('item','item', 1, itemId);
					                if(loc != "")
					               {
						           record.setLineItemValue('item','location', 1, loc);
					               }
					              else
					              {
						          record.setLineItemValue('item','location', 1, 2);
					              }
							record.setLineItemValue('item','amount', 1, amount);
							record.setLineItemValue('item','quantity', 1, 1);
							record.setLineItemValue('item','description',1, desc);
							//record.setLineItemValue('item','vendorname',1, vendorName);
										
							record.setFieldValue("usertotal",amount);
							
							var id = nlapiSubmitRecord(record , true, true);
							nlapiLogExecution("debug","created vendor bill id is :"+id);
					
					               nlapiSubmitField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_action_needed",actionArr);  
                                                      //nlapiSubmitField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id,"custrecord_created_bill_no",id);
						}
						else
						{
							nlapiLogExecution("debug","PO Status is :"+poStatus);
						}                                     
					}
                                        else
					{
						nlapiLogExecution("debug","Purchase Order field is an empty.");
					}
					*/                       
				}
				
				//Create Vendor Bills as Necessary
                                var id = 0; // added by ajay
				if(pos.length > 0)
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
						//Get vendor from one of the CDPs
						var vendorId = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[0].cdp_id,"custrecord_custom_diamond_vendor");
						
						var record = nlapiCreateRecord('vendorbill');
						record.setFieldValue("customform",121);
						record.setFieldValue("entity",vendorId); 
						record.setFieldValue("trandate",nlapiDateToString(new Date())); 
						record.setFieldValue("postingperiod",GetPeriod());
						record.setFieldValue("exchangerate","1.0");					
						record.setFieldValue("terms", nlapiLookupField("vendor",vendorId,"terms")); 
						record.setFieldValue("tranid", datain.invoice_no);

						record.setFieldValue("custbody_portal_invoice_number",datain.invoice_no);
						record.setFieldValue("custbody_portal_shipping_cost",datain.shipping_cost);					
						record.setFieldValue("custbody_portal_invoice_comments",datain.comment);
						record.setFieldValue("custbody_portal_misc_adjustments",datain.misc_adjustments);
						
						for(var x=0; x < results.length; x++)
						{
                                                     if(results[x].getValue("status") =="pendingBilling" || results[x].getValue("status") == "pendingReceipt")//added by ajay
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
									record.setCurrentLineItemValue("item","quantity",nlapiLookupField("customrecord_custom_diamond",thisCDP,"custrecord_custom_diamond_price"));
								}
							}							
							record.commitLineItem("item");
                                                    }// ended status logic
						}
						
						if(count == results.length) //Added by ajay
						{
							id = nlapiSubmitRecord(record , true, true);
							nlapiLogExecution("debug","created vendor bill id is :"+id);
						}
					}
				}
			
			        if(id > 0) //Added by ajay
				{
					err.status = "OK";
					err.message= "CDP records sync with invoice data";
					return err;
				}
				else
				{
					err.status = "Failed";
					err.message= "Atleast one PO is fully billed or closed.";
					return err;
				}
		    }
	    }
    }
    catch(err)
    {
        nlapiLogExecution("debug","Error occur in an invoice api is :",err.message); 
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
		default:
		    break;
	}
	return type;
}

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

  

