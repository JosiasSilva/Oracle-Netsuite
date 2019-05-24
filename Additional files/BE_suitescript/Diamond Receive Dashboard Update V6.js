var sales_order = new Array();
var Item_Id = new Array();
var custpage_totaldata;

function Diamond_Receive_Dashboard(request, response) {
  if (request.getMethod() == "GET") {

    var lines = [];
    var form = nlapiCreateForm("Diamond Receive Dashboard");

    form.setScript("customscript_diamond_box_update");
    var form_vendor_fld = form.addField("custpage_search_vendor", "select", "Vendor");
    form.addField("custpage_form_date", "date", "Date").setDefaultValue(request.getParameter("custpage_form_date"));
    custpage_totaldata = form.addField("custpage_totaldata", "text", "Total Record").setDisplayType("inline");
    var form_stone_received_by = form.addField("custpage_stone_received_by", "select", "Stone Received By","employee");//Added by Sandeep
    form_stone_received_by.setDefaultValue(nlapiGetUser());//Added by Sandeep NS-575
    form_stone_received_by.setDisplayType("hidden");
    var custpage_vendor_data = nlapiGetContext().getSetting('SESSION', 'custpage_vendor_data');
    var custpage_search_vendor = request.getParameter("custpage_search_vendor");
    var custpage_form_date = request.getParameter("custpage_form_date");
    if (custpage_vendor_data != null && (custpage_search_vendor != null || custpage_form_date != null)) {
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
    list.addField("custpage_description", "textarea", "Description");
    list.addField("custpage_production_vendor", "textarea", "Production Vendor");
    list.addField("custpage_production_vendor_po", "textarea", "Production Vendor PO");
    list.addField("custpage_diamond_in_hold_binder", "checkbox","Diamond in hold binder");
    list.addField("custpage_certificate_included", "select", "Certificate Included", 'customlist17').setDisplayType("entry");
	list.addField("custpage_rfid","checkbox","RFID");
    list.addField("custpage_diamond_inscription", "checkbox", "Diamond Inscription").setDisplayType("entry");
    list.addField("custpage_important_notes", "textarea", "Important Notes").setDisplayType("entry");
    list.addField("custpage_date_needed_in_sf", "date", "Date Needed in SF").setDisplayType("entry");
    list.addField("custpage_req_location", "text", "Request Location");
    list.addField("custpage_inventory_location", "select", "Inventory Location", 'location').setDisplayType("entry");
    list.addField("custpage_diamond_status", "select", "Diamond Status", 'customlist_diamond_status').setDisplayType("entry");
    list.addField("custpage_certificate_no", "text", "Certificate Number");
    list.addField("custpage_changed", "checkbox", "Changed?").setDisplayType("hidden");
    list.addField("custpage_diamond_id", "select", "Custom Diamond", "customrecord_custom_diamond").setDisplayType("hidden");
    list.addField("custpage_recivebutton", "text", "Receive").setDisplayType("hidden");
    list.addField("custpage_diamond_inscription_old", "checkbox", "Diamond Inscription").setDisplayType("hidden");
    list.addField("custpage_important_notes_old", "textarea", "Important Notes").setDisplayType("hidden");
    list.addField("custpage_certificate_included_old", "select", "Certificate Included", 'customlist17').setDisplayType("hidden");
    list.addField("custpage_date_needed_in_sf_old", "date", "Date Needed in SF").setDisplayType("hidden");
    list.addField("custpage_inventory_location_old", "select", "Inventory Location", 'location').setDisplayType("hidden");
    list.addField("custpage_diamond_status_old", "select", "Diamond Status", 'customlist_diamond_status').setDisplayType("hidden");
    list.addField("custpage_po_line", "text", "PO Line #").setDisplayType("hidden");
    list.addField("custpage_po_lineuniquekey", "text").setDisplayType("hidden");
    list.addField("custpage_po_id", "select", "Purchase Order", "purchaseorder").setDisplayType("hidden");
    list.addField("custpage_colour_flag", "text").setDisplayType("hidden");
    list.addField("custpage_so_id", "text","SO ID").setDisplayType("hidden");
    list.addField("custpage_item_id", "text","Item ID").setDisplayType("hidden");
	list.addField("custpage_sales_order_internalid", "text","Sales Order Internal ID").setDisplayType("hidden");
	list.addField("custpage_stock_number_text", "text","Stock Number Text").setDisplayType("hidden");          
   // list.addField("custpage_diamond_in_hold_binder", "checkbox","Diamond in hold binder");
    form.addSubmitButton(" Update/Receive ");
    form.addButton("custpage_item_search", " Search ", 'Search()');
    var result = Fatch_Data(request);
    var Received_Count = null;
    var PRODUCTION_VENDOR = null;
    var cdp_so = null;
    if (Item_Id != null && Item_Id.length > 0) {
      Received_Count = AllCountItem();
    }
    if (sales_order != null && sales_order.length > 0) {
      PRODUCTION_VENDOR = AllSalesOrder();
      cdp_so = SalesOrder_CDP();
    }
    if (result != null) {
      var vendors = [];
      vendors.push({
        id: '',
        name: ''
      });

      for (var q = 0; q < result.length; q++) {

        var Sales_order_data = [];
        if (result[q].po_ref != null && result[q].po_ref != '') {
          if (cdp_so != null) {
            for (var z = 0; z < cdp_so.length; z++) {
              var id = cdp_so[z].internalid;
              if (id == result[q].po_ref) {
                Sales_order_data = cdp_so[z];
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
        var PRODUCTION_VENDOR_details = new Array();




        var SalesorderLink = '';
        var SalesOrderText = result[q].po_ref_text;				
        if (Sales_order_data.status != 'Cancelled') {
          PRODUCTION_VENDOR_details = Find_PRODUCTION_VENDOR(PRODUCTION_VENDOR, result[q].po_ref);
        } else {
          PRODUCTION_VENDOR_details.push('');
          PRODUCTION_VENDOR_details.push('');

        }  
        var check_back_used=false;				

        if (SalesOrderText.indexOf('Sales Order #') != -1 || SalesOrderText.indexOf('Work Order #') != -1) {
          if (SalesOrderText.indexOf('Sales Order #') != -1) {
            check_back_used=true;
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


        var custpage_colour_flag_value='0';
        if(check_back_used)
        {
          if(Sales_order_data.status=='Closed')
          {	
            custpage_colour_flag_value='1';
          }
        }


        lines.push({
          custpage_diamond_id: result[q].cdp_id,
          custpage_po_id: result[q].cdp_po_number,
          custpage_recivebutton: "<a title='Click here to receive' href='/app/site/hosting/scriptlet.nl?script=942&deploy=1&Purchase_ID=" + result[q].cdp_po_number + "'>" + 'Receive' + "</a>",
          custpage_linkto_po: "<a  title='Click here to link PO' href='/app/accounting/transactions/purchord.nl?id=" + result[q].cdp_po_number + "'>" + (result[q].cdp_po_number_text).replace('Purchase Order #', '') + "</a>",
          custpage_cdp_request_type: result[q].cdp_request_type,
          custpage_vendor: result[q].cdp_vendor,
          custpage_received_count: Received_Count_Function(Received_Count, result[q].cdp_stock_number),
          custpage_be_stock: "<a  title='Click here to link Item' href='/app/common/item/item.nl?id=" + result[q].cdp_stock_number + "'>" + result[q].cdp_stock_number_text + "</a>",
		  custpage_stock_number_text: result[q].cdp_stock_number_text,
          custpage_vendor_stock: result[q].item_vendor,
          custpage_createdfrom: SalesorderLink,
          custpage_description: result[q].item_salesdescription,//.substring(0, 299),
          custpage_production_vendor: PRODUCTION_VENDOR_details[0],//.substring(0, 299),
          custpage_production_vendor_po: PRODUCTION_VENDOR_details[1],//.substring(0, 299),
          custpage_certificate_included: result[q].po_certificate_included,
          custpage_certificate_included_old: result[q].po_certificate_included,
          custpage_diamond_inscription: result[q].po_diamond_inscription,
          custpage_diamond_inscription_old: result[q].po_diamond_inscription,
          custpage_important_notes: result[q].po_important_notes,//.substring(0, 299),
          custpage_important_notes_old: result[q].po_important_notes,//.substring(0, 299),
          custpage_date_needed_in_sf: result[q].po_date_needed_in_sf,
          custpage_date_needed_in_sf_old: result[q].po_date_needed_in_sf,
          custpage_inventory_location: result[q].po_inventory_location,
          custpage_inventory_location_old: result[q].cdp_diamond_status,
          custpage_req_location: result[q].cdp_location_text,
          custpage_diamond_status: result[q].cdp_diamond_status,
          custpage_diamond_status_old: result[q].cdp_diamond_status,
          custpage_po_line: result[q].po_lineid,
          custpage_po_lineuniquekey:result[q].po_lineuniquekey,
          custpage_cdpid: result[q].cdp_id == null ? '' : ("<a  title='Click here to link CDP' href='/app/common/custom/custrecordentry.nl?rectype=231&id=" + result[q].cdp_id + "'>" + result[q].cdp_id + "</a>"),
          custpage_customer: Sales_order_data.name,
          custpage_request_type: result[q].cdp_request_type,
          custpage_certificate_no: result[q].po_certificate_no,
          custpage_colour_flag:custpage_colour_flag_value,
          custpage_diamond_in_hold_binder: result[q].diamond_in_hold_binder,
          custpage_so_id: result[q].custpage_so_id,
          custpage_item_id: result[q].cdp_stock_number,
		  custpage_sales_order_internalid : result[q].po_ref
        });
        var vendor_id = result[q].cdp_vendor;
        var vendor_name = result[q].cdp_vendor_text;
        if (vendor_id != null && vendor_name != null && vendor_id != '' && vendor_name != '') {
          vendors.push({
            id: result[q].cdp_vendor,
            name: result[q].cdp_vendor_text

          });
        }

      }
      custpage_totaldata.setDefaultValue(lines.length + '');
      lines.sort(function(a, b) {
        return parseFloat(b.custpage_po_id) - parseFloat(a.custpage_po_id);
      });
      list.setLineItemValues(lines);

      var custpage_search_vendor = request.getParameter("custpage_search_vendor");
      var custpage_form_date = request.getParameter("custpage_form_date");
      var custpage_vendor_data = nlapiGetContext().getSetting('SESSION', 'custpage_vendor_data');
      if (custpage_search_vendor == null && custpage_form_date == null && vendors != null && vendors.length > 0) {
        vendors = removeDuplicates(vendors, 'id');
        for (var x = 0; x < vendors.length; x++) {
          form_vendor_fld.addSelectOption(vendors[x].id, vendors[x].name, false);
        }
        custpage_vendor_data = JSON.stringify(vendors);
        nlapiGetContext().setSetting('SESSION', 'custpage_vendor_data', custpage_vendor_data);
      }



    }

    response.writePage(form);
  } else {

    var count_line_item = request.getLineItemCount("custpage_list");
    //  nlapiLogExecution ( 'debug' , 'Yagya' , count_line_item);
    var po_cdp_data = [];

    for (var x = 1; x <= count_line_item; x++) {
      try {
        var CDP_json = [];
        var PO_json = [];
        var SO_json=[];
		
		var labels = [];
		var rfids = [];
		
        if (request.getLineItemValue('custpage_list', 'custpage_recive_check', x) == "T") {

          var custom_diamond_id = request.getLineItemValue("custpage_list", "custpage_diamond_id", x);
          if (custom_diamond_id != null && custom_diamond_id != '') {

            if (request.getLineItemValue("custpage_list", "custpage_diamond_status", x) != request.getLineItemValue("custpage_list", "custpage_diamond_status_old", x)) {
              CDP_json = ({
                internalid: request.getLineItemValue("custpage_list", "custpage_diamond_id", x),
                custrecord_diamond_status: request.getLineItemValue("custpage_list", "custpage_diamond_status", x)
              });
            }
          }


          if (request.getLineItemValue('custpage_list', 'custpage_diamond_in_hold_binder', x) == "T" && request.getLineItemValue('custpage_list', 'custpage_so_id', x)  && request.getLineItemValue("custpage_list", "custpage_item_id", x)) {
            SO_json = ({
              internalid: request.getLineItemValue("custpage_list", "custpage_so_id", x),
              line_id: request.getLineItemValue("custpage_list", "custpage_item_id", x)
            });
          }

          PO_json = ({
            internalid: request.getLineItemValue('custpage_list', 'custpage_po_id', x),
            custbody58: request.getLineItemValue('custpage_list', 'custpage_important_notes', x),
            custbody59: request.getLineItemValue('custpage_list', 'custpage_date_needed_in_sf', x),
            custcoldiamondinscription: request.getLineItemValue('custpage_list', 'custpage_diamond_inscription', x),
            custcol28: request.getLineItemValue('custpage_list', 'custpage_certificate_included', x),
            location: request.getLineItemValue("custpage_list", "custpage_inventory_location", x),
            line_number: request.getLineItemValue("custpage_list", "custpage_po_line", x),
            po_lineuniquekey:request.getLineItemValue("custpage_list", "custpage_po_lineuniquekey", x),
            stone_received_by:request.getParameter("custpage_stone_received_by"), //Added By Sandeep
          });
          po_cdp_data.push({
            custrecord_po_data_update: JSON.stringify(PO_json),
            custrecord_cdp_update: JSON.stringify(CDP_json),
            custrecord_so_data_update:JSON.stringify(SO_json)
          });
          nlapiLogExecution('debug', 'PO ID', request.getLineItemValue('custpage_list', 'custpage_po_id', x));
		  
		  //IF (CERT INCLUDED = NO and DIAMOND IN HOLD BINDER = T) OR (CERT INCLUDED = YES and DIAMOND IN HOLD BINDER = F)
		  //Print 1 Copy of Diamond Certificate Label
		  if((request.getLineItemValue("custpage_list","custpage_certificate_included",x)=="2" && request.getLineItemValue("custpage_list","custpage_diamond_in_hold_binder",x)=="T") || (request.getLineItemValue("custpage_list","custpage_certificate_included",x)=="1" && request.getLineItemValue("custpage_list","custpage_diamond_in_hold_binder",x)=="F"))
		  {
		  	labels.push({
				item : request.getLineItemValue("custpage_list","custpage_item_id",x),
				soid : request.getLineItemValue("custpage_list","custpage_so_id",x),
				type : "CERT",
				qty : 1
			});
		  }
		  
		  //IF CERT INCLUDED = YES and DIAMOND IN HOLD BINDER = T
		  //Print 2 Copies of Diamond Certificate Label
		  if((request.getLineItemValue("custpage_list","custpage_certificate_included",x)=="1" && request.getLineItemValue("custpage_list","custpage_diamond_in_hold_binder",x)=="T"))
		  {
		  	labels.push({
				item : request.getLineItemValue("custpage_list","custpage_item_id",x),
				soid : request.getLineItemValue("custpage_list","custpage_so_id",x),
				type : "CERT",
				qty : 2
			});
		  }
		  
		  //IF PROD VENDOR PO != NULL and DIAMOND IN HOLD BINDER = F
		  //Print 1 Copy of Vendor Box Label
		  if((request.getLineItemValue("custpage_list","custpage_production_vendor_po",x)!=null && request.getLineItemValue("custpage_list","custpage_production_vendor_po",x)!="" && request.getLineItemValue("custpage_list","custpage_diamond_in_hold_binder",x)=="F"))
		  {
		  	labels.push({
				item : request.getLineItemValue("custpage_list","custpage_item_id",x),
				poid : '',
				inscription : '',
				type : "VENDOR",
				qty : 2
			});
		  }
		  
		  //IF RFID is Checked, Send print request for RFID tag
		  if(request.getLineItemValue("custpage_list","custpage_rfid",x)=="T")
		  {
		  	rfids.push(request.getLineItemValue("custpage_list","custpage_item_id",x));
		  }

        }

      } catch (er) {}
    }

    if (po_cdp_data.length > 0) {

      var record_create = nlapiCreateRecord('customrecord_po_cdp_data');
      for (var t = 0; t < po_cdp_data.length; t++) {

        record_create.setLineItemValue('recmachcustrecord_po_cdp_id', 'custrecord_po_data_update', (t + 1), po_cdp_data[t].custrecord_po_data_update);
        record_create.setLineItemValue('recmachcustrecord_po_cdp_id', 'custrecord_cdp_update', (t + 1), po_cdp_data[t].custrecord_cdp_update);
        record_create.setLineItemValue('recmachcustrecord_po_cdp_id', 'custrecord_so_data_update', (t + 1), po_cdp_data[t].custrecord_so_data_update);
      }
      nlapiSubmitRecord(record_create, true, true);
      // var params = new Array();
      //  params['status'] = 'scheduled';
      // params['runasadmin'] = 'T';
      // var startDate = new Date();
      // params['startdate'] = startDate.toUTCString();
      //https://debugger.netsuite.com/app/common/scripting/script.nl?id=1005
      // var status = nlapiScheduleScript('customscript_update_po_cdp', 'customdeploy_update_po_cdp', params); 			  
    }

    var param = new Array();
    param['custpage_search_vendor'] = request.getParameter("custpage_search_vendor");
    param['custpage_form_date'] = request.getParameter("custpage_form_date");
    //https://debugger.netsuite.com/app/common/scripting/script.nl?id=1006
    response.sendRedirect("SUITELET", "customscript_diamond_dashboard_v2", "customdeploy_diamond_dashboard_v2", false, param);
  }
}


function Fatch_Data(request) {
  var filter_update_cdp = new Array();
  var PO_ID = new Array();
  var Line_Id_Uniqe=[];
  var update_data = nlapiSearchRecord("customrecord_diamond_receive_dashboard", null, new nlobjSearchFilter('custrecord_po_cdp_id', null, 'noneOf', '@NONE@'), new nlobjSearchColumn("custrecord_po_data_update"));
  if (update_data != null) {
    for (var s = 0; s < update_data.length; s++) {
      var json_obj = JSON.parse(update_data[s].getValue('custrecord_po_data_update'));
      var get_line_number=json_obj.po_lineuniquekey;
      if(get_line_number)
      {
        Line_Id_Uniqe.push(get_line_number);
      }
    }
  }
  var result = [];
  var custpage_search_vendor = request.getParameter("custpage_search_vendor");
  var custpage_vendor_data = request.getParameter("custpage_vendor_data");
  var custpage_form_date = request.getParameter("custpage_form_date");
  var search_1 = new Array();
  var search_2 = new Array();
  if (custpage_search_vendor != null && custpage_search_vendor != '' && custpage_search_vendor != "0") {
    set_vendor_data = false;
    search_1.push(new nlobjSearchFilter('custrecord_custom_diamond_vendor', null, 'anyOf', custpage_search_vendor));
    search_2.push(new nlobjSearchFilter('internalid', 'vendor', 'anyOf', custpage_search_vendor));
  }
  if (custpage_form_date != null && custpage_form_date != '') {
    set_vendor_data = false;
    search_1.push(new nlobjSearchFilter("custbody59", "custrecord_diamond_po_number", "on", custpage_form_date));
    search_2.push(new nlobjSearchFilter("custbody59", null, "on", custpage_form_date));
  }
  //search_1.push(new nlobjSearchFilter('internalid',null,'anyof','55601'));
  //var results = nlapiSearchRecord(null, '5429',search_1);
  var results = new Array();
  // Loading the Given saved search Estate Ring Repair - Sent to TD
  var searchResult = nlapiLoadSearch(null, 5429);
  searchResult.addFilters(search_1);
  // Running the Saved Search
  var searchResultSet = searchResult.runSearch();
  // Getting the All Results into one Array.
  var searchId = 0;
  do {
    var resultslice = searchResultSet.getResults(searchId, searchId + 1000);
    if (resultslice != null && resultslice != '') {
      for (var rs in resultslice) {
        results.push(resultslice[rs]);
        searchId++;
      }
    }

  } while (resultslice.length >= 1000);



  if (results) {
    var result_two = [];
    var result_one = [];
    for (var j = 0; j < results.length; j++) {			
      var get_line_uniq_id= results[j].getValue("lineuniquekey", "CUSTRECORD_DIAMOND_PO_NUMBER");
      if(Line_Id_Uniqe.indexOf(get_line_uniq_id)<0)
      {		

        var So_ref = results[j].getValue("createdfrom", "CUSTRECORD_DIAMOND_PO_NUMBER");
        var So_ref_text = results[j].getText("createdfrom", "CUSTRECORD_DIAMOND_PO_NUMBER");
        var Item = results[j].getValue("custrecord_be_diamond_stock_number");
        var allCol = results[j].getAllColumns();
        var result_obj = ({
          cdp_id: results[j].getId(),
          cdp_request_type: results[j].getValue("custrecord_custom_diamond_request_type"),
          cdp_vendor: results[j].getValue("custrecord_custom_diamond_vendor"),
          cdp_vendor_text: results[j].getText("custrecord_custom_diamond_vendor"),
          cdp_po_number: results[j].getValue("custrecord_diamond_po_number"),
          cdp_po_number_text: results[j].getText("custrecord_diamond_po_number"),
          cdp_location: results[j].getValue("custrecord_cdp_request_location"),
          cdp_location_text: results[j].getText("custrecord_cdp_request_location"),
          cdp_diamond_status: results[j].getValue("custrecord_diamond_status"),
          cdp_stock_number: Item,
          cdp_stock_number_text: results[j].getText("custrecord_be_diamond_stock_number"),
          item_vendor: results[j].getValue("vendorname", "CUSTRECORD_BE_DIAMOND_STOCK_NUMBER"),
          item_salesdescription: results[j].getValue("salesdescription", "CUSTRECORD_BE_DIAMOND_STOCK_NUMBER"),
          po_ref: So_ref,
          po_ref_text: So_ref_text,
          po_certificate_included: results[j].getValue("custcol28", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_diamond_inscription: results[j].getValue("custcoldiamondinscription", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_important_notes: results[j].getValue("custbody58", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_date_needed_in_sf: results[j].getValue("custbody59", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_inventory_location: results[j].getValue("location", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_lineuniquekey: results[j].getValue("lineuniquekey", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_lineid: results[j].getValue("line", "CUSTRECORD_DIAMOND_PO_NUMBER"),
          po_certificate_no: results[j].getValue("custitem46", "CUSTRECORD_BE_DIAMOND_STOCK_NUMBER"),
          status_cdp_so:results[j].getText("status", "custrecord_diamond_so_order_number"),
          diamond_in_hold_binder:results[j].getValue(allCol[22]),
          custpage_so_id:results[j].getValue('custrecord_diamond_so_order_number'),
          custpage_item_id:results[j].getValue('custrecord_be_diamond_stock_number')
        });
        var request_type = results[j].getValue("custrecord_custom_diamond_request_type");
        var diamound_status = results[j].getValue("custrecord_diamond_status");
        PO_ID.push(results[j].getValue("custrecord_diamond_po_number"));					
        if (So_ref && So_ref_text && So_ref_text.indexOf('Sales Order #') != -1) {
          sales_order.push(So_ref);
        }
        if (Item) {
          Item_Id.push(Item);
        }
        if (request_type == '1' && diamound_status == '1') {
          result_one.push(result_obj);
        } else {
          result_two.push(result_obj);
        }
        Line_Id_Uniqe.push(get_line_uniq_id);		
      }
    }

    result = result_two.concat(result_one);
  }
  if (PO_ID.length > 0) {
    search_2.push(new nlobjSearchFilter("internalid", null, "noneOf", PO_ID));
  }
  var results = nlapiSearchRecord("purchaseorder", "customsearch_diamond_rcv_search_2", search_2);//5434
  // results=null;
  if (results) {
    for (var s = 0; s < results.length; s++) {
      var get_line_uniq_id= results[s].getValue("lineuniquekey");
      if(Line_Id_Uniqe.indexOf(get_line_uniq_id)<0)
      {
        var So_ref = results[s].getValue("createdfrom");
        var So_ref_text = results[s].getText("createdfrom");
        var Item = results[s].getValue("item");
        result.push({
          cdp_vendor: results[s].getValue("internalid", "vendor"),
          cdp_vendor_text: results[s].getValue("entityid", "vendor"),
          cdp_po_number: results[s].getId(),
          cdp_po_number_text: results[s].getValue("tranid"),
          cdp_stock_number: Item,
          cdp_stock_number_text: results[s].getText("item"),
          item_vendor: results[s].getValue("vendorname", "item"),
          item_salesdescription: results[s].getValue("salesdescription", "item"),
          po_ref: So_ref,
          po_ref_text: So_ref_text,
          po_certificate_included: results[s].getValue("custcol28"),
          po_diamond_inscription: results[s].getValue("custcoldiamondinscription"),
          po_important_notes: results[s].getValue("custbody58"),
          po_date_needed_in_sf: results[s].getValue("custbody59"),
          po_inventory_location: results[s].getValue("location"),				
          po_lineid: results[s].getValue("line"),
          po_lineuniquekey: results[s].getValue("lineuniquekey"),
          po_certificate_no: results[s].getValue("custitem46", "item"),
          status_cdp_so:''
        });        
        if (So_ref && So_ref_text && So_ref_text.indexOf('Sales Order #') != -1) {
          sales_order.push(So_ref);
        }
        if (Item) {
          Item_Id.push(Item);
        }
        Line_Id_Uniqe.push(get_line_uniq_id);

      }
    }

  }

  sales_order = remove_duplicates_safe(sales_order);
  Item_Id = remove_duplicates_safe(Item_Id);
  result.sort(function(a, b) {
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
        InternalId: result_s[z].getId(),
        Item: result_s[z].getValue('item')
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
  filter.push(new nlobjSearchFilter('item', null, 'noneof', '@NONE@'));
  filter.push(new nlobjSearchFilter('createdfrom', null, 'anyOf', sales_order));
  filter.push(new nlobjSearchFilter('custentity4', 'vendor', 'is', 6));
  filter.push(new nlobjSearchFilter('custcol_category', null, 'anyOf', [2, 12,4,5]));
  column.push(new nlobjSearchColumn('createdfrom'));
  column.push(new nlobjSearchColumn('entityid', 'vendor'));
  column.push(new nlobjSearchColumn('number'));
  column.push(new nlobjSearchColumn('item'));
  column.push(new nlobjSearchColumn('custcol_category'));
  var result_s = nlapiSearchRecord('purchaseorder', null, filter, column);
  if (result_s != null && result_s.length > 0) {
    for (var zz = 0; zz < result_s.length; zz++) {
      var category = result_s[zz].getValue('custcol_category');
      if (category == "2") {
        All_sales_Count.push({
          salesorder: result_s[zz].getValue('createdfrom'),
          PRODUCTION_VENDOR: result_s[zz].getValue('entityid', 'vendor'),
          PRODUCTION_VENDOR_PO: result_s[zz].getValue('number'),
          PRODUCTION_VENDOR_PO_InternalId: result_s[zz].getId()
        });
      } else if (category == "12") {
        var item_chk = result_s[zz].getValue('item');
        if (item_chk == "2131887") {
          All_sales_Count.push({
            salesorder: result_s[zz].getValue('createdfrom'),
            PRODUCTION_VENDOR: result_s[zz].getValue('entityid', 'vendor'),
            PRODUCTION_VENDOR_PO: result_s[zz].getValue('number'),
            PRODUCTION_VENDOR_PO_InternalId: result_s[zz].getId()
          });
        }
      }else if (category == "4" || category == "5") {
        All_sales_Count.push({
          salesorder: result_s[zz].getValue('createdfrom'),
          PRODUCTION_VENDOR: result_s[zz].getValue('entityid', 'vendor'),
          PRODUCTION_VENDOR_PO: result_s[zz].getValue('number'),
          PRODUCTION_VENDOR_PO_InternalId: result_s[zz].getId()
        });
      } 
    }
    //All_sales_Count = removeDuplicates(All_sales_Count, 'salesorder');

  }
  return All_sales_Count;
}
/*
function AllSalesOrder() {
        var All_sales_Count = [];
		var column = new Array();
		var filter = new Array();		
		filter.push(new nlobjSearchFilter('item',null, 'noneof', '@NONE@'));
		filter.push(new nlobjSearchFilter('createdfrom', null, 'anyOf', sales_order));		
		filter.push(new nlobjSearchFilter('custentity4', 'vendor', 'is', 6));
		filter.push(new nlobjSearchFilter('custcol_category', null, 'anyOf', 2));		
		column.push(new nlobjSearchColumn('createdfrom'));
		column.push(new nlobjSearchColumn('entityid','vendor'));
		column.push(new nlobjSearchColumn('number'));
		var result_s = nlapiSearchRecord('purchaseorder', null, filter, column);
		if (result_s != null && result_s.length > 0) {
			for (var zz = 0; zz < result_s.length; zz++) {
				All_sales_Count.push({
					salesorder : result_s[zz].getValue('createdfrom'),
					PRODUCTION_VENDOR : result_s[zz].getValue('entityid','vendor'),
					PRODUCTION_VENDOR_PO : result_s[zz].getValue('number'),
					PRODUCTION_VENDOR_PO_InternalId : result_s[zz].getId()
				});
			}
			//All_sales_Count = removeDuplicates(All_sales_Count, 'salesorder');

		}
      return All_sales_Count;
}*/
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

        internalid: result_s[y].getId(),
        status: result_s[y].getText('status'),
        name: result_s[y].getText('entity'),
        custbody_category1: result_s[y].getText('custbody_category1'),
        custbody_category2: result_s[y].getText('custbody_category2'),
        custbody_category3: result_s[y].getText('custbody_category3'),
        custbody_category4: result_s[y].getText('custbody_category4'),
        custbody_category5: result_s[y].getText('custbody_category5'),
        custbody_category6: result_s[y].getText('custbody_category6'),

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

    prd.push(prdChk_vendor.join('</br></br>'));
    prd.push(prdChk_po.join('</br></br>'));

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
    if (!(arr[i] in obj)) {
      arr2.push(arr[i]);
      obj[arr[i]] = true;
    }
  }
  return arr2;
}