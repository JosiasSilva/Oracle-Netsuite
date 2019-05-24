nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Syn_DateSentFromDiamondETA( type ) {
	try{
		var SO_ID = nlapiGetRecordId(); //get record id
		var SO_TYPE = nlapiGetRecordType(); //get record type
		var salesOrder = nlapiLoadRecord(SO_TYPE, SO_ID); //get sales order
		var oldSalesOrder = nlapiGetOldRecord();//get the old sales order
		var diamondETA = salesOrder.getFieldValue('custbody146');//get current value of Diamond ETA field 
		var oldDiamondETA = oldSalesOrder.getFieldValue('custbody146');//get old value of Diamond ETA field
		var filters = [];
		var cols = [];
		//var PO_TYPE = 'purchaseorder';
		filters.push(new nlobjSearchFilter('createdfrom',null,'is',SO_ID));//get the related purchase order
		var relatedPOs =  nlapiSearchRecord('purchaseorder', null, filters, cols);
                if ( relatedPOs == null || relatedPOs.length == 0 ) {
                	return ;
                }


		if ( diamondETA != oldDiamondETA ) {
			var soItemCount = salesOrder.getLineItemCount('item');
			var changeFlag = true;
			for ( var i = 1; i <= soItemCount; i++ ) {
				var ITEM_ID = salesOrder.getLineItemValue('item','item',i);
				var ITEM_TYPE = 'inventoryitem';


				try{
					var item = nlapiLoadRecord(ITEM_TYPE,ITEM_ID);
					var category = item.getFieldText('custitem20');
                                        nlapiLogExecution('DEBUG','Category',category);
					if ( category == 'Loose Diamond' ) {
						var locationCount = item.getLineItemCount('locations');
						for ( var i = 1; i <= locationCount; i++ ) {
							var locationName = item.getLineItemValue('locations','location_display',i);
                                                        nlapiLogExecution('DEBUG','Location Name',locationName);
							if ( locationName == 'San Francisco' ) {
								var quantity = item.getLineItemValue('locations','quantityavailable',i);
                                                                nlapiLogExecution('DEBUG','quantity',quantity);
								if ( quantity > 0 ) {
									changeFlag = false;
									break;
								}
							}
						}
					}
				}catch(e){
					nlapiLogExecution('ERROR',e.getCode(),e.getDetails());
				}
				if ( !changeFlag ) {
					break;//if the changeFlag equal false,jump out of current cycle
				}
			}
			if ( changeFlag ) {//if the changeFlage equal true
				if ( relatedPOs != null ) {
					for ( var i = 0; i < relatedPOs.length; i++ ) {
						var purchaseOrder = nlapiLoadRecord(relatedPOs[i].getRecordType(),relatedPOs[i].getId());
						var poItemCount = purchaseOrder.getLineItemCount('item');
						nlapiLogExecution('DEBUG','PO item count',poItemCount);
						nlapiLogExecution('DEBUG','diamondETA',diamondETA);
						var SF_sent_date='';
						// Added by Rahul Panchal on dated 29/09/2017 as per NS 908
						var created_date=purchaseOrder.getFieldValue('createddate');
						created_date=created_date.split(' ');
						var date_created=created_date[0];
						var time=created_date[1];
						var meridian=created_date[2];
						var create_time= time +' '+meridian;
						create_time=am_pm_to_hours(create_time);
						var fix_time='14:00 ';
						var nextBusinessDay='';
						if(create_time<fix_time){
							date_created=nlapiStringToDate(date_created,"date"); 
							nextBusinessDay = nlapiAddDays(date_created,1);
							SF_sent_date=businessDay_date(nextBusinessDay);
						}
						else if(create_time>=fix_time){
							date_created=nlapiStringToDate(date_created,"date"); 
							nextBusinessDay = nlapiAddDays(date_created,2);
							SF_sent_date=businessDay_date(nextBusinessDay);
						}
						for ( var i = 1; i <= poItemCount; i++ ){
							//purchaseOrder.setLineItemValue('item','custcol18',i,diamondETA);
							purchaseOrder.setLineItemValue('item','custcol18',i,SF_sent_date);

						}
					    var id = nlapiSubmitRecord(purchaseOrder, true);
	                    nlapiLogExecution('DEBUG', 'submitted id ', id);
					}
				}

			}
		}
		
	}catch(e){
		nlapiLogExecution('ERROR',e.getCode(),e.getDetails());
	}
}

// Added By Rahul Panchal as per NS 908
function businessDay_date(nextBusinessDay){
	var next_date='';
	var day = nextBusinessDay.getDay();
	if(day=='0' || day=='6'){
		switch(nextBusinessDay.getDay())
		{
			case 0:
					nextBusinessDay = nlapiAddDays(nextBusinessDay,1);
					break;			
			case 6: 
					nextBusinessDay = nlapiAddDays(nextBusinessDay,2);
					break; 		
		}
	}
		next_date = nlapiDateToString(nextBusinessDay,"date");
		return next_date;	
}

function am_pm_to_hours(time) {
        //console.log(time);
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "pm" && hours < 12) hours = hours + 12;
        if (AMPM == "am" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return (sHours +':'+sMinutes);
    }

// Ended