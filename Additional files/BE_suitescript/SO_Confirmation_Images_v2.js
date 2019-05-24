function SO_Confirmation_Images(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var images = [];
			var order = nlapiGetNewRecord();
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				nlapiSelectLineItem("item",x+1);
				nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation","");
				nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan","");
				nlapiSetCurrentLineItemValue("item","custcol_image_group","");
				nlapiCommitLineItem("item");
			}
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var item = order.getLineItemValue("item","item",x+1);
				var center_gem = order.getLineItemValue("item","custcol_center_gem_item",x+1);
				var image = order.getLineItemValue("item","custcol_image_url",x+1);
				var index = x;
				
				if(image!=null && image!="")
				{
					var add = 0;
					
					/*
					if((x+1) < order.getLineItemCount("item") && order.getLineItemValue("item","item",x+2)=="1093360")
					{
						add = 2;
					}
					*/
					
					//Determine which row should use image and the span of the rows
					if(center_gem!=null && center_gem!="")
					{
						for(var i=0; i < order.getLineItemCount("item"); i++)
						{
							if(order.getLineItemValue("item","item",i+1) == center_gem)
							{
								if(order.getLineItemValue("item","custcol_image_url",i+1)!=null && order.getLineItemValue("item","custcol_image_url",i+1)!="")
								{
									nlapiSelectLineItem("item",x+1);
									nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation",image);
									nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan",2+add);
									nlapiSetCurrentLineItemValue("item","custcol_image_group",(x+1));
									nlapiCommitLineItem("item");
								}
								else
								{
									if(i < x)
									{
										images.push({
											item : order.getLineItemValue("item","item",i+1),
											line : (i+1),
											rowspan : 2+add,
											image : image,
											item_group : (x+1)
										});
										
										nlapiSelectLineItem("item",x+1);
										nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation","X");
										nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan","X");
										nlapiSetCurrentLineItemValue("item","custcol_image_group",(x+1));
										nlapiCommitLineItem("item");
									}
									else
									{
										images.push({
											item : item,
											line : (x+1),
											rowspan : 2+add,
											image : image,
											item_group : (x+1)
										});
										
										nlapiSelectLineItem("item",i+1);
										nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation","X");
										nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan","X");
										nlapiSetCurrentLineItemValue("item","custcol_image_group",(x+1));
										nlapiCommitLineItem("item");
									}
								}
							}
						}
					}
					else if(item!="1093360" && item!="39300")
					{
						if(order.getLineItemValue("item","custcol_item_image_for_confirmation",x+1)==null || order.getLineItemValue("item","custcol_item_image_rowspan",x+1)=="")
						{
							nlapiSelectLineItem("item",x+1);
							nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation",image);
							nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan",2+add);
							nlapiSetCurrentLineItemValue("item","custcol_image_group",(x+1));
							nlapiCommitLineItem("item");
						}
					}
					else if(item=="1093360" || item=="39300")
					{
						nlapiSelectLineItem("item",x+1);
						nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation","");
						nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan","2");
						nlapiSetCurrentLineItemValue("item","custcol_image_group",(x+1));
						nlapiCommitLineItem("item");
					}
				}
				else if(item=="1093360" || item=="39300")
				{
					nlapiSelectLineItem("item",x+1);
					nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation","");
					nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan","2");
					nlapiSetCurrentLineItemValue("item","custcol_image_group",(x+1));
					nlapiCommitLineItem("item");
				}
			}
			
			for(var x=0; x < images.length; x++)
			{
				nlapiSelectLineItem("item",images[x].line);
				nlapiSetCurrentLineItemValue("item","custcol_item_image_for_confirmation",images[x].image);
				nlapiSetCurrentLineItemValue("item","custcol_item_image_rowspan",parseInt(images[x].rowspan * 2));
				nlapiSetCurrentLineItemValue("item","custcol_image_group",images[x].item_group);
				nlapiCommitLineItem("item");
			}
			
			var noImages = true;
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				if(order.getLineItemValue("item","custcol_item_image_for_confirmation",x+1)!=null && order.getLineItemValue("item","custcol_item_image_for_confirmation",x+1)!="")
				{
					noImages = false;
					break;
				}
			}
			
			if(noImages)
			{
				nlapiSetFieldValue("custbody_no_images","T",true,true);
			}
			else
			{
				nlapiSetFieldValue("custbody_no_images","F",true,true);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Storing Image Printing Data","Details: " + err.message);
		}
	}
}
