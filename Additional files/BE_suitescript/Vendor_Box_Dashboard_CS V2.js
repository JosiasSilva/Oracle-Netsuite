nlapiLogExecution("audit","FLOStart",new Date().getTime());
var data_send_obj=new Array();
var temp_data_obj=new Array();
var po_id_obj=new Array();
var insurence_amount=new Array();
var arrErrorDet=[];

function VBD_FC(type,name,linenum)
{
	nlapiLogExecution('Debug', 'Entering VBD_FC', 'type: ' +type);
  if(type=="custpage_list" && (name=="custpage_list_date_sent_from_sf" || name=="custpage_list_status" || name=="custpage_list_notes" || name=="custpage_list_gem_notif" || name=="custpage_list_insurance_value"))
  {
    nlapiSetLineItemValue("custpage_list","custpage_list_changed",linenum,"T");
  }
  else if(name=="custpage_vendor" || name=='custpage_status' || name=='custpage_item')
  {
    var url = nlapiResolveURL("SUITELET","customscript_vendor_box_new","customdeploy_vendor_box_new");
    url += "&custpage_vendor=" + nlapiGetFieldValue("custpage_vendor")+"&custpage_status="+nlapiGetFieldValue("custpage_status")+"&custpage_item="+nlapiGetFieldValue("custpage_item");

    window.onbeforeunload = null;
    window.location.href = url;
  }
  else if(name=='custpage_vendor_box_item_name')
  {
    var url=nlapiResolveURL ('suitelet','customscript_vendor_box_new','customdeploy_vendor_box_new' );
    var get_item_id=nlapiGetCurrentLineItemValue ( 'custpage_vendor_list' , 'custpage_vendor_box_item_name' );
    var responseData = nlapiRequestURL(url,{get_price:get_item_id },null, "GET");       
    var get_amount=responseData.getBody().toString();
    if(get_amount){ get_amount=(parseFloat(get_amount)*.8).toFixed(2);}else { get_amount=0;}
    nlapiSetCurrentLineItemValue ( 'custpage_vendor_list' , 'custpage_vendor_box_insurance',get_amount );

  }
  else if(name=='custpage_select_label')
  {
    var i=0;
    for(var a=1;a<=nlapiGetLineItemCount('custpage_lable_queue');a++)
    {
      if(nlapiGetLineItemValue('custpage_lable_queue','custpage_select_label',a)=='T')
      {
        i++;
      }
    }
    nlapiSetFieldValue('custpage_selected_lable',i,true,true);
  }
  else if(name=='custpage_select_packing')
  {
    var i=0;
    for(var a=1;a<=nlapiGetLineItemCount('custpage_packing_slip');a++)
    {
      if(nlapiGetLineItemValue('custpage_packing_slip','custpage_select_packing',a)=='T')
      {
        i++;
      }
    }
    nlapiSetFieldValue('custpage_selected_packing',i,true,true);
  }


}

function VBD_Print()
{
  var url = nlapiResolveURL("SUITELET","customscript_vbd_print","customdeploy_vbd_print");

  window.open(url,'printWindow','location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=yes,height=600,width=800');
}

function VBD_PI()
{
  jQuery('input[name^="inpt_custpage_list_status"]').each(function(){
    if(jQuery(this).val()=="Progress")
    {
      jQuery(this).parent().parent().parent().parent().children().each(function(){
        jQuery(this).style('background-color','#FFD78E','important');
      });
    }
    else if(jQuery(this).val()=="Completed")
    {
      jQuery(this).parent().parent().parent().parent().children().each(function(){
        jQuery(this).style('background-color','#76AF76','important');
      });
    }
    else if(jQuery(this).val()=="Not Started")
    {
      jQuery(this).parent().parent().parent().parent().children().each(function(){
        jQuery(this).style('background-color','#FF8E8E','important');
      });
    }
  });

  jQuery('input[name^="custpage_list_so_status"]').each(function(){
    var status = jQuery(this).val();

    if(status ==  "closed")
    {
      jQuery(this).parent().parent().children().each(function(){
        jQuery(this).style('background-color','#f9a47a','important');
      });
    }
  });

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

function check_value_insert(type,user)
{
  if(type=='1')
  {

    check_value_insert_create(user);
  }
  else if(type=='2')
  {
    var new_item_add=[];
    for(var a=1;a<=nlapiGetLineItemCount('custpage_vendor_list');a++)
    {
      if(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_created',a)=='F')
      {
        new_item_add.push(nlapiGetLineItemText('custpage_vendor_list','custpage_vendor_box_item_name',a));
      }
    }
    check_value_insert_update(user);
  }
}




function mark_all_packing(val)
{
  custpage_packing_slipMarkAll(val);
  if(val)
  {
    nlapiSetFieldValue('custpage_selected_packing',nlapiGetLineItemCount('custpage_packing_slip'),true,true);
  }
  else
  {
    nlapiSetFieldValue('custpage_selected_packing','0',true,true);
  }

}
function mark_all_label(val)
{

  custpage_lable_queueMarkAll(val);
  if(val)
  {

    nlapiSetFieldValue('custpage_selected_lable',nlapiGetLineItemCount('custpage_lable_queue'),true,true);
  }
  else
  {
    nlapiSetFieldValue('custpage_selected_lable','0',true,true);
  }
}

/* NS-1278 - 07/25/2018 Start */

function onclick_bulkupdate()
{
	window.onbeforeunload = null;
	// var bulkupdate_url = nlapiResolveURL('SUITELET', '<suitelet_id>', '<suitelet_id>');
	window.open('/app/site/hosting/scriptlet.nl?script=1866&deploy=1'+'&open_popup=T', 'Bulk Update', 'height=500,width=500,left=10,top=10,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=no');
}

function bu_po_lineitems()
{
	var data_update=new Array();
	data_send_obj=new Array();
	temp_data_obj=new Array();
	var status = nlapiGetFieldValue('custpage_bulkupdate_status');
	var lineitem_count = nlapiGetLineItemCount('custpage_bulkupdate_po_sublist');
	if(status)
	{
		for(var c = 1; c <= lineitem_count; c++)
		{
			var lineitem = nlapiGetLineItemValue('custpage_bulkupdate_po_sublist', 'custpage_bulkupdate_po_lineitem', c);
			if(lineitem)
			{
				temp_data_obj.push('');
				data_update.push({
				type:'bulk_update',
				status: status,
				tranid: lineitem
				});
			}
		}
		if(temp_data_obj.length > 0)
		{
			document.getElementById("div__body").innerHTML = "Please wait...";
			ajax_bulk_update(data_update,'custpage_bulkupdate_po_sublist');
		}
	}
}

function validate_line_bulkupdate_po(type)
{
	nlapiLogExecution('Debug', 'Entered validate_bulkupdate_line_po');
	//if(type == 'custpage_bulkupdate_po_sublist')
	{
		var lineitem = nlapiGetCurrentLineItemValue(type, 'custpage_bulkupdate_po_lineitem');
		var searchResult;
		if(lineitem.length != 0)
		{
			searchResult = nlapiSearchRecord('purchaseorder', null, [new nlobjSearchFilter('tranid', null, 'is', lineitem), new nlobjSearchFilter('mainline', null, 'is', 'T')]);
		}
		if(searchResult && searchResult != null && searchResult.length > 0)
		{
			return true;
		}
		else
		{
          alert('Enter a Valid PO Document Number');
			return false;
		}
	}
}


function ajax_bulk_update(data_update,sublist)
{
	for(var c=0;c<data_update.length;c++)
	{
		var send_data=JSON.stringify(data_update[c]);
		restlet_call(send_data,sublist);
	}
}



function restlet_call(send_data, sublist) {
  var restUrl = nlapiResolveURL('RESTLET', 'customscript_vendor_box_created', 'customdeploy_vendor_box_created');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: send_data,
    dataType: "json",
    success: function(returned_value) {
      data_send_obj.push(''); 
	  var dataObj=JSON.parse(send_data);
	  if(returned_value=='success')
	  {
		  // alert('success');
	  }
	  else
	  {
		   arrErrorDet.push(dataObj.tranid);
		   // alert('fail');
	  }
      
      if (data_send_obj.length == temp_data_obj.length) {
		  if(arrErrorDet.length == 0)
            {
              window.opener.location.reload();
			  window.onbeforeunload = null;
              window.close();
            }
		  else if(arrErrorDet.length>0)
		  {
			var str='The following records could do not be updated because they do not meet the required criteria:<br/>';
			for(var icount=0;icount<arrErrorDet.length;icount++)
			{
				str+=(icount+1)+'. '+arrErrorDet[icount]+'<br/>';
			}
			document.getElementById("div__body").innerHTML=str;
            window.opener.location.reload();
		  }
		  
		}
        //var url_hit = '/app/site/hosting/scriptlet.nl?script=2318&deploy=1&r=T&machine='+sublist;
        // alert(url_hit);
        //document.getElementById('server_commands').src = url_hit;
      }

  });
}


/* NS-1278 - 07/25/2018 End */