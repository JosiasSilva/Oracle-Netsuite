/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url'],
/**
 * @param {url} url
 */
function(url) {
  	var cntxt;  
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(context) {
    	cntxt = context;
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(context) {
    	var curRec = context.currentRecord;
    	var subListId;
    	// Vendor
    	if(context.fieldId == 'custpage_ap_disputes_vendor'){
    		subListId = 'custpage_ap_disputes';
    		var srchVendor = curRec.getValue({fieldId: 'custpage_ap_disputes_vendor'});
    		var srchVendorTxt = curRec.getText({fieldId: 'custpage_ap_disputes_vendor'});
    		var sublistId_splits = "#" + subListId + "_splits";
    		jQuery(sublistId_splits).html('<div>Loading...</div>');
    		
    		//document.getElementById('server_commands').src="/app/site/hosting/scriptlet.nl?script=2521&deploy=1&r=T&machine="+subListId+"&apDispVendorId="+srchVendor+"&apDispVendorTxt="+srchVendorTxt;
    		document.getElementById('server_commands').src="/app/site/hosting/scriptlet.nl?script=2483&deploy=1&r=T&machine="+subListId+"&apDispVendorId="+srchVendor+"&apDispVendorTxt="+srchVendorTxt;
    	}
    	// Chargeback Status
    	if(context.fieldId == 'custpage_ar_chargeback_sts'){
    		subListId = 'custpage_ar';
    		var srchChrgBkSts = curRec.getValue({fieldId: 'custpage_ar_chargeback_sts'});
    		var sublistId_splits = "#" + subListId + "_splits";
  			jQuery(sublistId_splits).html('<div>Loading...</div>');

  			//document.getElementById('server_commands').src="/app/site/hosting/scriptlet.nl?script=2521&deploy=1&r=T&machine="+subListId+"&chargebackStatus="+srchChrgBkSts;
  		    document.getElementById('server_commands').src="/app/site/hosting/scriptlet.nl?script=2483&deploy=1&r=T&machine="+subListId+"&chargebackStatus="+srchChrgBkSts;
    	}
    	//AP Productivity Sub List: Vendor and Category
    	if(context.fieldId == 'custpage_ap_prod_category' || context.fieldId == 'custpage_ap_prod_vendor'){
    		var subListId = 'custpage_ap_prod';
        	var apProdVendorId = curRec.getValue({fieldId: 'custpage_ap_prod_vendor'});
         	var apProdVendorTxt = curRec.getText({fieldId: 'custpage_ap_prod_vendor'});
        	var apProdCategoryId = curRec.getValue({fieldId: 'custpage_ap_prod_category'});
        	var sublistId_splits = "#" + subListId + "_splits";
    		jQuery(sublistId_splits).html('<div>Loading...</div>');

    		//document.getElementById('server_commands').src="/app/site/hosting/scriptlet.nl?script=2521&deploy=1&r=T&machine="+subListId+"&apProdVendorId="+apProdVendorId+"&apProdVendorTxt="+apProdVendorTxt+"&apProdCategoryId="+apProdCategoryId;
    	    document.getElementById('server_commands').src="/app/site/hosting/scriptlet.nl?script=2483&deploy=1&r=T&machine="+subListId+"&apProdVendorId="+apProdVendorId+"&apProdVendorTxt="+apProdVendorTxt+"&apProdCategoryId="+apProdCategoryId;
	
    	}
    }
    
    return {
    	pageInit: pageInit,
        fieldChanged: fieldChanged,
    };
});
