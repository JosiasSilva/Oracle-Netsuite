/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/email', 'N/format', 'N/runtime', 'N/error', 'N/file'],

function(search, record, email, format, runtime, error, file) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
        var objSearchOriginAudit = search.load({
            id: 'customsearch_origin_audit_randomizer'
          });
          return objSearchOriginAudit;
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
        var srchOrgAudit = JSON.parse(context.value);
		var vendorId = srchOrgAudit.values['entity'].value;
		var intrId = srchOrgAudit.id;
        context.write({
    	      key: vendorId,
    	      value: intrId
        	});
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	var vendorId = context.key;
    	var arrIntrId = [];
    	var maxRec = 4;
        for (var i = 0; i < context.values.length; i++) {
            var intrId = JSON.parse(context.values[i]);
            if(arrIntrId.indexOf(intrId) == -1)
  				arrIntrId.push(intrId);
        }

        //if there are more than four bills for the vendor 
        if(arrIntrId.length > maxRec)
        	shuffle(arrIntrId);

       	var recLog = updateBills(arrIntrId, maxRec);
       	recLog = vendorId + ',' + recLog;
   		//log.audit('Origin Audit Log', recLog);
        context.write({
            key: vendorId,
            value: recLog
          });
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	if (summary.inputSummary.error) {
    	      log.error('Input Error', summary.inputSummary.error);
    	    };
    	    summary.mapSummary.errors.iterator().each(function(key, error) {
    	      log.error('Map Error for key: ' + key, error);
    	      return true;
    	    });

    	    summary.reduceSummary.errors.iterator().each(function(key, error) {
    	      log.error('Reduce Error for key: ' + key, error);
    	      return true;
    	    });

    	    var contents = 'Vendor Id, Bill Id(s)\n';
    	    var totalRows = 0;
    	    summary.output.iterator().each(function(key, value) {
    	      contents += (value + '\n');
    	      totalRows++;
    	      return true;
    	    });
    	    if (totalRows > 0) {
    	    	//log.audit('Orgin Audit Log contents', contents);
    	    	
    	        var logFile = file.create({
    	          name: 'BE_OrginAuditLog.csv',
    	          fileType: file.Type.CSV,
    	          contents: contents
    	        });

    	        var runTimeContext = runtime.getCurrentScript();
    	        var author = runTimeContext.getParameter({name:'custscript_sender'});
    	        var recipient = runTimeContext.getParameter({name:'custscript_log_recipient'});

    	        if(author && recipient){
    	  		      try{
    	  		    	  email.send({
    	  				        author: author,
    	  				        recipients: recipient,
    	  				        subject: 'BE Orgin Audit Log',
    	  				        body: 'Pls find attached BE Orgin Audit Log',
    	  				        attachments: [logFile]
    	  		      		});
    	  		      }catch(error){
    	      			log.error('Error while sending log file', error.message);
    	  		      	}
    	        	}else{
    	        			log.error('Error in sending log file ', 'Log File could not be send. Please select sender/recipient in script parameter. ');
    	        	}
    	      }
    }
    function shuffle(arrBillIds) {
    	  var len = arrBillIds.length, temp, i;
    	  // While there is elements to shuffle
    	  while (len) {
    	    // get an random index
    	    i = Math.floor(Math.random() * len--);
    	    //swap it with the current element
    	    temp = arrBillIds[len];
    	    arrBillIds[len] = arrBillIds[i];
    	    arrBillIds[i] = temp;
    	  }
    	}
    
    function updateBills(arrIntrId, maxNbrRec) {
    	var dtCurrent = new Date();
        var originDate = format.parse({value: dtCurrent, type: format.Type.DATE});
        var updLog = '';
        
        if(arrIntrId.length > maxNbrRec)
        	var len = maxNbrRec;
        else
        	var len = arrIntrId.length;

    	for(var ln = 0; ln < len; ln++){
        	var updId;
    		var recId = arrIntrId[ln];
    		//log.audit('Processing Record with Internal Id:' + recId);
    		try{
	    		 updId = record.submitFields({
		    			type: record.Type.VENDOR_BILL,
		    			id: recId,
		    			values: {'custbodyorigin_audit_sample_date': originDate},
		    			options: {enableSourcing: false, ignoreMandatoryFields : true}
	    			});

    		}catch(error){
    			log.error('Error while Processing record with Internal Id : ' + recId, error.message);
    		}
    		if(updId){
    			//log.audit('Record Updated with Internal Id : ' + updId, 'with Date : ' + originDate);
    			updLog += (updId + '\n' + ',');
      		}
    	}
    	return updLog;
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
