function Run_Schedule()
{
var params = new Array();
params['status'] = 'scheduled';
params['runasadmin'] = 'T';
var startDate = new Date();
params['startdate'] = startDate.toUTCString();
//nlapiScheduleScript('customscript_update_po_cdp', 'customdeploy_update_po_cdp', params); 
}	