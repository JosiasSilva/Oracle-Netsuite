/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/format', 'N/record', 'N/search'],
  /**
   * @param {file} file
   * @param {format} format
   * @param {record} record
   * @param {search} search
   */
  function(format, record, search) {
    //var nextHolidayDt = '';

    function GetNextHolidayDate() {
      var nxtHolidayDt = null;
      var strNextHolidayDt = '';
      var strNextHolidayDate = '';
      var HoliDaySearchObj = search.create({
        type: "customrecordholiday_table_child",
        filters: [
          ["custrecord_all_location", "is", "T"],
          "AND",
          ["custrecord_holiday_date", "after", "today"]
        ],
        columns: [
          search.createColumn({
            name: "custrecord_holiday_date",
            sort: search.Sort.ASC,
            label: "Holiday Date"
          }),
          search.createColumn({
            name: "formulatext",
            formula: "TO_CHAR({custrecord_holiday_date},'YYYYMMDD')",
            label: "YYYYMMDD"
          }),
        ]
      });
      //var searchResultCount = HoliDaySearchObj.runPaged().count;
      //log.debug("HoliDaySearchObj result count",searchResultCount);
      HoliDaySearchObj.run().each(function(result) {
        //nxtHolidayDt = result.getValue({name:'custrecord_holiday_date'});
        strNextHolidayDate = result.getValue({
          name: "formulatext",
          formula: "TO_CHAR({custrecord_holiday_date},'YYYYMMDD')"
        });
        //log.audit("nxtHolidayDt: ", nxtHolidayDt + " : strNextHolidayDate : " + strNextHolidayDate);
      });
      //nextHolidayDt = strNextHolidayDate;
      return strNextHolidayDate;
    }

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

      var nextHolidayDt = GetNextHolidayDate();

      log.audit("nextHolidayDt in getInputData : ", nextHolidayDt);
      //var objSearchNxtHoliday = search.load({id: 'customsearch_next_holiday_date_update_2'});
      var objSearchNxtHoliday = search.create({
        type: "transaction",
        filters: [
          ["type", "anyof", "SalesOrd", "PurchOrd"],
          "AND",
          ["mainline", "is", "T"],
          "AND",
          ["status", "anyof", "PurchOrd:B", "PurchOrd:D", "PurchOrd:E", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E"],
          "AND",
          [
            ["custbody_next_holiday_date", "onorbefore", "today"], "OR", ["custbody_next_holiday_date", "on", "12/16/2018"], "OR", ["custbody_next_holiday_date", "isempty", ""]
          ]
        ],
        columns: [
          search.createColumn({
            name: "datecreated",
            sort: search.Sort.DESC,
            label: "Date Created"
          }),
          search.createColumn({
            name: "type",
            sort: search.Sort.ASC,
            label: "Type"
          }),
          //search.createColumn({name: "tranid", label: "Document Number"}),
          //search.createColumn({name: "entity", label: "Name"}),
          //search.createColumn({name: "custbody_next_holiday_date", label: "Next Holiday Date"}),
          //search.createColumn({name: "statusref", label: "Status"}),
          search.createColumn({
            name: "formulatext",
            formula: nextHolidayDt,
            label: "YYYYMMDD"
          })
        ]
      });

      return objSearchNxtHoliday;
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
      // log.audit('context', context);
      var startTime = new Date().getTime();
      var searchNxtHoliday = JSON.parse(context.value);
      var transType = searchNxtHoliday.values['type'].value;
      var recId = searchNxtHoliday.id;
      var nextDt = searchNxtHoliday.values['formulatext'];
      if (nextDt) {
        var nxtYY = nextDt.substr(0, 4);
        var nxtMM = nextDt.substr(4, 2);
        var nxtDD = nextDt.substr(6, 2);
        //var nextHolidayDt = nxtMM + '/' + nxtDD + '/' + nxtYY;
        nxtMM = nxtMM - 1;
        var Holidaydt = new Date(nxtYY, nxtMM, nxtDD);
        var HolidayDate = format.parse({
          value: Holidaydt,
          type: format.Type.DATE
        });
        var recType = '';
        //log.audit("Data in map : ", "transType : " + transType + " : nextDt :" + nextDt + " : Holidaydt : " + Holidaydt + " : HolidayDate : " + HolidayDate);
        //log.audit("searchNxtHoliday in map : ", JSON.stringify(searchNxtHoliday) + " : searchNxtHoliday.id : " + searchNxtHoliday.id);

        if (transType == "SalesOrd") {
          recType = record.Type.SALES_ORDER;
        } else if (transType == "PurchOrd") {
          recType = record.Type.PURCHASE_ORDER;
        }

        try {
          var updId = record.submitFields({
            type: recType,
            id: recId,
            values: {
              'custbody_next_holiday_date': HolidayDate
            },
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true
            }
          });
          if (updId) {
            //log.debug('Record Processed record with Internal Id : ' + recId, "Record Type : " + recType + " : Holiday Day Updated : " + HolidayDate);
          }
        } catch (error) {
          log.error('Error while Processing record with Internal Id : ' + recId, error.message);
        }
      }
      var EndTime = new Date().getTime();
      var totTime = EndTime - startTime;
      log.debug("totTime : ", totTime);
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
    }

    return {
      getInputData: getInputData,
      map: map,
      // reduce: reduce,
      summarize: summarize
    };

  });
