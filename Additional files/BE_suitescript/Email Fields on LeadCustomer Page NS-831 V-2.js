nlapiLogExecution("audit","FLOStart",new Date().getTime());
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
function Update_Email()
{
  try
  {
    var message_record=nlapiLoadRecord('message',nlapiGetRecordId ( )); 
    var entity_id=message_record.getFieldValue('entity');
    if(entity_id)
    {
      var search_entity=nlapiSearchRecord('entity',null,new nlobjSearchFilter('internalid',null,'anyof',entity_id));
      if(search_entity)
      {
        var get_record_type=search_entity[0].getRecordType();
        if(get_record_type=='customer' || get_record_type=='lead' || get_record_type=='prospect')
        {
          var last_email_recipient=message_record.getFieldValue('recipientemail');
          last_email_recipient=last_email_recipient.replaceAll(',',',\n');
          var last_email_from_customer_boady=message_record.getFieldValue('message');
          var subject=message_record.getFieldValue('subject');
          if(subject)
          {
            subject=subject.toLowerCase();
          }
          var recipient=message_record.getFieldValue('recipient'); // if recipient value get so this is BE user
          var author=message_record.getFieldValue('author');
          var authoremail=message_record.getFieldValue('authoremail');
          var date_time_last_email=message_record.getFieldValue('lastmodifieddate');
          var split_data=date_time_last_email.split(' ');
          var get_time=split_data[1].split(':');
          for(var a=0;a<get_time.length;a++)
          {
            var get_value_length=get_time[a].length;
            if(get_value_length==1){ get_time[a]="0"+get_time[a];}
          }

          if(get_time.length==2)
          {
            get_time.push('00');
          }
          split_data[1]=get_time.join(':');
          date_time_last_email=split_data.join(' ');
          if(last_email_from_customer_boady)
          {
            var index_next_boady= last_email_from_customer_boady.indexOf('<strong>From:');
            if(index_next_boady!=-1)
            {
              last_email_from_customer_boady=last_email_from_customer_boady.substring(0,index_next_boady);
              last_email_from_customer_boady=last_email_from_customer_boady.replaceAll('\r\n<hr />','');
            }
            var first_index=last_email_from_customer_boady.indexOf('<BODY');
            if(first_index==-1){first_index=last_email_from_customer_boady.indexOf('<body');}
            var last_index=last_email_from_customer_boady.indexOf('</BODY');
            if(last_index==-1){last_index=last_email_from_customer_boady.indexOf('</body');}
            if(first_index!=-1 && last_index!=-1)
            {
              last_email_from_customer_boady=last_email_from_customer_boady.substring(first_index,last_index);
              var close_body_index=last_email_from_customer_boady.indexOf('>');
              if(close_body_index>=0)
              {
                first_index=close_body_index+1;
              }
              last_email_from_customer_boady=last_email_from_customer_boady.substring(first_index);
            }

          }
          var customer_reply_status='';
          var email_status='';
          if(last_email_recipient.indexOf('@brilliantearth.com')>=0)
          {
            recipient='@brilliantearth.com';
          }
          else if(authoremail.indexOf('@brilliantearth.com')>=0)
          {
            author='@brilliantearth.com';
          }
          if(author==entity_id)
          {
            author='';
          }
          else if(recipient==entity_id)
          {
            recipient='';
          }
          if(recipient && !author)
          {
            customer_reply_status="Not replied";
          }
          else if(author && !recipient && subject.indexOf('re:')>=0)
          {
            customer_reply_status="Replied";
          }  

          if(recipient && !author)
          {
            email_status="1";
          }
          nlapiSubmitField ( get_record_type , entity_id,
                            ['custentity_date_time_last_email','custentity_last_email_recipient','custentity_last_email_from_customer','custentity_customer_reply_status','custentity_email_status'] ,
                            [date_time_last_email,last_email_recipient,last_email_from_customer_boady,customer_reply_status,email_status]) ;
        }
      }
    }
  }
  catch(er)
  {

  }

}