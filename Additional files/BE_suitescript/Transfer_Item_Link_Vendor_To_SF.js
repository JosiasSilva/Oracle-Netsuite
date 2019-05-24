/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/runtime'],
    function(search, record, runtime) {
        function getSearchResults() {
            try {

                var mySearch = search.load({
                    id: 'customsearch_item_link_vendor_to_sf'
                });
                var search_record = mySearch.run();
                search_record.each(processResults);
            } catch (e) {
                log.debug({
                    title: e.name,
                    details: e.message
                });
            }
        }
        return {
            execute: getSearchResults
        };

        function processResults(result) {

            try {
                var lineID;
                var trnsfr_item_id = result.getValue(result.columns[1]);
                var so_id = result.getValue(result.columns[14]);

                var obj_so = record.load({
                    type: record.Type.SALES_ORDER,
                    id: so_id
                });

                var lineCount = obj_so.getLineCount({
                    sublistId: 'item'
                });

                for (var i = 0; i < lineCount; i++) {
                    var sublistItemValue = obj_so.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    if (trnsfr_item_id == sublistItemValue) {
                        obj_so.setSublistValue('item', 'location', i, '2');
                        break;
                    }

                }
                obj_so.save();

            } catch (ex) {
                log.debug({
                    title: ex.name,
                    details: ex.message
                });

            }

            return true;
        }
    });