var startTime = new Date().getTime();
function days_count_scheduled(){
	try{
		var number_of_days=0;
		var mySearch = nlapiLoadSearch(null, 'customsearch_diamond_turnover_monitori_2'); // For Production
		nlapiLogExecution('DEBUG', 'My search',mySearch);
        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
          //var resultslice = resultset.getResults(searchid, 15);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchresult.push(resultslice[rs]);
                    searchid++;
                }
            }
        } while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
		nlapiLogExecution('DEBUG','Search count',searchCount);
		if (searchCount > 0){
			 var col = searchresult[0].getAllColumns();
			for (var j = 0; j < searchresult.length; j++){
				RescheduleScript();
                yieldBasedOnTime();
				var number_of_days=0;
				var ItemId=searchresult[j].getValue(col[0]);
				var ItemName=searchresult[j].getValue(col[1]);
				var itemReceiptDate_arr=[];
				var itemReceiptDate_result=nlapiSearchRecord(null,'customsearch_date_diff_item_receipt',new nlobjSearchFilter('internalid','item','is',ItemId));
				if(itemReceiptDate_result){ 
					var col1 = itemReceiptDate_result[0].getAllColumns();
					//var itemReceiptDate_arr=[];
					var item_recipt_date='';														
					for(var i=0;i<itemReceiptDate_result.length;i++){					
						item_recipt_date=itemReceiptDate_result[i].getValue(col1[2]);						  
						itemReceiptDate_arr.push({"item_recipt_date" :item_recipt_date});	}					
				}
				var itemFulfillDate_arr=[];
				var itemFulfillmentDate_result=nlapiSearchRecord(null,'customsearch_date_diff_item_fulfillment',new nlobjSearchFilter('internalid','item','is',ItemId));
				if(itemFulfillmentDate_result){
					var col2 = itemFulfillmentDate_result[0].getAllColumns();
					//var itemFulfillDate_arr=[];
					var item_fufillment_date='';
					//var if_date='';
					for(var f=0;f<itemFulfillmentDate_result.length;f++){					
							item_fufillment_date=itemFulfillmentDate_result[f].getValue(col2[2]);	
							//if(if_date!=item_fufillment_date){
								itemFulfillDate_arr.push({"item_fulfillment_date" :item_fufillment_date});
								//if_date=item_fufillment_date;
							//}	
						//itemFulfillDate_arr.push({"item_fulfillment_date" :item_fufillment_date});
						}
				}
				var if_date='';
				 var itemReceiptDate_arr_count='';
				 var itemFulfillDate_arr_count='';
				 var item_ful_fill_date='';
				 if(itemReceiptDate_arr){
					 itemReceiptDate_arr_count=itemReceiptDate_arr.length; 
				 }
				if(itemFulfillDate_arr){
					 itemFulfillDate_arr_count=itemFulfillDate_arr.length;
				}				
				if(itemReceiptDate_arr_count || itemFulfillDate_arr_count){
					if(itemReceiptDate_arr_count==itemFulfillDate_arr_count){
						//var total_length=itemReceiptDate_arr.length;					
						for(var t=1;t<=itemReceiptDate_arr_count;t++){
							var flag=0; 
							var new_flag=0;
							var item_receipt_date=itemReceiptDate_arr[t-1].item_recipt_date;
							item_ful_fill_date=itemFulfillDate_arr[t-1].item_fulfillment_date;
							if(item_ful_fill_date<item_receipt_date && t<itemReceiptDate_arr_count){
								item_ful_fill_date=itemFulfillDate_arr[t].item_fulfillment_date;
								flag=1;
							 }	
							if(if_date!=item_ful_fill_date){
								if_date=item_ful_fill_date;
							}
							if(item_receipt_date && if_date && flag==1){
								item_receipt_date=nlapiStringToDate(item_receipt_date);
								var if_date_1=nlapiStringToDate(if_date);
								if_date_1=nlapiAddDays(if_date_1,1);
								var special_duration=parseInt((if_date_1.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
								number_of_days=parseInt(number_of_days)+parseInt(special_duration);		
							}
							else if(item_receipt_date && if_date && new_flag==0 && flag==1){
								item_receipt_date=nlapiStringToDate(item_receipt_date);
								 var if_date_1=nlapiStringToDate(if_date);
								if_date_1=nlapiAddDays(if_date_1,1);
								var special_duration=parseInt((if_date_1.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
								number_of_days=parseInt(number_of_days)+parseInt(special_duration);	
							} 
							else if(item_receipt_date == if_date && new_flag==0 && flag==0 ){
								item_receipt_date=nlapiStringToDate(item_receipt_date);
								 var if_date_1=nlapiStringToDate(if_date);
								if_date_1=nlapiAddDays(if_date_1,1);
								var special_duration=parseInt((if_date_1.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
								number_of_days=parseInt(number_of_days)+parseInt(special_duration);	
							} 
							/*else if(item_receipt_date > if_date && new_flag==0 && flag==0 ){
								item_receipt_date=nlapiStringToDate(item_receipt_date);
								 var if_date_1=nlapiStringToDate(if_date);
								if_date_1=nlapiAddDays(if_date_1,1);
								var special_duration=parseInt((if_date_1.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
								number_of_days=parseInt(number_of_days)+parseInt(special_duration);	
							} */
							else if(item_receipt_date < if_date && new_flag==0 && flag==0 ){
								item_receipt_date=nlapiStringToDate(item_receipt_date);
								 var if_date_1=nlapiStringToDate(if_date);
								if_date_1=nlapiAddDays(if_date_1,1);
								var special_duration=parseInt((if_date_1.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
								number_of_days=parseInt(number_of_days)+parseInt(special_duration);	
							} 
							else if(item_receipt_date && flag==0){
								var today_date=new Date();
								today_date=nlapiAddDays(today_date,1);
								//item_receipt_date=nlapiStringToDate(item_receipt_date);item_recipt_date
								item_receipt_date=nlapiStringToDate(item_receipt_date);
								var last_day_count=parseInt((today_date.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
								number_of_days=parseInt(last_day_count)+parseInt(number_of_days);
							}
						}
					}else if(itemReceiptDate_arr_count!=itemFulfillDate_arr_count){
						var item_receipt_date='';
						var count=0;
						for(var t=1;t<itemReceiptDate_arr_count;t++){
							item_receipt_date=itemReceiptDate_arr[t-1].item_recipt_date;
							if(count<=itemFulfillDate_arr.length){
								count+=count;
								item_ful_fill_date=itemFulfillDate_arr[t-1].item_fulfillment_date;
								if(if_date!=item_ful_fill_date){
									if_date=item_ful_fill_date;
								}
								if(item_receipt_date && if_date){
									item_receipt_date=nlapiStringToDate(item_receipt_date);
									var if_date_1=nlapiStringToDate(if_date);
									if_date_1=nlapiAddDays(if_date_1,1);
									var special_duration=parseInt((if_date_1.getTime() - item_receipt_date.getTime()) / (1000 * 60 * 60 * 24));
									number_of_days=parseInt(number_of_days)+parseInt(special_duration); 	} 
							}						
						}
						var today_date=new Date();
						today_date=nlapiAddDays(today_date,1);
						//item_receipt_date=nlapiStringToDate(item_receipt_date);item_recipt_date
						item_recipt_date=nlapiStringToDate(item_recipt_date);
						var last_day_count=parseInt((today_date.getTime() - item_recipt_date.getTime()) / (1000 * 60 * 60 * 24));
						number_of_days=parseInt(last_day_count)+parseInt(number_of_days);
					}
				}
								
				nlapiSubmitField('inventoryitem',ItemId,'custitem_diamond_turnover_monitoring',number_of_days);
				//nlapiLogExecution("debug","Updated Item Id is "+ ItemId + " and no. of days are "+number_of_days+"");
				nlapiLogExecution("debug","Updated Item Id is : "+ ItemId + " and no. of days are : "+number_of_days+ " and Item Name is : " + ItemName +"");
			} 
		}
	}catch(ex){
		nlapiLogExecution("debug","Error Occuring While scheduling",ex.message);
	}
}



//Rescheduling Concept
function RescheduleScript()
{
	try
	{
		var context = nlapiGetContext();
		if (context.getRemainingUsage() <= 500)
		{
			var stateMain = nlapiYieldScript();
			if( stateMain.status == 'FAILURE')
			{
				//nlapiLogExecution("debug","Failed to yield script (do-while), exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
				throw "Failed to yield script";
			}
			else if ( stateMain.status == 'RESUME' )
			{
				//nlapiLogExecution("debug", "Resuming script (do-while) because of " + stateMain.reason+". Size = "+ stateMain.size);
			}
		}
	}
	catch(e)
	{
		if (e instanceof nlobjError)
		{
			nlapiLogExecution('debug', 'System Error', e.getCode() + '\n' + e.getDetails());
		}
		else
		{
			nlapiLogExecution('debug', 'Unexpected Error', e.toString());
		}
	}
}

//For Script Execution Time Exceeded. [NS-1499]
function yieldBasedOnTime()
{
  var timeElapsed = (new Date().getTime()*0.001) - (startTime*0.001);
  nlapiLogExecution('DEBUG', 'TIME ELAPSED',timeElapsed);
  //If the script's execution time exceeds 3500 secs
  if (timeElapsed > 3500){
    startTime = new Date().getTime();
    var state = nlapiYieldScript();

    // Throw an error or log the yield results
    if (state.status == 'FAILURE'){
      throw "Failed to yield script";
    }
    else if (state.status == 'RESUME'){
      nlapiLogExecution('DEBUG','Resuming script');
    }
  }
}