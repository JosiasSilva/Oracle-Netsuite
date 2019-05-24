/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/runtime'],
    /**
     * @param {serverWidget} serverWidget
     */
    function(serverWidget, search, record, runtime) {
	
	function getInputData() {
    	log.debug("Inside  getInputData",'====START====');
    	return search.load({
    		id: 'customsearch_write_off_open_invoices'//id:'customsearch10631'
    	});
    }
	
	function map(context) {
		log.debug("Inside  createJE",'====START====');
    	try {
    		var searchResults = JSON.parse(context.value);
            log.debug("Inside  createJE","Search Results ="+searchResults.values); 
            var Id    = searchResults.id;
            var invoiceId = searchResults.values.internalid.value;
            log.debug("Inside  createJE",'Id ='+Id+'/invoiceId ='+invoiceId); 
           
            var invoiceRec = record.load({
				type: record.Type.INVOICE,
				id: invoiceId,
				isDynamic: true,
			});
			
            var customerId = invoiceRec.getValue({
            	fieldId: 'entity'
    			});
			var amountRemaining = invoiceRec.getValue({
				fieldId: 'amountremaining'
    			});
			
			var invLocation = invoiceRec.getValue({
				fieldId: 'location'
    			});	
			log.debug("Inside  createJE", 'Invoice Id ='+invoiceId+'/Amount Remaining ='+amountRemaining+'/Customer ='+customerId+'/invLocation ='+invLocation);	
			if(customerId)
			{
				var jeId = createJournalEntry(customerId,amountRemaining,invLocation);
				log.debug("Inside  createJE",'JournalEntry Id ='+jeId);
				if(jeId)
				{
					var custPayment = record.transform({
						fromType: record.Type.CUSTOMER,
						fromId: customerId,
						toType: record.Type.CUSTOMER_PAYMENT,
						isDynamic: true
						});
					var applyLineCount = custPayment.getLineCount('apply');
					log.debug("Inside  createJE",'Customer Payment Apply Line Count ='+applyLineCount);
					for (var j = 0; j < applyLineCount; j++)
					{
    					custPayment.selectLine({
    					sublistId: 'apply',
    					line: j
    					});
    					var internalIdInv = custPayment.getCurrentSublistValue({
    						sublistId: 'apply',
    						fieldId: 'internalid'
    						});
    					log.debug("Inside  createJE",'Customer Payment Invoice Id ='+internalIdInv+'/Actual Invoice Id ='+invoiceId);
    					if(internalIdInv == invoiceId)
    					{
    						custPayment.setCurrentSublistValue({
    	    					sublistId: 'apply',
    	    					fieldId: 'apply',
    	    					value: true
    	    					});
    					}	
					}
					var creditLineCount = custPayment.getLineCount('credit');
					log.debug("Inside  createJE",'Customer Payment Credit Line Count ='+creditLineCount);
					for (var clineCount = 0; clineCount < creditLineCount; clineCount++) {
						custPayment.selectLine({
	    					sublistId: 'credit',
	    					line: clineCount
	    					});
						var internalIdJE = custPayment.getCurrentSublistValue({
    						sublistId: 'credit',
    						fieldId: 'internalid'
    						});
						log.debug("Inside  createJE",'Customer Payment JE Id ='+internalIdJE+'/Actual JE Id ='+jeId);
						if(internalIdJE == jeId)
    					{
    						custPayment.setCurrentSublistValue({
    	    					sublistId: 'credit',
    	    					fieldId: 'apply',
    	    					value: true
    	    					});
    					}
					}
					try {
						var custPaymentId = custPayment.save();
    					log.debug("Inside  createJE",'Customer Payment Id ='+custPaymentId);
					} catch (ex) {
						// TODO: handle exception
						log.debug("Error while creating je", ex.message);
					}
					
				}	
			}	
            //var scriptObj = runtime.getCurrentScript(); 
			//log.debug("Remaining Usage ",'Remaining Script Usage ='+scriptObj.getRemainingUsage());	
			log.debug("Inside  createJE",'====END====');	
		} catch (e) {
			// TODO: handle exception
			log.debug("Inside  createJE",'Error ='+e);
		}
	}
	
	function createJournalEntry(customer,amountRemaining,invLocation)
	{
		log.debug("Inside  createJournalEntry", 'customer Id ='+customer+'/Amount Remaining ='+amountRemaining+'/Inventory Location ='+invLocation);	
		var JEId = "";
		var creditAccount  = 8;
		var debitAccount = 71;
		try {
			var journalEntry = record.create({
				type: 'journalentry',
				isDynamic: true
				});
			
				journalEntry.selectNewLine({
				sublistId: 'line'
				});
				
				//Credit Accounts
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'account',
					value: creditAccount
					});
				
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'credit',
					value: amountRemaining
					}); 
				
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'memo',
					value: "Small Balance - created by script"
					});
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'entity',
					value: customer
					});
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'location',
					value: invLocation
					});
				journalEntry.commitLine({
					sublistId: 'line'
					});
				
				//Debit Account
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'account',
					value: debitAccount
					});
				
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'debit',
					value: amountRemaining
					});
				
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'memo',
					value: "Small Balance - created by script"
					});
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'entity',
					value: customer
					});
				journalEntry.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'location',
					value: invLocation
					});
				journalEntry.commitLine({
					sublistId: 'line'
					});
			var JEId = journalEntry.save();
			log.debug("Inside  createJournalEntry",'JournalEntry Id ='+JEId);
		} catch (ex) {
			// TODO: handle exception
			log.debug("Error while creating je", ex.message);
		}
		return JEId;
	}
	
	return {
        getInputData: getInputData,
        map: map
    };
});

