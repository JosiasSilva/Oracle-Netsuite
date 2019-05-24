function inventory_pulls_dashboard_client(type,name)
{
	if(name=='custpage_refresh'){
		var url = nlapiResolveURL("SUITELET","customscript_invt_pulls_dashboard","customdeploy_invt_pulls_dashboard");		
		window.onbeforeunload = null;
		window.location.href = url;
	}	
}