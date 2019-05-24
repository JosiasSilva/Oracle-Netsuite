function diamond_update_popup(request,response)
{
	try
	{
		if(request.getMethod()=="GET")
		{
			var form = nlapiCreateForm('Update Diamond Line Items');
			var fld  = form.addField('custpage_certificate','select', 'Certificate').setDisplaySize(80,20);
			fld.addSelectOption('','');
			fld.addSelectOption('1','Yes');
			fld.addSelectOption('2','No');
			fld.setLayoutType('outsidebelow', 'startcol')
			var fld2  = form.addField('custpage_inscription','select', 'Inscription').setDisplaySize(80,20);
			fld2.addSelectOption('','');
			fld2.addSelectOption('T','Yes');
			fld2.addSelectOption('F','No')
			fld2.setLayoutType('outsidebelow', 'startcol')
			var fld3  = form.addField('custpage_ltm','select', 'LTM').setDisplaySize(80,20);
			fld3.addSelectOption('','');
			fld3.addSelectOption('T','Yes');
			fld3.addSelectOption('F','No')
			fld3.setLayoutType('outsidebelow', 'startcol')
			var get_po_id=request.getParameter('po_id');
			var fld4 = form.addField('custpage_id','text','Id').setDisplayType('hidden').setDefaultValue(request.getParameter('po_id'));
		   form.addSubmitButton('Update');
		   response.writePage(form);
		}
		else
		{
			var form = nlapiCreateForm('Update Diamond Line Items')
			var po_id=request.getParameter('custpage_id');
			var certificate =  request.getParameter('custpage_certificate');
			var inscription = request.getParameter('custpage_inscription');
			var LTM = request.getParameter('custpage_ltm');
			var po_obj  = nlapiLoadRecord('purchaseorder', po_id);
			var line_count = po_obj.getLineItemCount('item');	  
			for(var i = 1 ; i<= line_count ; i++)
			{
				var get_item_id = po_obj.getLineItemValue('item','item',i);
				nlapiSubmitField('inventoryitem',get_item_id,'custitem_long_term_memo',LTM);
				nlapiSubmitField('inventoryitem',get_item_id,'custitemcertificate_included',certificate);
				po_obj.setLineItemValue('item', 'custcol28', i, certificate);
				po_obj.setLineItemValue('item','custcoldiamondinscription',i,inscription);
				po_obj.setLineItemValue('item','custcol_ltm_diamond',i,LTM);
			}
			nlapiSubmitRecord(po_obj,false,true);		
			
			response.writePage(form);
			form.setScript('customscript2540');
		}
	}
	catch(error)
	{
		nlapiLogExecution('error','error occuring during execution',error);
	}
	
}

