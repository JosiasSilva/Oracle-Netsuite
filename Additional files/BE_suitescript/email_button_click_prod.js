function field_change_email(type,name){	
	var recordId=nlapiGetRecordId();	
	var entity_id=nlapiLookupField('calendarevent',recordId,'company');	
	if(name=='custpage_email'){		
		var recordURL =  'https://'+window.location.host+'/app/crm/common/crmmessage.nl?entitytype=custjob&entity='+entity_id+'&l=T&templatetype=EMAIL';
		window.open(recordURL,'','width=750,height=550');
		 return true;
	}
}