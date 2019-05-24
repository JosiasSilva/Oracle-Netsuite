function item_fall_dashboard_suitelet(request,response){
	try{
		if(request.getMethod()=="GET"){
			var total_rec_len=0;
			var show_list=[];
			var cate_item = request.getParameter('item_category');
			var location_pull = request.getParameter('pull_location');
			var form = nlapiCreateForm("Inventory Pulls Dashboard");
			var item_category_field=form.addField('custpage_item_cat','select','Item Category','customlist13');
			item_category_field.setLayoutType('startrow','startcol');
			item_category_field.setDefaultValue(cate_item);
			var pull_location_field=form.addField('custpage_pull_loc','select','Pull Location','customlist_pull_location');
			pull_location_field.setLayoutType('midrow', 'startcol');
			pull_location_field.setDefaultValue(location_pull);
			var rec_total=form.addField('custpage_total_rec','integer','Total Records').setDisplayType("inline");
			rec_total.setLayoutType('endrow', 'startcol');
			form.setScript('customscript_inventory_pulls_client');
			form.addSubmitButton("Update");
			form.addButton("custpage_refresh","Refresh","inventory_pulls_dashboard_client(type,name);");
			form.addButton("custpage_print","Print",'Print_page(type,name);');
			
          	//Created By Babin - NS-1430
          	form.addButton("custpage_so_print_label","SO Print Label",'Print_so_label(type,name);');
			var list = form.addSubList('custpage_default', 'list', 'Sales Orders');
			list.addMarkAllButtons();
			var excla_field=list.addField('custpage_html','textarea',null,null);
			list.addField('custpage_pulled', 'checkbox', 'Pulled');
			list.addField('custpage_layaway_highlight', 'text', 'Layaway Highlight').setDisplayType("hidden");
			//list.addField('custpage_no_layaway_highlight', 'text', 'No Layaway Highlight'); //.setDisplayType("hidden");
			list.addField('custpage_sales_id', 'text', 'SalesOrder ID').setDisplayType("hidden");
			list.addField('custpage_sales_number', 'text', 'Sales Order');
			list.addField('custpage_customer', 'text', 'Customer');
			list.addField('custpage_item_id', 'text', 'Item Id').setDisplayType("hidden");
			list.addField('custpage_item', 'text', 'Item');
			list.addField('custpage_description', 'text', 'Description');
			list.addField('custpage_qty_sf', 'text', 'Qty in SF');
			list.addField('custpage_on_hand', 'text', 'On Hand');
			list.addField('custpage_available', 'text', 'Available');
			list.addField('custpage_in_transit', 'text', 'In-Transit');
			list.addField('custpage_purchase_num', 'text', 'Purchase Order');
			list.addField('custpage_date_received', 'text', 'Date Received');
			list.addField('custpage_diamond_eta', 'text', 'Diamond ETA');
			list.addField('custpage_deli_date', 'text', 'Delivery Date');
			list.addField('custpage_cs_status', 'text', 'CS Fulfillment Status');
			list.addField('custpage_pickup_loc', 'text', 'Pick-up Location');
			list.addField('custpage_category', 'text', 'Category');
			list.addField('custpage_loose_gem', 'text', 'Loose Gem');			
			var html="<html>\
			<head>\
			<body>\
			<table>\
			<tbody>\
			<tr><td>\
			<img src='/images/icons/highlights/reskin/exclamationMark.svg' alt='Flagged: Exclamation Mark' class='list-highlight-icon' border='0' height='16' width='32'>\
			</td></tr>\
			</tbody></table></body></head>"			
			var chk_layaway='';			
			var filter=new Array();
			if(cate_item){
				filter.push(new nlobjSearchFilter('custitem20','item','anyof',cate_item));
			}
			if(location_pull){
				filter.push(new nlobjSearchFilter('custitem_pull_location','item','is',location_pull));
			}
			if(cate_item || location_pull || !cate_item || !location_pull){
				var searchresult = nlapiSearchRecord(null,'customsearch_inventory_pulls_dashboard',filter);
				 if(searchresult){
					var today=new Date();
					today=nlapiDateToString(today);
					today=today.split('/');
					var today_date=today[1];
					 total_rec_len=searchresult.length;	
					 var col = searchresult[0].getAllColumns();
					 var counter=1;
					 for (var t = 0; t < searchresult.length; t++){
						 var chk_layaway='F';						
						var exclamation='';
						var so_id=searchresult[t].getValue(col[1]);						
						var qty_SF=searchresult[t].getValue(col[8]);						
						var delivery_date=searchresult[t].getValue(col[16]);						
						var del_date_tommorrow=dd_tommorrow(delivery_date);
						var del_date_three=dd_tommorrow_three(delivery_date);	

						var layaway_chk= searchresult[t].getValue(col[24]);	
						var selected_specific_gem=searchresult[t].getValue(col[25]);
						var color_code='';						
							if(layaway_chk=='T'){
									chk_layaway='Yes1';
									if(qty_SF<1){
										exclamation=html;										
										if(!selected_specific_gem){
											color_code='#999999';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}
										else if(selected_specific_gem){
											color_code='#ff0000';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}	
									}
									else if(qty_SF>=1){										
										if(!selected_specific_gem){
											color_code='';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}
										else if(selected_specific_gem){
											color_code='#ff0000';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}	
									}									
								}
							else{
									var dd = new Date(delivery_date);
									var dd_tom = new Date(del_date_tommorrow);
									var dd_three=new Date(del_date_three);
									if(qty_SF<1 && ((dd<=dd_three && today_date==6) || dd<=dd_tom)){
										chk_layaway='Yes2';
										exclamation=html;										
										if(!selected_specific_gem){
											color_code='#999999';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}
										else if(selected_specific_gem){
											color_code='#ff0000';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}										
									}
									else if(qty_SF>=1 && ((dd<=dd_three && today_date==6) || dd<=dd_tom)){
										chk_layaway='Yes2';										
										if(!selected_specific_gem){
											color_code='';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}
										else if(selected_specific_gem){
											color_code='#ff0000';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}	
									}
									else if(qty_SF>=1 && ((dd>=dd_three && today_date!=6) || dd>=dd_tom)){										
										if(!selected_specific_gem){
											color_code='';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}
										else if(selected_specific_gem){
											color_code='#ff0000';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}										}
									else if(qty_SF<1 && ((dd>=dd_three && today_date!=6) || dd>=dd_tom)){										
										if(!selected_specific_gem){
											color_code='#999999';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}
										else if(selected_specific_gem){
											color_code='#ff0000';
											show_list=list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code);
										}	
									}									
								}						
						 counter++;
					}
				 }
			}			
			 rec_total.setDefaultValue(total_rec_len);
			 list.setLineItemValues(show_list);			 
			 response.writePage(form);
		}
		else if(request.getMethod()=="POST"){
			try{
				var sublist_count=request.getLineItemCount('custpage_default');
				for(var a=1;a<=sublist_count;a++){
					var pulled_chk=request.getLineItemValue("custpage_default","custpage_pulled",a);
					if(pulled_chk=='T'){
						var soid=request.getLineItemValue("custpage_default","custpage_sales_id",a);
						var itemId=request.getLineItemValue("custpage_default","custpage_item_id",a);
						var sales_obj=nlapiLoadRecord('salesorder',soid);
						var count=sales_obj.getLineItemCount('item');
						//nlapiLogExecution("debug","count is",count);
						for(var g=1;g<=count;g++){
							var item_id=sales_obj.getLineItemValue('item','item',g);
							//nlapiLogExecution("debug","item_id is",item_id);
							if(item_id==itemId){
								//nlapiLogExecution("debug","item_id 22 is",item_id);
								sales_obj.setLineItemValue('item','custcol_item_pulled',g,'T');
								nlapiSubmitRecord(sales_obj,true,true); 	}
						}
					}
				}
			}catch(e){
				nlapiLogExecution("debug","Error while submit",e.message);
			}
           var arrParams={pull_location:request.getParameter('custpage_pull_loc') };
			response.sendRedirect("SUITELET", "customscript_invt_pulls_dashboard", "customdeploy_invt_pulls_dashboard",false,arrParams);
		}
	}
	catch(ee){
		nlapiLogExecution("debug","error occuring in dashboard",ee.message);
	}
}




function dd_tommorrow(del_date){
	//var del_dd_tommorrow=nlapiStringToDate(del_date);
	var del_dd_tommorrow=new Date();
	del_dd_tommorrow=nlapiAddDays(del_dd_tommorrow,1);
	del_dd_tommorrow=nlapiDateToString(del_dd_tommorrow);
	return del_dd_tommorrow;
}

function dd_tommorrow_three(del_date){
	//var del_dd_tommorrow=nlapiStringToDate(del_date);
	var del_dd_tommorrow_three=new Date();
	del_dd_tommorrow_three=nlapiAddDays(del_dd_tommorrow_three,3);
	del_dd_tommorrow_three=nlapiDateToString(del_dd_tommorrow_three);
	return del_dd_tommorrow_three;
}

function list_show_color(show_list,searchresult,t,col,exclamation,chk_layaway,color_code){
	 var pickUp_loc= searchresult[t].getText(col[18]);
		if(pickUp_loc=='- None -'){
		pickUp_loc='';
		}
	show_list.push({
				"custpage_html" : exclamation,
				"custpage_layaway_highlight" :chk_layaway,
				"custpage_sales_id" : searchresult[t].getValue(col[1]),
				"custpage_sales_number" : searchresult[t].getValue(col[2]),
				"custpage_customer" : searchresult[t].getValue(col[3]),
				"custpage_item_id" : searchresult[t].getValue(col[4]),
				"custpage_item" : searchresult[t].getValue(col[5]),
				"custpage_description" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[6])+"</span>",
				"custpage_qty_sf" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[8])+"</span>",
				"custpage_on_hand" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[9])+"</span>",
				"custpage_available" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[10])+"</span>",
				"custpage_in_transit" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[11])+"</span>",
				"custpage_purchase_num" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[13])+"</span>",
				"custpage_date_received" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[14])+"</span>",
				"custpage_diamond_eta" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[15])+"</span>",
				"custpage_deli_date" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[16])+"</span>",
				"custpage_cs_status" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[17])+"</span>",
				"custpage_pickup_loc" : "<span style='color: "+color_code+" !important;'>"+pickUp_loc+"</span>",
				"custpage_category" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[19])+"</span>",
				"custpage_loose_gem" : "<span style='color: "+color_code+" !important;'>"+searchresult[t].getValue(col[20])+"</span>"							
			});	
return show_list;		
}


