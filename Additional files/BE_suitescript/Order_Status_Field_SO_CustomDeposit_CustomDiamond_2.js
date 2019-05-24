nlapiLogExecution("audit","FLOStart",new Date().getTime());
//When customDeposit create Update SO Field OrderStatus
function customDeposit_update_SO_OrderStatus(){
	var customDepositID = nlapiGetRecordId(); //get record id
    var customDepositType = nlapiGetRecordType(); //get record type
    var customDeposit = nlapiLoadRecord(customDepositType, customDepositID); //get customdeposit
    nlapiLogExecution('DEBUG', 'Custom Deposit ID and Type', customDepositID + "  " + customDepositType);
    var SalesOrderID = customDeposit.getFieldValue('salesorder');// get the salesorderId which relate with this customDeposit
    nlapiLogExecution('DEBUG', 'SalesOrder Internel ID', SalesOrderID);
    var triedTime = 0;
    update_SO_OrderStatus(SalesOrderID,triedTime);
    //var tt = setTimeout(function(){update_SO_OrderStatus(SalesOrderID)},60000);// slove Record have been changed

}
//When customDiamond edit Status will change SO field "Diamond Confirm New" Update SO Field 
function customDiamond_edit_update_SO_OrderStatus(type){
	if(type == 'edit'){
		var customDiamondID = nlapiGetRecordId(); //get record id
        var customDiamondType = nlapiGetRecordType(); //get record type
        var customDiamond = nlapiLoadRecord(customDiamondType, customDiamondID); //get customDiamond
        nlapiLogExecution('DEBUG', 'Custom Diamond ID and Type', customDiamondID + "  " + customDiamondType);
        var OldCustomDiamond = nlapiGetOldRecord();//get Old Record
        var customDiamond_Status = customDiamond.getFieldValue('custrecord_diamond_confirmed');//get the value of field "Diamond Confirm"
        var Old_customDiamond_Status = OldCustomDiamond.getFieldValue('custrecord_diamond_confirmed');
        nlapiLogExecution('DEBUG', 'Custom Diamond New Status and Old Status', customDiamond_Status + "  " + Old_customDiamond_Status);
        var salesOrderID = customDiamond.getFieldValue('custrecord_diamond_so_order_number');//get the value of field "SO Order Number"
        nlapiLogExecution('DEBUG', 'customDiamond Relate SO ID', salesOrderID);
        var triedTime = 0;
        if(customDiamond_Status != Old_customDiamond_Status){
        	if(salesOrderID){
				update_SO_OrderStatus(salesOrderID,triedTime);
        	}	
        }
	}
}
function update_SO_OrderStatus(salesorderId, triedTime){
	var salesOrderID = salesorderId;
    var salesOrderType = 'salesorder';
    var salesOrder = nlapiLoadRecord(salesOrderType, salesOrderID); //get salesorder
    nlapiLogExecution('DEBUG', 'SalesOrder ID and Type', salesOrderID + "  " + salesOrderType );
    var Highlight_status = [];
    var loose_diamond_flag = false;
    var order_status_array_sort = null;
    var order_status = salesOrder.getFieldValues('custbody227');
    var order_status_array = [];
    if(order_status){
        for(var i=0;i<order_status.length; i++) {
            order_status_array.push(order_status[i]);
        }
        order_status_array_sort=order_status_array.sort();
        nlapiLogExecution('DEBUG', 'order_status', order_status_array_sort.length);
    }
    
    // 1 .Setting to be added later Highlight conditions
    var setting_to_be_added_later = salesOrder.getFieldValue('custbody221');//get the field Value of "Setting to be added later"
    var categorys = [];
    var category_flag = true;
    var category1 = salesOrder.getFieldValue('custbody_category1');
    var category2 = salesOrder.getFieldValue('custbody_category2');
    var category3 = salesOrder.getFieldValue('custbody_category3');
    var category4 = salesOrder.getFieldValue('custbody_category4');
    var category5 = salesOrder.getFieldValue('custbody_category5');
    var category6 = salesOrder.getFieldValue('custbody_category6');
   /* nlapiLogExecution('DEBUG', 'Setting to be added later', 'Setting to be added later: ' + setting_to_be_added_later);
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category1: ' + category1);
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category2: ' + category2);
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category3: ' + category3);
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category4: ' + category4);
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category5: ' + category5);
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category6: ' + category6);*/
    categorys.push(category1,category2,category3,category4,category5,category6);
    for(var i=0;i<categorys.length;i++){
        var curr_category = categorys[i];
        if(curr_category == 7){
            loose_diamond_flag = true;
        }
        if(curr_category == 2 ||curr_category == 3){
            category_flag = false;
        }

    }
    nlapiLogExecution('DEBUG', 'Setting to be added later', 'category: ' +category_flag);

    //nlapiLogExecution('DEBUG', 'Setting to be added later', 'categorys length: ' + categorys.length);

    if(setting_to_be_added_later == 'T' && category_flag){
        Highlight_status.push('1');
    }


    //2 Pending Balance-Layaway Highlight conditions
    var layaway = salesOrder.getFieldValue('custbody111');
    var terms = salesOrder.getFieldValue('custbody225');
    var total = salesOrder.getFieldValue('total');
    var customdeposit_total = 0;
    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'layaway: '+layaway); 
    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'terms: '+terms); 
    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'total: '+total); 
    var relationRecordCount = salesOrder.getLineItemCount('links');
    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'relationRecordCount: '+relationRecordCount); 
    for(var i = 1;i <= relationRecordCount;i++){
        var curr_item_type = salesOrder.getLineItemValue('links', 'type', i);
        if(curr_item_type == "Customer Deposit"){
			var curr_item_tranid = salesOrder.getLineItemValue('links','tranid',i);
            var curr_item_total = getRealAmount(curr_item_tranid);//reference from Global_Config.js
            customdeposit_total += parseFloat(curr_item_total);
        }
    }
    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'custom Deposit total: '+customdeposit_total);
    var rate_customdeposit_total = customdeposit_total/parseFloat(total) ;
    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'custom Deposit rate: '+rate_customdeposit_total);
    if(layaway == 'T' && (rate_customdeposit_total < 0.2)){
        Highlight_status.push('2');
    }

	var plaOfSale = salesOrder.getFieldText('class');//test the condition is 'Website : Amazon Checkout' or 'Website : Paypal Express Checkout'
	nlapiLogExecution('DEBUG','place of sale:' + plaOfSale);
	var payMethod = salesOrder.getFieldText('custbody153');//test the condition is 'GE Money' 
	nlapiLogExecution('DEBUG','payment method(web):' + payMethod);
	var equal1 = (plaOfSale != 'Website : Amazon Checkout');
	var equal2 = (plaOfSale != 'Website : Paypal Express Checkout');
	var equal3 = (payMethod != 'GE Money');

	nlapiLogExecution('DEBUG','equal1:' + equal1);
    nlapiLogExecution('DEBUG','equal2:' + equal2);
	nlapiLogExecution('DEBUG','equal3:' + equal3);
    //3 Pending Balance Highlight conditions
    if(!terms){
        if(layaway == 'F' && (rate_customdeposit_total < 0.2)){
   if(plaOfSale != 'Website : Amazon Checkout' && plaOfSale != 'Website : Paypal Express Checkout' && payMethod != 'GE Money')
            Highlight_status.push('3'); 
        }
    }

    //4 Pending Diamond Confirmation Highlight conditions
    var diamond_confirmed_new = salesOrder.getFieldValue('custbody132');//get the field value of "Diamond Confirmed New"
    nlapiLogExecution('DEBUG', 'Pending Diamond Confirmation', 'Diamond Confirmed New: '+diamond_confirmed_new);
    nlapiLogExecution('DEBUG', 'Pending Diamond Confirmation', 'Loose Diamond: '+loose_diamond_flag);
    if(loose_diamond_flag ){
        if(diamond_confirmed_new != 1 && diamond_confirmed_new != 7){//diamond confirmed new != Yes AND != On Hold - Combining Shipments
            if(diamond_confirmed_new==6)
			{
				//diamond confirmed new = On hold - pending customer payment
				//if order is more than 50% paid the consider diamond confirmed
				if(rate_customdeposit_total < 0.2)
					Highlight_status.push('4');
			}
			else
			{
				Highlight_status.push('4');
			}
        }
    }

    //5 Comparison Shopper Highlight conditions
    var SO_Items_parent = [];
    var BE1_SO_Items_Size = [];
    var BE2_SO_Items_Size = [];
    var SO_parent_flag = false;
    var SO_Size_flag = false;
    var SO_item_count = salesOrder.getLineItemCount('item');
    nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO item count: '+SO_item_count);
    for(var i=1;i<=SO_item_count;i++){
        var curr_so_item_stocknum = salesOrder.getLineItemText('item','item',i);
        nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO item stocknum: '+curr_so_item_stocknum);
        var BE_pattern = /^be.*/im;
        var BE_result = BE_pattern.test(curr_so_item_stocknum);
        if(BE_result){
            SO_Items_parent.push(curr_so_item_stocknum.split(':')[0]);
        }
        var pattern = /^be[1].*/im;
        var result = pattern.test(curr_so_item_stocknum);
        var patternForBe2 = /^be[25].*/im;
        var be2Result = patternForBe2.test(curr_so_item_stocknum);
        if(result){
            BE1_SO_Items_Size.push(curr_so_item_stocknum.split('-')[curr_so_item_stocknum.split('-').length -1]);
        }
        if(be2Result){
            BE2_SO_Items_Size.push(curr_so_item_stocknum.split('-')[curr_so_item_stocknum.split('-').length -1]);
        }
        
    } 

    var SO_Items_parent_sort = SO_Items_parent.sort();
    var BE1_SO_Items_Size_sort = BE1_SO_Items_Size.sort();
    var BE2_SO_Items_Size_sort = BE1_SO_Items_Size.sort();
    if(SO_Items_parent.length>1){
         for(var i=0;i<SO_Items_parent.length;i++){
            if(SO_Items_parent_sort[i] == SO_Items_parent_sort[i+1]){
                SO_parent_flag = true;
            }
        }
    }
    if(BE1_SO_Items_Size.length>1){
        for(var i=0;i<BE1_SO_Items_Size.length;i++){
            if(BE1_SO_Items_Size[i] == BE1_SO_Items_Size[i+1]){
                SO_Size_flag = true;
            }
        }
    }
    if(BE2_SO_Items_Size.length>1){
        for(var i=0;i<BE2_SO_Items_Size.length;i++){
            if(BE2_SO_Items_Size[i] == BE2_SO_Items_Size[i+1]){
                SO_Size_flag = true;
            }
        }
    }
    nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO_parent: '+SO_Items_parent_sort);
    nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO_parent_flag: '+SO_parent_flag);
    nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO_Size_flag: '+SO_Size_flag);

    if(SO_parent_flag ||SO_Size_flag){
        Highlight_status.push('5');
    }

    //6 Info needed from CS Highlight conditions
    var Ops_CS_Status = salesOrder.getFieldValue('custbodyops_cs_status');//get the field value of "Ops/CS Status"
    nlapiLogExecution('DEBUG', 'Info needed from CS',"Ops/CS Status: "+Ops_CS_Status);
    if(Ops_CS_Status == 1){
        Highlight_status.push('6');
    }


    //7 New setting added Highlight conditions

    var salesOrder_status = salesOrder.getFieldText('orderstatus');
    var new_setting_add_flag = false;
    nlapiLogExecution('DEBUG', 'New setting added', "salesOrder status :"+salesOrder_status);
    if(salesOrder_status == 'Pending Fulfillment'){
        for(var i=1;i<=SO_item_count;i++){
            var curr_so_item_name = salesOrder.getLineItemText('item','item',i);
            var pattern = /^be[152].*/im;
            var result = pattern.test(curr_so_item_name);
            if(result){
                var curr_so_Relate_PO = salesOrder.getLineItemValue('item','createpo',i);
                var curr_so_item_description = salesOrder.getLineItemValue('item','description',i);
                nlapiLogExecution('DEBUG', 'New setting added', "curr_so_Relate_PO :"+curr_so_Relate_PO);
                nlapiLogExecution('DEBUG', 'New setting added', "curr_so_item_description :"+curr_so_item_description);
                if(!curr_so_Relate_PO && (curr_so_item_description.indexOf('backstock.') == -1)){
                    new_setting_add_flag = true;
                }
            }
        }

    }
    nlapiLogExecution('DEBUG', 'New setting added', "new_setting_add_flag :"+new_setting_add_flag);
    if(new_setting_add_flag){
        Highlight_status.push('7');
    }

    //8 Ready to Order Highlight conditions
    if(Highlight_status.length == 0 || payMethod == 'GE Money Financing'){
        Highlight_status.push('8');
    }

    nlapiLogExecution('DEBUG', 'status', Highlight_status);    
    salesOrder.setFieldValues('custbody227',Highlight_status);
    if(triedTime == 5){
    	return;
    }
    try{
        var id = nlapiSubmitRecord(salesOrder, true);
        nlapiLogExecution('DEBUG', 'submitted id ', id);
    }catch(e){
    	triedTime++;
        nlapiLogExecution('ERROR',e.getCode(),e.getDetails() + triedTime);
        update_SO_OrderStatus(salesorderId, triedTime);
    }
}