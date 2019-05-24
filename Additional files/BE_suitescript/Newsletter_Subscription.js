function Newsletter_Subscription(type)
{
    if(type=="create")
    {
        try
        {
            var lead = nlapiGetNewRecord();
            var subscribe = lead.getFieldValue("custentity_celigo_subs_to_newsletter");

            if(subscribe=="T")
            {
                var p_email = lead.getFieldValue("email");
                var p_firstname = lead.getFieldValue("firstname");
                var p_lastname = lead.getFieldValue("lastname");

                /*
                var post_obj = {
                    email : p_email,
                    firstname: p_firstname,
                    lastname: p_lastname
                };
                */

                p_email = escape(p_email);
                p_email = p_email.replace("@","%40");

                var post_obj = "email=" + p_email + "&firstname=" + escape(p_firstname) + "&lastname=" + escape(p_lastname);

                nlapiLogExecution("debug","POST String",post_obj);
				
				var headers = [];
				headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

                var resp = nlapiRequestURL("http://www.brilliantearth.com/subscript-newsletter/",post_obj,headers);

                nlapiLogExecution("debug","Response Code",resp.getCode());
                nlapiLogExecution("debug","Response Body",resp.getBody());
            }
        }
        catch(err)
        {
            nlapiLogExecution("error","Error Subscribing Entity to Newsletter","Details: " + err.message);
            return true;
        }
    }
    else if(type=="edit")
    {
        try
        {
            var lead = nlapiGetNewRecord();
            var old = nlapiGetOldRecord();
            var subscribe = lead.getFieldValue("custentity_celigo_subs_to_newsletter");

            if(subscribe=="T" && old.getFieldValue("custentity_celigo_subs_to_newsletter")!="T")
            {
                var p_email = lead.getFieldValue("email");
                var p_firstname = lead.getFieldValue("firstname");
                var p_lastname = lead.getFieldValue("lastname");

                p_email = escape(p_email);
                p_email = p_email.replace("@","%40");

                var post_obj = "email=" + p_email + "&firstname=" + escape(p_firstname) + "&lastname=" + escape(p_lastname);

                nlapiLogExecution("debug","POST String",post_obj);
				
				var headers = [];
				headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

                var resp = nlapiRequestURL("http://www.brilliantearth.com/subscript-newsletter/",post_obj,headers);

                nlapiLogExecution("debug","Response Code",resp.getCode());
                nlapiLogExecution("debug","Response Body",resp.getBody());
            }
        }
        catch(err)
        {
            nlapiLogExecution("error","Error Subscribing Entity to Newsletter","Details: " + err.message);
            return true;
        }
    }
}
