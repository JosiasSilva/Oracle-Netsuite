nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
	@UserEvent Script URL	:-	/app/common/scripting/script.nl?id=1597
	@Suitelet Script URL	:-	/app/common/scripting/script.nl?id=1599
	@Scheduled Script URL	:-	/app/common/scripting/script.nl?id=1602
	@UserEvent Script URL	:-	/app/common/scripting/script.nl?id=1842
	@Suitelet Script URL	:-	/app/common/scripting/script.nl?id=1839
	@Scheduled Script URL	:-	/app/common/scripting/script.nl?id=1840
*/
function Update_Matrix(type,form)
{	
	try
	{
		if(type == 'view')
		{
			var obj = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
			var type = obj.getFieldValue('matrixtype');
			if(type == 'PARENT')
			{
				var url = nlapiResolveURL("SUITELET","customscript_bulk_update_matrix","customdeploy_bulk_update_matrix");
				form.addButton("custpage_update_matrix_file","Update Matrix File","window.open('" + url + "','update_matrix_file','width=450,height=350');");
			}
		}
		
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Update Matrix File Button","Details: " + err.message);
	}
	nlapiLogExecution('debug','Test',type)
}