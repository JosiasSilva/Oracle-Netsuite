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

function page_Init(){
	jQuery('input[name^="custpage_layaway_highlight"]').each(function(){
		var status_val = jQuery(this).val();
		//alert(status_val);
		if(status_val=='Yes1'){
			//alert("test1");
			jQuery(this).parent().parent().children().each(function(){
			jQuery(this).style('background-color','#ebf9d1','important');
		  });
		}  
		else if(status_val=='Yes2'){
			//alert("test2");
			jQuery(this).parent().parent().children().each(function(){
			jQuery(this).style('background-color','#d1f9eb','important');
		  });
		}  
		
	  });
	 jQuery('#custpage_default_splits').append('<td class="tinytext" align="center" style="padding-top:10px" colspan="21"><span style="background-color:#ebf9d1;color:#000000">Layaway</span>&nbsp;•&nbsp;<span style="background-color:#d1f9eb;color:#000000">DD Tommorrow</span>&nbsp;•&nbsp;<span style="background-color:#FFFFFF;color:#999999">0 in SF</span>&nbsp;•&nbsp;<img src="/images/icons/highlights/reskin/exclamationMark.svg" border="0" align="absmiddle"><span style="background-color:#FFFFFF;color:#000000">DD Tomorrow - 0 in SF</span></td>');
}

function dd_tommorrow(del_date){
	var del_dd_tommorrow=nlapiStringToDate(del_date);
	del_dd_tommorrow=nlapiAddDays(del_dd_tommorrow,1);
	del_dd_tommorrow=nlapiDateToString(del_dd_tommorrow);
	return del_dd_tommorrow;
}

function Print_page(type,name){	
	if(name=='custpage_print'){
		var data_arr=[];
		var sublist_count=nlapiGetLineItemCount('custpage_default');
			//alert(sublist_count);
		for(var a=1;a<=sublist_count;a++){
			var pulled_chk=nlapiGetLineItemValue("custpage_default","custpage_pulled",a);
			var available=nlapiGetLineItemValue("custpage_default","custpage_available",a);
			var pickup_loc=nlapiGetLineItemValue("custpage_default","custpage_pickup_loc",a);
			var soid=nlapiGetLineItemValue("custpage_default","custpage_sales_id",a);
			var ItemId=nlapiGetLineItemValue("custpage_default","custpage_item_id",a);
			var description=nlapiGetLineItemValue("custpage_default","custpage_description",a);
			if(description.indexOf('<')!=-1){
				description=description.split('>');
				description=description[1];
				description=description.split('<');
				description=description[0];
				//alert(description +"11");
			}else{
				description;
				//alert(description +"12");
			}
          	if(description.indexOf('&')!=-1){
					description=description.replace('&','and');
				}
			var sf_qty=nlapiGetLineItemValue("custpage_default","custpage_qty_sf",a);
			if(sf_qty.indexOf('<')!=-1){
				//alert(sf_qty +"11");
				sf_qty=sf_qty.split('>');
				sf_qty=sf_qty[1];
				sf_qty=sf_qty.split('<');
				sf_qty=sf_qty[0];
			}else{
				sf_qty;
				//alert(sf_qty +"12");
			}
			
			var so_name=nlapiLookupField('salesorder',soid,'tranid'); //json_field[a-1].SO_Doc;				
			var Item_name=nlapiLookupField('inventoryitem',ItemId,'itemid'); // json_field[a-1].Item_Nme;
          if(Item_name==null){
					Item_name=nlapiLookupField('assemblyitem',ItemId,'itemid');
				}
			if(sf_qty>0){				
				data_arr.push({
					"SalesOrder": so_name,
					"Item_Nam": Item_name,
					"Description": description,
					"SF_Qty": sf_qty
				});
			}/*else if(pulled_chk=='T' && sf_qty<=0){
				alert("Please deselect the record where available is 0 on San Franscisco");
				break;
			}*/
		}
		if(data_arr.length>0){				
			var json_data=JSON.stringify(data_arr);	
//alert(json_data);			
			var createPDFURL = nlapiResolveURL('SUITELET', 'customscript_inventory_pulls_pdf', 'customdeploy_inventory_pulls_pdf', false);
			 createPDFURL += '&json_data='+json_data;			
			  window.open(createPDFURL);
		}			
	}return true;
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


(function($) {    
  if ($.fn.style) {
    return;
  }

  // Escape regex chars with \
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority != '') {
        // Add priority manually
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                              '(\\s*;)?', 'gmi');
        this.cssText =
          this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                            'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
      return this;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
      if (typeof value != 'undefined') {
        // Set style property
        priority = typeof priority != 'undefined' ? priority : '';
        style.setProperty(styleName, value, priority);
        return this;
      } else {
        // Get style property
        return style.getPropertyValue(styleName);
      }
    } else {
      // Get CSSStyleDeclaration
      return style;
    }
  };
})(jQuery);