nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : 
 * Created Date  : May 29, 2017
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL:
 */
function priceUpdate() 
{
    try {
       
        if (nlapiGetContext().getRemainingUsage() < 500) {
            var stateMain = nlapiYieldScript();
            if (stateMain.status == 'FAILURE') {
                nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                throw "Failed to yield script";
            } else if (stateMain.status == 'RESUME') {
                nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
            }
        }
       // var mySearch = nlapiLoadSearch(null, 6272); // For Sandbox -5867
		 var mySearch = nlapiLoadSearch(null, 6433); // For Production
        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchresult.push(resultslice[rs]);
                    searchid++;
                }

            }
        } while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
        if (searchCount > 0) {
            //New variables for new logic
			
            var arr_item_ids = new Array();
           

            for (var j = 0; j < searchresult.length; j++) {

                var Results = searchresult[j].getAllColumns();
				arr_item_ids.push(searchresult[j].getId());

			 }
				var filter=new Array();
				filter.push(new nlobjSearchFilter('type',null,'anyof','Assembly'));
				filter.push(new nlobjSearchFilter('custitem20',null,'anyof',35));
				filter.push(new nlobjSearchFilter('internalid','memberitem','anyof',arr_item_ids));
				var search_items=nlapiSearchRecord('assemblyitem',null,filter);
               // var assembly_item_id = searchresult[j].getId();
			   if(search_items.length>0)
			   {
				   for(var z = 0; z < search_items.length; z++)
				   {
					    if (nlapiGetContext().getRemainingUsage() < 500) {
							var stateMain = nlapiYieldScript();
							if (stateMain.status == 'FAILURE') {
								nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
								throw "Failed to yield script";
							} else if (stateMain.status == 'RESUME') {
								nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
							}
						}
						
					   var assembly_item_id = search_items[z].getId();
						var member_items=nlapiLoadRecord('assemblyitem',assembly_item_id);
						var members_count=member_items.getLineItemCount('member');
						var item_price=0;
						for(var i=1;i<=members_count;i++)
						{
							var item_id=member_items.getLineItemValue('member','item',i);
							if(item_id!=2131887) // Assembly Ring Internal Id on Sandbox and production
							{
								var item=nlapiLoadRecord('inventoryitem',item_id)
								var item_count=item.getLineItemCount('price');
								for(var x=1;x<=item_count;x++)
								{
									var price=item.getLineItemMatrixValue('price','price',x,1);
									if(price!=null && price!='')
									{
										item_price=parseFloat(item_price)+parseFloat(price);
										break;
									}
								}

							}
						}
						member_items.setLineItemValue('price','price_1_',1,item_price);
						nlapiSubmitRecord(member_items,true);
				   }
			   }
            // end of for loop
        }

    } catch (e) {
        nlapiLogExecution('error', 'Error', e);
    }
}