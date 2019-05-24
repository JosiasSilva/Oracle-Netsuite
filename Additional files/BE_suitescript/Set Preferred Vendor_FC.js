function setPreferredVendor_FC(custcol_cad_item,item)
{
  if(custcol_cad_item)
  {
    var fields = [];
    fields.push("custitem1");
    fields.push("custitem_cost_for_plat_ch_cad");
    fields.push("custitem_cost_for_18ky_ch_cad");
    fields.push("custitem_cost_for_18kw_ch_cad");
    fields.push("custitem_cost_for_plat_usny_cad");
    fields.push("custitem_cost_for_18ky_usny_cad");
    fields.push("custitem_cost_for_18kw_usny_cad");
    var rec = nlapiLookupField("item",item,fields);
    if(rec.custitem1=="3")
    {
      var usny = rec.custitem_cost_for_plat_usny_cad;
      var ch = rec.custitem_cost_for_plat_ch_cad;
      if(usny && ch)
      {
        usny = parseFloat(rec.custitem_cost_for_plat_usny_cad);
        ch = parseFloat(rec.custitem_cost_for_plat_ch_cad);

        if(usny > ch)
          return "153";
        else
          return "7773";
      }
    }
    else if(rec.custitem1=="2")
    {
      var usny = rec.custitem_cost_for_18ky_usny_cad;
      var ch = rec.custitem_cost_for_18ky_ch_cad;
      if(usny && ch)
      {
        usny = parseFloat(rec.custitem_cost_for_18ky_usny_cad);
        ch = parseFloat(rec.custitem_cost_for_18ky_ch_cad);

        if(usny > ch)
          return "153";
        else
          return "7773";
      }
    }
    else if(rec.custitem1=="1")
    {
      var usny = rec.custitem_cost_for_18kw_usny_cad;
      var ch = rec.custitem_cost_for_18kw_ch_cad;
      if(usny && ch)
      {
        usny = parseFloat(rec.custitem_cost_for_18kw_usny_cad);
        ch = parseFloat(rec.custitem_cost_for_18kw_ch_cad);

        if(usny > ch)
          return "153";
        else
          return "7773";
      }
    }
  }
  else
  {
    var pref = nlapiLookupField("item",item,"vendor");
    if(pref){return pref;}
  }
}
