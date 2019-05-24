nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Nov 2014     Ravi Teja
 *
 */
var MINIMUM_USAGE = 100;

function fraudNotes(type) {
   try{
	   var mySearch = nlapiLoadSearch(null,2203);
		var searchresult = [];
		var resultset = mySearch.runSearch();
		var searchid = 0;
		do {
		    var resultslice = resultset.getResults( searchid, searchid+1000 );
		    if (resultslice !=null && resultslice !='') {	
		    for (var rs in resultslice) {
		    	searchresult.push( resultslice[rs] );
		        searchid++;
		    } 
		    }
		} while (resultslice.length >= 1000);
		if (searchresult) {
			for ( var i = 0; i < searchresult.length; i++) {
				var Results = searchresult[i].getAllColumns();
				var AVSStreetMatch='';
				var AVSZipMatch='';
				var addressMatch='';
				var fraudNotes='';
				
				//Rescheduling the script ...............................................
				if (nlapiGetContext().getRemainingUsage() < 500) {
                    var stateMain = nlapiYieldScript();
					if (stateMain.status == 'FAILURE') {
                        nlapiLogExecution("Debug","Failed to yield script, exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
						throw "Failed to yield script";
					} else if (stateMain.status == 'RESUME') {
                        nlapiLogExecution("Debug","Resuming script because of "+ stateMain.reason + ". Size = "+ stateMain.size);
					}
				}
				
				//Comparing of the address .............................................................
				var SalesOrderId= searchresult[i].getValue(Results[2]);
				try{
					if(SalesOrderId != null && SalesOrderId != ''){
                        
						nlapiLogExecution('error','customer deposist is ', searchresult[i].getId());
						var salesRec= nlapiLoadRecord('salesorder',SalesOrderId);
						var BillTo= salesRec.getFieldValue('billaddress');
						var ShipTo= salesRec.getFieldValue('shipaddress');
						if(BillTo != null && BillTo != '' && ShipTo != null && ShipTo != ''){
							var addressIndex= BillTo.localeCompare(ShipTo);
							nlapiLogExecution('debug','addressIndex is',addressIndex);
							if(addressIndex == '0'){
								addressMatch= 'same b/s';
							}else{
								addressMatch= 'diff b/s';
							}
						}
						
						//Getting the AVS information from the Saved Search .............................................
						var street= searchresult[i].getValue(Results[0]);
						if(street != null && street != ''){
							AVSStreetMatch= "AVS Street Match ="+street;
						}
						
						//Getting the AVS information from the Saved Search .............................................
						var zip= searchresult[i].getValue(Results[1]);
						if(zip != null && zip != ''){
							AVSZipMatch= "AVS Zip Match ="+zip;
						}
						
						//Generating the Final String .................................................................
						
						if(AVSStreetMatch != ''){
							if(fraudNotes == '')
							fraudNotes= AVSStreetMatch;
							else
							fraudNotes= fraudNotes+','+AVSStreetMatch;
						}
						if(AVSZipMatch != ''){
							
							if(fraudNotes == '')
								fraudNotes= AVSZipMatch;
							else
								fraudNotes= fraudNotes+','+AVSZipMatch;
						}
						if(addressMatch != '' && (AVSZipMatch != '' || AVSStreetMatch != '')){
							if(fraudNotes == '')
								fraudNotes= addressMatch;
								else
								fraudNotes= fraudNotes+'\n'+addressMatch;
							
						}else if(addressMatch != '' && (AVSZipMatch == '' && AVSStreetMatch == '')){
							var paymentMethod= searchresult[i].getValue(Results[3]);
							if(paymentMethod != null && paymentMethod != '20' && paymentMethod != '19'){
								fraudNotes= "-Please manually check AVS info in Cybersource, there is a possible AVS mismatch-";
							}
							fraudNotes= fraudNotes+'\n'+addressMatch;
						}
						
						
						nlapiLogExecution('debug','fraudNotes is', fraudNotes);
						var SOFraudNotes= salesRec.getFieldValue('custbody148');
						if(SOFraudNotes != null && SOFraudNotes != ''){
							SOFraudNotes= SOFraudNotes+'\n'+fraudNotes;
						}else{
							SOFraudNotes=fraudNotes;
						}
						salesRec.setFieldValue('custbody148',SOFraudNotes);
						try{
							var rec= nlapiSubmitRecord(salesRec,false,false);
						}catch(e){
							nlapiLogExecution('error','internal id is', rec);
						}
						
					
					}
				}catch(e){
					
				}
				
				
				
				
			}
		}
	   
   }catch(e){
	   nlapiLogExecution('error','exception is',e);
   }
}


function setRecoveryPoint() {
	var state = nlapiSetRecoveryPoint(); // 100 point governance
	if (state.status == 'SUCCESS')
		return; // we successfully create a new recovery point
	if (state.status == 'RESUME') // a recovery point was previously set, we
	// are resuming due to some unforeseen error
	{
		nlapiLogExecution("ERROR", "Resuming script because of " + state.reason
				+ ".  Size = " + state.size);
		return;
	} else if (state.status == 'FAILURE') // we failed to create a new
	// recovery point
	{
		nlapiLogExecution("ERROR", "Failed to create recovery point. Reason = "
				+ state.reason + " / Size = " + state.size);
	}
}

function checkGovernance() {
	var context = nlapiGetContext();
	if (context.getRemainingUsage() < MINIMUM_USAGE) {
		var state = nlapiYieldScript();
		if (state.status == 'FAILURE') {
			nlapiLogExecution("ERROR",
					"Failed to yield script, exiting: Reason = " + state.reason
							+ " / Size = " + state.size);
			throw "Failed to yield script";
		}
	}
}