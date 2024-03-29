nlapiLogExecution("audit","FLOStart",new Date().getTime());
function set_status_field(){
	try
	{
		var salesOrderID = nlapiGetRecordId(); //get record id
	    var salesOrderType = nlapiGetRecordType(); //get record type
	    var salesOrder = nlapiLoadRecord(salesOrderType, salesOrderID); //get salesorder
	    nlapiLogExecution('DEBUG', 'SalesOrder ID and Type', salesOrderID + "  " + salesOrderType );
	
	    var Highlight_status = [];
	    var loose_diamond_flag = false;
	    var order_status_array_sort = null;
	    var order_status = salesOrder.getFieldValues('custbody227');
	    var paymentMethod = salesOrder.getFieldText('custbody153');//Payment Method(web)
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
		
		    nlapiLogExecution('DEBUG', 'Check ','Test 1');
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
	            var curr_item_total = salesOrder.getLineItemValue('links', 'total', i);
	            if (curr_item_total) {
	                customdeposit_total += parseFloat(curr_item_total);
	            }
	        }
	    }
	    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'custom Deposit total: '+customdeposit_total);
	    var rate_customdeposit_total = customdeposit_total/parseFloat(total) ;
	    nlapiLogExecution('DEBUG', 'Pending Balance-Layaway', 'custom Deposit rate: '+rate_customdeposit_total);
	    if(layaway == 'T' && (rate_customdeposit_total < 0.2)){
		    nlapiLogExecution('DEBUG', 'Check ','Test 2');
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
	          {
			   nlapiLogExecution('DEBUG', 'Check ','Test 3');
	            Highlight_status.push('3');
			  }
	        }
	    }
	
	    //4 Pending Diamond Confirmation Highlight conditions
	    var diamond_confirmed_new = salesOrder.getFieldValue('custbody132');//get the field value of "Diamond Confirmed New"
	    nlapiLogExecution('DEBUG', 'Pending Diamond Confirmation', 'Diamond Confirmed New: '+diamond_confirmed_new);
	    nlapiLogExecution('DEBUG', 'Pending Diamond Confirmation', 'Loose Diamond: '+loose_diamond_flag);
	    if(loose_diamond_flag ){
	        if(diamond_confirmed_new != 1){//diamond confirmed new != Yes
			    nlapiLogExecution('DEBUG', 'Check ','Test 4');
	            Highlight_status.push('4');
	        }
	    }
	  //5 Comparison Shopper Highlight conditions New (4/2/2016)
	//var SO_Size_of_Ring=[];
 //   var SO_Category_Size =0;
 //   var SO_Items_parent = [];
 //   var BE1_SO_Items_Size = [];
//    var BE2_SO_Items_Size = [];
 //   var SO_parent_flag = false;
 //   var SO_Size_flag = false;
 //   var SO_item_count = salesOrder.getLineItemCount('item');
 //   nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO item count: '+SO_item_count);
 //   for(var i=1;i<=SO_item_count;i++){
 //       var curr_so_item_stocknum = salesOrder.getLineItemText('item','item',i);
//		var curr_so_item_id = salesOrder.getLineItemValue('item','item',i);
    //    var qaRestFieldArr = ['custitem20','custitem63'];
  //      var InventoryFieldVal = nlapiLookupField('inventoryitem',curr_so_item_id,qaRestFieldArr ,true);
  //      if(InventoryFieldVal!=null)
  //       {
   //     var Category=InventoryFieldVal.custitem20;
   //     var Size_of_Ring=InventoryFieldVal.custitem63;
	//		if(Category=='Antique' && Size_of_Ring!=null && Size_of_Ring>0)
	//		{
	//		   SO_Category_Size=SO_Category_Size+1;
	//		   SO_Size_of_Ring.push(Size_of_Ring);
	//		}
   //    }
		
		
		
		
       // nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO item stocknum: '+curr_so_item_stocknum);
      //  var BE_pattern = /^be.*/im;
    //    var BE_result = BE_pattern.test(curr_so_item_stocknum);
    //    if(BE_result){
     //       SO_Items_parent.push(curr_so_item_stocknum.split(':')[0]);
   //     }
     //   var pattern = /^be[1].*/im;
    //    var result = pattern.test(curr_so_item_stocknum);
   //     var patternForBe2 = /^be[25].*/im;
  //      var be2Result = patternForBe2.test(curr_so_item_stocknum);
   //     if(result){
  //          BE1_SO_Items_Size.push(curr_so_item_stocknum.split('-')[curr_so_item_stocknum.split('-').length -1]);
  //      }
  //      if(be2Result){
     //       BE2_SO_Items_Size.push(curr_so_item_stocknum.split('-')[curr_so_item_stocknum.split('-').length -1]);
  //      }

  //  }

  //  var SO_Items_parent_sort = SO_Items_parent.sort();
  //  var BE1_SO_Items_Size_sort = BE1_SO_Items_Size.sort();
 //   var BE2_SO_Items_Size_sort = BE2_SO_Items_Size.sort();
 //   if(SO_Items_parent.length>1){
    //     for(var i=0;i<SO_Items_parent.length;i++){
   //         if(SO_Items_parent_sort[i] == SO_Items_parent_sort[i+1]){
          //      SO_parent_flag = true;
   //         }
    //    }
 //   }
 //   if(BE1_SO_Items_Size.length>1){
    //    for(var i=0;i<BE1_SO_Items_Size.length;i++){
    //        if(BE1_SO_Items_Size[i] == BE1_SO_Items_Size[i+1]){
     //           SO_Size_flag = true;
    //        }
   //     }
 //   }
 //   if(BE2_SO_Items_Size.length>1){
    //    for(var i=0;i<BE2_SO_Items_Size.length;i++){
      //      if(BE2_SO_Items_Size[i] == BE2_SO_Items_Size[i+1]){
        //        SO_Size_flag = true;
    //        }
    //    }
//    }
	
//	var SO_Category_flag=false;
//if(SO_Category_Size==2)
//{
 //   var Short_Cat=SO_Size_of_Ring.sort();
   
  //   for(var i=0;i<Short_Cat.length-1;i++){

        //    var valuechnagediff=(Short_Cat[i+1]-Short_Cat[i]);
        //    if(valuechnagediff<=1 || valuechnagediff>=-1){
         //      SO_Category_flag = true;
         //   }
      //  }
//}
 //   nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO_parent: '+SO_Items_parent_sort);
 //   nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO_parent_flag: '+SO_parent_flag);
 //   nlapiLogExecution('DEBUG', 'Comparison Shopper', 'SO_Size_flag: '+SO_Size_flag);

  //  if(SO_parent_flag ||SO_Size_flag || SO_Category_flag ){
   //     Highlight_status.push('5');
 //   }
	
//5 Comparison Shopper Highlight conditions old 
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
		     nlapiLogExecution('DEBUG', 'Check ','Test 6');
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
	                if(!curr_so_Relate_PO && (curr_so_item_description==null || curr_so_item_description=="" || curr_so_item_description.indexOf('backstock.') == -1)){
	                    new_setting_add_flag = true;
	                }
	            }
	        }
	
	    }
	    nlapiLogExecution('DEBUG', 'New setting added', "new_setting_add_flag :"+new_setting_add_flag);
	    if(new_setting_add_flag){
		    nlapiLogExecution('DEBUG', 'Check ','Test 7');
	        Highlight_status.push('7');
	    }
	
	    //8 Ready to Order Highlight conditions
	    if(Highlight_status.length == 0 || paymentMethod == 'GE Money Financing'){
		    nlapiLogExecution('DEBUG', 'Check ','Test 8');
	        Highlight_status.push('8');
	    }
	    var Highlight_status_sort = Highlight_status.sort();
	    nlapiLogExecution('DEBUG', 'status', Highlight_status);
	
	    var Highlight_status_change_flag = false;
	    if(order_status_array_sort){
	        nlapiLogExecution('DEBUG','ARRAY',order_status_array_sort+" :"+ Highlight_status_sort);
	        nlapiLogExecution('DEBUG',"length", order_status_array_sort.length+ " :"+ Highlight_status_sort.length);
	        if(Highlight_status_sort.length == order_status_array_sort.length){
	            for(var i=0;i<Highlight_status_sort.length;i++){
	                if(Highlight_status_sort[i]!= order_status_array_sort[i]){
	                    Highlight_status_change_flag = true;
	                }
	            }
	        }else{
	            Highlight_status_change_flag = true;
	        }
	    }else{
	        Highlight_status_change_flag = true;
	    }
	    if(Highlight_status_change_flag){
		        nlapiLogExecution('DEBUG', 'Value Check  ',Highlight_status);
	        salesOrder.setFieldValues('custbody227',Highlight_status);
	        try{
	            var id = nlapiSubmitRecord(salesOrder, true);
	            nlapiLogExecution('DEBUG', 'submitted id ', id);
	        }catch(e){
	            nlapiLogExecution('ERROR',e.getCode(),e.getDetails() );
	        }
	    }
	}
	catch(err)
	{
		
	}
    
}
