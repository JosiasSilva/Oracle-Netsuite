function Field_Changed(type,name,line)
{
  if(type=="custpage_list" && name=="custpage_certificate_included")
  {
    try
    {
      var cert_label = {
        print : false,
        item : '',
        soid : '',
        qty : 0,
        vendor : '',
        vendor_id : ''
      };

      var vend_label = {
        print : false,
        item : '',
        poid : '',
        qty : 0,
        inscription : false,
        multi_diamond : false,
        vendor : ''
      };

      var cert_included = nlapiGetLineItemValue("custpage_list","custpage_certificate_included",line);

      if(cert_included==null || cert_included=='')
        return true;

      var zpl = '';

      if((cert_included=="2" && nlapiGetLineItemValue("custpage_list","custpage_diamond_in_hold_binder",line)=="T") || (cert_included=="1" && nlapiGetLineItemValue("custpage_list","custpage_diamond_in_hold_binder",line)=="F"))
      {
        //IF (CERT INCLUDED = NO and DIAMOND IN HOLD BINDER = T) OR (CERT INCLUDED = YES and DIAMOND IN HOLD BINDER = F)
        //Print 1 Copy of Diamond Certificate Label

        cert_label.print = true;
        cert_label.qty = 1;
        cert_label.item = nlapiGetLineItemValue("custpage_list","custpage_item_id",line);
        cert_label.soid = nlapiGetLineItemValue("custpage_list","custpage_so_id",line);
        cert_label.vendor = nlapiLookupField("vendor",nlapiGetLineItemValue("custpage_list","custpage_vendor",line),"companyname");
      }	  
      else if((cert_included=="1" && nlapiGetLineItemValue("custpage_list","custpage_diamond_in_hold_binder",line)=="T"))
      {
        //IF CERT INCLUDED = YES and DIAMOND IN HOLD BINDER = T
        //Print 2 Copies of Diamond Certificate Label

        cert_label.print = true;
        cert_label.qty = 2;
        cert_label.item = nlapiGetLineItemValue("custpage_list","custpage_item_id",line);
        cert_label.soid = nlapiGetLineItemValue("custpage_list","custpage_so_id",line);
        cert_label.vendor = nlapiLookupField("vendor",nlapiGetLineItemValue("custpage_list","custpage_vendor",line),"companyname");
      }


      if((nlapiGetLineItemValue("custpage_list","custpage_production_vendor_po",line)!=null && nlapiGetLineItemValue("custpage_list","custpage_production_vendor_po",line)!="" && nlapiGetLineItemValue("custpage_list","custpage_diamond_in_hold_binder",line)=="F"))
      {
        //IF PROD VENDOR PO != NULL and DIAMOND IN HOLD BINDER = F
        //Print 1 Copy of Vendor Box Label

        vend_label.print = true;
        vend_label.qty = 1;
        vend_label.item = nlapiGetLineItemValue("custpage_list","custpage_item_id",line);
        vend_label.poid = nlapiGetLineItemValue("custpage_list","custpage_production_vendor_po",line);
        vend_label.poid = vend_label.poid.substr(vend_label.poid.indexOf(">")+1);
        vend_label.poid = vend_label.poid.substring(0,vend_label.poid.indexOf("<"));
        vend_label.inscription = nlapiGetLineItemValue("custpage_list","custpage_diamond_inscription",line);
        var so_link_fld = nlapiGetLineItemValue("custpage_list","custpage_createdfrom",line);
        if(so_link_fld.indexOf("yellow")!=-1)
          vend_label.multi_diamond = true;
        else
          vend_label.multi_diamond = false;
        vend_label.vendor = nlapiGetLineItemValue("custpage_list","custpage_production_vendor",line);
      }

      //alert("Cert_Label: " + JSON.stringify(cert_label));
      //alert("Vend_Label: " + JSON.stringify(vend_label));

      if(cert_label.print==true)
      {
        if(cert_label.soid!=null && cert_label.soid!="")
        {
          var filters = [];
          filters.push(new nlobjSearchFilter("item",null,"is",cert_label.item));
          filters.push(new nlobjSearchFilter("internalid",null,"is",cert_label.soid));
          var cols = [];
          cols.push(new nlobjSearchColumn("tranid"));
          cols.push(new nlobjSearchColumn("entity"));
          cols.push(new nlobjSearchColumn("firstname","customer"));
          cols.push(new nlobjSearchColumn("lastname","customer"));
          cols.push(new nlobjSearchColumn("custbody110"));
          cols.push(new nlobjSearchColumn("custbody39"));
          cols.push(new nlobjSearchColumn("itemid","item"));
          cols.push(new nlobjSearchColumn("custitem27","item"));
          cols.push(new nlobjSearchColumn("custitem5","item"));
          cols.push(new nlobjSearchColumn("custitem7","item"));
          cols.push(new nlobjSearchColumn("custitem19","item"));
          cols.push(new nlobjSearchColumn("custitem46","item"));
          var results = nlapiSearchRecord("salesorder",null,filters,cols);
          if(results)
          {
            zpl+= '^XA\n';
            zpl+= '^FX\n';
            zpl+= '^CF0,30\n';
            zpl+= '^FO20,55^FD' + results[0].getValue("tranid") + '^FS\n';
            zpl+= '^FO20,100^FD' + results[0].getValue("firstname","customer") + " " + results[0].getValue("lastname","customer") + '^FS\n';
            zpl+= '^CFF,30\n';
            zpl+= '^FO20,140^FD' + results[0].getValue("custitem27","item") + ", " + results[0].getText("custitem5","item") + ", " + results[0].getText("custitem7","item") + ", " + results[0].getText("custitem19","item") + '^FS\n';
            zpl+= '^FO20,180^FD' + cert_label.vendor + '^FS\n';
            zpl+= '^FO20,220^FD' + results[0].getValue("custbody110") + '^FS\n';
            if(results[0].getValue("custbody39")!=null && results[0].getValue("custbody39")!="")
              zpl+= '^FO20,260^FDDrop Ship^FS\n';
            zpl+= '^CFA,15\n';
            zpl+= '^FX\n';
            zpl+= '^BY2,5,75\n';
            zpl+= '^FO50,300^BC^FD' + results[0].getValue("custitem46","item") + "^FS\n";
            zpl+= '\n';
            if(cert_label.qty > 1)
              zpl += '^PQ2\n';
            zpl+= '^XZ';
          }
        }
        else
        {
          //If no SO on CDP, use Memo stone label 
          var filters = [];
          filters.push(new nlobjSearchFilter("internalid",null,"is",cert_label.item));
          var cols = [];
          cols.push(new nlobjSearchColumn("itemid"));
          cols.push(new nlobjSearchColumn("custitem27"));
          cols.push(new nlobjSearchColumn("custitem5"));
          cols.push(new nlobjSearchColumn("custitem7"));
          cols.push(new nlobjSearchColumn("custitem19"));
          cols.push(new nlobjSearchColumn("custitem46"));
          var results = nlapiSearchRecord("item",null,filters,cols);
          if(results)
          {
            zpl+= '^XA\n';
            zpl+= '^CFF,35\n';
            zpl+= '^FO20,80^FD' + results[0].getValue("itemid") + '^FS\n';
            zpl+= '^FO20,140^FD' + results[0].getValue("custitem27") + ", " + results[0].getText("custitem5") + ", " + results[0].getText("custitem7") + ", " + results[0].getText("custitem19") + '^FS\n';
            zpl+= '^FO20,210^FD' + cert_label.vendor + '^FS\n';
            zpl+= '^BC80,75\n';
            zpl+= '^FO50,280^BC^FD' + results[0].getValue("custitem46") + "^FS\n";
            zpl+= '\n';
            if(cert_label.qty > 1)
              zpl += '^PQ2\n';
            zpl+= '^XZ';
          }
        }
      }

      if(vend_label.print==true)
      {
        var filters = [];
        filters.push(new nlobjSearchFilter("item",null,"is",vend_label.item));
        filters.push(new nlobjSearchFilter("internalid",null,"is",vend_label.poid));
        var cols = [];
        cols.push(new nlobjSearchColumn("tranid"));
        cols.push(new nlobjSearchColumn("entity"));
        cols.push(new nlobjSearchColumn("mainname"));
        cols.push(new nlobjSearchColumn("custbody110"));
        cols.push(new nlobjSearchColumn("custbody39"));
        cols.push(new nlobjSearchColumn("custcoldiamondinscription"));
        cols.push(new nlobjSearchColumn("itemid","item"));
        cols.push(new nlobjSearchColumn("custitem27","item"));
        cols.push(new nlobjSearchColumn("custitem5","item"));
        cols.push(new nlobjSearchColumn("custitem7","item"));
        cols.push(new nlobjSearchColumn("custitem19","item"));
        cols.push(new nlobjSearchColumn("custitem46","item"));
        cols.push(new nlobjSearchColumn("othervendor","item"));
        cols.push(new nlobjSearchColumn("custitem46","item"));
        cols.push(new nlobjSearchColumn("tranid","createdfrom"));
        var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
        if(results)
        {
          if(zpl!='')
            zpl += '\n\n';

          zpl+= '^XA\n';
          zpl+= '^CF0,40\n'
          zpl+= '^FO20,50^FD' + results[0].getValue("tranid","createdfrom") + "^FS\n";
          zpl+= '^CF0,45\n';
          zpl+= '^FO20,100^FD' + vend_label.poid + '^FS\n';
          zpl+= '^CFF,35\n';
          zpl+= '^FO20,150^FD' + vend_label.vendor + '^FS\n';
          zpl+= '^FO20,195^FD' + results[0].getValue("custitem27","item") + ", " + results[0].getText("custitem5","item") + ", " + results[0].getText("custitem7","item") + ", " + results[0].getText("custitem19","item") + '^FS\n';
          zpl+= '^FO20,235^FDCert # ' + results[0].getValue("custitem46","item") + "^FS\n";
          zpl+= '^FO20,275^FDInscrption: ';
          if(vend_label.inscription=='T')
            zpl+= 'Yes'; 
          else
            zpl+= 'No';
          zpl+= '^FS\n';
          zpl+= '^FO20,315^FDLouped^FS\n';
          if(vend_label.multi_diamond==true)
            zpl+= '^FO150,355^FD1 of 2^FS\n';
          zpl+= '^XZ';
        }
      }

      if(zpl!='')
      {
        //Save file for debugging purposes only
        var zplRecord = nlapiCreateRecord("customrecord_zpl_label_holder");
        zplRecord.setFieldValue("custrecord_zpl_filename",nlapiGetLineItemValue("custpage_list","custpage_stock_number_text",line) + ".zpl");
        nlapiLogExecution("debug","File Name",nlapiGetLineItemText("custpage_list","custpage_stock_number_text",line) + ".zpl");
        zplRecord.setFieldValue("custrecord_zpl_data",zpl);
        var zplRecordId = nlapiSubmitRecord(zplRecord,true,true);

        //var zplFile = nlapiCreateFile(results[0].getValue("itemid","item") + ".zpl","PLAINTEXT",zpl);
        //zplFile.setFolder("10842471");
        //var fileID = nlapiSubmitFile(zplFile);

        var url = nlapiResolveURL("SUITELET","customscript_diamond_rcv_db_label_print","customdeploy_diamond_rcv_db_label_print") + "&fileid=" + zplRecordId;

        var newWin = window.open(url,"printWin","width=400,height=400");
        setTimeout(function(){ newWin.close(); }, 5000);

        //Write file back to user so they can open and print
        //response.setContentType("PLAINTEXT",results[0].getValue("itemid","item")+".zpl","attachment");
        //response.write(zplFile.getValue());
      }
    }
    catch(err)
    {
      alert("Error Creating Labels: " + err.message);
    }
  }
  else if(type=="custpage_list" && name=="custpage_rfid")
  {
    //IF RFID is Checked, Send print request for RFID tag
    if(nlapiGetLineItemValue("custpage_list","custpage_rfid",line)=="T")
    {
      var itemRec = nlapiLoadRecord("inventoryitem",nlapiGetLineItemValue("custpage_list","custpage_item_id",line));

      //alert("Item ID: " + nlapiGetLineItemValue("custpage_list","custpage_item_id",line));

      var filters = [];
      filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetLineItemValue("custpage_list","custpage_item_id",line)));
      var cols = [];
      cols.push(new nlobjSearchColumn("custitem20"));
      cols.push(new nlobjSearchColumn("parent"));
      cols.push(new nlobjSearchColumn("custitem1"));
      cols.push(new nlobjSearchColumn("custitem2"));
      cols.push(new nlobjSearchColumn("custitem_rfid_description"));
      cols.push(new nlobjSearchColumn("custitem64"));
      cols.push(new nlobjSearchColumn("custitem200"));
      cols.push(new nlobjSearchColumn("custitem202"));
      cols.push(new nlobjSearchColumn("custitem201"));
      cols.push(new nlobjSearchColumn("custitem46"));
      cols.push(new nlobjSearchColumn("custitem18"));
      cols.push(new nlobjSearchColumn("custitem7"));
      cols.push(new nlobjSearchColumn("upccode"));
	  cols.push(new nlobjSearchColumn("custitem63"));
      var results = nlapiSearchRecord("item",null,filters,cols);
      if(results)
      {
        var category = results[0].getValue("custitem20");

        var upccode = results[0].getValue("upccode");
        if(upccode!=null && upccode!="")
          upccode = upccode.toUpperCase();

        //alert("Handled UPC value");
		
		//Retrieve current counter variable
		var counter = nlapiLookupField("customrecord_item_label_counter","1","name");
		nlapiLogExecution("audit","Counter pull from custom record",counter);

        var itemData = {
          parent : results[0].getText("parent"),
          custitem1 : results[0].getText("custitem1"),
          custitem2 : results[0].getText("custitem2"),
          custitem_rfid_description : results[0].getValue("custitem_rfid_description"),
          custitem64 : results[0].getText("custitem64"),
          custitem200 : results[0].getText("custitem200"),
          custitem202 : results[0].getText("custitem202"),
          custitem201 : results[0].getText("custitem201"),
          custitem46 : results[0].getValue("custitem46"),
          custitem18 : results[0].getText("custitem18"),
          custitem7 : results[0].getText("custitem7"),
          upccode : upccode,
		  counter : counter,
		  upccounter : upccode.concat(counter),
          custitem63 : results[0].getValue("custitem63")
        }

        //alert("Built Object");
        }

      var printer = null;
      var label = null;

      var filters = [];
      filters.push(new nlobjSearchFilter("custrecord_prlm_item_category",null,"is",category));
      var cols = [];
      cols.push(new nlobjSearchColumn("custrecord_prlm_label"));
      cols.push(new nlobjSearchColumn("custrecord_prlm_printer"));
      var results = nlapiSearchRecord("customrecord_print_request_label_mapping",null,filters,cols);
      if(results)
      {
        printer = results[0].getValue("custrecord_prlm_printer");
        label = results[0].getValue("custrecord_prlm_label");
      }

      //alert("Retrieved search results")

      var printRequest = nlapiCreateRecord("customrecord_rfs_print_request",{recordmode:"dynamic"});
      printRequest.setFieldValue("custrecord_rfs_print_request_printer",printer); //Printer Name (RFID Printer - 9th Floor)
      printRequest.setFieldValue("custrecord_rfs_print_request_function","8"); //Function (Item Lookup)
      printRequest.setFieldValue("custrecord_rfs_print_request_status","1"); //Status
      printRequest.setFieldValue("custrecord_rfs_print_request_qty","1"); //Quantity
      printRequest.setFieldValue("custrecord_rfs_print_request_data",JSON.stringify(itemData)); //Print Data
      printRequest.setFieldValue("custrecord_rfs_print_request_rec_type","inventoryitem"); //Record Type
      printRequest.setFieldValue("custrecord_rfs_print_request_rec_id",nlapiGetLineItemValue("custpage_list","custpage_item_id",line)); //Record Id
      printRequest.setFieldValue("custrecord_rfs_print_request_label",label); //Label
      var printRequestId = nlapiSubmitRecord(printRequest,true,true);
	  
	  	//Update counter
		counter = parseInt(counter,10);
		nlapiLogExecution("audit","Counter after parseInt",counter);
		
		counter++;
		nlapiLogExecution("audit","Counter after incrementing by 1",counter);
		
		counter = pad(counter,16);
		nlapiLogExecution("audit","Counter after padding zeros (this will be saved)",counter);
		
		nlapiSubmitField("customrecord_item_label_counter","1","name",counter);
    }
  }
}

function Save_Validate()
{
  var ValueChk=true;
  for(var x=1; x <= nlapiGetLineItemCount ( 'custpage_list') ; x++)
  {
    if(nlapiGetLineItemValue('custpage_list', 'custpage_changed', x) =="T")
    {
      ValueChk=false;
      break;
    }
    if(nlapiGetLineItemValue('custpage_list', 'custpage_recive_check', x) =="T")
    {
      ValueChk=false;
      break;
    }
  }
  if(ValueChk)
  {
    //alert('Please select at least one record to update / receive');
    alert('Please select at least one record to receive check box');
    return false;
  }


  var value_certificate_included=false;
  for(var x=1; x <= nlapiGetLineItemCount ( 'custpage_list') ; x++)
  {
    if(nlapiGetLineItemValue('custpage_list', 'custpage_recive_check', x) =="T" && (nlapiGetLineItemValue('custpage_list', 'custpage_certificate_included', x) =="" || nlapiGetLineItemValue('custpage_list', 'custpage_certificate_included', x)==null) )
    {
      value_certificate_included=true;
      break;
    }


  }
  if(value_certificate_included)
  {
    alert('Please select a value for certificate included for checked record');
    return false;
  }

  if(nlapiGetFieldValue('custpage_stone_received_by')==null || nlapiGetFieldValue('custpage_stone_received_by')=='')
  {
    alert('Please select a value for the list Stone Received By');
    return false;
  }



  return true;

}

function Search()
{

  window.onbeforeunload = null;
  var linkURL = nlapiResolveURL('SUITELET', 'customscript_diamond_dashboard_v2','customdeploy_diamond_dashboard_v2',   'internal');
  linkURL=linkURL +'&custpage_search_vendor='+ nlapiGetFieldValue('custpage_search_vendor');
  linkURL=linkURL +'&custpage_form_date='+ nlapiGetFieldValue('custpage_form_date');
  window.open(linkURL,"_self");
}
function PageInit()
{
  jQuery('input[name^="custpage_colour_flag"]').each(function(){
    //alert("FieldValue" + )
    if(jQuery(this).val()=="1")
    {
      jQuery(this).parent().parent().children().each(function(){
        jQuery(this).style('background-color','#f9a47a','important');
      });
    }
  });

  jQuery('input[name^="custpage_colour_flag_dd_of_following_day"]').each(function(){
    //alert("FieldValue" + )
    if(jQuery(this).val()=="1")
    {
      jQuery(this).parent().parent().children().each(function(){
        jQuery(this).style('background-color','#ff0000','important');
      });
    }
  });
  jQuery('#custpage_list_splits').append('<td class="tinytext" align="center" style="padding-top:10px" colspan="21"><span style="background-color:#ff0000;color:#000000">Delivery Date Tomorrow</span></td>');


}

(function($) {    
  if ($.fn.style) {
    return;
  }

  // Escape regex chars with \
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority != '') {
        // Add priority manually
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                              '(\\s*;)?', 'gmi');
        this.cssText =
          this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                            'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
      return this;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
      if (typeof value != 'undefined') {
        // Set style property
        priority = typeof priority != 'undefined' ? priority : '';
        style.setProperty(styleName, value, priority);
        return this;
      } else {
        // Get style property
        return style.getPropertyValue(styleName);
      }
    } else {
      // Get CSSStyleDeclaration
      return style;
    }
  };
})(jQuery);

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}