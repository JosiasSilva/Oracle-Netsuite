/**
 * Script Author 		: 	Anuj Kumar Verma(anuj.verma@inoday.com)
 * Author Desig. 		: 	Developer, Inoday Consultancy Pvt. Ltd.
 * FILE TYPE   			: 	JavaScript File
 * FILE NAME   			:	Email_IA_For_CYO_Earrings.js
 * Created Date  		: 	04-Apr-2018
 * Last Modified Date 	:
 * Comments 			: The script should recognize these orders by the Category of items on the sales order. The items on the sales order will be:Loose Diamond + Loose Diamond + Earrings
 * Suite Script URL 	: https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=454&whence=
 * File URL				: https://debugger.sandbox.netsuite.com/app/common/media/mediaitem.nl?id=22328720&whence=
 * File URL Production	:
 */

function Email_CYO_Earrings(order,currency,pages,email,today,xml,email_ia_for_earrings_pendants,isIABlockCode)
{
  var no_of_loose_diamond = 0;
  var earrings_cat = false;
  var setting_with_large_center_stone_cat = false;
  for(var u=0; u < order.getLineItemCount("item"); u++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",u+1),"custitem20");
    var itemId=order.getLineItemValue("item","item",u+1);
    if(category == 7)
    {
      no_of_loose_diamond  += 1;
    }
    if(category == 4)
    {
      earrings_cat = true;
    }
    if(category == 2)
      setting_with_large_center_stone_cat = true;
  }
  nlapiLogExecution("DEBUG","Number of Loose Diamond(s) for CYO Earrings",no_of_loose_diamond);
  nlapiLogExecution("DEBUG","Value of Earrings category(True/False)",earrings_cat);
  nlapiLogExecution("DEBUG","Value of Setting with large center stone category(True/False)  for CYO Earrings is :",setting_with_large_center_stone_cat);
  if(parseInt(no_of_loose_diamond) == 2 && earrings_cat == true && setting_with_large_center_stone_cat == false)
  {
    return Email_IA_CYO_Earrings(order,currency,pages,email,today,xml,email_ia_for_earrings_pendants,isIABlockCode);
  }
  else 
    return '';
}
function Email_IA_CYO_Earrings(order,currency,pages,email,today,xml,email_ia_for_earrings_pendants,isIABlockCode)
{
  var replacementAmount = 0.00;
  var cyo_earrings_pdf_arr = [];
  var cyo_earring_description ='';
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);
    if(category == 4)
    {
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));
      nlapiLogExecution("DEBUG","Replacement amount for earrings ",replacementAmount);
      cyo_earring_description = order.getLineItemValue("item","description",x+1);
      nlapiLogExecution("DEBUG","Earring Description",cyo_earring_description);
    }
    if(category==7)
    {
      //Setting with large center stone
      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
      var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
      var diamondID = "";
      var image = "";
      var gemstone = "";
      var gemstone_desc = "";
      var centerHeader = "DIAMOND";
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));
      nlapiLogExecution("debug","Replacement amount for diamond",replacementAmount);
      diamondID = order.getLineItemValue("item","item",x+1);
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);       
      var diamond = null;
      var dmdStoneId='';
      if(diamondID!="")
      {
        dmdStoneId=diamondID; 
        diamond = nlapiLookupField("item",diamondID,diamondFields,true);
        diamond.itemid = nlapiLookupField("item",diamondID,"itemid");
        diamond.custitem27 = nlapiLookupField("item",diamondID,"custitem27") + "ct";
        image += item["parent.itemid"] + "_" + diamond.custitem5.toLowerCase() + "_";
        //Only include is Origin = LAB GROWN or LAB CREATED
        if(diamond.custitem18!="Lab Grown" && diamond.custitem18!="Lab Created")
          diamond.custitem18 = "";
      }
      if(pages > 0)
        xml += "<pbr/>";
      if(diamond==null)
      {
        diamond = {
          custitem27 : "",
          custitem7  : "",
          custitem19 : "",
          custitem28 : "",
          custitem18 : ""
        };
      }
      var cutString = "";
      if(diamond.custitem5!=null && diamond.custitem5!="")
        cutString += diamond.custitem5;
      if(diamond.custitem28!=null && diamond.custitem28!="" && cutString!="")
        cutString += ", ";
      if(diamond.custitem28!=null && diamond.custitem28!="")
        cutString += diamond.custitem28;
      var center_section = "";
      if(diamond.custitem27!=null && diamond.custitem27!="")
        center_section = "T";
      if(cutString!=null && cutString!="")
        center_section = "T";
      if(diamond.custitem7!=null && diamond.custitem7!="")
        center_section = "T";
      if(diamond.custitem19!=null && diamond.custitem19!="")
        center_section = "T";
      var pdf = {
        //logo : nlapiEscapeXML("https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg"),
        title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_title"),
        date : formatDate(today),
        name : nlapiEscapeXML(nlapiLookupField("customer",order.getFieldValue("entity"),"altname")),
        address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
        city : nlapiEscapeXML(order.getFieldValue("billcity")),
        state : order.getFieldValue("billstate"),
        zipcode : order.getFieldValue("billzip"),
        type_of_jewelry : "One Pair's Earrings",
        carat :  diamond.custitem27,
        cut :  cutString,
        color : diamond.custitem7,
        clarity : diamond.custitem19,
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_disclaimer")),
        order_number : order.getFieldValue("tranid"),
        center_section : center_section,
        center_header : centerHeader
      };
      if(email)
        pdf.letterhead = "";
      else
        pdf.letterhead = "";
      nlapiLogExecution("DEBUG","PDF JSON",JSON.stringify(pdf));
      cyo_earrings_pdf_arr.push(pdf);
    }
  }
  if(pages==0)
  {
    if(email)
      xml += "<img align='center' src='https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>";
    else
      xml += "<div style='height: 60px;'> </div>";
  }
  nlapiLogExecution("DEBUG","Array having two diamond for cyo earrings pdf",JSON.stringify(cyo_earrings_pdf_arr));
  if(cyo_earrings_pdf_arr.length>0)
  {
    replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
    nlapiLogExecution("DEBUG","Total Replacement Amount",replacementAmount);
    //var  logo   			= cyo_earrings_pdf_arr[0].logo;
    var  title  			= cyo_earrings_pdf_arr[0].title;
    var  date   			= cyo_earrings_pdf_arr[0].date;
    var  name   			= cyo_earrings_pdf_arr[0].name;
    var  address1 			= cyo_earrings_pdf_arr[0].address1;
    var  city 				= cyo_earrings_pdf_arr[0].city;
    var  state 				= cyo_earrings_pdf_arr[0].state;
    var  zipcode 			= cyo_earrings_pdf_arr[0].zipcode;
    var  type_of_jewelry 	= cyo_earrings_pdf_arr[0].type_of_jewelry;
    var  carat 				= cyo_earrings_pdf_arr[0].carat;
    var  cut 				= cyo_earrings_pdf_arr[0].cut;
    var  color 				= cyo_earrings_pdf_arr[0].color;
    var  clarity 			= cyo_earrings_pdf_arr[0].clarity;
    var  disclaimer 		= cyo_earrings_pdf_arr[0].disclaimer;
    var  order_number 		= cyo_earrings_pdf_arr[0].order_number;
    var  center_section 	= cyo_earrings_pdf_arr[0].center_section;
    var  center_header 		= cyo_earrings_pdf_arr[0].center_header;
    var  carat_2 			= cyo_earrings_pdf_arr[1].carat;
    var  cut_2 				= cyo_earrings_pdf_arr[1].cut;
    var  color_2 			= cyo_earrings_pdf_arr[1].color;
    var  clarity_2 			= cyo_earrings_pdf_arr[1].clarity;
    var  center_section_2 	= cyo_earrings_pdf_arr[1].center_section;
    var  center_header_2 	= cyo_earrings_pdf_arr[1].center_header;

    var cyo_earrings_pdf_json_obj = {
      //logo 				: logo,
      title 			: title,
      date 				: date,
      name 				: name,
      address1 			: address1,
      city		 		: city,
      state 			: state,
      zipcode 			: zipcode,
      type_of_jewelry 	: type_of_jewelry,
      setting 			: cyo_earring_description,
      carat 			:  carat,
      cut 				:  cut,
      color 			: color,
      clarity 			: clarity,
      order_number 		: order_number,
      center_section 	: center_section,
      center_header 	: centerHeader,
      carat_2 			:  carat_2,
      cut_2 			:  cut_2,
      color_2 			: color_2,
      clarity_2 		: clarity_2,
      center_section_2 	: center_section_2,
      center_header_2 	: center_header_2,
      disclaimer 		: disclaimer,
      replacement_price : currency + " " + addCommas(replacementAmount)
    };
    nlapiLogExecution("DEBUG","CYO Earrings pdf json obj (stringify)",JSON.stringify(cyo_earrings_pdf_json_obj));
    xml += email_ia_for_earrings_pendants(cyo_earrings_pdf_json_obj);
  }
  nlapiGetContext().setSetting('SESSION','custpage_hIACode',isIABlockCode);
  xml += "</body></pdf>";
  nlapiLogExecution("DEBUG","Email IA xml for CYO Earrings",xml);
  return xml;
}