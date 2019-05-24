nlapiLogExecution("audit","FLOStart",new Date().getTime());
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
function Validate_field()
{
  var get_approval=nlapiGetFieldValue('custbody_department_approver');
  var cut_form=nlapiGetFieldValue('customform');
  if(get_approval && cut_form=='239')
  {
    var get_list_memo=nlapiGetCurrentLineItemValue('expense','memo');
    var get_list_location=nlapiGetCurrentLineItemValue('expense','location');
    if(!get_list_memo && !get_list_location)
    {
      alert('Please enter memo & inventory location.')
      return false;
    }
    else if(!get_list_memo)
    {
      alert('Please enter memo.')
      return false;
    }
    else if(!get_list_location)
    {
      alert('Please enter inventory location.')
      return false;
    }
  }
  return true;
}
function Save_record()
{
  var get_approval=nlapiGetFieldValue('custbody_department_approver');
  var cut_form=nlapiGetFieldValue('customform');
   var userid=nlapiGetUser();
  if(get_approval && cut_form=='239')
  {
    var get_invoice_date=nlapiGetFieldValue('custbodyinvoice_date');
    var get_list_invoice_number=nlapiGetFieldValue('custbodyinvoice_number');
    if(!get_invoice_date &&  !get_list_invoice_number && get_approval.indexOf(userid)>-1)
    {
      alert('Please enter invoice date & invoice number.')
      return false;
    }
    else if(!get_invoice_date  && get_approval.indexOf(userid)>-1 )
    {
      alert('Please enter invoice date.')
      return false;
    }
    else if(!get_list_invoice_number && get_approval.indexOf(userid)>-1 )
    {
      alert('Please enter invoice number.')
      return false;
    }
  }
  return true;
}
function ONLY_VALID_ENTRY(type,name)
{
  var cut_form=nlapiGetFieldValue('customform');
  if(name=='account'  && cut_form=='239')
  {
    var get_main_field=nlapiGetFieldText('custbody_common_expense_accounts');
    if(get_main_field)
    {

      var get_list_value=nlapiGetCurrentLineItemText('expense','account');
      if(get_main_field.search(get_list_value)>=0)
      {
        return true;
      }
    }
    return false;
  }
  return true;

}



function Check_File()
{
  try
  {
    var get_all_fiel_obj=[];
    var get_file_obj=nlapiLoadRecord ( 'purchaseorder' , nlapiGetRecordId ( ));
    get_file_obj.setFieldValue('custbody_invoice_1','');
    get_file_obj.setFieldValue('custbody_invoice_2','');
    get_file_obj.setFieldValue('custbody_invoice_3','');
    get_file_obj.setFieldValue('custbody_invoice_4','');
    if(get_file_obj.getFieldValue('customform')=='239')
    {
      var order_file=nlapiSearchRecord('purchaseorder',null,[new nlobjSearchFilter('internalid',null,'anyof',nlapiGetRecordId ( ) ),new nlobjSearchFilter('name','file','isnotempty')],
                                       [
                                         new nlobjSearchColumn('internalid','file','group').setSort(true),
                                         new nlobjSearchColumn('internalid','file','group')
                                       ]);

      if(order_file)
      {
        var get_col=order_file[0].getAllColumns();
        for(var a=0;a<order_file.length;a++)
        {
          var get_file=order_file[a].getValue(get_col[0]);
          if(a==0){  get_file_obj.setFieldValue('custbody_invoice_1',get_file);}
          if(a==1){  get_file_obj.setFieldValue('custbody_invoice_2',get_file);}
          if(a==2){  get_file_obj.setFieldValue('custbody_invoice_3',get_file);}
          if(a==3){  get_file_obj.setFieldValue('custbody_invoice_4',get_file);}
        }
      }
      nlapiSubmitRecord(get_file_obj);
    }
  }
  catch(ex)
  {
    nlapiLogExecution('Debug','Error -',ex.message);
  }
}




