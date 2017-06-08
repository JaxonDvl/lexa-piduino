$(document).ready(function () {
    console.log("ready");
    getAppUsers();
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
