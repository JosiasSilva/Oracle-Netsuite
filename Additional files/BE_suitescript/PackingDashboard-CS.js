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
      
      
      

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
		
		
      
    }
  
  /*function printQueue(){
    
    var rec = currentRecord.get();
   var lineCount = rec.getLineCount({sublistId:'custpage_packing_sublist'});
    var id_arr = [];

    var itemFulfillSearch = search.load({id:'customsearch10630'});
     console.log('Inside print Q');
    
    for (var j=0; j<lineCount;j++){
      var so_id = rec.getSublistValue({sublistId:'custpage_packing_sublist',fieldId:'custpage_id_hidden',line:j});
     console.log(so_id);
     var MyFilters = search.createFilter({
				name: 'createdfrom',
				operator: 'anyof',
				values: so_id
			});
          itemFulfillSearch.filters.push(MyFilters);
      var searchResults = itemFulfillSearch.run().each(function(result){
        
        id_arr.push(result.id);
      });
      
      console.log(id_arr);
     
    }


    console.log('calling suitelet' + id_arr);

    var backSuite_Url = url.resolveScript({scriptId:'customscript_packing_print_queue',deploymentId:'customdeploy_print_queue_backend'});
    
    console.log('backSuite_Url' + backSuite_Url);
    var xmlRequest = new XMLHttpRequest();

    var xmlOpen = xmlRequest.open('POST', backSuite_Url, true);
    xmlRequest.setRequestHeader("Content-Type", "application/json");
    xmlRequest.send(JSON.stringify(id_arr));
    
  }
  */
  
  
    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {
      
      var sublistName = scriptContext.sublistId;
      var currentRec =  scriptContext.currentRecord;
      var shippingId = [];
      var itemFulfillSearch = search.load({id:'customsearch10630'});
       
      
      if (sublistName == 'custpage_packing_sublist'){
        console.log("I am in sublist changed");
        
        var lineCount = currentRec.getLineCount({sublistId:'custpage_packing_sublist'});
        
        for (var j=0; j<lineCount;j++){
      var so_id = currentRec.getSublistValue({sublistId:'custpage_packing_sublist',fieldId:'custpage_id_hidden',line:j});
     console.log(so_id);
     var MyFilters = search.createFilter({
				name: 'createdfrom',
				operator: 'anyof',
				values: so_id
			});
          itemFulfillSearch.filters.push(MyFilters);
      var searchResults = itemFulfillSearch.run().each(function(result){
        
        shippingId.push(result.getValue({name:'custbody_fedex_shipping_label'}));
      });
      
      console.log(shippingId);
     
    }
    currentRec.setValue({fieldId:'custpage_shipping_id',value:JSON.stringify(shippingId)});
        
        
      }

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
      
      var currentRecord = scriptContext.currentRecord;
    	var sublistName = scriptContext.sublistId;
    	
      var suit_url = url.resolveScript({scriptId:'customscript_packing_dashboard',deploymentId:'customdeploy_packing_dashboard'});
		
		 var searchArr = [];
        var so_obj = {};
    	
       var packingDashSearch = search.load({id:'customsearch_packing_db_readytoship_2'});
      var searchResultCount = packingDashSearch.runPaged().count;
      //alert(searchResultCount);
      var searchResults = packingDashSearch.run().getRange({start:0,end:searchResultCount});
	  
      for (var i = 0 ; i< searchResults.length;i++){
        
        so_obj.doc_number = searchResults[i].getValue({name:'tranid'});
       // so_obj.doc_status_1 = result.getText({name:'status'});
        so_obj.customer = searchResults[i].getText({name:'entity'});
        so_obj.websiteBalance = searchResults[i].getValue({name:'custbody_website_truebalance_amt'});
        so_obj.internalid = searchResults[i].id;
        searchArr.push(so_obj);
      }
      
    	console.log(searchArr);
		
		if (sublistName == 'custpage_packing_sublist'){
          
			
				var docNumber = currentRecord.getCurrentSublistValue({sublistId:sublistName,fieldId:'custpage_doc_number'});
              // alert(docNumber);
			
			
			if (docNumber){
				for (var j=0; j< searchArr.length;j++){
                
				var so_obj_check = searchArr[j];
				if ( docNumber == so_obj_check.doc_number){
					
					//currentRecord.setCurrentSublistText({sublistId:sublistName,fieldId:'custpage_doc_status',text:so_obj_check.doc_status_1});
					currentRecord.setCurrentSublistText({sublistId:sublistName,fieldId:'custpage_cus_name',text:so_obj_check.customer});
					currentRecord.setCurrentSublistValue({sublistId:sublistName,fieldId:'custpage_web_bal',value:so_obj_check.websiteBalance});
                    currentRecord.setCurrentSublistValue({sublistId:sublistName,fieldId:'custpage_id_hidden',value:so_obj_check.internalid});
                     
                  
                  return true;
					
				}
				else{
					
					dialog.alert({title:'Sales Order not ready',message:'Sales Order is not ready to ship today'}).then(function(){window.location = suit_url});
					
					
				}
				}
			}
			
			
			
		}
      
      
      
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {
     

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
  
    }

    return {
        pageInit: pageInit,
       // fieldChanged: fieldChanged
        //saveAndAdd:saveAndAdd,
        validateLine: validateLine,
        //printQueue: printQueue
        //tempRecHold:tempRecHold,
        //validateDelete: validateDelete
        /*postSourcing: postSourcing,*/
        sublistChanged: sublistChanged,
       /* lineInit: lineInit,
        validateField: validateField,
        ,
        validateInsert: validateInsert,
        ,
        saveRecord: saveRecord*/
    };
    
});
