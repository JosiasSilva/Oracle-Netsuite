nlapiLogExecution("audit","FLOStart",new Date().getTime());
function TicketSearch()
{
  try
  {
     nlapiLogExecution('debug','Scheduled script');
  }
  catch(e)
  {
     nlapiLogExecution('debug','Error Message is :',e.message);
  }
}