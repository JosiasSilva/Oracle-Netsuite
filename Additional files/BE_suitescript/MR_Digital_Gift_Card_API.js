/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/https', './moment.min', 'N/format'],
/**
 * @param {record} record
 * @param {search} search
 * @param {https} https
 */
function(record, search, https, moment, format) {

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

		var timeNow = new Date().getTime();
		var tempDateNow = new Date(timeNow);
		var currentTime = format.format({value:tempDateNow, type: format.Type.DATETIME});
		
    	var tFrame = getTimeFrame(currentTime);
      	var startTime;
      	var endTime;
      
		//log.debug("Time Frame", tFrame);
      	var promoSearch = search.load({
    		id:'customsearch10650'
    	});
	
      log.debug("Time Frame", tFrame);
      //if (startTime == null) {
        startTime = tFrame[3].from;
      	endTime = tFrame[0].to;
        
        log.debug("Time Frame1", startTime);
        log.debug("Time Frame2", endTime);
        
		var filters = promoSearch.filters;
        var filterOne = search.createFilter({
                                             name: 'lastmodifieddate',
                                             operator: search.Operator.WITHIN,
											 values: [startTime, endTime]
                                              });
        //filters.push('and');
      	filters.push(filterOne);

		
		//log.debug("Promo Search", promoSearch);
		
		return promoSearch;
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

          var searchValue = searchResults.values;
          var digiGift = ''; //searchValue.custbody_digital_gift_card;
          var recType = searchValue.type.value;
          //log.debug("recType",recType);
          if(recType == 'SalesOrd')
            digiGift = searchValue.custbody_digital_gift_card;
          if(recType == 'RtnAuth')
            digiGift = searchValue['custbody_digital_gift_card.createdFrom'];
          
          /*if (digiGift == null) {
            log.debug("Gift crd inside",searchValue['custbody_digital_gift_card'].createdFrom);
            log.debug("Gift crd inside1",searchValue['custbody_digital_gift_card']['createdFrom']);
            digiGift = searchValue['custbody_digital_gift_card.createdFrom'];
          }*/
          
          //log.debug("GIFT ", digiGift);
            // Push to website
            if(digiGift){
              var response = Update_Promotion_Code_Status(digiGift);

              if(response.code == 200){
              //  var responsebody = JSON.parse(response.getBody());
              //  log.debug("Portal response for Push LD to WS",responsebody.message);

              log.debug("Gift Card detail sent to the portal", digiGift);
                //log.debug("Response message from API", JSON.stringify(response));
              }
              else{
                log.debug("Error while sending Gift Card detail to Portal. Gift Card#  ",digiGift);
              }
            }
      }
      catch (e){
        log.debug("Error from the Map stage is",e.message);
      }

    }

  	function  Update_Promotion_Code_Status(codeStr)
    {
      //Setting up URL connect to website
      //var url = "https://prepublish.brilliantearth.com/netsuite-api/update-promotion-code-status/";
      var url = "https://staging2015.brilliantearth.com/netsuite-api/update-promotion-code-status/";
      //var url = "https://www.brilliantearth.com/netsuite-api/update-promotion-code-status/";

      //Setting up Headers
      var headers = new Array();
      headers['http'] = '1.1';
      headers['Accept'] = 'application/json';
      headers['AUTH-TOKEN']= 'YnJpbGxpYW50ZWFydGggYmViZTEz';
      headers['Authorization']= 'Basic YmV0ZWFtOkdsb3c4OWdsYXNz'; //Test Portal
      //headers['Content-Type'] = 'application/json';
      
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers['User-Agent-x'] = 'SuiteScript-Call';

      var myJSONText = 'code=' +   codeStr;
      
      //log.debug("PROMO Status Response Body From NS", myJSONText);
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
  
   
  function getTimeFrame(currentTime) {
		
		//var hours = tempDateNow.getHours();
		
		log.debug("CTIME", currentTime);
		
		var timestampString = currentTime; //'03/12/2019 02:39 am';
		
		var firstTo = moment(timestampString , 'MM-DD-YYYY hh:mm a');

		// Calculate first "from" time using startOf to "round down" to 
		// start of current hour
		var firstFrom = firstTo .clone().startOf('hour');

		var format = 'MM/DD/YYYY hh:mm a'

		// Add first formatted range into timeRanges array    
		/*var timeRanges = [{ 
			from : firstFrom.format(format), 
			to : firstTo.format(format) 
		}]*/
        var timeRanges = [];

		// Iterate three times to compute and add remaining time ranges
		// to timeRanges result array
		for(var i = 0; i < 4; i++) {

			// Calculate "from" and "to" times for each of the remaining 
			// times ranges we want to calculate
			var from = firstFrom.clone().subtract(i + 1, 'hours').startOf('hour')
			var to = firstFrom.clone().subtract(i - 1, 'hours').startOf('hour')

			// Add formatted time range to timeRanges array
			timeRanges.push({ 
				from : from.format(format),
				to : to.format(format)
			 })
		}

		return timeRanges;	
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