var errors = [];

function Deposit_Import_SL(request,response)
{
	if(request.getMethod()=="GET")
	{
		try
		{
			var form = nlapiCreateForm("Import Customer Deposits");
			
			var fld = form.addField("custpage_file_1","file","File 1");
			fld.setMandatory(true);
			form.addField("custpage_file_2","file","File 2");
			form.addField("custpage_file_3","file","File 3");
			form.addField("custpage_file_4","file","File 4");
			form.addField("custpage_file_5","file","File 5");
			form.addField("custpage_file_6","file","File 6");
			form.addField("custpage_file_7","file","File 7");
			form.addField("custpage_file_8","file","File 8");
			form.addField("custpage_file_9","file","File 9");
			form.addField("custpage_file_10","file","File 10");
			
			fld = form.addField("custpage_encoding","select","Encoding");
			fld.setMandatory(true);
			fld.addSelectOption("PC","PC",true);
			fld.addSelectOption("MAC","MAC",false);
			
			fld = form.addField("custpage_user","select","User","employee");
			fld.setDisplayType("hidden");
			fld.setDefaultValue(nlapiGetUser());
			
			form.addSubmitButton("Create Deposit");
			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Create Customer Deposit Import Page","Details: " + err.message);
		}
	}
	else
	{
		try
		{
			var encoding = request.getParameter("custpage_encoding");
			
			var file1 = processFile(request.getFile("custpage_file_1"),1,encoding);
			var file2 = processFile(request.getFile("custpage_file_2"),2,encoding);
			var file3 = processFile(request.getFile("custpage_file_3"),3,encoding);
			var file4 = processFile(request.getFile("custpage_file_4"),4,encoding);
			var file5 = processFile(request.getFile("custpage_file_5"),5,encoding);
			var file6 = processFile(request.getFile("custpage_file_6"),6,encoding);
			var file7 = processFile(request.getFile("custpage_file_7"),7,encoding);
			var file8 = processFile(request.getFile("custpage_file_8"),8,encoding);
			var file9 = processFile(request.getFile("custpage_file_9"),9,encoding);
			var file10 = processFile(request.getFile("custpage_file_10"),10,encoding);
			
			var user = request.getParameter("custpage_user");
			
			if(errors.length == 0)
			{
				var body = "<p>Deposit import completed successfully!</p>";
				
				nlapiSendEmail(user,user,"Deposit import completed successfully",body);
			}
			else
			{
				var body = "<p>Your deposit import did not complete successfully. The following errors were encountered:</p>";
					body+= "<table cellpadding='2' cellspacing='0' border='1'>";
					body+= "<tr><th>File</th><th>Error</th></tr>";
					
				for(var x=0; x < errors.length; x++)
				{
					body += "<tr><td>" + errors[x].file + "</td><td>" + errors[x].msg + "</td></tr>";
				}
				
					body += "</table>";
					
				nlapiSendEmail(user,user,"Deposit Import Errors Encountered",body);
			}
			
			var form = nlapiCreateForm("Deposit Import Processing Started");
			
			var fld = form.addField("custpage_message","inlinehtml","Message");
			fld.setDefaultValue("<p style='font-size: 16px;'>Your deposit import has started. An email will be sent containing the results of the import.</p>");
			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Deposit","Details: " + err.message);
		}
	}
}

function processFile(file,index,encoding)
{
	if(file!=null && file!="")
	{
		var run = createDeposit(file,encoding);
		
		if(run.errors.length > 0)
		{
			for(var x=0; x < run.errors.length; x++)
			{
				errors.push({
					file : "File " + index,
					msg : run.errors[x]
				});
			}
		}
	}
}

function createDeposit(fileObj,encoding)
{
	var rtnObj = {
		success : false,
		errors : [],
		depositId : ""
	}
	
	try
	{
		if(encoding=="PC")
			fileObj.setEncoding("UTF-8");
		else
			fileObj.setEncoding("MacRoman");
		
		var csvContents = fileObj.getValue();
		var fileName = fileObj.getName();
		
		nlapiLogExecution("debug","CSV Received",csvContents);
		
		//Convert CSV to JSON
		var csvJSON = csvToJson(csvContents);
		
		nlapiLogExecution("debug","CSV Converted to JSON",csvJSON);
		
		var lines = JSON.parse(csvJSON);
		
		var deposit = nlapiCreateRecord("deposit");
		deposit.setFieldValue("trandate",lines[0]["Date"]);
		deposit.setFieldValue("account","6"); //1020 Wells Fargo Chkg/3233
		deposit.setFieldValue("memo",lines[0]["Memo"]);
		
		for(var x=0; x < lines.length; x++)
		{
			var sublist = lines[x]["Type"];
			var customer = lines[x]["Customer Name"];
			var amount = lines[x]["Amount"];
			amount = parseFloat(amount.replace(/,/g, ''));
			var memo = lines[x]["Memo"];
			var date = lines[x]["Date"];
			var memo_line = lines[x]["Memo - Line Item"];
			
			if(sublist=="Payments")
			{
				nlapiLogExecution("debug","JSON Customer",customer);
				var found = false;
				
				for(var i=0; i < deposit.getLineItemCount("payment"); i++)
				{
					var sl_customer = deposit.getLineItemText("payment","entity",i+1);
					sl_customer = sl_customer.substr(sl_customer.indexOf(" ") + 1);
					
					var sl_amount = parseFloat(deposit.getLineItemValue("payment","transactionamount",i+1));
					
					var sl_currency = deposit.getLineItemValue("payment","currency",i+1);
					//nlapiLogExecution("debug","Currency",sl_currency);
					
					if(sl_currency!="1" && sl_currency!="USD")
					{
						//Handle non-USD values by checking if amount is within 20% of stated value in NetSuite (customer must still match)
						if(deposit.getLineItemValue("payment","deposit",i+1)!="T" && sl_customer.toUpperCase()==customer.toUpperCase())
						{
							sl_amount = parseFloat(deposit.getLineItemValue("payment","paymentamount",i+1));
							var upperThreshold = sl_amount * 1.20;
							var lowerThreshold = sl_amount * 0.80;
							
							if(upperThreshold < 0 && lowerThreshold < 0)
							{
								upperThreshold = sl_amount * 0.80;
								lowerThreshold = sl_amount * 1.20;
							}
							
							nlapiLogExecution("debug","(Non-US) Payment sublist customer: " + sl_customer,"Sublist Amount: " + sl_amount + "  |  JSON Amt: " + amount);
							nlapiLogExecution("debug","Lower Threshold: " + lowerThreshold,"Upper Threshold: " + upperThreshold);
							nlapiLogExecution("debug","amount >= lowerThreshold: " + (amount >= lowerThreshold),"amount <= upperThreshold: " + (amount <= upperThreshold));
							
							if((amount >= lowerThreshold) && (amount <= upperThreshold))
							{
								nlapiLogExecution("debug","Amount is within thresholds");
								
								deposit.setLineItemValue("payment","deposit",i+1,"T");
								deposit.setLineItemValue("payment","paymentamount",i+1,amount);
								found = true;
								break;	
							}
						}
					}
					else
					{
						if(deposit.getLineItemValue("payment","deposit",i+1)!="T" && sl_customer.toUpperCase()==customer.toUpperCase() && sl_amount==amount)
						{
							nlapiLogExecution("debug","(US) Payment sublist customer: " + sl_customer,"Sublist Amount: " + sl_amount + "  |  JSON Amt: " + amount);
							
							deposit.setLineItemValue("payment","deposit",i+1,"T");
							found = true;
							break;
						}
					}
				}
				
				if(!found)
				{
					rtnObj.success = false;
					rtnObj.errors.push("No matching customer/amount on deposit page for " + customer + " (" + amount + ")");
				}
			}
			else if (sublist=="Cash Back")
			{
				deposit.selectNewLineItem("cashback");
				deposit.setCurrentLineItemValue("cashback","account","67");
				deposit.setCurrentLineItemValue("cashback","amount",Math.abs(amount));
				deposit.setCurrentLineItemValue("cashback","memo",memo_line);
				deposit.commitLineItem("cashback");
			}
		}
		
		rtnObj.depositId = nlapiSubmitRecord(deposit,true,true);
		nlapiLogExecution("debug","Created Deposit ID " + rtnObj.depositId);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Creating Deposit Record","Details: " + err.message);
		
		rtnObj.sucess = false;
		rtnObj.errors.push("System Error: " + err.message);
	}
	
	return rtnObj;
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