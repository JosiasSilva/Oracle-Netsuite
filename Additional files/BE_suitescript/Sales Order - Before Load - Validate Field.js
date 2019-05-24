/**
          *@NApiVersion 2.x
          *@NScriptType UserEventScript
           */
define(['N/search','N/log','N/ui/serverWidget','N/runtime','N/record','N/url','N/redirect'],
       function(search,log,serverWidget,runtime,record,url,redirect) {
         function beforeLoad(context) {
           if(context.type == context.UserEventType.VIEW|| context.type == context.UserEventType.EDIT)
           {
             var df=runtime.executionContext;
             if(runtime.executionContext != "USERINTERFACE" )
               return true;
             var form=context.form;
             var SalesRecord =record.load({type:'salesorder',id:context.newRecord.id}); //context.newRecord;
             var log_message="Sales Order ID =>"+context.newRecord.id +
                 ";\n TYPE  =>" +context.type+
                 ";\n execution Context  =>" +runtime.executionContext+
                 ";\n Start Time  =>  "+ new Date();
             try
             {

               var customer = search.lookupFields({
                 type: 'customer',
                 id: SalesRecord.getValue('entity'),
                 columns: ['custentity_sales_order_1', 'custentity_sales_order_2', 'custentity_sales_order_3', 'custentity_sales_order_4','custentity_sales_order_5','custentity131']
               });

               var customer_data={'custentity_sales_order_1':Get_Field_Value(customer.custentity_sales_order_1), 
                                  'custentity_sales_order_2':Get_Field_Value(customer.custentity_sales_order_2),
                                  'custentity_sales_order_3':Get_Field_Value(customer.custentity_sales_order_3),
                                  'custentity_sales_order_4':Get_Field_Value(customer.custentity_sales_order_4),
                                  'custentity_sales_order_5':Get_Field_Value(customer.custentity_sales_order_5),
                                  'custentity131':Get_Field_Value(customer.custentity131) }

               try{HighlightNotEligibleForReturn(form,serverWidget,SalesRecord,log); }
               catch(er){  log_message+="\n HighlightNotEligibleForReturn Error => "+er.message; }// Script Use :-924  //OK

               try{Show_RETURNING_CUSTOMER_INFORMATION(form,serverWidget,SalesRecord,customer_data,context,log); }
               catch(er){log_message+="\n Show_RETURNING_CUSTOMER_INFORMATION Error => "+er.message; } //Script Use 453  //OK

               try{Highlight_custbody319(form,serverWidget,SalesRecord,log); }
               catch(er){log_message+="\n Highlight_custbody319 Error => "+er.message; } // Script Use 912   //OK
               try{Highlight_SO_Fields_To_Be_Watched_Highlight(search,form,serverWidget,SalesRecord,log); }
               catch(er){log_message+="\n Highlight_SO_Fields_To_Be_Watched_Highlight Error => "+er.message; }//  Script 607 &&  Script Use 1127   //OK
               try{IA_Requested_HighLight(context,serverWidget,SalesRecord,log); }
               catch(er){log_message+="\n IA_Requested_HighLight Error => "+er.message; } //Script Use-865    //OK

               try{Highlight_CustomerName_On_SO(form,serverWidget,customer_data); }
               catch(er){log_message+="\n Highlight_CustomerName_On_SO Error => "+er.message;} // Script Use 971   //OK

               try{Highlight_Order_No_On_SO(context,form,serverWidget,search,SalesRecord); }
               catch(er){log_message+="\n Highlight_Order_No_On_SO Error => "+er.message;} // Script Use 1826   //OK

               try{HighlightChargbackOnSO(form,serverWidget,SalesRecord,search); }
               catch(er){log_message+="\n HighlightChargbackOnSO Error => "+er.message;} // Script Use 1850   //OK

               try{HighLight_CustBody39(form,serverWidget,SalesRecord); }
               catch(er){log_message+="\n HighLight_CustBody39 Error => "+er.message;} // Script Use 706   //OK

               try{True_Balance_Highlight(form,serverWidget,SalesRecord); }
               catch(er){log_message+="\n True_Balance_Highlight Error => "+er.message;} // Script Use 1011   //OK


               //try{Create_pickup_locationField(form,serverWidget,SalesRecord); }
               // catch(er){log_message+="\n Create_pickup_locationField Error => "+er.message;} // Script Use 1246   //OK

               //  try{Connection_Opportunity_PI(context,form,serverWidget,SalesRecord); }
               // catch(er){log_message+="\n Connection_Opportunity_PI Error => "+er.message;}

               try{ Alert_Metal_Type_DisMatch(context,form,serverWidget,SalesRecord,log); }  // Script Use 209   //OK
               catch(er){log_message+="\n Alert_Metal_Type_DisMatch Error => "+er.message;}

               try{ Molds_SO(context,serverWidget,search,SalesRecord,log,record); } // Script Use 606   //OK
               catch(er){log_message+="\n Molds_SO Error => "+er.message;}



             }
             catch(er){log_message+="\n Error => "+er.message;}
             log_message+="\n End Time  => "+new Date();
             log.debug({ title: 'Message', details: log_message});
           }
         }
         return {
           beforeLoad: beforeLoad
         };
       });


function HighlightNotEligibleForReturn(form,serverWidget,SalesRecord,log)
{

  var neiArr=new Array();
  var orderType=SalesRecord.getValue('custbody87');
  var finalSale=SalesRecord.getValue('custbodyfinal_sale');
  if(orderType.indexOf('4')>=0 )  //       if(orderType=='4') // for Exchange
  {
    neiArr.push('1'); //set Exchange if user opted order Type='Exchange';				
  }
  if(finalSale=='1')
  {
    neiArr.push('4'); // set Manual if user opted final sale='yes'
  }
  var lineNumber_first = SalesRecord.findSublistLineWithValue({sublistId: 'item',	fieldId: 'item',value:'782'	});	
  if(lineNumber_first!=-1)
  {
    neiArr.push('2');
  }	
  var lineNumber_secound = SalesRecord.findSublistLineWithValue({sublistId: 'item',fieldId: 'item',value:'2158514'});	
  if(lineNumber_secound!=-1)
  {
    neiArr.push('3');
  }	
  var lineNumber_three = SalesRecord.findSublistLineWithValue({sublistId: 'item',fieldId: 'item',value:'39300'});	
  if(lineNumber_three!=-1)
  {
    neiArr.push('5');
  }	
  if(neiArr.length>0)
  {

    var fieldAddingHighLightValue = "<script type='text/javascript'>";
    fieldAddingHighLightValue += 'var node = document.getElementById("custbodynot_eligible_for_return_list_lbl_uir_label");';
    fieldAddingHighLightValue += 'node.parentNode.style.background="cyan";';
    fieldAddingHighLightValue += "</script>";
    form.addField({
      id : 'custpage_not_eligible_for_return',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Not Eligible For Return'
    }).defaultValue=fieldAddingHighLightValue;
  }
  else
  {

    var fieldAddingHighLightValue = "<script type='text/javascript'>";
    fieldAddingHighLightValue += 'var node = document.getElementById("custbodynot_eligible_for_return_list_lbl_uir_label");';
    fieldAddingHighLightValue += 'node.parentNode.parentNode.style.visibility="hidden";';
    fieldAddingHighLightValue += "</script>";
    form.addField({
      id : 'custpage_not_eligible_for_return',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Not Eligible For Return'
    }).defaultValue=fieldAddingHighLightValue;
  }

}



function Show_RETURNING_CUSTOMER_INFORMATION(form,serverWidget,SalesRecord,customer_data,context,log)
{
  if(context.type == context.UserEventType.EDIT)
  {
    var customer_ID = SalesRecord.getValue('entity');
    var salesorder_IN_IDs = [];
    if(customer_ID)
    {

      if(customer_data.custentity_sales_order_1)
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_1);
      if(customer_data.custentity_sales_order_2)
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_2);
      if(customer_data.custentity_sales_order_3)
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_3);
      if(customer_data.custentity_sales_order_4)
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_4);
      if(customer_data.custentity_sales_order_5)
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_5);
    }
    if(salesorder_IN_IDs.length>0)
    {
      var  form_val= form.getField('custbody228');//.setDisplayType('normal');
      form_val.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.NORMAL
      });
    }
  }
}




function  Highlight_custbody319(form,serverWidget,SalesRecord)
{

  var incomped_item= SalesRecord.getValue('custbody319'); 
  var getDropShipMaterial= SalesRecord.getValue('custbody39');
  if( incomped_item&&  getDropShipMaterial )
  {
    var fieldValue = "<script type='text/javascript'>";
    fieldValue += "if(document.getElementById('custbody319_fs_lbl'))";
    fieldValue += "document.getElementById('custbody319_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';";		
    fieldValue += "</script>";
    form.addField({
      id : 'custpage_highlight_custbody319_field',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Highlight custbody319 Fields'
    }).defaultValue=fieldValue;
  }
}


function Highlight_SO_Fields_To_Be_Watched_Highlight(search,form,serverWidget,SalesRecord,log)
{
  displayFraudMessage(form,SalesRecord,serverWidget,log);
  var lineNumber = SalesRecord.findSublistLineWithValue({
    sublistId: 'item',
    fieldId: 'item',
    value: '2569496'
  });	

  if(SalesRecord.getValue("custbody128")!="5" && lineNumber!=-1)
  {

    //Highlight GE$ Receipt field
    form.addField({
      id : 'custpage_highlight_ge_receipt',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Highlight GE Receipt'
    }).defaultValue="<script type='text/javascript'>document.getElementById('custbody128_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';</script>";
  }

  var mySearch = search.load({id:'customsearch2138'});
  var mySearchFilter = search.createFilter('internalid','transaction','anyof',SalesRecord.id);
  mySearch.filters.push(mySearchFilter);
  var search_record = mySearch.run(); 
  search_record.each(function(result) {
    form.getField("custbody_to_be_watched_so_only").defaultValue="<span style='background-color: yellow; font-weight: bold; font-size: 9pt;'>To Be Watched <span class='checkbox_read_ck'><img class='checkboximage' src='/images/nav/ns_x.gif'/></span></span>";
    //To_Be_Watched_Highlight Start
    if(SalesRecord.getValue('custbody129'))
    {
      var fieldValue = "<script type='text/javascript'>";
      fieldValue += 'var node = document.getElementById("custbody129_fs_lbl");';
      fieldValue += 'node.parentNode.parentNode.style.background="yellow";';
      fieldValue += "</script>";
      form.addField({
        id : 'custpage_highlight_tbw_match',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'TBW Match'
      }).defaultValue=fieldValue;
    }
    // To_Be_Watched_Highlight END

  });


  var custbody_pot_backstock_ring_match= SalesRecord.getValue("custbody_pot_backstock_ring_match");
  if(custbody_pot_backstock_ring_match )
  {
    var fieldAddingHighLightValue = "<script type='text/javascript'>";
    fieldAddingHighLightValue += 'var node = document.getElementById("custbody_pot_backstock_ring_match_fs_lbl");';
    fieldAddingHighLightValue += 'node.parentNode.parentNode.style.background="yellow";';
    fieldAddingHighLightValue += "</script>";
    form.addField({
      id : 'custpage_highlight_bs_match',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Potential Backstock Ring Match'
    }).defaultValue=fieldAddingHighLightValue;
    //   log.debug({ title: 'Highlight_SO_Fields', details: 'Highlight_SO_Fields 2'});


  }
}
function displayFraudMessage(form,SalesRecord,serverWidget,log) {
  try
  {
    var fraudCheckVal = SalesRecord.getValue('custbodyfraud_check_new');   
    //log.debug({ title: 'fraudCheckVal', details: fraudCheckVal});
    var fraudMsg = '<h3 class="uir-record-type" style="background-color:red;color:black;font-size:14px" id="ext-gen22">FRAUD QUESTIONS REQUIRED, SEE FRAUD NOTES</h3>';
    var field_frad_check="<script type='text/javascript'>\
document.onreadystatechange = function(){\
if(document.readyState === 'complete'){\
var fraudCheckVal=" + fraudCheckVal + ";\
if(fraudCheckVal=='4')\
{\
var div_f = document.getElementsByClassName('uir-page-title-firstline');\
div_f[0].innerHTML=div_f[0].innerHTML+'" + fraudMsg + "';\
}\
}\
}\
</script>";

    //log.debug({ title: 'field_frad_check', details: field_frad_check});
    form.addField({
      id : 'custpage_fraud_check',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Fraudcheck'
    }).defaultValue=field_frad_check;

  }
  catch(ex)
  {
    // log.debug({ title: 'fraudCheckVal', details: ex.message});
  }
}

function IA_Requested_HighLight(context,serverWidget,SalesRecord,log)
{
  if(context.type == context.UserEventType.VIEW)
  {
    var soFields = SalesRecord.getValue('custbody144');
    var fraudyFields = SalesRecord.getValue('custbody352');
    var form=context.form;
    if(soFields  == '2' ||   soFields == '3')
    {   

      var fieldValue = "<script type='text/javascript'>";
      fieldValue += "if(document.getElementById('custbody144_fs_lbl'))";
      fieldValue += "document.getElementById('custbody144_fs_lbl').parentNode.parentNode.childNodes[1].style.backgroundColor='yellow';"

      fieldValue += "</script>";	  
      form.addField({
        id : 'custpage_custbody144',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Fields'
      }).defaultValue=fieldValue;
      // log.debug({ title: 'IA_Requested_HighLight', details: 'IA_Requested_HighLight 1'});

    }
    if(fraudyFields)
    {
      var fieldValue = "<script type='text/javascript'>";
      fieldValue += "if(document.getElementById('entity_fs_lbl'))";      
      fieldValue += "document.getElementById('entity_fs_lbl').parentNode.parentNode.childNodes[1].style.backgroundColor='#ddd3ee';";
      fieldValue += "</script>";
      fieldValue += "</script>";	  
      form.addField({
        id : 'custpage_entity',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Fields'
      }).defaultValue=fieldValue;
      //  log.debug({ title: 'IA_Requested_HighLight', details: 'IA_Requested_HighLight 2'});

    }

  }

  if(context.type == context.UserEventType.EDIT)
  {
    var fraudyFields = SalesRecord.getValue('custbody352');   
    if(fraudyFields)
    {
      var form=context.form;
      var fieldValue = "<script type='text/javascript'>";
      fieldValue += "if(document.getElementById('entity_display'))";      
      fieldValue += "document.getElementById('entity_display').style.backgroundColor='#ddd3ee';";
      fieldValue += "</script>";
      form.addField({
        id : 'custpage_entity',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Fields'
      }).defaultValue=fieldValue;
      //  log.debug({ title: 'IA_Requested_HighLight', details: 'IA_Requested_HighLight 3'});

    }
  }
}



function Highlight_CustomerName_On_SO(form,serverWidget,customer_data)
{

  var custLegal=customer_data.custentity131;
  if(custLegal==1 || custLegal==2 || custLegal==3)
  {
    var fieldValue = "<script type='text/javascript'>";
    fieldValue += "if(document.getElementById('entity_fs_lbl_uir_label'))";
    fieldValue += "document.getElementById('entity_fs_lbl_uir_label').parentNode.parentNode.style.backgroundColor='pink';";	
    fieldValue += "</script>";
    form.addField({
      id : 'custpage_highlight_customer',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Highlight Fields'
    }).defaultValue=fieldValue;
  }
}
function Highlight_Order_No_On_SO(context,form,serverWidget,search,SalesRecord)
{

  var mySearch = search.load({id:'7440'});
  var mySearchFilter = search.createFilter('createdfrom',null,'anyof',SalesRecord.id);
  mySearch.filters.push(mySearchFilter);
  var search_record = mySearch.run(); 
  search_record.each(function(result) {  
    var html="<script type='text/javascript'>";
    html+="document.onreadystatechange = function(){";
    html+="if(document.readyState === 'complete'){";
    html+="var div= document.getElementById('tranid_fs_lbl_uir_label').parentNode;";
    html+="div.setAttribute('style', 'background-color:#DDA0DD');";
    if(context.type == context.UserEventType.EDIT)
    {
      html+="var val= document.getElementById('tranid');";
      html+="val.setAttribute('style', 'background-color:#DDA0DD');";
    }
    html+="}}</script>";
    form.addField({
      id : 'custpage_high_val_cust',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'High Value'
    }).defaultValue=fieldValue;
    var highValueCheckFld = form.addField("custpage_high_val_cust", "inlinehtml", "High Value");
    highValueCheckFld.setDefaultValue(html);
  });

}



function HighlightChargbackOnSO(form,serverWidget,SalesRecord,search)
{

  search.create({
    "type": "customrecordchargeback",
    "filters": [
      ['custrecordsales_order_chargeback', search.Operator.ANYOF, SalesRecord.id],

    ]
  }).run().each(function(result) {
    var fieldValue="<script type='text/javascript'>\
document.onreadystatechange = function(){\
if(document.readyState === 'complete'){";
    var inner_html = '<h1 class="uir-record-type" style="background-color:orange">Chargeback</h1>';
    fieldValue+="var div_h = document.getElementsByClassName('uir-page-title-firstline');";
    fieldValue+="div_h[0].innerHTML=div_h[0].innerHTML+'"+inner_html+"'";
    fieldValue+="}}</script>";
    form.addField({
      id : 'custpage_highlight_chargeback',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Chargeback'
    }).defaultValue=fieldValue;
  });
}


function  HighLight_CustBody39(form,serverWidget,SalesRecord)
{
  if(SalesRecord.getValue('custbody39'))
  {
    var fieldValue = "<script type='text/javascript'>";
    fieldValue += "if(document.getElementById('custbody39_fs_lbl'))";
    fieldValue += "document.getElementById('custbody39_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';";			
    fieldValue += "</script>";
    form.addField({
      id : 'custpage_highlight_fields_show',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'Highlight Fields'
    }).defaultValue=fieldValue;

  }
}


function  True_Balance_Highlight(form,serverWidget,SalesRecord)
{
  if(SalesRecord.getValue('custbody_website_truebalance_amt'))
  {

    if(SalesRecord.getValue('custbody338'))
    {
      form.addField({
        id : 'custpage_highlight_runout',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Runout Ring'
      }).defaultValue="<script type='text/javascript'>document.getElementById('custbody338_fs_lbl').parentNode.parentNode.style.backgroundColor='lawngreen';</script>";
    }
    var get_true_blance=parseFloat(SalesRecord.getValue('custbody_website_truebalance_amt'));
    if(get_true_blance>0)
    {
      var fieldValue = "<script type='text/javascript'>";           
      fieldValue += "if(document.getElementById('custbody_website_truebalance_amt_fs_lbl'))";
      fieldValue += "document.getElementById('custbody_website_truebalance_amt_fs_lbl').parentNode.parentNode.style.backgroundColor='lawngreen';";		
      fieldValue += "document.getElementById('custbody_website_truebalance_amt_fs_lbl_uir_label').parentNode.style.backgroundColor='lawngreen';";			
      fieldValue += "</script>";
      form.addField({
        id : 'custpage_highlight_fields_show_2015_fs',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Fields'
      }).defaultValue=fieldValue;
    }

  }

}

/*
function Create_pickup_locationField(form,serverWidget,SalesRecord)
{
  var get_old_data=form.addField({id : 'custpage_custbody6_old',type : serverWidget.FieldType.DATE,label : 'custpage_custbody6_old' })
  get_old_data.defaultValue=SalesRecord.getValue('custbody6');
  get_old_data.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});

  var get_old_data=form.addField({id : 'custpage_custbody_pickup_location_old',type : serverWidget.FieldType.SELECT,label : 'custpage_custbody_pickup_location_old' })
  get_old_data.defaultValue=SalesRecord.getValue('custbody_pickup_location');
  get_old_data.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
}
*/
/*
function Connection_Opportunity_PI(context,form,serverWidget,SalesRecord)
{
  if(context.type == context.UserEventType.EDIT)
  {

    var get_old_data=form.addField({id : 'custpage_opportunity',type : serverWidget.FieldType.TEXT,label : 'custpage_opportunity' })
    get_old_data.defaultValue="result.id";
    get_old_data.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
    search.create({
      "type": "opportunity",
      "filters": [
        ['entity', search.Operator.ANYOF, SalesRecord.getValue('entity')],
        'and',
        ['entitystatus', search.Operator.ANYOF,[7,6,11,8,9,17,15]]
      ]
    }).run().each(function(result) {
      var get_old_data=form.addField({id : 'custpage_opportunity',type : serverWidget.FieldType.TEXT,label : 'custpage_opportunity' })
      get_old_data.defaultValue=result.id;
      get_old_data.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
    });
  }
}
*/
function Alert_Metal_Type_DisMatch(context,form,serverWidget,SalesRecord,log)
{
  if(context.type == context.UserEventType.EDIT)
  {

    var created_from = SalesRecord.getValue('createdfrom');
    var itemListCount = SalesRecord.getLineCount({sublistId: 'item'});
    if ( created_from && itemListCount == 1 )
    {
      var itemName = SalesRecord.getSublistText({sublistId: 'item',fieldId: 'item',line: 0});
      var metalKeywordPos = itemName.lastIndexOf("-") + 1;
      var metalKeyword = itemName.substring(metalKeywordPos);
      var metalType;
      var oldMetalType;
      switch (metalKeyword)
      {
        case '18KW':
          metalType = "18K White Gold";
          break;
        case '18KY':
          metalType = "18K Yellow Gold";
          break;
        case 'PT':
          metalType = "Platinum";
          break;
        case '14KR':
          metalType = "14K Rose Gold";
          break;
        case 'PD':
          metalType = "Palladium";
          break;
        default:
          metalType = "unknown";
          break;
      }
      if ( metalType != "unknown" )
      {
        var oldMetalTypeId = SalesRecord.getValue('custbody19');
        if(oldMetalTypeId)
        {
          if(oldMetalTypeId.length==1)
          {
            oldMetalTypeId=oldMetalTypeId[0];
          }
          switch (oldMetalTypeId)
          {
            case '1':
              oldMetalType= "18K White Gold";
              break;
            case '2':
              oldMetalType= "18K Yellow Gold";
              break;
            case '3':
              oldMetalType= "Platinum";
              break;				
            case '4':
              oldMetalType= "Palladium";
              break;
            case '5':
              oldMetalType= "14K White Gold";
              break;
            case '6':
              oldMetalType= "14K Yellow Gold";
              break;				
            case '7':
              oldMetalType= "14K Rose Gold";
              break;
            case '8':
              oldMetalType= "18K Palladium White";
              break;
            case '9':
              oldMetalType= "Sterling Silver";
              break;				
            case '10':
              oldMetalType= "Mixed Metals-- Plat and 18k WG";
              break;
            case '11':
              oldMetalType= "14k White Gold and 14k Yellow Gold";
              break;
            case '19':
              oldMetalType= "Mixed Metals - 14KR & 14KW";
              break;				
            case '25':
              oldMetalType= "10K White Gold";
              break;
            case '27':
              oldMetalType= "10K Yellow Gold";
              break;
            case '32':
              oldMetalType= "18K Rose Gold";
              break;
            default:
              oldMetalType= "not define";
              break;

          }
        }
        log.debug({ title: 'metalType', details: metalType});
        log.debug({ title: 'oldMetalType', details: oldMetalType});

        if ( metalType != oldMetalType )
        {
          var get_old_data=form.addField({id : 'custpage_metal_type_dismatch',type : serverWidget.FieldType.TEXT,label : 'custpage_metal_type_dismatch' });
          get_old_data.defaultValue="Metal Type DisMatch.";
          get_old_data.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
        }
      }
    }
  }
}


function Molds_SO(context,serverWidget,search,SalesRecord,log,record)
{
  if(context.type == context.UserEventType.VIEW)
  {
    var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
    var item_melee_colour=[];
    var objRecord = record.create({type: record.Type.INVENTORY_ITEM,isDynamic: true}).getField('custitem20').getSelectOptions();
    for(var x=0; x < lineItemCount; x++)
    {
      var molds = [];
      var item = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
      var quantity = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'quantity',line: x});
      if(quantity)
      {
        quantity=parseInt(quantity);
        if ( quantity > 1 ) {
          try{

            var itemId = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
            var category =  SalesRecord.getSublistText({sublistId: 'item',fieldId: 'custcol_category',line: x});
            for(var n=0;n<objRecord.length;n++)
            {
              if(category==objRecord[n].value)
              {
                category=objRecord[n].text;
                break;
              }
            }
            var get_test_category=test_catgetory(category);
            if (!get_test_category) {
              item_melee_colour.push(x+1);
            }
          }catch(e){

          }	
        }
      }	
    }
    if(item_melee_colour.length>0)
    {
      var fieldValue = "<script type='text/javascript'>";
      fieldValue += "var myVar = setInterval(function(){ item_molds_check() }, 500);";
      fieldValue +='function item_molds_check(){';
      fieldValue +='var items = document.getElementById("item_splits");';
      fieldValue +='if(items)';
      fieldValue +='{';
      for(var a=0;a<item_melee_colour.length;a++)
      {
        fieldValue += 'var row = items.rows[' + item_melee_colour[a] + '];';
        fieldValue += 'for ( var j = 0; j < row.cells.length; j++ ) {';
        fieldValue += 'var cell = row.cells[j];';
        fieldValue += 'cell.style.setProperty("background-color","yellow","important");';
        fieldValue += '}';
      }
      fieldValue += "clearInterval(myVar);";
      fieldValue += "}";
      fieldValue += "}";
      fieldValue += "</script>";
      var form=context.form;
      form.addField({
        id : 'custpage_highlight_fields_show_molds_so_2015',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Fields'
      }).defaultValue=fieldValue;

    }
  }
}
function test_catgetory(category){
  var regex = /Melee/;
  return regex.test(category);
}
function Get_Field_Value(data_value)
{

  if(data_value)
  {
    if(data_value[0])
    {
      if(data_value[0].value)
      {
        return data_value[0].value;
      }
    }
  }
  return "";
}


