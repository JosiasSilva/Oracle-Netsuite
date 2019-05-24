/**
* @NApiVersion  2.0
* @NScriptType Restlet
*/
//https://debugger.netsuite.com/app/common/scripting/script.nl?id=2599

define([],function(){
	function doget(params){
		var empcode=params.empcode;
		log.debug({
			 title: 'empcode',
			 details: empcode
			 });
		if (empcode=='x')
		{
			return 'invalid';
		}
		return 'valid';
	}
	return{
		get:doget,
	};
});