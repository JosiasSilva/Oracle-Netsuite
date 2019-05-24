 /**
  *@NApiVersion 2.x
  *@NScriptType UserEventScript
  *@NScript URl https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2752&whence=
  */

define(['N/runtime', 'N/search', 'N/log','N/format'],
     function(runtime, search, log, format) {
         function highlightRAOrgItemFFDate(context) {
             //if (context.type == context.UserEventType.VIEW) {
                 var RA = context.newRecord;
                 var log_message = "Return Authorization ID =>" + context.newRecord.id +
                     ";\n TYPE  =>" + context.type +
                     ";\n execution Context  =>" + runtime.executionContext +
                     ";\n Start Time  =>" + new Date();
                 try {
                     var itemFFDate = RA.getValue('custbody_original_item_fulfill_date');
					  itemFFDate = format.parse({
					 value: itemFFDate,
						 type: format.Type.DATE
						});
						 
						 var todaydate = new Date();	
					var parsedDateStringAsRawDateObject = format.parse({
						 value: todaydate,
						 type: format.Type.DATE
						});
						 
						var datediff=parseFloat(parsedDateStringAsRawDateObject-itemFFDate);
                   		var dateInDays=datediff/(1000*60*60*24);
						 if (dateInDays<=30){
							 var inlineHTMLField = context.form.addField({
			                  id: 'custpage_inline',
							 type: 'inlinehtml',
							 label: 'Inject Code'
								});
                         
							 inlineHTMLField.defaultValue = "<script type='text/javascript'>function change(){ var d = document.getElementById(\'custbody_original_item_fulfill_date_fs_lbl_uir_label\');d.style.backgroundColor='#96FFBB'} change();</script>"			 
							 

						 }
						 
						/*  itemFFDate = format.format({
						 value: itemFFDate,
						 type: format.Type.DATE
						 });
                     
						 var formattedDateString = format.format({
						 value: parsedDateStringAsRawDateObject,
						 type: format.Type.DATE
						 });*/
						  
                   
                    // log_message += "\n itemFFDate => " + itemFFDate +
                         //";\n todaydate  =>" + parsedDateStringAsRawDateObject +
                        // ";\n datediff  =>" + datediff;
                 } catch (er) {
                     log_message += "\n Error  => " + er.message;
                 }
                // log_message += "\n End Time  =>" + new Date();
                 //log.debug({
                 //    title: 'Message',
                //     details: log_message
               //  });
             //}
         }
         return {
             beforeLoad: highlightRAOrgItemFFDate
         };
     });
	 