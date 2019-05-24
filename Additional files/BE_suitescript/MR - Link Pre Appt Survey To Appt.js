/*
* Script Author 	: 	Nikhil Bhutani (nikhil.bhutani@inoday.com)
* Author/Designer 	: 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
* Script Type 		:	Suitescript (Scheduled Script)
* Script Name 		:	MR - Link Pre Appt Survey To Appt
* Created Date 		:	September 24, 2018
* Last Modified Date:	September 25, 2018 (Please put a comment with date when code is modified)
* Comments 			:	Refer NS-1339
* SB SS URL 		:	https://system.netsuite.com/app/common/scripting/script.nl?id=2534
* Production SS URL	:	
*/

/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
*/

define(['N/search', 'N/record', 'N/log'],function(search, record, log){
	function getInputData(inputContext)
	{
		var search9967 = search.load({
			id: 'customsearch9967'
		});
		return search9967;
	}

	function map(mapContext)
	{
		var search9967Data = JSON.parse(mapContext.value);
		mapContext.write({
			key: search9967Data.id,
			value: mapContext.value
		});
	}

	function reduce(reduceContext)
	{
		var arr_preApptSurvey = [];
		var apptmtId = reduceContext.key;
		// var customer_id = search.lookupFields({
		// type: 'calendarevent',
		// id: apptmtId,
		// columns: ['company']
		// });
		var loadedAppointment = record.load({
			type: 'calendarevent',
			id: apptmtId
		});
		var customer_id = loadedAppointment.getValue({
			fieldId: 'company'
		});
		var preApptSurveysSearch = search.create({
		type: 'customrecord848',
		filters: ['custrecord_customer', 'is', customer_id],
		columns:
		[
			search.createColumn({
				name: 'id',
				sort: search.Sort.ASC,
				label: 'ID'
			}),
			search.createColumn({name: 'custrecord_customer', label: 'Customer'}),
			search.createColumn({name: 'custrecord_added_to_appt', label: 'Added to Appointment'})
		]
		});
		var preApptSurveyspagedData = preApptSurveysSearch.runPaged();
		var preApptSurveysCount = preApptSurveyspagedData.count;
		log.debug('preApptSurveysSearch result count', preApptSurveysCount);
		preApptSurveyspagedData.pageRanges.forEach(function(pageRange){
			var eachPage = preApptSurveyspagedData.fetch({
				index: pageRange.index
			});

			eachPage.data.forEach(function(result){
				if(result.getValue('custrecord_added_to_appt') == false)
				{
					arr_preApptSurvey.push(result.id);
				}
				return true;
			});
		});
		if(arr_preApptSurvey && arr_preApptSurvey.length != 0)
		{
			var loadedapptmt = record.load({
				type: 'calendarevent',
				id: apptmtId
			});
			loadedapptmt.setValue({
				fieldId: 'custevent_survey',
				value: arr_preApptSurvey
			});
			var saved_appointment = loadedapptmt.save({
				enableSourcing: true,
				ignoreMandatoryFields: true
			});
			log.debug('Saved Appointment', saved_appointment);
		}
	}

	function summarize(summaryContext)
	{
		if (summaryContext.inputSummary.error) {
			log.debug('Input Error', summaryContext.inputSummary.error);
		};
		summaryContext.mapSummary.errors.iterator().each(function(key, error) {
			log.debug('Map Error for key: ' + key, error);
			return true;
		});
		summaryContext.reduceSummary.errors.iterator().each(function(key, error) {
			log.debug('Reduce Error for key: ' + key, error);
			return true;
		});
	}

	return {
    getInputData: getInputData,
    map: map,
    reduce: reduce,
    summarize: summarize
	};
});