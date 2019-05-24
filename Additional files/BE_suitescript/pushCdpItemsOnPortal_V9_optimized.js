//Set Hyperlink of Portal Record Url
function Before_Load(type,form)
{
      nlapiLogExecution("debug","event type is :",type);
      if(type == "view" || type == "edit")
      {
               var url  = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord_hidden_portal_url");
               nlapiLogExecution("debug","Portal Diamond Record Url is :",url);
               //form.getField('custrecord_portal_record_url').setLinkText('https://www.yahoo.com').setDefaultValue("https://www.yahoo.com");  
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
				//nlapiLogExecution('debug','CDP ID is :'+cdpId , cdpId );
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
							}*/
							/*else
							{
								PushCDPRecordToPortal(cdpId, type);
								nlapiLogExecution("debug", "New Created CDP id is : ", cdpId);
							}
							// Ended by Rahul Panchal*/
							//else			
							//{

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
							   var mapping_logic = cdpObj.getFieldValue('custrecordoverride_mapping_logic');// added by Yagya 19July2016
							   var portal_url = 'https://partner.brilliantearth.com/search/?query='+vendorStockNo;
								var delivery_location= cdpObj.getFieldValue('custrecord_diamond_inventory_location');
								if(old_diamond_status == null)
								{
									old_diamond_status="";
								}
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
								resultArr =	GetPortalRequestVal(resultArr,diamond,paymentTerms,portalRequestTypeId,requestType,paid,groupA,groupB,item_status,action_needed,cs_status,assetAcct,delivery_location)

								if(resultArr.length > 0)
								{   
									 portalRequestTypeId = resultArr[0].portalReqTypeVal;
									// Added by Rahul Panchal on dated 18/10/2016 as per DP-200
										var mappingline = resultArr[0].mappingline; 
									if(mappingline=='5' || mappingline=='6' || mappingline=='11' || mappingline=='12' || mappingline=='14' || mappingline=='15')
									{
										pushCDPtoPortal(cdpId,resultArr,portalRequestTypeId,item_status,action_needed,mapping_logic,cdpObj,onVendorPortal,requestType,paid,groupB,assetAcct,diamond,soStatus,old_diamond_status,new_diamond_status,old_PortalReqType,new_PortalReqType,old_ItemStatus,vendorId,vendorPortal,manual_override,paymentTerms,portal_url,new_ItemStatus,cs_status,old_CsStatus,new_CsStatus,delivery_location)
										nlapiLogExecution('debug',"sucessfully CDP pushed to portal",cdpId,mappingline);
									}
									else
									{
										// Added By Rahul Panchal on 17/09/2016				
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
										{
											nlapiLogExecution('debug','Test 2121'+cdpId , cdpId );	
											pushCDPtoPortal(cdpId,resultArr,portalRequestTypeId,item_status,action_needed,mapping_logic,cdpObj,onVendorPortal,requestType,paid,groupB,assetAcct,diamond,soStatus,old_diamond_status,new_diamond_status,old_PortalReqType,new_PortalReqType,old_ItemStatus,vendorId,vendorPortal,manual_override,paymentTerms,portal_url,new_ItemStatus,cs_status,old_CsStatus,new_CsStatus,delivery_location)
											nlapiLogExecution('debug',"sucessfully CDP pushed to portal Rahul",mappingline);
										}
									}
									 // nlapiLogExecution('debug','Portal Request TypeId:'+portalRequestTypeId, portalRequestTypeId);									 
								}//end check of resultArr 								
							}// end check of cdpId
									   SetDiamondETA(type);//Set Diamond ETA
						//}
		}
		catch(err)
		{
		  nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
		}
    }		
}

function SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location)
{       
	var jsonobj = {"cdp_id": cdpId, 
					"vendor_id": vendorId,
					"portal_request_type": portalRequestTypeId,     
					"action_needed":actNeedStr,
					"item_status":item_status,
					"on_vendor_portal":vendorPortal,
					"manual_override":manual_override,
					"payment_terms":paymentTerms,
				        "cdp_request_type":parseInt(requestType),
                                       // "portal_record_url":portal_url
				   " Delivery Location" : delivery_location
					}	 
	return jsonobj;
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
/*----------------------------Added By Yagya Kumar 08/09/16---------------------------------*/
						var itemCostObj=nlapiLoadRecord("inventoryitem",itemId);
						var item_cost=itemCostObj.getLineItemValue("itemvendor","purchaseprice",1);
					/*----------------------------Ended By Yagya Kumar 08/09/16---------------------------------*/
					  //Setting up URL of CDP             
					  var url = "https://partner.brilliantearth.com/api/item/";     //for production
					  //var url = "https://testportal.brilliantearth.com/api/item/"; // for Sandbox  
                     
					   var headers = new Array(); 
					   headers['http'] = '1.1';    
					   headers['Accept'] = 'application/json';       
					   headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
					   //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';   // for Sandbox
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
 "cost":item_cost,	
					  //"cost":itemArrVal.cost,
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

function GetPortalRequestVal(arr,diamond,paymentTerms,portalReqType,reqType,paid,grA,grB,itemStatus,actionNeeded,csStatus,assetAcct,delivery_location)
	{		
		var newMsg = ""; var portalReqTypeText = ""; var itemStatusText = ""; var actionNeededText = ""; var mappingline="";
		var portalReqTypeVal = 0; var itemStatusVal = 0; var actionNeededVal = 0; var del_location='';
		
		if((reqType == 1 && paid < 20) && ((diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)||(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1))) // 3,4 (Sold)
		{	
			if(diamond.indexOf("AN") != -1)
			{
				portalReqType = 2;
				portalReqTypeText = "Hold";
			}
            /*if(diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1) //3
			{
				portalReqType = 3;
				portalReqTypeText = "Sold";
			} */				
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
				"mappingline"          : 4,
				"delivery Location"		: del_location
			});
		}
		
		else if((reqType == 1 && paid >= 20 && grA == 'T' && assetAcct == 189)&&(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 5 (Sold)
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
				"mappingline"          : 5,
				"delivery Location"		: del_location
			});
		}
		else if((reqType == 1 && paid >= 20 && grB == 'T' && assetAcct == 189) &&(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))     // Line 6 (Sold)
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
				"mappingline"          : 6,
				"delivery Location"		: del_location
			});
		}
		else if((reqType == 1 && paid >= 20)  && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1))     // Line 7 (Sold)
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
				"mappingline"          : 7,
				"delivery Location"		: del_location
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
				"mappingline"          : 8,
				"delivery Location"		: del_location
			});
		}
		else if((reqType == 7 && paid >= 20 && csStatus != 4) && ((diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)||(diamond.indexOf("A") != -1 || diamond.indexOf("Y") != -1))) // 9 (Replacement(diamond unavailable))
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
				"mappingline"          : 9,
				"delivery Location"		: del_location
			});
		}
		
		else if((reqType == 7 && paid >= 20 && csStatus == 4)&&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)) // 10 (Replacement(diamond unavailable))
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
				"mappingline"          : 10,
				"delivery Location"		: del_location
			});
		}
		
		else if((reqType == 7 && paid >= 20 && csStatus == 4 && grA == 'T' && assetAcct == 189) &&(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))// 11 (Replacement(diamond unavailable))
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
				"mappinglines"          : 11,
				"delivery Location"		: del_location
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
				"mappinglines"          : 12,
				"delivery Location"		: del_location
			});
		}
		
		else if((reqType == 7 && paid < 20 && csStatus != 4) &&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1))// 13 (Replacement(diamond unavailable))
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
				"mappinglines"          : 13,
				"delivery Location"		: del_location
			});
		}
		else if((reqType == 8 && paid >= 20 && grA == 'T' && assetAcct == 189)&&(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 14 (Replacement(Customer Switch))
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
				"mappinglines"          : 14,
				"delivery Location"		: del_location
			});
		}		
		else if((reqType == 8 && paid >= 20 && grB == 'T' && assetAcct == 189)&&(diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 15 (Replacement(Customer Switch))
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
				"mappinglines"          : 15,
				"delivery Location"		: del_location
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
				"mappinglines"          : 16,
				"delivery Location"		: del_location
			});			
		}
		else if((reqType == 9 ) && (diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1))// 17(Memo)
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
				"mappinglines"          : 17,
				"delivery Location"		: del_location
			});			
		}
		else if((reqType == 2)&&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)) // 18(Appointment Request)
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
				"mappinglines"          : 18,
				"delivery Location"		: del_location
			});			
		}
		else if((reqType == 5 )&&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)) // 19 (Check Availability/Eye-Clean)
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
				"mappinglines"          : 19,
				"delivery Location"		: del_location
			});			
		}
		else if((reqType == 4 )&&(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)) // 20 (Photography Request)
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
				"mappinglines"          : 20,
				"delivery Location"		: del_location
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
				"mappinglines"          : 21,
				"delivery Location"		: del_location
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

//----------------------------------Set Diamond ETA value 25Aug 2016-----------------------------
function SetDiamondETA(type)
{
    try
    {
                var log_type = "debug"; 
		var diamondETA = null;
                nlapiLogExecution("debug","Event Type is :",type);       
		if(type == "create" || type == "edit" || type == "xedit")
		{
                        var Id = nlapiGetRecordId();                                                
                        nlapiLogExecution("debug","CDP Id is :",nlapiGetRecordId());

                        var old_diamond_eta = nlapiGetOldRecord().getFieldValue("custrecord_diamond_eta");
			var new_diamond_eta = nlapiGetNewRecord().getFieldValue("custrecord_diamond_eta");
			nlapiLogExecution(log_type,"old diamond eta :",old_diamond_eta);
			nlapiLogExecution(log_type,"new diamond eta :",new_diamond_eta);
                       
                        var cdpArrField = ["custrecord_diamond_eta","custrecord_custom_diamond_request_type","custrecord_diamond_status","custrecord_item_status","custrecord165"];
                        var cdpFieldVal = nlapiLookupField("customrecord_custom_diamond",Id,cdpArrField);
			var diamond_Eta = cdpFieldVal.custrecord_diamond_eta;		
		        nlapiLogExecution("debug","Diamond Eta :",diamond_Eta);		
		        var requestType = cdpFieldVal.custrecord_custom_diamond_request_type;
                        nlapiLogExecution("debug","Request type is :",requestType);
                        var diamondStatus = cdpFieldVal.custrecord_diamond_status;
                        nlapiLogExecution("debug","Diamond Status is :",diamondStatus);
                        var portalReqType = cdpFieldVal.custrecord165;
                        nlapiLogExecution("debug","Portal Request Type is :",portalReqType);
			var itemStatus = cdpFieldVal.custrecord_item_status;
                        var old_itemStatus = nlapiGetOldRecord().getFieldValue("custrecord_item_status");
			var new_itemStatus = nlapiGetNewRecord().getFieldValue("custrecord_item_status");
                        nlapiLogExecution("debug","Old Item Status is :",old_itemStatus);
			nlapiLogExecution("debug","New Item Status is :",new_itemStatus);
			var diamondStockNo = nlapiLookupField("customrecord_custom_diamond",Id,"custrecord_be_diamond_stock_number",true); 
						
                        var old_diamondStatus = nlapiGetOldRecord().getFieldValue("custrecord_diamond_status");
			var new_diamondStatus = nlapiGetNewRecord().getFieldValue("custrecord_diamond_status");
			nlapiLogExecution("debug","Old Diamond Status is :",old_diamondStatus);
			nlapiLogExecution("debug","New Diamond Status is :",new_diamondStatus);
                        nlapiLogExecution("debug","Page Diamond Status is :",nlapiGetFieldValue("custrecord_diamond_status"));
			
                       var old_portalReqType = nlapiGetOldRecord().getFieldValue("custrecord165");
			var new_portalReqType = nlapiGetNewRecord().getFieldValue("custrecord165");
			nlapiLogExecution("debug","Old Portal Request Type is :",old_portalReqType);
			nlapiLogExecution("debug","New Portal Request Type is :",new_portalReqType);

            if(old_diamond_eta == new_diamond_eta || (old_diamond_eta == null && new_diamond_eta == ''))
			{
				                       
                if(portalReqType == 3 || portalReqType == 4)		//New Codition					
				{                                
                    if( (old_diamondStatus != 1 && new_diamondStatus == 1 && (portalReqType == 3 || portalReqType == 4)) || (old_itemStatus != 2 && new_itemStatus == 2 && itemStatus == 2  && old_diamondStatus != new_diamondStatus && (portalReqType == 3 || portalReqType == 4)))	//Changed New condition				
					{
						var vendorId = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord_custom_diamond_vendor");
						var vendorArr = ['custentitydia_eta_daily_deadline','custentitydia_eta_business_days','custentityvendor_ship_days']; // for production
															
						if(vendorId != '')
						{
							var vendorFields = nlapiLookupField("vendor",vendorId,vendorArr);				
							var deadLine = vendorFields.custentitydia_eta_daily_deadline;
							var businessDays = vendorFields.custentitydia_eta_business_days;
							var shipDays = vendorFields.custentityvendor_ship_days; // for production
							
							var currentDate = new Date();
							var day = currentDate.getDay();
							var hours = currentDate.getHours();
							var mins = currentDate.getMinutes();
							hours = parseFloat(hours + mins/60).toFixed(2);

							nlapiLogExecution(log_type,"current date :",currentDate);
							nlapiLogExecution(log_type,"current time :",hours);
							
							var shipDaysArr = new Array();
							var count = 0;
							if(businessDays != '')
							{
								if(deadLine != null)
								{
									var deadLineTime = deadLine.split(' ')[0];								
									var deadLineTimeNo = parseFloat(parseFloat(deadLineTime.split(':')[0])+parseFloat(deadLineTime.split(':')[1]/60)).toFixed(2);
									var deadLineSpecific = deadLine.split(' ')[1];
									if(deadLineSpecific == "pm")
									{
									   deadLineTimeNo = (12 + parseFloat(deadLineTimeNo)).toFixed(2); 
									}
									nlapiLogExecution(log_type,"deadLineTime :",deadLineTimeNo);
									if(parseFloat(hours) <= parseFloat(deadLineTimeNo) || deadLineTimeNo == '')
									{						
										if(shipDays != null)
										{
											shipDaysArr = shipDays.split(',');
											for(var i = 0; i < shipDaysArr.length; i++)
											{
												count = count + 1;								
											}
											
											if(count == 1 && (shipDaysArr[0] == 1 || shipDaysArr[0] == ''))  // N/A condition
											{
												diamondETA = GetDiamondETA(day,businessDays,currentDate);
											}
											else if(count >= 1 && shipDaysArr[0] != 1)
											{
												diamondETA = DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo);							
											}                            
										}                                                               												
									} 
									else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
									{
										if(shipDays != null)
										{
											shipDaysArr = shipDays.split(',');
											for(var i = 0; i < shipDaysArr.length; i++)
											{
												count = count + 1;								
											}
											
											if(count == 1 && (shipDaysArr[0] == 1 || shipDaysArr[0] == ''))  // N/A condition
											{
												diamondETA = GetDiamondETA(day,businessDays,currentDate);
												var newDay = diamondETA.getDay();
												if(parseFloat(hours) > parseFloat(deadLineTimeNo))
												{
													if(newDay <= 4)
													{
													   diamondETA = nlapiAddDays(diamondETA,1);
													}
													else
													{
													   diamondETA = nlapiAddDays(diamondETA,3);
													}
												}
											}
											else if(count >= 1 && shipDaysArr[0] != 1)
											{
												diamondETA = DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo);							
											}                            
										}									
									}																
									nlapiSubmitField("customrecord_custom_diamond",Id,"custrecord_diamond_eta",nlapiDateToString(diamondETA));								
									nlapiLogExecution(log_type,"Diamond ETA Field has been set with calculated data.", nlapiDateToString(diamondETA));                                                        						
								}
							}
							else 
							{
								nlapiLogExecution(log_type,"Dia ETA BusinessDays Field on Vendor page is an empty.");
							}								
						}
					}                                
				} // End Request Type				
            } // End diamond_Eta condition
	    else
	    {
                if(type != "xedit")
                {
		            nlapiSubmitField(nlapiGetRecordType(),Id,"custrecord_diamond_eta",new_diamond_eta);
                    nlapiLogExecution(log_type,"Diamond ETA Field has been updated with manual data.", new_diamond_eta);
                }
	    }
	}// End Event Type	
    }
    catch(err)
    {
        nlapiLogExecution("debug","Error Occur during inline edit CDP is : ",err.message);
    }
}

function DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo)
{
    var diamondETA = new Date();
	var newDay = 0; var diffDay = 0;
    if(count == 5) // for all condition
	{
	    diamondETA = GetDiamondETA(day,businessDays,currentDate);
	}
	else if(count > 1 && count <= 4)
	{
		//code here 
		if(count == 2)
		{
			if(day == shipDaysArr[0]-1)
			{
				if(parseFloat(hours) <= parseFloat(deadLineTimeNo))
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
				{
                	newDay = shipDaysArr[1]-1;			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));											
				}
			}
			else if(day < shipDaysArr[0]-1)
			{
                newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));	
			}
			else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
				{
					newDay = shipDaysArr[0]-1;
					diffDay = 7 - (shipDaysArr[1] - shipDaysArr[0]);					
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay));	
				}
			}
			else if(shipDaysArr[1]-1 < day)
			{
                newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day));	
			}									
		}
		else if(count == 3)
		{
			if(day == shipDaysArr[0]-1)
			{
				if(parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
				{
                	newDay = shipDaysArr[1]-1;			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));				
				}
			}
			else if(day < shipDaysArr[0]-1)
			{
                newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));	
			}
			else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
				{
					newDay = shipDaysArr[2]-1;
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}
			}
			else if(shipDaysArr[1]-1 < day && day <= shipDaysArr[2]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[2]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[2]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[2]-1)
				{
					newDay = shipDaysArr[0]-1;
					diffDay = 7 - (shipDaysArr[2] - shipDaysArr[0]);										
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay));	
				}				
			}									
			else if(shipDaysArr[2]-1 < day)
			{
                newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day));	
			}
		}
		else if(count == 4)
		{
			if(day == shipDaysArr[0]-1)
			{
				if(parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
				{
                	newDay = shipDaysArr[1]-1;			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));				
				}				
			}
			else if(day < shipDaysArr[0]-1)
			{
                newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));	
			}
			else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
				{
					newDay = shipDaysArr[2]-1;
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}				
			}
			else if(shipDaysArr[1]-1 < day && day <= shipDaysArr[2]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[2]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[2]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[2]-1)
				{
					newDay = shipDaysArr[3]-1;					
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day));
				}				
			}
			else if(shipDaysArr[2]-1 < day && day <= shipDaysArr[3]-1)									
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[3]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[3]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[3]-1)
				{
					newDay = shipDaysArr[0]-1;
					diffDay = 7 - (shipDaysArr[3] - shipDaysArr[0]);										
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay));	
				}				
			}
			else if(shipDaysArr[3]-1 < day)
			{
                newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day));	
			}
		}								
	}
	else if(count == 1 && shipDaysArr[0] != 1)
	{
		//code here 
		switch(shipDaysArr[0]-1)
		{								    
			case 1:
				if(day == (shipDaysArr[0]-1))
				{                    
					if(parseFloat(hours) <= parseFloat(deadLineTimeNo))
					{
                		newDay = nlapiAddDays(currentDate,1-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,1-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
					{
                		newDay = nlapiAddDays(currentDate,8-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,8-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,8-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,8-day));
				}
				break;
			case 2:
				if(day <= (shipDaysArr[0]-1))
				{                    
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,2-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,2-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,9-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,9-day));
					}										
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,9-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,9-day));
				}
				break;
			case 3:
				if(day <= (shipDaysArr[0]-1))
				{
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,3-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,3-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,10-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,10-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,10-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,10-day));
				}
				break;
			case 4:
				if(day <= (shipDaysArr[0]-1))
				{
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,4-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,4-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,11-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,11-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,11-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,11-day));
				}
				break;
			case 5:
				if(day <= (shipDaysArr[0]-1))
				{				
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,5-day).getDay();								
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,5-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,12-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,12-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,12-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,12-day));
				}
				break;
			default:
				break;
		}                                								
	}
	return diamondETA;
}

function GetDiamondETA(day,businessDays,currentDate)
{
    var newDate = new Date();
    if(businessDays > 0 && businessDays <= 5)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1));
					break;
			case 2:													
					if(businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
			case 3:													
					if(businessDays == 4 || businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
			case 4:													
					if(businessDays == 3 || businessDays == 4 || businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
			case 5:													
					if(businessDays == 2 || businessDays == 3 || businessDays == 4 || businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
            case 6:													
					if(businessDays <= 5)
					{
						newDate = nlapiAddDays(currentDate,businessDays+1);
					}					
					break;
            case 0:													
					if(businessDays <= 5)
					{
						newDate = nlapiAddDays(currentDate,businessDays);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1));
				break;
		}
	}
	else if(businessDays > 5 && businessDays <= 10)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					break;
			case 2:													
					if(businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
			case 3:													
					if(businessDays == 9 || businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
			case 4:													
					if(businessDays == 8 || businessDays == 9 || businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
			case 5:													
					if(businessDays == 7 || businessDays == 8 || businessDays == 9 || businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
            case 6:													
					if(businessDays <= 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1)+2);
					}					
					break;
            case 0:													
					if(businessDays <= 10)
					{
						newDate = nlapiAddDays(currentDate,businessDays+2);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
				break;
		}
	}
	else if(businessDays > 10 && businessDays <= 15)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					break;
			case 2:													
					if(businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
			case 3:													
					if(businessDays == 14 || businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
			case 4:													
					if(businessDays == 13 || businessDays == 14 || businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
			case 5:													
					if(businessDays == 12 || businessDays == 13 || businessDays == 14 || businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
            case 6:													
					if(businessDays <= 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1)+4);
					}					
					break;
            case 0:													
					if(businessDays <= 15)
					{
						newDate = nlapiAddDays(currentDate,businessDays+4);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
				break;
		}
	}
	else if(businessDays > 15 && businessDays <= 20)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					break;
			case 2:													
					if(businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
			case 3:													
					if(businessDays == 19 || businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
			case 4:													
					if(businessDays == 18 || businessDays == 19 || businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
			case 5:													
					if(businessDays == 17 || businessDays == 18 || businessDays == 19 || businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
            case 6:													
					if(businessDays <= 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1)+6);
					}					
					break;
            case 0:													
					if(businessDays <= 20)
					{
						newDate = nlapiAddDays(currentDate,businessDays+6);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
				break;
		}
	}
	else if(businessDays > 20 && businessDays <= 25)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					break;
			case 2:													
					if(businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
			case 3:													
					if(businessDays == 24 || businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
			case 4:													
					if(businessDays == 23 || businessDays == 24 || businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
			case 5:													
					if(businessDays == 22 || businessDays == 23 || businessDays == 24 || businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
            case 6:													
					if(businessDays <= 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1) + 8);
					}					
					break;
            case 0:													
					if(businessDays <= 25)
					{
						newDate = nlapiAddDays(currentDate,businessDays + 8);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
				break;
		}
	}
	else if(businessDays > 25 && businessDays <= 30)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					break;
			case 2:													
					if(businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;
			case 3:													
					if(businessDays == 29 || businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;
			case 4:													
					if(businessDays == 28 || businessDays == 29 || businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;
			case 5:													
					if(businessDays == 27 || businessDays == 28 || businessDays == 29 || businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;	
                       case 6:													
					if(businessDays <= 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1) + 10);
					}					
					break;
                       case 0:													
					if(businessDays <= 30)
					{
						newDate = nlapiAddDays(currentDate,businessDays + 10);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
				break;
		}
	}
	else if(businessDays == 0 || businessDays == '')	
	{
	   newDate = nlapiAddDays(currentDate,0);
	}
	return newDate;
}
//--------Ended-------------

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}

function pushCDPtoPortal(cdpId,resultArr,portalRequestTypeId,item_status,action_needed,mapping_logic,cdpObj,onVendorPortal,requestType,paid,groupB,assetAcct,diamond,soStatus,old_diamond_status,new_diamond_status,old_PortalReqType,new_PortalReqType,old_ItemStatus,vendorId,vendorPortal,manual_override,paymentTerms,portal_url,new_ItemStatus,cs_status,old_CsStatus,new_CsStatus,delivery_location)
{
	try
	{
		//nlapiLogExecution('debug','Test Rahul'+cdpId , cdpId );	
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
										nlapiLogExecution('debug','XXXX' +cdpId , cdpId );
									 msg = resultArr[0].newMsg;

														 /*--------------------------------------------------Start Added By Yagya 30 Aug 2016--------------------------------*/

									if(mapping_logic=='T')
									{
										portalRequestTypeId=cdpObj.getFieldValue('custrecord165');
										map_PortalReqType = portalRequestTypeId;
									}
									else
									{
										portalRequestTypeId = map_PortalReqType;
									}
									/*--------------------------------------------------End Added By Yagya 30 Aug 2016--------------------------------*/
									nlapiLogExecution('debug','Test Rahul 1' +cdpId , cdpId );	

									if(onVendorPortal=='F' || onVendorPortal=='T')  
									{

										//Setting up URL of CDP             
										var url = "https://partner.brilliantearth.com/api/cdp/";     //for production
										//var url = "https://testportal.brilliantearth.com/api/cdp/";   // for Sandbox 

										//Setting up Headers 
										var headers = new Array(); 
										headers['http'] = '1.1';    
										headers['Accept'] = 'application/json';       
										headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
										//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';   // for Sandbox
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


																jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
															   else
															   {
																				  portalRequestTypeId = new_PortalReqType;							

																  jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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

																  jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
															   else
															   {
																									 portalRequestTypeId = map_PortalReqType;							
																  jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
													}
													else if((old_PortalReqType != null || old_PortalReqType == null) && new_PortalReqType == null)
													{
														item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");										
														nlapiLogExecution("debug","Unchanged item status is :",item_status);

														jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
													}
													else 
													{
														jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
													}
												}
												else if(old_diamond_status != null && new_diamond_status == null)
												{
													item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");

													nlapiLogExecution("debug","item status related to new diamond status null is :",item_status);

													jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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

													jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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

												 jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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

															 jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
														 }
														 else
														 {
															portalRequestTypeId = new_PortalReqType;								
															jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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

															 jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
														 }
														 else
														 {
															portalRequestTypeId = map_PortalReqType;				
															jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
														 }
													}							
													else if((old_PortalReqType != null || old_PortalReqType == null) && new_PortalReqType == null)
													{
														item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");										
														nlapiLogExecution("debug","Unchanged item status is :",item_status);

														jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
													}							
													else 
													{
														jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
													}
												}
												else if(old_diamond_status != null && new_diamond_status == null)
												{
													item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");

													nlapiLogExecution("debug","item status related to new diamond status null is :",item_status);

													jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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
																											 nlapiLogExecution("debug","New Item Status2 is :",item_status);  
																								 }
																								else
																								{
																											 item_status = old_ItemStatus;
																											 nlapiLogExecution("debug","Original Item Status2 is :",item_status);  
																								}										

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

													jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
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

																  jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
															   else
															   {
																   portalRequestTypeId = new_PortalReqType;												   
																 jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
												}
												else if(old_PortalReqType == 2 && map_PortalReqType == 3)
												{
													//nlapiLogExecution("debug","Ajay Sir",map_PortalReqType);
													if(old_ItemStatus == 2) //confirmed
																{
																  item_status = 1; 
																  portalRequestTypeId = map_PortalReqType;
																  nlapiLogExecution("debug","changes item status is :","Not confirmed");
																  nlapiLogExecution("debug","map portal request type is :","Sold");
																  nlapiLogExecution("debug","KKKKKKKKKK",portalRequestTypeId);
																 jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
															   else
															   {
																									 portalRequestTypeId = map_PortalReqType;							

																jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
															   }
												}
												else if((old_PortalReqType != null || old_PortalReqType == null) && new_PortalReqType == null && old_PortalReqType != 2)
												{
													item_status = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_item_status");										
													nlapiLogExecution("debug","Unchanged item status is :",item_status);

													jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
												}
												else 
												{
																						nlapiLogExecution("debug","track portal req type is :", portalRequestTypeId);									

													jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);								
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
																	 nlapiLogExecution("debug","new diamond status against3 is :",new_diamond_status);
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

												jsonobj = SendJsonData(cdpId,vendorId,portalRequestTypeId,actNeedStr,item_status,vendorPortal,manual_override,paymentTerms,requestType,portal_url,delivery_location);
											}
										}//end line 6 mapping condition

										//Stringifying JSON
															   if(jsonobj != null)
										   {
										var myJSONText = JSON.stringify(jsonobj, replacer); 
																nlapiLogExecution('debug','CDP Input Body:', myJSONText);
										var response = nlapiRequestURL(url, myJSONText, headers); 
											nlapiLogExecution("debug","Response body output is :",response.getBody());
																nlapiLogExecution("debug","Response output is :",response.body);
										//Below is being used to put a breakpoint in the debugger

										if(response.code=='200')
										{	
											//nlapiLogExecution('debug','Test Rahul 2'+cdpId , cdpId );	
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
													cdpObj.setFieldValue('custrecord_diamond_status',7); //On Hold – Pending Customer Decision
												}								
											}
											else if(requestType == 7 && old_PortalReqType == 2 && paid < 20) //case #2
											{
												//if((old_ItemStatus == 2 && new_ItemStatus == null) || (old_ItemStatus != 2 && new_ItemStatus == 2)) //From NS/Portal
																				if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed 
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
												if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed
												{
													cdpObj.setFieldValue('custrecord_diamond_status',9); //On Hold – Customer Payment Pending
												}								
											}
											else if(requestType == 6 && old_PortalReqType == 2) //case #6
											{
												if(old_ItemStatus != 2 && new_ItemStatus == 2) //From NS/Portal changed
												{
													cdpObj.setFieldValue('custrecord_diamond_status',7);//On Hold – Pending Customer Decision
													cdpObj.setFieldValue('custrecord_custom_diamond_cs_status',2);//Option Sent to CS
												}								
											}							
											//Ended new mapping by ajay

											var cdpId = nlapiSubmitRecord(cdpObj,true,true);

											nlapiLogExecution('debug','NS CDP record has been pushed successfully on Portal for CDP Id:'+cdpId , cdpId );
											nlapiLogExecution("debug", "NS CDP fields has been updated successfully for CDP Id:"+cdpId ,cdpId );
											//nlapiLogExecution('debug','Test Rahul 3'+cdpId , cdpId );	

											if(cdpId!='' && cdpId!=null)
											{
												var result = PushNSCdpItemDataToPortal(cdpId); // call to push SO Items after pushed cdpid
												if(result.code == '200')
												{    
													nlapiLogExecution('debug','Successfully Pushed CDP Items to Portal for CdpId:'+cdpId , cdpId );	
													//nlapiLogExecution('debug','Test Rahul 4'+cdpId , cdpId );	
												}                                                                
												else
												{                                             		                        
													   nlapiLogExecution('debug','CDP Item sync error for CdpId:'+cdpId, result.body ); 
												}// end check of result code
											}// end check of cdpId
										}//response code end
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
	catch(e)
	{
		nlapiLogExecution("debug","Error occuring while push to Portal",e.message);
	}
	return true;
}