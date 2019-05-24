/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record','N/search'],

function(record,search) {
   
  


    /**
     * Function called upon sending a POST request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPost(requestBody) {
    	
    	
    	//log.debug({title:'id details:',details:requestBody[0].get_Message_id});
    	  var data = [];
    	  try {
    	        if (requestBody[0].get_Message_id) {
    	            Update_Email_Update1(requestBody[0].get_Message_id);
    	          
    	          //log.debug({title:'Submitted Details:',details:'submitted'});
    	        }
    	    } 
    	    
    	    catch (ex) {
    	       log.debug("Error in the sync is",ex.message);
    	    }
    	  data.push({data:'done'});
    	  
    	   return  JSON.stringify(data);
    	
    	

    }
    
    function Update_Email_Update1(get_Message_id){
    	
    	 try {
              var date_time_last_email,custentity_date_time_last_email,get_record_type
             var messageSearchObj = search.create({type: "message",filters:[["internalid","is",get_Message_id]],columns:[search.createColumn({name: "formulatext",formula: "TO_CHAR({messagedate}, 'mm/dd/yyyy HH:MI PM') ",label: "Formula (Text)"}),search.createColumn({name:'messagedate'})]});
           
             var messageResult = messageSearchObj.run().each(function(result){
              date_time_last_email = result.getValue({name:'formulatext'});
             //log.debug("Date Time",date_time_last_email);
             });
          /* var messageDateSearch = search.create({
                        type: "message",
                        columns: ['messagedate'],
                        filters: [
                            ['internalid', 'is', get_Message_id]


                        ]
                    });

                    var searchResults = messageDateSearch.run().each(function(result) {
                        date_time_last_email = result.getValue({
                            name: 'messagedate'
                        });
                    });*/
           //log.debug("Date Time",date_time_last_email);
    	        
    	        var message_record = record.load({type:record.Type.MESSAGE,id:get_Message_id});
                //log.debug("Message REcord",message_record);
    	      //  date_time_last_email = message_record.getValue({fieldId:'messagedate'});
                
    	        if (date_time_last_email.indexOf(' AM') >= 0) {
    	            date_time_last_email = date_time_last_email.substring(0, date_time_last_email.search(' AM')) + ':00 AM';
    	        }
    	        else {
    	            date_time_last_email = date_time_last_email.substring(0, date_time_last_email.search(' PM')) + ':00 PM';
    	        }
                 
    	        var entity_id = message_record.getValue({fieldId:'entity'});
    	        if (entity_id) {
    	            
    	            var temp_Search = search.create({type:search.Type.ENTITY,filters: [['internalid', 'anyof', entity_id]], columns:['custentity_date_time_last_email']});
    	            var search_entity = temp_Search.run().each(function(result){
                        log.debug("Result",result);
                        custentity_date_time_last_email = result.getValue('custentity_date_time_last_email');
                         get_record_type = result.recordType;
                    });
                    //log.debug("Record Type",get_record_type);
    	           // if (search_entity) {
    	               // log.debug("I am here in search entity");
    	                if (custentity_date_time_last_email != date_time_last_email) {
                            // log.debug("I am here in if date time part");
    	                    //var get_record_type = search_entity.recordType;
    	                    if (get_record_type == 'customer' || get_record_type == 'lead' || get_record_type == 'prospect') {
                             // log.debug("I am here in if customer part");
    	                        var last_email_recipient = message_record.getValue({fieldId:'recipientemail'});
    	                       // last_email_recipient = last_email_recipient.replaceAll(',', ',\n');
    	                        var last_email_from_customer_boady = message_record.getValue({fieldId:'message'});
                               // log.debug("Body of email",last_email_from_customer_boady);
                                
    	                        var subject = message_record.getValue({fieldId:'subject'});
    	                        if (subject) {
    	                            subject = subject.toLowerCase();
    	                        }
    	                        var recipient = message_record.getValue({fieldId: 'recipient'}); // if recipient value get so this is BE user
    	                        var author = message_record.getValue({fieldId:'author'});
    	                        var authoremail = message_record.getValue({fieldId:'authoremail'});
    	                        if (!authoremail)
    	                            authoremail = '';

    	                        if (last_email_from_customer_boady) {
                                   //log.debug("I am here in last  customer body part");
    	                            var index_next_boady = last_email_from_customer_boady.indexOf('<strong>From:');
    	                            if (index_next_boady != -1) {
    	                                last_email_from_customer_boady = last_email_from_customer_boady.substring(0, index_next_boady);
    	                                if (last_email_from_customer_boady) {
    	                                    last_email_from_customer_boady = last_email_from_customer_boady.replaceAll('\r\n<hr />', '');
    	                                }
    	                            }
    	                            var first_index = last_email_from_customer_boady.indexOf('<BODY');
    	                            if (first_index == -1) { first_index = last_email_from_customer_boady.indexOf('<body'); }
    	                            var last_index = last_email_from_customer_boady.indexOf('</BODY');
    	                            if (last_index == -1) { last_index = last_email_from_customer_boady.indexOf('</body'); }
    	                            if (first_index != -1 && last_index != -1) {
    	                                last_email_from_customer_boady = last_email_from_customer_boady.substring(first_index, last_index);
    	                                var close_body_index = last_email_from_customer_boady.indexOf('>');
    	                                if (close_body_index >= 0) {
    	                                    first_index = close_body_index + 1;
    	                                }
    	                                last_email_from_customer_boady = last_email_from_customer_boady.substring(first_index);
    	                            }

    	                        }
    	                        var customer_reply_status = '';
    	                        var email_status = '';
    	                        if (last_email_recipient.indexOf('@brilliantearth.com') >= 0) {
    	                            recipient = '@brilliantearth.com';
    	                        }
    	                        else if (authoremail.indexOf('@brilliantearth.com') >= 0) {
    	                            author = '@brilliantearth.com';
    	                        }
    	                        if (author == entity_id) {
    	                            author = '';
    	                        }
    	                        else if (recipient == entity_id) {
    	                            recipient = '';
    	                        }
    	                        if (recipient && !author) {
    	                            customer_reply_status = "Not replied";
    	                        }
    	                        else if (author && !recipient && subject.indexOf('Re:') >= 0) {
    	                            customer_reply_status = "Replied";
    	                        }

    	                        if (recipient && !author) {
    	                            email_status = '1';
    	                        }
                              
                              //log.debug("All Values",get_record_type+entity_id+date_time_last_email+last_email_recipient+last_email_from_customer_boady+customer_reply_status+email_status)
    	                        
    	                         record.submitFields({type:get_record_type,id:entity_id,values:{custentity_date_time_last_email:date_time_last_email,custentity_last_email_recipient:last_email_recipient,custentity_last_email_from_customer:last_email_from_customer_boady,custentity_customer_reply_status:customer_reply_status,custentity_email_status:email_status}});
    	                        // Added by Sandeep for task NS-1036
    	                        addEmailHyperlinkToLeadAndCustomer(get_record_type, entity_id);
    	                    }
    	                }
    	           // }
    	        }
    	    }
    	    catch (er) {
    	       log.debug("error details:",er.message)
    	    }
      
      /************ Adding new functions here ***********/
      
      function addEmailHyperlinkToLeadAndCustomer(recordType, recordId) {
   
    
     var last_email_recipient = search.lookupFields({type:recordType, id:recordId, columns:['custentity_last_email_recipient']});
    var isInActive = search.lookupFields({type:recordType, id:recordId, columns:['isinactive']});

    var emailForNewLead = search.lookupFields({type:recordType, id:recordId, columns:['email']});
    if (isInActive == 'T') {
      
        var record = record.create({type:record.Type.LEAD});
        record.setValue({fieldId:'email',value: emailForNewLead });
        var id = record.save();
        return;
    }
    if (last_email_recipient) {
        //last_email_recipient = last_email_recipient.split(',');

    }
    getHtmlData(last_email_recipient, recordId);
}

function getHtmlData(email_recipient_array, customer_id) {
    var brilliantearth_id = [];
    var other_email_id = [];
    for (var i = 0; i < email_recipient_array.length; i++) {
        if (email_recipient_array[i].search('brilliantearth.com') >= 0) {
            brilliantearth_id.push(email_recipient_array[i].trim());
        } else {
            other_email_id.push(email_recipient_array[i].trim());
        }
    }

    var obj_employee_id = [];
    var obj_customer_id = [];
    var obj_lead = [];
    var obj_customer = [];
    if (brilliantearth_id) {
        for (var b = 0; b < brilliantearth_id.length; b++) {
            var listEmployeeBE = searchRecordFilterEmployee('employee', brilliantearth_id[b]);
            if (listEmployeeBE) {
                for (var v = 0; v < listEmployeeBE.length; v++) {
                    obj_employee_id.push(listEmployeeBE[v].id);
                }
            }
        }
    }

    if (other_email_id.length != 0) {

        for (var b = 0; b < other_email_id.length; b++) {
            var listEmployeeOther = searchRecordFilterEmployee('employee', other_email_id[b]);
            if (listEmployeeOther) {
                for (var v = 0; v < listEmployeeOther.length; v++) {
                    obj_employee_id.push(listEmployeeOther[v].id);
                }
            }
        }


        for (var b = 0; b < other_email_id.length; b++) {
            var listCustomerOther = searchRecordFilter('customer', other_email_id[b]);
            if (listCustomerOther) {
                for (var c = 0; c < listCustomerOther.length; c++) {
                    if (listCustomerOther[c].getValue('stage') == "CUSTOMER") {
                        obj_customer.push(listCustomerOther[c].id);
                    } else {
                        obj_lead.push(listCustomerOther[c].id);
                    }

                }
            }
            if (obj_customer.length != 0) {
                obj_customer_id.push(obj_customer[0]);
            } else if (obj_lead.length != 0) {
                obj_customer_id.push(obj_lead[0])
            }
        }
    }

   // nlapiLogExecution('debug', 'about to finish', 'finished');
    //nlapiLogExecution('debug', 'about to finish', customer_id);
    //nlapiLogExecution('debug', 'customer', JSON.stringify(obj_customer_id));
   // nlapiLogExecution('debug', 'employees', JSON.stringify(obj_employee_id));
    try {
        
        record.submitFields({type:record.Type.CUSTOMER,id:customer_id,values:{custentity_lastemailrecipientcustomers:obj_customer_id,custentity_lastemailrecipientemployee:obj_employee_id}});
    } catch (ex) {
        
        log.error("Error Details",ex.message)
    }



}

function searchRecordFilter(record_type, email_obj) {
    
    
    var search_obj = search.create({type:record_type,filters:[['isinactive','is','F'],'and',['email','is',email_obj]],columns:[search.createColumn({name:'internalid'}),search.createColumn({name:'stage'}),search.createColumn({name:'lastmodifieddate',sort:true})]});
    var search_data = search_obj.run();
    return search_data;
}

function searchRecordFilterEmployee(record_type, email_obj) {
  
    var search_obj = search.create({type:record_type,filters:[['isinactive','is','F'],'and',['email','is',email_obj]],columns:[search.createColumn({name:'internalid'}),search.createColumn({name:'stage'}),search.createColumn({name:'lastmodifieddate',sort:true})]});
    var search_data = search_obj.run();
    return search_data;
}
    	
    	
    }

   

    return {
        //'get': doGet,
        //put: doPut,
        post: doPost
       // 'delete': doDelete
    };
    
});
