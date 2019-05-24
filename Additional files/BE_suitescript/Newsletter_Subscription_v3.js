function Newsletter_Subscription(type)
{
    nlapiLogExecution("debug","UE Event Type: " + type,"Context: " + nlapiGetContext().getExecutionContext());
	
	if(type=="create")
    {
        try
        {
            var lead = nlapiGetNewRecord();
            var subscribe = lead.getFieldValue("custrecord_ocf_subscribe_to_news_letter");
			nlapiLogExecution("debug","Subscription Checkbox Value: " + subscribe);

            if(subscribe=="T")
            {
                var p_email = lead.getFieldValue("custrecord_ocf_email");
                var p_firstname = lead.getFieldValue("custrecord_ocf_first_name");
                var p_lastname = lead.getFieldValue("custrecord_ocf_last_name");

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

                var resp = nlapiRequestURL("https://www.brilliantearth.com/subscript-newsletter/",post_obj,headers);

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
            var subscribe = lead.getFieldValue("custrecord_ocf_subscribe_to_news_letter");

            if(subscribe=="T" && old.getFieldValue("custrecord_ocf_subscribe_to_news_letter")!="T")
            {
                var p_email = lead.getFieldValue("custrecord_ocf_email");
                var p_firstname = lead.getFieldValue("custrecord_ocf_first_name");
                var p_lastname = lead.getFieldValue("custrecord_ocf_last_name");

                p_email = escape(p_email);
                p_email = p_email.replace("@","%40");

                var post_obj = "email=" + p_email + "&firstname=" + escape(p_firstname) + "&lastname=" + escape(p_lastname);

                nlapiLogExecution("debug","POST String",post_obj);
				
				var headers = [];
				headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

                var resp = nlapiRequestURL("https://www.brilliantearth.com/subscript-newsletter/",post_obj,headers);

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
