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
    		//id:'customsearch10628'
			id: 'customsearch10657'
    	});
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
	  var searchResults = JSON.parse(context.value);
	  log.debug("Search Results",searchResults.values);

	  var searchValue = searchResults.values;
	  
	  var fedex_ship_label = searchValue.custbody_fedex_shipping_label.text;
	  var so_insurance_appraisal = searchValue['custbody_sales_order_ia_file.createdFrom'].text;
	  var ds_Materials_sent_to_vendor = searchValue.custbody39;
	  var internalid = searchValue.internalid.value;
	  
	  log.debug("Fedex ", fedex_ship_label);
	  log.debug("SO Ins ", so_insurance_appraisal);
	  log.debug("DS mat ", ds_Materials_sent_to_vendor);
	  log.debug("Trans ID ", internalid);
	  //return false;
		// Push to website
		var response = File_Push_Status(fedex_ship_label, so_insurance_appraisal, ds_Materials_sent_to_vendor);
		
		//for testing
		response = {
			"Drop Ship Label Status": "Pushed to Portal"
		};

		//if(response.code == 200)
		//{
		  //var responsebody = JSON.parse(response.getBody());
		  //log.debug("Response message from API", JSON.stringify(response));
		  
		  var dropship_label_status = 'Pushed to Portal'; //response['Drop Ship Label Status']
		  
		  var itemRecord = record.load({
				  type: record.Type.ITEM_FULFILLMENT,
				  id: internalid,
				  isDynamic: true
				});
			log.debug("Item Record", itemRecord);
				
		  itemRecord.setText({
				fieldId:'custbody343',
				text: dropship_label_status
			  });
			  
		  var recId = itemRecord.save(); 
		  if(recId)
			 log.debug("Item record saved. Internal id : ",recId);
		/*}
		else
		{
		  log.debug("Portal error response is : ",response.body);
		}*/

    }

  	function  File_Push_Status(fedex_ship_label, so_insurance_appraisal, ds_Materials_sent_to_vendor)
    {
      //Setting up URL connect to website
      var url = "https://testportal.brilliantearth.com/api/"; 
      //var url = "https://www.brilliantearth.com/netsuite-api/update-promotion-code-status/";

      //Setting up Headers
      var headers = new Array();
      headers['http'] = '1.1';
      headers['Accept'] = 'application/json';
      //headers['AUTH-TOKEN']= 'YnJpbGxpYW50ZWFydGggYmViZTEz';
      headers['Authorization']= 'db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
      headers['Content-Type'] = 'application/json';
      headers['User-Agent-x'] = 'SuiteScript-Call';

      var jsonobj = {
        "FedEx Shipping Label": fedex_ship_label,
        "Sales Order Insurance Appraisal" : so_insurance_appraisal,
		"Drop Ship Materials Sent to Vendor" : ds_Materials_sent_to_vendor
      }
      
	  var myJSONText = JSON.stringify(jsonobj, Replace_Value);
      log.debug("File Push Status Response Body From NS", myJSONText);
      /*var response = https.post({
			url: url,
			body: myJSONText,
			headers: headers
		});
      return response;*/
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
	  if (summary.inputSummary.error) {
        log.error('Input Error', summary.inputSummary.error);
      };
      summary.mapSummary.errors.iterator().each(function(key, error) {
        log.error('Map Error for key: ' + key, error);
        return true;
      });

      summary.reduceSummary.errors.iterator().each(function(key, error) {
        log.error('Reduce Error for key: ' + key, error);
        return true;
      });
    }

    return {
        getInputData: getInputData,
        map: map,
        //reduce: reduce,
        summarize: summarize
    };

});