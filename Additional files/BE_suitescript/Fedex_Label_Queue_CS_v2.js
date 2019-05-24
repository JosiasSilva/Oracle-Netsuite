jQuery(document).ready(function(){
	jQuery("input[name^='inpt_custpage_bulk_fulfill_status']").parent().parent().parent().next().next().next().next().next().next().each(function(){
		if (jQuery(this).html().indexOf('Item(s) in production') == -1) {
			jQuery(this).parent().children().each(function(){
				var el = jQuery(this);
				el.style('background', '#f2d3bf', 'important');
				el.style('border-color', '#f2d3bf', 'important');
			});
		}
	});
});

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


function Fedex_Label_Queue_CS_FC(type,name,linenum)
{
	if(name=="custpage_allow_reprinting")
	{
		try
		{
			var allowReprint = 'F';
			
			if(nlapiGetFieldValue("custpage_allow_reprinting")=="T")
				allowReprint = 'T';
				
			var page = nlapiGetFieldValue("custpage_page");
				
			var url = nlapiResolveURL("SUITELET","customscript_fedex_label_print_queue","customdeploy_fedex_label_print_queue");
				url+= "&reprint=" + allowReprint;
				url+= "&page=" + page;
				
			window.onbeforeunload = null;
			window.location.href = url;
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Handling Reprint Checkbox","Details: " + err.message);
		}
	}
	else if(name=="custpage_page")
	{
		var page = nlapiGetFieldValue("custpage_page");
		
		window.onbeforeunload = null;
		window.location.href = nlapiResolveURL("SUITELET","customscript_fedex_label_print_queue","customdeploy_fedex_label_print_queue") + "&page=" + page;
	}
	if(type=="custpage_labels" && name=="custpage_print")
	{
		var selected = 0;
		for(var x=0; x < nlapiGetLineItemCount("custpage_labels"); x++)
		{
			if(nlapiGetLineItemValue("custpage_labels","custpage_print",x+1)=="T")
				selected++;
		}
		
		nlapiSetFieldValue("custpage_selected",selected);
	}
}

function FL_Print_Queue_Mark_All()
{
	for(var x=0; x < nlapiGetLineItemCount("custpage_labels"); x++)
	{
		nlapiSetLineItemValue("custpage_labels","custpage_print",x+1,"T");
	}
	
	nlapiSetFieldValue("custpage_selected",nlapiGetLineItemCount("custpage_labels"));
}

function FL_Print_Queue_Unmark_All()
{
	for(var x=0; x < nlapiGetLineItemCount("custpage_labels"); x++)
	{
		nlapiSetLineItemValue("custpage_labels","custpage_print",x+1,"F");
	}
	
	nlapiSetFieldValue("custpage_labels",0);
}
