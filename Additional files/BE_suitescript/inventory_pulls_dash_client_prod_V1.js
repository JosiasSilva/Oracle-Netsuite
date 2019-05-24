function inventory_pulls_dashboard_client(type,name)
{
	if(name=='custpage_refresh'){
		var url = nlapiResolveURL("SUITELET","customscript_invt_pulls_dashboard","customdeploy_invt_pulls_dashboard");		
		window.onbeforeunload = null;
		window.location.href = url;
	}	
	if(name=='custpage_item_cat' || name=='custpage_pull_loc'){
		var item_category=nlapiGetFieldValue('custpage_item_cat');
		var pull_location=nlapiGetFieldValue('custpage_pull_loc');
		//alert(pull_location);
		if(item_category == "" || item_category == null ){
			item_category = "";
		}
		if(pull_location == "" || pull_location == null )	{
			pull_location = "";
		}
		var url =  'https://'+window.location.host+'/app/site/hosting/scriptlet.nl?script=2000&deploy=1&item_category='+item_category+'&pull_location='+pull_location;
		window.onbeforeunload = null;
		window.location.href = url;
		return true;
	}	
}

function Print_page(type,name){
	//alert(name);
	if(name=='custpage_print'){
		var field_details=nlapiGetFieldValue('custpage_hidden_field');
		var data_arr=[];		
		if(field_details){
				//alert(field_details);
			var json_field=JSON.parse(field_details);
			var len=json_field.length;			
			for(var a=1;a<=len;a++){
				var so_id=json_field[a-1].SO_Id;				
				var Item_id=json_field[a-1].Item_Id;
				var so_name=nlapiLookupField('salesorder',so_id,'tranid'); //json_field[a-1].SO_Doc;				
				var Item_name= nlapiLookupField('inventoryitem',Item_id,'itemid'); //json_field[a-1].Item_Nme; 
				if(Item_name==null){
					Item_name=nlapiLookupField('assemblyitem',Item_id,'itemid');
				}
				var item_desc=json_field[a-1].Ite_Desc;             
				if(item_desc.indexOf('#')!=-1){
					item_desc=item_desc.replace('#','');                   
				}               
				data_arr.push({
					"SalesOrder": so_name,
					"Item_Nam": Item_name,
					"Description": item_desc,
					"SF_Qty": json_field[a-1].SF_quantity
				});			
			}
		
			var json_data=JSON.stringify(data_arr);	
//alert(json_data);				
			var createPDFURL = nlapiResolveURL('SUITELET', 'customscript_inventory_pulls_pdf', 'customdeploy_inventory_pulls_pdf', false);
			 createPDFURL += '&json_data='+json_data;			
			  window.open(createPDFURL);
		}		
	}
	return true;
}

function markall(type,name){
	if(name=='custpage_markall'){
		$(".suiteletcheckbox").prop("checked", true);
		var g_so_id =""; 
		 var new_arr=new Array();
			 $(".suiteletcheckbox").each(function (index, obj) {   
			 var len= $("[name=cbox]:checked").length ;
			 if(len==0){ 
				 $("#custpage_hidden_field").val("");
				 return false; 
				} 
			 if (this.checked === true) {
					 var so_id=$(this).attr("so-id");
					 var id_item=$(this).attr("itemid");
					 var doc_so=$(this).attr("so_doc");
					 var name_item=$(this).attr("Item_doc");
					 var desc_item=$(this).attr("desc");
					 var sfQty_item=$(this).attr("sf_qty");
					 new_arr.push({"SO_Id" :so_id, "Item_Id" : id_item, "SO_Doc" :doc_so, "Item_Nme" :name_item, "Ite_Desc" :desc_item, "SF_quantity" :sfQty_item   });
					 $("#custpage_hidden_field").val(JSON.stringify(new_arr));
					} 
			 }); 
	}
}

function Unmarkall(type,name){
	if(name=='custpage_unmarkall'){
		$(".suiteletcheckbox").prop("checked", false);
		 $("#custpage_hidden_field").val(JSON.stringify());
	}
}