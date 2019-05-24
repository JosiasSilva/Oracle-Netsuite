nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-783 (Update Matrix - trigger for csv import)
	@Script Type   				:-	Suitelet & User Event Script
	@Created Date  				:-	July 13, 2017
	@Last Modified Date 		:-  July 13, 2017
	@Comments                 	: 	Script will updated all matrix items according to CSV
	
	@UserEvent Script URL	:-	/app/common/scripting/script.nl?id=1597
	@Suitelet Script URL	:-	/app/common/scripting/script.nl?id=1599
	@Scheduled Script URL	:-	/app/common/scripting/script.nl?id=1602
	@Suitelet Script URL	:-	/app/common/scripting/script.nl?id=1839
	@Scheduled Script URL	:-	/app/common/scripting/script.nl?id=1840
*/
function updateMatrixItemStatusUI(request,response)
{
	if(request.getMethod()=="GET")
	{
		try
		{
			//Show User UI Form
			var form = nlapiCreateForm("Bulk Update Matrix");
			form.addField("custpage_csv_file","file","CSV File").setMandatory(true);
			form.addSubmitButton("Process");
			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Bulk Update Matrix UI Error","Details: " + err.message);
			return true;
		}
	}
	else
	{
		try
		{
			//Capture File Information
			var csvFile = request.getFile("custpage_csv_file");
			csvFile.setEncoding("UTF-8");
			//var csvContents = Base64.decode(csvFile.getValue());
			var csvContents = csvFile.getValue();
			
			nlapiLogExecution("debug","CSV Received",csvContents);
			
			//Convert CSV to JSON
			var csvJSON = csvToJson(csvContents);
			
			nlapiLogExecution("debug","CSV Converted to JSON",csvJSON);
			var csvObj = nlapiCreateRecord('customrecord_bulk_update_matrix');
			csvObj.setFieldValue('custrecord_csv_data',csvJSON);
			var csv_email = nlapiGetContext().getEmail();
			nlapiLogExecution("debug","CSV Converted to JSON",csv_email);
			if(csv_email)
            {
				csvObj.setFieldValue('custrecord_csv_email',csv_email);
            }
			nlapiSubmitRecord(csvObj,true,true);
			nlapiScheduleScript('customscript_bulk_update_matrix_schedule','customdeploy_bulk_update_matrix_schedule',null);
			var form = nlapiCreateForm("Bulk Update Matrix In Progress");
			var fld = form.addField("custpage_details","inlinehtml","Details");
			fld.setDefaultValue("<p>Your CSV upload of Bulk Update Matrix is underway and in progress. You will be notified upon completion or should any errors be encountered.</p>");
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Update Matrix Pricing UI POST Error","Details: " + err.message);
		}
	}
}

/*
 * csv-to-json: A utility that converts data format from CSV to JSON.
 * Copyright (C) 2009-2012 Christopher Parker <http://www.cparker15.com/>
 * 
 * csv-to-json is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * csv-to-json is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with csv-to-json.  If not, see <http://www.gnu.org/licenses/>.
 */

function parseCSVLine(line)
{
	line = line.split(',');
	
	// check for splits performed inside quoted strings and correct if needed
	for (var i = 0; i < line.length; i++)
	{
		var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
		var quote = "";
		if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
		if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";
		
		if (quote != "")
		{
			var j = i + 1;
			
			if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
			
			while (j < line.length && chunk.charAt(chunk.length - 1) != quote)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
				chunk = line[j].replace(/[\s]*$/g, "");
			}
			
			if (j < line.length)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
			}
		}
	}
	
	for (var i = 0; i < line.length; i++)
	{
		// remove leading/trailing whitespace
		line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
		
		// remove leading/trailing quotes
		if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
		else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
	}
	
	return line;
}

function csvToJson(csv)
{
	var message = "";
	var error = false;
	var csvText = csv;
	var jsonText = "";
	
	if (csvText == "") { error = true; message = "Enter CSV text below."; }
	
	if (!error)
	{
		csvRows = csvText.split(/[\r\n]/g); // split into rows
		
		// get rid of empty rows
		for (var i = 0; i < csvRows.length; i++)
		{
			if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "")
			{
				csvRows.splice(i, 1);
				i--;
			}
		}
		
		if (csvRows.length < 2) { error = true; message = "The CSV text MUST have a header row!"; }
		else
		{
			objArr = [];
			
			for (var i = 0; i < csvRows.length; i++)
			{
				csvRows[i] = parseCSVLine(csvRows[i]);
			}
			
			for (var i = 1; i < csvRows.length; i++)
			{
				if (csvRows[i].length > 0) objArr.push({});
				
				for (var j = 0; j < csvRows[i].length; j++)
				{
					objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
				}
			}
			
			jsonText = JSON.stringify(objArr, null, "\t");
			return jsonText;
		}
	}
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

