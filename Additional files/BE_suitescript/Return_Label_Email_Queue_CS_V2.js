/**
 * Script Author : Priti Tiwari (priti.tiwari@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Client Script)
 * Script Name   : Return Label Email Queue Client Script
 * Created Date  : July 28, 2018
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL:https://system.netsuite.com/app/common/scripting/script.nl?id=1183&whence=
 */

nlapiLogExecution("audit","FLOStart",new Date().getTime());
var FEDEX_RETURN_TAG_PRODUCTION = "26051782";
var FEDEX_RETURN_TAG_SANDBOX = "26051782";
function PageInit()
{
  jQuery('input[name^="custpage_colour_flag"]').each(function(){
    //alert("FieldValue" + )
    if(jQuery(this).val()=="1")
    {
      jQuery(this).parent().parent().children().each(function(){
        jQuery(this).style('background-color','#FFFF00  ','important');
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
function Return_Label_Email_Queue_CS_SR()
{
  try
  {
    var alertMsg = "";

    for(var x=0; x < nlapiGetLineItemCount("custpage_orders"); x++)
    {
      if(nlapiGetLineItemValue("custpage_orders","custpage_order_rsl_status",x+1)=="5" && (nlapiGetLineItemValue("custpage_orders","custpage_order_return_insurance",x+1)==null || nlapiGetLineItemValue("custpage_orders","custpage_order_return_insurance",x+1)==""))
      {
        alertMsg += " - Please enter insurance $$ value on line " + (x+1) + "\n";
      }
    }

    if(alertMsg!="")
    {
      alert(alertMsg);
      return false;
    }
    else
    {
      return true;
    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error Cchecking Insurance Amounts","Details: " + err.message);
    return true;
  }
}
function SendAsCSS(){
	
	 var count=nlapiGetLineItemCount("custpage_orders");
	 var arrData=[];
	 for (var x = 1; x <= count; x++)
	 {
		 arrData.push(
		 {
			custpage_order_id : nlapiGetLineItemValue("custpage_orders","custpage_order_id",x),
			custpage_order_rsl_status :nlapiGetLineItemValue("custpage_orders","custpage_order_rsl_status",x),
			custpage_email_type:nlapiGetLineItemValue("custpage_orders","custpage_email_type",x),
			custpage_order_customer_email:nlapiGetLineItemValue("custpage_orders","custpage_order_customer_email",x),
			custpage_order_return_label:nlapiGetLineItemValue("custpage_orders","custpage_order_return_label",x),
			custpage_order_record_type:nlapiGetLineItemValue("custpage_orders","custpage_order_record_type",x),
			custpage_order_tranid:nlapiGetLineItemValue("custpage_orders","custpage_order_tranid",x),
			custpage_order_return_ship_method:nlapiGetLineItemValue("custpage_orders","custpage_order_return_ship_method",x),
			custpage_order_return_insurance:nlapiGetLineItemValue("custpage_orders","custpage_order_return_insurance",x),
			custpage_email_template:nlapiGetLineItemValue("custpage_orders","custpage_email_template",x),
			custpage_order_customer:nlapiGetLineItemValue("custpage_orders","custpage_order_customer",x),
			custpage_cc_emails:nlapiGetLineItemValue("custpage_orders","custpage_cc_emails",x)
				
		 });
		 
	 }
	  var data_to_send = JSON.stringify(arrData);
	  callRestletUsingAjax(data_to_send);
  	// window.location.reload();
}


function callRestletUsingAjax(data_to_send) {
  var restUrl = nlapiResolveURL('RESTLET', 'customscript_send_email_as_css', 'customdeploy_send_email_as_css');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: data_to_send,
    dataType: "json",
    success: function(result) {     
      if(result=='success'){
         alert('Mails has been triggered successfully!');
        window.location.reload();      
      }

     }
  });
 
}