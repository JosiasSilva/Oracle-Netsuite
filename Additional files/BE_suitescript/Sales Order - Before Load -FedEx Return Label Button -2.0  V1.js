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
             var log_message=context.newRecord.type+" Order ID =>"+context.newRecord.id +
                 ";\n TYPE  =>" +context.type+
                 ";\n execution Context  =>" +runtime.executionContext+
                 ";\n Start Time  =>  "+ new Date();
             try
             {
               var form=context.form;
               form.clientScriptModulePath = './client_script_so_api_button_function.js';
               FedEx_Return_Label_Button(form);              //Script Use 1084  //OK
             }
             catch(er){
               log_message+="\n FedEx_Return_Label_Button  Error  => "+er.message; 
             }
             log_message+="\n End Time  => "+new Date();
             log.debug({ title: 'Message', details: log_message});

           }
         }
         return {
           beforeLoad: Add_Button
         };
       });




function FedEx_Return_Label_Button(form)
{
  form.addButton({
    id : 'custpage_fedex_return_label_btn',
    label : 'Return Label',
    functionName: "FedEx_Return_Label"
  });
}


