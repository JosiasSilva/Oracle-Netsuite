/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record','N/redirect','N/https','N/format'],
/**
 * @param {serverWidget} serverWidget
 */
function(serverWidget,runtime,search,record,redirect,https,format) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	try {
    		var soId = context.request.parameters.record;	
        	log.debug('Inside onRequest', 'Salesorder Id is:'+soId);
        	if(soId)
        	{
        		var soObj = record.load({
        			type: record.Type.SALES_ORDER,
        			id: soId,
        			isDynamic: true
        		});
        		var soStatus = soObj.getValue({
                	fieldId: 'status'
        			});
    			var orderType = soObj.getValue({
    				fieldId: 'custbody87'
        			});
    			orderType = orderType[0];
    			var MyAccount_WebInfo = soObj.getValue({
    				fieldId: 'custbody_my_account_info_on_web'
        			});	
    			var MyAccount_lastUpdated = soObj.getValue({
    				fieldId: 'custbody_my_account_info_last_updated'
        			});	
    			log.debug('Inside onRequest', 'Salesorder Status:'+soStatus+'/OrderType ='+orderType+'/MyAccount WebInfo'+MyAccount_WebInfo+'/MyAccount LastUpdated'+MyAccount_lastUpdated);
    			if ((orderType==1 || orderType==5) && soStatus!="Pending Approval" && MyAccount_WebInfo==true )
    			{				
    				PushSODataNStoPortal(soObj);
    				var submitFields = record.submitFields({
    					type: record.Type.SALES_ORDER,
    					id: soId,
    					values: {
    						custbody_my_account_info_on_web_via_so: 'YES'
    					},
    				});
    				log.debug('Inside onRequest', 'SO data Succuessfully Pushed To Website:'+soId);
    			}
    			else
    			{

    				var submitFields = record.submitFields({
    					type: record.Type.SALES_ORDER,
    					id: soId,
    					values: {
    						custbody_my_account_info_on_web_via_so: 'No'
    					},
    				});
    				log.debug('Inside onRequest', 'SO Data not matched with condition'+soId); 
                    redirect.toRecord({
                    	type: record.Type.SALES_ORDER,
                    	id: soId
                    	});
    			}
        	}	
		} catch (e) {
			var submitFields = record.submitFields({
				type: record.Type.SALES_ORDER,
				id: soId,
				values: {
					custbody_my_account_info_on_web_via_so: 'No'
				},
			});
			log.debug('Inside onRequest', 'SO Data not matched with condition'+soId); 
			redirect.toRecord({
            	type: record.Type.SALES_ORDER,
            	id: soId
            	});
		}  	
    }
    
    function PushSODataNStoPortal(soObj)
    {
    	try {
    		var soId = soObj.id;
    		log.debug('Inside PushSODataNStoPortal', 'SO initiated to Push To Portal for soId:'+soId);
    		if(soId!='' && soId!=null)
    		{
    			// My Account Web Information
    			var MyAccount_WebInfo = soObj.getValue({
    				fieldId: 'custbody_my_account_info_on_web'
        			});	
    			// My Account Last Updated 
    			var MyAccount_lastUpdated = soObj.getValue({
    				fieldId: 'custbody_my_account_info_last_updated'
        			});	
    			//Added by Yagya Kumar 25 May 2017
    			var web_resize_eligibility = soObj.getValue({
    				fieldId: 'custbody_web_resize_eligibility'
        			});
    			if(web_resize_eligibility == "")
                {
                    web_resize_eligibility = null;
                }
    			
    			var documentno = soObj.getValue({
    				fieldId: 'tranid'
        			});
    			//Website Order No.
    			var Weborderno = soObj.getValue({
    				fieldId: 'custbody71'
        			});
    			if(Weborderno=='' || Weborderno==null)
    			{
    				Weborderno=0;
    			}
    			else
    			{
    				Weborderno = parseInt(Weborderno);
    			}
    			
    			// Delivery Date
    			var deliverydate = soObj.getValue({
    				fieldId: 'custbody6'
        			});
    			//log.debug('deliverydate',deliverydate);
    			if(deliverydate=='' || deliverydate==null)
    			{
    				var date = new Date();
        			var deliverydate = format.format({
    					value: date,
    					type: format.Type.DATE
    					});
        			//log.debug('deliverydate',deliverydate);
    				//deliverydate=nlapiDateToString();
    			}
    			else
    			{
    				var date = new Date(deliverydate);
        			var deliverydate = format.format({
    					value: date,
    					type: format.Type.DATE
    					});
        			//log.debug('deliverydate',deliverydate);
    			}	
    			// ship address
    			var shipto = soObj.getValue({
    				fieldId: 'shipaddress'
    			});  
	   			if(shipto=='' || shipto==null)
	   			{
	   				shipto=null;
	   			}
	   			// Bill address
	   			var billto = soObj.getValue({
	    				fieldId: 'billaddress'
	    			});      
	   			if(billto=='' || billto==null)
	   			{
	   				billto=null;
	   			}
	   			// Pick up at BE
	   			var PickupatBE = soObj.getValue({
    				fieldId: 'custbody53'
    			});  
	   				    
	   			if(PickupatBE=='F')
	   			{
	   				 PickupatBE=false;
	   			}
	   			else
	   			{
	   				 PickupatBE=true;
	   			}
	   			
	   			// Pick up location
	   			var Pickuplocation= soObj.getValue({
    				fieldId: 'custbody_pickup_location'
    			});  
	   			if (Pickuplocation=='' || Pickuplocation==null)
				{
					 Pickuplocation=1;
				}
				else
				{
					 Pickuplocation = parseInt(Pickuplocation);
				}
	   			// Tax added
	   			var tax= parseInt(soObj.getValue({
    				fieldId: 'taxitem'
    			}));  
	   			// Tax Percentage
	   			var taxpercent= soObj.getValue({
    				fieldId: 'taxrate'
    			}); 
	   			
	   			if(taxpercent=='')
				{
					taxpercent=0.00;
				}
	   			// Tax Total
				var taxamount = soObj.getValue({
    				fieldId: 'taxtotal'
    			});     
				if (taxamount=='' || taxamount==null)
				{
					taxamount=0.00;
				}
				else
				{
					taxamount = parseFloat(taxamount).toFixed(2);
				}
				// Discount
				var discount = soObj.getValue({
    				fieldId: 'discounttotal'
    			});     
				if(discount=='' || discount==null)
				{
					discount=0.00;
				}
				// Shipping Cost
				var shippingcost = soObj.getValue({
    				fieldId: 'shippingcost'
    			});      
				if(shippingcost == '' || shippingcost == null)
				{
					shippingcost = 0.00;
				}
				// Subtotal Without Tax
				var subtotal_without_tax = soObj.getValue({
    				fieldId: 'subtotal'
    			});                
				if(subtotal_without_tax=='' || subtotal_without_tax==null)
				{
					subtotal_without_tax=0.00;
				}
				else
				{
					subtotal_without_tax=parseFloat(subtotal_without_tax).toFixed(2);
				}
				
				var websiteBalance = soObj.getValue({
    				fieldId: 'custbody_website_truebalance_amt'
    			});                
				if(websiteBalance=='' ||websiteBalance==null)
				{		 
					websiteBalance = 0;
				}			 
				 // Sales Order statusl
				var status = soObj.getValue({
    				fieldId: 'status'
    			});                
		   
				//APO Tracking #
				var APOtracking = soObj.getValue({
    				fieldId: 'custbody310'
    			});               
				if(APOtracking=='' || APOtracking== null )
				{
					APOtracking=null;
				}
				// Fedextracking#
				var Fedextracking = soObj.getValue({
    				fieldId: 'custbody69'
    			});               
				if (Fedextracking=='' || Fedextracking==null)
				{
					Fedextracking=null;
				}
				
	            var type_of_order = soObj.getValue({
    				fieldId: 'custbody87'
    			});               
				if( type_of_order == 'Matched Wedding Band')
				{
				    var order_type=type_of_order;
				}
				//Items
				var itemCount = soObj.getLineCount({
    				sublistId: 'item'
    			});  
				log.debug('Inside PushSODataNStoPortal', 'SO Item Count:'+itemCount);
				var IteArray = new Array();
                var descArray=new Array();
                for (var int = 0; int < itemCount; int++) {
                	var itemId = soObj.getSublistValue({
    					sublistId: 'item',
    					fieldId: 'item',
    					line: int
					});
					var itemType = soObj.getSublistValue({
	    					sublistId: 'item',
	    					fieldId: 'itemtype',
	    					line: int
						});
					var itemname = soObj.getSublistValue({
    					sublistId: 'item',
    					fieldId: 'item_display',
    					line: int
					});
					var itemcat = soObj.getSublistValue({
	    					sublistId: 'item',
	    					fieldId: 'custcol_category',
	    					line: int
						});
					if((itemType=='OthCharge' && itemId=='2158514') || (itemType=='Service' && itemId=='782') || (itemType=='Service' && itemId=='350') || (itemType=='Service' && itemId=='14772') || (itemType=='Discount' && itemId=='1762') || (itemType=='Discount' && itemId=='15037') || (itemType=='OthCharge' && itemId=='15918'))
					{
						var V1,V2,V3,V4,V5,V6,V7;
						var itemDescription = soObj.getSublistValue({
	    					sublistId: 'item',
	    					fieldId: 'description',
	    					line: int
						});
						if(itemDescription!=null)
						{						
							var itemPrice = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'amount',
		    					line: int
							});
							if (itemname=='Modifications')
							{
							  V1= [itemDescription,itemPrice]							   
							}
							else if (itemname=='Mid-Production Order Change')
							{
							  V2= [itemDescription,itemPrice]							   
							}
							else if (itemname=='Expedite fee')
							{
							  V3= [itemDescription,itemPrice] 						   
							}
							else if (itemname=='Saturday Delivery')
							{
							  V4= [itemDescription,itemPrice] 						   
							}
							else if (itemname=='Bank Wire Discount')
							{
							  V5= [itemDescription,itemPrice]  						  
							}
							else if (itemname=='Discount')
							{
							 V6= [itemDescription,itemPrice]  						   
							}
							else if(itemname=='Service Fee')           
							{
							 V7=[itemDescription,itemPrice]
							}
						   descArray={
						   "Modifications" : V1,
						   "Mid-Production Order Change" : V2,
						   "Expedite fee" :V3,
						   "Saturday Delivery" :V4,
						   "Bank Wire Discount" :V5, 
						   "Discount" :V6,
						   "Service Fee" :V7      
						   };			   
						}
					}
					else if((itemType=="InvtPart" && (itemname.indexOf("DNU")!=-1)) || ((itemname.indexOf("Repair Ring")!=-1) && (itemId=='1087131')))
					{
						log.debug('Inside PushSODataNStoPortal', 'item will not pushed to website:'+itemname);
					}
					else if(itemType == "InvtPart" || itemType=="Assembly")
                    {							 
												
						 itemname=getItemNameFormat(itemname,itemType,itemcat);
						 if(itemcat=='' || itemcat==null)
						 {
							 itemcat='';   // Not accepting Null
						 }
						 else
						 {
							 itemcat= parseInt(itemcat);
						 }
						 var itemrate = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'rate',
		    					line: int
							});
						 if(itemrate=='' || itemrate==null)
						 {
							 itemrate=0;
						 }
						 var itemquan = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'quantity',
		    					line: int
							});
						 if(itemquan=='' || itemquan==null)
						 {
							 itemquan=0;
						 }
						 else
						 {
							 itemquan= parseInt(itemquan);
						 }
						 
						 var itemamt = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'amount',
		    					line: int
							});
						 if(itemamt=='' || itemamt==null)
						 {
							 itemamt=0;
						 }
						 var itemInsVal= soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'custcol_full_insurance_value',
		    					line: int
							});
						 if(itemInsVal=='' || itemInsVal==null)
						 {
							 itemInsVal=0;
						 }
						 var istaxable = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'istaxable',
		    					line: int
							});
						 if(istaxable=='' || istaxable==null)
						 {
							 istaxable=false;
						 }
						 else
						 {
							 istaxable=true;
						 }
						 var taxableamt = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'taxableamt',
		    					line: int
							});
						 if(taxableamt=='' || taxableamt==null)
						 {
							 taxableamt=0;
						 }
						 var itemcomment = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'custcol5',
		    					line: int
							});
					
						 if(itemcomment=='' || itemcomment==null)
						 {
							 itemcomment='';
						 }
						 var itemdesc = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'description',
		    					line: int
							});
						
						 if(itemdesc=='' || itemdesc==null)
						 {
							 itemdesc='';    // Not accepting Null
						 }
						 var invItemObj = search.lookupFields({
								type: 'inventoryitem',
								id: itemId,
								columns: ['custitem5']
								});
						 var gemstone_shape = invItemObj.custitem5;
						 if(gemstone_shape=='' || gemstone_shape==null)
						 {
							 gemstone_shape='';
						 }
						log.debug("Inside  PushSODataNStoPortal",'Gemstone Shape ='+invItemObj.custitem5);
						var center_Gem = soObj.getSublistValue({
	    					sublistId: 'item',
	    					fieldId: 'custcol_center_gem',
	    					line: int
						});
						
						var center_Gem_item;
						if(center_Gem=='' || center_Gem==null)
						{
						 	center_Gem_item= "";
						}
						else
						{								 
							 center_Gem = center_Gem.split(',');
							 if(center_Gem.length == 1)
							 {
								center_Gem_item= center_Gem;	
							 }
							 else
							 {
								var Gem_center= new Array();
								
								for(var t=0;t<center_Gem.length;t++)
								{
									if(Gem_center=='')
									{
										Gem_center= center_Gem[t];
									}
									else
									{
										Gem_center= [Gem_center , center_Gem[t]];
									}
								}
							   center_Gem_item= Gem_center;
							 }							 
						}
						var gift_item = soObj.getSublistValue({
	    					sublistId: 'item',
	    					fieldId: 'custcol_gift_item',
	    					line: int
						});									   
				        if(gift_item==true)
					    {
				        	Objitem= {
							 "Comments" : itemcomment,
							 "Item_category" : itemcat,
							 "Amount" : itemamt,							  
							 "Item_name" :  itemname,
							 "Quantity" : itemquan,
							 "Item_id" :(itemId),
							 "Description" : itemdesc,
							 "TaxableAmount" : taxableamt,
							 "Rate " : itemrate,
							 "Insurance_value" : itemInsVal,
							 "IsTaxable" : istaxable,
							  "Gemstone Shape" : gemstone_shape,
                             "Gift Item" : "T",
							 "Center Gem" : center_Gem_item
							  };
							 IteArray.push(Objitem);
					    }
					 else
					    {						
						   Objitem= {
							 "Comments" : itemcomment,
							 "Item_category" : itemcat,
							 "Amount" : itemamt,							  
							 "Item_name" :  itemname,
							 "Quantity" : itemquan,
							 "Item_id" :(itemId),
							 "Description" : itemdesc,
							 "TaxableAmount" : taxableamt,
							 "Rate " : itemrate,
							 "Insurance_value" : itemInsVal,
							 "IsTaxable" : istaxable,
							  "Gemstone Shape" : gemstone_shape,
							   "Center Gem" : center_Gem_item
							  };
							 IteArray.push(Objitem);
				        }
                    }	
					else if(itemType=='NonInvtPart' || itemType=='OthCharge')
					{
					   if(itemId=='34115' || itemId=='34114' || itemId=='34113' || itemId=='34112' || itemId=='34110' || itemId=='34108' || itemId=='34107' || itemId=='34079' || itemId=='34104' || itemId=='34105' || itemId=='34106' || itemId=='51823')
					   {
						   if(itemcat == '' || itemcat == null)
						   {
							   itemcat ='';   // Not accepting Null
						   }
						   else
						   {
								itemcat = parseInt(itemcat);
						   }
						   var itemrate = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'rate',
		    					line: int
							});				
							
						   if(itemrate=='' || itemrate==null)
						   {
								itemrate=0;
						   }
						   var itemquan = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'quantity',
		    					line: int
							});			
						   if(itemquan=='' || itemquan==null)
						   {
								itemquan=0;
						   }
						   else
						   {
								itemquan= parseInt(itemquan);
						   }
						   var itemamt = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'amount',
		    					line: int
							});			
						   if(itemamt=='' || itemamt==null)
						   {
								itemamt=0;
						   }
						   var itemInsVal = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'custcol_full_insurance_value',
		    					line: int
							});			
						   if(itemInsVal=='' || itemInsVal==null)
						   {
								itemInsVal=0;
						   }
						   var istaxable = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'istaxable',
		    					line: int
						   });			
						   if(istaxable=='' || istaxable==null)
						   {
								istaxable=false;
						   }
						   else
						   {
								istaxable=true;
						   }
						   var taxableamt = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'taxableamt',
		    					line: int
							});			
						   if(taxableamt=='' || taxableamt==null)
						   {
								taxableamt=0;
						   }
						   var itemcomment = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'custcol5',
		    					line: int
							});			
						   if(itemcomment=='' || itemcomment==null)
						   {
								itemcomment='';
						   }
						   var itemdesc = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'description',
		    					line: int
							});			
						   if(itemdesc=='' || itemdesc==null)
						   {
								itemdesc='';    // Not accepting Null
						   }
						   	
						   var center_Gem = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'custcol_center_gem',
		    					line: int
							});			
						   var center_Gem_item;
						   if(center_Gem=='' || center_Gem==null)
						   {
							   center_Gem_item= "";
						   }
						   else
						   {
							   var gem='';
							   center_Gem=center_Gem.split(',');
							   if(center_Gem.length==1)
							   {
								   center_Gem_item= center_Gem;	
							   }
							   else
							   {
									var Gem_center= new Array();
									for(var t=0;t<center_Gem.length;t++)
									{
										if(Gem_center=='')
										{
											Gem_center= center_Gem[t];
										}
										else
										{
											Gem_center= [Gem_center , center_Gem[t]];
										}
									}
								   center_Gem_item= Gem_center;
							   }							 	 
							}
							var gift_item = soObj.getSublistValue({
		    					sublistId: 'item',
		    					fieldId: 'custcol_gift_item',
		    					line: int
							});															   
							if(gift_item==true)
							{
								Objitem= {
								 "Comments" : itemcomment,
								 "Item_category" : itemcat,
								 "Amount" : itemamt,							  
								 "Item_name" :  itemname,
								 "Quantity" : itemquan,
								 "Item_id" :(itemId),
								 "Description" : itemdesc,
								 "TaxableAmount" : taxableamt,
								 "Rate " : itemrate,
								 "Insurance_value" : itemInsVal,
								 "IsTaxable" : istaxable,
								 "Gift Item" : "T",
								 "Center Gem" : center_Gem_item
								  };
								 IteArray.push(Objitem);
						    }
						    else
						    {						
							   Objitem= {
								 "Comments" : itemcomment,
								 "Item_category" : itemcat,
								 "Amount" : itemamt,							  
								 "Item_name" :  itemname,
								 "Quantity" : itemquan,
								 "Item_id" :(itemId),
								 "Description" : itemdesc,
								 "TaxableAmount" : taxableamt,
								 "Rate " : itemrate,
								 "Insurance_value" : itemInsVal,
								 "IsTaxable" : istaxable,
							   	 "Center Gem" : center_Gem_item
								  };
								 IteArray.push(Objitem);
						    }
					   }
					} 
					else
					{
						log.debug("Inside  PushSODataNStoPortal",'item will not pushed to array :');
					}
				}
              //Customer Deposit
				var customerDepositArr = new Array();
				var ifArr = [];
				var filters = [];
				var searchResult=[];
				var searchid = 0;
				var filter1 = search.createFilter({
					name: 'salesorder',
					operator: search.Operator.IS,
					values: soId
				});
				var searchRecords = search.create({
					type: 'customerdeposit',
					filters: [filter1],
					columns: []
				}).run().getRange({ start: 0, end: 1000 });
				if(searchRecords != null && searchRecords!='')
				{   
				    for (var sr in searchRecords)
					{
						searchResult.push( searchRecords[sr] );
						searchid++;
					}   
				}
				if (searchResult.length > 0)
				{
					var custDepId = (searchResult[0].id);
					log.debug("Inside Customer Deposit",'custDepId ='+custDepId+'/Customer Deposit SearchResult ='+searchResult.length);	
					if(custDepId != null && custDepId != '')
					{
						var custDep = record.load({
		        			type: 'customerdeposit',
		        			id: custDepId,
		        			isDynamic: true
		        		});
		        		var currency = parseInt(custDep.getValue({
		                	fieldId: 'currency'
		        			}));
		        		var paymentAmt = custDep.getValue({
		                	fieldId: 'payment'
		        			});	
		        		var pmtmethod = custDep.getValue({
		                	fieldId: 'paymentmethod'
		        			});	
		        		log.debug("Inside Customer Deposit",'pmtmethod ='+pmtmethod+'/paymentAmt ='+paymentAmt);	
						
						//var pmtmethod = nlapiLookupField("customerdeposit",custDepId,'paymentmethod'); 
						//nlapiLogExecution("debug","Payment Method is :"+pmtmethod);
						var paymentMethod;
						if(pmtmethod == null || String(pmtmethod).length == 0)
						{					
							paymentMethod = '[]';
							//nlapiLogExecution("debug","Payment Method value is :",paymentMethod);
						}					
						else
						{
							paymentMethod = '[' +  pmtmethod + ']';
						}
			   
						var objCD = {
							"Currency" : currency,
							"Payment Amount" : paymentAmt,
							"Payment Method" : paymentMethod
							};
						customerDepositArr.push(objCD); 
					}
				}
				//Item Fulfillment
				
				var filter1 = search.createFilter({
					name: 'createdfrom',
					operator: search.Operator.IS,
					values: soId
				});
				var searchRecords = search.create({
					type: 'itemfulfillment',
					filters: [filter1],
					columns: []
				}).run().getRange({ start: 0, end: 1000 });
				if(searchRecords != null && searchRecords != '')
				{
					var ifId = (searchRecords[0].id);
					log.debug("Inside Item Fulfillment",'ifId ='+ifId);	
					var ifObj = record.load({
	        			type: 'itemfulfillment',
	        			id: ifId,
	        			isDynamic: true
	        		});
	        		var IFstatus = ifObj.getValue({
	                	fieldId: 'shipstatus'
	        			});
	        		var emailConfStatus = ifObj.getValue({
	                	fieldId: 'custbody89'
	        			});
	        		if(IFstatus == "Packed" && emailConfStatus == "Emailed")
					{
						var objIF = {
							"Status" : IFstatus,
							"Email Confirmation Status" : emailConfStatus	   
						};
						ifArr.push(objIF);
					}
				}
				websiteBalance = ""+websiteBalance;
				var objJSON =				 
				 {  "True Balance": websiteBalance,
					"Status" : status,
					"Bill To": billto,
					"Ship To": shipto,
					"Subtotal_WithoutTax": subtotal_without_tax,
					"FedEx Tracking #": Fedextracking,
					"Items" : IteArray,						
					"Tax": tax,
					"Tax Amount": taxamount,
					"Pick Up at BE": PickupatBE,
					"Shipping Cost": parseFloat(shippingcost),
					"Discount": parseFloat(discount),
					"MyAccountSync": true,
					"Sales Order Id" : parseInt(soId),						
					"Document Number": documentno,
					"Pick Up Location":Pickuplocation,
					"Delivery Date": deliverydate ,
					"Website Order Number": Weborderno ,
					"Tax Percent": taxpercent,
					"APO Tracking #":APOtracking,
					"Customer Deposit" : customerDepositArr,
					"Item Fulfillment" : ifArr,
					"Description" : descArray,
					"Type Of Order" : order_type,
                   "resize_eligibility" : web_resize_eligibility //Added by Yagya Kumar 25 May 2017
			    };
    		}
    		// Setting of URL
            var url="https://prepublish.brilliantearth.com/netsuite-api/import-ns-order/";       // for SandBox

		 	//var url="https://www.brilliantearth.com/netsuite-api/import-ns-order/";      // for Production
		 
            // Setting of Headres
		    var headers = new Array(); 
			headers['https'] = '1.1';    
			headers['Accept'] = 'application/json';       
			//headers['Authorization']= 'Basic YmV0ZWFtOmIzNjM0YQ==';
			//headers['auth-token']='YnJpbGxpYW50ZWFydGggYmViZTEz';
			//headers['auth-token']='YnJpbGxpYW50ZWFydGggYmViZTEz';
			headers['AUTH-TOKEN']= 'YnJpbGxpYW50ZWFydGggYmViZTEz';
		    headers['Authorization']= 'Basic YmV0ZWFtOkdsb3c4OWdsYXNz'; //Test Portal
			headers['User-Agent-x'] = 'SuiteScript-Call'; 
			headers['Content-Type'] = 'application/json'; 
			//headers['User-Agent-x'] = 'SuiteScript-Call'; 
			
			var myJSONText = JSON.stringify(objJSON, replacer); 
			log.debug("SO Response Body as NS Input:",myJSONText);	
			var response = https.post({
      			url: url,
      			body: myJSONText,
      			headers: headers
      		});
			log.debug("SO Response Body as NS Input:","Response Code ="+response.code);
            if(response.code == 200)
            {
              var responsebody = JSON.parse(response.body);
              log.debug("Inside response", responsebody.message);
              
			  // My Account Web Info Field updated after Pushed to website
			  MyAccount_WebInfo="F";
			  
			  var currentDate = sysDate(); // returns the date
			  var currentTime = timestamp(); // returns the time stamp in HH:MM:SS
			  MyAccount_lastUpdated=currentDate + ' ' + currentTime;
			  log.debug('Inside onRequest', 'MyAccount_lastUpdated:'+MyAccount_lastUpdated+'/MyAccount_WebInfo :'+MyAccount_WebInfo);
			  
			  var submitFields = record.submitFields({
					type: record.Type.SALES_ORDER,
					id: soId,
					values: {
						custbody_my_account_info_on_web: MyAccount_WebInfo,
						custbody_my_account_info_last_updated:MyAccount_lastUpdated
					},
				});
			  redirect.toRecord({
              	type: record.Type.SALES_ORDER,
              	id: soId
              	});
            }
            else if(response.code == 400)
			{
            	log.debug("Inside response", "data NS pushed is invalid :"+response.body);	
            	redirect.toRecord({
                	type: record.Type.SALES_ORDER,
                	id: soId
                	});
			}
			else if(response.code == 401)
			{
				//log.debug("Inside response", "Invalid Token and Authentication in header is :"+response.getBody());	
				redirect.toRecord({
                	type: record.Type.SALES_ORDER,
                	id: soId
                	});
			}
			else
			{
				//log.debug("Inside response", "Portal response is :"+response.getBody());			                        
				redirect.toRecord({
                	type: record.Type.SALES_ORDER,
                	id: soId
                	});
			}
						
		} catch (err) {
			// TODO: handle exception
			log.debug("Inside response", "Catch :"+err.message);	
			redirect.toRecord({
            	type: record.Type.SALES_ORDER,
            	id: soId
            	});
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
    function sysDate()
    {
    	var date = new Date();
    	var tdate = date.getDate();
    	var month = date.getMonth() + 1; // jan = 0
    	var year = date.getFullYear();
    	return currentDate = month + '/' + tdate + '/' + year;
    }
    function timestamp() 
    {
	    var str = "";
	
	    var currentTime = new Date();
	    var hours = currentTime.getHours();
	    var minutes = currentTime.getMinutes();
	    var seconds = currentTime.getSeconds();
	    var meridian = "";
	    if (hours > 12) {
	        meridian += "pm";
	    } else {
	        meridian += "am";
	    }
	    if (hours > 12) {
	
	        hours = hours - 12;
	    }
	    if (minutes < 10) {
	        minutes = "0" + minutes;
	    }
	    if (seconds < 10) {
	        seconds = "0" + seconds;
	    }
	    str += hours + ":" + minutes + ":" + seconds + " ";
	
	    return str + meridian;
    }

    function getItemNameFormat(itemStockNameArr, itemType,itemcat)
    {
    	var itemStockName = '';
    	if (itemStockNameArr != '' && itemType != '')
    	{
    		var itemStockName = '';
    		if (itemStockNameArr != '' && itemStockNameArr != null)
    		{
    			if (itemStockNameArr.indexOf(":") != -1)
    			{
    				var BE_pattern = /^be./im;
    				var BE_result = BE_pattern.test(itemStockNameArr);
    				if (BE_result)
    				{
    					itemStockName = itemStockNameArr.split(':')[1];
    					if (itemStockName != '')
    					{
    					itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1];
    					}
    				}
    				else
    				{
    				  itemStockName= itemStockNameArr.split(':')[1];
    					if (itemStockName != '')
    					{
    						if(itemStockName.indexOf("J")!=-1)
    						{
    							return itemStockName;							
    						}
    						else
    						{
    						   if(itemStockName.indexOf("-S")!=-1)
    							{
    							   if(itemcat=='4' || itemcat=='5' || itemcat=='34')
    							   {
    							  		return itemStockName;
    							   }
    							}
    						}
    					}
    				}
    			}
    			else if (itemStockNameArr.indexOf("S") != -1)
    			{
    				var BE_pattern = /^be./im;
    				var BE_result = BE_pattern.test(itemStockNameArr);
    				if (BE_result)
    				{
    					itemStockName = itemStockNameArr;
    					var arrtest = itemStockName.split('-');
    					if (itemStockName != '')
    					{
    						if (arrtest.length == 4)
    						{
    						itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1] + '-' + itemStockName.split('-')[2];
    						}
    						else if (arrtest.length == 3)
    						{
    						itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1];
    						}
    						else if (arrtest.length == 2)
    						{
    						  if(itemcat=='4' || itemcat=='5' || itemcat=='34')
    							{
    							   return itemStockName;
    							}
    						   else
    							{
    							  itemStockName = itemStockName.split('-')[0]; 
    							}
    						}
    						else
    						{
    						 itemStockName = itemStockNameArr;
    						}
    					}
    				}
    				else
    				{
    				   itemStockName = itemStockNameArr;
    				}
    			}
    			else if(itemStockNameArr!='')
    			{
    				var BE_pattern = /^be.*/im;
    				var BE_result = BE_pattern.test(itemStockNameArr);
    				if (BE_result)
    				{
    					itemStockName = itemStockNameArr;
    				}
    				else
    				{
    				  itemStockName = itemStockNameArr;
    				}
    			}
    			else
    			{
    				itemStockName = itemStockNameArr;
    			}

    		}
    	}
    	return itemStockName;
    } 
    
    return {
        onRequest: onRequest
    };
    
});
