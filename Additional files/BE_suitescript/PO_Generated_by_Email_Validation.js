nlapiLogExecution("audit","FLOStart",new Date().getTime());
function validateField(type,name)
{
  if( name=='entity')
  {
    var po_gen_by_email=nlapiGetFieldValue('custbody_po_generated_by_email_alias');
    var custom_form=nlapiGetFieldValue('customform');

    if(custom_form=='239')
    {
      var vendor_id=nlapiGetFieldValue('entity');
      var invoice_approval_vendor=nlapiLookupField('vendor',vendor_id,'custentity_invoice_approval_vendor');
      if(invoice_approval_vendor=='F')
      {
        alert("You have selected an vendor that is not approved for the invoice flow. Please update the vendor's page and try again");
        return false;
      }
      else
      {
        var vendor_fields = nlapiLookupField('vendor', vendor_id, ['custentity_department_approver', 'custentity_common_expense_accounts','expenseaccount']);
        nlapiSetFieldValue('custbody_department_approver', vendor_fields.custentity_department_approver.split(','));
        nlapiSetFieldValue('custbody_common_expense_accounts', vendor_fields.custentity_common_expense_accounts.split(','));
        nlapiSelectLineItem('expense',1);
        //var itemIdNo = 1093360; // Resize Ring
        nlapiSetCurrentLineItemValue('expense', 'account', vendor_fields.expenseaccount);
        nlapiCommitLineItem('expense');
        //nlapiSubmitField('purchaseorder' , nlapiGetRecordId() , ['custbody_department_approver','custbody_common_expense_accounts'] , [[vendor_fields.custentity_department_approver.split(',')], [vendor_fields.custentity_common_expense_accounts.split(',')]])
        // return true;
      }
    }
  }
  return true;
}