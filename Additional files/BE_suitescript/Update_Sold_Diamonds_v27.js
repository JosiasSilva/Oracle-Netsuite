function Update_Sold_Diamonds(type)
{
	if(type=="create")
	{
		try
		{
			//Check over items for loose diamonds
			var order = nlapiLoadRecord("salesorder",nlapiGetRecordId());
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var cdp = null;
				var custom_diamond = null;
				
				try
				{
					nlapiLogExecution("debug", "Item #", order.getLineItemText("item", "item", x + 1));
					
					//Get item ID, location, and qty available from line
					var item = order.getLineItemValue("item", "item", x + 1);
					var available = order.getLineItemValue("item", "quantityavailable", x + 1);
					var committed = order.getLineItemValue("item", "quantitycommitted", x + 1);
					var location = order.getLineItemValue("item", "location", x + 1);
					var rate = order.getLineItemValue("item", "rate", x + 1);
					if (available == null || available == "") 
						available = 0;
					if (committed == null || committed == "") 
						committed = 0;
					
					//Get Category and Status (Item) fields from inventory item record
					var item_obj = nlapiLookupField("item", item, ["custitem20", "custitem97", "quantityavailable", "custitemcertificate_included"]);
					
					if(item_obj.custitem20 == "7")
					{
						//Check if existing CDP was created in last five minutes
						var filters = [];
						var createdFormula = new nlobjSearchFilter("formulanumeric", null, "greaterthan", "-5");
						createdFormula.setFormula("({created} - {today}) * 24 * 60");
						filters.push(createdFormula);
						filters.push(new nlobjSearchFilter("custrecord_be_diamond_stock_number", null, "is", item));
						var results = nlapiSearchRecord("customrecord_custom_diamond", null, filters);
						if(results)
						{
							nlapiLogExecution("debug", "CDP " + results[0].getId() + " was created in the past 5 minutes. Not creating a dup...");
							//continue;
							cdp = nlapiLoadRecord("customrecord_custom_diamond", results[0].getId());
						}
						
						//Update item record to status = Sold and set Sold Date to today
						var itemRec = nlapiLoadRecord("inventoryitem", item);
						itemRec.setFieldValue("custitem97", "1");
						itemRec.setFieldValue("custitem_diamond_sold_date", nlapiDateToString(new Date()));
						
						//Check for PO's for diamond. If none exist, set item as special order item.
						var filters = [];
						filters.push(new nlobjSearchFilter("item", null, "is", item));
						var results = nlapiSearchRecord("purchaseorder", null, filters);
						if(!results)
						{
							itemRec.setFieldValue("isspecialorderitem", "T");
						}
						
						nlapiSubmitRecord(itemRec, true, true);
						
						//Check on transit quantity
						var transit = 0.00;
						var filters = [];
						filters.push(new nlobjSearchFilter("locationquantityintransit", null, "greaterthan", "0.00"));
						filters.push(new nlobjSearchFilter("internalid", null, "is", item));
						var results = nlapiSearchRecord("item", null, filters);
						if(results)
						{
							transit = 1;
						}
						
						//Check if diamond is available in San Francisco
						if(location == "2" && (parseFloat(available) > 0 || parseFloat(committed) > 0 || parseFloat(transit) > 0))
						{
							nlapiLogExecution("debug", "Diamond is available in SF");
							
							//Create custom diamond record
							
							//Do not create CDP for "Custom Diamond" inventory item
							if (item == "19785") 
								return true;
							
							if (cdp != null) 
								custom_diamond = cdp;
							else 
								custom_diamond = nlapiCreateRecord("customrecord_custom_diamond");
							
							custom_diamond.setFieldValue("custrecord_custom_diamond_request_type", "1");
							//custom_diamond.setFieldValue("custrecord_diamond_status","1");
							custom_diamond.setFieldValue("custrecord_be_diamond_stock_number", item);
							custom_diamond.setFieldValue("custrecord_diamond_customer_name", order.getFieldValue("entity"));
							custom_diamond.setFieldValue("custrecord_diamond_so_order_number", nlapiGetRecordId());
							custom_diamond.setFieldValue("custrecord_diamond_inventory_location", location);
							custom_diamond.setFieldValue("custrecord_diamond_eta", order.getFieldValue("custbody146"));
							custom_diamond.setFieldValue("custrecord_diamond_sales_rep", order.getFieldValue("salesrep"));
	
							
							custom_diamond.setFieldValue("custrecord_diamond_email_status", "1");
							custom_diamond.setFieldValue("custrecord_custom_diamond_price", rate);
							custom_diamond.setFieldValue("custrecord_custom_diamond_currency", order.getFieldValue("currency"));
							custom_diamond.setFieldValue("custrecord_cdp_pla", nlapiLookupField("item", item, "custitem_pla"));
							
							if(item_obj.custitemcertificate_included == "2") 
								custom_diamond.setFieldValue("custrecord_cdp_group_a", "T");
							else if(item_obj.custitemcertificate_included == "1")
							{
								custom_diamond.setFieldValue("custrecord_diamond_email_status", "2"); //Email Status = Emailed
								custom_diamond.setFieldValue("custrecord_cdp_group_b", "T"); //Mark Group B
								custom_diamond.setFieldValue("custrecord_diamond_status", "1"); //Diamond Status = Confirmed
								custom_diamond.setFieldValue("custrecord_diamond_confirmed", "1"); //Diamond Confirmed = Yes
								custom_diamond.setFieldValue("custrecord_diamond_email_status", "5"); //Email Status = Batch Email
								nlapiSubmitField("salesorder", nlapiGetRecordId(), "custbody132", "1");
							}
							
							//Check vendor record for 'Block automated emails' checkbox
							var vendor = nlapiLookupField("item", item, "vendor");
							if(vendor != null && vendor != "")
							{
								var blockEmails = nlapiLookupField("vendor", vendor, "custentityblock_automated_emails");
								if (blockEmails == "T") 
									custom_diamond.setFieldValue("custrecord_diamond_email_status", "3");
							}
							
							//Set Email Status to Order on Website if vendor is Hari Krishna or Monarch or Kiran or Kapu India or Laxmi or JB or Blue Star
							if(vendor == "28712" || vendor == "236761" || vendor == "2325705" || vendor == "2550863" || vendor == "2551373" || vendor == "3132473" || vendor == "3432901" || vendor == "3192228" || vendor == "4215082")
							{
								custom_diamond.setFieldValue("custrecord_diamond_email_status", "4");
							}
							
							//Override Email Status to Manual if CDP parent item starts with "Y"
							var itemNum = order.getLineItemText("item", "item", x + 1);
							if(itemNum != null && itemNum != "" && itemNum.charAt(0) == "Y")
							{
								custom_diamond.setFieldValue("custrecord_diamond_email_status", "3"); //Set Email Status to Manual Email
							}
							
							nlapiSubmitRecord(custom_diamond, true, true);
							
							//Update item record with new price
							if(order.getFieldValue("currency") == "1")
							{
								var itemMaster = nlapiLoadRecord("inventoryitem", item);
								var priceCount = itemMaster.getLineItemCount('price');
								if(priceCount)
								{
									for(var i = 1; i <= priceCount; i++)
									{
										var curr_cur = itemMaster.getLineItemValue('price', 'currency', i);
										if(curr_cur == '1')
										{
											itemMaster.selectLineItem('price', i);
											itemMaster.setCurrentLineItemMatrixValue('price', 'price', 1, rate);
											itemMaster.commitLineItem('price');
											break;
										}
									}
								}
								nlapiSubmitRecord(itemMaster, true, true);
							}
							
							
							var filters = [];
							filters.push(new nlobjSearchFilter("item", null, "is", item));
							var results = nlapiSearchRecord("purchaseorder", null, filters);
							if(!results)
							{
								nlapiSubmitField("inventoryitem", item, "isspecialorderitem", "T");
							}
						}
						else
						{
							//Diamond IS NOT in SF or IS NOT available > 0 -- Create custom diamond page
							
							//Create custom diamond record
							nlapiLogExecution("debug", "Creating new custom diamond record.");
							
							//Do not create CDP for "Custom Diamond" inventory item
							if(item == "19785") 
								return true;
							
							if(cdp != null) 
								custom_diamond = cdp;
							else 
								custom_diamond = nlapiCreateRecord("customrecord_custom_diamond");
							custom_diamond.setFieldValue("custrecord_custom_diamond_request_type", "1");
							//custom_diamond.setFieldValue("custrecord_diamond_status","1");
							custom_diamond.setFieldValue("custrecord_be_diamond_stock_number", item);
							custom_diamond.setFieldValue("custrecord_diamond_customer_name", order.getFieldValue("entity"));
							custom_diamond.setFieldValue("custrecord_diamond_so_order_number", nlapiGetRecordId());
							custom_diamond.setFieldValue("custrecord_diamond_inventory_location", location);
							custom_diamond.setFieldValue("custrecord_diamond_eta", order.getFieldValue("custbody146"));
							custom_diamond.setFieldValue("custrecord_diamond_sales_rep", order.getFieldValue("salesrep"));

							
							custom_diamond.setFieldValue("custrecord_diamond_email_status", "1");
							custom_diamond.setFieldValue("custrecord_custom_diamond_price", rate);
							custom_diamond.setFieldValue("custrecord_custom_diamond_currency", order.getFieldValue("currency"));
							custom_diamond.setFieldValue("custrecord_cdp_pla", nlapiLookupField("item", item, "custitem_pla"));
							
							if(parseInt(item_obj.quantityavailable) > 0 || parseInt(committed) > 0 || parseFloat(transit) > 0)
							{
								if (item_obj.custitemcertificate_included == "2") 
									custom_diamond.setFieldValue("custrecord_cdp_group_a", "T");
								else if(item_obj.custitemcertificate_included == "1")
								{
									custom_diamond.setFieldValue("custrecord_diamond_email_status", "2"); //Email Status = Emailed
									custom_diamond.setFieldValue("custrecord_cdp_group_b", "T"); //Mark Group B
									custom_diamond.setFieldValue("custrecord_diamond_status", "1"); //Diamond Status = Confirmed
									custom_diamond.setFieldValue("custrecord_diamond_confirmed", "1"); //Diamond Confirmed = Yes
									custom_diamond.setFieldValue("custrecord_diamond_email_status", "5"); //Email Status = Batch Email
									nlapiSubmitField("salesorder", nlapiGetRecordId(), "custbody132", "1");
								}
							}
							
							//Check vendor record for 'Block automated emails' checkbox
							var vendor = nlapiLookupField("item", item, "vendor");
							if(vendor != null && vendor != "")
							{
								var blockEmails = nlapiLookupField("vendor", vendor, "custentityblock_automated_emails");
								if (blockEmails == "T") 
									custom_diamond.setFieldValue("custrecord_diamond_email_status", "3");
							}
							
							//Set Email Status to Order on Website if vendor is Hari Krishna or Monarch or Kiran or Kapu India or Laxmi or JB or Blue Star
							if(vendor == "28712" || vendor == "236761" || vendor == "2325705" || vendor == "2550863" || vendor == "2551373" || vendor == "3132473" || vendor == "3432901" || vendor == "3192228" || vendor == "4215082")
							{
								custom_diamond.setFieldValue("custrecord_diamond_email_status", "4");
							}
							
							//Override Email Status to Manual if CDP parent item starts with "Y"
							var itemNum = order.getLineItemText("item", "item", x + 1);
							if(itemNum != null && itemNum != "" && itemNum.charAt(0) == "Y")
							{
								custom_diamond.setFieldValue("custrecord_diamond_email_status", "3"); //Set Email Status to Manual Email
							}
							
							//nlapiSubmitRecord(custom_diamond,true,true);
							var cdpId = nlapiSubmitRecord(custom_diamond, true, true);
							PushCDPRecordToPortal(cdpId, type);
							nlapiLogExecution("debug", "New Created CDP id is : ", cdpId);
							/*// Added By Rahul Panchal on 17/09/2016
				
							var requestType=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_request_type");
							var On_VendorPortal=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_on_vendor_portal");
							var itemId=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_be_diamond_stock_number");
							var itemObj=nlapiLoadRecord("inventoryitem",itemId);
							var qnty_on_hand = 0;
							var itemLocation=itemObj.getLineItemCount("locations");
							for(var i=1;i<itemLocation;i++)
							{
								 qnty_on_hand = itemObj.getLineItemValue("locations","quantityonhand",i);
								if(qnty_on_hand!=null && qnty_on_hand>0)
								{
									break;
								}   
							}
							if(requestType!=9 && (qnty_on_hand!=null && qnty_on_hand>0))				
							{
								On_VendorPortal="F";
								nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_on_vendor_portal",On_VendorPortal);
								nlapiLogExecution("debug","CDP not pushed to Portal for cdpId"+cdpId ,cdpId);
							}
							else
							{*/
								
							//}
							// Ended by Rahul Panchal
							
							//Update item record with new price
							if(order.getFieldValue("currency") == "1")
							{
								var itemMaster = nlapiLoadRecord("inventoryitem", item);
								var priceCount = itemMaster.getLineItemCount('price');
								if(priceCount)
								{
									for(var i = 1; i <= priceCount; i++)
									{
										var curr_cur = itemMaster.getLineItemValue('price', 'currency', i);
										if(curr_cur == '1')
										{
											itemMaster.selectLineItem('price', i);
											itemMaster.setCurrentLineItemMatrixValue('price', 'price', 1, rate);
											itemMaster.commitLineItem('price');
											break;
										}
									}
								}
								nlapiSubmitRecord(itemMaster, true, true);
							}
							
							var filters = [];
							filters.push(new nlobjSearchFilter("item", null, "is", item));
							var results = nlapiSearchRecord("purchaseorder", null, filters);
							if(!results)
							{
								nlapiSubmitField("inventoryitem", item, "isspecialorderitem", "T");
							}
						}
					}
				} 
				catch(e1)
				{
					nlapiLogExecution("error", "Error Updating Sold Diamonds (Record " + nlapiGetRecordId() + ").", "Details: " + e1.message);
					
					if(e1.message!=null && e1.message.indexOf("custrecord_diamond_sales_rep")!=-1)
					{
						custom_diamond.setFieldValue("custrecord_diamond_sales_rep","");
						nlapiSubmitRecord(custom_diamond,true,true);
					}
					else
					{
						try {
							var errorRec = nlapiCreateRecord("customrecord_cdp_error_log");
							errorRec.setFieldValue("custrecord_cdp_error_log_sales_order", nlapiGetRecordId());
							errorRec.setFieldValue("custrecord_cdp_error_log_message", err.message);
							errorRec.setFieldValue("custrecord_cdp_error_log_script", "Update Sold Diamonds");
							nlapiSubmitRecord(errorRec, true, true);
						} 
						catch (e) {
							nlapiLogExecution("error", "Error Creating CDP Error Log", "Details: " + e.message);
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Sold Diamonds (Record " + nlapiGetRecordId() + ").","Details: " + err.message);
			
			return true;
		}
	}
}
//Function that push created cdp to portal
function PushCDPRecordToPortal(cdpId,type)
{
	try
	{
                     
            nlapiLogExecution('debug','CDP Initiated to push on portal for cdpId:'+cdpId , cdpId );
            var soId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_so_order_number");		
			var assetAcct='';
                        var soStatus = null;   
			if(soId !='' && soId != null)
			{
                             soStatus = nlapiLookupField("salesorder",soId,"status");
			     var soObj = nlapiLoadRecord("salesorder",soId);
				var itemCount = soObj.getLineItemCount("item");
				for(var j=1; j<= itemCount; j++)
				{
					var itemType = soObj.getLineItemValue("item","itemtype",j);
					if(itemType == "InvtPart")
					{
						var invItemId=soObj.getLineItemValue("item","item",j);	
						if(nlapiLookupField("inventoryitem",invItemId,"custitem20") == 7)
						{
							assetAcct = nlapiLookupField("inventoryitem",soObj.getLineItemValue("item","item",j),"assetaccount");
							break;
						}
					}// end check of itemType   
				}// end of loop
			}// end check of soId   
		   
			var resultArr = new Array();		   
		        var old_PortalReqType = 0;
		        //var map_PortalReqType = 0;
                        var old_ItemStatus = nlapiGetOldRecord().getFieldValue("custrecord_item_status");
                var new_ItemStatus = nlapiGetNewRecord().getFieldValue("custrecord_item_status");
		nlapiLogExecution("debug","Old Item status is : "+old_ItemStatus);
		nlapiLogExecution("debug","New Item status is : "+new_ItemStatus);
		
		var old_CsStatus = nlapiGetOldRecord().getFieldValue("custrecord_custom_diamond_cs_status");
		var new_CsStatus = nlapiGetNewRecord().getFieldValue("custrecord_custom_diamond_cs_status");
		nlapiLogExecution("debug","Old CS Status is : "+old_CsStatus);
		nlapiLogExecution("debug","New CS Status is : "+new_CsStatus);

			var cdpObj = nlapiLoadRecord("customrecord_custom_diamond",cdpId);
			var vendorId=cdpObj.getFieldValue('custrecord_custom_diamond_vendor');
		  
			if((cdpId!='' && cdpId!=null) && (vendorId!='' && vendorId !=null))
			{                           
			   var diamond = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_be_diamond_stock_number",true); // added by ajay
			   var vendorStockNo=cdpObj.getFieldValue('custrecord_vendor_stock_number') ;
			   var portalRequestTypeId=cdpObj.getFieldValue('custrecord165');
			   var portalRequestType=cdpObj.getFieldText('custrecord165');
			   var onVendorPortal=cdpObj.getFieldValue('custrecord_on_vendor_portal');		   
			   var action_needed=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");   
			   var item_status=cdpObj.getFieldValue('custrecord_item_status');   
			   var manual_override=cdpObj.getFieldValue('custrecord_manual_override');
			   var requestType = cdpObj.getFieldValue('custrecord_custom_diamond_request_type');
			   var percent_paid=cdpObj.getFieldValue('custrecord_custom_diamond_percent_paid');
			   var groupA=cdpObj.getFieldValue('custrecord_cdp_group_a');
			   var groupB=cdpObj.getFieldValue('custrecord_cdp_group_b');
			   var cs_status=cdpObj.getFieldValue('custrecord_custom_diamond_cs_status');
                           var diamondStatus = cdpObj.getFieldValue('custrecord_diamond_status'); // added by ajay 02Feb2016
                           old_PortalReqType = portalRequestTypeId;
			   var paid='';
			   if(percent_paid!='' && percent_paid!=null)
			   {
				  paid=percent_paid.split('%')[0];
			   }		   
			   
			   var manualOverride=false, vendorPortal=false;
			   if(manual_override=='T')
			   {
				   manualOverride=true;
			   }
			   if(onVendorPortal=='T')
			   {
				   vendorPortal=true;
			   }		   
                          if(type == "create") // added as per feedback
                           { 
                              vendorPortal=true; 
                              onVendorPortal='T';
                           }
                          //nlapiLogExecution('debug','On Vendor Portal Last:'+onVendorPortal, onVendorPortal);
				//var paymentTerms= nlapiLookupField('vendor',vendorId,'custentity101');
                                var paymentTerms= nlapiLookupField('vendor',vendorId,'terms');
				resultArr =	GetPortalRequestVal(resultArr,diamond,paymentTerms,portalRequestTypeId,requestType,paid,groupA,groupB,item_status,action_needed,cs_status,assetAcct)
		 
				if(resultArr.length > 0)
				{   
					 portalRequestTypeId= resultArr[0].portalReqTypeVal;
                                         // nlapiLogExecution('debug','Portal Request TypeId:'+portalRequestTypeId, portalRequestTypeId);
					//  Added by Rahul Panchal on dated 05/11/2016 as per DP-200
					var mappingline = resultArr[0].mappingline; 
					if(mappingline=='5' || mappingline=='6' || mappingline=='11' || mappingline=='12' || mappingline=='14' || mappingline=='15')
					{
						pushCDPtoPortal(cdpId,resultArr,portalRequestTypeId,item_status,action_needed,cdpObj,onVendorPortal,requestType,paid,groupB,assetAcct,diamond,soStatus,old_PortalReqType,old_ItemStatus,vendorId,vendorPortal,manual_override,paymentTerms,new_ItemStatus,cs_status,old_CsStatus,new_CsStatus)
						nlapiLogExecution('debug',"sucessfully CDP pushed to portal" ,cdpId, mappingline);
					}
					else
					{
						var requestType=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_request_type");
						var On_VendorPortal=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_on_vendor_portal");
						var itemId=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_be_diamond_stock_number");
						var itemObj=nlapiLoadRecord("inventoryitem",itemId);
						var qnty_on_hand = 0;
						var itemLocation=itemObj.getLineItemCount("locations");
						for(var i=1;i<itemLocation;i++)
						{
							 qnty_on_hand = itemObj.getLineItemValue("locations","quantityonhand",i);
							if(qnty_on_hand!=null && qnty_on_hand>0)
							{
								break;
							}   
						}
						if(requestType!=9 && (qnty_on_hand!=null && qnty_on_hand>0))				
						{
							On_VendorPortal="F";
							nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_on_vendor_portal",On_VendorPortal);
							nlapiLogExecution("debug","CDP not pushed to Portal for cdpId"+cdpId ,cdpId);
						}
						else
						{											pushCDPtoPortal(cdpId,resultArr,portalRequestTypeId,item_status,action_needed,cdpObj,onVendorPortal,requestType,paid,groupB,assetAcct,diamond,soStatus,old_PortalReqType,old_ItemStatus,vendorId,vendorPortal,manual_override,paymentTerms,new_ItemStatus,cs_status,old_CsStatus,new_CsStatus)
							nlapiLogExecution('debug',"sucessfully CDP pushed to portal ",mappingline);
						}
					}
                                        
				}//end check of resultArr                          
			}// end check of cdpId
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
	}
}

//New optimized added function 09Sept 2016
function SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType)
{
	var jsonobj = {"cdp_id": cdpId, 
				"vendor_id": vendorId,
				"portal_request_type": portalRequestTypeId,     
				"action_needed":actNeedStr,
				"item_status":item_status,
				"on_vendor_portal":vendorPortal,
				"manual_override":manual_override,
				"payment_terms":paymentTerms,
				"cdp_request_type":parseInt(requestType)
				}	 
	return jsonobj;
}
//Ended


function PushNSCdpItemDataToPortal(cdpId)
{
    try
    {   
       	   var cdpArrField = ["custrecord_be_diamond_stock_number","custrecord_vendor_stock_number","custrecord165","custrecord_on_vendor_portal","custrecord_action_needed","custrecord_item_status","custrecord_custom_diamond_vendor","custrecord_diamond_inventory_location"];
	   var cdpVal = nlapiLookupField("customrecord_custom_diamond",cdpId,cdpArrField);
	   var beStockNoId = cdpVal.custrecord_be_diamond_stock_number; //get Id
       var beStockNo=nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_be_diamond_stock_number',true)//get value 
	   var vendorStockNo = cdpVal.custrecord_vendor_stock_number;
	   var vendorId=cdpVal.custrecord_custom_diamond_vendor;
            var itemDelvLocation=cdpVal.custrecord_diamond_inventory_location;   
	    if((cdpId!='' && cdpId!=null) && (beStockNoId!='' && beStockNoId!=null) && (vendorStockNo !='' && vendorStockNo !=null))
	    {    
			
	var itemId = beStockNoId;
								
 var itemArr = ["custitem20","custitem5","custitem27","custitem7","custitem19","custitem28","custitem25","cost","custitem46","location","custitem30","lastpurchaseprice","custitem45","custitem37","custitem31","custitem32","custitem18"];
					var itemArrVal = nlapiLookupField("inventoryitem",itemId,itemArr);
					if(itemArrVal.custitem18 == ""){ itemArrVal.custitem18 = null; }	  
					var itemCost='';
					//var itemDelvLocation=itemArrVal.location;   
					if(itemDelvLocation == null || itemDelvLocation =='')
					{
					   itemDelvLocation=null;
					}
					rap_price=itemArrVal.lastpurchaseprice;                 
					
					var rap_price='0',percent_rap=0;
					rap_price=itemArrVal.lastpurchaseprice; 
								percent_rap=itemArrVal.custitem45;                
					if(rap_price=='' || rap_price==null)
					{ 
					 rap_price='0';
					}
					if(percent_rap=='' || percent_rap==null)
					{
					  percent_rap='0';
					}
					if(itemArrVal.custitem20 == 7)   // condition for loose diamond inventory item
					{  
					  //Setting up URL of CDP             
					  var url = "https://partner.brilliantearth.com/api/item/";     
                     
					   var headers = new Array(); 
					   headers['http'] = '1.1';    
					   headers['Accept'] = 'application/json';       
					   headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';					  
					   headers['Content-Type'] = 'application/json'; 
					   headers['User-Agent-x'] = 'SuiteScript-Call';
		  
					  //Setting up Datainput
					  var jsonobj = {"cdp_id": cdpId, 
					  "stock_no": vendorStockNo,
					  "be_stock_no": beStockNo,
					  "vendor_stock_no": vendorStockNo,
					  "shape":itemArrVal.custitem5,
					  "color":itemArrVal.custitem7,
					  "carat":itemArrVal.custitem27,
					  "clarity":itemArrVal.custitem19,
					  "cut":itemArrVal.custitem28,
					  "cost":itemArrVal.cost,
					  "lab":itemArrVal.custitem25,
					  "certificate_no":itemArrVal.custitem46,                                                                 
					  "delivery_location":itemDelvLocation,                                
					  "measurements":itemArrVal.custitem30,
					  "rap_price":rap_price,
					  "percent_rap":percent_rap,
					  "fluor":itemArrVal.custitem37,
					  "girdle":itemArrVal.custitem31,
					  "cutlet":itemArrVal.custitem32,
					  "origin":itemArrVal.custitem18
					   }
						
					  //Stringifying JSON
					  var myJSONText = JSON.stringify(jsonobj, replacer); 
                                        //    nlapiLogExecution('debug','CDP Item Response Body:', myJSONText);
					  var response = nlapiRequestURL(url, myJSONText, headers);  
					//  nlapiLogExecution('debug','Response Body:', response.getBody());    
					  //Below is being used to put a breakpoint in the debugger
					  return response;					  
					}// end check
				
	    }//end check of cdpId   
    }
    catch(err)
    {
	    nlapiLogExecution("debug","Error occur during CDPID's Items Push from NS to portal.",err.message); 
    }
}

function GetPortalRequestVal(arr,diamond,paymentTerms,portalReqType,reqType,paid,grA,grB,itemStatus,actionNeeded,csStatus,assetAcct)
	{		
		var newMsg = ""; var portalReqTypeText = ""; var itemStatusText = ""; var actionNeededText = ""; var mappingline="";
		var portalReqTypeVal = 0; var itemStatusVal = 0; var actionNeededVal = 0;
		
		if((reqType == 1 && paid < 20)&&((diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1) || (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1) ))// 3,4 (Sold)
		{	
            if(diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1) //3
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
			} 				
			else if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1) //4
			{
				portalReqType = 2;
				portalReqTypeText ="Hold";
			}			
			 
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg,
				"mappingline"          : 4
			});
		}
		else if((reqType == 1 && paid >= 20 && grA == 'T' && assetAcct == 189) && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 5 (Sold)
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			itemStatus = 2;
			itemStatusText = "Confirmed";
			actionNeeded = '4';
			actionNeededText = "Ready to Invoice";
			newMsg = "Memo diamond sold, please upload invoice and send lab cert via FedEx";			 
		
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg,
				"mappingline"          : 5
			});
		}
		else if((reqType == 1 && paid >= 20 && grB == 'T' && assetAcct == 189)  && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))    // Line 6 (Sold)
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			itemStatus = 2;
			itemStatusText = "Confirmed";
			actionNeeded = '4';
			actionNeededText = "Ready to Invoice";                     
			newMsg = "";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg,
				"mappingline"          : 6
			});
		}
		else if((reqType == 1 && paid >= 20) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1))      // Line 7 (Sold)
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg,
				"mappingline"          : 7
			});
		}
		else if((reqType == 6 ) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1))// 8 (Hold)
		{
			portalReqType = 2;
			portalReqTypeText = "Hold";			
												
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg,
				"mappingline"          : 8
			});
		}
		else if((reqType == 7 && paid >= 20 && csStatus != 4)&&((diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)||(diamond.indexOf("A") != -1 || diamond.indexOf("Y") != -1) )) // 9 (Replacement(diamond unavailable))
		{			
			if(diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
			}
                       else if(diamond.indexOf("A") != -1 || diamond.indexOf("Y") != -1)
                        {
				portalReqType = 2;
				portalReqTypeText = "Hold";
                        }					
						
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"				: newMsg,
				"mappingline"          : 9
			});
		}
		
		else if((reqType == 7 && paid >= 20 && csStatus == 4) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1))// 10 (Replacement(diamond unavailable))
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"				: newMsg,
				"mappingline"          : 10
			});
		}
		
		else if((reqType == 7 && paid >= 20 && csStatus == 4 && grA == 'T' && assetAcct == 189)&&(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 11 (Replacement(diamond unavailable))
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			itemStatus = 2;
			itemStatusText = "Confirmed";
			actionNeeded = '4';
			actionNeededText = "Ready to Invoice";
			newMsg = "Memo diamond sold, please uploade invoice and send lab cert via FedEx";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 11
			});
		}
		else if((reqType == 7 && paid >= 20 && csStatus == 4 && grB == 'T' && assetAcct == 189) && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))// 12 (Replacement(diamond unavailable))
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			itemStatus = 2;
			itemStatusText = "Confirmed";
			actionNeeded = '4';
			actionNeededText = "Ready to Invoice";
			newMsg = "";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 12
			});
		}
		
		else if((reqType == 7 && paid < 20 && csStatus != 4) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1)) // 13 (Replacement(diamond unavailable))
		{
			portalReqType = 2;
			portalReqTypeText = "Hold";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"				: newMsg,
				"mappingline"          : 13
			});
		}
		else if((reqType == 8 && paid >= 20 && grA == 'T' && assetAcct == 189) && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))// 14 (Replacement(Customer Switch))
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			itemStatus = 2;
			itemStatusText = "Confirmed";
			actionNeeded = '4';
			actionNeededText = "Ready to Invoice";
			newMsg = "Memo diamond sold, please uploade invoice and send lab cert via FedEx";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 14
			});
		}		
		else if((reqType == 8 && paid >= 20 && grB == 'T' && assetAcct == 189) && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))// 15 (Replacement(Customer Switch))
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			itemStatus = 2;
			itemStatusText = "Confirmed";
			actionNeeded = '4';
			actionNeededText = "Ready to Invoice";
			newMsg = "";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 15
			});
		}		
		else if((reqType == 8)&&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)) // 16 (Replacement(Customer Switch))
		{
			portalReqType = 3;
			portalReqTypeText = "Sold";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 16
			});			
		}
		else if((reqType == 9 )&&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 17(Memo)
		{
			portalReqType = 4;
			portalReqTypeText = "Memo";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 17
			});			
		}
		else if((reqType == 2) &&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))// 18(Appointment Request)
		{
			portalReqType = 4;
			portalReqTypeText = "Memo";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 18
			});			
		}
		else if((reqType == 5 ) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1))// 19 (Check Availability/Eye-Clean)
		{
			portalReqType = 5;
			portalReqTypeText = "Check Availability/Eye-Clean";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 19
			});			
		}
		else if((reqType == 4 )&& (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1))// 20 (Photography Request)
		{
			portalReqType = 6;
			portalReqTypeText = "Image Request";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 20
			});			
		}
		else if((reqType == 3 ) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1))// 21 (Cert Request)
		{
			portalReqType = 7;
			portalReqTypeText = "Cert Request";
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg,
				"mappingline"          : 21
			});			
		}
		return arr;
	}
	
	
function GetDiamondStatus(diamondStatus)
{
	switch (diamondStatus)
	{
		case '1':
			diamondStatus = '2';
			break;
		case '2':
			diamondStatus = '5';
			break;
		case '3':
			diamondStatus = '7';
			break;
		case '4':
			diamondStatus = '3';
			break;
		case '5':
			diamondStatus = '6';
			break;
		case '8':
			diamondStatus = '4';
			break;
		default:
			diamondStatus = '1';
			break;
	}
	return diamondStatus;
}

function dateFormatYMD(strDate)
{
  var YYYYMMDD='';
  var strArr='';
  if(strDate!='')
  {
    strArr=strDate.split('/');
    var mm=strArr[0];
    if(mm.length=='1') mm='0'+mm;
    var dd=strArr[1];
    if(dd.length=='1') dd='0'+dd;
    var yyyy=strArr[2];
    YYYYMMDD=yyyy+'-'+mm+'-'+dd;
  }
  return YYYYMMDD;
}
// End function of cdp message to portal


function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}
//  Added by Rahul Panchal on dated 05/11/2016 as per DP-200

function pushCDPtoPortal(cdpId,resultArr,portalRequestTypeId,item_status,action_needed,cdpObj,onVendorPortal,requestType,paid,groupB,assetAcct,diamond,soStatus,old_PortalReqType,old_ItemStatus,vendorId,vendorPortal,manual_override,paymentTerms,new_ItemStatus,cs_status,old_CsStatus,new_CsStatus)
{
	try
	{
		var map_PortalReqType = 0;
		 map_PortalReqType = portalRequestTypeId;
									
		if(portalRequestTypeId==null || portalRequestTypeId=='')
		{
		   portalRequestTypeId="0";
		}
	   nlapiLogExecution('debug','Map Portal Request TypeId:', map_PortalReqType);
	   nlapiLogExecution('debug','Old Portal Request TypeId:', old_PortalReqType);
		 item_status = resultArr[0].itemStatusVal;
		 if(item_status==null || item_status=='')
		 {       
			 item_status ='1'; // set Not confirmed
		 }
							  //item_status = GetDiamondStatus(diamondStatus);
		 action_needed= resultArr[0].actionNeededVal;
		 var actNeedArr=new Array();
		 var actNeedStr='';
		 if(action_needed!="" && action_needed!=null)
		 {
		   actNeedStr=action_needed.split(',')
		   for(k=0;k<actNeedStr.length;k++)
		   {
			 actNeedArr.push(actNeedStr[k]);
		   }
		 }
		 if(action_needed!='' && action_needed!=null)
		 {
		   actNeedStr='['+action_needed+']';
		 }
		 else
		 {
		   action_needed='2';// set Confirmation Needed
		   actNeedStr='['+action_needed+']';  
		   actNeedArr.push(action_needed);
		 }
		 msg = resultArr[0].newMsg;


		if(onVendorPortal=='F' || onVendorPortal=='T')  
		{

			//Setting up URL of CDP             
			var url = "https://partner.brilliantearth.com/api/cdp/";    

			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       
			headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';

			//Setting up Datainput
			/*var jsonobj = {"cdp_id": cdpId, 
			  "vendor_id": vendorId,
			  "portal_request_type": portalRequestTypeId,     
			  "action_needed":actNeedStr,
			  "item_status":item_status,
			  "on_vendor_portal":vendorPortal,
			  "manual_override":manual_override,
			  "payment_terms":paymentTerms
			}*/                                               

									var jsonobj = null;
			if(requestType == 1 && paid >= 20 && groupB == 'T' && assetAcct == 189 && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) //line 6 (Sold)
			{
				if(soStatus != null && soStatus != "" && soStatus == "fullyBilled")
				{
					if(old_PortalReqType == 2 && map_PortalReqType == 3)
					{
						if(old_ItemStatus == 2) //confirmed
							{
							  item_status = 1; 
							  portalRequestTypeId = map_PortalReqType;
							  nlapiLogExecution("debug","changes item status is :","Not confirmed");
							  nlapiLogExecution("debug","map portal request type is :","Sold");

							  jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);								      
						  }
						  else
						  {
																   portalRequestTypeId = map_PortalReqType;	
								jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);									       
						  }
					}
					else 
					{
						jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);									
					}
				}
				else
				{
					nlapiLogExecution("debug","Sales order is not fully billed for cdp id is:",cdpId);
				}
			}
			else if(requestType == 7 && old_PortalReqType == 2 && cs_status != 4 && paid >= 20)//case#3
			{
				if(old_CsStatus != 4 && new_CsStatus == 4) //From NS changed
				{
					item_status = 1; 
					portalRequestTypeId = 3;
					nlapiLogExecution("debug","changes item status is :","Not confirmed");
					nlapiLogExecution("debug","manual portal request type is :","Sold");

					jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);							
				}
				else
				{
					if(old_PortalReqType == 2 && map_PortalReqType == 3)
					{
						if(old_ItemStatus == 2) //confirmed
						{
							item_status = 1; 
							portalRequestTypeId = map_PortalReqType;
							nlapiLogExecution("debug","changes item status is :","Not confirmed");
							nlapiLogExecution("debug","changes portal request type is :","Sold");

							jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);										
						}
						else
						{
							jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);									
						}
					}
					else 
					{
						jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);								
					}
				}					
			}//end case # 3
			else
			{
				if(old_PortalReqType == 2 && map_PortalReqType == 3)
				{
					if(old_ItemStatus == 2) //confirmed
							{
							  item_status = 1; 
							  portalRequestTypeId = map_PortalReqType;
							  nlapiLogExecution("debug","changes item status is :","Not confirmed");
							  nlapiLogExecution("debug","map portal request type is :","Sold");

							  jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);								      
						  }
						  else
						  {
																   portalRequestTypeId = map_PortalReqType;	
								jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);								       
						  }
				}
				else 
				{
					jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType);								
				}
			}

			//Stringifying JSON
									if(jsonobj != null)
									{
			var myJSONText = JSON.stringify(jsonobj, replacer); 
								   // nlapiLogExecution('debug','CDP Response Body:', myJSONText);
			var response = nlapiRequestURL(url, myJSONText, headers); 

			//Below is being used to put a breakpoint in the debugger

			if(response.code=='200')
			{										 
				cdpObj.setFieldValue('custrecord_on_vendor_portal',onVendorPortal);
				cdpObj.setFieldValue('custrecord_action_needed',actNeedArr);
				cdpObj.setFieldValue('custrecord_item_status',item_status);
				cdpObj.setFieldValue('custrecord165',portalRequestTypeId);
				if(old_PortalReqType == 2 && map_PortalReqType == 3 && item_status == 1  &&  old_ItemStatus == 2)
				{
					cdpObj.setFieldValue('custrecord_diamond_status',"");
				}

				//Logic for new mapping by ajay 21march 2016							
				if(requestType == 7 && old_PortalReqType == 2 && cs_status != 4) //case #1
				{
					//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal 
													if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal 
					{
						cdpObj.setFieldValue('custrecord_diamond_status',7); //On Hold – Pending Customer Decision
					}								
				}
				else if(requestType == 7 && old_PortalReqType == 2 && paid < 20) //case #2
				{
					//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal 
													if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal 
					{
						cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold – Customer Payment Pending
					}								
				}
				else if(requestType == 7 && old_PortalReqType == 2 && cs_status != 4 && paid >= 20) //case #3
				{
					if(old_CsStatus != 4 && new_CsStatus == 4) //From NS changed
					{
						cdpObj.setFieldValue('custrecord165',3); //Sold
						cdpObj.setFieldValue('custrecord_item_status',1); //Not confirmed
						cdpObj.setFieldValue('custrecord_diamond_status',"");
					}								
				}							
				else if(requestType == 1 && old_PortalReqType == 2 && paid < 20) //case #5
				{
					//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal 
													if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal 
					{
						cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold – Customer Payment Pending
					}								
				}
				else if(requestType == 6 && old_PortalReqType == 2) //case #6
				{
					//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal 
													if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal 
					{
						cdpObj.setFieldValue('custrecord_diamond_status',7);//On Hold – Pending Customer Decision
						cdpObj.setFieldValue('custrecord_custom_diamond_cs_status',2);//Option Sent to CS
					}								
				}							
				//Ended new mapping by ajay

				var cdpID = nlapiSubmitRecord(cdpObj,true,true);

				nlapiLogExecution('debug','NS CDP record has been pushed successfully on Portal for CDP Id:'+cdpID , cdpID );
				nlapiLogExecution("debug", "NS CDP fields has been updated successfully for CDP Id:"+cdpID ,cdpID );
				if(cdpId!='' && cdpId!=null)
				{
					var result = PushNSCdpItemDataToPortal(cdpId); // call to push SO Items after pushed cdpid
					if(result.code == '200')
					{    
						nlapiLogExecution('debug','Successfully Pushed CDP Items to Portal for CdpId:'+cdpID , cdpID );								
					}                                                                
					else
					{                                                                 		                        
						   nlapiLogExecution('debug','CDP Item sync error for CdpId:'+cdpId, result.body ); 
					}// end check of result code
				}// end check of cdpId
			}
			else
			{   
				//var responsebody = JSON.parse(response.getBody()) ;
				//        nlapiLogExecution('debug','CDP could not pushed on portal because : '+response.body);	
				nlapiLogExecution('debug','CDP sync error for CdpId:'+cdpId, response.body ); 				
				nlapiLogExecution('debug','CDP could not pushed on portal for CdpId : '+cdpId, cdpId);                               
			}// end check of response.code
					}// end for jsonobj
		} //end check of onVendorPortal
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occuring while push to Portal",err.message);
	}
}
// Ended
