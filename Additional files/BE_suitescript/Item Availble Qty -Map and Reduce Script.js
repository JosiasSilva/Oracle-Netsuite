/**
         * @NApiVersion 2.0
         * @NScriptType MapReduceScript
         */
define(['N/search', 'N/record', 'N/runtime', 'N/error','N/log'],
       function(search, record, runtime, error,log)
       {
         function getInputData(){
           /*
           return  search.create({
             type: "inventoryitem",
             filters: [
               ["isinactive","is","F"],
               "and",["custitem20","anyof",['2','3']]
             ],
               columns:[
               {name:"internalid",sort: search.Sort.ASC}
             ]
           });
           */
           return  search.load({
             id: 'customsearch_login_inventory_level'
           });



         }
         function map(context)
         {
           var searchResult = JSON.parse(context.value);
           var itemId = searchResult.id;
           try
           {
             search.create({ type: 'customrecord719',
                            filters:
                            [['custrecord_item_name_logs','anyof',itemId]]
                           }).run().each(function(result) {

               record.delete({ type: 'customrecord719',id: result.id});
               return true;

             });
           }
           catch(er){}
           try
           {
             search.create({
               type: "inventoryitem",
               filters: [
                 ["internalid","anyof",itemId],
                 "and",["locationquantityavailable","greaterthan",0]
               ],
               columns:[
                 {name:"locationquantityavailable"},
                 {name:"inventorylocation"}
               ]
             }).run().each(function(result) {

               var itemObj = record.create({type: 'customrecord719'});
               itemObj.setValue("custrecord_inventory_location_logs", result.getValue('inventorylocation'));
               itemObj.setValue("custrecord_quantity_logs", result.getValue('locationquantityavailable'));
               itemObj.setValue("custrecord_item_name_logs", itemId);
               itemObj.save({
                 enableSourcing: true,
                 ignoreMandatoryFields: true
               });
               return true;
             });
           }catch(er){

             log.debug({ title: 'er', details: er.message});
           }
         }
         return {
           getInputData: getInputData,
           map: map
         };
       });