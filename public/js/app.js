$(document).ready(function () {
    console.log("ready");
    getAppUsers();
    var $rfidwrapper = $("#rfid-status");
    var $rfidvalue = $("#card");
    $('#submit_btn').on('click', function () {
        var name = $('#name').val();
        var password = $('#password').val();
        var id = $rfidvalue.val();
        axios.post('/add_user', {
            name: name,
            password: password,
            id: id
        });
        console.log('clicked submit', name, password);
    });
    var socket = io.connect('http://192.168.0.105:5000');

    socket.on('idscanned', function (data) {
        if (data.cardid.substring(0, 4) === "LOFF") {

            $rfidwrapper.html("Offline");
            $rfidwrapper.css('color', 'red');
            $rfidvalue.val("");
        } else {

            $rfidwrapper.html("Active Card");
            $rfidwrapper.css('color', 'green');
            data.cardid = data.cardid.split(' ').join('');
            $rfidvalue.val(data.cardid);
            console.log(data.cardid.split(''));
        }
    });
    function getAppUsers(){
     var $listwrapper = $("#auth-list");
        return axios.get('/get_users')
        .then(function(response){
            for(var key in response["data"]){
                $listwrapper.append(`<li>${key}</li>`)
            }
        })
        
    }
    // function getUserAccount(userid) {
    //     return axios.get('/getuser?id='+userid)
    //             .then(function(response){
    //                 if(response.data===''){

    //                     console.log('user not exists');
    //                 } else{
    //                     $rfidwrapper.html("User already exists");
    //                     $rfidwrapper.css('color', '#f4ad42');
    //                     console.log(response);
    //                 }
    //     });
    // }
});
