/**
          *@NApiVersion 2.x
          *@NScriptType UserEventScript
           */
define(['N/runtime','N/search'],
       function(runtime,search) {
         function Add_Button(context) {
           if(context.type == context.UserEventType.VIEW)
           {
             if(runtime.executionContext != "USERINTERFACE" )
               return true;
             var SalesRecord = context.newRecord;
             var log_message="Sales Order ID =>"+context.newRecord.id +
                 ";\n TYPE  =>" +context.type+
                 ";\n execution Context  =>" +runtime.executionContext+
                 ";\n Start Time  =>  "+ new Date();
             try
             {
               var orderstatus=SalesRecord.getValue('orderstatus');  //// Script Use :-1028  //OK
               if(orderstatus!='A')
               {
                 var form=context.form;
                 form.clientScriptModulePath = './client_script_so_api_button_function.js';
                 form.addButton({
                   id : 'custpage_myAccount_info_btn',
                   label : 'My Account Info',
                   functionName: "My_Account_Info"
                 });
               }
             }
             catch(er){
               log_message+="\n My Account Info Button  Error  => "+er.message; 
             }
             log_message+="\n End Time  => "+new Date();
             log.debug({ title: 'Message', details: log_message});

           }
         }
         return {
           beforeLoad: Add_Button
         };
       });


