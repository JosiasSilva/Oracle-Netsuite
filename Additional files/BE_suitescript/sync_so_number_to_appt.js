/**

@NApiVersion 2.0
@NScriptType MapReduceScript
*/
define(["N/record", "N/search", 'N/runtime', 'N/error', 'N/log', 'N/format'],

 function(record, search, runtime, error, log, format) {
     function getInputData(context) {
         var mySearch = search.load({
             id: 'customsearch10025'
         });
         return mySearch;
     }

     function map(context) {
         //map all variables
         var result = JSON.parse(context.value);
         try {

             var appt_id = result.id;
             var fieldLookUp = search.lookupFields({
                 type: search.Type.CALENDAR_EVENT,
                 id: appt_id,
                 columns: 'company'
             });
 
             var salesorderSearchObj = search.create({
                 type: "salesorder",
                 filters: [
                     ["type", "anyof", "SalesOrd"],
                     "AND",
                     ["mainline", "is", "T"],
                     "AND",
                     ["status", "noneof", "SalesOrd:G", "SalesOrd:H", "SalesOrd:C"],
                     "AND",
                     ["custbody53", "is", "T"],
                     "AND",
                     ["name", "anyof", fieldLookUp.company[0].value]
                 ],
                 columns: []
             });
             var arrListOfSOs = [];
             var searchResultCount = salesorderSearchObj.runPaged().count;
             log.debug("salesorderSearchObj result count", searchResultCount);
             salesorderSearchObj.run().each(function(result) {
                         // .run().each has a limit of 4,000 results
                         arrListOfSOs.push(result.id);
               
                         return true;
              });
          	var id = record.submitFields({
               type: record.Type.CALENDAR_EVENT,
               id: appt_id,
               values: {
               custevent_pickup_apt_sales_order: arrListOfSOs
               },
               options: {
               enableSourcing: false,
               ignoreMandatoryFields : true
               }
              });

                 log.debug({
                     title: 'Submitted SO Ids ',
                     details: JSON.stringify(arrListOfSOs)
                 });
             }
             catch (error) {
                 log.debug({
                     title: 'Error',
                     details: error
                 });
             }
         }

         function reduce(context) {
         }

         function Summarize(summary) {
            }
            return {
                getInputData: getInputData,
                map: map,
                reduce: reduce,
                summarize: Summarize
            };
});

