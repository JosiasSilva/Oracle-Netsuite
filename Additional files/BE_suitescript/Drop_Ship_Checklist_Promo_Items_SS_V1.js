function Drop_Ship_Checklist_Promo_Items()
{
	var orders = [];
	
	//Find sales orders that have updated; update sales order fields
	var results = nlapiSearchRecord("transaction","customsearch_ds_promo_items_so"); //5314
	if(results)
	{
		nlapiLogExecution("debug","# Results: " + results.length);
		
		for(var x=0; x < results.length; x++)
		{
			var cols = results[x].getAllColumns();
			var promoItemCol;
			for(var i=0; i < cols.length; i++)
			{
				if(cols[i].getLabel()=="Items")
				{
					promoItemCol = cols[i];
					nlapiLogExecution("debug","Promotion Item Column Found");
					break;
				}
			}

			nlapiLogExecution("debug","Updating order internal ID - " + results[x].getValue("internalid",null,"group"),"Promo Items: " + results[x].getValue(promoItemCol));
			orders.push(results[x].getValue("internalid",null,"group"));
			nlapiSubmitField("salesorder",results[x].getValue("internalid",null,"group"),"custbody_drop_ship_promo_item",results[x].getValue(promoItemCol));
		}
	}
	
	if(orders.length > 0)
	{
		//Update linked drop ship purchase orders
		var filters = [];
		filters.push(new nlobjSearchFilter("createdfrom",null,"anyof",orders));
		var results = nlapiSearchRecord("transaction","customsearch_ds_promo_item_po",filters);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"min"),"custbody_drop_ship_promo_item",results[x].getValue("custbody_drop_ship_promo_item","createdfrom","max"));
                //Added by ajay 25Nov 2016
				var poId =  results[x].getValue("internalid",null,"min");
				var on_vendor_portal = nlapiLookupField("purchaseorder",poId,"custbody_on_vendor_portal");
				var poOnPortal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
				var revisedPoOnPortal = nlapiLookupField("purchaseorder",poId,"custbody_pushrevisedpo");
				var revisedCount = nlapiLookupField("purchaseorder",poId,"custbody_revise_count"); //Added by ajay 09Dec 2016

				if(on_vendor_portal == 'T')
				{
					if(poOnPortal == 'T' && revisedPoOnPortal == 'F')
					{
						PushPODataNSToPortal(poId);
					}
					else if(revisedPoOnPortal == 'T')
					{
						PushRevisedPODataNSToPortal(poId);
					}
				}
				//Ended by ajay 25Nov 2016
			}
		}
	}
}


/*---------Portal Logic added by ajay 25Nov 2016----*/
function PushPODataNSToPortal(poId)
{    
	try
	{ 		
        nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);
		if((poId!='' && poId!=null))
		{			
			var POObj = nlapiLoadRecord("purchaseorder",poId);
			var AddFees = POObj.getFieldValue('custbody_addional_fee_check');

			var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
			nlapiLogExecution("debug","portal status is :"+PoStatus);
			var PortalStatus;
			if(PoStatus == null || String(PoStatus).length == 0)
			{
				PortalStatus = '[]';
				nlapiLogExecution("debug","Portal status value is :",PortalStatus);
			}
			else
				PortalStatus = '[' +  PoStatus + ']';

			var transid=POObj.getFieldValue('tranid') ;
			var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
			if(custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
			{
				custbody_ship_date1 = nlapiDateToString(new Date());
			}
			var custbody146=POObj.getFieldValue('custbody146');// Diamond ETA   
			if(custbody146=='' || custbody146==null)
			{				   
				custbody146=null;
			}
			var custbody39= POObj.getFieldValue('custbody39')  ;   // DROP SHIP MATERIALS SENT TO VENDOR
			if(custbody39=='' || custbody39==null)
			{
				custbody39='F';
			}
			else
			{
				custbody39='T';
			}
			var custbody116=POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
			if(custbody116=='' || custbody116==null)
			{
				custbody116=null;
			}
			var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
			if(custbody209=='' || custbody209==null)
			{
				custbody209=null;
			}
			var custbody6=POObj.getFieldValue('custbody6'); // DELIVERY DATE
			if(custbody6 == '' || custbody6 == null)
			{
				custbody6 = nlapiDateToString(new Date());
			}
			var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
			var custbody58=POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
			if(custbody58=='' || custbody58==null)
			{
				custbody58="";
			}
			var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
			var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
			var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS
			var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
			if(certificate_status=='' || certificate_status==null)
			{
				certificate_status=null;
			}
			
			//Added new code by ajay 13Sept 2016
			var cad_file_name = POObj.getFieldValue('custbodycustbody_internal_cad_file_nam');
			if(cad_file_name == null || cad_file_name == '')
			{
				cad_file_name = null;
			}
			//Added new code by ajay 07Sept 2016
			var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
			if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
			{				   
				approved_to_grow_confirmation = null;
			}
			//Ended by ajay
            //Added by ajay 21Nov 2016
			var  promo_item = nlapiLookupField("purchaseorder",poId,"custbody_drop_ship_promo_item");
			//Ended by ajay 21Nov 2016
			
			var VendorId = POObj.getFieldValue('entity');
			var itemCount  = POObj.getLineItemCount("item");
			var IteArray = new Array();
			var CategoryId ;
			for ( var i = 1 ; i<= itemCount  ; i++)
			{
				var itemType = POObj.getLineItemValue("item","itemtype",i);
				var isLooseDiamond='F';
				if(itemType == "InvtPart")
				{
					var invItemId = POObj.getLineItemValue("item","item",i);
					CategoryId =  nlapiLookupField("inventoryitem",invItemId,"custitem20");
					if(CategoryId=='7')
					{
						isLooseDiamond='T';
					}					
				} 
				var item = POObj.getLineItemValue("item","item",i);
				var item_name = POObj.getLineItemValue("item","item_display",i);
				var vendorCode = POObj.getLineItemValue("item","vendorname",i);
              	var CodeVendor ='';
				
				if(vendorCode !='' && vendorCode != null)
				{
					 CodeVendor= vendorCode;
				}
				var itemlink = POObj.getLineItemValue("item","custcolitem_link_display",i);
				if(itemlink=='' || itemlink==null)
				{
					itemlink=""; // not accepting null
				}
				var itemDesc=POObj.getLineItemValue("item","description",i);
				if(itemDesc=='' || itemDesc==null)
				{
					itemDesc=""; // not accepting null
				}
				var itemNotes=POObj.getLineItemValue("item","custcol5",i);

				if(itemNotes=='' || itemNotes==null)
				{
					itemNotes="";
				}
				var certificate_included = POObj.getLineItemValue("item","custcol28",i);
				if(certificate_included =='' || certificate_included ==null)
				{
					certificate_included = null;
				}
				var itemInsVal=POObj.getLineItemValue("item","custcol_full_insurance_value",i);
				if(itemInsVal=='' || itemInsVal==null)
				{
					itemInsVal=0;
				}
				var dt_sentFrom_sf=POObj.getLineItemValue("item","custcol18",i);
				if(dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
				{
					dt_sentFrom_sf = null;
				}
				var ObjItem = {
							"item_id" :parseInt(item), 
							//"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
							"item": (vendorCode=='' && vendorCode==null) ? item_name : item_name,
							"vendor_sku" : (vendorCode !='' && vendorCode != null) ? CodeVendor : CodeVendor,							
							"description" : itemDesc,
							"description" : itemDesc,
							"notes" : itemNotes,
							"insurance_value" : itemInsVal,
							"itemlink" : itemlink ,
							"date_sent_from_sf" : dt_sentFrom_sf, 
							"loose_diamond" : isLooseDiamond,
							"certificate_included" : certificate_included
							};
				
				if(parseInt(item) != 4204513)
				{
					IteArray.push(ObjItem);
				}								
			}
			PortalStatus = GetPOStatusValue(IteArray,PoStatus,PortalStatus); 
			var objJSON = {
						"po_id" : poId,
						"portal_status":PortalStatus, 
						"transaction_id" :transid,
						"items" :IteArray,
						"ship_date": custbody_ship_date1, 
						"diamond_eta" : custbody146,
						"drop_ship" : custbody39,
						"cad_due_date" : custbody116, 
						"date_shipped_from_vendor" : custbody209, 
						"delivery_date" : custbody6, 
						"to_be_watched" : custbody129, 
						"so_notes" : custbody58,
						"pro_vendor" :  parseInt(VendorId),
						"wait_cad" : custbody41,
						"certificate_status" : certificate_status,
						"on_vendor_portal" : true,
						"approved_to_grow_confirmation" : approved_to_grow_confirmation,
						"internal_cad_file_name" : cad_file_name,
                        "promo_item" : promo_item //added by ajay 21Nov 2016
					}; 

			//Setting up URL of CDP	
			//var url = "https://testportal.brilliantearth.com/api/production/po/";      //for sandbox
            var url = "https://partner.brilliantearth.com/api/production/po/";       //for production

			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       								
			//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
            headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //for production
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';
													
			//Stringifying JSON
			var myJSONText = JSON.stringify(objJSON, replacer); 
			nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
			var response = nlapiRequestURL(url, myJSONText, headers); 
			nlapiLogExecution('debug','PO Response Body as Portal Output:', response.body);
			//Below is being used to put a breakpoint in the debugger	
								
			if(response.code==200)
			{
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];
				//var poUrl = "https://testportal.brilliantearth.com"+responsebody["po_url"]; //for sandbox
                var poUrl = "https://partner.brilliantearth.com"+responsebody["po_url"]; //for production
				nlapiLogExecution("debug", "PO successfully pushed to Portal.");			
				try
				{
					nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal','custbody_on_vendor_portal','custbody_po_portal_url'],[portalStatus,'T','T',poUrl]);					
				}
				catch(err){}				
			}
			else
			{			
				nlapiLogExecution("debug","Portal response is : ",response.body);		
			}// end check of response.code                       
		}
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal is : ",err.message); 		
	}
}

function PushRevisedPODataNSToPortal(poId)
{
	try
	{
        nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);	
		if((poId!='' && poId!=null))
		{ 
			var POObj = nlapiLoadRecord("purchaseorder",poId);
            var revisedCount =  1;
            //Added by Ajay 25Oct 2016
            if(POObj.getFieldValue("custbody_revise_count") != "" && POObj.getFieldValue("custbody_revise_count") != null )
            {
			     revisedCount =  parseInt(POObj.getFieldValue("custbody_revise_count"));
            }
			nlapiLogExecution('debug','Initial Revised Count value is :',revisedCount);
			//Ended by Ajay

			var AddFees = POObj.getFieldValue('custbody_addional_fee_check');
			var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
			var PortalStatus='';
			if(PoStatus == null || String(PoStatus).length == 0)
			{					
				PortalStatus = '[]';
			}
			else
				PortalStatus = '[' +  PoStatus + ']';
			
			var transid=POObj.getFieldValue('tranid') ;
			var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
			if(custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
			{				   
				custbody_ship_date1 = nlapiDateToString(new Date());
			}
			var custbody146=POObj.getFieldValue('custbody146');// Diamond ETA   
			if(custbody146=='' || custbody146==null)
			{				   
				custbody146=null;
			}
			var custbody39= POObj.getFieldValue('custbody39')  ;   // DROP SHIP MATERIALS SENT TO VENDOR
			if(custbody39=='' || custbody39==null)
			{
				custbody39='F';
			}
			else
			{
				custbody39='T';
			}
			var custbody116=POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
			if(custbody116=='' || custbody116==null)
			{				   
				custbody116=null;
			}
			var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
			if(custbody209=='' || custbody209==null)
			{				   
				custbody209=null;
			}
			var custbody6=POObj.getFieldValue('custbody6'); // DELIVERY DATE
			if(custbody6 == '' || custbody6 == null)
			{
				custbody6 = nlapiDateToString(new Date());
			}
			var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
			var custbody58=POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
			if(custbody58=='' || custbody58==null)
			{
				custbody58="";
			}
			var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
			var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
			var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS			   
			var custbody_ns_link = nlapiLookupField("purchaseorder",poId,"custbody_ns_link",true);
			
			if(custbody_ns_link=='' || custbody_ns_link==null)
			{
				custbody_ns_link="";
			}
			var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
			if(certificate_status=='' || certificate_status==null)
			{
				certificate_status=null;
			}
			//Added new code by ajay 13Sept 2016
			var cad_file_name = POObj.getFieldValue('custbodycustbody_internal_cad_file_nam');
			if(cad_file_name == null || cad_file_name == '')
			{
				cad_file_name = null;
			}
			//Added new code by ajay 07Sept 2016
			var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
			if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
			{
				approved_to_grow_confirmation = null;
			}
			//Ended by ajay
			
            //Added by ajay 21Nov 2016
			var  promo_item = nlapiLookupField("purchaseorder",poId,"custbody_drop_ship_promo_item");
			//Ended by ajay 21Nov 2016
			
			var VendorId = POObj.getFieldValue('entity');
			var itemCount  = POObj.getLineItemCount("item");
			var IteArray = new Array();
			var CategoryId ;
			for ( var i = 1 ; i<= itemCount  ; i++)
			{
				var itemType = POObj.getLineItemValue("item","itemtype",i);
				var isLooseDiamond='F';
				if(itemType == "InvtPart")
				{
					var invItemId = POObj.getLineItemValue("item","item",i);
					CategoryId =  nlapiLookupField("inventoryitem",invItemId,"custitem20");
					if(CategoryId=='7')
					{
						isLooseDiamond='T';
					}					
				} 
				var item = POObj.getLineItemValue("item","item",i);
				var item_name = POObj.getLineItemValue("item","item_display",i);
				var vendorCode = POObj.getLineItemValue("item","vendorname",i);
              	var CodeVendor ='';
				// Added by Rahul Panchal as per PP-184 on dated 16 Nov 2016
				if(vendorCode !='' && vendorCode != null)
				{
					 CodeVendor= vendorCode;
				}
				var itemlink = POObj.getLineItemValue("item","custcolitem_link_display",i);
				if(itemlink=='' || itemlink==null)
				{
					itemlink=""; // not accepting null
				}
				var itemDesc=POObj.getLineItemValue("item","description",i);
				if(itemDesc=='' || itemDesc==null)
				{
					itemDesc=""; // not accepting null
				}
				var itemNotes=POObj.getLineItemValue("item","custcol5",i);
				nlapiLogExecution("debug","item notes is : ",itemNotes);
				if(itemNotes=='' || itemNotes==null)
				{
					itemNotes="";
				}
				var certificate_included = POObj.getLineItemValue("item","custcol28",i);
				if(certificate_included =='' || certificate_included ==null)
				{
					certificate_included = null;
				}
				var itemInsVal=POObj.getLineItemValue("item","custcol_full_insurance_value",i);
				if(itemInsVal=='' || itemInsVal==null)
				{
					itemInsVal=0;
				}
				var dt_sentFrom_sf=POObj.getLineItemValue("item","custcol18",i);
				if(dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
				{					
					dt_sentFrom_sf = null;
				}
				var ObjItem = {
							"item_id" :parseInt(item), 
							//"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
							"item": (vendorCode=='' && vendorCode==null) ? item_name : item_name,
							"vendor_sku" : (vendorCode !='' && vendorCode != null) ? CodeVendor : CodeVendor,
							"description" : itemDesc,
							"notes" : itemNotes,
							"insurance_value" : itemInsVal,
							"itemlink" : itemlink ,
							"date_sent_from_sf" : dt_sentFrom_sf, 
							"loose_diamond" : isLooseDiamond,
							"certificate_included" : certificate_included
							};
				
				if(parseInt(item) != 4204513)
				{
					IteArray.push(ObjItem);
				}				
			}
			PortalStatus = GetPOStatusValue(IteArray,PoStatus,PortalStatus); // new added by ajay 04Aug 2016
			var objJSON =  {
						"po_id" : poId,
						"portal_status":PortalStatus, 
						"transaction_id" :transid,
						"items" :IteArray,
						"ship_date": custbody_ship_date1, 
						"diamond_eta" : custbody146,
						"drop_ship" : custbody39,
						"cad_due_date" : custbody116, 
						"date_shipped_from_vendor" : custbody209, 
						"delivery_date" : custbody6, 
						"to_be_watched" : custbody129, 
						"so_notes" : custbody58,
						'ns_link' : custbody_ns_link, 
						"pro_vendor" :  parseInt(VendorId),
						"wait_cad" : custbody41,
						"certificate_status" : certificate_status,
						"approved_to_grow_confirmation" : approved_to_grow_confirmation,
						"internal_cad_file_name" : cad_file_name,
                        "revise_count" : revisedCount,
                        "promo_item" : promo_item //Added by ajay 21Nov 2016
						}; 
				
			//Setting up URL of CDP  
			//var url = "https://testportal.brilliantearth.com/api/production/revised-po/"; //for sandbox
            var url = "https://partner.brilliantearth.com/api/production/revised-po/"; //for production
			   
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';
			//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
            headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //for production
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';
			 
			//Stringifying JSON
			var myJSONText = JSON.stringify(objJSON, replacer); 
			nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
			var response = nlapiRequestURL(url, myJSONText, headers); 
			nlapiLogExecution('debug','PO Response Body as Portal Output:', response.body);
			//Below is being used to put a breakpoint in the debugger					  
			if(response.code==200)
			{
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];
                //var poUrl = "https://testportal.brilliantearth.com"+responsebody["po_url"]; //for sandbox
                var poUrl = "https://partner.brilliantearth.com"+responsebody["po_url"]; //for production
				nlapiLogExecution("debug","Revised PO successfully pushed to Portal.");
				try
				{
					nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushrevisedpo','custbody_po_portal_url'],[portalStatus,'T',poUrl]);					
				}
				catch(err){}             
			}
			else
			{				
				nlapiLogExecution("debug",response.body);
			}// end check of response.code			
		}
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during PO ID Push from NS to portal is : ",err.message);         
	}
}

//Added new logic for checking itemlink column field
function GetPOStatusValue(IteArray,PoStatus,PortalStatus)
{
	var itemLnkMatch = 0;   
	if(IteArray.length > 0)
	{
		for(var i=0; i<IteArray.length; i++)
		{
			if(IteArray[i].itemlink != "" && IteArray[i].itemlink != null)
			{
				itemLnkMatch = 1;
				break;
			}
		}
	}
	if(itemLnkMatch == 0)
	{
		if(PoStatus == null || String(PoStatus).length == 0)
		{
			PortalStatus = '[]'; 
		}
		else
		{
			var PoStatusArr = PoStatus.split(',');
			for(var i=0; i< PoStatusArr.length; i++)
			{
				var index = PoStatusArr[i].indexOf(12); // Receive Gem
				if(index == 0)
				{
				   PoStatusArr.splice(i, 1);
				   for(var j=0; j< PoStatusArr.length; j++)
				   {
					   if(j==0)
					   {
							PoStatus = PoStatusArr[j] ;
					   }
					   else
					   {
							PoStatus = PoStatus + ',' +''+PoStatusArr[j]+'';
					   }
				   }
				   break;
				}
			}
			PortalStatus = '[' +  PoStatus + ']';
		}
	}
	return PortalStatus;
}

function replacer(key, value)
{
	if (typeof value == "number" && !isFinite(value))
	{
		return String(value);
	}
	return value;
}
