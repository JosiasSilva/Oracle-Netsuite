function TEST(request,response)
{
  var form = nlapiCreateForm('New Form');
  form.addField('custpage_transactions', 'select', 'Select A transaction', '-30');
  form.addField('custpage_transactionses', 'select', 'Select A transaction', 'transaction');
  response.writePage(form);
}