nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author 						: 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
 * Author Desig. 						: 	Jr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   						: 	SuiteletScript
 * Created Date  						: 	Feb 01, 2016
 * Last Modified Date 					:  	Feb 01, 2016
 * Comments                 			: 	Script will Create Customer Deposite
 * Sandbox User Interface				:	/app/site/hosting/scriptlet.nl?script=1054&deploy=1
 * Sandbox Suitelet Script URL 			:	/app/common/scripting/script.nl?id=1054
 * Sandbox Client Script URL			:	/app/common/scripting/script.nl?id=1056
 * Sandbox Scheduled Script URL			:	/app/common/scripting/script.nl?id=1111
 * Sandbox Save Search 1 URL			:	/app/common/search/savedsearch.nl?id=4622 
 * Sandbox Save Search 2 URL			:	/app/common/search/savedsearch.nl?id=4624
 * Sandbox Save Search 3 URL			:	/app/common/search/savedsearch.nl?id=4671
 * Production User Interface			:	/app/site/hosting/scriptlet.nl?script=1158&deploy=1
 * Production Suitelet Script URL 		:	/app/common/scripting/script.nl?id=1158
 * Production Client Script URL			:	/app/common/scripting/script.nl?id=1159
 * Production Scheduled Script URL		:	/app/common/scripting/script.nl?id=1163
 * Production Save Search 1 URL			:	/app/common/search/savedsearch.nl?id=5598
 * Production Save Search 2 URL			:	/app/common/search/savedsearch.nl?id=5599
 * Production Save Search 3 URL			:	/app/common/search/savedsearch.nl?id=5609
*/
function Msg()
{
	document.getElementsByTagName("body")[0].setAttribute("style", "border: solid #e0e6ef;padding: 0px 16px 100px 10px!important;");
    document.getElementsByClassName("uir-page-title-firstline")[0].setAttribute("style", "margin-bottom: 4px;margin-top: 2px;background: #e0e6ef;text-align:center;"); 
	var msg = nlapiGetFieldValue("custpage_msg");
	if(msg!="" && msg!=null)
	{
		alert("The Layaway Payment Dashboard transactions are currently being processed. Please review the result in 10-15 minutes");
	}
  //For Highlighting the row 
  jQuery('span[id^="custpage_span"]').each(function(){
		if(jQuery(this).text()=="Yes")
		{
			jQuery(this).parent().parent().children().each(function(){
				jQuery(this).style('background-color','#98FB98','important');
			});
		}
        else
        {
          jQuery(this).parent().parent().children().each(function(){
				jQuery(this).style('background-color','#FFFF66','important');
			});
        }
    });
}




function Change_Record(type,name)
{

	try
	{
		if(name=="custpage_page" || name=="custpage_month" || name=="custpage_date" )
		{
			var page = nlapiGetFieldValue("custpage_page");
            var month = nlapiGetFieldValues("custpage_month");
			if(page==null || page=="")
			{
				page = 0;
			}
			if(month==null && month=="")
			{
				month = "";
			}
			if(name=="custpage_month" )
			{
				page = 0;
			}
			var date = nlapiGetFieldValue("custpage_date");
			if(date==null || date=="")
			{
				date = "";
            }
			window.onbeforeunload = null;
			window.location.href = nlapiResolveURL("SUITELET","customscript_layaway_payment_dashboard","customdeploy_layaway_payment_dashboard") + "&page=" + page +"&month=" + month +"&date=" + date ;
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Calculating # Selected","Details: " + err.message);
		return true;
	}
}


function ChargeOption(option) 
{
	var count = nlapiGetLineItemCount("custpage_list");
	for(var i=1;i<=count;i++)
	{
		var type=nlapiSetLineItemValue('custpage_list','custpage_charge',i,option);
	}	
}


function BeforeDeposit()
{
	var DepositArr = [];
	var count = nlapiGetLineItemCount('custpage_list');		
	for(var i=1; i <= count; i++)
	{
		var type = nlapiGetLineItemValue('custpage_list','custpage_charge',i);
		if(type == "Charge")						
		{					
			var amount = nlapiGetLineItemValue('custpage_list','custpage_monthly_layaway_amount',i);					
			if(parseFloat(amount) > 0 && amount != null && amount != "")
			{
				var website_amt = nlapiGetLineItemValue('custpage_list','custpage_website_balance',i);	
				if(parseFloat(website_amt)>=parseFloat(amount))
				{
					DepositArr.push({
						soId	:	nlapiGetLineItemValue('custpage_list','custpage_salesorder_id',i),
						custId	:	nlapiGetLineItemValue('custpage_list','custpage_customer_id',i),
						amount	:	amount
					});
				}
				else
				{	
					alert("Warning - You are attempting to charge more than the remaining balance for sales order #"+nlapiGetLineItemValue('custpage_list','custpage_salesorder_link',i).replace(/<\/?[^>]+(>|$)/g, '') +", "+ nlapiGetLineItemValue('custpage_list','custpage_customername',i).replace(/<\/?[^>]+(>|$)/g, '') +". Please enter a new payment value");
					return false;					
				}
				
			}
		}				
	}
	if(DepositArr.length > 0)
	{
		//if (confirm("Are your confrim to Create Customer Deposits?") == true) 
        if (confirm("Are you sure that you want to create these customer deposits?") == true) 
		{
			nlapiSetFieldValue("custpage_deposit", JSON.stringify(DepositArr));	
			return true;
		} 
		else
		{
			return false;
		}			
	}
	else
	{
		alert('Charge atleast one Sales Order..!!');
		return false;
	}
	return true;
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