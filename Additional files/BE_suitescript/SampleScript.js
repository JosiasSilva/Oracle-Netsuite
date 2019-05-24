/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url','N/currentRecord','N/search','N/ui/dialog'],
/**
 * @param {record} record
 * @param {redirect} redirect
 */
function(record, url,currentRecord,search,dialog) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
      console.log('Inside PI - Sat');
      alert("Called");
      

    }

    

    return {
        pageInit: pageInit

    };
    
});