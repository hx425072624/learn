$(function () {
    $("form").validate({
        defaultEvent: "change",
        rules: {
            user: {
                required: true
            }, psw: {
                required: true
            }, myEmail: {
                email: true
            }, myPhone: {
                tel: true
            }, myCredit: {
                credit: true
            }, myAge: {
                max: 150,
                min: 0
            }
        }
    })
})