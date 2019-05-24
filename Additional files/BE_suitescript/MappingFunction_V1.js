//New optimized function by ajay 06Jan 2017
function GetPortalRequestVal(arr,cdpRecObj)
{		
  nlapiLogExecution('debug','cdpRecObj',JSON.stringify(cdpRecObj));
	var newMsg = ""; var portalReqTypeText = ""; var itemStatusText = ""; var actionNeededText = ""; var mappingline="";
	var portalReqTypeVal = 0; var itemStatusVal = 0; var actionNeededVal = 0;
	
	var diamond_type = cdpRecObj.diamond;//'45454AB';
	diamond_type = diamond_type.replace(/[0-9]/g, '');
	
    //New logic added by ajay 11March 2017 for task DP-264
	if(cdpRecObj.reqType == 1 && cdpRecObj.paid > 20 && cdpRecObj.portalReqType == 3 && cdpRecObj.actionNeeded == 2 && cdpRecObj.old_diamond_status == 9 && cdpRecObj.new_diamond_status == 1) 
	{		
		cdpRecObj.portalReqType = 3;
		portalReqTypeText ="Sold";
		cdpRecObj.actionNeeded = '3,4';
		actionNeededText = "Ready to Ship/Ready to Invoice";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 0,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	else if(cdpRecObj.reqType == 1 && cdpRecObj.paid < 20 && cdpRecObj.portalReqType == 2 && cdpRecObj.actionNeeded == 2) //New logic added by ajay 11March 2017 for task DP-264
	{		
        nlapiLogExecution("debug","test ajay85");
		cdpRecObj.portalReqType = 2;
		portalReqTypeText ="Hold";
		cdpRecObj.actionNeeded = '6';
		actionNeededText = "None";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 0,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	//Ended New logic added by ajay 11March 2017 for task DP-264
	else if((cdpRecObj.reqType == 1 && cdpRecObj.paid < 20) && (diamond_type == "AN" || diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A"))// 3,4 (Sold)
	{		
		//Added by ajay 18Nov 2016
		if(diamond_type == "AN" || diamond_type == "A" || diamond_type == "Y" || diamond_type == "AY" ) //4
		{
			cdpRecObj.portalReqType = 2;
			portalReqTypeText ="Hold";
		}
		//Ended by ajay 18Nov 2016
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 4,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	else if((cdpRecObj.reqType == 1 && cdpRecObj.paid >= 20 && cdpRecObj.grA == 'T' && cdpRecObj.assetAcct == 189) && (diamond_type == "B" || diamond_type == "AB")) // 5 (Sold)
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.itemStatus = 2;
		itemStatusText = "Confirmed";
		cdpRecObj.actionNeeded = '4';
		actionNeededText = "Ready to Invoice";
		newMsg = "Memo diamond sold, please upload invoice and send lab cert via FedEx";			 
	
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 	5,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	else if((cdpRecObj.reqType == 1 && cdpRecObj.paid >= 20 && cdpRecObj.grB == 'T' && cdpRecObj.assetAcct == 189)  && (diamond_type == "B" || diamond_type == "AB" ) )   // Line 6 (Sold)
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.itemStatus = 2;
		itemStatusText = "Confirmed";
		cdpRecObj.actionNeeded = '4';
		actionNeededText = "Ready to Invoice";                     
		newMsg = "";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 	6,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	else if((cdpRecObj.reqType == 1 && cdpRecObj.paid >= 20) && (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN" ))  // Line 7 (Sold)
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.actionNeeded = '2'; //New logic added by ajay 11March 2017 for task DP-264
		actionNeededText = "Confirmation Needed";

		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 	7,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	//Added AN logic by ajay 18Nov 2016
	else if((cdpRecObj.reqType == 6 ) && (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN" ))// 8 (Hold)
	{
		cdpRecObj.portalReqType = 2;
		portalReqTypeText = "Hold";			
											
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"        		: newMsg,
			"mappingline"           : 	8,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	//Remove AN logic by ajay 18Nov 2016
	else if((cdpRecObj.reqType == 7 && cdpRecObj.paid >= 20 && cdpRecObj.csStatus != 4) && (diamond_type == "A" || diamond_type == "Y" || diamond_type == "AN" )) // 9 (Replacement(diamond unavailable))
	{			
		//if(diamond.indexOf("A Pre-Pay") != -1 || diamond.indexOf("AN") != -1)
		if(diamond_type == "A" || diamond_type == "Y" || diamond_type == "AN" )
		{
			cdpRecObj.portalReqType = 2;
			portalReqTypeText = "Hold";
		}					
					
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	9,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	
	else if((cdpRecObj.reqType == 7 && cdpRecObj.paid >= 20 && cdpRecObj.csStatus == 4) && (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN" ))// 10 (Replacement(diamond unavailable))
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	10,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	
	else if((cdpRecObj.reqType == 7 && cdpRecObj.paid >= 20 && cdpRecObj.csStatus == 4 && cdpRecObj.grA == 'T' && cdpRecObj.assetAcct == 189)&&(diamond_type == "B" || diamond_type == "AB" )) // 11 (Replacement(diamond unavailable))
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.itemStatus = 2;
		itemStatusText = "Confirmed";
		cdpRecObj.actionNeeded = '4';
		actionNeededText = "Ready to Invoice";
		newMsg = "Memo diamond sold, please uploade invoice and send lab cert via FedEx";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	11,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	else if((cdpRecObj.reqType == 7 && cdpRecObj.paid >= 20 && cdpRecObj.csStatus == 4 && cdpRecObj.grB == 'T' && cdpRecObj.assetAcct == 189) && (diamond_type == "B" || diamond_type == "AB" ))// 12 (Replacement(diamond unavailable))
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.itemStatus = 2;
		itemStatusText = "Confirmed";
		cdpRecObj.actionNeeded = '4';
		actionNeededText = "Ready to Invoice";
		newMsg = "";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	12,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	//Added AN logic by ajay 18Nov 16
	else if((cdpRecObj.reqType == 7 && cdpRecObj.paid < 20 && cdpRecObj.csStatus != 4) && (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN" )) // 13 (Replacement(diamond unavailable))
	{
		cdpRecObj.portalReqType = 2;
		portalReqTypeText = "Hold";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	13,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}
	else if((cdpRecObj.reqType == 8 && cdpRecObj.paid >= 20 && cdpRecObj.grA == 'T' && cdpRecObj.assetAcct == 189) && (diamond_type == "B" || diamond_type === "AB" ))// 14 (Replacement(Customer Switch))
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.itemStatus = 2;
		itemStatusText = "Confirmed";
		cdpRecObj.actionNeeded = '4';
		actionNeededText = "Ready to Invoice";
		newMsg = "Memo diamond sold, please uploade invoice and send lab cert via FedEx";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	14,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}		
	else if((cdpRecObj.reqType == 8 && cdpRecObj.paid >= 20 && cdpRecObj.grB == 'T' && cdpRecObj.assetAcct == 189) && (diamond_type == "B" || diamond_type == "AB"))// 15 (Replacement(Customer Switch))
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		cdpRecObj.itemStatus = 2;
		itemStatusText = "Confirmed";
		cdpRecObj.actionNeeded = '4';
		actionNeededText = "Ready to Invoice";
		newMsg = "";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	15,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});
	}		
	else if((cdpRecObj.reqType == 8)&&(diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN" )) // 16 (Replacement(Customer Switch))
	{
		cdpRecObj.portalReqType = 3;
		portalReqTypeText = "Sold";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	16,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});			
	}
	else if((cdpRecObj.reqType == 9 )&&(diamond_type == "Y" || diamond_type == "AY" || diamond_type == "B" || diamond_type == "AB")) // 17(Memo)
	{
		cdpRecObj.portalReqType = 4;
		portalReqTypeText = "Memo";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	17,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});			
	}
	else if((cdpRecObj.reqType == 2) &&(diamond_type == "Y" || diamond_type == "AY" || diamond_type == "B" || diamond_type == "AB"))// 18(Appointment Request)
	{
		cdpRecObj.portalReqType = 4;
		portalReqTypeText = "Memo";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	18,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});			
	}
	else if((cdpRecObj.reqType == 5 ) && (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN"))// 19 (Check Availability/Eye-Clean)
	{
		cdpRecObj.portalReqType = 5;
		portalReqTypeText = "Check Availability/Eye-Clean";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	19,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});			
	}
	else if((cdpRecObj.reqType == 4 )&& (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN"))// 20 (Photography Request)
	{
		cdpRecObj.portalReqType = 6;
		portalReqTypeText = "Image Request";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	20,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});			
	}
	else if((cdpRecObj.reqType == 3 ) && (diamond_type == "Y" || diamond_type == "AY" || diamond_type == "A" || diamond_type == "AN"))// 21 (Cert Request)
	{
		cdpRecObj.portalReqType = 7;
		portalReqTypeText = "Cert Request";
		
		arr.push({
			"portalReqTypeVal" 		: cdpRecObj.portalReqType,
			"itemStatusVal" 		: cdpRecObj.itemStatus,
			"actionNeededVal" 		: cdpRecObj.actionNeeded,
			"portalReqTypeText" 	: portalReqTypeText,
			"itemStatusText"    	: itemStatusText,
			"actionNeededText"  	: actionNeededText,
			"newMsg"				: newMsg,
			"mappingline"           : 	21,
			"Delivery Location"		: cdpRecObj.Delivery_location
		});			
	}
	return arr;
}

//Ended by ajay 04Jan 2017
