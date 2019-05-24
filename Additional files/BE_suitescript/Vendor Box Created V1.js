String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}


function GET_DATA(datain)
{
  if(datain.type=='new_record')
  {

    var send_data=JSON.stringify(datain.send_data);
    create_box_api(send_data);
    return true;
  }
  else if(datain.type=='old_record')
  {
    var send_data=JSON.stringify(datain.send_data);
    update_box_api(send_data);
    return true;

  }


}