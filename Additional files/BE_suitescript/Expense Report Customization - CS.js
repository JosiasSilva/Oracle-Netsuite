nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*User Event Code*/
function beforeLoad(type,form)
{
	var expense=form.getSubList('expense');
	var memo= expense.getField('memo');
	memo.setMandatory(true);
	//nlapiSetLineItemMandatory('expense','memo',true);
}

/*Client Script Code */
function PageInit(type)
{
  try
  {  
    if(type == 'create') {
      //Set Date feild as Blank
      nlapiSetFieldValue('trandate','');
    }
  }catch(err)
  {
    alert('Unable to intialization page due to following error :'+ err.message);
  }
  return true;
}


function Validate_Line_Item()
{
  var flag=true;
  var amount=nlapiGetCurrentLineItemValue('expense','amount');
  var mediaitem=nlapiGetCurrentLineItemValue('expense','expmediaitem');
  if(amount)
  {
    if(amount>=25 && (!mediaitem))
    {
      flag=false;
      alert('Please attach file for expense line');
    }
  }
  return flag;
}

function saveRecord()
{
  var flag=true;
  var lineItemCount = nlapiGetLineItemCount('expense'); 
  var tranDate=nlapiGetFieldValue('trandate');
  if(tranDate)
  {
    var mainDate=new Date(tranDate);
    var month1=mainDate.getMonth()+1;	

    for(var i=1;i<=lineItemCount;i++)
    {
      var expenseDate=nlapiGetLineItemValue('expense','expensedate',i)
      var date= new Date(expenseDate);
      var month=date.getMonth()+1;
      if(month1!=month)
      {
        flag=false;
        break;
      }

    }
  }
  if(flag==false)
  {
    alert('This expense report has conflicting dates. Please create a separate expense report for each month. For example, if you have receipts from January and February, then you must create a separate expense report for January’s transactions and a second expense report for February’s transactions. Click Edit to correct the expense report');
  }
  return flag;

}