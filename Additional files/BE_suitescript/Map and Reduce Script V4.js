/**
         * @NApiVersion 2.0
         * @NScriptType MapReduceScript
         */
define(['N/search', 'N/record', 'N/runtime', 'N/error','N/log'],
       function(search, record, runtime, error,log)
       {
         function getInputData(context){
           var save_search_name = runtime.getCurrentScript().getParameter({name:'custscript_save_search_id'});
           var load_search=search.load({id: save_search_name});
           var get_filter=load_search.filters;
           for(var a=0;a<get_filter.length;a++)
           {
             var filter_name=get_filter[a].name;
             if(filter_name=='internalidnumber')
             {
               obj_length=JSON.parse(JSON.stringify(get_filter[a])).values;
             }
           }
           if(obj_length)
           {
             try
             {
               search.create({ type: 'customrecord719',
                              filters:['custrecord_item_name_logs.internalidnumber','between',obj_length],
                              columns: [{ name: 'internalid',join:'custrecord_item_name_logs',sort:"ASC" }]
                             }).run().each(function(result) {

                 record.delete({ type: 'customrecord719',id: result.id});
                 return true;

               });
             }
             catch(er){
               log.debug({ title: 'er', details:er.message});
             }
           }

           return  load_search;
         }
         function map(context)
         {
           var searchResult = JSON.parse(context.value);
           var itemId = searchResult.id;    
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