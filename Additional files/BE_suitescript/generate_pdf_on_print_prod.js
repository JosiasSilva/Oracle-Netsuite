function print_PDF_selected_item(request,response){
	try{
		var json_array=request.getParameter('json_data');
      nlapiLogExecution("debug",'json_array',json_array);
		var data_json=JSON.parse(json_array);
      nlapiLogExecution("debug",'data_json',data_json);
		var len=data_json.length;
      nlapiLogExecution("debug",'len',len);
		var xml="<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>\
		<pdf>\
		<head>\
		<macrolist>\
		<macro id='header'>\
		<table><tr>\
		<td align='left' colspan='12'>Inventory Pulls Dashboard</td>\
		</tr></table>\
		</macro>\
		</macrolist>\
		<style type='text/css'>.footer{\
		margin-top: 50px;\
		font-size: 24pt;\
		}\
		.main{\
		border: 1px solid black;\
		}\
		th {\
		font-weight: bold;\
		font-size: 10pt;\
		vertical-align: middle;\
		padding-right: 6px;\
		padding-left: 6px;\
		padding-bottom: 3px;\
		padding-top: 5px; \
		background-color: #cacdd1;\
		color: black;\
		border:1px solid;\
		}\
		td.mainbox {\
		padding-right: 6px;\
		padding-left: 6px;\
		padding-bottom: 4px;\
		padding-top: 4px; \
		border:1px solid;\
		}\
		</style>\
		</head>\
		<body header='header' header-height='8%' padding='0.5in 0.5in 0.5in 0.5in' size='Letter'>\
		<table class='main' width='100%'><tr style='background-color:#cacdd1'>\
		<th align='left' colspan='2'>Sales Order</th>\
		<th align='left' colspan='2'>Item </th>\
		<th align='left' colspan='4'>Description</th>\
		<th align='left' colspan='2'>Qty in SF</th>\
		</tr>";
		
		for(var a=1;a<=len;a++){			
			xml+="<tr>\
			<td align='left' class='mainbox' colspan='2'>"+data_json[a-1].SalesOrder+"</td>\
			<td align='left' class='mainbox' colspan='2'>"+data_json[a-1].Item_Nam+"</td>\
			<td align='left' class='mainbox' colspan='4'>"+data_json[a-1].Description+"</td>\
			<td align='left' class='mainbox' colspan='2'>"+data_json[a-1].SF_Qty+"</td>\
			</tr>";
		}
			xml+="</table>\
			</body>\
			</pdf>";			
		nlapiLogExecution("debug",'xml',xml);	
		var filePDF = nlapiXMLToPDF(xml);
		response.setContentType('PDF', 'PDF_3pages.pdf', 'inline');
		response.write(filePDF.getValue());	
	
	}catch(ee){
		nlapiLogExecution("debug","error Occuring while generating PDF",ee.message);
	}
}