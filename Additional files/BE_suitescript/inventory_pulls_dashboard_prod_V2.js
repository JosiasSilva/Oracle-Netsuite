/**
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com/rahul.panchal186@gmail.com)
 * Author Desig. : Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Suitelet)
 * Script Name   : 
 * Created Date  : August 22, 2017
 * Last Modified Date : September 6, 2017
 * Comments : 
 * SS URL : 
 * Script URL: https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2043&whence=  (Sandbox)
  * Script URL: https://system.netsuite.com/app/common/scripting/script.nl?id=2001&whence=  (Production)
 */


function item_fall_dashboard_suitelet(request,response)
{
	try{
		var total_rec_len=0;
		if(request.getMethod()=="GET"){
			var pulled_items=[];
			var form = nlapiCreateForm("Inventory Pulls Dashboard");
			var cate_item = request.getParameter('item_category');
			var location_pull = request.getParameter('pull_location');
			form.setScript('customscript_inventory_pulls_client');
			var item_category_field=form.addField('custpage_item_cat','select','Item Category','customlist13');
			item_category_field.setLayoutType('normal', 'startcol');
			item_category_field.setDisplaySize( 400, 20);
			item_category_field.setDefaultValue(cate_item);
			var pull_location_field=form.addField('custpage_pull_loc','select','Pull Location','customlist334');
			pull_location_field.setLayoutType('normal', 'startcol');
			pull_location_field.setDefaultValue(location_pull);
			var field_html=form.addField('custpage_html','inlinehtml',null,null);			
			form.addSubmitButton("Update");
			form.addButton("custpage_refresh","Refresh","inventory_pulls_dashboard_client(type,name);");
			form.addButton("custpage_print","Print",'Print_page(type,name);');
			form.addButton("custpage_markall","Mark All",'markall(type,name);');
			form.addButton("custpage_unmarkall","Unmark All",'Unmarkall(type,name);');
			form.addTab('custpage_tab','Data');
			var default_filed=form.addField('custpage_default','inlinehtml',null,null,'custpage_tab');
			form.addField('custpage_hidden_field','textarea','HiddenField').setDisplayType("hidden");			
			var rec_total=form.addField('custpage_total_rec','integer','Total Records').setDisplayType("inline");
			
			var html1="<html>\
			<head>\
			<link rel='stylesheet' type='text/css' href='https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css'>\
			</head>\
			<body>\
			<table id='example' border='1' cellspacing='0' cellpadding='2' width='100%' BORDERCOLOR= '#d4e3e5'>\
			<thead>\
			<tr style='background-color: #d4e3e5;'>\
			<th>Pulled</th>\
			<th style='display:none';>SalesOrder ID</th>\
			<th>SalesOrder Number</th>\
			<th style='display:none';>Item Id </th>\
			<th>Item </th>\
			<th>Item Description</th>\
			<th>Qty in SF</th>\
			<th>On Hand</th>\
			<th>Available</th>\
			<th>In-Transit</th>\
			<th>PurchaseOrder Number</th>\
			<th>Date Received</th>\
			<th>Diamond ETA</th>\
			<th>Delivery Date</th>\
			<th>CS Fulfillment Status</th>\
			<th>Pick-up Location</th>\
			<th>Category</th>\
			<th>Loose Gem</th>\
			</tr>\
			</thead>\
			<tbody>";
			var filter=new Array();
			if(cate_item){
				filter.push(new nlobjSearchFilter('custitem20','item','anyof',cate_item));
			}
			if(location_pull){
				filter.push(new nlobjSearchFilter('custbody_pickup_location',null,'is',location_pull));
			}
			if(cate_item || location_pull || !cate_item || !location_pull){
				var searchresult = nlapiSearchRecord(null,'customsearch_inventory_pulls_dashboard',filter);
				 if(searchresult){
					 total_rec_len=searchresult.length;				 
					var col = searchresult[0].getAllColumns();
					for (var t = 0; t < searchresult.length; t++){
						var so_id=searchresult[t].getValue(col[1]);
						var so_num=searchresult[t].getValue(col[2]);
						var item_id=searchresult[t].getValue(col[3]);
						var item_name=searchresult[t].getValue(col[4]);					
						var item_desc=searchresult[t].getValue(col[5]);
						var qty_SF=searchresult[t].getValue(col[7]);
						var on_hand=searchresult[t].getValue(col[8]);
						var available=searchresult[t].getValue(col[9]);
						var in_transit=searchresult[t].getValue(col[10]);					
						var po_id=searchresult[t].getValue(col[11]);
						var po_text=searchresult[t].getValue(col[12]);
						var date_received=searchresult[t].getValue(col[13]);
						var diamond_ETA=searchresult[t].getValue(col[14]);
						var delivery_date=searchresult[t].getValue(col[15]);
						var cs_fulfill=searchresult[t].getValue(col[16]);
						var pickUp_loc=searchresult[t].getText(col[17]);
						if(pickUp_loc=='- None -'){
							 pickUp_loc='';
						  }
						var category=searchresult[t].getValue(col[18]);
						var loose_gem=searchresult[t].getValue(col[19]);
						//var department='';
						var layaway_chk= check_SO_layaway(so_id);					
						if(layaway_chk=='T'){
							nlapiLogExecution("debug","test enter is");
							html1+="<tr>\
							<td style='background-color:#ebf9d1'><input type='checkbox' class='suiteletcheckbox' so-id='"+so_id+"' itemid='"+item_id+"' so_doc='"+so_num+"' Item_doc='"+item_name+"' desc='"+item_desc+"' sf_qty='"+qty_SF+"' name='cbox' /></td>\
							<td style='background-color:#ebf9d1; display:none;'>"+so_id+"</td>\
							<td style='background-color:#ebf9d1'><a href='/app/accounting/transactions/salesord.nl?id="+so_id+"&whence=' target='_blank'>"+so_num+"</a></td>\
							<td style='background-color:#ebf9d1; display:none;' >"+item_id+"</td>\
							<td style='background-color:#ebf9d1'>"+item_name+"</td>\
							<td style='background-color:#ebf9d1'>"+item_desc+"</td>\
							<td style='background-color:#ebf9d1'>"+qty_SF+"</td>\
							<td style='background-color:#ebf9d1'>"+on_hand+"</td>\
							<td style='background-color:#ebf9d1'>"+available+"</td>\
							<td style='background-color:#ebf9d1'>"+in_transit+"</td>\
							<td style='background-color:#ebf9d1;'><a href='/app/accounting/transactions/purchord.nl?id="+po_id+"&whence=' target='_blank'>"+po_text+"</a></td>\
							<td style='background-color:#ebf9d1'>"+date_received+"</td>\
							<td style='background-color:#ebf9d1'>"+diamond_ETA+"</td>\
							<td style='background-color:#ebf9d1'>"+delivery_date+"</td>\
							<td style='background-color:#ebf9d1'>"+cs_fulfill+"</td>\
							<td style='background-color:#ebf9d1'>"+pickUp_loc+"</td>\
							<td style='background-color:#ebf9d1'>"+category+"</td>\
							<td style='background-color:#ebf9d1'>"+loose_gem+"</td>\
							</tr>";
						}
						else{
							nlapiLogExecution("debug","test enter 111 is");
							html1+="<tr>\
							<td style='background-color:#d1f9eb'><input type='checkbox' class='suiteletcheckbox' so-id='"+so_id+"' itemid='"+item_id+"' so_doc='"+so_num+"' Item_doc='"+item_name+"' desc='"+item_desc+"' sf_qty='"+qty_SF+"' name='cbox' /></td>\
							<td style='display:none';>"+so_id+"</td>\
							<td style='background-color:#d1f9eb'><a href='/app/accounting/transactions/salesord.nl?id="+so_id+"&whence=' target='_blank'>"+so_num+" </a></td>\
							<td style='display:none';>"+item_id+"</td>\
							<td style='background-color:#d1f9eb'>"+item_name+"</td>\
							<td style='background-color:#d1f9eb'>"+item_desc+"</td>\
							<td style='background-color:#d1f9eb'>"+qty_SF+"</td>\
							<td style='background-color:#d1f9eb'>"+on_hand+"</td>\
							<td style='background-color:#d1f9eb'>"+available+"</td>\
							<td style='background-color:#d1f9eb'>"+in_transit+"</td>\
							<td style='background-color:#d1f9eb'><a href='/app/accounting/transactions/purchord.nl?id="+po_id+"&whence=' target='_blank'>"+po_text+"</a></td>\
							<td style='background-color:#d1f9eb'>"+date_received+"</td>\
							<td style='background-color:#d1f9eb'>"+diamond_ETA+"</td>\
							<td style='background-color:#d1f9eb'>"+delivery_date+"</td>\
							<td style='background-color:#d1f9eb'>"+cs_fulfill+"</td>\
							<td style='background-color:#d1f9eb'>"+pickUp_loc+"</td>\
							<td style='background-color:#d1f9eb'>"+category+"</td>\
							<td style='background-color:#d1f9eb'>"+loose_gem+"</td>\
							</tr>";
						}						
					}
				 }
			}
			 
				rec_total.setDefaultValue(total_rec_len);
			var dd = '<style>input[type="search"]{ width: 75%; padding: 4px;font-size: 16px; margin-top:20px; margin-bottom:20px;}</style>';
			
			 var t = ' <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-1.12.4.js"></script>';
			t += '<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js"></script> ';
			t += ' <script> $(document).ready(function(){   $("#example").DataTable( {"paging": false, "ordering": false,  "info":  false  } );   $("#example_length").attr("style","display:none;");  $(".uir-field-wrapper").attr("style","margin-left: 65%; margin-top: 3%;"); $(".uir-field-wrapper").attr("style","margin-left: 7%; margin-top: 4%;");  $("#example_filter").attr("style","margin-right: 80%; font-size: 14px; font-weight: bold; margin-top: -4%;");$("#example_length select").val("50"); $("#example_info").attr("style","margin-left: 87%; font-size: 13px; font-weight: bold;"); $("#example_paginate").attr("style","margin-right: 86%; margin-top: -1.48%; font-weight: bold;"); });';
			t += '$("body").delegate(".suiteletcheckbox","click",function(){  var g_so_id =""; var new_arr=new Array(); $(".suiteletcheckbox").each(function (index, obj) {   var len= $("[name=cbox]:checked").length ; if(len==0){  $("#custpage_hidden_field").val(""); return false; } if (this.checked === true) { var so_id=$(this).attr("so-id"); var id_item=$(this).attr("itemid"); var doc_so=$(this).attr("so_doc"); var name_item=$(this).attr("Item_doc"); var desc_item=$(this).attr("desc"); var sfQty_item=$(this).attr("sf_qty"); new_arr.push({"SO_Id" :so_id, "Item_Id" : id_item, "SO_Doc" :doc_so, "Item_Nme" :name_item, "Ite_Desc" :desc_item, "SF_quantity" :sfQty_item   }); $("#custpage_hidden_field").val(JSON.stringify(new_arr));}  }); });';
			//t += '$("#MarkAll").click(function(){ $(".suiteletcheckbox").prop("checked", true); });';
			//t += '$("#UnMarkAll").click(function(){ $(".suiteletcheckbox").prop("checked", false); });';
 //t += '$("body").delegate(".suiteletcheckbox","click",function(){ $(".suiteletcheckbox").each(function (index, obj) {  var g_soid=''; if (this.checked === true) { g_soid=$(this).attr("so-id"); $("#custpage_hidden_field").val(g_soid);} }); });';
 //t += '//$("body").delegate(".suiteletcheckbox","click",function(){ var ischecked= $(this).is(":checked"); if(!ischecked) alert("uncheckd " + $(this).val());});';
			t += '</script>';
			//else {$("#custpage_hidden_field").val("")+ $(this).val("");}
			
			html1+="</tbody></table>";
			html1+="<tr>\
			<td class='tinytext' align='center' style='padding-top:10px'  colspan='8'>\
			<img src='/images/icons/highlights/reskin/flag_green.svg' border='0' align='absmiddle'>\
			<span style='background-color:#ebf9d1;font-size: 15px;'>Layaway Item</span>\
			<img src='/images/icons/highlights/reskin/flag_blue.svg' border='0' align='absmiddle'>\
			<span style='background-color:#d1f9eb;font-size: 15px;'>DD Tommorrow </span>\
			</td>\
			</tr>\
			</body>"+t+" " +dd+"</html>";
			default_filed.setDefaultValue(html1);			 
			response.writePage(form);
		}
		else if(request.getMethod()=="POST"){
			try{
				var field_data=request.getParameter('custpage_hidden_field');
				nlapiLogExecution("debug","field_data is",field_data);
				if(field_data!=''){
					var data_field=JSON.parse(field_data);
					var len=data_field.length;
					nlapiLogExecution("debug","len is",len);
					for(var d=0;d<data_field.length;d++){
						var sales_id=data_field[d].SO_Id;
						nlapiLogExecution("debug","sales_id is",sales_id);
						var invt_itemId=data_field[d].Item_Id;
						nlapiLogExecution("debug","invt_itemId is",invt_itemId);
						var sales_obj=nlapiLoadRecord('salesorder',sales_id);
						var count=sales_obj.getLineItemCount('item');
						nlapiLogExecution("debug","count is",count);
						for(var a=1;a<=count;a++){
							var item_id=sales_obj.getLineItemValue('item','item',a);
							nlapiLogExecution("debug","item_id is",item_id);
							if(item_id==invt_itemId){
								nlapiLogExecution("debug","item_id 22 is",item_id);
								sales_obj.setLineItemValue('item','custcol_item_pulled',a,'T');
								nlapiSubmitRecord(sales_obj,true,true);	}
						} 
					}
				}				
			}
			catch(ee){
				nlapiLogExecution("debug","Error Occuring while Post",ee.message);
			}
			response.sendRedirect("SUITELET", "customscript_invt_pulls_dashboard", "customdeploy_invt_pulls_dashboard",false,null);
		}
		
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error Occuring in Item Falls Dashboard",ex.message);
	}
}

function check_SO_layaway(so_id)
{
	var chk_layaway='';
	var filter = [];
		var column = [];	
		filter.push(new nlobjSearchFilter('internalid', null, 'is', so_id));		
		filter.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));      
		column.push(new nlobjSearchColumn('custbody111'));
		var SO_Result = nlapiSearchRecord('salesorder',null,filter,column);
		if(SO_Result){
		  var col = SO_Result[0].getAllColumns();
		   chk_layaway=SO_Result[0].getValue(col[0]);
		}
	return chk_layaway;
}