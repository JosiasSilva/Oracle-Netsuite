/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime'],
    /**
     * @param {serverWidget} serverWidget
     */
    function(search, record, runtime) {
	function myBeforeLoad (context) {
		
		var soRecord = context.newRecord;
		var soId = soRecord.id;
		log.debug("soId", soId);
		checkApproveOrCanelledStatus(soId);
		
	}
	
	function checkApproveOrCanelledStatus(soId)
	{
		var filters1 = search.createFilter({
			name: 'internalid',
			operator: search.Operator.IS,
			values: soId
			});
		/*var filters2 = search.createFilter({
			name: 'field',
			join: 'systemnotes',
			operator: search.Operator.ANYOF,
			values: 'documentstatus'
			});*/
		/*var filters3 = search.createFilter({
			name: 'mainline',
			operator: search.Operator.IS,
			values: true
			});*/
		var columns1 = search.createColumn({
			name: 'field',
			join: 'linesystemnotes'
			});
		var columns2 = search.createColumn({
			name: 'oldvalue',
			join: 'linesystemnotes'
			});
		var columns3 =search.createColumn({
			name: 'newvalue',
			join: 'linesystemnotes'
			});
		var columns4 =search.createColumn({
			name: 'date',
			join: 'linesystemnotes',
			sort: search.Sort.DESC
			});
			
		var searchRecords = search.create({
			type: search.Type.SALES_ORDER,
			filters: [filters1],
			columns: [columns1,columns2,columns3,columns4]
		}).run().getRange({ start: 0, end: 1000 });
        
        if(searchRecords != "")
        {
        	log.debug("API Test", searchRecords.length+'/searchRecords='+searchRecords.length);
        	for (var i = 0; i < searchRecords.length; i++) {
        		var soId = searchRecords[0].id;
    			//log.debug("API Test",'soId ='+soId);
    			var oldvalue = searchRecords[i].getValue({
    				name: 'oldvalue',
    				join: 'linesystemnotes'
    				});
    			var newvalue = searchRecords[i].getValue({
    				name: 'newvalue',
    				join: 'linesystemnotes'
    				});
    			var field = searchRecords[i].getValue({
    				name: 'field',
    				join: 'linesystemnotes'
    				});
    			log.debug("API Test",'oldValue ='+oldvalue+'/newvalue ='+newvalue+'/field ='+field);
    			//Type is Cancelled or Approved
    			if(field == 'documentstatus' && oldvalue == 'Pending Approval' && (newvalue == 'Cancelled' || newvalue == 'Pending Fulfillment'))
    			{
    				var MyAccount_WebInfo="T";	
					/*var submitFields = record.submitFields({
						type: record.Type.SALES_ORDER,
						id: soId,
						values: {
							custbody_my_account_info_on_web: MyAccount_WebInfo
						},
					});*/
    				log.debug("Inside map",'Current value of My Account Web Information is : ='+MyAccount_WebInfo);
    				break;
    			}
        	}	
        }
	}
	
	return {
		beforeLoad: myBeforeLoad,
		};
});