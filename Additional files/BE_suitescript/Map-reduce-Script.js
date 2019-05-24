/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 */
var SAVED_SEARCH_ID = 'customsearch_find_next_week_open_wo';
define(['N/search', 'N/record', 'N/runtime', 'N/error','N/log'],
       function(search, record, runtime, error,log)
       {
         function getInputData(){
           // log.debug('In Get Input data Stage');
           var mySearch = search.load({
             id: '8101'
           });
           return mySearch;
         }

         function map(context)
         {
           // log.debug('value',context.value);
           var searchResult = JSON.parse(context.value);
           var itemId = searchResult.id;
           var searchResult_value = JSON.parse(JSON.stringify(searchResult.values));
           var description = searchResult_value.salesdescription;
           var inventorylocation=searchResult_value.inventorylocation.value;
           var locationquantityavailable=searchResult_value.locationquantityavailable;
           if(!locationquantityavailable){locationquantityavailable=0;}
           var category = searchResult_value.custitem20.value;

        //   log.debug('value', "ITEM ID => "+ itemId +' \n description => '+description +' \n inventorylocation =>'+ inventorylocation +' \n locationquantityavailable =>'+ locationquantityavailable + "\ category =>"+category );


           var mySalesOrderSearch = search.create({ type: 'customrecord719',
                                                   columns: [{name: 'created'},
                                                             {name: 'custrecord_item_name_logs'}, 
                                                             {name: 'custrecord_inventory_location_logs'},
                                                             {name: 'custrecord_quantity_logs'}],
                                                   filters:
                                                   [{ name: 'custrecord_inventory_location_logs', operator: 'anyof', values: inventorylocation},
                                                    { name: 'custrecord_item_name_logs',operator: 'anyof',values: itemId}]
                                                  });
           var itemObj;
           mySalesOrderSearch.run().each(function(result) {
             var prevLogQty = result.getValue('custrecord_quantity_logs');
             var logId=result.id; 
             if (parseInt(prevLogQty) != parseInt(locationquantityavailable)) {
               itemObj = record.load({type: 'customrecord719' ,id: logId}); 
             }
             else
             {
               itemObj = "NO_CREATE_RECORD";         
             }
           });
           if(!itemObj && itemObj!="NO_CREATE_RECORD")
           {
             itemObj = record.create({type: 'customrecord719'});
           }
           if(itemObj!="NO_CREATE_RECORD")
           {
             itemObj.setValue("custrecord_inventory_location_logs", inventorylocation);
             itemObj.setValue("custrecord_quantity_logs", locationquantityavailable);
             itemObj.setValue("custrecord_item_name_logs", itemId);
             itemObj.setValue("custrecorddescription_logs", description);
             itemObj.setValue("custrecord_category_logs", category);
             itemObj.save({
               enableSourcing: true,
               ignoreMandatoryFields: true
             });
           }
         }

         return {
           getInputData: getInputData,
           map: map
         };
       });