/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/error'],
/**
 * @param {record} record
 */
function(record,error) {
   
    

    

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
	 
	 function beforeSubmit(scriptContext){
		 var newRec = scriptContext.newRecord;
		 var oldRec = scriptContext.oldRecord;
      /* var errorObj = error.create({name:'Change not permitted',message:'Changes from service type appointments not permitted, please cancel appointment and recreate in correct appointment type'});*/
       
       var errObj = error.create({name : 'Change not permitted', message:'Changes from service type appointments not permitted, please cancel appointment and recreate in correct appointment type', notifyOff: false});
       var errObj_to = error.create({name : 'Change not permitted', message:'Changes to service type appointments not permitted, please cancel appointment and recreate in correct appointment type', notifyOff: false});

        
		 
		 if(scriptContext.type == scriptContext.UserEventType.EDIT){
			 var appointmentVal = oldRec.getValue({fieldId:'custevent_appointment_type'});
			 var changedAppointmentVal = newRec.getValue({fieldId:'custevent_appointment_type'});
			 log.debug("Old Appointment Val",appointmentVal);
             //
			 
			 if (appointmentVal == 2 || appointmentVal == 27 || appointmentVal == 28 || appointmentVal == 29 ) {
				 log.debug("I am  here in old value if ");
               log.debug("Changed Appointment Val",changedAppointmentVal);
				  if (changedAppointmentVal == 2 || changedAppointmentVal == 27 || changedAppointmentVal == 28 || changedAppointmentVal == 29 ){
                    log.debug("I am  here in new value if ");
                    
                    
					  
					  
				  }
               else {
                 throw errObj.message;
               }
			 }
			 
			else if (appointmentVal !== 2 || appointmentVal !== 27 || appointmentVal !== 28 || appointmentVal !== 29 ) {
				 log.debug("I am  here in old value if another condition ");
                 log.debug("Changed Appointment Val",changedAppointmentVal);
				  if ( changedAppointmentVal == 2 || changedAppointmentVal == 27 || changedAppointmentVal == 28 || changedAppointmentVal == 29 ){
                    log.debug("I am  here in new value if another condition ");
                   
                  throw errObj_to.message;
					  
					  
				  }
			 }
           
          
             
          
			 
			 
		 }
       
       
	 }
	 
    

    return {
       
        beforeSubmit: beforeSubmit
       
    };
    
});
