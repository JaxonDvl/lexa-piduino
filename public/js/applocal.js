$(document).ready(function () {
    console.log("ready");
    getAppUsers();
    var $rfidwrapper = $("#rfid-status");
    var $rfidvalue = $("#card");
    $('#submit_btn').on('click', function () {
        var name = $('#name').val();
        var led = $('#leds input:checked').val();
        var id = $rfidvalue.val();
        // axios.post('/add_user', {
        //     name: name,
        //     led:led,
        //     id: id
        // });
        console.log('clicked submit', name, led);
    });
    // var socket = io.connect('http://raspberrydia.local:3000/');
    var socket = io.connect('http://127.0.0.1:3000/');

    socket.on('idscanned', function (data) {
        if (!data.cardid) {
            $rfidwrapper.html("Active Card");
            $rfidwrapper.css('color', 'green');
            data.cardid = data.cardid.split(' ').join('');
            $rfidvalue.val(data.cardid);
        } else {
            $rfidwrapper.html("Offline");
            $rfidwrapper.css('color', 'red');
            $rfidvalue.val("");

        }
    });
    function getAppUsers() {
        var $listwrapper = $("#auth-list");
        return axios.get('/get_users')
            .then(function (response) {
                for (var key in response["data"]) {
                    $listwrapper.append(`<li>${key}</li>`)
                }
            })

    }
});
