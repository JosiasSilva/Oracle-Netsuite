function Return_Label_Email_Queue(request,response)
{
	if(request.getMethod()=="GET")
	{
		try
		{
			var form = nlapiCreateForm("Return Label Email Queue");
			
			var list = form.addSubList("custpage_orders","list","Sales Orders");
			var fld = list.addField("custpage_order_id","select","Sales Order","salesorder");
			fld.setDisplayType("inline");
			list.addField("custpage_order_date","date","Date");
			fld = list.addField("custpage_order_customer","select","Customer","customer");
			fld.setDisplayType("inline");
			list.addField("custpage_order_rsl_status","select","Return Shipping Label Status","customlist126");
			fld = list.addField("custpage_order_return_label","text","Return Shipping Label");
			fld = list.addField("custpage_order_type","select","Type of Order","customlist38");
			fld.setDisplayType("inline");
			list.addField("custpage_order_customer_email","text","Customer Email");
			
			var orders = [];
			
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters.push(new nlobjSearchFilter("custbody138",null,"is","1")); //Return Shipping Label Status = Label Needed
			filters.push(new nlobjSearchFilter("custbody137",null,"noneof","@NONE@")); //Return Shipping Label Field = Not Empty
			var cols = [];
			cols.push(new nlobjSearchColumn("tranid"));
			cols.push(new nlobjSearchColumn("trandate"));
			cols.push(new nlobjSearchColumn("entity"));
			cols.push(new nlobjSearchColumn("custbody138")); //Return Shipping Label Status
			cols.push(new nlobjSearchColumn("custbody137")); //Return Shipping Label (file)
			cols.push(new nlobjSearchColumn("custbody87")); //Type of Order
			cols.push(new nlobjSearchColumn("custbody2")); //Customer Email
			var results = nlapiSearchRecord("salesorder",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					orders.push({
						custpage_order_id : results[x].getId(),
						custpage_order_date : results[x].getValue("trandate"),
						custpage_order_customer : results[x].getValue("entity"),
						custpage_order_rsl_status : results[x].getValue("custbody138"),
						custpage_order_return_label : results[x].getValue("custbody137"),
						custpage_order_type : results[x].getValue("custbody87"),
						custpage_order_customer_email : results[x].getValue("custbody2")
					});
				}
				
				list.setLineItemValues(orders);
			}
			
			form.addSubmitButton("Send Emails");
			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Return Shipping Label Email Queue","Details: " + err.message);
		}
	}
	else
	{
		//Load email configurations
		var config = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_rlec_order_type"));
		cols.push(new nlobjSearchColumn("custrecord_rlec_email_subject"));
		cols.push(new nlobjSearchColumn("custrecord_rlec_email_template"));
		var results = nlapiSearchRecord("customrecord_return_label_email_config",null,filters,cols); //10 Units
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				config.push({
					order_type : results[x].getValue("custrecord_rlec_order_type"),
					email_subject : results[x].getValue("custrecord_rlec_email_subject"),
					email_template : results[x].getValue("custrecord_rlec_email_template")
				});
			}
		}
		
		//40 Units Per Email
		for(var x=0; x < request.getLineItemCount("custpage_orders"); x++)
		{
			if(request.getLineItemValue("custpage_orders","custpage_order_rsl_status",x+1)=="5") //Email customer label
			{
				//Find email configuration for particular order type
				for(var i=0; i < config.length; i++)
				{
					if(config[i].order_type == request.getLineItemValue("custpage_orders","custpage_order_type",x+1))
					{
						var EMAIL_TO = request.getLineItemValue("custpage_orders","custpage_order_customer_email",x+1);
						var SUBJECT = config[i].email_subject;
						var LABEL = request.getLineItemValue("custpage_orders","custpage_order_return_label",x+1);
						LABEL = nlapiLoadFile(LABEL); //10 Units
						
						var template = config[i].email_template;
						
						//Merge email template
						var emailMerger = nlapiCreateEmailMerger(template);
						emailMerger.setTransaction(request.getLineItemValue("custpage_orders","custpage_order_id",x+1));
						
						var mergeResult = emailMerger.merge(); //20 Units
						
						var RECORDS = new Object();
						RECORDS["transaction"] = request.getLineItemValue("custpage_orders","custpage_order_id",x+1);
						
						nlapiSendEmail(nlapiGetUser(),EMAIL_TO,SUBJECT,mergeResult.getBody(),null,null,RECORDS,LABEL); //10 Units
					}
				}
			}
		}
	}
}
