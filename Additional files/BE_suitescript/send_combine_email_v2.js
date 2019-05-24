nlapiLogExecution("audit","FLOStart",new Date().getTime());
function send_email_combine() {
    var search_ids = ['customsearch2532', 'customsearch1335', 'customsearch1132', 'customsearch1276', 'customsearch958', 'customsearch1106',
        'customsearch1091', 'customsearch1119', 'customsearch1107', 'customsearch1107', 'customsearch957','customsearch8677'
    ];
    var search_names = ['KPI - CDPs Created Per Week', 'KPI - Gem Requests per week', 'KPI - Estimates per week', 'KPI - Orders created per week',
        'KPI - Orders shipped per week', 'KPI - Pick ups per week', 'KPI - Purchase Orders per week', 'KPI - Repairs per week',
        'KPI - Resizes per week', 'KPI - Exchanges per week', 'KPI - Bills per week','KPI - Items Shipped Separately per Week'
    ];
    var email_titles = ['Date', 'Date', 'Date', 'Date', 'Date', 'Date', 'Date', 'Date', 'Date', 'Date', 'Date','Date'];
    var email_title2s = ['Count of Number', 'Count of Number', 'Count of Number', 'Count of Number', 'Count of Number', 'Count of Number', 'Count of Number', 'Count of Number',
        'Count of Number', 'Count of Number', 'Count of Number','Count of Number'
    ];
    var emailBody = '';
    for (var i = 0; i < search_ids.length; i++) {
        emailBody += create_email_body(search_ids[i], search_names[i], email_titles[i], email_title2s[i]);
    }
    nlapiLogExecution('DEBUG', 'Search', emailBody);

    var recipients = ['opsmgrs@brilliantearth.com', 'netsuite@brilliantearth.com', 'beth@brilliantearth.com', 'sdziesietnik@brilliantearth.com'];
    nlapiSendEmail(20186, recipients, 'Ops KPIs', emailBody);
}


function create_email_body(search_id, search_name, tablename1, tablename2) {
	
	if(search_id=='customsearch1276')
    {
      return '';
    }
    var results = nlapiSearchRecord(null, search_id);
    var search_Innel_id = search_id.replace(/\D/g, "");
    var emailBody_title = '<table border="0" cellspacing="0" bgcolor="#FFFFFF" cellpadding="2" width="100%" ><caption><h3>' + 'Search:' + search_name + '</h3></caption><tr><td>' + tablename1 + '</td><td>' + tablename2 + '</td></tr>';
    //var num_total=0;
    var search_datas = [];
    //var search_datas_sort = [];
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var columns = result.getAllColumns();
        var name;
        var num_count;
	  if(search_id=='customsearch1106')
      {
            name = result.getValue(columns[1]);
            num_count = result.getValue(columns[0]);
      }
      else
      {
        name = result.getValue(columns[0]);
        num_count = result.getValue(columns[1]);
      }
        /*for(var j=0;j<columns.length;j++){
            var column = columns[j];
            name = result.getText(column);
            if(!name){
                num_count = result.getValue(column);
                num_total+=parseInt(num_count);
            }
        }*/
        search_datas.push({
            'name': name,
            'number': num_count
        });
    }
    //search_datas_sort = search_datas.sort(campare_nums);
    if (search_datas.length > 10) {
        for (var i = 0; i < 10; i++) {
            nlapiLogExecution('DEBUG', 'Search', search_datas[i].name + ":" + search_datas[i].number);
            emailBody_title += '<tr><td height="100%" nowrap="">' + search_datas[i].number + '</td><td height="100%" nowrap="">' + search_datas[i].name + '</td></tr>';
        }
        emailBody_title += '<tr><td valign="top"></td><td valign="top"><a href = "https://system.netsuite.com/app/common/search/searchresults.nl?searchid=' + search_Innel_id + '">View Result</a></td></tr></table>';
        return emailBody_title;
    } else {
        for (var i = 0; i < search_datas.length; i++) {
            nlapiLogExecution('DEBUG', 'Search', search_datas[i].name + ":" + search_datas[i].number);
            emailBody_title += '<tr><td height="100%" nowrap="">' + search_datas[i].number + '</td><td height="100%" nowrap="">' + search_datas[i].name + '</td></tr>';
        }
        emailBody_title += '<tr><td valign="top"></td><td valign="top"><a href = "https://system.netsuite.com/app/common/search/searchresults.nl?searchid=' + search_Innel_id + '">View Result</a></td></tr></table>';
        return emailBody_title;
    }
}


function campare_nums(object1, object2) {
    var value1 = object1.number;
    var value2 = object2.number;
    if (value1 > value2) {
        return 1;
    } else if (value1 < value2) {
        return -1;
    } else if (value1 == value2) {
        return 0;
    }
}