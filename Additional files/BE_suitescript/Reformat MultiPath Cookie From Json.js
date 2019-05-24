/** 
 * Script Author             : 	Tanuja Srivastav (tanuja@inoday.com)
 * Author Desig.             : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type               : 	UserEvent
 * Created Date              : 	June 22, 2018
 * Last Modified Date        : June 22, 2018
 * Comments                  : Script will Reformat the data in "multi Path Cookie from Json" to "Multi Path Cookie Field".
 * scriptURL                 :https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=2894&whence=
 * Production URL			 :https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2316&whence=
 */
 
 function reformateMultiPathCookieFromJson(type)
 {
	// nlapiLogExecution('Debug','flow start');
	 try {
		 if (type=='create')
		 {
			 var recordid=nlapiGetRecordId();
			 var recordtype=nlapiGetRecordType();
			 var multipathcookiejson=nlapiGetFieldValue('custentitymulti_path_cookie_json');
			 nlapiLogExecution('Debug','multipathcookiejson',multipathcookiejson);
				if (multipathcookiejson)
				{
					//var data=JSON.stringify(multipathcookiejson);
					var result= JSON.parse(multipathcookiejson);					
					var mainarr=result.attribution;
					var jsonarr=[];
										
					if (mainarr.length > 0) {
						for (var i = 0; i < mainarr.length; i++) {
							 jsonarr.push({
								   source:mainarr[i].source,
								   medium:mainarr[i].medium,  
								   campaign:mainarr[i].compaign,
								   content:mainarr[i].content,
								   keyword:mainarr[i].keyword,
								   adID:mainarr[i].adID,
								   repeat:mainarr[i].repeat,							  
								   date:mainarr[i].date                       
							});

						 }
						var content='{';
						content+='"total":' + result.total + ',';
						content+='"cid":"' + result.cid + '",';
						content+='"attribution":';

						content+=JSON.stringify(jsonarr);
						content+='}';
						content=JSON.stringify(content);
						content ='[["bam_attribution_path",' + content;
						content+=']]';
							   
							nlapiSubmitField (recordtype,recordid,'custentity107',content);
					}
		       }
		 }
	 }
	 catch(er)
	 {
		 nlapiLogExecution('Debug','error',er.message);
	 }
 }