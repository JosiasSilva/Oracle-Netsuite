/**
    *@NApiVersion 2.x
    *@NScriptType UserEventScript
     */
define(['N/search','N/log','N/ui/serverWidget','N/runtime','N/record','N/url'],
       function(search,log,serverWidget,runtime,record,url) {
         function beforeLoad(context) {

           if(context.type == context.UserEventType.VIEW|| context.type == context.UserEventType.EDIT)
           {

             if(runtime.executionContext != "USERINTERFACE" )
               return true;
             log.debug({ title: 'Start Time', details: new Date()});
             var SalesRecord = context.newRecord;  
             var form=context.form;
             var get_value_cads;
             try
             {
               get_value_cads= Cads_SO(form,serverWidget,search,SalesRecord,record,log); //Script Use 1152
             }
             catch(er){
               log.debug({ title: 'Cads_SO Error', details: er.message});
               get_value_cads=true;}
             if(get_value_cads)
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

               try{HighlightNotEligibleForReturn(form,serverWidget,SalesRecord,log); }catch(er){}// Script Use :-924  //OK
               log.debug({ title: 'HighlightNotEligibleForReturn', details:'OK'});
               try{Show_RETURNING_CUSTOMER_INFORMATION(form,serverWidget,SalesRecord,customer_data,context,log); }catch(er){} //Script Use 453  //OK
               log.debug({ title: 'Show_RETURNING_CUSTOMER_INFORMATION', details:'OK'});
               try{Highlight_custbody319(form,serverWidget,SalesRecord,log); }catch(er){} // Script Use 912   //OK
               log.debug({ title: 'Highlight_custbody319', details:'OK'});
               try{Highlight_SO_Fields(search,form,serverWidget,SalesRecord,log); }catch(er){}//  Script 607  //OK
               log.debug({ title: 'Highlight_SO_Fields', details:'OK'});
               try{IA_Requested_HighLight(context,serverWidget,SalesRecord,log); }catch(er){} //Script Use-865    //OK
               log.debug({ title: 'IA_Requested_HighLight', details:'OK'});
               try{Highlight_CustomerName_On_SO(form,serverWidget,customer_data); }catch(er){} // Script Use 971   //OK
               log.debug({ title: 'Highlight_CustomerName_On_SO', details:'OK'});
               //Molds_SO(context,serverWidget,search,SalesRecord,log); //Script Use 606
               try{ BackStock_Automation_UE_BL(context,SalesRecord,log,url); }catch(er){} //Script Use 632  //OK
               log.debug({ title: 'BackStock_Automation_UE_BL', details:'OK'});
             }
             log.debug({ title: 'End Time', details: new Date()});
           }
         }
         return {
           beforeLoad: beforeLoad
         };
       });


String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};



function HighlightNotEligibleForReturn(form,serverWidget,SalesRecord,log)
{

  var arr_not_eligble=getNotEligbleItem(SalesRecord,log);
  if(arr_not_eligble.length>0)
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
    // log.debug({ title: 'HighlightNotEligibleForReturn', details: 'HighlightNotEligibleForReturn 1'});

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
    //  log.debug({ title: 'HighlightNotEligibleForReturn', details: 'HighlightNotEligibleForReturn 2'});

  }

}



function Show_RETURNING_CUSTOMER_INFORMATION(form,serverWidget,SalesRecord,customer_data,context,log)
{
  if(context.type == context.UserEventType.EDIT)
  {
    //log.debug({ title: 'Show_RETURNING_CUSTOMER_INFORMATION', details: customer_data});
    //log.debug({ title: 'customer_data.custentity_sales_order_1', details: customer_data.custentity_sales_order_1});
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
      //log.debug({ title: 'Show_RETURNING_CUSTOMER_INFORMATION', details: 'Show_RETURNING_CUSTOMER_INFORMATION'});

    }
  }
}




function  Highlight_custbody319(form,serverWidget,SalesRecord)
{

  var incomped_item= SalesRecord.getValue('custbody319'); 
  var getDropShipMaterial= SalesRecord.getValue('custbody39');
  incomped_item= Field_Value_Check(incomped_item);
  if( incomped_item == "T" &&  getDropShipMaterial )
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
    // log.debug({ title: 'Highlight_custbody319', details: 'Highlight_custbody319'});
  }
}


function Highlight_SO_Fields(search,form,serverWidget,SalesRecord,log)
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
    // log.debug({ title: 'Highlight_SO_Fields', details: 'Highlight_SO_Fields'});

  }

  var mySearch = search.load({id:'customsearch2138'});
  var mySearchFilter = search.createFilter('internalid',null,'anyof',SalesRecord.id);
  mySearch.filters.push(mySearchFilter);
  var search_record = mySearch.run(); 
  search_record.each(function(result) {
    form.getField("custbody_to_be_watched_so_only").defaultValue="<span style='background-color: yellow; font-weight: bold; font-size: 9pt;'>To Be Watched <span class='checkbox_read_ck'><img class='checkboximage' src='/images/nav/ns_x.gif'/></span></span>";
  });


  var custbody_pot_backstock_ring_match= Field_Value_Check(SalesRecord.getValue("custbody_pot_backstock_ring_match"));
  if(custbody_pot_backstock_ring_match=="T" )
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
    log.debug({ title: 'fraudCheckVal', details: ex.message});
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
    fraudyFields=Field_Value_Check(fraudyFields);
    if(fraudyFields =='T')
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
    fraudyFields=Field_Value_Check(fraudyFields);	
    if(fraudyFields =='T')
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
    //log.debug({ title: 'Highlight_CustomerName_On_SO', details: 'Highlight_CustomerName_On_SO'});

  }
}






function getNotEligbleItem(SalesRecord,log)
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
  return neiArr;
}

function Cads_SO(form,serverWidget,search,SalesRecord,record,log) {

  var cads_index_value_check=[];
  var cads_index_value_check_index=[];
  var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
  for (var x = 0; x < lineItemCount; x++) {
    var cads = [];
    var item = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
    var description =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'description',line: x});
    if(description)
    {	
      var des = description.split('Size');
      var ring_size_value=des[1];
      ring_size_value= parseFloat(ring_size_value); 
      if(ring_size_value)
      {
        var parent_data = search.lookupFields({type: 'item',id:item ,columns: ['parent','parent.vendor']});
        var parent = Get_Field_Value(parent_data.parent);
        var vendor = Get_Field_Value(parent_data['parent.vendor']);
        if (!parent )
          continue;
        if (parent &&  vendor) {
          log.debug({ title: 'parent', details: parent});
          log.debug({ title: 'vendor', details: vendor});
          search.create({
            "type": "customrecord_internal_cad",
            "filters": [
              ['custrecord_icr_parent_sku', search.Operator.ANYOF, parent],
              'and',
              ['custrecord_icr_ring_size', search.Operator.BETWEEN,[(ring_size_value - 1),(ring_size_value + 1)]],
              //'and',
              // ['custrecord_icr_vendor', search.Operator.ANYOF,vendor]
            ],
              "columns": ['custrecord_icr_ring_size', 'custrecord_dimensions_n_shape']
          }).run().each(function(result) {
            var get_cads_value=result.getValue("custrecord_dimensions_n_shape");
            get_cads_value=get_cads_value.replaceAll(',','');
            cads.push(get_cads_value);
            return true;	
          });
        }
        if(cads.length>0)
        {
          var cads_get=cads.join(',');
          cads_get=cads_get.replaceAll(';','');
          cads_get=cads_get.replaceAll(' ','');
          cads_get=encodeURI(cads_get);
          cads_get=cads_get.replaceAll('%0A','');
          cads_get=decodeURI(cads_get);
          cads_get=cads_get.substring(0,3900);
          var chkCadValue =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_cad_so',line: x}); 
          if(chkCadValue)
          {
            chkCadValue=chkCadValue.replaceAll('<br>','');
            chkCadValue=chkCadValue.replaceAll(';',',');
            chkCadValue=chkCadValue.replaceAll(' ',',');
            chkCadValue=encodeURI(chkCadValue);
            chkCadValue=chkCadValue.replaceAll('%0A','');
            chkCadValue=decodeURI(chkCadValue);
            //log.debug({ title: 'chkCadValue Old', details: encodeURI(chkCadValue)});
            // log.debug({ title: 'chkCadValue', details: chkCadValue});
            //log.debug({ title: 'cads_get', details: cads_get});
          }
          if(cads_get != chkCadValue)
          {
            cads_index_value_check.push(cads.join(';\n'));
            cads_index_value_check_index.push(x);
          }
        }

      }
    }
  }
  if(cads_index_value_check.length>0)
  {
    var SalesRecord_Update = record.load({
      "type": record.Type.SALES_ORDER,
      "id": SalesRecord.id
    });
    var lineItemCount = SalesRecord_Update.getLineCount({sublistId: 'item'});
    for (var x = 0; x < lineItemCount; x++) {
      var index_value=cads_index_value_check_index.indexOf(x);
      if(index_value>=0)
      {
        SalesRecord_Update.setSublistValue({
          sublistId: 'item',
          fieldId: 'custcol_cad_so',
          line: x,
          value: cads_index_value_check[index_value]
        });
      }
    }
    SalesRecord_Update.save({
      enableSourcing: true,
      ignoreMandatoryFields: true
    });
    var set_value="<script type='text/javascript'> location.reload(); </script>";
    form.addField({
      id : 'custpage_page_refresh_cad_page',
      type : serverWidget.FieldType.INLINEHTML,
      label : 'custpage_page_refresh_cad_page'
    }).defaultValue=set_value;
    return false;
  }
  return true;
}
function Molds_SO(context,serverWidget,search,SalesRecord,log)
{
  if(context.type == context.UserEventType.VIEW)
  {
    var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
    var item_melee_colour=[];
    for(var x=0; x < lineItemCount; x++)
    {
      //Molds SO Script
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
      fieldValue += 'var items = document.getElementById("item_splits");';
      for(var a=0;a<item_melee_colour.length;a++)
      {
        fieldValue += 'var row = items.rows[' + item_melee_colour[a] + '];';
        fieldValue += 'for ( var j = 0; j < row.cells.length; j++ ) {';
        fieldValue += 'var cell = row.cells[j];';
        fieldValue += 'cell.style.setProperty("background-color","yellow","important");';
        fieldValue += '}';
      }
      fieldValue += "</script>";
      var form=context.form;
      form.addField({
        id : 'custpage_highlight_fields_show_molds_so_2015',
        type : serverWidget.FieldType.INLINEHTML,
        label : 'Highlight Fields'
      }).defaultValue=fieldValue;
      // log.debug({ title: 'Molds_SO', details: 'Molds_SO'});

    }
  }

}


function BackStock_Automation_UE_BL(context,SalesRecord,log,url)
{
  if(context.type == context.UserEventType.VIEW)
  {

    var custbody_pot_backstock_ring_match=Field_Value_Check(SalesRecord.getValue('custbody_pot_backstock_ring_match'));
    if(SalesRecord.getValue('orderstatus')=='A' && custbody_pot_backstock_ring_match=='T')
    {

      var form=context.form;
      var restUrl = url.resolveScript({
        scriptId: 'customscript_backstock_page', //  scriptId
        deploymentId: 'customdeploy_backstock_page' //  deploymentId
      });
      restUrl+= "&order=" + SalesRecord.id;
      form.clientScriptModulePath = './client_script_so_api_2.js';
      // log.debug({ title: 'restUrl', details:restUrl});


      form.addButton({
        id : 'custpage_backstock',
        label : 'Backstock Matches',
        functionName: "BackStock_Automation_UE_BL_Link"
      });

      /*
        form.addButton({
          id : 'custpage_backstock',
          label : 'Backstock Matches',
          functionName: "window.location.href='" + restUrl + "'"
        });
  */
      //form.addButton("custpage_backstock","Backstock Matches","window.location.href='" + restUrl + "';");


      //log.debug({ title: 'BackStock_Automation_UE_BL', details: 'BackStock_Automation_UE_BL'});
    }
  }

}



function test_catgetory(category){
  var regex = /Melee/;
  return regex.test(category);
}





function test_number(number) {
  var regex = /^[0-9]+$/;
  return regex.test(number);
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

function Get_Field_Text(data_value)
{
  if(data_value)
  {
    if(data_value[0])
    {
      if(data_value[0].text)
      {
        return data_value[0].text;
      }
    }
  }
  return "";
}

function Field_Value_Check(value_get)
{
  if(value_get==true)
  {
    return "T";
  }
  else if(value_get==false)
  {
    return "F";
  }
  return value_get;
}