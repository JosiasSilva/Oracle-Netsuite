//Set Hyperlink of Portal Record Url
function Before_Load(type,form)
{
      nlapiLogExecution("debug","event type is :",type);
      if(type == "view" || type == "edit")
      {
               var url  = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord_hidden_portal_url");
               nlapiLogExecution("debug","Portal Diamond Record Url is :",url);
               
               if(url != null && url != "")
               {             
                      form.getField('custrecord_portal_record_url').setLinkText(url).setDefaultValue(url);               
               }
      }
}

function PushCdpDataNSToPortal(type)
{
    if(type == "create" || type == "edit"  || type == "xedit")	
	{
		try
		{
            var cdpId = nlapiGetRecordId(); 

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
		 
			var old_PortalReqType = nlapiGetOldRecord().getFieldValue("custrecord165");
			var new_PortalReqType = nlapiGetNewRecord().getFieldValue("custrecord165");
            nlapiLogExecution("debug","Old Portal Request Type is : "+old_PortalReqType);
            nlapiLogExecution("debug","New Portal Request Type is : "+new_PortalReqType);

            var old_diamond_status = nlapiGetOldRecord().getFieldValue("custrecord_diamond_status");
			var new_diamond_status = nlapiGetNewRecord().getFieldValue("custrecord_diamond_status");
            nlapiLogExecution("debug","Old Diamond status is : "+old_diamond_status);
            nlapiLogExecution("debug","New Diamond status is : "+new_diamond_status);
			
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
                          if(type == "create" || type == "edit") // added as per feedback
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
					 portalRequestTypeId = resultArr[0].portalReqTypeVal;
                                         // nlapiLogExecution('debug','Portal Request TypeId:'+portalRequestTypeId, portalRequestTypeId);
					
					 var map_PortalReqType = portalRequestTypeId;				   
					 if(portalRequestTypeId==null || portalRequestTypeId=='')
					 {
					    portalRequestTypeId="0";
					 }
					 nlapiLogExecution('debug','Map Portal Request TypeId :', map_PortalReqType);
										
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
					   actNeedStr=action_needed.split(',');
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
						var jsonobj = null;
						if(requestType == 1 && paid >= 20 && groupB == 'T' && assetAcct == 189 && (diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) //line 6 (Sold)
						{
							if(soStatus != null && soStatus != "" && soStatus == "fullyBilled")
							{
								if(old_diamond_status == new_diamond_status)
								{
									if(old_PortalReqType == 2 && new_PortalReqType == 3)
									{
										if(old_ItemStatus == 2) //confirmed
								                {
									              item_status = 1;
									              portalRequestTypeId = new_PortalReqType;
									              nlapiLogExecution("debug","changes item status is :","Not confirmed");
									              nlapiLogExecution("debug","new portal request type is :","Sold");

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
                                                                                     portalRequestTypeId = new_PortalReqType;							
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
									else if(old_PortalReqType == 2 && map_PortalReqType == 3)
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
									else if((old_PortalReqType != null || old_PortalReqType == null) && new_PortalReqType == null)
									{
										item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");										
										nlapiLogExecution("debug","Unchanged item status is :",item_status);
										
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
								else if(old_diamond_status != null && new_diamond_status == null)
								{
									item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");
									
									nlapiLogExecution("debug","item status related to new diamond status null is :",item_status);
																
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
									if(new_diamond_status == 2) // Requested Pending
									{
										item_status = item_status; 
									}
									else
									{
                                                                                if(old_diamond_status != new_diamond_status && new_diamond_status != null)
                                                                                {
                                                                                        item_status =  GetDiamondStatus(new_diamond_status);
                                                                                        nlapiLogExecution("debug","New Item Status1 against new diamond status is :",item_status);  
                                                                                }
                                                                               else if(old_ItemStatus != new_ItemStatus && new_ItemStatus != null)
                                                                               {
                                                                                         item_status = new_ItemStatus;
                                                                                         nlapiLogExecution("debug","New Item Status1 is :",item_status);  
                                                                               }
                                                                               else
                                                                               {
                                                                                          item_status = old_ItemStatus;
                                                                                          nlapiLogExecution("debug","Original Item Status1 is :",item_status);  
                                                                                }										
										/*item_status =  GetDiamondStatus(new_diamond_status);
                                                                                if(item_status == 1)
										{
											item_status = old_ItemStatus;
										}*/
										if(new_diamond_status == 6) //Not Available Replacement Confirmed
										{
											item_status = 6; // Cancellation confirmed
										}
										else if(new_diamond_status == 7 || new_diamond_status == 9) // On-Hold Pending Customer Decision/On-Hold customer Payment pending
										{
											item_status = 2; // Confirmed
										}
									}
									nlapiLogExecution("debug","item status related to diamond is :",item_status);
																
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
						else if(requestType == 7 && old_PortalReqType == 2 && cs_status != 4 && paid >= 20)//case #3
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
								if(old_diamond_status == new_diamond_status)
								{
									if(old_PortalReqType == 2 && new_PortalReqType == 3 )
									{
										if(old_ItemStatus == 2) //confirmed
										{
											 item_status = 1; 
											 portalRequestTypeId = new_PortalReqType;
											 nlapiLogExecution("debug","changes item status is :","Not confirmed");
											 nlapiLogExecution("debug","new portal request type is :","Sold");

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
											portalRequestTypeId = new_PortalReqType;								
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
									else if(old_PortalReqType == 2 && map_PortalReqType == 3)
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
									else if((old_PortalReqType != null || old_PortalReqType == null) && new_PortalReqType == null)
									{
										item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");										
										nlapiLogExecution("debug","Unchanged item status is :",item_status);
										
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
								else if(old_diamond_status != null && new_diamond_status == null)
								{
									item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");
									
									nlapiLogExecution("debug","item status related to new diamond status null is :",item_status);
																
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
									if(new_diamond_status == 2) // Requested Pending
									{
										item_status = item_status; 
									}
									else
									{
                                                                                if(old_diamond_status != new_diamond_status && new_diamond_status != null)
                                                                                {
                                                                                        item_status =  GetDiamondStatus(new_diamond_status);
                                                                                        nlapiLogExecution("debug","New Item Status2 against new diamond status is :",item_status);  
                                                                                }
                                                                               else if(old_ItemStatus != new_ItemStatus && new_ItemStatus != null)
                                                                               {
                                                                                         item_status = new_ItemStatus;
                                                                                         nlapiLogExecution("debug","New Item Status2 is :",item_status);  
                                                                               }
                                                                               else
                                                                               {
                                                                                          item_status = old_ItemStatus;
                                                                                          nlapiLogExecution("debug","Original Item Status2 is :",item_status);  
                                                                                }										
										/*item_status =  GetDiamondStatus(new_diamond_status);
                                                                                if(item_status == 1)
										{
											item_status = old_ItemStatus;
										}*/
										if(new_diamond_status == 6) //Not Available Replacement Confirmed
										{
											item_status = 6; // Cancellation confirmed
										}
										else if(new_diamond_status == 7 || new_diamond_status == 9) // On-Hold Pending Customer Decision/On-Hold customer Payment pending
										{
											item_status = 2; // Confirmed
										}
									}
									nlapiLogExecution("debug","item status related to diamond is :",item_status);
																
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
						}//Case #3 end
						else
						{
							if(old_diamond_status == new_diamond_status)
							{
								if(old_PortalReqType == 2 && new_PortalReqType == 3)
								{
									if(old_ItemStatus == 2) //confirmed
								                {
									              item_status = 1; 
									              portalRequestTypeId = new_PortalReqType;
									              nlapiLogExecution("debug","changes item status is :","Not confirmed");
									              nlapiLogExecution("debug","new portal request type is :","Sold");

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
                                                                                     portalRequestTypeId = new_PortalReqType;							
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
								else if(old_PortalReqType == 2 && map_PortalReqType == 3)
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
								else if((old_PortalReqType != null || old_PortalReqType == null) && new_PortalReqType == null)
								{
									item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");										
									nlapiLogExecution("debug","Unchanged item status is :",item_status);
									
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
                                                                        nlapiLogExecution("debug","track portal req type is :", portalRequestTypeId);
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
								if(new_diamond_status == 2) // Requested Pending
								{
									item_status = item_status; 
								}
								else
								{  
                                                                       nlapiLogExecution("debug","New diamond Status3 against new is :",new_diamond_status);  
                                                                       if(old_diamond_status != new_diamond_status && new_diamond_status != null)
                                                                       {                                                                                
                                                                                item_status =  GetDiamondStatus(new_diamond_status);
                                                                                nlapiLogExecution("debug","New Item Status3 against new diamond status is :",item_status);  
                                                                       }
                                                                       else if(old_ItemStatus != new_ItemStatus && new_ItemStatus != null)
                                                                       {
                                                                                 item_status = new_ItemStatus;
                                                                                 nlapiLogExecution("debug","New Item Status3 is :",item_status);  
                                                                       }
                                                                       else
                                                                       {
                                                                                 item_status = old_ItemStatus;
                                                                                 nlapiLogExecution("debug","Original Item Status3 is :",item_status);  
                                                                       }										
									/*item_status =  GetDiamondStatus(new_diamond_status);
                                                                        if(item_status == 1)
									{
										item_status = old_ItemStatus;
									}*/
									if(new_diamond_status == 6) //Not Available Replacement Confirmed
									 {
										item_status = 6; // Cancellation confirmed
									}
									else if(new_diamond_status == 7 || new_diamond_status == 9) // On-Hold Pending Customer Decision/On-Hold customer Payment pending
									{
										item_status = 2; // Confirmed
									}
								}
								nlapiLogExecution("debug","item status related to diamond is :",item_status);
															
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
						}//end line 6 mapping condition
								
						//Stringifying JSON
                                               if(jsonobj != null)
					       {
						var myJSONText = JSON.stringify(jsonobj, replacer); 
                                                nlapiLogExecution('debug','CDP Response Body:', myJSONText);
						var response = nlapiRequestURL(url, myJSONText, headers); 
					   
						//Below is being used to put a breakpoint in the debugger
					  
						if(response.code=='200')
						{										 
							cdpObj.setFieldValue('custrecord_on_vendor_portal',onVendorPortal);
							cdpObj.setFieldValue('custrecord_action_needed',actNeedArr);
							//cdpObj.setFieldValue('custrecord_item_status',item_status);
							cdpObj.setFieldValue('custrecord165',portalRequestTypeId);
							if(old_diamond_status == new_diamond_status)
							{
								cdpObj.setFieldValue('custrecord_item_status',item_status);
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
									cdpObj.setFieldValue('custrecord_item_status',item_status);
								}
							}
							if(old_PortalReqType == 2 && new_PortalReqType == 3 && item_status == 1  &&  old_ItemStatus == 2)
							{
								cdpObj.setFieldValue('custrecord_diamond_status',"");
							}
							else if(old_PortalReqType == 2 && map_PortalReqType == 3 && item_status == 1 && old_ItemStatus == 2)
							{
								cdpObj.setFieldValue('custrecord_diamond_status',"");
							}
							
							//Logic for new mapping by ajay 17march 2016							
							if(requestType == 7 && old_PortalReqType == 2 && cs_status != 4) //case #1
							{
								//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal
                                                                if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed 
								{
									cdpObj.setFieldValue('custrecord_diamond_status',7); //On Hold � Pending Customer Decision
								}								
							}
							else if(requestType == 7 && old_PortalReqType == 2 && paid < 20) //case #2
							{
								//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal
                                                                if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed 
								{
									cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold � Customer Payment Pending
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
								if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed
								{
									cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold � Customer Payment Pending
								}								
							}
							else if(requestType == 6 && old_PortalReqType == 2) //case #6
							{
								if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed
								{
									cdpObj.setFieldValue('custrecord_diamond_status',7);//On Hold � Pending Customer Decision
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
                                            nlapiLogExecution('debug','CDP Item Response Body:', myJSONText);
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
				"newMsg"        		: newMsg
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
				"newMsg"        		: newMsg
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
				"newMsg"        		: newMsg				
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
				"newMsg"        		: newMsg				
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
				"newMsg"        		: newMsg				
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
				"newMsg"				: newMsg
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
				"newMsg"				: newMsg
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
				"newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
                "newMsg"				: newMsg				
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
			//SendMail(invoice_num,amount,billDate,vendorName,email); // Commented By Ajay
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