function Message_Flag_Checker(request,response)
{
	var messageId = request.getParameter("message");
	
	var isIncoming = nlapiLookupField("message",messageId,"isincoming");
	
	response.write("Is Incoming? " + isIncoming);
}
