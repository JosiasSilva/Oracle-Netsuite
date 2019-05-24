//var datain = {"email":"sanjeet.sharma@inoday.com","yelp_elite_status":"success","yelp_number_of_reviews":3,"yelp_number_of_friends":5,"yelp_1_star_reviews":4,"yelping_since":"9/11/2017"};
function yelp_Integration(datain)
{
  nlapiLogExecution('Audit', 'Yelp Integration JSON Data', JSON.stringify(datain));
  var err = new Object();
  err = {
    "status": "failed",
    "message": "Data Not Found"
  };
  try
  {
    // var datain = {"email":"anuj.verma@inoday.com","yelp_elite_status":"success","yelp_number_of_reviews":3,"yelp_number_of_friends":5,"yelp_1_star_reviews":4,"yelping_since":"9/11/2017"};
    if(datain.email)
    {
      var LeadObj;
      var filter = [];
      filter.push(new nlobjSearchFilter('email',null,'is',datain.email));
      filter.push(new nlobjSearchFilter('isinactive',null,'is','F'));

      var Result = nlapiSearchRecord('customer',null,filter);
      nlapiLogExecution('Audit','Result JSON',JSON.stringify(Result));
      if(Result)
      {
        nlapiLogExecution('Audit', 'Existing customer Id : '+ Result[0].getId());
        nlapiSubmitField('customer', Result[0].getId(),["custentity_yelp_elite_status","custentity_yelp_number_of_reviews","custentity_yelp_number_of_friends","custentity_yelp_1_star_reviews","custentity_yelping_since"],[datain.yelp_elite_status,datain.yelp_number_of_reviews,datain.yelp_number_of_friends,datain.yelp_1_star_reviews,datain.yelping_since]);

        nlapiLogExecution('Audit','Customer with Yelp Info',"Customer record has been updated with Yelp Info successfully");

        err.status = "OK";
        err.message = "Success";
      }
      else
      {
        err.status = "Failed";
        err.message = "Customer does not exist";
        nlapiLogExecution('Error','Customer Information',JSON.stringify(err));
      }
    }
    else
    {
      err = {
        "status": "failed",
        "message": "email field is blank."
      };
      nlapiLogExecution('Error','Email Information',JSON.stringify(err));
      return JSON.stringify(err);
    }
  }
  catch(ex)
  {
    err.status = "failed";
    err.message = ex.message;
    nlapiLogExecution('Error','Error on Request',ex.message);
  }
  nlapiLogExecution('Error', 'Response :',JSON.stringify(err));
  return JSON.stringify(err);
}