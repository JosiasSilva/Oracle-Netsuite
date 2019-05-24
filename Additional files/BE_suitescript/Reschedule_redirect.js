/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/url'],
/**
 * @param {serverWidget}
 *            serverWidget
 */
function(record, url) {
var winRef;  
	/**
	 * Function to be executed after page is initialized.
	 * 
	 * @param {Object}
	 *            scriptContext
	 * @param {Record}
	 *            scriptContext.currentRecord - Current form record
	 * @param {string}
	 *            scriptContext.mode - The mode in which the record is being
	 *            accessed (create, copy, or edit)
	 * 
	 * @since 2015.2
	 */
	function pageInit(context) {
		//redirectReschedule();
	}

	function redirectReschedule(appointId) {
	  //	alert("APP ID::"+appointId);
      var appData = {};
      appData.appId = appointId;
      var backendURL = url.resolveScript({
                 scriptId: 'customscript2616',
                 deploymentId: 'customdeploy1',
        		 params: appData
             });
      //console.log(backendURL);

      winRef = window.open(backendURL, '_blank', 'height=650,width=650');
	}
  
    function refreshUpdatedWindow() {
      winRef.close();
      window.opener.location.reload();
    }
  
  /**
	 * Function to be executed when field is slaved.
	 * 
	 * @param {Object}
	 *            scriptContext
	 * @param {Record}
	 *            scriptContext.currentRecord - Current form record
	 * @param {string}
	 *            scriptContext.sublistId - Sublist name
	 * @param {string}
	 *            scriptContext.fieldId - Field name
	 * 
	 * @since 2015.2
	 */
	function postSourcing(scriptContext) {
	  var cform = scriptContext.currentRecord;
      var reschStTimeSelectFieldVal = cform.getField({
        fieldId: 'custpage_stselect'
      });
      
      reschStTimeSelectFieldVal.insertSelectOption({
			 value: '10:00 am',
			 text: '10:00 am'
			}); 
	}
	
	/**
	 * Function to be executed when field is changed.
	 * 
	 * @param {Object}
	 *            scriptContext
	 * @param {Record}
	 *            scriptContext.currentRecord - Current form record
	 * @param {string}
	 *            scriptContext.sublistId - Sublist name
	 * @param {string}
	 *            scriptContext.fieldId - Field name
	 * @param {number}
	 *            scriptContext.lineNum - Line number. Will be undefined if not
	 *            a sublist or matrix field
	 * @param {number}
	 *            scriptContext.columnNum - Line number. Will be undefined if
	 *            not a matrix field
	 * 
	 * @since 2015.2
	 */
	function fieldChanged(scriptContext) {
		var schField = scriptContext.fieldId;
		var currentRecord = scriptContext.currentRecord;

		//alert('Triggered' + schField);
		if (schField == 'custpage_stselect') {
			var schselstFld = currentRecord.getText({
				fieldId : 'custpage_stselect'
			});
			var schstFld = currentRecord.setValue({
				fieldId : 'custpage_sttime',
				value: schselstFld
			});
			
		}
		
		if (schField == 'custpage_endselect') {
			var schselendFld = currentRecord.getText({
				fieldId : 'custpage_endselect'
			});
			
			var schendFld = currentRecord.setValue({
				fieldId : 'custpage_endtime',
				value: schselendFld
			});
			
		}
	}
	
	/**
	 * Validation function to be executed when field is changed.
	 * 
	 * @param {Object}
	 *            scriptContext
	 * @param {Record}
	 *            scriptContext.currentRecord - Current form record
	 * @param {string}
	 *            scriptContext.sublistId - Sublist name
	 * @param {string}
	 *            scriptContext.fieldId - Field name
	 * @param {number}
	 *            scriptContext.lineNum - Line number. Will be undefined if not
	 *            a sublist or matrix field
	 * @param {number}
	 *            scriptContext.columnNum - Line number. Will be undefined if
	 *            not a matrix field
	 * 
	 * @returns {boolean} Return true if field is valid
	 * 
	 * @since 2015.2
	 */
	function validateField(scriptContext) {
		var currentRecord = scriptContext.currentRecord;
		
		var schstFld = currentRecord.getValue({
			fieldId : 'custpage_sttime'
		});
		var schendFld = currentRecord.getValue({
			fieldId : 'custpage_endtime'
		});
		
		if (schstFld != "" && schendFld != "") {
			var schselstFldVal = currentRecord.getValue({
				fieldId : 'custpage_stselect'
			});
			var schselendFldVal = currentRecord.getValue({
				fieldId : 'custpage_endselect'
			});
			
			if (schselstFldVal >= schselendFldVal) {
				alert("Start Time must be earlier then End Time");
              
                var schstFld = currentRecord.setValue({
				  fieldId : 'custpage_sttime',
				  value: ""
			    });
				return false;
			}
		}
		return true;
	}

	return {
        pageInit:pageInit,
		redirectReschedule : redirectReschedule,
        refreshUpdatedWindow: refreshUpdatedWindow,
        postSourcing:postSourcing,
		fieldChanged : fieldChanged,
		validateField: validateField
	};

});
