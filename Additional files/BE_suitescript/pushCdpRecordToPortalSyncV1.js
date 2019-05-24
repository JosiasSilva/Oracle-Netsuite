/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : pushCdpRecordToPortalSyncV1.js
 * Created Date  : December 30, 2015
 * Last Modified Date : Jan 16, 2016
 * Comments : Script will push NS CDPID along with SO Items to web portal w.r.t all field mapping conditions 
 * Sandbox URL: https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=838&whence=
 */
function pushCDPRecordToPortal()
{
       
	try
	{
		var results = null; var retObj = [];    		
		var searchResult = new Array();
		// Loading the Given saved search of Pending Sales Order related to Custom Diamond 			
		var searchObj = nlapiLoadSearch(null, 'customsearch3661_2');
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
                  var cdpIdArrNew=[];
		  if (searchResult != null && searchResult != '') 
		  {
			nlapiLogExecution('debug', 'Length of Search result is',searchResult.length);
			var columns = searchResult[0].getAllColumns();
			// Used to store the SO Internal id's and it's numbers 				
			var soIdArr = new Array();
			var duplicateCdpId = 0;
			var count =0; var assetAcct = 0;
			// Getting the All SO Internal id's
			for ( var i = 0; i < searchResult.length; i++) 
			{
				
			   var cdp_Id= searchResult[i].getId();  
			   var so_Id= searchResult[i].getValue(columns[8]);   
                           if(cdp_Id!=duplicateCdpId)  
                           {                          
			    cdpIdSoId=cdp_Id+'~'+so_Id;
			    cdpIdSoIdArr.push(cdpIdSoId); 
                           }                        
				
			   duplicateCdpId =cdp_Id;
				
			}
			nlapiLogExecution("debug","Total Sales Order with CDP Record Count :"+count,count);        
		  }
		 
		 var totCdpCount=cdpIdSoIdArr.length;
		 var cdpIdSoIdStr='';
		 for (var k=0;k<totCdpCount;k++)
		 {
                      if(cdpIdSoIdArr[k]!='' && cdpIdSoIdArr[k]!=null)
                      {
			cdpIdSoIdStr=cdpIdSoIdArr[k].split('~');
			var CId=cdpIdSoIdStr[0];
			var SoId=cdpIdSoIdStr[1];
                        pushDataNS2Portal(CId,SoId);       
                      }                           
                      
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
    var assetAcct='';   
    if(soId!='')
    {
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

   //var cdpArrField = ["custrecord_custom_diamond_request_type","custrecord_custom_diamond_cs_status","custrecord_custom_diamond_percent_paid","custrecord_cdp_group_a","custrecord_cdp_group_b","custrecord_custom_diamond_vendor","custrecord_vendor_stock_number","custrecord165","custrecord_on_vendor_portal","custrecord_action_needed","custrecord_item_status","custrecord_manual_override"];

   //var cdpVal = nlapiLookupField("customrecord_custom_diamond",cdpId,cdpArrField);
   //var vendorId=cdpVal.custrecord_custom_diamond_vendor;
 
  var cdpObj = nlapiLoadRecord("customrecord_custom_diamond",cdpId);
  var vendorId=cdpObj.getFieldValue('custrecord_custom_diamond_vendor');
  
  if(cdpId!='' && vendorId!='')
 {
   var diamond = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_be_diamond_stock_number",true); // added by ajay
   var vendorStockNo=cdpObj.getFieldValue('custrecord_vendor_stock_number') ;
   var portalRequestTypeId=cdpObj.getFieldValue('custrecord165');
   var portalRequestType=cdpObj.getFieldText('custrecord165');
   var onVendorPortal=cdpObj.getFieldValue('custrecord_on_vendor_portal');
   //var action_needed=cdpObj.getFieldValue('custrecord_action_needed');
    var action_needed=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");   
   var item_status=cdpObj.getFieldValue('custrecord_item_status');   
   var manual_override=cdpObj.getFieldValue('custrecord_manual_override');
   var requestType = cdpObj.getFieldValue('custrecord_custom_diamond_request_type');
   var percent_paid=cdpObj.getFieldValue('custrecord_custom_diamond_percent_paid');
   var groupA=cdpObj.getFieldValue('custrecord_cdp_group_a');
   var groupB=cdpObj.getFieldValue('custrecord_cdp_group_b');
   var cs_status=cdpObj.getFieldValue('custrecord_custom_diamond_cs_status');
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
   

   var paymentTerms= nlapiLookupField('vendor',vendorId,'custentity101');
  resultArr = 
GetPortalRequestVal(resultArr,diamond,paymentTerms,portalRequestTypeId,requestType,paid,groupA,groupB,item_status,action_needed,cs_status,assetAcct)
 
if(resultArr.length > 0 && onVendorPortal=='F')
  {   
     portalRequestTypeId= resultArr[0].portalReqTypeVal;
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

  
   if(onVendorPortal=='F' )  
   {
     onVendorPortal='T';
     vendorPortal=true;
    
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
      var jsonobj = {"cdp_id": cdpId, 
      "vendor_id": vendorId,
      "portal_request_type": portalRequestTypeId,     
      "action_needed":actNeedStr,
      "item_status":item_status,
      "on_vendor_portal":vendorPortal,
      "manual_override":manual_override,
      "payment_terms":paymentTerms
     }
                
     //Stringifying JSON
     var myJSONText = JSON.stringify(jsonobj, replacer); 
     var response = nlapiRequestURL(url, myJSONText, headers); 
     //nlapiLogExecution('debug','Response Body:', myJSONText);
    // nlapiLogExecution('debug','Response Body:', response.getBody());  
     //Below is being used to put a breakpoint in the debugger
      
      if(response.code=='200')
      {
       		                     
        cdpObj.setFieldValue('custrecord_on_vendor_portal',onVendorPortal);
        cdpObj.setFieldValue('custrecord_action_needed',actNeedArr);
        cdpObj.setFieldValue('custrecord_item_status',item_status);
        cdpObj.setFieldValue('custrecord165',portalRequestTypeId);
        
        var cdpID = nlapiSubmitRecord(cdpObj,true,true);

        nlapiLogExecution('debug','Successfully Push On Vendor Portal for CDP Id:'+cdpID , cdpID );
        nlapiLogExecution("debug", "On Vendor Portal field updated successfully for CDP Id"+cdpID ,cdpID );
       if(soId!='')
       {
         var result = pushNSCdpItemData2Portal(cdpId,soId); // call to push SO Items after pushed cdpid
         if(result.code == '200')
         {        
                
	  nlapiLogExecution('debug','Successfully Push CDP Item to Portal for CdpId:'+cdpID +', SO Id:'+soId, cdpID );
			
         }
        }// end check of soId

      } 


   }
 }//end check of cdpId
}// end check of resultArr


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
			
			var rap_price='0',percent_rap=0;
			rap_price=itemArrVal.lastpurchaseprice; 
                        percent_rap=itemArrVal.custitem45;                
			if(rap_price=='')
			{ 
			 rap_price='0';
			}
                        if(percent_rap=='')
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
				  var response = nlapiRequestURL(url, myJSONText, headers);  
                                 //  nlapiLogExecution('debug','Response Body:', response.getBody());    
				  //Below is being used to put a breakpoint in the debugger
                                  return response;
		  
				   
				  
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
				actionNeeded = 4;
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
				actionNeeded = 4;
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
		else if(reqType == 1 && paid >= 20) // 7
		{			
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1 || diamond.indexOf("A") != -1 || diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1 || diamond.indexOf("B") != -1 || diamond.indexOf("AB") != -1)
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
				actionNeeded = 4;
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
				actionNeeded = 4;
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
				actionNeeded = 4;
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
				actionNeeded = 4;
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
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1)
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
			if(diamond.indexOf("Y") != -1 || diamond.indexOf("AY") != -1)
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
						
			portalReqType = "3"; //Cert Request
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