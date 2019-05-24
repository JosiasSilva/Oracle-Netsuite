function rtnNewMeleeItemTable_Temp(meleeResult,newTempTable,accentText)
{
  nlapiLogExecution("DEBUG","Accent Text(for IA)",accentText);
  if(accentText !='' && accentText!= null)
  {
    var temp_accentText = accentText.split('\n');
    var IA_Array =[];
    for(var y=0; y<temp_accentText.length; y++)
    {
      var line = temp_accentText[y].split(":");
      if(line[0].toLowerCase()=="treatment")
        continue;
      //if(line[0].toLowerCase()=="gemstone")
      //continue;
      if(line[0].toLowerCase()=="number of gemstones")
        continue;
      if(line[0].toLowerCase()=="minimum total carats")
        continue;
      var l1 = line[0];
      var l2 = line[1]

      if(l1 =="Gemstone")
        IA_Array.push({
          "Gemstone":line[1]
        });

      if(l1 == "Shape")     
        IA_Array.push({
          "Shape":line[1]
        });

      if(l1 == "Setting type")
        IA_Array.push({
          "Setting_type":line[1]
        });

      if(l1 == "Color")
        IA_Array.push({
          "Color":line[1]
        });

      if(l1 == "Clarity")
        IA_Array.push({
          "Clarity":line[1]
        });
    }

    nlapiLogExecution("DEBUG","Gemstone Section Info for IA",JSON.stringify(IA_Array));
    var color_baguette ='';
    var clarity_baguette ='';
    var setting_type_baguette='';

    var color_round ='';
    var clarity_round ='';
    var setting_type_round='';

    var color_marquise ='';
    var clarity_marquise ='';
    var setting_type_marquise='';

    var color_princess ='';
    var clarity_princess ='';
    var setting_type_princess='';

    var color_cushion ='';
    var clarity_cushion ='';
    var setting_type_cushion='';

    var color_oval ='';
    var clarity_oval ='';
    var setting_type_oval='';

    var color_emerald ='';
    var clarity_emerald ='';
    var setting_type_emerald='';

    var color_asscher ='';
    var clarity_asscher ='';
    var setting_type_asscher='';

    var color_radiant ='';
    var clarity_radiant ='';
    var setting_type_radiant='';

    var color_pear ='';
    var clarity_pear ='';
    var setting_type_pear='';

    var color_heart ='';
    var clarity_heart ='';
    var setting_type_heart='';

    var shape ='';
    var marquise_continue = false;
    var baguette_continue = false;
    var round_continue = false;
    var princess_continue = false;
    var cushion_continue = false;
    var oval_continue = false;
    var emerald_continue = false;
    var asscher_continue = false;
    var radiant_continue = false;
    var pear_continue = false;
    var heart_continue = false;
    var round_gemstone ='';
    var marquise_gemstone ='';
    var baguette_gemstone ='';
    var princess_gemstone ='';
    var cushion_gemstone ='';
    var oval_gemstone ='';
    var emerald_gemstone ='';
    var asscher_gemstone ='';
    var radiant_gemstone ='';
    var pear_gemstone ='';
    var heart_gemstone ='';
    var gemstone ='';
    for(var t=0 ; t<IA_Array.length; t++)
    {
      var temp_gemstone =  IA_Array[t].Gemstone;
      if(temp_gemstone !=null)
      {
        gemstone = temp_gemstone.replace(/[\r]+/g, '');
        gemstone = gemstone.trim();
      }
      var temp_shape =  IA_Array[t].Shape;
      if(temp_shape != null)
      {
        shape = temp_shape.replace(/[\r]+/g, '');
        shape = shape.trim();
      }
      // For Baguette
      if(shape == "Baguette")
      {
        if(baguette_continue ==false)
        {
          if(gemstone !='')
            baguette_gemstone = gemstone ;
          baguette_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Baguette")
        {
          if(setting_type_baguette =='')
          {
            setting_type_baguette =  IA_Array[t].Setting_type;
            setting_type_baguette = setting_type_baguette.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Baguette")
        {
          if(color_baguette =='')
          {
            color_baguette =  IA_Array[t].Color;
            color_baguette = color_baguette.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Baguette")
        {
          if(clarity_baguette =='')
          {
            clarity_baguette=  IA_Array[t].Clarity;
            clarity_baguette = clarity_baguette.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Round
      if(shape == "Round")
      {
        if(round_continue ==false)
        {
          if(gemstone !='')
            round_gemstone = gemstone ;
          round_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Round")
        {
          if(setting_type_round =='')
          {
            setting_type_round =  IA_Array[t].Setting_type;
            setting_type_round = setting_type_round.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Round")
        {
          if(color_round =='')
          {
            color_round =  IA_Array[t].Color;
            color_round = color_round.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Round")
        {
          if(clarity_round =='')
          {
            clarity_round=  IA_Array[t].Clarity;
            clarity_round = clarity_round.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Marquise
      if(shape == "Marquise")
      {
        if(marquise_continue ==false)
        {
          if(gemstone !='')
            marquise_gemstone = gemstone ;
          marquise_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Marquise")
        {
          if(setting_type_marquise =='')
          {
            setting_type_marquise =  IA_Array[t].Setting_type;
            setting_type_marquise = setting_type_marquise.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Marquise")
        {
          if(color_marquise =='')
          {
            color_marquise =  IA_Array[t].Color;
            color_marquise = color_marquise.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Marquise")
        {
          if(clarity_marquise =='')
          {
            clarity_marquise =  IA_Array[t].Clarity;
            clarity_marquise = clarity_marquise.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Princcess
      if(shape == "Princess")
      {
        if(princess_continue ==false)
        {
          if(gemstone !='')
            princess_gemstone = gemstone ;
          princess_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Princess")
        {
          if(setting_type_princess  =='')
          {
            setting_type_princess  =  IA_Array[t].Setting_type;
            setting_type_princess  = setting_type_princess.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Princess")
        {
          if(color_princess  =='')
          {
            color_princess  =  IA_Array[t].Color;
            color_princess  = color_princess.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Princess")
        {
          if(clarity_princess  =='')
          {
            clarity_princess  =  IA_Array[t].Clarity;
            clarity_princess  = clarity_princess.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      //  For Cushion
      if(shape == "Cushion")
      {
        if(cushion_continue ==false)
        {
          if(gemstone !='')
            cushion_gemstone = gemstone ;
          cushion_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Cushion")
        {
          if(setting_type_cushion  =='')
          {
            setting_type_cushion  =  IA_Array[t].Setting_type;
            setting_type_cushion  = setting_type_cushion.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Cushion")
        {
          if(color_cushion  =='')
          {
            color_cushion  =  IA_Array[t].Color;
            color_cushion  = color_cushion.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Cushion")
        {
          if(clarity_cushion  =='')
          {
            clarity_cushion  =  IA_Array[t].Clarity;
            clarity_cushion  = clarity_cushion.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Oval
      if(shape == "Oval")
      {
        if(oval_continue ==false)
        {
          if(gemstone !='')
            oval_gemstone = gemstone ;
          oval_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Oval")
        {
          if(setting_type_oval  =='')
          {
            setting_type_oval  =  IA_Array[t].Setting_type;
            setting_type_oval  = setting_type_oval.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Oval")
        {
          if(color_oval  =='')
          {
            color_oval  =  IA_Array[t].Color;
            color_oval  = color_oval.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Oval")
        {
          if(clarity_oval  =='')
          {
            clarity_oval  =  IA_Array[t].Clarity;
            clarity_oval  = clarity_oval.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Emerald
      if(shape == "Emerald")
      {
        if(emerald_continue ==false)
        {
          if(gemstone !='')
            emerald_gemstone = gemstone ;
          emerald_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Emerald")
        {
          if(setting_type_emerald  =='')
          {
            setting_type_emerald  =  IA_Array[t].Setting_type;
            setting_type_emerald  = setting_type_emerald.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Emerald")
        {
          if(color_emerald  =='')
          {
            color_emerald  =  IA_Array[t].Color;
            color_emerald  = color_emerald.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Emerald")
        {
          if(clarity_emerald  =='')
          {
            clarity_emerald  =  IA_Array[t].Clarity;
            clarity_emerald  = clarity_emerald.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Asscher
      if(shape == "Asscher")
      {
        if(asscher_continue ==false)
        {
          if(gemstone !='')
            asscher_gemstone = gemstone ;
          asscher_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Asscher")
        {
          if(setting_type_asscher  =='')
          {
            setting_type_asscher  =  IA_Array[t].Setting_type;
            setting_type_asscher  = setting_type_asscher.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Asscher")
        {
          if(color_asscher  =='')
          {
            color_asscher  =  IA_Array[t].Color;
            color_asscher  = color_asscher.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Asscher")
        {
          if(clarity_asscher  =='')
          {
            clarity_asscher  =  IA_Array[t].Clarity;
            clarity_asscher  = clarity_asscher.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Radiant
      if(shape == "Radiant")
      {
        if(radiant_continue ==false)
        {
          if(gemstone !='')
            radiant_gemstone = gemstone ;
          radiant_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Radiant")
        {
          if(setting_type_radiant  =='')
          {
            setting_type_radiant  =  IA_Array[t].Setting_type;
            setting_type_radiant  = setting_type_radiant.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Radiant")
        {
          if(color_radiant  =='')
          {
            color_radiant  =  IA_Array[t].Color;
            color_radiant  = color_radiant.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Radiant")
        {
          if(clarity_radiant  =='')
          {
            clarity_radiant  =  IA_Array[t].Clarity;
            clarity_radiant  = clarity_radiant.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Pear
      if(shape == "Pear")
      {
        if(pear_continue ==false)
        {
          if(gemstone !='')
            pear_gemstone = gemstone ;
          pear_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Pear")
        {
          if(setting_type_pear  =='')
          {
            setting_type_pear  =  IA_Array[t].Setting_type;
            setting_type_pear  = setting_type_pear.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Pear")
        {
          if(color_pear  =='')
          {
            color_pear  =  IA_Array[t].Color;
            color_pear  = color_pear.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Pear")
        {
          if(clarity_pear  =='')
          {
            clarity_pear  =  IA_Array[t].Clarity;
            clarity_pear  = clarity_pear.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      // For Heart
      if(shape == "Heart")
      {
        if(heart_continue ==false)
        {
          if(gemstone !='')
            heart_gemstone = gemstone ;
          heart_continue = true;
          continue;
        }
      }
      if(IA_Array[t].Setting_type !=null)
      {
        if(shape == "Heart")
        {
          if(setting_type_heart  =='')
          {
            setting_type_heart  =  IA_Array[t].Setting_type;
            setting_type_heart  = setting_type_heart.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Color !=null)
      {
        if(shape == "Heart")
        {
          if(color_heart  =='')
          {
            color_heart  =  IA_Array[t].Color;
            color_heart  = color_heart.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
      if(IA_Array[t].Clarity != null)
      {
        if(shape == "Heart")
        {
          if(clarity_heart  =='')
          {
            clarity_heart  =  IA_Array[t].Clarity;
            clarity_heart  = clarity_heart.replace(/[\r]+/g, '');
            continue;
          }
        }
      }
    }
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (GemStone)(round)",round_gemstone);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (color)(round)",color_round );
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (clarity)(round)",clarity_round );
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (Setting type)(round)",setting_type_round);

    nlapiLogExecution("DEBUG","IA Gemstone Section Info (GemStone)(marquise)",marquise_gemstone);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (color)(marquise)",color_marquise);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (clarity)(marquise)",clarity_marquise);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (Setting type)(marquise)",setting_type_marquise);

    nlapiLogExecution("DEBUG","IA Gemstone Section Info (GemStone)(baguette)",baguette_gemstone);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (color)(baguette)",color_baguette);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (clarity)(baguette)",clarity_baguette);
    nlapiLogExecution("DEBUG","IA Gemstone Section Info (Setting type)(baguette)",setting_type_baguette);

    if(meleeResult[0].roundMeleeShape=='1')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + round_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_round + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_round + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_round + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].princess_meleeShape=='2')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + princess_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].princess_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_princess + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_princess + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_princess + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].cushion_meleeShape=='3')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + cushion_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].cushion_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_cushion + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_cushion + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_cushion  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].oval_meleeShape=='4')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + oval_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].oval_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_oval + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_oval  + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_oval  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].emerald_meleeShape=='5')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + emerald_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].emerald_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_emerald + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_emerald  + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_emerald  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].asscher_meleeShape=='6')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + asscher_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].asscher_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_asscher + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_asscher  + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_asscher  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].radiant_meleeShape=='7')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + radiant_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].radiant_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_radiant + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_radiant  + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_radiant  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].pear_meleeShape=='8')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + pear_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].pear_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_pear + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_pear  + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_pear  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].marquise_meleeShape=='9')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + marquise_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].marquise_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_marquise + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_marquise + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_marquise + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].heart_meleeShape=='10')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + heart_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].heart_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_heart + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_heart  + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_heart  + "</td>";
      newTempTable += "</tr>";
    }
    if(meleeResult[0].Baguette_meleeShape=='11')
    {
      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Gemstone:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + baguette_gemstone +"</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].Baguette_meleeShapeText + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].Baguette_totalMeleeCount + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
      newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].Baguette_totalMeleeCarat + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Setting type:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + setting_type_baguette + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
      //newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].Baguette_MeleeColor + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + color_baguette + "</td>";
      newTempTable += "</tr>";

      newTempTable += "<tr>";
      newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
      // newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].Baguette_MeleeClarity + "</td>";
      newTempTable += "<td class='freightDispPro pt10'>" + clarity_baguette + "</td>";
      newTempTable += "</tr>";
    }
  }
  return newTempTable;
}
