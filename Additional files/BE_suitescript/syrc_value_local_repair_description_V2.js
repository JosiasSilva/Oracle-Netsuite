nlapiLogExecution("audit","FLOStart",new Date().getTime());
function saved_record()
{
    var item1 = nlapiGetFieldValue("custrecord_item");
    var parentName1 = ""; var parentName2 = ""; var parentName3 = "";
    var item2 = nlapiGetFieldValue("custrecord_item_2");

	var type_of_qa2 = nlapiGetFieldValue("custrecord_type_qa_item_2");
	var desc_of_qa_problem2 = nlapiGetFieldValue("custrecord_description_qa_problem_2");
    var item3 = nlapiGetFieldValue("custrecord_item_3");
	var type_of_qa3 = nlapiGetFieldValue("custrecord_type_qa_3");
	var desc_of_qa_problem3 = nlapiGetFieldValue("custrecord_description_qa_problem_3");
	var quantity_to_be_returned2 = nlapiGetFieldValue("custrecord_quantity_returned2");// Added By Vinay Soni 27 jan 2018 for NS- 1058
	var quantity_to_be_returned3 = nlapiGetFieldValue("custrecord_quantity_returned3");// Added By Vinay Soni 27 jan 2018 for NS- 1058
	
    if(item1 != null && item1 != "")
    {
         parentName1 = nlapiLookupField("inventoryitem",item1,"parent",true);
    }
	if(item2 != null && item2 != "")
	{
        parentName2 = nlapiLookupField("inventoryitem",item2,"parent",true);
		if(type_of_qa2 == null || type_of_qa2 == "")
		{
			alert("Please select option in type of qa for item#2 field.");
			return false;
		}
		if(desc_of_qa_problem2 == null || desc_of_qa_problem2 == "")
		{
			alert("Please select atleast one option in description_of_QA_problem #2 field.");
			return false;
		}
		
		/******Added By Vinay Soni 15 Feb 2018 for NS- 1058*******/
		if(quantity_to_be_returned2 == null || quantity_to_be_returned2 == "")
		{
			alert("Please select Quantity To Be Returned2 field");
			return false;
		}
		/*****End By Vinay Soni***********/
		
		
	}
	if(item3 != null && item3 != "")
	{
        parentName3 = nlapiLookupField("inventoryitem",item3,"parent",true);
		if(type_of_qa3 == null || type_of_qa3 == "")
		{
			alert("Please select any option in type of 	qa for item#3 field.");
			return false;
		}
		if(desc_of_qa_problem3 == null || desc_of_qa_problem3 == "")
		{
			alert("Please select atleast one option in description_of_QA_problem #3 field.");
			return false;
		}
		
		/******Added By Vinay Soni 15 Feb 2018 for NS- 1058*******/
		if(quantity_to_be_returned3 == null || quantity_to_be_returned3 == "")
		{
			alert("Please select Quantity To Be Returned3 field");
			return false;
		}
		/*****End By Vinay Soni***********/
	
	}

    if(parentName1 != null && parentName1 != "")
	{
			parentName1 = parentName1.split(':')[0];
			nlapiSetFieldValue('custrecord_item',item1);
            nlapiSetFieldValue('custrecordparent_sku',parentName1);
	}
    if(parentName2 != null && parentName2 != "")
	{
			parentName2 = parentName2.split(':')[0];
			nlapiSetFieldValue('custrecord_item_2',item2);
            nlapiSetFieldValue('custrecord_parent_sku_2',parentName2);
	}
    if(parentName3 != null && parentName3 != "")
	{
			parentName3 = parentName3.split(':')[0];
			nlapiSetFieldValue('custrecord_item_3',item3);
            nlapiSetFieldValue('custrecord_parent_sku_3',parentName3);
	}
    return true;
}

function syrc_value(type,name){
	if(name == 'custrecord1'){
		var description_of_QA_problem = nlapiGetFieldText("custrecord1");//Description of QA problem
		nlapiSetFieldValue('custrecord49',description_of_QA_problem);
	}

    //Added by Ajay 27Oct 2016
    if (name == 'custpage_items')
	{
		var itemStr = nlapiGetFieldValues("custpage_items");
        nlapiSetFieldValues('custrecord_selected_items',itemStr);
        nlapiLogExecution("debug","Item values are :",itemStr);
        nlapiLogExecution("debug","Item values lengths are :",itemStr.length);

		for(var x=0; x < itemStr.length; x++)
		{
            var parentName = nlapiLookupField("inventoryitem",itemStr[x],"parent",true);
            if(parentName != null && parentName != "")
            {
                parentName = parentName.split(':')[0];
            }
            if(x==0)
            {
                nlapiSetFieldValue('custrecord_item',itemStr[x]);
                nlapiSetFieldValue('custrecordparent_sku',parentName);
            }
            else if(x==1)
            {
                nlapiSetFieldValue('custrecord_item_2',itemStr[x]);
                nlapiSetFieldValue('custrecord_parent_sku_2',parentName);
            }
            else if(x==2)
            {
                nlapiSetFieldValue('custrecord_item_3',itemStr[x]);
                nlapiSetFieldValue('custrecord_parent_sku_3',parentName);
            }
		}
	}
    return true;
    //Ended by ajay
}
