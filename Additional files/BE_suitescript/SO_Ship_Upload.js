nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*
  Title: SO Date To Ship CSV Upload Script
  Date: 12-11-2011
  Type: Suitelet and Schedule Script
  Usage: 20 + 20x Line Item (499 Max Line Items)
  Description: CSV upload setting Date To Ship (custbody110) on Sales Order
*/

var Upload_Folder_ID = 5749; //Internal ID of folder to upload to

function Date_To_Ship_Upload_Form(request, response)
{
	var user = nlapiGetUser()
	
	if(request.getMethod()=="GET")
	{
		try{
			//Generate SO Date To Ship CSV Upload Form
			var form = nlapiCreateForm("Sales Order Date To Ship Upload")
			form.addField("custpage_so_upload_file", "file", "CSV Upload File")
			form.addSubmitButton("Upload")
			response.writePage(form)
		}
		catch(err){
			nlapiLogExecution("error", "Error Occurred", "An error has occurred while creating the SO date to ship csv upload form. Details: " + err.message)
			nlapiSendEmail(user, user, 'Date To Ship CSV Upload Error', 'An error has occurred while creating the SO date to ship csv upload form. Details: ' + err.message + '. Please forward onto your system administration if this problem persists.')
			return;
		}
	}
	else
	{
		//CSV File Save and Schedule Script Call
		try{
			var upload_file = request.getFile("custpage_so_upload_file")
			if(upload_file==null)
				return;
			
			upload_file.setFolder(Upload_Folder_ID)
			var fileID = nlapiSubmitFile(upload_file)
			
			var params = new Array()
			params["custscript_so_date_to_ship_file"] = fileID
			params["custscript_so_date_to_ship_start_line"] = 0
			params["custscript_so_date_to_ship_user"] = user
			
			//Trigger scheduled script to handle CSV upload to Sales Order(s)
			nlapiScheduleScript("customscript_so_ship_upload_proc", "customdeploy_so_ship_upload_proc", params)
			
			response.write("<h2>Your upload has been sent for processing. Please wait for confirmation email.</h2>")
		}
		catch(err){
			nlapiLogExecution("error", "Error Occurred", "An error has occurred while uploading CSV file to file cabinet and triggering scheduled script. Details: " + err.message)
			nlapiSendEmail(user, user, 'Date To Ship CSV Upload Error', 'An error has occurred while executing scheduled script for SO date to ship CSV upload. Details: ' + err.message + '. Please forward onto your system administration if this problem persists.')
			return;
		}
	}
}

function Process_Upload_File()
{
	try{
		//Retrieve file ID from script parameters and load file
		var user = nlapiGetContext().getSetting("SCRIPT", "custscript_so_date_to_ship_user")
		var upload_file_id = nlapiGetContext().getSetting("SCRIPT", "custscript_so_date_to_ship_file")
		if(upload_file_id==null || upload_file_id=="")
			return;
			
		var upload_file = nlapiLoadFile(upload_file_id)
	}
	catch(err){
		nlapiLogExecution("error", "Error Occurred", "An error has occurred while retrieving and loading file from script parameters. Details: " + err.message)
		nlapiSendEmail(user, user, 'Date To Ship CSV Upload Error', 'An error has occurred while getting URL parameters for CSV Date To Ship upload script. Details: ' + err.message + '. Please forward onto your system administration if this problem persists.')
		return;
	}
	
	try{
		//Parse CSV file and start line of processing
		var csv_lines = CSVToArray(upload_file.getValue())
		var start_line = nlapiGetContext().getSetting("SCRIPT", "custscript_so_date_to_ship_start_line")
		if(start_line==null || start_line=="")
			return;	
	}
	catch(err){
		nlapiLogExecution("error", "Error Occurred", "An error has occurred while parsing CSV file. Details: " + err.message)
		nlapiSendEmail(user, user, 'Date To Ship CSV Upload Error', 'An error has occurred while loading the CSV file. Details: ' + err.message + '. Please forward onto your system administration if this problem persists.')
		return;
	}
	
	try{
		//Get Current Date
		var currentDate = new Date()
	}
	catch(err){
		nlapiLogExecution("error", "Error Occurred", "An error has occurred while getting current date. Details: " + err.message)
		nlapiSendEmail(user, user, 'Date To Ship CSV Upload Error', 'An error has occurred while getting current date during Date To Ship CSV upload. Details: ' + err.message + '. Please forward onto your system administration if this problem persists.')
		return;
	}
	
	try{
		//Loop through CSV lines and set Date To Ship field on corresponding PO sales orders
		for(var x=start_line; x < csv_lines.length && x < 331; x++)
		{
			var sales_order_num = csv_lines[x][0] //COLUMN 1
			
			if(sales_order_num != null && sales_order_num != "")
			{
				var filters = new Array()
				filters[0] = new nlobjSearchFilter("tranid", null, "is", sales_order_num)
				filters[1] = new nlobjSearchFilter("mainline", null, "is", "T")
				
				var results = nlapiSearchRecord("salesorder", null, filters)
				
				if(results != null)
				{	
					//IF SALES ORDER FOUND SET CUSTBODY110 (DATE TO SHIP) TO CURRENT DATE
					nlapiSubmitField("salesorder", results[0].getId(), "custbody110", nlapiDateToString(currentDate))
				}
			}
		}
		
		if(csv_lines.length > 331 && start_line+331 < csv_lines.length)
		{
			start_line += 331;
			var params = new Array()
			params["custscript_so_date_to_ship_file"] = upload_file_id
			params["custscript_so_date_to_ship_start_line"] = start_line
			params["custscript_so_date_to_user"] = user
			
			//Trigger scheduled script to handle CSV upload to Sales Order(s)
			nlapiScheduleScript("customscript_so_ship_upload_proc", "customdeploy_so_ship_upload_proc", params)
		}
		else
		{
			//If that is all then send completion email notification to user
			nlapiSendEmail(user, user, 'Date To Ship CSV Upload Complete', 'Your uploading of Date To Ship values is complete.')
		}
	}
	catch(err){
		nlapiLogExecution("error", "Error Occurred", "An error has occurred while setting Date To Ship field on Sales Order #" + sales_order_num + ". Details: " + err.message)
		nlapiSendEmail(user, user, 'Date To Ship CSV Upload Error', 'An error has occurred while updating sales orders with Date To Ship information. Details: ' + err.message + '. Please forward onto your system administration if this problem persists.')
		return;
	}
}

// This will parse a delimited string into an array of 
// arrays. The default delimiter is the comma, but this 
// can be overriden in the second argument. 
function CSVToArray( strData, strDelimiter ){ 
    // Check to see if the delimiter is defined. If not, 
    // then default to comma. 
    strDelimiter = (strDelimiter || ","); 

    // Create a regular expression to parse the CSV values. 
    var objPattern = new RegExp( 
            ( 
                    // Delimiters. 
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + 

                    // Quoted fields. 
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + 

                    // Standard fields. 
                    "([^\"\\" + strDelimiter + "\\r\\n]*))" 
            ), 
            "gi" 
            ); 


    // Create an array to hold our data. Give the array 
    // a default empty first row. 
    var arrData = [[]]; 

    // Create an array to hold our individual pattern 
    // matching groups. 
    var arrMatches = null; 


    // Keep looping over the regular expression matches 
    // until we can no longer find a match. 
    while (arrMatches = objPattern.exec( strData )){ 

            // Get the delimiter that was found. 
            var strMatchedDelimiter = arrMatches[ 1 ]; 

            // Check to see if the given delimiter has a length 
            // (is not the start of string) and if it matches 
            // field delimiter. If id does not, then we know 
            // that this delimiter is a row delimiter. 
            if ( 
                    strMatchedDelimiter.length && 
                    (strMatchedDelimiter != strDelimiter) 
                    ){ 

                    // Since we have reached a new row of data, 
                    // add an empty row to our data array. 
                    arrData.push( [] ); 

            } 


            // Now that we have our delimiter out of the way, 
            // let's check to see which kind of value we 
            // captured (quoted or unquoted). 
            if (arrMatches[ 2 ]){ 

                    // We found a quoted value. When we capture 
                    // this value, unescape any double quotes. 
                    var strMatchedValue = arrMatches[ 2 ].replace( 
                            new RegExp( "\"\"", "g" ), 
                            "\"" 
                            ); 

            } else { 

                    // We found a non-quoted value. 
                    var strMatchedValue = arrMatches[ 3 ]; 

            } 


            // Now that we have our value string, let's add 
            // it to the data array. 
            arrData[ arrData.length - 1 ].push( strMatchedValue ); 
    } 

    // Return the parsed data. 
    return( arrData ); 
}