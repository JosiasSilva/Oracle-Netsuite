/*
Script Author : 	Nikhil Bhutani ([nikhil.bhutani@inoday.com](mailto:nikhil.bhutani@inoday.com))
Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
Script Type : 		Suitescript (Scheduled Script)
Script Name :		Sales Order & IA File Scheduled Emails
Created Date : 		07/30/2018
Last Mod Date :		08/02/2018
Comments :			NS-1282
SS URL :			https://system.netsuite.com/app/common/scripting/script.nl?id=2447
PS URL:				https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2408&whence=
*/
function sendEmails() {
	try {
		// Checking for remaining usage
		if (nlapiGetContext().getRemainingUsage() < 500) {
			var stateMain = nlapiYieldScript();
			if (stateMain.status == 'FAILURE') {
				nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
				throw "Failed to yield script";
			} else if (stateMain.status == 'RESUME') {
				nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
			}
		}

		//	Varialble declarations
		var searched = 0;
		var filearray = [];
		var htmlemailstring = '<html><head></head><body> This email contains attachment with Sales Orders & IA files.</body></html>';
		var subject = 'Sales Orders & IA files';
		var emailfrom = 33936; //internal id of OPS Shipping Employee
		//var emailto = 'eito@brilliantearth.com';
      	var emailto = 'opsshipping@brilliantearth.com';
		//var emailto='nikhil.bhutani@inoday.com';
		var attachTo = [];
		var filename = 'Sales_Order_IA_Files';
      	var bulkemail = true;
      	var no_of_labels_merged = 80;
		attachTo['entity'] = 33936; //internal id of OPS Shipping Employee

		// var results = nlapiLoadSearch(null, 7827); //Production & Sandbox
		var search = nlapiLoadSearch('salesorder', 'customsearch_salesorder_ia_print_queue');
		var resultset = search.runSearch();

		//	Using do-while loop in case the records are greater than 1000
		do {
          if (nlapiGetContext().getRemainingUsage() < 500) {
			var stateMain = nlapiYieldScript();
			if (stateMain.status == 'FAILURE') {
				nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
				throw "Failed to yield script";
			} else if (stateMain.status == 'RESUME') {
				nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
			}
		}
			filearray = [];
			var results = resultset.getResults(searched, searched + no_of_labels_merged);
			if (results.length == 0 || results == '' || results == null) {
			nlapiLogExecution('Debug', 'No Files found.');
			return;
			} else {
			//	Looping through each record obtained from the search and getting the required values
				for (var i = 0; results != null && results != '' && i < results.length; i++) {
					var labelfile = results[i].getValue('custbody_sales_order_ia_file');
					filearray.push(labelfile);
				}
			}
			if (results.length != 0){
		//	Creating a variable for getting the merged pdf file and calling the mergePDFs function then sending the mail
			var consolidatedfile = mergePDFs(filearray);
			consolidatedfile.setName(filename+searched + '.pdf');
			nlapiSendEmail(emailfrom, emailto, subject+searched+'.pdf', htmlemailstring, null, null, attachTo, consolidatedfile, bulkemail);
			nlapiLogExecution('Debug', 'Successfully Executed. Email Sent');
			}
			searched = searched + no_of_labels_merged;
		} while (results.length >= no_of_labels_merged);

	} catch (er) {
		nlapiLogExecution('Debug', 'Error in running the script', er.message);
	}
}


// Function called in main code to merge the individual pdf(s) containing Shipping Label(s)
function mergePDFs(get_file) {
	try {
		if (get_file) {
			var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
			xml += "<pdfset>";
			for (var s = 0; s < get_file.length; s++) {
				try {
					var fileURL = nlapiLoadFile(get_file[s]).getURL();
					xml += "<pdf src='" + nlapiEscapeXML(fileURL) + "'/>";
				} catch (er) {
					nlapiLogExecution('Debug', 'Error in getting individual files', er.message);
				}
			}
			xml += "</pdfset>";
			var file = nlapiXMLToPDF(xml);
			return file;
		} else {
			nlapiLogExecution('Debug', 'No files to be merged.');
			return false;
		}
	} catch (er) {
		nlapiLogExecution('Debug', 'Error in mergePDF function', er.message);
		return false;
	}
}