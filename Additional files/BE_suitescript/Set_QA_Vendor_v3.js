function Set_QA_Vendor(type)
{
	if (type == "create" || type == "edit") {
		try {
			//Get QA Record Internal ID
			var internalid = nlapiGetRecordId()
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred getting QA record internal ID. Details: " + err.message)
			return
		}
		
		try {
			//Get QA Fields
			var filter = new nlobjSearchFilter("internalid", null, "is", internalid)
			var cols = new Array()
			cols.push(new nlobjSearchColumn("custrecord3")) //Sales Order
			cols.push(new nlobjSearchColumn("custrecord_item"))
			cols.push(new nlobjSearchColumn("custrecord_qa_vendor"))
			var results = nlapiSearchRecord("customrecord32", null, filter, cols)
			if (results != null) {
				var sales_order_id = results[0].getValue("custrecord3")
				var item_id = results[0].getValue("custrecord_item")
				var qa_vendor = results[0].getValue("custrecord_qa_vendor")
				
				//Exit if sales order or item fields are empty
				//Exit if QA vendor field is already present
				if (IsEmpty(sales_order_id) == "" || IsEmpty(item_id) == "" || IsEmpty(qa_vendor) != "") 
					return
			}
			else {
				//If QA record is not found then exit the script
				return
			}
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while retrieving QA field values for QA record internal ID " + internalid + ". Details: " + err.message)
			return
		}
		
		try {
			//Find item vendor on sales order line item
			var filters = new Array()
			filters.push(new nlobjSearchFilter("internalid", null, "is", sales_order_id))
			filters.push(new nlobjSearchFilter("item", null, "is", item_id))
			filters.push(new nlobjSearchFilter("mainname", "purchaseorder", "noneof", "@NONE@"))
			var column = new Array()
			column[0] = new nlobjSearchColumn("mainname", "purchaseorder")
			column[1] = new nlobjSearchColumn("internalid", "purchaseorder")
			var results = nlapiSearchRecord("transaction", null, filters, column)
			if (results != null) {
				var vendor_id = results[0].getValue("mainname", "purchaseorder")
				var po_id = results[0].getValue("internalid", "purchaseorder")
			}
			else {
				//If nothing is found then exit the script as there is no PO vendor to set
				return
			}
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while retrieving QA record item vendor on sales order internal ID " + sales_order_id + ". Details: " + err.message)
			return
		}
		
		try {
			//Update the QA record with vendor information
			var qaRecord = nlapiLoadRecord("customrecord32", internalid)
			qaRecord.setFieldValue("custrecord_qa_vendor", vendor_id)
			
			//Added 6-28-2011 Set QA PO Number Field
			qaRecord.setFieldValue("custrecord_qa_po_number",po_id)
			
			var qaId = nlapiSubmitRecord(qaRecord, false, true);
			nlapiLogExecution("debug","Created QA record Id is : ",qaId);

            //New code for portal logic added by ajay 05Oct 2016
			if(qaId > 0)
			{							
				var sendingBack = nlapiGetNewRecord().getFieldValue("custrecord_sending_back");
				nlapiLogExecution("debug","Sending Back value is :",sendingBack);
						
				//Function for calling to push PO record
				if(sendingBack == 'T' && po_id != null && po_id != '')
				{
					UpdatePO_OnPortal(po_id);
				}			
			}	
			//Ended code by ajay			
		} 
		catch (err) {
			nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while setting item vendor on QA record internal ID " + internalid + ". Details: " + err.message)
			return
		}
	}
}

function IsEmpty(value)
{
	if(value==null)
		return ""
	else
		return value
}


//-------------------------Push PO To Portal -----------------------------------

//Function that update PO on Portal
function UpdatePO_OnPortal(po_id_value) 
{
    try 
    {
        nlapiLogExecution("error", "po_id_value",po_id_value);
		if (po_id_value > 0) 
		{
			var poOnPortal = nlapiLookupField("purchaseorder", po_id_value, "custbody_pushtoportal");
			var revisedPoOnPortal = nlapiLookupField("purchaseorder", po_id_value, "custbody_pushrevisedpo");
			if (poOnPortal == 'T' && revisedPoOnPortal == 'F') 
			{
				PushPODataNSToPortal(po_id_value); 
			}
			else if (revisedPoOnPortal == 'T')
			{
				PushRevisedPODataNSToPortal(po_id_value);
			}
		}
    }
    catch (err)
	{
        nlapiLogExecution("debug", "Error raised during PO updation on portal is :" + err.message);
    }
}

function PushPODataNSToPortal(poId)
{    
	try
	{		
		if(poId!='' && poId!=null)
		{
                        nlapiSubmitField("purchaseorder",poId,"custbody209","");
		        nlapiLogExecution('debug','PO Initiated to push on portal for POId :'+poId , poId);	   
			var POObj = nlapiLoadRecord("purchaseorder",poId);
			var AddFees = POObj.getFieldValue('custbody_addional_fee_check'); // added by ajay 27Sept2016
			var PoStatus = 1; // none
			nlapiLogExecution("debug","portal status is :"+PoStatus);
			var PortalStatus = '[' +  PoStatus + ']';					
		
		    var transid= POObj.getFieldValue('tranid') ;
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
		    var custbody39= POObj.getFieldValue('custbody39'); // DROP SHIP MATERIALS SENT TO VENDOR
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
					   
		    var custbody41 =  POObj.getFieldValue('custbody41'); //DESIGN APPROVAL STATUS
		    var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
		    var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS
		    
		    var certificate_status = POObj.getFieldValue('custbodycertificate_status'); //CERTIFICATE STATUS
		    if(certificate_status=='' || certificate_status==null)
		    {
			   certificate_status=null;
		    }
			
			//Added new code by ajay 27Sept 2016
			var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
		    if(cad_file_name == null || cad_file_name == '')
		    {
				cad_file_name = null;
		    }
            //Added new code by ajay 27Sept 2016
			var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
			if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
			{				   
				approved_to_grow_confirmation = null;
			}
			//Ended by ajay
			
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
				//IteArray.push(ObjItem);
				//Added by ajay 03Oct 2016				
				if(parseInt(item) != 4204513)
				{
					IteArray.push(ObjItem);
				}				
				//Ended
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
							"approved_to_grow_confirmation" : approved_to_grow_confirmation,
							"internal_cad_file_name" : cad_file_name,
                                                        "is_qa" : true
							}; 
		}
		//Setting up URL of PO             
		var url = "https://partner.brilliantearth.com/api/production/po/";    
		//var url = "https://testportal.brilliantearth.com/api/production/po/";    //for sandbox
		   
		//Setting up Headers 
		var headers = new Array(); 
		headers['http'] = '1.1';    
		headers['Accept'] = 'application/json';       
		headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //for production
		//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
		headers['Content-Type'] = 'application/json'; 
		headers['User-Agent-x'] = 'SuiteScript-Call';
		 
		//Stringifying JSON
		var myJSONText = JSON.stringify(objJSON, replacer); 
		nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
		var response = nlapiRequestURL(url, myJSONText, headers); 
		nlapiLogExecution('debug','PO Response Body as Portal Output:', response.body);
		//Below is being used to put a breakpoint in the debugger	
							
		if(response.code == 200)
		{                                    
            nlapiLogExecution("debug", "PO successfully pushed to Portal.");			
            try
            {                           
                var responsebody = JSON.parse(response.getBody());
                var portalStatus = responsebody["portal_status"];
                nlapiSubmitField('purchaseorder',poId,['custbody_pushtoportal','custbody_portal_status'],['T',portalStatus]);        
	        }
            catch(err)
			{ }						
		}
		else
		{                   
            nlapiLogExecution("debug","Portal response is : ",response.body);		
		}// end check of response.code
	}
	catch(err)
	{             
	    nlapiLogExecution("debug","Error occur during POID Push from NS to portal is : ",err.message);             
	}
}


function PushRevisedPODataNSToPortal(poId)
{
	try
	{          
			if((poId!='' && poId!=null))
			{
                                nlapiSubmitField("purchaseorder",poId,"custbody209","");
		                nlapiLogExecution('debug','PO Initiated to push on portal for POId :'+poId , poId);
				var POObj = nlapiLoadRecord("purchaseorder",poId);
				var AddFees = POObj.getFieldValue('custbody_addional_fee_check'); // added by ajay 27Sept2016
				var PoStatus = 1; // none
			        nlapiLogExecution("debug","portal status is :"+PoStatus);
			        var PortalStatus = '[' +  PoStatus + ']';
			
			   var transid= POObj.getFieldValue('tranid') ;
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
			   
			   	//Added new code by ajay 27Sept 2016
				var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
				if(cad_file_name == null || cad_file_name == '')
				{
					cad_file_name = null;
				}
				//Added new code by ajay 27Sept 2016
				var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
				if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
				{				   
					approved_to_grow_confirmation = null;
				}
				//Ended by ajay
			   
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
						"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
						"description" : itemDesc,
						"notes" : itemNotes,
						"insurance_value" : itemInsVal,
						"itemlink" : itemlink ,
						"date_sent_from_sf" : dt_sentFrom_sf, 
						"loose_diamond" : isLooseDiamond,
						"certificate_included" : certificate_included
						};
					//IteArray.push(ObjItem);
					//Added by ajay 03Oct 2016					
					if(parseInt(item) != 4204513)
					{
						IteArray.push(ObjItem);
					}					
					//Ended
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
					"approved_to_grow_confirmation" : approved_to_grow_confirmation,
					"internal_cad_file_name" : cad_file_name,
                                        "is_qa" : true
                }; 
            }
			//Setting up URL of CDP             
			//var url = "https://partner.brilliantearth.com/api/production/revised-po/";    
			var url = "https://testportal.brilliantearth.com/api/production/revised-po/";         //for sandbox
			   
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       
			//headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
			headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';
			 
			//Stringifying JSON
			var myJSONText = JSON.stringify(objJSON, replacer); 
			nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
			var response = nlapiRequestURL(url, myJSONText, headers);
			nlapiLogExecution('debug','Revised PO Response Body as Portal Output:', response.body);
			//Below is being used to put a breakpoint in the debugger					  
			if(response.code==200)
			{							
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];                                
				nlapiLogExecution("debug","Revised PO successfully pushed to Portal.");
				try{										
					nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushrevisedpo'],[portalStatus,'T']);
				}
				catch(err){
				}
			}
			else
			{			  
				nlapiLogExecution("debug",response.body);		
			}// end check of response.code
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during revised POID Push from NS to portal is : ",err.message);             
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
