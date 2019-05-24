/*Script Type: Suitelet Script
  Script Id: 2477 & Client's script :1115
  Script Name: Fedex_Label_Queue_v6.js (Fedex Label Print Queue) */


var DATA_CENTER_URL = "";

function Fedex_Label_Queue(request,response)
{
  if(request.getMethod()=="GET")
  {
    var form = nlapiCreateForm("Print Fedex Labels");
    form.setScript("customscript_fedex_label_print_queue_cs");  //
    var fld = form.addField("custpage_allow_reprinting","checkbox","Allow Reprinting");
    if(request.getParameter("reprint")=="T")
      fld.setDefaultValue(request.getParameter("reprint"));

    fld = form.addField("custpage_selected","integer","Selected");
    fld.setDisplayType("inline");
    fld.setDefaultValue("0");

    var	fld2= form.addField("custpage_droup_ship","select","Drop Ship");
    fld2.addSelectOption('','');
    fld2.addSelectOption('T', 'Yes');
    fld2.addSelectOption('F', 'No');



    var numOrders = 0;

    var list = form.addSubList("custpage_labels","list","Labels");
    list.addField("custpage_print","checkbox","Print");
    list.addField("custpage_transaction","select","Transaction","transaction").setDisplayType("hidden");
    list.addField("custpage_sales_order","text","Sales Order");
    list.addField("custpage_customer","text","Customer");
    list.addField("custpage_cs_ff_status","textarea","CS Fulfillment Status");
    list.addField("custpage_dd_notes","textarea","Delivery Date Notes");
    list.addField("custpage_delivery_instr","textarea","Delivery Instructions");
    list.addField("custpage_fraud_check_new","text","Fraud Check New");
    list.addField("custpage_website_balance","currency","Website Balance");
    list.addField("custpage_ship_country","text","Shipping Country");
    list.addField("custpage_drop_ship","date","Drop Ship");
    list.addField("custpage_shipping_label_id","text","Shipping Label ID").setDisplayType("hidden");
    var filters=[];
    filters.push(new nlobjSearchFilter('custbody_fedex_shipping_label',null,"noneof","@NONE@"));
    filters.push(new nlobjSearchFilter("type",null,"anyof",["RtnAuth","ItemShip"]));
    filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
    filters.push(new nlobjSearchFilter("status",null,"noneof",["ItemShip:B","ItemShip:C"])); // Added by Aradhana - NS-1067
    filters.push(new nlobjSearchFilter("trandate",null,"onorafter","09/01/2016"));
    filters.push(new nlobjSearchFilter("custbody140","createdfrom","noneof","20"));
    if(request.getParameter("reprint")!="T")
    {
      filters.push(new nlobjSearchFilter("custbody_fedex_label_printed",null,"is","F")); //checkbox in Custom 
    }
    //Added by Aradhana - NS-1064
    var drop_value = request.getParameter('drop_value');
    if(drop_value)
    {
      fld2.setDefaultValue(drop_value);
      if(drop_value=="T")
      {
        filters.push(new nlobjSearchFilter("custbody39","createdfrom","isnotempty"));
      }
      else if(drop_value=="F")
      {
        filters.push(new nlobjSearchFilter("custbody39","createdfrom","isempty"));
      }
    }
    // End Added by Aradhana - NS-1064
    var cols = [];
    cols.push(new nlobjSearchColumn("tranid","createdfrom"));//If
    cols.push(new nlobjSearchColumn("trandate","createdfrom"));//If 
    cols.push(new nlobjSearchColumn("entity","createdfrom"));//If
    cols.push(new nlobjSearchColumn("custbody_fedex_shipping_label"));//If
    cols.push(new nlobjSearchColumn("custbodyfraud_check_new","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody194","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody150","createdfrom"));//If
    cols.push(new nlobjSearchColumn("custbody140","createdfrom").setSort(true));
    cols.push(new nlobjSearchColumn("custbody_website_truebalance_amt","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody39","createdfrom"));//If
    cols.push(new nlobjSearchColumn("shipcountry","createdfrom"));
    cols.push(new nlobjSearchColumn("firstname","customer").setSort());
    cols.push(new nlobjSearchColumn("lastname","customer").setSort());
    var labels = [];
    var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
    if(results)
    {
      numOrders = results.length;
      var page = request.getParameter("page");
      nlapiLogExecution('DEBUG','page  :',page);
      if(page!=null && page!="" && page!="null")
        page = parseFloat(page);

      nlapiLogExecution("debug","# Results",results.length);

      for(var x=0; x < results.length; x++)
      {
        if(page==null || page=="" || page==0 || page==1 || page=="null")
        {
          if(x < 40)
          {
            labels.push({
              custpage_transaction : results[x].getId(),
              custpage_sales_order : results[x].getValue("tranid","createdfrom"),
              custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
              custpage_shipping_label_id : results[x].getValue("custbody_fedex_shipping_label"),
              custpage_fraud_check_new : results[x].getText("custbodyfraud_check_new","createdfrom"),
              custpage_delivery_instr : results[x].getText("custbody194","createdfrom"),
              custpage_dd_notes : results[x].getValue("custbody150","createdfrom"),
              custpage_cs_ff_status : '<div id="csfulfill_status'+x+'">'+results[x].getText("custbody140","createdfrom")+'</div>',
              custpage_website_balance : results[x].getValue("custbody_website_truebalance_amt","createdfrom"),
              custpage_drop_ship : results[x].getValue("custbody39","createdfrom"),
              custpage_ship_country : results[x].getValue("shipcountry","createdfrom")
            });
          }
        }
        else
        {
          if(x >= page && x < (page + 40))
          {
            labels.push({
              custpage_transaction : results[x].getId(),
              custpage_sales_order : results[x].getValue("tranid","createdfrom"),
              custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
              custpage_shipping_label_id : results[x].getValue("custbody_fedex_shipping_label"),
              custpage_fraud_check_new : results[x].getText("custbodyfraud_check_new","createdfrom"),
              custpage_delivery_instr : results[x].getText("custbody194","createdfrom"),
              custpage_dd_notes : results[x].getValue("custbody150","createdfrom"),
              custpage_cs_ff_status : '<div id="csfulfill_status'+x+'">'+results[x].getText("custbody140","createdfrom")+'</div>',
              custpage_website_balance : results[x].getValue("custbody_website_truebalance_amt","createdfrom"),
              custpage_drop_ship : results[x].getValue("custbody39","createdfrom"),
              custpage_ship_country : results[x].getValue("shipcountry","createdfrom")
            });
          }
        }	
      }

      var index = 1;

      if(numOrders > 40)
      {
        var pageFld = form.addField("custpage_page","select","Select Page");

        if(request.getParameter("page")!=null && request.getParameter("page")!="")
          var defaultSel = request.getParameter("page");
        else
          var defaultSel = 1;

        for(var i=0; i < Math.ceil(numOrders / 40); i++)
        {
          var isDefault = false;
          if(defaultSel == index)
            isDefault = true;

          var nextIndex = index + 39;
          if(nextIndex > numOrders)
            nextIndex = numOrders;
          pageFld.addSelectOption(index,index + " - " + nextIndex,isDefault);
          index = nextIndex + 1;
        }
      }

      list.setLineItemValues(labels);
    }

    //list.addMarkAllButtons();

    form.addButton("custpage_mark_all","Mark All","FL_Print_Queue_Mark_All()");
    form.addButton("custpage_unmark_all","Unmark All","FL_Print_Queue_Unmark_All()");

    form.addSubmitButton("Print Selected");

    response.writePage(form);
  }
  else
  {
    var toPrint = [];
    var fulfillments = [];

    for(var x=0; x < request.getLineItemCount("custpage_labels"); x++)
    {
      if(request.getLineItemValue("custpage_labels","custpage_print",x+1)=="T")
      {
        if(request.getLineItemValue("custpage_labels","custpage_shipping_label_id",x+1)!=null && request.getLineItemValue("custpage_labels","custpage_shipping_label_id",x+1)!="")
        {
          toPrint.push(request.getLineItemValue("custpage_labels","custpage_shipping_label_id",x+1));
          fulfillments.push(request.getLineItemValue("custpage_labels","custpage_transaction",x+1));
        }
      }
    }

    var xml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
    xml+= "<pdfset>";

    getDataCenterURL();

    for(var x=0; x < toPrint.length; x++)
    {
      var fileObj = nlapiLoadFile(toPrint[x]); //10 Units
      var fileUrl = fileObj.getURL();

      fileUrl = DATA_CENTER_URL + fileUrl.replace(/&/g,"&amp;");

      //if(nlapiGetContext().getEnvironment()=="PRODUCTION")
      //	fileUrl = "https://system.na3.netsuite.com" + fileUrl.replace(/&/g,"&amp;");
      //else
      //	fileUrl = "https://system.sandbox.netsuite.com" + fileUrl.replace(/&/g,"&amp;");

      nlapiLogExecution("debug","File URL",fileUrl);

      xml+= "<pdf src='" + fileUrl + "' />";
    }

    xml+= "</pdfset>";

    var pdf = nlapiXMLToPDF(xml);

    for(var x=0; x < fulfillments.length; x++)
    {
      nlapiSubmitField("itemfulfillment",fulfillments[x],"custbody_fedex_label_printed","T");
    }

    response.setContentType("PDF","Shipping_Labels.pdf","inline");
    response.write(pdf.getValue());
  }
}

function getDataCenterURL()
{
  var environment = nlapiGetContext().getEnvironment();
  nlapiLogExecution('debug','environment',environment);

  var filters = [];
  filters.push(new nlobjSearchFilter("name",null,"is",environment));
  var cols = [];
  cols.push(new nlobjSearchColumn("custrecord_data_center_url"));
  var results = nlapiSearchRecord("customrecord_data_center_url",null,filters,cols);
  if(results)
    DATA_CENTER_URL = results[0].getValue("custrecord_data_center_url");
}