function lookupPhoneBackendSuitelet(request)
{
	nlapiSendEmail(-5, 'amlesh.singh@inoday.com', 'inoday Test', request.getParameter('custparam_phone' ), null, null, null,null);
	nlapiLogExecution('DEBUG', 'resultString', request.getParameter('custparam_phone' ) );
  if (request.getMethod() == 'GET' )
  {
    //null checkon therequired parameter
	if (request.getParameter('custparam_phone' ) != null )
    {
      //Setting upthe filtersand columns
	  var filters = new Array ();
      var columns = new Array ();
			
      //Use thesupplied custparam_phonevalue asfilter
      filters[0] = new nlobjSearchFilter('phone', null, 'is', request.getParameter('custparam_phone' ));
      columns[0] = new nlobjSearchColumn('entityid', null, null );
			
      //Search forcustomer recordsthat matchthe filters
	  var results = nlapiSearchRecord('customer', null, filters, columns);
			
      if (results != null )
      {
        var resultString = '' ;
        //Loop throughthe results
		for (var i = 0; i < results.length ; i++)
        {
          //constructing theresult string
		  var result = results[i];
          resultString = resultString + result.getValue('entityid' );
					
          //adding the| seperator
		  if (i != parseInt (results.length - 1))
          {
            resultString = resultString + '|' ;
          }
          nlapiLogExecution('DEBUG', 'resultString', resultString);
        }
        //response.write(resultString);
      }
      else
      {
        //response.write('none found' );
      }
    }
  }
}