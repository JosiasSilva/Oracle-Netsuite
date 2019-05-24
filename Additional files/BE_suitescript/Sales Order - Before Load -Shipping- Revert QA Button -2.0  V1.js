/**
          *@NApiVersion 2.x
          *@NScriptType UserEventScript
           */
define(['N/runtime','N/search','N/log'],
       function(runtime,search,log) {
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
               var type=context.type;
               var form=context.form;
               form.clientScriptModulePath = './client_script_so_api_button_function.js';

               var orderstatus=SalesRecord.getValue('orderstatus');
               var shipping_qa_employee=SalesRecord.getValue('custbody_shipping_qa_employee');
               if(shipping_qa_employee)
               {	
                 form.addButton({
                   id : 'custpage_shipping_undo_qa_btn',
                   label : 'Revert QA',
                   functionName: "Revert_QA"
                 });
               }	
               else if(orderstatus=="B" || orderstatus=="D")
               {
                 search.create({	"type": "itemfulfillment","filters": [['createdfrom','anyof', SalesRecord.id],'and',['mainline', 'contains', 'T']]}).run().each(function(result) {
                   form.addButton({
                     id : 'custpage_shipping_qa_btn',
                     label : 'Shipping QA',
                     functionName: "Shipping_QA"
                   });
                 });
               }
             }catch(er){
               log_message+="\n Shipping- Revert QA Button  Error  => "+er.message; 
             }
             log_message+="\n End Time  => "+new Date();
             log.debug({ title: 'Message', details: log_message});
           }
         }
         return {
           beforeLoad: Add_Button
         };
       });







