//Scheduled script to create vendor bill of newly created PO for CDP Item
function GenerateBillOfCreatedPO()
{
	try
	{
		var filter = [];
		//filter[0] = nlobjSearchFilter("custrecord_pending_po_creation",null,'is','T');
                filter[0] = nlobjSearchFilter("custrecord_created_vendorbill",null,'is','F');
		var column = [];
		column[0] = new nlobjSearchColumn("custrecord_portal_invoice_no");
				
		var Records = nlapiSearchRecord("customrecord_pending_inv_for_cdp",null,filter,column);
		if(Records != null)
		{
			for(var i=0; i< Records.length; i++)
			{
				var invoiceNo = Records[i].getValue(column[0]);
				var matchNo = 0;
				
				//Again Filter
				var filter11 = [];
				filter11[0] = nlobjSearchFilter("custrecord_portal_invoice_no",null,'is',invoiceNo);
				var column11 = [];				
				column11[0] = new nlobjSearchColumn("custrecord_created_vendorbill");
				
				var Records11 = nlapiSearchRecord("customrecord_pending_inv_for_cdp",null,filter11,column11);
				if(Records11 != null)
				{
					for(var k=0; k < Records11.length; k++)
					{
						if(Records11[k].getValue(column11[0]) == 'F')
						{							
							matchNo = matchNo + 1;
						}
					}					
				}
				if(matchNo == Records11.length)
				{
					GetBundleItems(invoiceNo);
				}
			}	    
		}
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error raised on vendor bill creation is : ",err.message);		
	}
}

//Bundling Items function
function GetBundleItems(invoiceNo)
{
	var pos = [];
	var items = [];
	var cdp_item_map = [];
	var fileIdArr = new Array();
	var flag = 0;

	var filters2 = [];
	filters2[0] = nlobjSearchFilter("custrecord_portal_invoice_no",null,'is',invoiceNo);
	filters2[1] = nlobjSearchFilter("custrecord_created_vendorbill",null,'is','F');
	
	var columns2 = [];
	columns2[0] = new nlobjSearchColumn("internalid");	
	columns2[1] = new nlobjSearchColumn("custrecord_cdp_id");	
	columns2[2] = new nlobjSearchColumn("custrecord_diamond_stock_no");
	columns2[3] = new nlobjSearchColumn("custrecord_portal_shipping_cost");
	columns2[4] = new nlobjSearchColumn("custrecord_cdp_portal_vendor");
	columns2[5] = new nlobjSearchColumn("custrecord_cdp_portal_comments");
	columns2[6] = new nlobjSearchColumn("custrecord_misc_adjustment");	
	columns2[7] = new nlobjSearchColumn("custrecord_attach_files");
		
	var searchRecords2 = nlapiSearchRecord("customrecord_pending_inv_for_cdp",null,filters2,columns2);
	if(searchRecords2 != null)
	{		
		var shippingCost = searchRecords2[0].getValue(columns2[3]);
		var vendorId = searchRecords2[0].getValue(columns2[4]);
		var comments = searchRecords2[0].getValue(columns2[5]);
		var adjustment = searchRecords2[0].getValue(columns2[6]);
		var fileIds = searchRecords2[0].getValue(columns2[7]);
		if(fileIds != "" && fileIds != null)
		{
			fileIdArr = fileIds.split(',');
		}
		for(var i=0; i< searchRecords2.length; i++)
		{
			var cdpId =	searchRecords2[i].getValue(columns2[1]);
			var soId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_so_order_number");
			var poId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_po_number");
			var itemId = searchRecords2[i].getValue(columns2[2]);

			if(poId > 0)
			{
				pos.push(poId);
				items.push(itemId);
				cdp_item_map.push({
					item : itemId,
					cdp : cdpId,
					custrecordId : searchRecords2[i].getValue(columns2[0])
				});
			}
			else
			{
				/*var filters3 = [];
				filters3[0] = nlobjSearchFilter("createdfrom",null,'is',soId);
				var columns3 = [];
				columns3[0] = new nlobjSearchColumn("internalid");
				var searchRecords3 = nlapiSearchRecord("purchaseorder",null,filters3,columns3);
				if(searchRecords3 != null)
				{
					poId = searchRecords3[0].getValue(columns3[0]);			
					if(poId > 0)
					{
						pos.push(poId);
						items.push(searchRecords2[0].getValue(columns2[2]));
						cdp_item_map.push({
							item : searchRecords2[i].getValue(columns2[2]),
							cdp : searchRecords2[i].getValue(columns2[1]),
							custrecordId : searchRecords2[i].getValue(columns2[0])
						});
					}
				}*/

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
							cdp : cdpId,
							custrecordId : searchRecords2[i].getValue(columns2[0])							
						});							
					}
                                        else
					{
						flag = 1;
					}						
				}
				else
				{
					flag = 1;
				}
			}//end else condition
		}
		//Function to create vendor bill
		CreateVendorBill(pos,items,cdp_item_map,shippingCost,vendorId,comments,adjustment,invoiceNo,fileIdArr,flag);
	}
}

function CreateVendorBill(pos,items,cdp_item_map,shippingCost,vendorId,comments,adjustment,invoiceNo,fileIdArr,flag)
{
	//Create Vendor Bills as Necessary
	var id = 0; 
	if(pos.length > 0 && flag == 0)
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",pos));
		filters.push(new nlobjSearchFilter("item",null,"anyof",items));
		var cols = [];
		cols.push(new nlobjSearchColumn("item"));
		cols.push(new nlobjSearchColumn("line"));
		cols.push(new nlobjSearchColumn("status")); 
		cols.push(new nlobjSearchColumn("preferredlocation","item"));
		cols.push(new nlobjSearchColumn("averagecost","item"));
		cols.push(new nlobjSearchColumn("purchasedescription","item"));
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
		if(results)
		{
			var count = 0;			
			var record = nlapiCreateRecord('vendorbill');
			record.setFieldValue("customform",121);
			record.setFieldValue("entity",vendorId); 
			record.setFieldValue("trandate",nlapiDateToString(new Date())); 
			record.setFieldValue("postingperiod",GetPeriod());
			record.setFieldValue("exchangerate","1.0");					
			record.setFieldValue("terms", nlapiLookupField("vendor",vendorId,"terms")); 
			record.setFieldValue("tranid", invoiceNo);

			record.setFieldValue("custbody_portal_invoice_number",invoiceNo);
			record.setFieldValue("custbody_portal_shipping_cost",shippingCost);					
			record.setFieldValue("custbody_portal_invoice_comments",comments);
			record.setFieldValue("custbody_portal_misc_adjustments",adjustment);
			
			for(var x=0; x < results.length; x++)
			{											
				if(results[x].getValue("status") !="closed")
				{
					count = count + 1; 
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
						}
					}							
					record.commitLineItem("item");
				}// ended status logic
			}
			
			if(count == results.length) 
			{
				id = nlapiSubmitRecord(record , true, true);
				nlapiLogExecution("debug","created vendor bill id is :"+id);
				if(id > 0)
				{
					for(var r=0; r< fileIdArr.length; r++)
					{
						nlapiAttachRecord('file', fileIdArr[r], 'vendorbill', id, null);
					}
					for(var j=0; j<cdp_item_map.length; j++)
					{
						nlapiSubmitField("customrecord_pending_inv_for_cdp",cdp_item_map[j].custrecordId,["custrecord_pending_po_creation","custrecord_created_vendorbill","custrecord_vendor_bill"],['F','T',id]);
                                                nlapiLogExecution("debug","Updated Custom Record id is :",cdp_item_map[j].custrecordId);
					}
				}//End submit record condition								
			}
		}
	}
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
