/*
Script Author : 	Nikhil Bhutani ([nikhil.bhutani@inoday.com](mailto:nikhil.bhutani@inoday.com))
Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
Script Type : 		Suitescript (Scheduled Script)
Script Name :		Shipping Labels Scheduled Emails
Created Date : 		June 11, 2018
Last Modified Date :	June 22, 2018
Comments :		Scheduled Script for sending a consolidated pdf of all the shipping labels for items shipping today - NS-1227
Script Sandbox URL:		https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2866&whence=
Production URL:  https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2310&whence=
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
        var htmlemailstring = '<html><head></head><body> This email contains attachments with shipping labels.</body></html>';
        var subject = 'Shipping Labels for today';
        var emailfrom = 33936; //internal id of OPS Shipping Employee
        var emailto = 'opsshipping@brilliantearth.com';
      	// var emailto=['jjohnsen@brilliantearth.com','opsshipping@brilliantearth.com','csmith@brilliantearth.com'];
      	var attachTo = [];
		attachTo['entity'] = 33936; //internal id of OPS Shipping Employee
        //var emailto = ;

        //	Defining filters for creating a search
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
        filters[1] = new nlobjSearchFilter('custbody110', 'createdfrom', 'on', 'today');
        filters[2] = new nlobjSearchFilter('custbody140', 'createdfrom', 'noneOf', ['7', '8', '10', '11', '14', '17', '18', '20', '21', '22', '23', '24', '25']);
        filters[3] = new nlobjSearchFilter('custbody_fedex_shipping_label', null, 'noneOf', '@NONE@');
        filters[4] = new nlobjSearchFilter('custbody_fedex_label_printed', null, 'is', 'F');
        filters[5] = new nlobjSearchFilter('custbody194', 'createdfrom', 'noneOf', ['6', '9', '12', '13', '15']);
        filters[6] = new nlobjSearchFilter('status', null, 'noneOf', 'ItemShip:C');

        //	Defining result columns needed from search
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('internalid', 'createdfrom');
        columns[1] = new nlobjSearchColumn('custbody_fedex_shipping_label');
      	columns[2] = new nlobjSearchColumn('altname','customer').setSort();

        //	Creating a Search using above filters and columns on itemfulfullment
        var search = nlapiCreateSearch('itemfulfillment', filters, columns);

        var resultset = search.runSearch();
	var results;

        //	Using do-while loop in case the records are greater than 1000
        do {
            	results = resultset.getResults(searched, searched + 1000);
            if (results.length == 0 || results == '' || results == null) {
                nlapiLogExecution('Debug', 'No labels found.');
                return;
            } else {
                //	Looping through each record obtained from the search and getting the required values
                for (var i = 0; results != null && results != '' && i < results.length; i++) {
                    var labelfile = results[i].getValue('custbody_fedex_shipping_label');
					filearray.push(labelfile);
                }
            }
        } while (results.length >= 1000);

        if (results.length != 0){
            //	Creating a variable for getting the merged pdf file and calling the mergePDFs function then sending the mail
            var consolidatedfile = mergePDFs(filearray);
            consolidatedfile.setName('ShippingLabels.pdf');
			for(var c = 0; results != null && results != '' && c < results.length; c++) {
				nlapiSubmitField('itemfulfillment',results[c].getId(),'custbody_fedex_label_printed','T');
			}
            nlapiSendEmail(emailfrom, emailto, subject, htmlemailstring, null, null, attachTo, consolidatedfile);
            nlapiLogExecution('Debug', 'Successfully Executed. Email Sent');
        }
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