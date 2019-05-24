nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Print(request, response)
{
	try
	{
		/*var id = 9152068;
		var r = nlapiPrintRecord('PICKINGTICKET', id, 'PDF');
		response.setContentType(r.getType(), 'transaction'+id+'.pdf', 'attachment');
		response.write(r.getValue());*/
		var Arr = [];
		var ck_print=request.getParameter("Print");
		var index_value=request.getParameter("index_value");
		var record_type='PICKINGTICKET';
		 //record_type='PACKINGSLIP';
		var custpage_file_url=new Array();
		var custpage_file_id=new Array();
		var transfer_internalid=JSON.parse(request.getParameter("transfer_internalid"));
		if(ck_print)
		{
			record_type='PACKINGSLIP';
			//record_type='PICKINGTICKET';
		}
		nlapiLogExecution("debug",'Test 1',index_value);
		if(index_value)
		{
			nlapiLogExecution("debug",'Test 2',index_value);
			index_value=parseInt(index_value);
			var file_data=nlapiGetContext().getSetting('SESSION', 'custpage_file_url');
			var file_data_id=nlapiGetContext().getSetting('SESSION', 'custpage_file_id');			
			if(file_data!=null && file_data!='')
			{
				nlapiLogExecution("debug",'Test 3',index_value);
			  custpage_file_url=JSON.parse(file_data); 
			}		
			if(file_data_id!=null && file_data_id!='')
			{
				nlapiLogExecution("debug",'Test 4',index_value);
			  custpage_file_id=JSON.parse(file_data_id); 
			}
		}
		else
		{
			nlapiLogExecution("debug",'Test 5',index_value);
			index_value=0;
		}	 
		var value_run=0;
		var t=0;
		if(transfer_internalid!=null && transfer_internalid.length>0)
		{
			for(t=index_value;t<transfer_internalid.length;t++)
			{
				value_run=value_run+1;
				var value_internalid=transfer_internalid[t];
				var fileID = "";
				try
				{
					var pdfFile = nlapiPrintRecord(record_type, transfer_internalid[t],'PDF');
					pdfFile.setFolder(8533934);
					pdfFile.setIsOnline(true);
					pdfFile.setName(transfer_internalid[t]+'.pdf');		
					var fileID = nlapiSubmitFile(pdfFile);
					var fileURL = nlapiLoadFile(fileID).getURL(); 
					custpage_file_url.push(fileURL);
					custpage_file_id.push(fileID);
					//pdfFile = nlapiPrintRecord(record_type, transfer_internalid[t],'DEFAULT');
					nlapiLogExecution("debug",'Printed Records',transfer_internalid[t]);
				}
				catch(err)
				{
					nlapiLogExecution("debug",'Not Printed Records'+transfer_internalid[t],err.message);
					Arr.push(transfer_internalid[t]);
				}
				if(t==(transfer_internalid.length-1) || t>=20)			
				{
					nlapiGetContext().setSetting('SESSION', 'custpage_file_url',null);
					nlapiGetContext().setSetting('SESSION', 'custpage_file_id',null);
					Show_Print(custpage_file_url,custpage_file_id);
					return;
				}
				if(value_run==10)
				{
					break;		   
				}
			}
			nlapiGetContext().setSetting('SESSION', 'custpage_file_url',JSON.stringify(custpage_file_url));
			nlapiGetContext().setSetting('SESSION', 'custpage_file_id',JSON.stringify(custpage_file_id));
			var param = new Array();
			param['index_value'] =t;
			param['transfer_internalid'] = JSON.stringify(transfer_internalid);
			if(ck_print)
			{
				param['Print'] =ck_print;  
			}				
			response.sendRedirect("SUITELET", "customscript_transfer_order_dashboard_v4", "customdeploy_transfer_order_dashboard_v4", false, param);		
		}
		nlapiLogExecution("debug",'Not Printed Records',JSON.stringify(Arr));
	}
		
	catch(errr)
	{
		nlapiLogExecution('error','Error on Page',errr.message);
	}
}

function Show_Print(custpage_file_url,allfile_id)
{
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += "<pdfset>";
	
	for(var s=0;s<custpage_file_url.length;s++)
	{
		xml += "<pdf src='"+ nlapiEscapeXML(custpage_file_url[s]) +"'/>";
	}
	xml += "</pdfset>";
	var consolidatedPDF = nlapiXMLToPDF(xml);
	for(var s=0;s<allfile_id.length;s++)
	{
		nlapiDeleteFile(allfile_id[s]);
	}
	response.setContentType('PDF', 'Print.pdf ', 'inline');
	response.write(consolidatedPDF.getValue());
}