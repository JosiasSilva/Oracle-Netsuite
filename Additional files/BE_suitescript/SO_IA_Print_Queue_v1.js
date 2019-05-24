nlapiLogExecution("audit", "FLOStart", new Date().getTime());
//TASK [NS-793]
function SO_IA_Print_Queue(request, response) {
    if (request.getMethod() == "GET") {
        try {
            var form = nlapiCreateForm("Print Sales Order & Insurance Appraisals");
            form.setScript("customscript_so_ia_print_queue_cs");
            var fld = form.addField("custpage_selected", "integer", "Selected");
            fld.setDisplayType("inline");
            fld.setDefaultValue("0");
            var orders = [];
            /* added by sanjeet sharma*/
            //var results = nlapiLoadSearch(null, 7785);//Sandbox
            var results = nlapiLoadSearch(null, 7827); //Production
            var numOrders = 0;
            var searchresult = [];
            var resultset = results.runSearch();
            var searchid = 0;
            do {
                var resultslice = resultset.getResults(searchid, searchid + 1000);
                if (resultslice != null && resultslice != '') {
                    for (var rs in resultslice) {
                        searchresult.push(resultslice[rs]);
                        searchid++;
                    }
                }
            }
            while (resultslice.length >= 1000);
            if (searchresult != null && searchresult != '') {
                numOrders = searchresult.length;
                nlapiLogExecution('debug', 'Length ' + numOrders);
                var page = request.getParameter("page");
                var start = 0;
                if (page != null && page != "") {
                    page = parseFloat(page);
                    start = page - 1;
                } else {
                    page = 0;
                }
                var end = 0;
                if (numOrders > 50) {
                    end = start + 50;
                    if (end > numOrders) {
                        end = numOrders;
                    }

                } else {
                    end = numOrders;
                }
                nlapiLogExecution('debug', 'start#' + start, 'end#' + end);
                orders = GetData(start, end, searchresult);
            }
            /* added by sanjeet sharma*/
            // nlapiLogExecution("Debug","Orders [JSON]",JSON.stringify(orders));
            var index = 1;
            if (numOrders > 50) {
                var pageFld = form.addField("custpage_page", "select", "Select Page");
                if (request.getParameter("page") != null && request.getParameter("page") != "")
                    var defaultSel = request.getParameter("page");
                else
                    var defaultSel = 1;
                for (var i = 0; i < Math.ceil(numOrders / 50); i++) {
                    var isDefault = false;
                    if (defaultSel == index)
                        isDefault = true;
                    var nextIndex = index + 49;
                    if (nextIndex > numOrders)
                        nextIndex = numOrders;
                    pageFld.addSelectOption(index, index + " - " + nextIndex, isDefault);
                    index = nextIndex + 1;
                }
            }
            var list = form.addSubList("custpage_orders", "list", "Sales Orders");
            list.addField("custpage_sno", "integer", "sno");
            list.addField("custpage_print", "checkbox", "Print?");
            list.addField("custpage_internalid", "text", "SO Internal Id").setDisplayType("hidden");
            list.addField("custpage_number", "text", "Sales Order#");
            list.addField("custpage_customer", "text", "Customer");
            list.addField("custpage_shipping_country", "text", "Shipping Country");
            list.addField("custpage_pick_up_at_be", "text", "Pick-up at BE");
            list.addField("custpage_materials_ready", "text", "Materials Ready");
            list.addField("custpage_product_category", "text", "Product Category ");
            list.addField("custpage_product_category_rank", "text", "Product Category Rank");
            list.addField("custpage_international_shipping", "text", "International Shipping");
            list.addField("custpage_so_ia_file", "text", "SO IA File").setDisplayType("hidden");
            list.setLineItemValues(orders);

            form.addButton("custpage_mark_all", "Mark All", "IA_Print_Queue_Mark_All()");
            form.addButton("custpage_unmark_all", "Unmark All", "IA_Print_Queue_Unmark_All()");
            form.addSubmitButton("Print Selected");

            response.writePage(form);
        } catch (ex) {
            nlapiLogExecution("Debug", "Error [GET Request]", ex.message);
        }
    } else {
        try {
            var soIAFileIdArr = [];
            for (var x = 0; x < request.getLineItemCount("custpage_orders"); x++) {
                if (request.getLineItemValue("custpage_orders", "custpage_print", x + 1) == "T")
                    soIAFileIdArr.push(request.getLineItemValue("custpage_orders", "custpage_so_ia_file", x + 1));
            }
            var xml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
            xml += "<pdfset>";
            if (soIAFileIdArr.length > 0) {
                for (var pqso = 0; pqso < soIAFileIdArr.length; pqso++) {
                    var fileObj = nlapiLoadFile(soIAFileIdArr[pqso]);
                    var fileUrl = fileObj.getURL();
                    if (nlapiGetContext().getEnvironment() == "PRODUCTION")
                        fileUrl = "https://system.netsuite.com" + fileUrl.replace(/&/g, "&amp;");
                    else
                        fileUrl = "https://system.sandbox.netsuite.com" + fileUrl.replace(/&/g, "&amp;");
                    xml += "<pdf src='" + fileUrl + "' />";
                }
            }
            xml += "</pdfset>";
            var pdf = nlapiXMLToPDF(xml);
            response.setContentType("PDF", "Sales_Order_Insurance_Appraisal.pdf", "inline");
            response.write(pdf.getValue());
            nlapiLogExecution("Debug", "Message", "Pdf file printed successfully");
        } catch (ex) {
            nlapiLogExecution("Debug", "Error[POST Request]", ex.message);
        }
    }
}
/* Anuj Kumar Verma */

/* added by sanjeet sharma*/
function GetData(start, end, searchresult) {
    var orders = [];
    for (var x = start; x < end; x++) {
        orders.push({
            custpage_internalid: searchresult[x].getId(),
            custpage_number: searchresult[x].getValue('tranid'),
            custpage_customer: searchresult[x].getValue('firstname', 'customer') + " " + searchresult[x].getValue('lastname', 'customer'),
            custpage_shipping_country: searchresult[x].getText('shipcountry'),
            custpage_pick_up_at_be: searchresult[x].getValue('custbody53') == 'T' ? 'Yes' : 'No',
            custpage_sno: (x + 1).toFixed(0),
            custpage_so_ia_file: searchresult[x].getValue('custbody_sales_order_ia_file'),
            custpage_materials_ready: searchresult[x].getValue('custbody_materials_ready') == 'T' ? 'Yes' : 'No',
            custpage_product_category: searchresult[x].getText("custbodyproduct_category"),
            custpage_product_category_rank: searchresult[x].getValue('custbody_product_category_rank'),
            custpage_international_shipping: searchresult[x].getValue('custbody_international_shipping') == 'T' ? 'Yes' : 'No'
        });
    }
    return orders;
}
/* added by sanjeet sharma*/