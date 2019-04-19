var data = { id: '123' };
jQuery.ajax({
    type: "GET",
    url: "/app/site/hosting/restlet.nl?script=2640&deploy=1",
    data: JSON.stringify(data),
    cache: false,
    dataType: 'json',
    success: function (data) {
        debugger; alert('success');

    },
    error: function () {
        alert("error");
    },
    beforeSend: function () {
    }
});