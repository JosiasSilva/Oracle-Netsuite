function PushPORevisedDataNSToPortal(request,response)
{    
	try
	{
             var poId = request.getParameter("record");            
             nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);			
           
			if((poId!='' && poId!=null))
			{                               
				var POObj = nlapiLoadRecord("purchaseorder",poId);
				
				//Added by Ajay 28Oct 2016
				var revisedCount =  POObj.getFieldValue("custbody_revise_count");
				nlapiLogExecution('debug','Initial Revised Count value is :',revisedCount);
				if(revisedCount == null || revisedCount == "")
				{
					revisedCount = 1;				
					nlapiSubmitField("purchaseorder",poId,["custbody_ns_link","custbody_revise_count"],[poId,revisedCount]);
				}
				else 
				{			
					revisedCount = parseInt(revisedCount) + 1;
					nlapiLogExecution('debug','New Revised Count value is :',revisedCount);
					nlapiSubmitField("purchaseorder",poId,["custbody_ns_link","custbody_revise_count"],[poId,revisedCount]);
				}		
				//Ended by Ajay
				
				var AddFees = POObj.getFieldValue('custbody_addional_fee_check');				
                                 var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
				 var PortalStatus='';
				if(PoStatus == null || String(PoStatus).length == 0){					
                                           PortalStatus = '[]';
				}					
				else
					PortalStatus = '[' +  PoStatus + ']';
				
				//Added by ajay 30Dec 2016
				var cad_approval_date = POObj.getFieldValue("custbody_cad_approval_date");
				nlapiLogExecution("debug","initial cad approval date is :",cad_approval_date);
				nlapiLogExecution('debug','Initial portal status value is :',PoStatus);
				if(PoStatus != null && PoStatus != "")
				{
					if(PoStatus.indexOf('11') != -1)
					{
						if(cad_approval_date == null || cad_approval_date == "")
						{
							nlapiSubmitField("purchaseorder",poId,"custbody_cad_approval_date",nlapiDateToString(new Date()));
						}
					}
					else
					{
						nlapiSubmitField("purchaseorder",poId,"custbody_cad_approval_date",null);
					}
				}
				else
				{
					nlapiSubmitField("purchaseorder",poId,"custbody_cad_approval_date", null);
				}
				cad_approval_date = nlapiLookupField("purchaseorder",poId,"custbody_cad_approval_date");
                if(cad_approval_date == null || cad_approval_date == "")
                {
                     cad_approval_date = null;
                }
				nlapiLogExecution("debug","updated cad approval date is :",cad_approval_date);
				//Ended by ajay 30Dec 2016
				
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
                           //Added new code by ajay 23Sept 2016
			   var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
			   if(cad_file_name == null || cad_file_name == '')
			   {
				cad_file_name = null;
			   }
               //Added new code by ajay 23Sept 2016
		       var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
		       if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
		       {				   
			        approved_to_grow_confirmation = null;
		       }
		       //Ended by ajay
			   //Added by ajay 01Dec 2016
				var  promo_item = nlapiLookupField("purchaseorder",poId,"custbody_drop_ship_promo_item");
				//Ended by ajay 01Dec 2016
				
                //Added by ajay 28Feb 2017
			    var ddFirm = POObj.getFieldValue('custbody82');
				//Ended 28Feb 2017
				
				//Added by Ravi 28Feb 2017
				var revisednotes = POObj.getFieldValue('custbody358');
				//Ended 28Feb 2017
			
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
                                //nlapiLogExecution("debug","item notes is : ",itemNotes);
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
				//Added by ajay 30Dec 2016
				var mold_so = POObj.getLineItemValue("item","custcol_molds_so",i);
				if(mold_so == '' || mold_so == null)
				{
					 mold_so = "";
				}
				var quantity = POObj.getLineItemValue("item","quantity",i);
				if(quantity == '' || quantity == null)
				{
					 quantity = "";
				}
				//Ended by ajay 30Dec 2016
				
                var ObjItem = {
							"item_id" :parseInt(item), 
							"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
                            "description" : itemDesc,
                            "notes" : itemNotes,
                            "insurance_value" : itemInsVal,
                            "itemlink" : itemlink ,
                            "date_sent_from_sf" : dt_sentFrom_sf, 
							"loose_diamond" : isLooseDiamond,
                            "certificate_included" : certificate_included,
							"mold_so" : mold_so, //new added by ajay 30Dec 2016
							"quantity" : quantity
                            };
                //IteArray.push(ObjItem);
				//Added by ajay 27Sept 2016				
				if(parseInt(item) != 4204513)
				{
					IteArray.push(ObjItem);
				}				
				//Ended by ajay
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
					'ns_link' : custbody_ns_link, 
					"pro_vendor" :  parseInt(VendorId),
					"wait_cad" : custbody41,
                    "certificate_status" : certificate_status,
                    "approved_to_grow_confirmation" : approved_to_grow_confirmation,
					"internal_cad_file_name" : cad_file_name,
					"revise_count" : parseInt(revisedCount),
					"promo_item" : promo_item, //added by ajay 01Dec 2016
					"cad_approval_date"	: cad_approval_date, //Added by ajay 30Dec 2016
                    "dd_firm"	:	ddFirm, //Added 28Feb 2017
					"revised_notes"	:	revisednotes //Added 28Feb 2017
                  }; 
             }
					//Setting up URL of CDP             
					var url = "https://partner.brilliantearth.com/api/production/revised-po/";    
					   
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
                         var poUrl = "https://partner.brilliantearth.com"+responsebody["po_url"];
                         nlapiLogExecution("debug","Revised PO successfully pushed to Portal.");
                         try{
						       //nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushrevisedpo','custbody_po_portal_url'],[portalStatus,'T',poUrl]);
                            /*------------------------Added new code by Ajay 5Nov16-------------------------------*/
							var portalStatusArr=[];
							var approvedToGrow = POObj.getFieldValue("custbody_grow_confirmation");
							if(approvedToGrow != null && approvedToGrow != "")
							{
								for(var h=0; h<portalStatus.length;h++)
								{
									if(portalStatus[h]!='11')
									{
										portalStatusArr.push(portalStatus[h]);
									}
								}
								nlapiLogExecution("debug","approvedToGrow : "+approvedToGrow); 
								nlapiLogExecution("debug","Set PORTAL STATUS without approved to grow is : "+poId,JSON.stringify(portalStatusArr));
								nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushrevisedpo','custbody_po_portal_url'],[portalStatus,'T',poUrl]);
							}
							else
							{
								nlapiLogExecution("debug","Set PORTAL STATUS : "+poId,JSON.stringify(portalStatus));
								nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushrevisedpo','custbody_po_portal_url'],[portalStatus,'T',poUrl]);
							}
							/*------------------------End new code by Ajay 05Nov 16-------------------------------*/
							PushCustomerAddress(poId); //Added by ajay 01Dec 2016
                            response.sendRedirect("RECORD","purchaseorder",poId);
                        }
                        catch(err){
                        }
						// Added by Rahul Panchal as per PP-167 on dated 29/09/2016
						/*if(poId!='' || poId!=null)
						{
							var filter=[];
							filter.push(new nlobjSearchFilter('internalid',null,'anyof',poId));
							filter.push(new nlobjSearchFilter("mainline",null,"is","T"));
							var columns=[];
							columns.push(new nlobjSearchColumn("internalid","messages"));
							var searchResult=nlapiSearchRecord('purchaseorder',null,filter,columns);
							var searchCount=0;
							searchCount = searchResult.length;
							if(searchResult && searchCount > 0) 
							{
								for ( var i = 0; i < searchResult.length; i++) 
								{
									var allColumns=searchResult[i].getAllColumns();
									var msgId=searchResult[i].getValue(allColumns[0]);
									if(msgId !='' && msgId != null)
									{
										var msgObj=nlapiLoadRecord("message",msgId);
										var subject= msgObj .getFieldValue('subject');
										if( subject !="Portal Message" && poId > 0)
										{
											PushMessageNSToPortal(msgId,poId);
											nlapiLogExecution("debug","Message pushed successfully to portal");
										}
									}
								}

							}
						} //Ended By Rahul Panchal*/
					}
					else
					{   					      
					  response.write(response1.body);	
					  nlapiLogExecution("debug",response1.body);		
					}// end check of response.code
	}
	catch(err)
	{          
	  nlapiLogExecution("debug","Error occur during PO ID Push from NS to portal is : ",err.message); 
          response.sendRedirect("RECORD","purchaseorder",poId);
	}
}

//Added by ajay 01Dec 2016
function PushCustomerAddress(poId)
{
	try
	{		
		var soId = nlapiLookupField("purchaseorder",poId,"createdfrom");
		if(soId != null && soId != "")
		{
			var shipTo = nlapiLookupField("salesorder",soId,"shipaddress");
			
			if(shipTo != null && shipTo != "")
			{
				var shipAddress = shipTo.split('\n');
				SendNStoPortal(shipAddress,poId);
			}
		}
		else
		{
			nlapiLogExecution("debug","Sales order record does not link with existing PO");
		}
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error on pushing ship address is : ",ex.message);
	}
}

function SendNStoPortal(shipAddress,poId)
{
	var objJSON = {
					"shipping_address_name" : shipAddress[0],
					"shipping_address_street" : shipAddress[1], 
					"shipping_address_city" : shipAddress[2],
					"shipping_address_country" : shipAddress[3]						
				};

	//Setting up URL of CDP  		
	var url = "https://partner.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	
			
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
	var response = nlapiRequestURL(url, myJSONText, headers); 
	nlapiLogExecution('debug','Ship Address Response Body as Portal Output:', response.body);
			
	if(response.code==200)
	{
		var responsebody = JSON.parse(response.getBody());	
		nlapiLogExecution("debug", "Portal response for ship address submition is : ",responsebody.message);		
	}
	else
	{	
		nlapiLogExecution("debug","Portal error response is : ",response.body);		
	} 
}
//Ended by ajay 01Dec 2016


function replacer(key, value)
{
	if (typeof value == "number" && !isFinite(value))
	{
		return String(value);
	}
	return value;
}

// Added by Rahul Panchal as per PP-167 on dated 29/09/2016
/*function PushMessageNSToPortal(msgId,poId)
{
	try
	{
		var vendorId=nlapiLookupField("purchaseorder",poId,"entity");
		var vendorEmail= nlapiLookupField("vendor",vendorId,"email"); 
	         
		var pomsgArrField = ["author","authoremail","message","messagedate","recipientemail","subject"];
		var pomsgVal = nlapiLookupField("message",msgId,pomsgArrField);		   	
		var author=pomsgVal.author;
		var authorEmail=pomsgVal.authoremail;
	    var message=pomsgVal.message;
	    var date_created=pomsgVal.messagedate;     
	    var recipient_email11=pomsgVal.recipientemail;
	    var recipient_email=vendorEmail;		  
	    var author_email= authorEmail;
	    var message_subject=pomsgVal.subject;		   
	    var message_id=msgId;		  
	    var dateTimeArr='',dateStr='',timeStr='';
		
		if(date_created!='' && date_created!=null)
		{
			dateTimeArr=date_created.split(' ');
			dateStr=dateFormatYMD(dateTimeArr[0]);
			timeStr=dateTimeArr[1]+':'+'00';
		}
			
		date_created = dateStr+' '+timeStr;
		
		//nlapiLogExecution("debug","date time Value : ", date_created);  
        //nlapiLogExecution("debug","time Value : ", timeStr);  
				
		if(author!='' && author!=null &&  author_email!='' &&  author_email!=null && recipient_email!='' && recipient_email !=null && date_created!='' &&  message_subject!='' &&  message_id!='' && message_id!=null  && message!='')
		{			
			 //Setting up URL of PO             			 
			 var url = "https://partner.brilliantearth.com/api/production/message/";  // for Production  
			 //var url = "https://testportal.brilliantearth.com/api/production/message/";  // for test portal
			
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       
			headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // for Production
			//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';  // for sandbox
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
				 "purchase_order": poId
			}
					
			//Stringifying JSON
			var myJSONText = JSON.stringify(jsonobj, replacer); 
			var response = nlapiRequestURL(url, myJSONText, headers);    
			//Below is being used to put a breakpoint in the debugger  
			
			if(response.code=='200')
			{				
			    nlapiLogExecution('debug','PO Communication Successfully Pushed to Portal for poId :'+poId+',msgId :'+msgId, poId);
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];
				nlapiSubmitField('purchaseorder',poId,'custbody_portal_status',portalStatus);
			}
			else
			{						
				nlapiLogExecution('debug','PO Communication detail does not exists to push on portal for poId :'+poId, response.getBody());
			} 			 
		}// end check
	}
	catch (e)
	{
		nlapiLogExecution("debug","Error occur during PoId Push from NS to portal",e.message); 
	}
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
}*/
