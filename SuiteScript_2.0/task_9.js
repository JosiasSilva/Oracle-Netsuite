/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/search', 'N/url', 'N/record', 'N/https'],
       function (currentRecord, search, url, record, https) {
  function pageInit(scriptContext) {

    window.addEventListener('DOMContentLoaded', function() {
      var data = { id: '000' };
      jQuery.ajax({
        type: "GET",
        url: "/app/site/hosting/restlet.nl?script=2681&deploy=1",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        cache: false,
        dataType: 'json',
        success: function (data) {
          console.log(JSON.parse(data));
        },
        error: function () {
          alert("error");
        },
        beforeSend: function () {
        }
      });

    });



  }


  return {
    pageInit: pageInit
  }

});