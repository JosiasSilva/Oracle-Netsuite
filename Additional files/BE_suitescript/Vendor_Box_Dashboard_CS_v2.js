function VBD_FC(type,name,linenum)
{
	if(type=="custpage_list" && (name=="custpage_date_sent_from_sf" || name=="custpage_status" || name=="custpage_int_notes" || name=="custpage_notes"))
	{
		nlapiSetLineItemValue("custpage_list","custpage_changed",linenum,"T");
	}
	else if(name=="custpage_vendor")
	{
		var url = nlapiResolveURL("SUITELET","customscript_vendor_box_dashboard","customdeploy_vendor_box_dashboard");
		url += "&vendor=" + nlapiGetFieldValue("custpage_vendor");
		
		window.onbeforeunload = null;
		window.location.href = url;
	}
}

function VBD_Print()
{
	var url = nlapiResolveURL("SUITELET","customscript_vbd_print","customdeploy_vbd_print");
	
	window.open(url,'printWindow','location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=yes,height=600,width=800');
}

function VBD_PI()
{
	jQuery('input[name^="inpt_custpage_status"]').each(function(){
		if(jQuery(this).val()=="Progress")
		{
			jQuery(this).parent().parent().parent().parent().children().each(function(){
				jQuery(this).style('background-color','#FFC966','important');
			});
		}
		else if(jQuery(this).val()=="Completed")
		{
			jQuery(this).parent().parent().parent().parent().children().each(function(){
				jQuery(this).style('background-color','#66B366','important');
			});
		}
		else if(jQuery(this).val()=="Not Started")
		{
			jQuery(this).parent().parent().parent().parent().children().each(function(){
				jQuery(this).style('background-color','#ff6666','important');
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