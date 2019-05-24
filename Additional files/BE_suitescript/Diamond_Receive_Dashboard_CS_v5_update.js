nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Save_Validate()
{
    var ValueChk=true;
	for(var x=1; x <= nlapiGetLineItemCount ( 'custpage_list') ; x++)
	{
		if(nlapiGetLineItemValue('custpage_list', 'custpage_changed', x) =="T")
		{
			 ValueChk=false;
			 break;
		}
		if(nlapiGetLineItemValue('custpage_list', 'custpage_recive_check', x) =="T")
		{
			 ValueChk=false;
			 break;
		}
	}
	if(ValueChk)
	{
        //alert('Please select at least one record to update / receive');
         alert('Please select at least one record to receive check box');
		 return false;
    }
	
	
	var value_certificate_included=false;
	for(var x=1; x <= nlapiGetLineItemCount ( 'custpage_list') ; x++)
	{
		if(nlapiGetLineItemValue('custpage_list', 'custpage_recive_check', x) =="T" && (nlapiGetLineItemValue('custpage_list', 'custpage_certificate_included', x) =="" || nlapiGetLineItemValue('custpage_list', 'custpage_certificate_included', x)==null) )
		{
			 value_certificate_included=true;
			 break;
		}
		
		
	}
	if(value_certificate_included)
	 {
        alert('Please select a value for certificate included for checked record');
		return false;
      }
	
	 if(nlapiGetFieldValue('custpage_stone_received_by')==null || nlapiGetFieldValue('custpage_stone_received_by')=='')
     {
         alert('Please select a value for the list Stone Received By');
		 return false;
     }
	
	  
	  
   return true;

}

function Search()
{

 window.onbeforeunload = null;
 var linkURL = nlapiResolveURL('SUITELET', 'customscript_diamond_dashboard_v2','customdeploy_diamond_dashboard_v2',   'internal');
 linkURL=linkURL +'&custpage_search_vendor='+ nlapiGetFieldValue('custpage_search_vendor');
 linkURL=linkURL +'&custpage_form_date='+ nlapiGetFieldValue('custpage_form_date');
 window.open(linkURL,"_self");
}
function PageInit()
{
    jQuery('input[name^="custpage_colour_flag"]').each(function(){
		//alert("FieldValue" + )
		if(jQuery(this).val()=="1")
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