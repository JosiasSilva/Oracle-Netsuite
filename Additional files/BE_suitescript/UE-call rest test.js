/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
*/
//https://debugger.netsuite.com/app/common/scripting/script.nl?id=2600&whence=
define(['N/url','N/https','N/runtime','N/ui/dialog'],function(urlmod,https,runtime,dialog){
	function beforeLoad(context){
		try{
			dialog.alert('hello');
		var empcode='abcd';
		log.debug ({
			 title: 'empcode',
			 details: empcode
			 });
		var restleturl=urlmod.resolveScript({
			scriptId:'customscript_resttest',
			deploymentId:'customdeploy1',
			returnExternalUrl:true
		});
		log.debug ({
			 title: 'restleturl',
			 details: restleturl
			 });
		var response=https.get({url : restleturl + '&empcode=' + empcode});
		log.debug ({
			 title: 'response',
			 details: response.body
			 });
			 	log.debug ({
			 title: 'response',
			 details: response
			 });
		if (response.body=='invalid')
		{
			log.debug ({
			 title: 'Success',
			 details: 'in if part'
			 });
		}
		}
		catch(e){
					log.error ({
						 title: e.name,
						 details: e.message
						 }); 
		}
	}
	return{
		beforeLoad: beforeLoad
	};	
});