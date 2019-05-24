/**
            *@NApiVersion 2.x
            *@NScriptType UserEventScript
            *@NModuleScope Public
             */
define(['N/runtime','N/search','N/log','N/ui/serverWidget'],
       function(runtime,search,log,serverWidget) {
         function Add_Button(context) {
           if(context.type == context.UserEventType.VIEW || context.type == context.UserEventType.EDIT)
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
               form.clientScriptModulePath = 'SuiteScripts/client_script_so_api_button_function.js';
               var get_id=SalesRecord.id
               var orderstatus=SalesRecord.getValue('orderstatus');


               var backstock_ring_match=SalesRecord.getValue('custbody_pot_backstock_ring_match');
               var shipping_qa_employee=SalesRecord.getValue('custbody_shipping_qa_employee');
               try{BackStock_Automation_UE_BL(context,type,form,orderstatus,backstock_ring_match);}
               catch(er){log_message+="\n BackStock_Automation_UE_BL  Error  => "+er.message; } //Script Use 632  //OK
               try{Post_Sale_Overhaul_UE(context,type,form,orderstatus);}
               catch(er){log_message+="\n Post_Sale_Overhaul_UE  Error  => "+er.message; }   //Script Use 2062  //OK
               try{Shipper_Declaration(context,type,form,orderstatus); }
               catch(er){log_message+="\n Shipper_Declaration  Error  => "+er.message; }       //Script Use 1026  //OK   	
               try{Custom_Bill_Button(context,type,form,orderstatus); }
               catch(er){log_message+="\n Custom_Bill_Button  Error  => "+er.message; }        //Script Use 285  //OK
               try{Resize_Page_Button(context,type,form,orderstatus,log); }
               catch(er){log_message+="\n Resize_Page_Button  Error  => "+er.message; }        //Script Use 121  //OK
               try{ Repair_Button(context,type,form,orderstatus);    }
               catch(er){log_message+="\n Repair_Button  Error  => "+er.message; }           //Script Use 131  //OK
               try{Exchange_Button(context,type,form,orderstatus);   }
               catch(er){log_message+="\n Exchange_Button  Error  => "+er.message; }         //Script Use 141  //OK
               try{IA_Button(context,type,form,search,SalesRecord,log);  }
               catch(er){log_message+="\n IA_Button  Error  => "+er.message; }          //Script Use 368  //OK
               try{AffidavitUe(context,type,form,search,SalesRecord,log);  }
               catch(er){log_message+="\n AffidavitUe  Error  => "+er.message; }         //Script Use 1095  //OK
             }
             catch(er){
               log_message+="\n All Function  Error  => "+er.message; 
             }
             log_message+="\n End Time  => "+new Date();
             log.debug({ title: 'Message', details: log_message});
           }
         }
         return {
           beforeLoad: Add_Button
         };
       });



function BackStock_Automation_UE_BL(context,type,form,orderstatus,ring_match)
{
  if(type== context.UserEventType.VIEW)
  {
    if(orderstatus=='A' && ring_match)
    {

      form.addButton({
        id : 'custpage_backstock_matchs_btn',
        label : 'Backstock Matches',
        functionName: "BackStock_Automation_UE_BL_Link"
      });
    }
  }
}

function Post_Sale_Overhaul_UE(context,type,form,orderstatus)
{
  if(type == context.UserEventType.VIEW)
  {
    if(orderstatus=='G' || orderstatus=='H')
    {  
      form.addButton({
        id : 'custpage_post_sale_btn',
        label : 'Create Post-Sale',
        functionName: "Create_Post_Sale_Link"
      });
    }
  }
}



function Shipper_Declaration(context,type,form,orderstatus)
{
  if(type== context.UserEventType.VIEW)
  {
    if(orderstatus=='G')
    {
      form.addButton({
        id : 'custpage_shipper_declaration_btn',
        label : "Shipper's Declr",
        functionName: "Shipper_Declaration"
      });
    }
  }
}

function Custom_Bill_Button(context,type,form,orderstatus)
{
  if(type== context.UserEventType.VIEW)
  {
    if(orderstatus=='B' || orderstatus=='D' || orderstatus=='E'|| orderstatus=='F')
    {
      form.addButton({
        id : 'custpage_new_bill_btn',
        label : 'NEW Bill',
        functionName: "NEW_Bill"
      });
    }
  }
}


function Resize_Page_Button(context,type,form,orderstatus,get_id)
{
 
  if(type== context.UserEventType.VIEW)
  {
    if(orderstatus=='G' || orderstatus=='H')
    {
      form.addButton({
        id : 'custpage_resize_btn',
        label : 'Resize',
        functionName: "Resize"
      });
    }
  }
}


function Repair_Button(context,type,form,orderstatus,get_id)
{
  if(type== context.UserEventType.VIEW)
  {
    if(orderstatus=='G' || orderstatus=='H')
    {
      form.addButton({
        id : 'custpage_repair_btn',
        label : 'Repair',
        functionName: "Repair"
      });
    }
  }
}

function Exchange_Button(context,type,form,orderstatus)
{
  if(type== context.UserEventType.VIEW)
  {
    if(orderstatus=='G' || orderstatus=='H')
    {
      form.addButton({
        id : 'custpage_exchange_btn',
        label : 'Exchange',
        functionName: "Exchange_Button"
      });
    }
  }
}

function IA_Button(context,type,form,search,SalesRecord,log)
{
  if(type == context.UserEventType.VIEW)
  {
    var flag_val=false;
   
    /*
     *  var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
    for (var x = 0; x < lineItemCount; x++) {
      var description  =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'description',line: x});
      //   log.debug({ title: 'description', details: description});   
      if(description)
      {
        description=description.toLowerCase();
        if(description.search('modified')>=0){ flag_val=true;   return;}
      }
    }
*/
    search.create({
      "type": "salesorder",
      "filters": [
        ['internalid', search.Operator.ANYOF, SalesRecord.id],
        'and',
        ['item.itemid', 'contains', 'custom ']
      ]
    }).run().each(function(result) {flag_val=true;});
    if(flag_val){ return;}
    form.addButton({
      id : 'custpage_ia_btn',
      label : 'Create IA Form',
      functionName: "IA_Form"
    });

    form.addButton({
      id : 'custpage_ia_logo_btn',
      label : 'Create IA Logo Form',
      functionName: "IA_Form_Logo"
    });
  }
}


function AffidavitUe(context,type,form,search,SalesRecord,log)
{
  if(type == context.UserEventType.VIEW)
  {
    form.addButton({
      id : 'custpage_btn_Affidavit',
      label : 'Affidavit',
      functionName: "Affidavit"
    });

  }
}


