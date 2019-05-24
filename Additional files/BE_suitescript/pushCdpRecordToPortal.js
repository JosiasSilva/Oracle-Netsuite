/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : pushCdpRecordToPortal.js
 * Created Date  : December 30, 2015
 * Last Modified Date : December 29, 2015
 * Comments : Script will push NS CDPID along with SO Items to web portal link "https://partner.brilliantearth.com/api/cdp/"
 * Sandbox URL: https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=809
 * Production URL: https://system.netsuite.com/app/common/scripting/script.nl?id=830&whence=
 */
function pushCDPRecordToPortal()
{
	
	try
	{
		var results = null; var retObj = [];    		
		var searchResult = new Array();
		// Loading the Given saved search of Pending Sales Order related to Custom Diamond 			
		var searchObj = nlapiLoadSearch(null, 'customsearch4087');
		// Running the Saved Search
		var searchResultSet = searchObj.runSearch();
		// Getting the All Results into one Array.
		var searchId = 0;
		var cdpIdArr=new Array();
		var cdpIdSoIdArr=new Array();
		var cdpIdSoId='';
	    do {
			var resultslice = searchResultSet.getResults(searchId,searchId + 1000);
			if (resultslice != null && resultslice != '')
			{
			   for ( var rs in resultslice) 
			   {
				   searchResult.push(resultslice[rs]);
				   searchId++;
			   }
			 }
					
		   } while (resultslice.length >= 1000);
		  var searchCount=resultslice.length ;
		  // Checking whether Search Result Array is null or not
		  if (searchResult != null && searchResult != '') 
		  {
			nlapiLogExecution('debug', 'Length of Search result is',searchResult.length);
			var columns = searchResult[0].getAllColumns();
			// Used to store the SO Internal id's and it's numbers 				
			var soIdArr = new Array();
			var duplicateSOId = 0;
			var count =0; var assetAcct = 0;
			// Getting the All SO Internal id's
			for ( var i = 0; i < searchResult.length; i++) 
			{
				soIdArr[soIdArr.length] = searchResult[i].getId();                                 
				if(duplicateSOId != soIdArr[i])
				{
					 duplicateSOId = soIdArr[i];					  
					 var filters = [];
					 filters[0] = nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",soIdArr[i]);
					 var CDPRecordSearch = nlapiSearchRecord("customrecord_custom_diamond",null,filters,[]); 

					if(CDPRecordSearch != null)
					{
					 
					   var cdp_Id=CDPRecordSearch[0].id;
					   var so_Id=soIdArr[i];
					   // nlapiLogExecution("debug","CDP Record Id :"+cdp_Id, cdp_Id);
					   //nlapiLogExecution("debug","Sales Order Id :"+so_Id, so_Id);
						if(cdp_Id!='')
						{	
                            count = count + 1;					  
							//cdpIdArr.push(cdp_Id);
							cdpIdSoId=cdp_Id+'~'+so_Id;
							cdpIdSoIdArr.push(cdpIdSoId);
						  
						}				  
											
					  // retObj = GetCustomDiamondRecords(retObj,CDPRecordSearch[0].id,assetAcct);                            						
					}// end check
			   
				} 
			}
			nlapiLogExecution("debug","Total Sales Order with CDP Record Count :"+count,count);        
		  }
		 
		 var totCdpCount=cdpIdSoIdArr.length;
		 var cdpIdSoIdStr='';
		 for (var k=0;k<totCdpCount;k++)
		 {
			cdpIdSoIdStr=cdpIdSoIdArr[k].split('~');
			var CId=cdpIdSoIdStr[0];
			var SoId=cdpIdSoIdStr[1];
                        pushDataNS2Portal(CId,SoId);                                  
                      
		 }
	 }
	 catch(err)
	 {
		  nlapiLogExecution("debug","Error occur during getting sales order list is :",err.message); 
	 }
}

function pushDataNS2Portal(cdpId,soId)
{
 try
 { 
   
   var cdpArrField = ["custrecord_custom_diamond_vendor","custrecord_vendor_stock_number","custrecord165","custrecord_on_vendor_portal","custrecord_action_needed","custrecord_item_status","custrecord_manual_override"];
   var cdpVal = nlapiLookupField("customrecord_custom_diamond",cdpId,cdpArrField);
   var vendorId=cdpVal.custrecord_custom_diamond_vendor;
  if(cdpId!='' && vendorId!='')
 {
   var vendorStockNo=cdpVal.custrecord_vendor_stock_number ;
   var portalRequestTypeId=cdpVal.custrecord165;
   var portalRequestType=cdpVal.custrecord165;
   var onVendorPortal=cdpVal.custrecord_on_vendor_portal;
   var action_needed=cdpVal.custrecord_action_needed;
   var item_status=cdpVal.custrecord_item_status;   
   var manual_override=cdpVal.custrecord_manual_override;

   var manualOverride=false, vendorPortal=false;
   if(manual_override=='T')
   {
	   manualOverride=true;
   }
   if(onVendorPortal=='T')
   {
	   vendorPortal=true;
   }
   

   var paymentTerms= nlapiLookupField('vendor',vendorId,'custentity101');
  

   if(paymentTerms=='Pre-Pay' && portalRequestTypeId=='3' && onVendorPortal=='F')
   {
     onVendorPortal='T';
     vendorPortal=true;
    
     //Setting up URL of CDP             
     //var url = "https://testportal.brilliantearth.com/api/cdp/";    db9a136f31d2261b7f626bdd76ee7ffb44b00542
   var url="https://partner.brilliantearth.com/api/cdp/";

  //Setting up Headers 
    var headers = new Array(); 
   headers['http'] = '1.1';    
   headers['Accept'] = 'application/json';       
   headers['Authorization']= 'Token d499ecd8233123cacd3c5868939fe167b7bf0837';
   headers['Content-Type'] = 'application/json'; 
   headers['User-Agent-x'] = 'SuiteScript-Call';

         
     //Setting up Datainput
      var jsonobj = {"cdp_id": cdpId, 
      "vendor_id": vendorId,
      "portal_request_type": portalRequestTypeId,
      "action_needed":parseInt(action_needed),
      "item_status":item_status,
      "on_vendor_portal":vendorPortal,
      "manual_override":manual_override,
      "payment_terms":paymentTerms
     }
                
     //Stringifying JSON
     var myJSONText = JSON.stringify(jsonobj, replacer); 
     var response = nlapiRequestURL(url, myJSONText, headers);    
     //Below is being used to put a breakpoint in the debugger
      
      if(response.code=='200')
      {
        nlapiSetFieldValue('custrecord_on_vendor_portal',onVendorPortal);    			                     
        nlapiSubmitField('customrecord_custom_diamond',cdpId,'custrecord_on_vendor_portal', onVendorPortal);       
        nlapiLogExecution('debug','Successfully Push On Vendor Portal for CDP Id:'+cdpId, cdpId);
        nlapiLogExecution("debug", "On Vendor Portal field updated successfully for CDP Id"+cdpId,cdpId)
        pushNSCdpItemData2Portal(cdpId,soId); // call to push SO Items after pushed cdpid
      } 


   }
 }//end check of cdpId
}
catch(err)
{
  nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
}   
}
function pushNSCdpItemData2Portal(cdpId,soId)
{
 try
 {          
    
	   var cdpArrField = ["custrecord_be_diamond_stock_number","custrecord_vendor_stock_number","custrecord165","custrecord_on_vendor_portal","custrecord_action_needed","custrecord_item_status","custrecord_custom_diamond_vendor"];
	   var cdpVal = nlapiLookupField("customrecord_custom_diamond",cdpId,cdpArrField);
	   var beStockNoId = cdpVal.custrecord_be_diamond_stock_number; //get Id
           var beStockNo=nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_be_diamond_stock_number',true)//get value 
	   var vendorStockNo = cdpVal.custrecord_vendor_stock_number;
	   var vendorId=cdpVal.custrecord_custom_diamond_vendor;
  
	 if(cdpId!='' && soId!='' && beStockNo!='' && vendorStockNo !='')
	 {    
	   var soObj = nlapiLoadRecord("salesorder",soId);
	   var count = soObj.getLineItemCount('item');	       
	   for(var j=1; j<=count; j++)
	   {				
		  var itemId = soObj.getLineItemValue("item","item",j);
		  var itemType = soObj.getLineItemValue("item","itemtype",j);
		  if(itemType == "InvtPart")
		  {
			var itemArr = ["custitem20","custitem5","custitem27","custitem7","custitem19","custitem28","custitem25","cost","custitem46","location","custitem30","lastpurchaseprice","custitem45","custitem37","custitem31","custitem32","custitem18"];
			var itemArrVal = nlapiLookupField("inventoryitem",itemId,itemArr);
                  
			var itemCost='',itemDelvLocation='';
            itemDelvLocation=itemArrVal.location;   
            if(itemDelvLocation == null || itemDelvLocation =='')
            {
               itemDelvLocation=null;
            }
            rap_price=itemArrVal.lastpurchaseprice;                 
			
			var rap_price='0';
			rap_price=itemArrVal.lastpurchaseprice;                 
			if(rap_price=='')
			{ 
			 rap_price='0';
			}

			if(itemArrVal.custitem20 == 7)   // condition for loose diamond inventory item
			{  
				  //Setting up URL of CDP             
				  var url = "https://partner.brilliantearth.com/api/item/";     

				   var headers = new Array(); 
				   headers['http'] = '1.1';    
				   headers['Accept'] = 'application/json';       
				   headers['Authorization']= 'Token d499ecd8233123cacd3c5868939fe167b7bf0837';
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
				  "percent_rap":itemArrVal.custitem45,
				  "fluor":itemArrVal.custitem37,
				  "girdle":itemArrVal.custitem31,
				  "cutlet":itemArrVal.custitem32,
				  "origin":itemArrVal.custitem18
				   }
					
				  //Stringifying JSON
				  var myJSONText = JSON.stringify(jsonobj, replacer); 
				  var response = nlapiRequestURL(url, myJSONText, headers);    
				  //Below is being used to put a breakpoint in the debugger
		  
				  if(response.code=='200')
				  {
					nlapiLogExecution('debug','Successfully Push CDP Item to Portal for CdpId:'+cdpId+', SO Id:'+soId+', Item Id:'+itemId, cdpId);
				  } 
				  
			}// end check
		  }// end check InvtPart
	   } //end of loop 
	   
	 }//end check of cdpId
  }
  catch(err)
 {
	nlapiLogExecution("debug","Error occur during CDPID's Items Push from NS to portal.",err.message); 
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