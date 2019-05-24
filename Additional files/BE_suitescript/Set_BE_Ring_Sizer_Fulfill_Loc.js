/** 
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/ sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Scheduled Script
 * Script Job: Script sets BE Ring Sizer Fulfillment Location on Customer Page for the top 150 records of the search
 * Created Date  : March-7, 2017
 * Last Modified Date :  
 * Production Script URL:- https://system.netsuite.com/app/common/scripting/script.nl?id=1186&whence=
 * Sandbox Script URL:- https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=1183
 */
function setRingSizerFulfillmentLoc() {
    try {
           // var searchId = '5772';   //Sandbox Save search Id   
			var searchId = '5786';   //Production Save search Id   			
            var ObjSearch = nlapiLoadSearch(null, searchId);
            var searchResults = ObjSearch.runSearch();
            var startIndex = 0;
            var endIndex = 150;
            var resultSet=searchResults.getResults(startIndex, endIndex);
            if (resultSet) 
			{
                 for (var icount = 0; icount < resultSet.length; icount++) 
				 {
				   var customer_id=resultSet[icount].getId();
                   nlapiSubmitField('customer',customer_id,'custentityringsizer_fulfillment_location','1');       
				 }
			}

    } catch (err) {
        nlapiLogExecution("Error", "Error in setting BE Ring Sizer Fulfill Location", "Error : " + err.toString());

    }
}



