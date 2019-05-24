/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/https'],
/**
 * @param {record} record
 * @param {search} search
 * @param {https} https
 */
function(record, search, https) {

    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {

    	return search.load({
    		id:'customsearch_loose_dia_to_web'
    	});

    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	try {
          var searchResults = JSON.parse(context.value);
          //log.debug("Search Results",searchResults.values);

          var searchValues = searchResults.values;
		  var searchType;
		  
		  if (searchValues.Type == 'INVITEM') {
			searchType = record.Type.INVENTORY_ITEM;
		  }
		  else {
			searchType = record.Type.INVENTORY_ITEM; 
		  }

          var itemRecord = record.load({
              type: record.Type.INVENTORY_ITEM,
              id: searchResults.id,
              isDynamic: true
            });
            //log.debug("Search Results",itemRecord);

            var itemId = itemRecord.getValue({
              fieldId:'itemid'
            });

            var itemId_suffix = itemId.slice(-1);
            var changedItemId;

            /* // Manipulation of Item ID
			if (searchValues.custitem_pushtoweb == "T") {
              if (searchValues.custitem_pushtowebstatus.text == 'Switch to B') {

                if (itemId_suffix == 'A' || itemId_suffix == 'Y') {
                        changedItemId = itemId.substring(0, itemId.length - 1) + 'B';
                    }
                }
                else if (searchValues.custitem_pushtowebstatus.text == 'Reverse Memo') {
                  log.debug("Item Suffix",itemId_suffix);
                  log.debug("Item PTW Text",searchValues.custitem_pushtowebstatus.text);
                  if (itemId_suffix == 'B') {
                        changedItemId = itemId.substring(0, itemId.length - 1) + 'Y';
                    }
                }
            }*/
            // Push to website
            var response = Push_Loose_Diamonds_To_Portal(itemId);

            if(response.code == 200)
            {
              var responsebody = JSON.parse(response.getBody());
              log.debug("Portal response for Push LD to WS",responsebody.message);

              // Save it to Netsuite
              itemRecord.setValue({
                fieldId:'itemid',
                value: responsebody.changedItemId
              });
              log.debug("Updated Current Item Text",responsebody.changedItemId);
              itemRecord.save();
            }
            else
            {
              log.debug("Portal error response is : ",response.body);
            }

      }
      catch (e){
        log.debug("Error from the Map stage is",e.message);
      }

    }

  	function  Push_Loose_Diamonds_To_Portal(actualItemId)
    {
      //Setting up URL conect to website
      //var url = "https://partner.brilliantearth.com/api/ldp/";
      //var url = "https://testportal.brilliantearth.com/api/ldp/";

      //Setting up Headers
      var headers = new Array();
      headers['http'] = '1.1';
      headers['Accept'] = 'application/json';
      // headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
      //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
      headers['Content-Type'] = 'application/json';
      headers['User-Agent-x'] = 'SuiteScript-Call';

      var jsonobj = {
        "LDItemId":   actualItemId
      }
      //Stringifying JSON
      var myJSONText = JSON.stringify(jsonobj, Replace_Value);
      log.debug("Stock_Suffix Response Body From NS", myJSONText);
      var response = https.post({
			url: url,
			body: myJSONText,
			headers: headers
		});
      return response;
    }

  	function Replace_Value(key, value)
    {
      if (typeof value == "number" && !isFinite(value))
      {
        return String(value);
      }
      return value;
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map
        //reduce: reduce,
        //summarize: summarize
    };

});