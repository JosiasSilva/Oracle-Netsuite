function item_fall_dashboard_suitelet(request,response)
{
	try{
		var total_rec_len=0;
		if(request.getMethod()=="GET"){
			var pulled_items=[];
			var form = nlapiCreateForm("Inventory Pulls Dashboard");
			form.setScript('customscript_inventory_pulls_client');
			var field_html=form.addField('custpage_html','inlinehtml',null,null);			
			form.addSubmitButton("Update");
			form.addButton("custpage_refresh","Refresh","inventory_pulls_dashboard_client(type,name);");
			form.addTab('custpage_tab','Data');
			var default_filed=form.addField('custpage_default','inlinehtml',null,null,'custpage_tab');
			form.addField('custpage_hidden_field','textarea','HiddenField').setDisplayType("hidden");
			var rec_total=form.addField('custpage_total_rec','integer','Total Records').setDisplayType("inline");
			var html1="<html>\
			<head>\
			<link rel='stylesheet' type='text/css' href='https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css'>\
			</head>\
			<body>\
			<table id='example' border='.5' cellspacing='0' cellpadding='2' width='100%' BORDERCOLOR= '#d4e3e5'>\
			<thead>\
			<tr style='background-color: #d4e3e5;'>\
			<th>Pulled</th>\
			<th>Item </th>\
			<th style='display:none';>Item Id </th>\
			<th>Item Description</th>\
			<th>SalesOrder Number</th>\
			<th>PurchaseOrder Number</th>\
			<th style='display:none';>SalesOrder ID</th>\
			</tr>\
			</thead>\
			<tbody>";
			var searchresult = nlapiSearchRecord(null,'customsearch_item_falls_dashboard');
			 if(searchresult){
				 total_rec_len=searchresult.length;				 
				var col = searchresult[0].getAllColumns();
				for (var t = 0; t < searchresult.length; t++){
					var item_name=searchresult[t].getValue(col[0]);
					var item_id=searchresult[t].getValue(col[1]);
					var item_desc=searchresult[t].getValue(col[2]);
					var so_num=searchresult[t].getValue(col[3]);
					var so_id=searchresult[t].getValue(col[4]);
					var po_id=searchresult[t].getValue(col[5]);
					var po_text=searchresult[t].getText(col[5]);
					//var department='';
					var layaway_chk= check_SO_layaway(so_id);					
					if(layaway_chk=='T'){
						nlapiLogExecution("debug","test enter is");
						html1+="<tr>\
						<td style='background-color:#F9F585'><input type='checkbox' class='suiteletcheckbox' so-id='"+so_id+"' itemid='"+item_id+"' name='cbox' /></td>\
						<td style='background-color:#F9F585'>"+item_name+"</td>\
						<td style='background-color:#F9F585; display:none;' >"+item_id+"</td>\
						<td style='background-color:#F9F585'>"+item_desc+"</td>\
						<td style='background-color:#F9F585'><a href='/app/accounting/transactions/salesord.nl?id="+so_id+"&whence='>"+so_num+"</a></td>\
						<td style='background-color:#F9F585; display:none;'>"+so_id+"</td>\
						<td style='background-color:#F9F585;'><a href='/app/accounting/transactions/purchord.nl?id="+po_id+"&whence='>"+po_text+"</a></td>\
						</tr>";
					}
					else{
						nlapiLogExecution("debug","test enter 111 is");
						html1+="<tr>\
						<td><input type='checkbox' class='suiteletcheckbox' so-id='"+so_id+"' itemid='"+item_id+"' name='cbox' /></td>\
						<td>"+item_name+"</td>\
						<td style='display:none';>"+item_id+"</td>\
						<td>"+item_desc+"</td>\
						<td><a href='/app/accounting/transactions/salesord.nl?id="+so_id+"&whence='>"+so_num+"</a></td>\
						<td style='display:none';>"+so_id+"</td>\
						<td><a href='/app/accounting/transactions/purchord.nl?id="+po_id+"&whence='>"+po_text+"</a></td>\
						</tr>";
					}						
				}
			 } 
				rec_total.setDefaultValue(total_rec_len);
			var dd = '<style>input[type="search"]{ width: 75%; padding: 4px;font-size: 16px; margin-top:20px; margin-bottom:20px;}</style>';
			
			 var t = ' <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-1.12.4.js"></script>';
			t += '<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js"></script> ';
			t += ' <script> $(document).ready(function(){   $("#example").DataTable( {"paging": false, "ordering": false,  "info":  false  } );   $("#example_length").attr("style","display:none;");  $(".uir-field-wrapper").attr("style","margin-left: 65%;"); $("#example_filter").attr("style","margin-right: 80%; font-size: 14px; font-weight: bold; margin-top: -4%;");$("#example_length select").val("50"); $("#example_info").attr("style","margin-left: 87%; font-size: 13px; font-weight: bold;"); $("#example_paginate").attr("style","margin-right: 86%; margin-top: -1.48%; font-weight: bold;"); });';
			t += '$("body").delegate(".suiteletcheckbox","click",function(){  var g_so_id =""; var new_arr=new Array(); $(".suiteletcheckbox").each(function (index, obj) {   var len= $("[name=cbox]:checked").length ; if(len==0){  $("#custpage_hidden_field").val(""); return false; } if (this.checked === true) { var so_id=$(this).attr("so-id"); var id_item=$(this).attr("itemid"); new_arr.push({"SO_Id" :so_id, "Item_Id" : id_item }); $("#custpage_hidden_field").val(JSON.stringify(new_arr));}  }); });';
 //t += '$("body").delegate(".suiteletcheckbox","click",function(){ $(".suiteletcheckbox").each(function (index, obj) {  var g_soid=''; if (this.checked === true) { g_soid=$(this).attr("so-id"); $("#custpage_hidden_field").val(g_soid);} }); });';
 //t += '//$("body").delegate(".suiteletcheckbox","click",function(){ var ischecked= $(this).is(":checked"); if(!ischecked) alert("uncheckd " + $(this).val());});';
			t += '</script>';
			//else {$("#custpage_hidden_field").val("")+ $(this).val("");}
			
			html1+="</tbody></table>";
			html1+="<tr>\
			<td class='tinytext' align='center' style='padding-top:10px'  colspan='8'>\
			<img src='/images/icons/highlights/reskin/flag_yellow.svg' border='0' align='absmiddle'>\
			<span style='background-color:#F9F585;font-size: 15px;'>Layaway Item</span>\
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