/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * Developed By: Bharath (Zag Insight)
 */
define(['N/record', 'N/search'],
    /**
     * @param {record} record
     * @param {search} search
     */
    function(record, search) {
        var vendorValue;
        function getInputData() {
          // Get Search
            return search.load({id: 10164});
        }
  
     function map(context) {

            var searchResults = JSON.parse(context.value);

            // Get item and Original SO

            var itemId = searchResults.values.custbody107.value;
            var orig_so = searchResults.values.custbody_created_from.value;

            if (orig_so) {
               
                var soRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: orig_so
                });

                var lineCount = soRecord.getLineCount({
                    sublistId: 'item'
                });
                var lineNumber = soRecord.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: itemId
                    });
					// findSublistLineWithValue returns -1 if not found; check lineNumber value before passing it in below code
					if(lineNumber > -1)
						vendorValue = soRecord.getSublistValue({
							sublistId: 'item',
							fieldId: 'povendor',
							line: lineNumber
						});
            }

            if (vendorValue) {
			 try{ 
                var sorepRec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: searchResults.id
                });
				
                sorepRec.setValue({
                    fieldId: 'custbodyoriginal_production_vendor',
                    value: vendorValue
                });

                var recId = sorepRec.save(); 
				log.debug('Original Sales Order Updated','Record Id: '+ recId);
				}catch(err){
					log.error(err.name, err.message);
				}
            }
        }
        return {
            getInputData: getInputData,
            map: map
        };
    });
