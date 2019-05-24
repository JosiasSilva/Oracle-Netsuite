var incoming_trans=[];
var outgoing_trans=[];
function Transfer_Order_Dashboard(request, response)
{
       
	if(request.getParameter("Save_Data")==null)
	 {
	    Fulfill_Receive(request, response);
	 }
	var ck_location=request.getParameter("custpage_location");
   if(ck_location!=null && ck_location!='')
	{
		   var  ck_location_C=JSON.parse(ck_location.split('\\u0005'));
			ck_location=ck_location_C.split(',');
	}
        
	var form = nlapiCreateForm("Transfer Order Dashboard"); 
	form.addField("custitem_incoming_chk_number", "text").setDisplayType("hidden");
	form.addField("custitem_outgoing_chk_number", "text").setDisplayType("hidden");
	form.addField("custitem_incoming_marg_number", "text").setDisplayType("hidden");
	form.addField("custitem_outgoing_marg_number", "text").setDisplayType("hidden");	
	form.setScript("customscript_transfer_order_dashboard_v1");		
	form.addField("custitem_location", "multiselect", "Location","location").setDefaultValue(ck_location);
	var tab_incoming =form.addTab('custitem_incoming', 'Incoming');			
	var list_incoming = form.addSubList("custitem_list_incoming", "list", "Incoming","custitem_incoming"); 	
	list_incoming.addMarkAllButtons();
	list_incoming.addButton("custitem_incoming_print", "Print","Incoming_Print()");
	list_incoming.addButton("custitem_incoming_receive", "Receive","Incoming_Receive()");
	list_incoming.addField('custitem_incoming_recieve', 'checkbox', 'Receive');            			 
	list_incoming.addField("custitem_incoming_box", "text","Box");
	//list_incoming.addField("custitem_incoming_marg","checkbox");					 
	list_incoming.addField("custitem_incoming_tranid", "text","TO#:");
	list_incoming.addField("custitem_incoming_transferlocation", "text","From");
	//list_incoming.addField("custitem_incoming_item", "text","Item").setDisplayType("hidden");
	list_incoming.addField("custitem_incoming_item", "text","Item");
	list_incoming.addField("custitem_incoming_memo", "text","Decription");
	list_incoming.addField("custitem_incoming_memomain", "text","Memo");
	list_incoming.addField("custitem_incoming_custcol_notes", "textarea","Notes").setDisplayType("entry");			 
	list_incoming.addField("custitem_incoming_custcol16", "text","Certificate Number");
	list_incoming.addField("custitem_incoming_custcol_full_insurance_value", "text","Insurance Value");
	list_incoming.addField('custitem_incoming_internalid', 'text').setDisplayType("hidden");
	list_incoming.addField('custitem_incoming_line_number', 'text').setDisplayType("hidden");
	list_incoming.addField('custitem_incoming_sno', 'text').setDisplayType("hidden");
	list_incoming.addField('custitem_incoming_box_number', 'text').setDisplayType("hidden");
	list_incoming.addField("custitem_incoming_custcol_total_insurance_value", "text","TO Insurance Total").setDisplayType("hidden");
	list_incoming.addField("custitem_incoming_internalid_chk", "text").setDisplayType("hidden");
    var tab_outcoming =form.addTab('custitem_outgoing', 'Outgoing');
	var list_outgoing = form.addSubList("custitem_list_outgoing", "list", "outgoing","custitem_outgoing");
	list_outgoing.addButton("custitem_outgoing_print", "Print","Outgoing_Print()");
	list_outgoing.addButton("custitem_outgoing_print_label", "Print Label","Outgoing_Print_Label()");
	list_outgoing.addButton("custitem_outgoing_print_Fulfill", "Fulfill","Outgoing_Fulfill()");
	list_outgoing.addButton("custitem_outgoing_update", "Update","Outgoing_update()");
    list_outgoing.addField("custitem_outgoing_deltete", "checkbox","Delete");		
	var status=list_outgoing.addField('custitem_outgoing_status', 'select', 'Status');			 
	list_outgoing.addField("custitem_outgoing_box", "integer","Box").setDisplayType("entry");	
	//list_outgoing.addField("custitem_outgoing_marg","checkbox");	
	list_outgoing.addField("custitem_outgoing_tranid", "text","TO#:");
    list_outgoing.addField("custitem_outgoing_shipdate", "text","Ship Date");
	list_outgoing.addField("custitem_outgoing_location", "text","Destination");
	list_outgoing.addField("custitem_outgoing_item", "text","Item");
	list_outgoing.addField("custitem_outgoing_memo", "text","Decription");
	list_outgoing.addField("custitem_outgoing_formulanumeric", "text","Quantity");
	list_outgoing.addField("custitem_outgoing_memomain", "text","Memo");
	list_outgoing.addField("custitem_outgoing_custcol_notes", "textarea","Notes").setDisplayType("entry");			 
	list_outgoing.addField("custitem_outgoing_custcol16", "text","Certificate Number");
	list_outgoing.addField("custitem_outgoing_custcol_full_insurance_value", "text","Insurance Value");	
	list_outgoing.addField("custitem_outgoing_custcol_total_insurance_value", "text","TO Insurance Total");	
	list_outgoing.addField('custitem_outgoing_internalid', 'text').setDisplayType("hidden");
	list_outgoing.addField('custitem_outgoing_line_number', 'text').setDisplayType("hidden");
    list_outgoing.addField('custitem_outgoing_sno', 'text').setDisplayType("hidden");
    list_outgoing.addField('custitem_outgoing_box_number', 'text').setDisplayType("hidden");
	list_outgoing.addField("custitem_outgoing_internalid_chk", "text").setDisplayType("hidden");
	list_outgoing.addField("custitem_outgoing_box_chk", "text").setDisplayType("hidden");
	status.addSelectOption(0, 'Not Started', true);
	status.addSelectOption(1, 'In Progress', false);
	status.addSelectOption(2, 'Completed', false);		
	if(ck_location!=null && ck_location!='')
	{	
		    var incoming_array=[];
			var outgoing_array=[];			
			Check_Push_Data();
			var filter_incoming=new Array();	
			var filter_outgoing=new Array();
			filter_incoming.push(new nlobjSearchFilter("transferlocation",null,"anyof",ck_location));	
			filter_incoming.push(new nlobjSearchFilter("status",null,"anyof",'TrnfrOrd:F'));	
			filter_outgoing.push(new nlobjSearchFilter("location",null,"anyof",ck_location));	
			filter_outgoing.push(new nlobjSearchFilter("status",null,"anyof",'TrnfrOrd:B'));
			if(outgoing_trans!=null && outgoing_trans!='')
			{
			   filter_outgoing.push(new nlobjSearchFilter("internalid",null,"noneof",outgoing_trans));
			}
			var result_outgoing=nlapiSearchRecord(null,'customsearch_all_open_transfer_orders',filter_outgoing);
			var result_incoming=nlapiSearchRecord(null,'customsearch_all_open_transfer_orders',filter_incoming);
			if(result_outgoing)
			{
			   var Col=result_outgoing[0].getAllColumns();
			   var outgoing_array_duplicate=new Array();
			   for(var s=0;s<result_outgoing.length;s++)
				{
				  var custitem_outgoing_internalid=result_outgoing[s].getValue(Col[12]);
				  var boxnumber_check=result_outgoing[s].getValue(Col[15]);
				  if(!boxnumber_check)
				  {
				     boxnumber_check= Check_Box_Value(result_outgoing[s].getValue(Col[14]))+'';
				  }
				  
				   outgoing_array.push({
							 custitem_outgoing_status:0,
							 custitem_outgoing_internalid:result_outgoing[s].getValue(Col[12]),
							 custitem_outgoing_box:boxnumber_check,
							 custitem_outgoing_tranid:"Order #"+result_outgoing[s].getValue(Col[1]),
							 custitem_outgoing_location:result_outgoing[s].getValue(Col[3]),
							 custitem_outgoing_item:result_outgoing[s].getText(Col[4]),
							 custitem_outgoing_memo:result_outgoing[s].getValue(Col[5]),
							 custitem_outgoing_formulanumeric:result_outgoing[s].getValue(Col[6]),
							 custitem_outgoing_memomain:result_outgoing[s].getValue(Col[7]),
							 custitem_outgoing_custcol_notes:result_outgoing[s].getValue(Col[8]),
							 custitem_outgoing_custcol16:result_outgoing[s].getValue(Col[9]),
							 custitem_outgoing_custcol_full_insurance_value:result_outgoing[s].getValue(Col[10]),
							 custitem_outgoing_line_number:result_outgoing[s].getValue(Col[11]),
							 custitem_outgoing_shipdate:result_outgoing[s].getValue(Col[13]),
							 custitem_outgoing_custcol_total_insurance_value:result_outgoing[s].getValue(Col[14]),
							 custitem_outgoing_internalid_chk:result_outgoing[s].getValue(Col[12]),
							 custitem_outgoing_box_chk: Check_Box_Value(result_outgoing[s].getValue(Col[14]))+''
							 });
			  
				  if(outgoing_array_duplicate.indexOf(custitem_outgoing_internalid)==-1)
				    {
						outgoing_array_duplicate.push(custitem_outgoing_internalid);
					}
					else
					{
					   outgoing_array[outgoing_array.length-1].custitem_outgoing_internalid_chk='';				
					}
				 }
			}
			if(result_incoming)
			{
			   var Col=result_incoming[0].getAllColumns();
			    var incoming_array_duplicate=new Array();
                           var array_colur=['White','Pink', 'Cyan','Green', 'Gray', 'Yellow' , 'Red', 'Orange', 'Blue' , 'Indigo' , 'Violet' ,'Purple', 'Magenta', , 'Brown' ];
			   for(var s=0;s<result_incoming.length;s++)
				{

				 if(Check_IncomingData(result_incoming[s].getValue(Col[12]),result_incoming[s].getValue(Col[11])))
				 {
                    var custitem_incoming_internalid=result_incoming[s].getValue(Col[12]);
				    var boxnumber_check=result_incoming[s].getValue(Col[15]);
					  if(!boxnumber_check)
					  {
						 boxnumber_check= Check_Box_Value(result_incoming[s].getValue(Col[14]))+''
					  }
                                         var color_name=array_colur[boxnumber_check];

                                        var style_colour='style=background-color:'+color_name+';text-align:center; color:black';
					incoming_array.push({
						 custitem_incoming_internalid:custitem_incoming_internalid,
						 custitem_incoming_box: "<input type=text name=incoming_box value="+boxnumber_check+" readonly  "+style_colour+">"    ,
						 custitem_incoming_tranid:"Order #"+ result_incoming[s].getValue(Col[1]),
						 custitem_incoming_transferlocation:result_incoming[s].getValue(Col[2]),
						 custitem_incoming_custcol_full_insurance_value:result_incoming[s].getValue(Col[10]),
						 custitem_incoming_item:result_incoming[s].getText(Col[4]),
						 custitem_incoming_memo:result_incoming[s].getValue(Col[5]),
						 custitem_incoming_memomain:result_incoming[s].getValue(Col[7]),
						 custitem_incoming_custcol_notes:result_incoming[s].getValue(Col[8]),
						 custitem_incoming_custcol16:result_incoming[s].getValue(Col[9]),							
						 custitem_incoming_line_number:result_incoming[s].getValue(Col[11]),
						 custitem_incoming_custcol_total_insurance_value:result_incoming[s].getValue(Col[14]),								 
						 custitem_incoming_internalid_chk:result_incoming[s].getValue(Col[12]),
                                                custitem_incoming_box_number:boxnumber_check

					 });
					
					if(incoming_array_duplicate.indexOf(custitem_incoming_internalid)==-1)
					{
						incoming_array_duplicate.push(custitem_incoming_internalid);
					}
					else
					{
					   incoming_array[incoming_array.length-1].custitem_incoming_internalid_chk='';
					}
				}
				}
			}
			   
		list_incoming.setLineItemValues(incoming_array);
		list_outgoing.setLineItemValues(outgoing_array);			 
			
	}
  response.writePage(form);
}

function Check_Push_Data()
{
       var columns=new Array();
	   columns.push(new nlobjSearchColumn('custrecord_transfer_order_receive'));
	   columns.push(new nlobjSearchColumn('custrecord_transfer_order_internal_id'));
	   columns.push(new nlobjSearchColumn('custrecord_internaldata'));
	   columns.push(new nlobjSearchColumn ( 'custrecord_delete_line_item') );
	   columns.push(new nlobjSearchColumn ( 'custrecord_update_box') );
       var save_searchdata=nlapiSearchRecord('customrecord_transfer_order_dashboard',null,null,columns);
	   if(save_searchdata!=null)
	   {
	      
	      for(var h=0;h<save_searchdata.length;h++)
		  {
		    if(save_searchdata[h].getValue('custrecord_delete_line_item')=='F' && save_searchdata[h].getValue('custrecord_update_box')=='F')
			{
				 if(save_searchdata[h].getValue('custrecord_transfer_order_receive')=='F')
				 {
				   outgoing_trans.push(save_searchdata[h].getValue('custrecord_transfer_order_internal_id'));
				 }
				 else
				 {
					var getdata=JSON.parse(save_searchdata[h].getValue('custrecord_internaldata'));
					for(var r=0;r<getdata.length;r++)
					 {
						incoming_trans.push({					
						internalid:save_searchdata[h].getValue('custrecord_transfer_order_internal_id'),
						lineid:getdata[r].lineid					
						});
					 }
				 }
			 }
			 
	      }
	   }
}
function Check_IncomingData(tran_id,line_id)
{
   if(incoming_trans!=null && incoming_trans.length>0)
   {
	   for(var aa=0;aa<incoming_trans.length;aa++)
	   {
		   
		   var c_internalid=incoming_trans[aa].internalid;
		   var c_line_id=incoming_trans[aa].lineid;
		   if(tran_id==c_internalid && line_id== c_line_id)
			{
			   return false;
			}
	   
	   }
   }
   return true;

}

function Check_Box_Value(insurance_value)
{
  if(insurance_value!=null && insurance_value!='')
   {
      insurance_value=parseFloat(insurance_value);
	  var value_chk=70000;
	  var i=1;
	  do{
	    
		if(insurance_value<=value_chk)
		{
		   return i;
		}
		else
		{
		   i=i+1;
		   value_chk=value_chk+50000;
		}	
	  
	  }while(true)
    
   }
    return 1;
}

/* Status Changed */

function Fulfill_Receive(request,response)
{
    var param = new Array();
	var col=new Array();
	col.push(new nlobjSearchColumn ( 'custrecord_transfer_order_internal_id') );
	col.push(new nlobjSearchColumn ( 'custrecord_internaldata') );
	col.push(new nlobjSearchColumn ( 'custrecord_transfer_order_receive') );
	col.push(new nlobjSearchColumn ( 'custrecord_delete_line_item') );
	col.push(new nlobjSearchColumn ( 'custrecord_update_box') );
	var record=nlapiSearchRecord('customrecord_transfer_order_dashboard',null,null,col);
	if(record!=null)
	{
	
	  for(var s=0;s<record.length;s++)
	   {
		  var passdata={
			child_internalid:record[s].getId(),
			internalid:record[s].getValue('custrecord_transfer_order_internal_id'),
			internaldata:record[s].getValue('custrecord_internaldata'),
			receive:record[s].getValue('custrecord_transfer_order_receive'),
			delete_record:record[s].getValue('custrecord_delete_line_item'),
			update_box:record[s].getValue('custrecord_update_box'),
		  }
		   if(Push_Data(passdata))
		   {
		      try{ nlapiDeleteRecord ( 'customrecord_transfer_order_dashboard' , passdata.child_internalid );} catch(er){} 		
		   }
		   if(s>4)
		    {
			   break;
			}
	   }
	}
	else
	{
		param['Save_Data'] = '1';   
	}
	param['custpage_location'] = request.getParameter("custpage_location");
	response.sendRedirect("SUITELET", "customscript_transfer_order_dashboard", "customdeploy_transfer_order_dashboard", false, param);	
		//response.sendRedirect("SUITELET", "customscript_transfer_order_dashboard_ne", "customdeploy_transfer_order_dashboard_v1", false, param);	

}

function Push_Data(passdata)
{
try{

var check_delete=passdata.delete_record;
var check_update=passdata.update_box;

if(check_delete=='T')
{
    try{
   	var line_data= JSON.parse(passdata.internaldata) ;		  
	var transfer_obj=nlapiLoadRecord ('transferorder',passdata.internalid);	
	 var count_obj=transfer_obj.getLineItemCount('item');
    for(var g=1;g<=count_obj;g++)
	{
	   var line_id=transfer_obj.getLineItemValue('item','line',g);
	   if(line_data.indexOf(line_id)!=-1)
	    {
	       transfer_obj.removeLineItem ( 'item' , g);
               count_obj=transfer_obj.getLineItemCount('item');
		    g=0;
		}
	}
	nlapiSubmitRecord ( transfer_obj , true , true );
	}
	catch(er){}
}

if(check_update=='T')
{
    
  	var line_data= JSON.parse(passdata.internaldata) ;
	if(line_data!=null)
	{
	   for(var g=0;g<line_data.length;g++)
	    {
		    nlapiSubmitField ( 'transferorder', line_data[g].internalid, 'custbody_to_box_num',line_data[g].box_number , true) ;
		
		}
	
	}
	
}


if(check_delete=='F' && check_update=='F' )
{
	var line_data= JSON.parse(passdata.internaldata) ;		  
	var transfer_obj=nlapiLoadRecord ('transferorder',passdata.internalid);	
	var line_id_value=new Array();		  
	if(line_data!=null)
	{

	transfer_obj.setFieldValue('custbody_to_box_num',line_data[0].custbody_to_box_num);
	 var count_obj=transfer_obj.getLineItemCount('item');
	 for(var d=1;d<=count_obj;d++)
	 {
		 var line_obj=transfer_obj.getLineItemValue ( 'item' , 'line' , d );
		 for(var t=0;t<line_data.length;t++)
		 {
			
			var line_no=line_data[t].lineid;
			if(line_obj==line_no)
			 {
			   line_id_value.push(line_no);  
			   transfer_obj.setLineItemValue ( 'item' , 'custcol_notes' , d, line_data[t].note);
			 }
			
		 }
	 }

	} 
	var idtransferorder=nlapiSubmitRecord ( transfer_obj , true , true );
	var value_Item=passdata.receive;
	if(value_Item=='F')		
	Item_Fulfillment(idtransferorder,line_id_value);
	else
	Item_Receive(idtransferorder,line_id_value);	  

} 

}
catch(er){
}
return true;
}

function Item_Receive(idtransferorder,line_id_value)
{

     try{
	   var itemreceipt = nlapiTransformRecord("transferorder",idtransferorder,"itemreceipt");
	  for(var j=1;j<=itemreceipt;j++)
		{
			var line_value=itemreceipt.getLineItemValue ( 'item' , 'line' , j );
			itemreceipt.setLineItemValue ( 'item' , 'itemreceive' , j,'F');
			for(var q=0;q<line_id_value.length;q++)
			{
				var line_obj=transfer_obj.getLineItemValue ( 'item' , 'line' , d );
				if(line_value==line_obj)
				{ 
					itemreceipt.setLineItemValue ( 'item' , 'itemreceive' , j,'T');
					break;
				}
				
			}
		   
		}
	   nlapiSubmitRecord(itemreceipt ,true,true);	
   }
   catch(er){
nlapiLogExecution ( 'debug', 'error', er.message);
 }
}

function Item_Fulfillment(idtransferorder,line_id_value)
{
   try{
	   var itemfulfillment = nlapiTransformRecord("transferorder",idtransferorder,"itemfulfillment");
	   itemfulfillment.setFieldValue('shipstatus','C');
	   nlapiSubmitRecord(itemfulfillment ,true,true);	
   }
   catch(er){nlapiLogExecution ( 'debug', 'error', er.message);}
   Item_Full_Fulfillment(idtransferorder);
}

function Item_Full_Fulfillment(idtransferorder)
{
    try{	
		var filter=new Array();
		filter.push(new nlobjSearchFilter('createdfrom',null,'anyOf',idtransferorder));
		filter.push(new nlobjSearchFilter('createdfrom',null,'noneof','ItemShip:C'));
		filter.push(new nlobjSearchFilter('mainline',null,'is','T'))
		var searchitemfulfill=nlapiSearchRecord('itemfulfillment',null,filter)
		if(searchitemfulfill!=null)
		{
		   var itemfulfillment=nlapiLoadRecord('itemfulfillment',searchitemfulfill[0].getId());
		   itemfulfillment.setFieldValue('shipstatus','C');
		   nlapiSubmitRecord(itemfulfillment ,true,true);	
		}
	}
	catch(er){nlapiLogExecution ( 'debug', 'error', er.message);}

}