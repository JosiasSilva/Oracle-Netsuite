/*
Script Author : 	Sandeep Kumar ([sandeep.kumar@inoday.com](mailto:sandeep.kumar@inoday.com))
Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
Script Type : 		Suitescript (Client Script)
Script Name :		PO Receive Dashboard - Client.js
Comments :		Client Script for PO Receive Dashboard
SS URL :		
Script URL:		

Modification Details:
Modified On:		06/27/2018
Modified By:		Nikhil Bhutani
Task Related:		NS-1240
Script Name :		PO Receive Dashboard - Client_V1.js
Sandbox SS URL :        https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2116
production SS URL:      https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2117
Description:		Adding Delivery Date Column and highlighting the rows based on certain conditions

*/

var data_send_obj = new Array();
var temp_data_obj = new Array();

function ReceivePO() {

  var data_update = [];
  var flag = 0;
  var validate = 1;
  data_send_obj = new Array();
  temp_data_obj = new Array();
  for (var z = 1; z <= nlapiGetLineItemCount('custpage_pos'); z++) {
    var custpage_receive_chk = nlapiGetLineItemValue('custpage_pos', 'custpage_receive_chk', z);
    if (custpage_receive_chk == 'T') {

    
      var custpage_po_id = nlapiGetLineItemValue('custpage_pos', 'custpage_po_id', z);
       var custpage_dropship = nlapiGetLineItemValue('custpage_pos', 'custpage_dropship_new', z);
      
      flag = 1;
      data_update.push({
        custpage_po_id: custpage_po_id,
        custpage_dropship:custpage_dropship
      });
	  temp_data_obj.push('');
    }
  }

  if (flag) {
   // document.getElementById('custpage_items_splits').innerHTML = '<center style=background-color:white; border-color:white><div><img src=/core/media/media.nl?id=20629559&c=666639&h=293fd0cf75f11ad4a6a9&whence= /></div><center>';
   document.getElementById('custpage_pos_splits').innerHTML =  '<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Loading, please wait...</td></tr></table></div><center></td></tr>';
    Call_Ajax_data_update(data_update, 'custpage_pos');
  } else {
    {
      alert('Please select at least one record');
    }

  }
}

function page_Init(){
	jQuery('input[id^="inpt_custpage_dropship_new"]').each(function(){
		var dropship = jQuery(this).val();
		
		if(dropship=='Yes'){
			//alert("test1");
         // alert(dropship);
			jQuery(this).parent().parent().parent().parent().children().each(function(){
			jQuery(this).style('background-color','#ffe0e3','important');
		  });
		}  
	  });
	  // code added by Bhutani for NS-1240 on 27/6/18
   jQuery('input[name^="custpage_delivery_date_flag"]').each(function(){
		var deliverydate_flag = jQuery(this).val();
		//alert(deliverydate_flag);
		if(deliverydate_flag=='1'){
			jQuery(this).parent().parent().children().each(function(){
			jQuery(this).style('background-color','#ffeead','important');
		  });
		}
	  });
	  	  // end code added by Bhutani for NS-1240 on 27/6/18
	
}


function Call_Ajax_data_update(data_update, sublist) {

  for (var c = 0; c < data_update.length; c++) {

    var send_data = JSON.stringify(data_update[c]);
    loadDoc(send_data, sublist);
   
  }
}

function loadDoc(send_data, sublist) {
   var restUrl = nlapiResolveURL('RESTLET', 'customscript_restlet_po_rec_dash', 'customdeploy_restlet_po_rec_dash');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl, // url: '/app/site/hosting/scriptlet.nl?script=2048&deploy=1&data_save=T',
    data: send_data, //    
    dataType: "text",
    success: function(msgesem) {
      data_send_obj.push('');
      document.getElementById('custpage_pos_splits').innerHTML='<tr><td><center style=background-color:white; border-color:white ><div><table width=400 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Updating Records '+data_send_obj.length+' out of '+temp_data_obj.length+'</td></tr></table></div><center></td></tr>';
      if (data_send_obj.length == temp_data_obj.length) {
        var flag = true;
        document.getElementById('custpage_is_receive').value='receive';
        var url_hit = '/app/site/hosting/scriptlet.nl?script=2100&deploy=1&r=T&machine=custpage_pos&scheduled=Yes';
        document.getElementById('server_commands').src = url_hit;
      }
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
