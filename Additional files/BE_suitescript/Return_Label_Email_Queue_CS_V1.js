nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
