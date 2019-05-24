nlapiLogExecution("audit","FLOStart",new Date().getTime());
var flag;
function IsHighValueCustomer()
{   
  try
  {
    var customer_id=nlapiGetRecordId();
    var email_id=nlapiGetFieldValue('email');
    /*High Value Appointment Approval field on Customer Page */
    var high_val_approver=nlapiGetFieldValue('custentity_high_val_appt_approval');
    if(high_val_approver==1)
    {
      return true;
    }

    /* Sales Order */ 
    var filters=new Array();
    filters.push(new nlobjSearchFilter('amount',null,'greaterthanorequalto',20000));
    filters.push(new nlobjSearchFilter('status',null,'noneof',['SalesOrd:C','SalesOrd:H']));
    filters.push(new nlobjSearchFilter('entity',null,'is',customer_id));//2682
    var salesord=nlapiSearchRecord('salesorder',null,filters,[new nlobjSearchColumn('amount'),new nlobjSearchColumn('status'),new nlobjSearchColumn('entity')]);
    if(salesord)
    {
      return true;
    }

    /* Estimate Transaction */
    var filters=new Array();
    filters.push(new nlobjSearchFilter('amount',null,'greaterthanorequalto',20000));
    filters.push(new nlobjSearchFilter('entity',null,'is',customer_id));//4303
    var estimate=nlapiSearchRecord('estimate',null,filters);
    if(estimate)
    {
      nlapiLogExecution('Debug','Estimate','true');
      return true;
    }

    /*Customer Deposit*/
    var filters=new Array();
    filters.push(new nlobjSearchFilter('amount',null,'greaterthanorequalto',20000));
    filters.push(new nlobjSearchFilter('entity',null,'is',customer_id));//17171
    var cust_deposit=nlapiSearchRecord('customerdeposit',null,filters);
    if(cust_deposit)
    {
      return true;
    }
    /*Appointment Item */
    var filter=new Array();
    filter.push(new nlobjSearchFilter('custevent_customer_email','custrecord_appointment_item_parent','is',email_id));
    filter.push(new nlobjSearchFilter('custrecord_appointment_item_price',null,'greaterthanorequalto',20000));
    var appt_item= nlapiSearchRecord('customrecord_appointment_item',null,filter);
    if(appt_item)
    {
      return true;
    }
    /*Entity Item */
    var filters=new Array();
    filters.push(new nlobjSearchFilter('custrecord_entity_item_price',null,'greaterthanorequalto',20000));
    filters.push(new nlobjSearchFilter('custrecord_entity_item_parent',null,'is',customer_id));//1046078
    var entity_item=nlapiSearchRecord('customrecord_entity_item',null,filters,[new nlobjSearchColumn('custrecord_entity_item_price'),new nlobjSearchColumn('custrecord_entity_item_parent')]);
    if(entity_item)
    {
      return true;
    }
    /* Custom Diamond Page*/
    var filters=new Array();
    filters.push(new nlobjSearchFilter('custrecord_custom_diamond_price',null,'greaterthanorequalto',20000));
    filters.push(new nlobjSearchFilter('custrecord_diamond_customer_name',null,'is',customer_id));//1046078
    filters.push(new nlobjSearchFilter('custrecord_diamond_status',null,'noneof',5));
    var cdp=nlapiSearchRecord('customrecord_custom_diamond',null,filters,[new nlobjSearchColumn('custrecord_custom_diamond_price'),new nlobjSearchColumn('custrecord_diamond_customer_name')]);
    if(cdp)
    {
      return true;
    }
    return false;
  }
  catch(ex)
  {
    nlapiLogExecution("error","Error checking high value customer","Details: " + ex.message);
    return false;
  }

}
function beforeLoad(type,form)
{

  if(nlapiGetContext().getExecutionContext() == 'userinterface')
  {

    if(type=='view' || type=='edit')
    {

      var record_type=nlapiGetRecordType();
       nlapiLogExecution("debug","Record type",record_type);
      if(record_type=='customer' || record_type=='lead' || record_type=='prospect' )
      {
            nlapiLogExecution("debug","Inside",record_type);
        if(IsHighValueCustomer())
        {
      
          //displayCheckedHighValue(form);
          // nlapiSetFieldValue('custentity_high_value_customer','T');
          //var field =form.getField('custentity_high_value_customer');
          if(type=='view')
          {
            nlapiSubmitField(record_type,nlapiGetRecordId(),'custentity_high_value_customer','T');
          }
          flag=true;
        }
        else
        {
          //  nlapiSetFieldValue('custentity_high_value_customer','F');
          //var field =form.getField('custentity_high_value_customer');
          if(type=='view')
          {
            nlapiSubmitField(record_type,nlapiGetRecordId(),'custentity_high_value_customer','F');
          }
          flag=false;
        }

        changeTitleBackground(form,flag,type);

      }
    }
  }
}

function changeTitleBackground(form,flag,type) {
  var highValueCheckFld = form.addField("custpage_high_val_cust", "inlinehtml", "High Value");

  var html="<script type='text/javascript'>\
document.onreadystatechange = function(){\
if(document.readyState === 'complete'){";

  if(flag==true)
  {
    html+=  "var div_f = document.getElementsByClassName('uir-record-id');\
div_f[0].setAttribute('style', 'background-color:#ADFF2F');";
    if(type=='view')
    {
      var inner_html='<img class="checkboximage" src="/images/nav/ns_x.gif" alt="Checked">';
      html+="var span_val = document.getElementById('custentity_high_value_customer_fs');\
span_val.removeAttribute('class');\
span_val.setAttribute('class', 'checkbox_read_ck');";
    }
  }
  else
  {
    if(type=='view')
    {
      var inner_html='<img class="checkboximage" src="/images/nav/ns_x.gif" alt="UnChecked">';

      html+="var span_val = document.getElementById('custentity_high_value_customer_fs');\
span_val.removeAttribute('class');\
span_val.setAttribute('class', 'checkbox_read_unck');\
span_val.innerHTML='"+inner_html+"';";
    }
  }
  html+=" }\
}\
</script>";
  highValueCheckFld.setDefaultValue(html);
}

