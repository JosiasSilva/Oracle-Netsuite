function PushPODataNSToPortal()
{    
	try
	{            
              var poId =nlapiGetRecordId();
              nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);			
           
			if((poId!='' && poId!=null))
			{
                                nlapiSubmitField("purchaseorder",poId,"custbody_ns_link",poId);
				var POObj = nlapiLoadRecord("purchaseorder",poId);
				
                                var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
                                nlapiLogExecution("debug","portal status is :"+PoStatus);
				var PortalStatus;
				if(PoStatus == null || String(PoStatus).length == 0){					
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
							"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
                            "description" : itemDesc,
                            "notes" : itemNotes,
                            "insurance_value" : itemInsVal,
                            "itemlink" : itemlink ,
                            "date_sent_from_sf" : dt_sentFrom_sf, 
     			    "loose_diamond" : isLooseDiamond,
                            "certificate_included" : certificate_included
                            };
                IteArray.push(ObjItem);
              }
              var objJSON = 
                  {
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
                                        "on_vendor_portal" : true
                  }; 
             }
					//Setting up URL of CDP             
					var url = "https://partner.brilliantearth.com/api/production/po/";    
					   
					//Setting up Headers 
					var headers = new Array(); 
					headers['http'] = '1.1';    
					headers['Accept'] = 'application/json';       					
					headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';					  
					headers['Content-Type'] = 'application/json'; 
					headers['User-Agent-x'] = 'SuiteScript-Call';
															
					//Stringifying JSON
					var myJSONText = JSON.stringify(objJSON, replacer); 
					nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
					var response1 = nlapiRequestURL(url, myJSONText, headers); 
					nlapiLogExecution('debug','PO Response Body as Portal Output:', response1.body);
					//Below is being used to put a breakpoint in the debugger	
                                        
					if(response1.code==200)
					{                                                                                            
                                              var responsebody = JSON.parse(response1.getBody());
                                              var portalStatus = responsebody["portal_status"];
                                              nlapiLogExecution("debug", "PO successfully pushed to Portal.");			
                                              try{	
						    
                                                    nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal','custbody_on_vendor_portal'],[portalStatus,'T','T']);
                                                    //response.sendRedirect("RECORD","purchaseorder",poId);
						}
                                                catch(err){
                                                }						
					}
					else
					{				   
                                           //response.write(response1.body);
                                           nlapiLogExecution("debug","Portal response is : ",response1.body);		
					}// end check of response.code
	}
	catch(err)
	{             
	     nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal is : ",err.message); 
             //response.sendRedirect("RECORD","purchaseorder",poId);          
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

