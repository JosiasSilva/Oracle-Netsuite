/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url','N/currentRecord','N/search'],
/**
 * @param {record} record
 * @param {redirect} redirect
 */
function(record, url,currentRecord,search) {
    
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
    	var currentRecord = scriptContext.currentRecord;
    	var sublistName = scriptContext.sublistId;
    	var fieldName = scriptContext.fieldId;
      var itemObj = {};
      itemObj.vendor = currentRecord.getValue({fieldId:'entity'});

    	if(sublistName == 'item'){
            if (fieldName == 'custcol13'){
      		var chkBoxVal = currentRecord.getCurrentSublistValue({sublistId:sublistName, fieldId:fieldName});
    		if(chkBoxVal == true){
    		itemObj.item = currentRecord.getCurrentSublistValue({sublistId:sublistName,fieldId:'item'});
              itemObj.line = currentRecord.getCurrentSublistIndex({sublistId:'item'});

    		 var backendURL = url.resolveScript({
                 scriptId: 'customscript_zag_be_create_mold_sut',
                 deploymentId: 'customdeploy_zag_be_create_mold_sut',
                 params: itemObj
             });
              console.log(backendURL);

              window.open(backendURL,height=50,width=150);

    		}
    		
    		
    	}
     

    }
    }
  
  function saveAndAdd(){
  
   var itemObj={};
   var moldRec_obj_sa = {};
   var mold_arr = [];
    if(window.top.opener.document.getElementById('custpage_multiple_save').value !== null && window.top.opener.document.getElementById('custpage_multiple_save').value !== "" && window.top.opener.document.getElementById('custpage_multiple_save').value !== undefined ){
   var temp_mold_arr = JSON.parse(window.top.opener.document.getElementById('custpage_multiple_save').value);
    } 
    if (temp_mold_arr){
   for (var j = 0; j<temp_mold_arr.length;j++){
     
     mold_arr.push(temp_mold_arr[j]);
     
   }
    } 

    var rec = currentRecord.get();
   // console.log(JSON.stringify(rec));
   moldRec_obj_sa.lineVal = rec.getValue({fieldId:'custpage_hidden_line_info'});
    moldRec_obj_sa.shapeVal = rec.getValue({fieldId:'custpage_shape'});
    moldRec_obj_sa.shapeText = rec.getText({fieldId:'custpage_shape'});
    moldRec_obj_sa.lenValue = rec.getValue({fieldId:'custpage_length'});
    moldRec_obj_sa.widthValue = rec.getValue({fieldId:'custpage_width'});
   	moldRec_obj_sa.ringSizeValue = rec.getValue({fieldId:'custpage_ringsize'});
   	moldRec_obj_sa.skuValue = rec.getValue({fieldId:'custpage_sku'});
   	moldRec_obj_sa.nameVal = moldRec_obj_sa.lenValue + " "+ "x"+ " "+ moldRec_obj_sa.widthValue + " " + moldRec_obj_sa.shapeText;
    moldRec_obj_sa.vendorVal = rec.getValue({fieldId:'custpage_hidden_vendor'});
    moldRec_obj_sa.itemVal = rec.getValue({fieldId:'custpage_hidden_info'});
    mold_arr.push(moldRec_obj_sa);  

    window.top.opener.document.getElementById('custpage_multiple_save').value = JSON.stringify(mold_arr);
    window.onbeforeunload = null;
    window.location.reload(false); 

  }
  
  function tempRecHold(){

    var mold_obj = {};
    var mold_arr=[];
    
     if(window.top.opener.document.getElementById('custpage_single_save').value !== null && window.top.opener.document.getElementById('custpage_single_save').value !== "" && window.top.opener.document.getElementById('custpage_single_save').value !== undefined ){
   var temp_mold_arr = JSON.parse(window.top.opener.document.getElementById('custpage_single_save').value);
    } 
    if (temp_mold_arr){
   for (var j = 0; j<temp_mold_arr.length;j++){
     
     mold_arr.push(temp_mold_arr[j]);
     
   }
    } 
    var rec = currentRecord.get();
    mold_obj.lineVal = rec.getValue({fieldId:'custpage_hidden_line_info'});
    mold_obj.shapeVal = rec.getValue({fieldId:'custpage_shape'});
    mold_obj.shapeText = rec.getText({fieldId:'custpage_shape'});
    	   mold_obj.lenValue = rec.getValue({fieldId:'custpage_length'});
    	 mold_obj.widthValue = rec.getValue({fieldId:'custpage_width'});
    	mold_obj.ringSizeValue = rec.getValue({fieldId:'custpage_ringsize'});
    	 mold_obj.skuValue = rec.getValue({fieldId:'custpage_sku'});
    	 mold_obj.nameVal = mold_obj.lenValue + " "+ "x"+ " "+ mold_obj.widthValue + " " + mold_obj.shapeText;
        mold_obj.vendorVal = rec.getValue({fieldId:'custpage_hidden_vendor'});
       mold_obj.itemVal = rec.getValue({fieldId:'custpage_hidden_info'});
    
    mold_arr.push(mold_obj);
    window.onbeforeunload = null;
    self.close();
    window.opener.document.getElementById('custpage_single_save').value = JSON.stringify(mold_arr);
   
    
  }
  
  
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
      var catalogText= "";
      var vendor_val = currentRecord.getValue({fieldId:'entity'});
      console.log(currentRecord.getValue({fieldId:'custpage_single_save'}));
      console.log(vendor_val);
       if (sublistName == 'item'){

          var mold_val = currentRecord.getCurrentSublistValue({sublistId: sublistName,fieldId:'custcol13'});
          var item_val = currentRecord.getCurrentSublistValue({sublistId: sublistName,fieldId:'item'});

         if (currentRecord.getValue({fieldId:'custpage_single_save'}) !== null && currentRecord.getValue({fieldId:'custpage_single_save'}) !== undefined && currentRecord.getValue({fieldId:'custpage_single_save'}) !== "" ){
         var single_val = JSON.parse(currentRecord.getValue({fieldId:'custpage_single_save'}));
         }

         if (currentRecord.getValue({fieldId:'custpage_multiple_save'}) !== null && currentRecord.getValue({fieldId:'custpage_multiple_save'}) !== undefined && currentRecord.getValue({fieldId:'custpage_multiple_save'}) !== "" ){
         var multi_Val =  JSON.parse(currentRecord.getValue({fieldId:'custpage_multiple_save'}));
         }

           if (mold_val == true) {
             if (single_val){
             for (var j = 0 ; j<single_val.length;j++){
             if (item_val == single_val[j].itemVal){
               //currentRecord.setCurrentSublistText({sublistId:sublistName,fieldId:'custcol17',text:single_val[j].nameVal}); // satya
               catalogText += single_val[j].nameVal; //satya
               
             }
             }
             }
             if(multi_Val) {
               if(catalogText != '') // satya
                 catalogText += ";" // satya
               
               for (var i = 0; i<multi_Val.length;i++){
                 
                 if (item_val == multi_Val[i].itemVal){
                   catalogText += multi_Val[i].nameVal;
                   catalogText += ";";
                 }
                 
               }
               //currentRecord.setCurrentSublistText({sublistId:sublistName,fieldId:'custcol17',text:catalogText}); // Satya
               
             }
             currentRecord.setCurrentSublistText({sublistId:sublistName,fieldId:'custcol17',text:catalogText}); // satya
            
           }
       }
return true;
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
      /*
      
      
      */
var temp_array_single =[];
var temp_array_multi = [];
var k = 0;
var l =0;
var currentRecord = scriptContext.currentRecord;
      if (scriptContext.sublistId == 'item'){
        var line_num = currentRecord.getCurrentSublistIndex({
          sublistId:'item'
        });
        var item_name = currentRecord.getCurrentSublistValue({
          sublistId:'item',
          fieldId:'item'
        });
        if (currentRecord.getValue({fieldId:'custpage_single_save'}) !== null && currentRecord.getValue({fieldId:'custpage_single_save'}) !== undefined && currentRecord.getValue({fieldId:'custpage_single_save'}) !== "" ){
       var single_save = JSON.parse(currentRecord.getValue({fieldId:'custpage_single_save'}));
        }
        
        if (currentRecord.getValue({fieldId:'custpage_multiple_save'}) !== null && currentRecord.getValue({fieldId:'custpage_multiple_save'}) !== undefined && currentRecord.getValue({fieldId:'custpage_multiple_save'}) !== "" ){
       var multi_save = JSON.parse(currentRecord.getValue({fieldId:'custpage_multiple_save'}));
         
        } 
        if (single_save){
        for (var i = 0 ; i<single_save.length;i++){
          
          if(single_save[i].lineVal !== line_num && single_save[i].itemVal !== item_name){
            temp_array_single[k] = single_save[i];
            temp_array_single[k].lineVal = k;
            k++;
            //single_save.splice(i,1)
          }
          else {
            continue;
          }
          
          
          
        }
        }
        if (multi_save){
        
       for (var j = 0 ; j<multi_save.length;j++){
          
          if(multi_save[j].lineVal !== line_num && multi_save[j].itemVal !== item_name){
            temp_array_multi[l] = multi_save[j];
            temp_array_multi[l].lineVal = l;
            l++;
           // multi_save.splice(j,1)
          }
          else {
            continue;
          }
          
          
          
        }
        }
 currentRecord.setValue({fieldId:'custpage_single_save',value:JSON.stringify(temp_array_single)});   currentRecord.setValue({fieldId:'custpage_multiple_save',value:JSON.stringify(temp_array_multi)});    
        
        
      }
      return true;
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
       // pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveAndAdd:saveAndAdd,
        validateLine: validateLine,
        tempRecHold:tempRecHold,
        validateDelete: validateDelete
        /*postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        ,
        validateInsert: validateInsert,
        ,
        saveRecord: saveRecord*/
    };
    
});
