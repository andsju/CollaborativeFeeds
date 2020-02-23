function isValidPassword(input) {
    var reg1 = /^[^%\s]{8,}$/;
    var reg2 = /[A-Z]/;		//upper
    var reg3 = /[a-z]/;		//lower
    var reg4 = /[0-9]/;		//numeric
    var reg5 = /[\@\'\"\!\&\|\<\>\#\?\:\;\$\*\_\+\-\^\.\,\(\)\{\}\[\]\\\/\=\~]/;

    var a = reg1.test(input);
    var b = reg2.test(input);
    var c = reg3.test(input);
    var d = reg4.test(input);
    var e = reg5.test(input);

    if(b + c + d + e >= 3 && a) {
        return true;
    }
}
