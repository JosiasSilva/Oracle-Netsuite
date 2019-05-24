var DATA_CENTER_URL = "";

function send_email_combine(){
	var search_ids = ['customsearch1334','customsearch1335','customsearch1132','customsearch1276','customsearch958','customsearch1106',
						'customsearch1091','customsearch1119','customsearch1107','customsearch1107','customsearch957'		];
	var search_names = ['Metric: Diamond Requests per week','Metric: Gem Requests per week','Metric: Estimates per week','Metric: Orders created per week',
						'Metric: Orders shipped per week','Metric: Pick ups per week','Metric: Purchase Orders per week','Metric: Repairs per week',
						'Metric: Resizes per month','Metric: Exchanges per week','Metric: Bills per week'];
	var email_titles = ['Count of Number','Date','Date','Date','Date','Date','Date','Date','Date','Date','Date'];
	var email_title2s = ['Date','Count of Number','Count of Number','Count of Number','Count of Number','Count of Number','Count of Number','Count of Number',
						'Count of Number','Count of Number','Count of Number'];
	var emailBody = '';
	for(var i=0;i<search_ids.length;i++){
		emailBody += create_email_body(search_ids[i],search_names[i],email_titles[i],email_title2s[i]);
	}
	nlapiLogExecution('DEBUG', 'Search', emailBody);

	//nlapiSendEmail( 546963, 'ops@brilliantearth.com', 'Ops Metrics',emailBody);
	nlapiSendEmail( 546963, 'xuxuezhi@aragoncs.com', 'Ops Metrics',emailBody);
}
function create_email_body(search_id,search_name,tablename1,tablename2){
	getDataCenterURL();
	
	var results = nlapiSearchRecord(null,search_id);
	var search_Innel_id = search_id.replace(/\D/g, "");
	var emailBody_title = '<table border="0" cellspacing="0" bgcolor="#FFFFFF" cellpadding="2" width="100%" ><caption><h3>'+'Search:'+search_name+'</h3></caption><tr><td>'+tablename1+'</td><td>'+tablename2+'</td></tr>';
	//var num_total=0;
	var search_datas = [];
	//var search_datas_sort = [];
	for(var i = 0;i<results.length;i++){
		var result = results[i];
		var columns = result.getAllColumns();
		var name;
		var num_count;
		name = result.getValue(columns[0]);
		num_count = result.getValue(columns[1]);
		/*for(var j=0;j<columns.length;j++){
			var column = columns[j];
			name = result.getText(column);
			if(!name){
				num_count = result.getValue(column);
				num_total+=parseInt(num_count);
			}
		}*/
		search_datas.push({'name':name,'number':num_count});
	}
	//search_datas_sort = search_datas.sort(campare_nums);
	if(search_datas.length>10){
		for(var i=0;i<10;i++){
			nlapiLogExecution('DEBUG', 'Search', search_datas[i].name +":"+ search_datas[i].number);
			emailBody_title += '<tr><td height="100%" nowrap="">'+search_datas[i].number+'</td><td height="100%" nowrap="">'+search_datas[i].name+'</td></tr>';
		}
		emailBody_title += '<tr><td valign="top"></td><td valign="top"><a href = "' + DATA_CENTER_URL + '/app/common/search/searchresults.nl?searchid='+search_Innel_id+'">View Result</a></td></tr></table>';
		return emailBody_title;
	}else{
		for(var i=0;i<search_datas.length;i++){
			nlapiLogExecution('DEBUG', 'Search', search_datas[i].name +":"+ search_datas[i].number);
			emailBody_title += '<tr><td height="100%" nowrap="">'+search_datas[i].number+'</td><td height="100%" nowrap="">'+search_datas[i].name+'</td></tr>';
		}
		emailBody_title += '<tr><td valign="top"></td><td valign="top"><a href = "' + DATA_CENTER_URL + '/app/common/search/searchresults.nl?searchid='+search_Innel_id+'">View Result</a></td></tr></table>';
		return emailBody_title;
	}	
}
/*function create_email_body(search_id,search_name){
	var results = nlapiSearchRecord(null,search_id);
	var search_Innel_id = search_id.replace(/\D/g, "");
	var emailBody_title = '<table border="0" cellspacing="0" bgcolor="#FFFFFF" cellpadding="2" width="100%" ><caption><h3>'+'Search:'+search_name+'</h3></caption><tr><td>'+'Count of Number'+'</td><td>'+'Set by'+'</td></tr>';
	var num_total=0;
	var search_datas = [];
	var search_datas_sort = [];
	for(var i = 0;i<results.length;i++){
		var result = results[i];
		var columns = result.getAllColumns();
		var name;
		var num_count;
		for(var j=0;j<columns.length;j++){
			var column = columns[j];
			name = result.getText(column);
			if(!name){
				num_count = result.getValue(column);
				num_total+=parseInt(num_count);
			}
		}
		search_datas.push({'name':name,'number':parseInt(num_count)});
	}
	search_datas_sort = search_datas.sort(campare_nums);
	for(var i=0;i<search_datas_sort.length;i++){
		nlapiLogExecution('DEBUG', 'Search', search_datas_sort[i].name +":"+ search_datas_sort[i].number);
		emailBody_title += '<tr><td height="100%" nowrap="">'+search_datas_sort[i].number+'</td><td height="100%" nowrap="">'+search_datas_sort[i].name+'</td></tr>';
	}
	emailBody_title += '<tr><td valign="top" style = "font-weight: 700">'+num_total+'</td><td valign="top" style = "font-weight: 700">'+'Total'+'</td></tr><tr><td valign="top"></td><td valign="top"><a href = "https://system.netsuite.com/app/common/search/searchresults.nl?searchid='+search_Innel_id+'">View Result</a></td></tr></table>';
	return emailBody_title;
}*/
function campare_nums(object1,object2){
	var value1 = object1.number;
	var value2 = object2.number;
    if(value1>value2){
        return 1;
    }else if(value1<value2){
        return -1;
    }else if(value1==value2){
        return 0;
    }
}

function getDataCenterURL()
{
	var environment = nlapiGetContext().getEnvironment();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("name",null,"is",environment));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_data_center_url"));
	var results = nlapiSearchRecord("customrecord_data_center_url",null,filters,cols);
	if(results)
		DATA_CENTER_URL = results[0].getValue("custrecord_data_center_url");
}