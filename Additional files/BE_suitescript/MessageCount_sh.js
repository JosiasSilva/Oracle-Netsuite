/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search'],
/**
 * @param {search} search
 */
function(search) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} context
     * @param {string} context.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(context) {
    	    	
    	var messageSearchObj = search.create({
    		   type: "message",
    		   filters:
			   [
				  ["messagedate","within","1/12/2019", "2/12/2019"]
				  //["author","anyof","20561"]
			   ],
			   columns:
			   [
				 search.createColumn({
                     name: "formulatext",
                     summary: "GROUP",
                     formula: "TO_CHAR({messagedate}, 'mm/dd/yyyy')",
                     label: "Formula (Text)"
                  }),
				  search.createColumn({
					 name: "internalid",
					 summary: "COUNT",
					 label: "Internal ID"
				  })
			   ]
    		});
      
      var messageResultSet = messageSearchObj.run();
    	messageResultSet.each(function(result){
    		//log.debug("messageSearchObj result count",searchResultCount + " : starttime : " + starttime);
    		//messageSearchObj.run().each(function(result){
				var Dte = result.getValue(messageResultSet.columns[0]);
				var nCount = result.getValue(messageResultSet.columns[1]);
				log.debug("messageSearchObj result count","Date : " + Dte + " : Count : " + nCount);
          		//log.debug("messageSearchObj result count"," Count : " + nCount);
    		  return true;
    		});
    		
    }

    return {
        execute: execute
    };
    
});
