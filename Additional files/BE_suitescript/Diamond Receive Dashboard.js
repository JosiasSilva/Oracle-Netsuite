var sales_order=new Array();
var Item_Id=new Array();
function Diamond_Receive_Dashboard(request, response) {
	if (request.getMethod() == "GET") 
	{

	   var lines = [];
	    var form = nlapiCreateForm("Diamond Receive Dashboard");
		form.setScript("customscript_diamond_box_client");
		var form_vendor_fld = form.addField("custpage_search_vendor", "select", "Vendor");
		form.addField("custpage_form_date", "date", "Date").setDefaultValue(request.getParameter("custpage_form_date"));
		var custpage_vendor_data=request.getParameter("custpage_vendor_data");
		var form_custpage_vendor_data=form.addField('custpage_vendor_data', 'richText', "custpage_uom").setDisplayType('hidden');
		if(custpage_vendor_data!=null)
		{
     		form_custpage_vendor_data.setDefaultValue(custpage_vendor_data);
			vendors = JSON.parse(custpage_vendor_data);
			for (var x = 0; x < vendors.length; x++) {
			form_vendor_fld.addSelectOption(vendors[x].id, vendors[x].name, false);
		   }
		   form_vendor_fld.setDefaultValue(request.getParameter("custpage_search_vendor"));
		}
		var list = form.addSubList("custpage_list", "list", "Line Items");
		list.addField("custpage_recive_check", "checkbox", "Receive");
		list.addField("custpage_linkto_po", "text", "PO #");
		list.addField("custpage_cdp_request_type", "select", "CDP Request type", 'customlist224').setDisplayType("inline");
		list.addField("custpage_vendor", "select", "Vendor", 'vendor').setDisplayType("inline");
		list.addField("custpage_received_count", "text", "Received Count");
		list.addField("custpage_be_stock", "text", "BE stock #");
		list.addField("custpage_vendor_stock", "text", "Vendor Stock #");
		list.addField("custpage_customer", "text", "customer");
		list.addField("custpage_createdfrom", "text", "REF");
		list.addField("custpage_cdpid", "text", "CDP");
		list.addField("custpage_description", "text", "Description");
		list.addField("custpage_production_vendor", "text", "Production Vendor");
		list.addField("custpage_production_vendor_po", "text", "Production Vendor PO");
		list.addField("custpage_certificate_included", "select", "Certificate Included", 'customlist17').setDisplayType("entry");
		list.addField("custpage_diamond_inscription", "checkbox", "Diamond Inscription").setDisplayType("entry");
		list.addField("custpage_important_notes", "textarea", "Important Notes").setDisplayType("entry");
		list.addField("custpage_date_needed_in_sf", "date", "Date Needed in SF").setDisplayType("entry");
		list.addField("custpage_req_location", "text", "Request Location");
		list.addField("custpage_inventory_location", "select", "Inventory Location", 'location').setDisplayType("entry");
		list.addField("custpage_diamond_status", "select", "Diamond Status", 'customlist_diamond_status').setDisplayType("entry");
		list.addField("custpage_certificate_no", "text", "Certificate Number");
		list.addField("custpage_changed", "checkbox", "Changed?");
		list.addField("custpage_diamond_id", "select", "Custom Diamond", "customrecord_custom_diamond").setDisplayType("hidden");
		list.addField("custpage_recivebutton", "text", "Receive").setDisplayType("hidden");
		list.addField("custpage_diamond_inscription_old", "checkbox", "Diamond Inscription").setDisplayType("hidden");
		list.addField("custpage_important_notes_old", "textarea", "Important Notes").setDisplayType("hidden");
		list.addField("custpage_certificate_included_old", "select", "Certificate Included", 'customlist17').setDisplayType("hidden");
		list.addField("custpage_date_needed_in_sf_old", "date", "Date Needed in SF").setDisplayType("hidden");
		list.addField("ccustpage_inventory_location_old", "select", "Inventory Location", 'location').setDisplayType("hidden");
		list.addField("custpage_diamond_status_old", "select", "Diamond Status", 'customlist_diamond_status').setDisplayType("hidden");
		list.addField("custpage_po_line", "text", "PO Line #").setDisplayType("hidden");
		list.addField("custpage_po_id", "select", "Purchase Order", "purchaseorder").setDisplayType("hidden");
		form.addSubmitButton("Update/Search");
		form.addButton("custpage_item_recive", " Receive", 'Receive()');
	    var result=Fatch_Data(request);	
	   var Received_Count=null;
	   var PRODUCTION_VENDOR=null;
	   var cdp_so=null;
	  if(Item_Id!=null && Item_Id.length>0)
	  {
	    Received_Count = AllCountItem();
	  }
	  if(sales_order!=null && sales_order.length>0)
	   {
	     PRODUCTION_VENDOR = AllSalesOrder();
		 cdp_so = SalesOrder_CDP();
	   }	  
	  if(result!=null)
	  {
	  	var vendors = [];
		vendors.push({
			id : '',
			name : ''
		});

		for(var q=0;q<result.length;q++)
		{

		    var Sales_order_data=[];
			if (result[q].po_ref!= null && result[q].po_ref != '') {
                        if(cdp_so!=null)
						{
							for(var z=0;z<cdp_so.length;z++)
							 {
								var id = cdp_so[z].internalid;
								if (id == result[q].po_ref) {
								 Sales_order_data=cdp_so[z];
								 break;
								}
							 }
						 }
					}
					var Chk_earning = false;
					var Check_earning_diamound = 0;
					var Check_earning_earrings = 0;
					var cat_one = Sales_order_data.custbody_category1;
					var cat_two = Sales_order_data.custbody_category2;
					var cat_three = Sales_order_data.custbody_category3;
					var cat_four = Sales_order_data.custbody_category4;
					var cat_five = Sales_order_data.custbody_category5;
					var cat_six = Sales_order_data.custbody_category6;
					if (cat_one == 'Loose Diamond') {
						Check_earning_diamound = Check_earning_diamound + 1;
					} else if (cat_one == 'Earrings') {
						Check_earning_earrings = Check_earning_earrings + 1;
					}
					if (cat_two == 'Loose Diamond') {
						Check_earning_diamound = Check_earning_diamound + 1;
					} else if (cat_two == 'Earrings') {
						Check_earning_earrings = Check_earning_earrings + 1;
					}
					if (cat_three == 'Loose Diamond') {
						Check_earning_diamound = Check_earning_diamound + 1;
					} else if (cat_three == 'Earrings') {
						Check_earning_earrings = Check_earning_earrings + 1;
					}
					if (cat_four == 'Loose Diamond') {
						Check_earning_diamound = Check_earning_diamound + 1;
					} else if (cat_four == 'Earrings') {
						Check_earning_earrings = Check_earning_earrings + 1;
					}
					if (cat_five == 'Loose Diamond') {
						Check_earning_diamound = Check_earning_diamound + 1;
					} else if (cat_five == 'Earrings') {
						Check_earning_earrings = Check_earning_earrings + 1;
					}
					if (cat_six == 'Loose Diamond') {
						Check_earning_diamound = Check_earning_diamound + 1;
					} else if (cat_six == 'Earrings') {
						Check_earning_earrings = Check_earning_earrings + 1;
					}
					if (Check_earning_earrings >= 1 && Check_earning_diamound >= 2) {
						Chk_earning = true;
					} 
                    var PRODUCTION_VENDOR_details = new Array()
					if (Sales_order_data.status != 'Cancelled') {
							PRODUCTION_VENDOR_details = Find_PRODUCTION_VENDOR(PRODUCTION_VENDOR, result[q].po_ref);
						} 
						else 
						{
							PRODUCTION_VENDOR_details.push('');
							PRODUCTION_VENDOR_details.push('');
						}
					var SalesorderLink = '';
					var SalesOrderText = result[q].po_ref_text;
					if (SalesOrderText.indexOf('Sales Order #') != -1 || SalesOrderText.indexOf('Work Order #') != -1) {
						if (SalesOrderText.indexOf('Sales Order #') != -1) {
							SalesOrderText = SalesOrderText.replace('Sales Order #', '');
							if (Chk_earning) {
								SalesorderLink = "<div style='background:yellow; padding:10px;'><a style='color:#ff0000' title='Click here to link SO' href='/app/accounting/transactions/transaction.nl?id=" + result[q].po_ref + "'>" + SalesOrderText + "</a></div>"
							} else {
								SalesorderLink = "<a title='Click here to link SO' href='/app/accounting/transactions/transaction.nl?id=" + result[q].po_ref + "'>" + SalesOrderText + "</a>"

							}
						} else {
							SalesOrderText = SalesOrderText.replace('Work Order #', '');
							SalesorderLink = "<a  title='Click here to link WO' href='/app/accounting/transactions/workord.nl?id=" + result[q].po_ref + "'>WO #" + SalesOrderText + "</a>"

						}

					}
					
				
					lines.push({
						custpage_diamond_id : result[q].cdp_id,
						custpage_po_id : result[q].cdp_po_number,
						custpage_recivebutton : "<a title='Click here to receive' href='/app/site/hosting/scriptlet.nl?script=942&deploy=1&Purchase_ID=" + result[q].cdp_po_number + "'>" + 'Receive' + "</a>",
						custpage_linkto_po : "<a  title='Click here to link PO' href='/app/accounting/transactions/purchord.nl?id=" + result[q].cdp_po_number + "'>" + (result[q].cdp_po_number_text).replace('Purchase Order #', '') + "</a>",
						custpage_cdp_request_type : result[q].cdp_request_type,
						custpage_vendor : result[q].cdp_vendor,
						custpage_received_count : Received_Count_Function(Received_Count, result[q].cdp_stock_number),
						custpage_be_stock : "<a  title='Click here to link Item' href='/app/common/item/item.nl?id=" + result[q].cdp_stock_number + "'>" + result[q].cdp_stock_number_text + "</a>",
						custpage_vendor_stock : result[q].item_vendor,
						custpage_createdfrom : SalesorderLink,
						custpage_description : result[q].item_salesdescription,
						custpage_production_vendor : PRODUCTION_VENDOR_details[0],
						custpage_production_vendor_po : PRODUCTION_VENDOR_details[1],
						custpage_certificate_included : result[q].po_certificate_included,
						custpage_certificate_included_old : result[q].po_certificate_included,
						custpage_diamond_inscription : result[q].po_diamond_inscription,
						custpage_diamond_inscription_old : result[q].po_diamond_inscription,
						custpage_important_notes : result[q].po_important_notes,
						custpage_important_notes_old : result[q].po_important_notes,
						custpage_date_needed_in_sf : result[q].po_date_needed_in_sf,
						custpage_date_needed_in_sf_old : result[q].po_date_needed_in_sf,
						custpage_inventory_location : result[q].po_inventory_location,
						custpage_inventory_location_old : result[q].cdp_diamond_status,
						custpage_req_location : result[q].cdp_location_text,
						custpage_diamond_status : result[q].cdp_diamond_status,
						custpage_diamond_status_old : result[q].cdp_diamond_status,
						custpage_po_line : result[q].po_lineid,
						custpage_cdpid : result[q].cdp_id==null?'':("<a  title='Click here to link CDP' href='/app/common/custom/custrecordentry.nl?rectype=231&id=" + result[q].cdp_id + "'>" + result[q].cdp_id + "</a>"),
						custpage_customer : Sales_order_data.name,
						custpage_request_type : result[q].cdp_request_type,
						custpage_certificate_no : result[q].po_certificate_no
					});
					var vendor_id=result[q].cdp_vendor;
					var vendor_name=result[q].cdp_vendor_text;
					if(vendor_id!=null && vendor_name!=null && vendor_id!='' && vendor_name!='' )
					{
						vendors.push({
						id : result[q].cdp_vendor,
						name : result[q].cdp_vendor_text
						
						});
				    }	
		     
		    }
			
		 list.setLineItemValues(lines);
		 var custpage_vendor_data=request.getParameter("custpage_vendor_data");
		  if(custpage_vendor_data==null && vendors!=null && vendors.length>0)
		  { 
		     vendors=removeDuplicates(vendors,'id');
		     for (var x = 0; x < vendors.length; x++) {
			form_vendor_fld.addSelectOption(vendors[x].id, vendors[x].name, false);
		   }
		   custpage_vendor_data = JSON.stringify(vendors);
		   form_custpage_vendor_data.setDefaultValue(custpage_vendor_data);
          }	
	  
	   
	  
	  }
	  	response.writePage(form);
	}
	else {
		try {
			for (var x = 0; x < request.getLineItemCount("custpage_list"); x++) {
				if (request.getLineItemValue("custpage_list", "custpage_changed", x + 1) == "T") {

					if (request.getLineItemValue("custpage_list", "custpage_diamond_status", x + 1) != request.getLineItemValue("custpage_list", "custpage_diamond_status_old", x + 1)) {
						nlapiSubmitField('customrecord_custom_diamond', request.getLineItemValue("custpage_list", "custpage_diamond_id", x + 1), 'custrecord_diamond_status', request.getLineItemValue("custpage_list", "custpage_diamond_status", x + 1));
					}
					if (request.getLineItemValue("custpage_list", "custpage_diamond_inscription", x + 1) != request.getLineItemValue("custpage_list", "custpage_diamond_inscription_old", x + 1) ||
						request.getLineItemValue("custpage_list", "custpage_certificate_included", x + 1) != request.getLineItemValue("custpage_list", "custpage_certificate_included_old", x + 1) ||
						request.getLineItemValue("custpage_list", "custpage_inventory_location", x + 1) != request.getLineItemValue("custpage_list", "custpage_inventory_location_old", x + 1)) {

						var Po_Data = nlapiLoadRecord('purchaseorder', request.getLineItemValue("custpage_list", "custpage_po_id", x + 1));
						Po_Data.setLineItemValue("item", "custcoldiamondinscription", request.getLineItemValue("custpage_list", "custpage_po_line", x + 1), request.getLineItemValue("custpage_list", "custpage_diamond_inscription", x + 1));
						Po_Data.setLineItemValue("item", "location", request.getLineItemValue("custpage_list", "custpage_po_line", x + 1), request.getLineItemValue("custpage_list", "custpage_inventory_location", x + 1));

						Po_Data.setLineItemValue("item", "custcol28", request.getLineItemValue("custpage_list", "custpage_po_line", x + 1), request.getLineItemValue("custpage_list", "custpage_certificate_included", x + 1));
						if (request.getLineItemValue("custpage_list", "custpage_important_notes", x + 1) != request.getLineItemValue("custpage_list", "custpage_important_notes_old", x + 1) ||
							request.getLineItemValue("custpage_list", "custpage_date_needed_in_sf", x + 1) != request.getLineItemValue("custpage_list", "custpage_date_needed_in_sf_old", x + 1)) {
							Po_Data.setFieldValue('custbody58', request.getLineItemValue("custpage_list", "custpage_important_notes", x + 1));
							Po_Data.setFieldValue('custbody59', request.getLineItemValue("custpage_list", "custpage_date_needed_in_sf", x + 1));

						}

						nlapiSubmitRecord(Po_Data, true, true);

					} else if (request.getLineItemValue("custpage_list", "custpage_important_notes", x + 1) != request.getLineItemValue("custpage_list", "custpage_important_notes_old", x + 1) ||
						request.getLineItemValue("custpage_list", "custpage_date_needed_in_sf", x + 1) != request.getLineItemValue("custpage_list", "custpage_date_needed_in_sf_old", x + 1)) {

						nlapiSubmitField('purchaseorder', request.getLineItemValue("custpage_list", "custpage_po_id", x + 1), ['custbody58', 'custbody59'], [request.getLineItemValue("custpage_list", "custpage_important_notes", x + 1), request.getLineItemValue("custpage_list", "custpage_date_needed_in_sf", x + 1)]);
					}

				}
			}
		} catch (err) {
			nlapiLogExecution("error", "Error Updating Date Sent from SF", "Details: " + err.message);
		}

		var param = new Array();
		param['custpage_search_vendor'] = request.getParameter("custpage_search_vendor");
		param['custpage_form_date'] = request.getParameter("custpage_form_date");
		param['custpage_to_date'] = request.getParameter("custpage_to_date");
		param['custpage_vendor_data'] = request.getParameter("custpage_vendor_data");
		param['custpage_length'] = request.getParameter("custpage_length");
		response.sendRedirect("SUITELET", "customscript_diamond_receive_dashboard", "customdeploy_diamond_receive_dashboard", false, param);
	}
}

function Fatch_Data(request)
{
var result=[];
var custpage_search_vendor = request.getParameter("custpage_search_vendor");
var custpage_vendor_data = request.getParameter("custpage_vendor_data");
var custpage_form_date = request.getParameter("custpage_form_date");
var search_1=new Array();
var search_2=new Array();
if (custpage_search_vendor != null && custpage_search_vendor != '' && custpage_search_vendor != "0") {
search_1.push(new nlobjSearchFilter('custrecord_custom_diamond_vendor', null, 'anyOf', custpage_search_vendor));
search_2.push(new nlobjSearchFilter('internalid', 'vendor', 'anyOf', custpage_search_vendor));
}
if (custpage_form_date != null && custpage_form_date != '') {
search_1.push(new nlobjSearchFilter("custbody59", "CUSTRECORD_DIAMOND_PO_NUMBER", "on", custpage_form_date, null));
search_2.push(new nlobjSearchFilter("custbody59", null, "on", custpage_form_date, null));
}
         var search_po=new Array();
       var results_1=nlapiSearchRecord(null,'customsearch_custom_diamond_suitelet_2',search_1);
		if(results_1!=null && results_1.length>0)
		{
		    var results_1_Columns=results_1[0].getAllColumns();
			var result_one=[];
			var result_two=[];
    		for(var j=0;j<results_1.length;j++)
             {
			   var request_type=results_1[j].getValue(results_1_Columns[0]);
			   var diamound_status=results_1[j].getValue(results_1_Columns[4]);
			   search_po.push(results_1[j].getValue(results_1_Columns[2]));
			    var So_ref=results_1[j].getValue(results_1_Columns[8]);
				var So_ref_text=results_1[j].getText(results_1_Columns[8]);
				var Item=results_1[j].getValue(results_1_Columns[5]);
				if(So_ref!=null && So_ref!='' && So_ref_text.indexOf('Sales Order #') != -1 )
				{
				  sales_order.push(So_ref);
				}
				if(Item!=null && Item!='')
				{
				 Item_Id.push(Item);
				}			   
			    if(request_type=='1' && diamound_status=='1')
			    {
			    result_one.push({				   
				      cdp_id: results_1[j].getId(),
				      cdp_request_type :results_1[j].getValue(results_1_Columns[0]),
                      cdp_vendor:results_1[j].getValue(results_1_Columns[1]),
					  cdp_vendor_text:results_1[j].getText(results_1_Columns[1]),
					  cdp_po_number:results_1[j].getValue(results_1_Columns[2]),
					  cdp_po_number_text:results_1[j].getText(results_1_Columns[2]),
					  cdp_location:results_1[j].getValue(results_1_Columns[3]),
					  cdp_location_text:results_1[j].getText(results_1_Columns[3]),
					  cdp_diamond_status:results_1[j].getValue(results_1_Columns[4]),
					  cdp_stock_number:results_1[j].getValue(results_1_Columns[5]),
					  cdp_stock_number_text:results_1[j].getText(results_1_Columns[5]),
					  item_vendor:results_1[j].getValue(results_1_Columns[6]),
					  item_salesdescription:results_1[j].getValue(results_1_Columns[7]),
					  po_ref:results_1[j].getValue(results_1_Columns[8]),
					  po_ref_text:results_1[j].getText(results_1_Columns[8]),
					  po_certificate_included:results_1[j].getValue(results_1_Columns[9]),
					  po_diamond_inscription:results_1[j].getValue(results_1_Columns[10]),
					  po_important_notes:results_1[j].getValue(results_1_Columns[11]),
					  po_date_needed_in_sf:results_1[j].getValue(results_1_Columns[12]),
					  po_inventory_location:results_1[j].getValue(results_1_Columns[13]),
					  po_lineid:results_1[j].getValue(results_1_Columns[14]),
					  po_certificate_no:results_1[j].getValue(results_1_Columns[15])					  
				
				});
				}
				else
				{
				
				   	result_two.push({				   
				      cdp_id: results_1[j].getId(),
				      cdp_request_type :results_1[j].getValue(results_1_Columns[0]),
                      cdp_vendor:results_1[j].getValue(results_1_Columns[1]),
					  cdp_vendor_text:results_1[j].getText(results_1_Columns[1]),
					  cdp_po_number:results_1[j].getValue(results_1_Columns[2]),
					  cdp_po_number_text:results_1[j].getText(results_1_Columns[2]),
					  cdp_location:results_1[j].getValue(results_1_Columns[3]),
					  cdp_location_text:results_1[j].getText(results_1_Columns[3]),
					  cdp_diamond_status:results_1[j].getValue(results_1_Columns[4]),
					  cdp_stock_number:results_1[j].getValue(results_1_Columns[5]),
					  cdp_stock_number_text:results_1[j].getText(results_1_Columns[5]),
					  item_vendor:results_1[j].getValue(results_1_Columns[6]),
					  item_salesdescription:results_1[j].getValue(results_1_Columns[7]),
					  po_ref:results_1[j].getValue(results_1_Columns[8]),
					  po_ref_text:results_1[j].getText(results_1_Columns[8]),
					  po_certificate_included:results_1[j].getValue(results_1_Columns[9]),
					  po_diamond_inscription:results_1[j].getValue(results_1_Columns[10]),
					  po_important_notes:results_1[j].getValue(results_1_Columns[11]),
					  po_date_needed_in_sf:results_1[j].getValue(results_1_Columns[12]),
					  po_inventory_location:results_1[j].getValue(results_1_Columns[13]),
					  po_lineid:results_1[j].getValue(results_1_Columns[14]),
                      po_certificate_no:results_1[j].getValue(results_1_Columns[15])					  
				
				});
				
				}
			 
			 }			
		    result = result_two.concat(result_one);
			result=removeDuplicates(result,'cdp_po_number');		  
			search_2.push(new nlobjSearchFilter("internalid", null, "noneOf", search_po, null));		  
		}
var result_2=nlapiSearchRecord(null, 'customsearch_custom_diamond_suitelet_3',search_2);
if(result_2!=null && result_2.length>0)
{
var results_2_Columns=result_2[0].getAllColumns();	
for(var s=0;s<result_2.length;s++)
{
             result.push({				   
				      cdp_id: null,
				      cdp_request_type :result_2[s].getValue(results_2_Columns[0]),
                      cdp_vendor:result_2[s].getValue(results_2_Columns[16]),
					  cdp_vendor_text:result_2[s].getValue(results_2_Columns[1]),
					  cdp_po_number:result_2[s].getId(),
					  cdp_po_number_text:result_2[s].getValue(results_2_Columns[2]),
					  cdp_location:result_2[s].getValue(results_2_Columns[3]),
					  cdp_location_text:result_2[s].getValue(results_2_Columns[3]),
					  cdp_diamond_status:result_2[s].getValue(results_2_Columns[4]),
					  cdp_stock_number:result_2[s].getValue(results_2_Columns[5]),
					  cdp_stock_number_text:result_2[s].getText(results_2_Columns[5]),
					  item_vendor:result_2[s].getValue(results_2_Columns[6]),
					  item_salesdescription:result_2[s].getValue(results_2_Columns[7]),
					  po_ref:result_2[s].getValue(results_2_Columns[8]),
					  po_ref_text:result_2[s].getText(results_2_Columns[8]),
					  po_certificate_included:result_2[s].getValue(results_2_Columns[9]),
					  po_diamond_inscription:result_2[s].getValue(results_2_Columns[10]),
					  po_important_notes:result_2[s].getValue(results_2_Columns[11]),
					  po_date_needed_in_sf:result_2[s].getValue(results_2_Columns[12]),
					  po_inventory_location:result_2[s].getValue(results_2_Columns[13]),
					  po_lineid:result_2[s].getValue(results_2_Columns[14]),
                      po_certificate_no:result_2[s].getValue(results_2_Columns[15])
				
				});

        var So_ref=result_2[s].getValue(results_2_Columns[8]);
		var So_ref_text=result_2[s].getText(results_2_Columns[8]);
		var Item=result_2[s].getValue(results_2_Columns[5]);
		if(So_ref!=null && So_ref!='' && So_ref_text.indexOf('Sales Order #') != -1)
		{
		  sales_order.push(So_ref);
		}
		if(Item!=null && Item!='')
		{
		 Item_Id.push(Item);
		}
	}

}
sales_order=remove_duplicates_safe(sales_order);
Item_Id=remove_duplicates_safe(Item_Id);
//result=removeDuplicates(result,'cdp_po_number');	
result.sort(function (a, b)
 {
	return parseFloat(b.cdp_po_number) - parseFloat(a.cdp_po_number);
 });
return result;
}

function AllCountItem() {
	var All_Item_Count = [];
		var column = new Array();
		var filter = new Array();
		filter.push(new nlobjSearchFilter('item', null, 'anyOf', Item_Id));
		filter.push(new nlobjSearchFilter('custitem20', 'item', 'is', 7));
		column.push(new nlobjSearchColumn('item'));
		var result_s = nlapiSearchRecord('itemreceipt', null, filter, column);
		if (result_s != null && result_s.length > 0) {
			for (var z = 0; z < result_s.length; z++) {

				All_Item_Count.push({
					InternalId : result_s[z].getId(),
					Item : result_s[z].getValue('item')
				});
			}
			All_Item_Count = removeDuplicates(All_Item_Count, 'InternalId');
			return All_Item_Count;
		}
}
function AllSalesOrder() {
        var All_sales_Count = [];
		var column = new Array();
		var filter = new Array();
		filter.push(new nlobjSearchFilter('custentity4', 'vendorLine', 'is', 6));
		filter.push(new nlobjSearchFilter('createdfrom', null, 'anyOf', sales_order));
		column.push(new nlobjSearchColumn('createdfrom'));
		column.push(new nlobjSearchColumn('name'));
		column.push(new nlobjSearchColumn('number'));
		column.push(new nlobjSearchColumn('custcoldiamondinscription')); //DIAMOND INSCRIPTION
		column.push(new nlobjSearchColumn('custcol28')); //CERTIFICATE INCLUDED
		var result_s = nlapiSearchRecord('purchaseorder', null, filter, column);
		if (result_s != null && result_s.length > 0) {
			for (var zz = 0; zz < result_s.length; zz++) {
				All_sales_Count.push({
					salesorder : result_s[zz].getValue('createdfrom'),
					PRODUCTION_VENDOR : result_s[zz].getText('name'),
					PRODUCTION_VENDOR_PO : result_s[zz].getValue('number'),
					PRODUCTION_VENDOR_PO_InternalId : result_s[zz].getId()
				});
			}
			All_sales_Count = removeDuplicates(All_sales_Count, 'salesorder');
			
		}
      return All_sales_Count;
}
function SalesOrder_CDP() {
	var cdp_ck = [];
	var column = new Array();
	var filter = new Array();
	filter.push(new nlobjSearchFilter('internalid', null, 'anyOf', sales_order));
	filter.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	column.push(new nlobjSearchColumn('status'));
	column.push(new nlobjSearchColumn('entity'));
	column.push(new nlobjSearchColumn('custbody_category1'));
	column.push(new nlobjSearchColumn('custbody_category2'));
	column.push(new nlobjSearchColumn('custbody_category3'));
	column.push(new nlobjSearchColumn('custbody_category4'));
	column.push(new nlobjSearchColumn('custbody_category5'));
	column.push(new nlobjSearchColumn('custbody_category6'));
	var result_s = nlapiSearchRecord('salesorder', null, filter, column);
	if (result_s != null) {
		for (y = 0; y < result_s.length; y++) {
			cdp_ck.push({

				internalid : result_s[y].getId(),
				status : result_s[y].getText('status'),
				name : result_s[y].getText('entity'),
				custbody_category1 : result_s[y].getText('custbody_category1'),
				custbody_category2 : result_s[y].getText('custbody_category2'),
				custbody_category3 : result_s[y].getText('custbody_category3'),
				custbody_category4 : result_s[y].getText('custbody_category4'),
				custbody_category5 : result_s[y].getText('custbody_category5'),
				custbody_category6 : result_s[y].getText('custbody_category6'),

			});
		}

	}
	return cdp_ck;
}
function Find_PRODUCTION_VENDOR(PRODUCTION_VENDOR_Result, salesorderId) {
	var prd = new Array();
	var prdChk_vendor = new Array();
	var prdChk_po = new Array();
	var value_finnd = true;
	if (PRODUCTION_VENDOR_Result != null && PRODUCTION_VENDOR_Result.length > 0 && salesorderId != '' && salesorderId != null) {
		for (var sss = 0; sss < PRODUCTION_VENDOR_Result.length; sss++) {
			var chkSalesOrder = PRODUCTION_VENDOR_Result[sss].salesorder;
			if (salesorderId == chkSalesOrder) {
				prdChk_vendor.push(PRODUCTION_VENDOR_Result[sss].PRODUCTION_VENDOR);
				prdChk_po.push("<a  title='Click here to link Item' href='/app/accounting/transactions/purchord.nl?id=" + PRODUCTION_VENDOR_Result[sss].PRODUCTION_VENDOR_PO_InternalId + "'>PO #" + PRODUCTION_VENDOR_Result[sss].PRODUCTION_VENDOR_PO + "</a>");
				value_finnd = false;

			}
		}
	}

	if (value_finnd) {
		prd.push('');
		prd.push('');
	} else {

		prd.push(prdChk_vendor.join('</br>'));
		prd.push(prdChk_po.join('</br>'));

	}
	return prd;
}
function Received_Count_Function(Received_Count, itemvale) {
	var countrecive = 0;
	if (Received_Count != null && Received_Count.length > 0) {
		for (var m = 0; m < Received_Count.length; m++) {
			var item = Received_Count[m].Item;
			if (item == itemvale) {
				countrecive = countrecive + 1;
			}

		}

	}
	return countrecive + '';
}
function removeDuplicates(arr, prop) {
	var new_arr = [];
	var lookup = {};

	for (var i in arr) {
		lookup[arr[i][prop]] = arr[i];
	}

	for (i in lookup) {
		new_arr.push(lookup[i]);
	}

	return new_arr;
}
function remove_duplicates_safe(arr) {
	var obj = {};
	var arr2 = [];
	for (var i = 0; i < arr.length; i++) {
		if (!(arr[i]in obj)) {
			arr2.push(arr[i]);
			obj[arr[i]] = true;
		}
	}
	return arr2;
}