function Create_Custom_Diamond_Page_New(type)
{
     nlapiLogExecution("debug","Type:"+type,type);
	if(type=="edit" || type=="create" || type=="xedit")
	{
		try
		{
			//Check item internal ID. If item is "Custom Diamond" (internal ID: ), do not create custom diamond record
			var internalid = nlapiGetRecordId();
                       nlapiLogExecution("debug","RecordId:"+internalid ,internalid);
			if(internalid=="19785")
				return true;
				
			var newCDP = nlapiGetNewRecord();
			var oldCDP = nlapiGetOldRecord();
			
			var category = newCDP.getFieldValue("custitem20");
			if(category!="7")
				return true;
				
			var oldStatus;
			var oldEmail;
			if(type!="create")
			{
				oldStatus = formatNull(oldCDP.getFieldValue("custitem97"));
				oldEmail = formatNull(oldCDP.getFieldValue("custitemcustomer_email"));
				
				nlapiLogExecution("debug","Old Status",oldStatus);
				nlapiLogExecution("debug","Old Email",oldEmail);	
			}
			
			var newStatus = formatNull(newCDP.getFieldValue("custitem97"));
			var newEmail = formatNull(newCDP.getFieldValue("custitemcustomer_email"));
			
			nlapiLogExecution("debug","New Status",newStatus);
			nlapiLogExecution("debug","New Email",newEmail);
			
			nlapiLogExecution("debug","Status Change",oldStatus!=newStatus);
			nlapiLogExecution("debug","Email Change",oldEmail!=newEmail);	
			
			if((type=="create" && newStatus!=null && newStatus!="") || (type=="edit" && newStatus!=null && newStatus!="" && (oldStatus!=newStatus || oldEmail!=newEmail)))
			{
				//Create new diamond record
				var diamond = nlapiCreateRecord("customrecord_custom_diamond");
				diamond.setFieldValue("custrecord_custom_diamond_request_type",newStatus);
				diamond.setFieldValue("custrecord_be_diamond_stock_number",internalid);
				diamond.setFieldValue("custrecord_custom_diamond_notes",newCDP.getFieldValue("custitemdiamond_notes"));
				
				if(newCDP.getFieldValue("custitem_diamond_currency")!=null && newCDP.getFieldValue("custitem_diamond_currency")!="")
					diamond.setFieldValue("custrecord_custom_diamond_currency",newCDP.getFieldValue("custitem_diamond_currency"));
				if(newCDP.getFieldValue("custitem_diamond_currency_price")!=null && newCDP.getFieldValue("custitem_diamond_currency_price")!="")
					diamond.setFieldValue("custrecord_custom_diamond_price",newCDP.getFieldValue("custitem_diamond_currency_price"));
				
				//Lookup sales order # if available
				var so_number = nlapiGetNewRecord().getFieldValue("custitemsales_order_number_item");
				if(so_number!=null && so_number!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					filters.push(new nlobjSearchFilter("tranid",null,"is",so_number));
					var results = nlapiSearchRecord("salesorder",null,filters);
					if(results)
					{
						diamond.setFieldValue("custrecord_diamond_so_order_number",results[0].getId());
					}
				}
				
				//Lookup customer record from email address
				if(newEmail!=null && newEmail!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
					filters.push(new nlobjSearchFilter("email",null,"is",newEmail));
					var results = nlapiSearchRecord("customer",null,filters);
					if(results)
					{
						diamond.setFieldValue("custrecord_diamond_customer_name",results[0].getId());
					}
				}
				
				diamond.setFieldValue("custrecord_diamond_appointment_date",newCDP.getFieldValue("custitemdate_of_appointment_item"));
				diamond.setFieldValue("custrecord_custom_diamond_cust_timeline",newCDP.getFieldValue("custitemcustomer_timeline_item"));
				diamond.setFieldValue("custrecord_custom_diamond_type_of_order",newCDP.getFieldValue("custitemtype_of_order_item"));
				diamond.setFieldValue("custrecord_diamond_sales_rep",newCDP.getFieldValue("custitem99"));
				diamond.setFieldValue("custrecord_cdp_request_location",newCDP.getFieldValue("custitem_appointment_location"));
				
				var request_status = newCDP.getFieldValue("custitem97");
				/* Turned off CS Status defaulting to Waiting for GR reply 2-20-14
				if(request_status=="2" || request_status=="3" || request_status=="4" || request_status=="5" || request_status=="6" || request_status=="7" || request_status=="8")
					diamond.setFieldValue("custrecord_custom_diamond_cs_status","1");
				*/
				
				//Check on transit quantity
				var transit = 0.00;
				var filters = [];
				filters.push(new nlobjSearchFilter("locationquantityintransit",null,"greaterthan","0.00"));
				filters.push(new nlobjSearchFilter("internalid",null,"is",internalid));
				var results = nlapiSearchRecord("item",null,filters);
				if(results)
				{
					transit = 1;
				}
				
				//Set Email Status
				switch(request_status)
				{
					case "1": //Sold
						var item_fields = nlapiLookupField("item",internalid,["quantityavailable","custitemcertificate_included"]);
						if(item_fields.custitemcertificate_included=="2" && (parseInt(item_fields.quantityavailable) > 0 || parseInt(transit) > 0))
						{
							diamond.setFieldValue("custrecord_cdp_group_a","T"); //Mark Group A
						}
						else if(item_fields.custitemcertificate_included=="1" && (parseInt(item_fields.quantityavailable) > 0 || parseInt(transit) > 0))
						{
							diamond.setFieldValue("custrecord_diamond_email_status","2"); //Email Status = Emailed
							diamond.setFieldValue("custrecord_cdp_group_b","T"); //Mark Group B
							diamond.setFieldValue("custrecord_diamond_status","1"); //Diamond Status = Confirmed
							diamond.setFieldValue("custrecord_diamond_confirmed","1"); //Diamond Confirmed = Yes
							diamond.setFieldValue("custrecord_diamond_email_status","5"); //Email Status = Batch Email
							break;
						}
					case "2": //Appointment Request
					case "5": //Check availability/eye-clean
					case "6": //Hold
					case "8": //Replacement (customer switch)
						var item_fields = nlapiLookupField("item",internalid,["quantityavailable","custitemcertificate_included"]);
						if(item_fields.custitemcertificate_included=="2" && (parseInt(item_fields.quantityavailable) > 0 || parseInt(transit) > 0))
						{
							diamond.setFieldValue("custrecord_cdp_group_a","T"); //Mark Group A
						}
						else if(item_fields.custitemcertificate_included=="1" && (parseInt(item_fields.quantityavailable) > 0 || parseInt(transit) > 0))
						{
							//diamond.setFieldValue("custrecord_diamond_email_status","2"); //Email Status = Emailed
							diamond.setFieldValue("custrecord_cdp_group_b","T"); //Mark Group B
							//diamond.setFieldValue("custrecord_diamond_status","1"); //Diamond Status = Confirmed
							//diamond.setFieldValue("custrecord_diamond_confirmed","1"); //Diamond Confirmed = Yes
							diamond.setFieldValue("custrecord_diamond_email_status","5"); //Email Status = Batch Email
							break;
						}
					case "9": //Memo
						diamond.setFieldValue("custrecord_diamond_email_status","1");
						break;
					case "7": //Replacement (diamond unavailable)
						diamond.setFieldValue("custrecord_diamond_email_status","1");
						var customer = diamond.getFieldValue("custrecord_diamond_customer_name");
						if(customer!=null && customer!="")
							diamond.setFieldValue("custrecord_diamond_sales_rep",nlapiLookupField("customer",customer,"salesrep"));
						var item_fields = nlapiLookupField("item",internalid,["quantityavailable","custitemcertificate_included"]);
						if(item_fields.custitemcertificate_included=="2" && (parseInt(item_fields.quantityavailable) > 0 || parseInt(transit) > 0))
						{
							diamond.setFieldValue("custrecord_cdp_group_a","T"); //Mark Group A
						}
						else if(item_fields.custitemcertificate_included=="1" && (parseInt(item_fields.quantityavailable) > 0 || parseInt(transit) > 0))
						{
							//diamond.setFieldValue("custrecord_diamond_email_status","2"); //Email Status = Emailed
							diamond.setFieldValue("custrecord_cdp_group_b","T"); //Mark Group B
							//diamond.setFieldValue("custrecord_diamond_status","1"); //Diamond Status = Confirmed
							//diamond.setFieldValue("custrecord_diamond_confirmed","1"); //Diamond Confirmed = Yes
							diamond.setFieldValue("custrecord_diamond_email_status","5"); //Email Status = Batch Email
							break;
						}
						break;
					case "3": //Cert Request
					case "4": //Photography Request
						diamond.setFieldValue("custrecord_diamond_email_status","");
						diamond.setFieldValue("custrecordowner","3"); //Set owner to CS Support
						break;
				}
				
				//Override Email Status to Manual if CDP parent item starts with "Y"
				var itemNum = newCDP.getFieldValue("itemid");
				if(itemNum!=null && itemNum!="" && itemNum.charAt(0)=="Y")
				{
					diamond.setFieldValue("custrecord_diamond_email_status","3"); //Set Email Status to Manual Email
				}
				
				//Check vendor record for 'Block automated emails' checkbox
				var vendor = nlapiLookupField("item",internalid,"vendor");
				if(vendor!=null && vendor!="")
				{
					var blockEmails = nlapiLookupField("vendor",vendor,"custentityblock_automated_emails");			
					if(blockEmails=="T")
						diamond.setFieldValue("custrecord_diamond_email_status","3");
				}
				
				//Set Email Status to Order on Website if vendor is Hari Krishna or Monarch or Kiran or Kapu India or Laxmi or JB or Blue Star
				if(vendor=="28712" || vendor=="236761" || vendor=="2325705" || vendor=="2550863" || vendor=="2551373" || vendor=="3132473" || vendor=="3432901" || vendor=="4215082")
				{
					diamond.setFieldValue("custrecord_diamond_email_status","4");
				}
				
				var cdpId= nlapiSubmitRecord(diamond,true,true);
				// New added code
				
				var requestType=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_request_type");
				var invtLoc=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_inventory_location");
				var On_VendorPortal=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_on_vendor_portal");
				if(requestType!=9 && (invtLoc!="" || invtLoc!=null))
				{
					On_VendorPortal="F";
					nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_on_vendor_portal",On_VendorPortal);
					nlapiLogExecution("debug","CDP not pushed to Portal",cdpId);
				}			
				else 
				{
				PushCDPRecordToPortal(cdpId);
                nlapiLogExecution("debug","New Created CDP id is : ",cdpId);
				}
				
				//end code
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Custom Diamond Record","Details: " + err.message);
			return true;
		}
	}
}

function formatNull(value)
{
	if(value==null)
		return "";
	else
		return value;
}

//Function that push created cdp to portal
function PushCDPRecordToPortal(cdpId)
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
			var map_PortalReqType = 0;
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
						//var url = "https://partner.brilliantearth.com/api/cdp/";  // For production
                                                var url = "https://testportal.brilliantearth.com/api/cdp/";   // for Sandbox   
					   
						//Setting up Headers 
						var headers = new Array(); 
						headers['http'] = '1.1';    
						headers['Accept'] = 'application/json';       
						//headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // For production
                                                headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';   // for Sandbox 
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

                                                /*var jsonobj = null;
						if(requestType == 1 && paid >= 20 && groupB == 'T' && assetAcct == 189 && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) //line 6 (Sold)
						{
							if(soStatus != null && soStatus != "" && soStatus == "fullyBilled")
							{
                                                                jsonobj = {"cdp_id": cdpId, 
						               "vendor_id": vendorId,
						               "portal_request_type": portalRequestTypeId,     
						               "action_needed":actNeedStr,
						               "item_status":item_status,
						               "on_vendor_portal":vendorPortal,
						               "manual_override":manual_override,
						               "payment_terms":paymentTerms
						              }
                                                        }
                                                        else
                                                        {
                                                                nlapiLogExecution("debug","Sales order is not fully billed for cdp id is:",cdpId);
                                                        }
                                                }
                                                else
                                                {
                                                        jsonobj = {"cdp_id": cdpId, 
						           "vendor_id": vendorId,
						           "portal_request_type": portalRequestTypeId,     
						           "action_needed":actNeedStr,
						           "item_status":item_status,
						           "on_vendor_portal":vendorPortal,
						           "manual_override":manual_override,
						           "payment_terms":paymentTerms
						           }
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

									      jsonobj = {"cdp_id": cdpId, 
									      "vendor_id": vendorId,
									      "portal_request_type": portalRequestTypeId,     
									      "action_needed":actNeedStr,
									      "item_status":item_status,
									      "on_vendor_portal":vendorPortal,
									      "manual_override":manual_override,
									      "payment_terms":paymentTerms
									     }
								     }
								    else
								    {	
                                                                           portalRequestTypeId = map_PortalReqType;						
									   jsonobj = {"cdp_id": cdpId, 
									   "vendor_id": vendorId,
									   "portal_request_type": portalRequestTypeId,     
									   "action_needed":actNeedStr,
									   "item_status":item_status,
									   "on_vendor_portal":vendorPortal,
									   "manual_override":manual_override,
									   "payment_terms":paymentTerms
									   }
								     }
								}
								else 
								{
									jsonobj = {"cdp_id": cdpId, 
									"vendor_id": vendorId,
									"portal_request_type": portalRequestTypeId,     
									"action_needed":actNeedStr,
									"item_status":item_status,
									"on_vendor_portal":vendorPortal,
									"manual_override":manual_override,
									"payment_terms":paymentTerms
									}
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

								jsonobj = {"cdp_id": cdpId, 
								"vendor_id": vendorId,
								"portal_request_type": portalRequestTypeId,     
								"action_needed":actNeedStr,
								"item_status":item_status,
								"on_vendor_portal":vendorPortal,
								"manual_override":manual_override,
								"payment_terms":paymentTerms
								}
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

										jsonobj = {"cdp_id": cdpId, 
										"vendor_id": vendorId,
										"portal_request_type": portalRequestTypeId,     
										"action_needed":actNeedStr,
										"item_status":item_status,
										"on_vendor_portal":vendorPortal,
										"manual_override":manual_override,
										"payment_terms":paymentTerms
										}
									}
									else
									{							
										jsonobj = {"cdp_id": cdpId, 
										"vendor_id": vendorId,
										"portal_request_type": portalRequestTypeId,     
										"action_needed":actNeedStr,
										"item_status":item_status,
										"on_vendor_portal":vendorPortal,
										"manual_override":manual_override,
										"payment_terms":paymentTerms
										}
									}
								}
								else 
								{
									jsonobj = {"cdp_id": cdpId, 
									"vendor_id": vendorId,
									"portal_request_type": portalRequestTypeId,     
									"action_needed":actNeedStr,
									"item_status":item_status,
									"on_vendor_portal":vendorPortal,
									"manual_override":manual_override,
									"payment_terms":paymentTerms
									}
								}
							}					
						}//end case #3
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

									      jsonobj = {"cdp_id": cdpId, 
									      "vendor_id": vendorId,
									      "portal_request_type": portalRequestTypeId,     
									      "action_needed":actNeedStr,
									      "item_status":item_status,
									      "on_vendor_portal":vendorPortal,
									      "manual_override":manual_override,
									      "payment_terms":paymentTerms
									     }
								     }
								    else
								    {
                                                                           portalRequestTypeId = map_PortalReqType;							
									   jsonobj = {"cdp_id": cdpId, 
									   "vendor_id": vendorId,
									   "portal_request_type": portalRequestTypeId,     
									   "action_needed":actNeedStr,
									   "item_status":item_status,
									   "on_vendor_portal":vendorPortal,
									   "manual_override":manual_override,
									   "payment_terms":paymentTerms
									   }
								     }
							}
							else 
							{
								jsonobj = {"cdp_id": cdpId, 
								"vendor_id": vendorId,
								"portal_request_type": portalRequestTypeId,     
								"action_needed":actNeedStr,
								"item_status":item_status,
								"on_vendor_portal":vendorPortal,
								"manual_override":manual_override,
								"payment_terms":paymentTerms
								}
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
                                                        if(old_PortalReqType == 2 && map_PortalReqType == 3 && item_status == 1 &&  old_ItemStatus == 2) 
							{
								cdpObj.setFieldValue('custrecord_diamond_status',"");
							}
							
							//Logic for new mapping by ajay 17march 2016							
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
									//PushCDPMessageToPortal(cdpId); // Call function to push cdp message to portal									
                                    if(diamondStatus != 1)
									{
										//PushPaymentToPortal(cdpId); // Call function to push cdp payment notify to portal
									}
									
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
				}//end check of resultArr                           
			}// end check of cdpId
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
	}
}
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
					  //var url = "https://partner.brilliantearth.com/api/item/";     // For production
                                           var url = "https://testportal.brilliantearth.com/api/item/";   // for Sandbox
 
					   var headers = new Array(); 
					   headers['http'] = '1.1';    
					   headers['Accept'] = 'application/json';       
					   //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';	  // For production
                                           headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';   // for Sandbox 
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
		var newMsg = ""; var portalReqTypeText = ""; var itemStatusText = ""; var actionNeededText = "";
		var portalReqTypeVal = 0; var itemStatusVal = 0; var actionNeededVal = 0;
		
		if(reqType == 1 && paid < 20) // 3,4
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
				"newMsg"        		: newMsg
			});
		}
		else if(reqType == 1 && paid >= 20 && grA == 'T' && assetAcct == 189) // 5
		{			
			if(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
				itemStatus = 2;
				itemStatusText = "Confirmed";
				actionNeeded = '4';
				actionNeededText = "Ready to Invoice";
				newMsg = "Memo diamond sold, please upload invoice and send lab cert via FedEx";
			} 
		
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg
			});
		}
		else if(reqType == 1 && paid >= 20 && grB == 'T' && assetAcct == 189) // 6
		{			
			if(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
				itemStatus = 2;
				itemStatusText = "Confirmed";
				actionNeeded = '4';
				actionNeededText = "Ready to Invoice";                     
				newMsg = "";
			}
						
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg				
			});
		}
		else if(reqType == 1 && paid >= 20) // Line 7
		{			
			//if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1 || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
.                       if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
			}			
						
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"        		: newMsg				
			});
		}
		else if(reqType == 6 ) // 8
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1)
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
				"newMsg"        		: newMsg				
			});
		}
		else if(reqType == 7 && paid >= 20 && csStatus != 4) // 9
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
				"newMsg"				: newMsg
			});
		}
		
		else if(reqType == 7 && paid >= 20 && csStatus == 4) // 10
		{
			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
			}						
						
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
				"newMsg"				: newMsg
			});
		}
		
		else if(reqType == 7 && paid >= 20 && csStatus == 4 && grA == 'T' && assetAcct == 189) // 11
		{						
			if(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
				itemStatus = 2;
				itemStatusText = "Confirmed";
				actionNeeded = '4';
				actionNeededText = "Ready to Invoice";
				newMsg = "Memo diamond sold, please uploade invoice and send lab cert via FedEx";
			}			
						
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});
		}
		else if(reqType == 7 && paid >= 20 && csStatus == 4 && grB == 'T' && assetAcct == 189) // 12
		{						
			if(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
				itemStatus = 2;
				itemStatusText = "Confirmed";
				actionNeeded = '4';
				actionNeededText = "Ready to Invoice";
				newMsg = "";
			}			
						
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});
		}
		
		else if(reqType == 7 && paid < 20 && csStatus != 4) // 13
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1)
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
				"newMsg"				: newMsg				
			});
		}
		else if(reqType == 8 && paid >= 20 && grA == 'T' && assetAcct == 189) // 14
		{			
			if(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
				itemStatus = 2;
				itemStatusText = "Confirmed";
				actionNeeded = '4';
				actionNeededText = "Ready to Invoice";
				newMsg = "Memo diamond sold, please uploade invoice and send lab cert via FedEx";
			}		
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});
		}		
		else if(reqType == 8 && paid >= 20 && grB == 'T' && assetAcct == 189) // 15
		{			
			if(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
				itemStatus = 2;
				itemStatusText = "Confirmed";
				actionNeeded = '4';
				actionNeededText = "Ready to Invoice";
				newMsg = "";
			}					
			
			arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});
		}		
		else if(reqType == 8) // 16
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
			}									
            arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});			
		}
		else if(reqType == 9 ) // 17
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1  || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 4;
				portalReqTypeText = "Memo";
			}
						
            arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});			
		}
		else if(reqType == 2) // 18
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1  || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
			{
				portalReqType = 4;
				portalReqTypeText = "Memo";
			}
						
            arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});			
		}
		else if(reqType == 5 ) // 19 
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 5;
				portalReqTypeText = "Check Availability/Eye-Clean";
			}						
			
            arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});			
		}
		else if(reqType == 4 ) // 20
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 6;
				portalReqTypeText = "Image Request";
			}
						
            arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});			
		}
		else if(reqType == 3 ) // 21
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
			{
				portalReqType = 7;
				portalReqTypeText = "Cert Request";
			}						
			
            arr.push({
				"portalReqTypeVal" 		: portalReqType,
				"itemStatusVal" 		: itemStatus,
				"actionNeededVal" 		: actionNeeded,
				"portalReqTypeText" 	: portalReqTypeText,
				"itemStatusText"    	: itemStatusText,
				"actionNeededText"  	: actionNeededText,
                "newMsg"				: newMsg				
			});			
		}
		return arr;
	}
	
// Push CDP message to Portal Function	
function PushCDPMessageToPortal(cdpId)
{
	/*try
	{
		var mySearch = nlapiLoadSearch(null, 3782);
		var searchresult = [];
		var resultset = mySearch.runSearch();
		var searchid = 0;
		do 
		{
			var resultslice = resultset.getResults(searchid, searchid + 1000);
			if (resultslice != null && resultslice != '') 
			{
				for (var rs in resultslice) 
				{
				   searchresult.push(resultslice[rs]);
				   searchid++;
				}
			}
		} 
		while (resultslice.length >= 1000);
		var searchCount1 = 0;
		var msgIdCdpIdArr=new Array();
		var msgIdCdpId="";
		searchCount1 = searchresult.length;
		if(searchresult && searchCount1 > 0) 
		{
			 
			for ( var i = 0; i < searchresult.length; i++) 
			{			   
			   var msgId= searchresult[i].getId();  
			   if(msgId !='' && msgId != null)
			    {
					var msgObj=nlapiLoadRecord("message",msgId);
					var msgCdpId=msgObj.getFieldValue('record');
					if(msgCdpId == cdpId)
					{
						//PushMessageNSToPortal(msgId,msgCdpId);
						//break;					
					}
			    }
			}		   
		}	
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during getting cdp message list is :",err.message); 
	}*/
}

function PushMessageNSToPortal(msgId,cdpId)
{                  
   if((msgId!='' && msgId!=null) && (cdpId!='' && cdpId!=null))
   {    
		if(msgId!='' && msgId!=null)
		{
		   var vendorId=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_vendor");
		   var vendorEmail= nlapiLookupField("vendor",vendorId,"email");     
		   var cdpArrField = ["author","authoremail","message","messagedate","recipientemail","subject"];
		   var cdpVal = nlapiLookupField("message",msgId,cdpArrField);
		   var author=cdpVal.author;
		   var authorEmail=cdpVal.authoremail;
		   var message=cdpVal.message;
		   var date_created=cdpVal.messagedate;     
		   var recipient_email11=cdpVal.recipientemail;
		   var recipient_email=vendorEmail;		  
		   var author_email=authorEmail;
		   var message_subject=cdpVal.subject;		   
           var message_id=msgId;		  
		   var dateTimeArr='',dateStr='',timeStr='';
			if(date_created!='' && date_created!=null)
			{
			 dateTimeArr=date_created.split(' ');
			 dateStr=dateFormatYMD(dateTimeArr[0]);
			 timeStr=dateTimeArr[1]+':'+'00';
			}
			date_created= dateStr+' '+timeStr;
			if(author!='' && author!=null &&  author_email!='' &&  author_email!=null && recipient_email!='' && recipient_email !=null && date_created!='' &&  message_subject!='' &&  message_id!='' && message_id!=null  && message!='')
			{
			   //Setting up URL of CDP             
				 var url = "https://partner.brilliantearth.com/api/message/";     

				  //Setting up Headers 
				  var headers = new Array(); 
				  headers['http'] = '1.1';    
				  headers['Accept'] = 'application/json';       
				  headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
				  headers['Content-Type'] = 'application/json'; 
				  headers['User-Agent-x'] = 'SuiteScript-Call';  

				   
				 //Setting up Datainput
				 var jsonobj = {"author": author_email, 
				 "message": message,
				 "date_created": date_created,
				 "author_email": author_email,
				 "recipient_email": recipient_email,
				 "message_subject": message_subject,
				 "message_id": message_id,
				 "cdp_id": cdpId
				  }
						
				  //Stringifying JSON
				  var myJSONText = JSON.stringify(jsonobj, replacer); 
				  var response = nlapiRequestURL(url, myJSONText, headers);    
				  //Below is being used to put a breakpoint in the debugger  
				  var rst=response.action_needed;  
				  if(response.code=='200')
				  {
				   nlapiLogExecution('debug','CDP Communication Successfully Pushed to Portal for CdpId:'+cdpId+',msgId:'+msgId, cdpId);
				  }
				  else
				  {
						//var responsebody = JSON.parse(response.getBody());		                        
						nlapiLogExecution('debug','CDP Communication detail not exists to push on portal for CdpId:'+cdpId, cdpId);
				  } 
				 
			 }// end check
		}// end check of msgId 
    }//end check of msgId & cdpId 
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

//Start function of ns payment to portal
function PushPaymentToPortal(cdpId)
{			
	//Setting up URL of CDP payment 
	var url = "https://partner.brilliantearth.com/api/order-notify/";
	var headers = {"User-Agent-x": "SuiteScript-Call","Authorization": "token d499ecd8233123cacd3c5868939fe167b7bf0837","Content-Type": "application/json", "Accept": "application/json"};
				
	//Setting up Datainput
	var jsonobj = {"cdp_id": cdpId}
			
	//Stringifying JSON
	var myJSONText = JSON.stringify(jsonobj, replacer); 
	var response = nlapiRequestURL(url, myJSONText, headers, "POST");    
	
	//Below is being used to put a breakpoint in the debugger		  
	if(response.code=='200')
	{
		var responsebody = JSON.parse(response.getBody()) ;
		var retData = responsebody['action_needed'];
		
		nlapiSubmitField('customrecord_custom_diamond',cdpId,'custrecord_action_needed', retData);       
		nlapiLogExecution('debug','Successfully Push On Vendor Portal for CDP and get action_needed value is :'+retData);
		SendMailToVendor(cdpId);			
	}
	else 
	{
		//var responsebody = JSON.parse(response.getBody()) ;
		//var retData = responsebody['action_needed'];
		nlapiLogExecution('debug','Payment detail not exists to push on portal for CdpId:'+cdpId, cdpId);        
	}		
}    	

function SendMailToVendor(cdpId)
{
	var vendorId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_vendor");
	var billId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_created_bill_no");      
			
	if(billId != null && billId != '')
	{		
		var billObj = nlapiLoadRecord("vendorbill",billId);
		var amount = billObj.getFieldValue("usertotal");
		var invoice_num = billObj.getFieldValue("custbody_portal_invoice_number");
		var billDate = billObj.getFieldValue("trandate");
		var vendorName = billObj.getFieldText("entity");			
		var email = nlapiLookupField("vendor",vendorId,"email");
		if(email != null && email != '')
		{
			SendMail(invoice_num,amount,billDate,vendorName,email);
		}
	}        	
} 

function SendMail(invoice_num,amount,date,vendorName,email)
{	    
	var subject = "Bill Payment Summary";                	
	var body = '<table>';
	body += '<tr><td><b>Vendor Name : </b></td><td>'+vendorName+'</td></tr>';
	body += '<tr><td><b>Bill Payment Date : </b></td><td>'+date+'</td></tr>';
	body += '<tr><td><b>Bill Payment Amount : </b></td><td>'+amount+'</td></tr>';
	body += '<tr><td><b>Invoice Number : </b></td><td>'+invoice_num+'</td></tr>';		
	body += '</table>';
			
	nlapiSendEmail( -5, email, subject, '<html><body style="font-family:Verdana">'+body+'</body></html>',null,null,null,null );
	nlapiLogExecution('debug','Email has been sent to vendor :', email);		
}

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}	