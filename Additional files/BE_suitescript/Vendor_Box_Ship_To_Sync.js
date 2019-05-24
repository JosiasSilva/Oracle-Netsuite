function Vendor_Box_Ship_To_Sync(type,name)
{
	if(name=="custrecord_box_location")
	{
		try
		{
			var to_location = nlapiGetFieldValue("custrecord_box_location");
			
			var to_location_txt = nlapiGetFieldText("custrecord_box_location");
			nlapiLogExecution("debug","To Location Substring",to_location_txt.substring(0,2));
			
			if(to_location_txt.substring(0,2)!="BE")
			{
				//Get address details from location record
				var filters = [];
				filters.push(new nlobjSearchFilter("internalid",null,"is",to_location));
				var cols = [];
				cols.push(new nlobjSearchColumn("address1","address"));
				cols.push(new nlobjSearchColumn("address2","address"));
				cols.push(new nlobjSearchColumn("city","address"));
				cols.push(new nlobjSearchColumn("state","address"));
				cols.push(new nlobjSearchColumn("zip","address"));
				cols.push(new nlobjSearchColumn("countrycode","address"));
				cols.push(new nlobjSearchColumn("phone","address"));
				cols.push(new nlobjSearchColumn("addressee","address"));
				cols.push(new nlobjSearchColumn("attention","address"));
				var results = nlapiSearchRecord("location",null,filters,cols);
				if(results)
				{
					nlapiSetFieldValue("custrecord_box_attention",results[0].getValue("attention","address"),true,true);
					nlapiSetFieldValue("custrecord_box_address1",results[0].getValue("address1","address"),true,true);
					nlapiSetFieldValue("custrecord_box_address2",results[0].getValue("address2","address"),true,true);
					nlapiSetFieldValue("custrecord_box_city",results[0].getValue("city","address"),true,true);
					//nlapiLogExecution("debug","State ID: " + results[0].getValue("state","address"),"State Text: " + results[0].getText("state","address"))
					nlapiSetFieldText("custrecord_box_state",stateAbbrev(results[0].getValue("state","address")),true,true);
					nlapiSetFieldValue("custrecord_box_zip",results[0].getValue("zip","address"),true,true);
					nlapiSetFieldValue("custrecord_box_country",results[0].getValue("countrycode","address"),true,true);
					nlapiSetFieldValue("custrecord_box_phone",results[0].getValue("phone","address"),true,true);
					nlapiSetFieldValue("custrecord_box_addressee",results[0].getValue("addressee","address"),true,true);	
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Ship To Address Fields","Details: " + err.message);
		}
	}
}

function stateAbbrev(abbrev)
{
	nlapiLogExecution("debug","State String",stateStr);
	
	var statesList = [
		{text:'Alabama',id:'AL'},
		{text:'Alaska',id:'AK'},
		{text:'Arizona',id:'AZ'},
		{text:'Arkansas',id:'AR'},
		{text:'Armed Forces Americas',id:'AA'},
		{text:'Armed Forces Europe',id:'AE'},
		{text:'Armed Forces Pacific',id:'AP'},
		{text:'California',id:'CA'},
		{text:'Colorado',id:'CO'},
		{text:'Connecticut',id:'CT'},
		{text:'Delaware',id:'DE'},
		{text:'District of Columbia',id:'DC'},
		{text:'Florida',id:'FL'},
		{text:'Georgia',id:'GA'},
		{text:'Hawaii',id:'HI'},
		{text:'Idaho',id:'ID'},
		{text:'Illinois',id:'IL'},
		{text:'Indiana',id:'IN'},
		{text:'Iowa',id:'IA'},
		{text:'Kansas',id:'KS'},
		{text:'Kentucky',id:'KY'},
		{text:'Louisiana',id:'LA'},
		{text:'Maine',id:'ME'},
		{text:'Maryland',id:'MD'},
		{text:'Massachusetts',id:'MA'},
		{text:'Michigan',id:'MI'},
		{text:'Minnesota',id:'MN'},
		{text:'Mississippi',id:'MS'},
		{text:'Missouri',id:'MO'},
		{text:'Montana',id:'MT'},
		{text:'Nebraska',id:'NE'},
		{text:'Nevada',id:'NV'},
		{text:'New Hampshire',id:'NH'},
		{text:'New Jersey',id:'NJ'},
		{text:'New Mexico',id:'NM'},
		{text:'New York',id:'NY'},
		{text:'North Carolina',id:'NC'},
		{text:'North Dakota',id:'ND'},
		{text:'Ohio',id:'OH'},
		{text:'Oklahoma',id:'OK'},
		{text:'Oregon',id:'OR'},
		{text:'Pennsylvania',id:'PA'},
		{text:'Puerto Rico',id:'PR'},
		{text:'Rhode Island',id:'RI'},
		{text:'South Carolina',id:'SC'},
		{text:'South Dakota',id:'SD'},
		{text:'Tennessee',id:'TN'},
		{text:'Texas',id:'TX'},
		{text:'Utah',id:'UT'},
		{text:'Vermont',id:'VT'},
		{text:'Virginia',id:'VA'},
		{text:'Washington',id:'WA'},
		{text:'West Virginia',id:'WV'},
		{text:'Wisconsin',id:'WI'},
		{text:'Wyoming',id:'WY'}
	];
	
	var stateStr = "";
	for(var x=0; x < statesList.length; x++)
	{
		if(statesList[x].id == abbrev)
		{
			stateStr = statesList[x].text;
			break;
		}
	}
	
	nlapiLogExecution("debug","State Full Name",stateStr);
	
	return stateStr;
}