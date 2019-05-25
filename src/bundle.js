let flowers = [];

function countflowers(flowers) {
    let countedflowers = flower.reduce((prev, cur) => {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
    }, {});

    return countedflowers;
}

let headers = {};
function getHeaders() {
    let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Authentication': localStorage.getItem("authKey"),
        'ClientId': localStorage.getItem("uid")
    };

    return headers;
}

// for everything but seeing all food items, we need to have the authentication key in the API call.
// but every time a page is reloaded, bundle.js will run replace the baseURL to the one at line #1(which
// doesn't contain the authentication key).
// this is done to maintain the baseURL with authentication key included given that the client has already,
// being given an authentication key by the server.
if (localStorage.getItem('authKey') !== undefined) {
    headers.Authentication = localStorage.getItem('authKey');
    headers.ClientId = localStorage.getItem('uid');
}

// re-directions.
$('#signup').click(function () {
    window.location.href = 'SignUp.js';
});
$('#signin').click(function () {
    window.location.href = 'SignIn.js';
});
$('#buy').click(function () {
    if (localStorage.getItem('authKey') !== undefined && localStorage.getItem('uid') !== undefined) {
        window.location.href = 'buy.html';
    }
    else {
        window.location.href = 'SignUp.js';
    }
});

function redirectToHome() {
    window.location.href = 'App.js';
}
// name, phoneNo, password, cpassword, nic, email
$('#signup').click(function () {
    let data = {
        uid: 0,
        name: $('#name').val(),
        phoneNo: $('#phoneNo').val(),
        password: $('#password').val(),
        cpassword: $('#cpassword').val(),
        nic: $('#nic').val(),
        email: $('#email').val(),
    };

    axios.post('/user', data, { headers: getHeaders() })
        .then(response => {
            console.log(response.status);
            if (response.status === 500) {
                alert("Please fill all the fields.");
            }
            window.location.href = response.data.redirect;
        })
        .catch(reject => {
        });
});

/*
 * Initial executions. These happen right away when a page is loaded.
 */
$(document).ready(function () {
    let uid = localStorage.getItem("uid");

    $('#search').hide();  // enable if an item is selected.

    // show login,logout and register buttons appropriately.
    if (uid == undefined) {
        $('#signin, #signup').show();
        $('#signin').hide();
    }
    else {
        $('#signin, #signup').hide();
        $('#signin').show();
    }

    $('#buy').hide(); // credit/debit card payment radio button is going to be selected by default.

    $('#searcht').empty();
    showflowers();
    getTotalPay();
});

/*
 * Handling login.
 */
$('#signin').click(function () {
    logMeIn();
});
function logMeIn() {
    // send credentials to the session API.
    let data = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    axios.post('/user/authenticate', data, { headers: getHeaders() })
        .then(response => {
            let responseBody = response.data;

            if (responseBody.success === true) {
                // axios anyways store the response body in data. And the json reponse itself has a data attribute which contains the session.
                localStorage.setItem('authKey', responseBody.data.authKeyOfUid);
                localStorage.setItem('uid', responseBody.data.uid);

                // update the headers.
                headers.Authentication = localStorage.getItem('authKey');
                headers.ClientId = localStorage.getItem('uid');

                // hide the login and reg button and replace them with a logout button.
                $('#signin, #signup').hide();
                $('#signin').show();

                // redirection.
                window.location.href = responseBody.redirect;
            }
        })
        .catch(reject => {
            console.log(reject);
        })
}

$('#logout-btn').click(function () {
    logMeOut();
});
function logMeOut() {
    // tell the server to invoke the authentication key.
    axios.delete('/user/invoke', { headers: getHeaders() })
        .then(response =>{
            console.log(response.data);
        })
        .catch(reject => {
            console.log(reject);
        });

    // clear all local storage variables(uid, authKeyOfUid, fid)
    localStorage.clear();

    // go back to homepage.
    window.location.href = 'home.html';
}

// when the buy button assigned to a certain food item is clicked.
// we need to store this on local storage so that all the proceeding pages,
// know which item is being purchased.
function addToCart(tId) {
    flowers.push(tId);
    localStorage.setItem('flowers', JSON.stringify(countflowers(flowers)));

    // let the user know.
    alert("Item added to the cart");
    // show the payment button.
    $('#search').val('Pay for ' + flowers.length + ' item(s).').show();
}

// for the buying page to show the details.
function showFoodAndUserDetails() {
    // populate payment form with user's known details.
    axios.get('http://localhost:8081/user/id/' + localStorage.getItem('uid'), { headers: getHeaders() })
        .then(response => {
            let user = response.data;

            $('#email').val(user.email);
            $('#phoneNo').val(user.phoneNo);
            $('#name').val(user.name);
            $('#nic').val(user.nic);

            console.log(user);
        })
        .catch(reject => {

        });
}

function getTotalPay() {
    let data = (JSON).parse(localStorage.getItem('foodItems'));

    axios.post('/payment/total', data, { headers: getHeaders() })
        .then(response => {
            $('#amount').html(response.data.amount);
        })
        .catch(reject => {

        });
}

$('#pin').click(function () {
    alert('Your pin is: 1234');
    // we aren't sending the pin to a mobile phone so we just display it here :(
});

function makePayment() {

    let paymentType = $("input[name='paymentRadios']:checked").val();

    // basic information.
    let data = {
        pid: 0,
        uid: localStorage.getItem('uid'),
        paymentType: paymentType,
        paymentDate: new Date(),
        itemsAndCounts: JSON.parse(localStorage.getItem('flowers'))
    };

    // payment information.
    switch (paymentType) {
        case 'card':
            let cardDetails = {
                number: $('#card-number').val(),
                cvc: $('#cvc').val(),
                expiry: $('#exp-date').val()
            };
            data.paymentDetails = cardDetails;
            break;

        case 'bill':
            let billDetails = {
                handler: 'Dialog',
                mobile: $('#dialog-number').val(),
                pin: $('#pin').val()
            };
            data.paymentDetails = billDetails;
            break;
    }

    console.log(paymentType);
    console.log(data);
    axios.post('/payment', data, { headers: getHeaders() })
        .then(response => {
            let data = response.data;
            if (data.success === true) {
                localStorage.setItem('pid', data.pid.toString());
                flowers = [];
                localStorage.setItem('flowers', '');  // we need to erase the food items from local storage since the checkout has completed.
            }

            if (data.redirect === 'App.js') { alert('Success! Redirecting to home.'); }
            window.location.href = data.redirect;
        })
        .catch(reject => {
            console.log(reject)
        });
}

// for home page to show all the food items.
function showflowers() {
    axios.get('/flower', { headers: getHeaders() })
        .then(response=> {
            let entries = response.data;
            mapFoodResults(entries, 'flower-list', true);
        })
        .catch(rejection => {

        });
}

// show relevant food items as the user is typing.
$('#flower-search').keypress(function () {
    let keyword = $('#search').val();

    // remove the current contents of the list first.
    $('#flower-list').empty();

    console.log(getHeaders());
    axios.get('/flower/' + keyword, { headers: getHeaders() })
        .then(response=> {
            let entries = response.data;
            mapFoodResults(entries, 'flowers', true);
        })
        .catch(rejection => {

        });
});


/*
 * Handling payment.
 */
function completePayment() {
    // collect information from the forms.
    // common details.
    let data = {

    };
    let paymentType = $('[name=paymentRadios]:checked').val();
    console.log(paymentType);
}

// show appropriate payment information form depending on which payment type is selected.
//      1) Credit/Debit Card radio -> cardPayment form
//      2) Add to Dialog Postpaid Bill radio -> billPayment form.
// always hide the irrelevant form.
$('#paymentRadiosCard').click(function () {
    $('#cardPayment').show();   $('#billPayment').hide();
});

$('#paymentRadiosBill').click(function () {
    $('#billPayment').show();   $('#cardPayment').hide();
});

// Food items retrieved by API call to /food will be mapped to the food-list UL.
// This can be used for showing all the food items in the db or just to show
// the,
// search results.

// @param entries
// json array containing food items.
function mapFoodResults(entries, targetHtmlTag, appendBtn) {
    for (let i = 0; i < entries.length; i++) {
        // id of each list item element should be the food if of the food it,
        // contains.
        let entry = entries[i];
        console.log(i);
        let compositeHtmlElement =
            '<li class="list-group-item d-flex justify-content-between align-items-center">' +
            '<p>'+
            '<b>' + entry.name + '<b/> <br /><small>' + entry.ingredients + '</small> <br />' +
            '<span class="badge badge-primary badge-pill">Rs: ' + entry.price + '/=</span>' +
            '</p>';

        if (appendBtn) {
            compositeHtmlElement += '<button id="' + entry.fId + '" type="button" class="btn btn-success" onclick="addToCart(this.id)">Buy</button>';
            // the reason why we append an underscore to the entry.fId's value is, since we give the same value as the id of the LI element,
            // buyThisFoodItem will get the LI element as a whole as the parameter if we directly pass the fId is its own id as well.
        }

        compositeHtmlElement += '</li>';
        // when we call the onClick function, it will actually get the whole
        // <li> element as the parameter since,
        // li element has the fId as its id.

        $('#' + targetHtmlTag).append(compositeHtmlElement);
    }
}

// POST the reg details to the server.
// name, phoneNo, password, cpassword, nic, email
$('#signin').click(function () {

    let data = {
        "uid": 0,
        "name": $('#name').val(),
        "phoneNo": $('#phoneNo').val(),
        "password": $('#password').val(),
        "cpassword": $('#cpassword').val(),
        "nic": $('#nic').val(),
        "email": $('#email').val()
    };

    // make sure to include uid attribute with 0 as its value.
    // otherwise the server will complain about a missing parameter.
    axios.post('/user', data, headers)
        .then(response => {
            window.location.href = 'SignUp.js';
        })
        .catch(rejection => {
            // for some reason axios catch a rejection even when the,
            // server accepts the POST data.
            window.location.href = 'SignUp.js';
        });
});


/* * Validations * */
function checkForNumericOnly(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

function checkForAlphabeticOnly(str) {
    let pattern = /^[A-Za-z]+$/;
    return str.match(pattern);
}

function checkForAlphaNumericOnly(str) {
    let pattern = /^([a-zA-Z0-9 _-]+)$/;
    return str.match(pattern);
}

$('#name').keypress(function () {
    let value = $('#name').val();
    let elem = $('#name');

    if (value != null && checkForAlphabeticOnly(value)) {
        elem.addClass('border border-success').removeClass('border-danger');
    }
    else {
        elem.addClass('border border-danger').removeClass('border-success');
    }
});

$('#phoneNo').keypress(function () {
    let value = $('#phoneNo').val();
    let elem = $('#phoneNo');

    if (value != null && checkForNumericOnly(value)) {
        elem.addClass('border border-success').removeClass('border-danger');
    }
    else {
        elem.addClass('border border-danger').removeClass('border-success');
    }
});

$('#cardNo').keypress(function () {
    let value = $('#cardNo').val();
    let elem = $('#cardNo');

    if (value != null && checkForNumericOnly(value)) {
        elem.addClass('border border-success').removeClass('border-danger');
    }
    else {
        elem.addClass('border border-danger').removeClass('border-success');
    }
});

$('#cvc').keypress(function () {
    let value = $('#cvc').val();
    let elem = $('#cvc');

    if (value != null && checkForNumericOnly(value)) {
        elem.addClass('border border-success').removeClass('border-danger');
    }
    else {
        elem.addClass('border border-danger').removeClass('border-success');
    }
});

$('#mobileNo').keypress(function () {
    let value = $('#mobileNo').val();
    let elem = $('#mobileNo');

    if (value != null && checkForNumericOnly(value)) {
        elem.addClass('border border-success').removeClass('border-danger');
    }
    else {
        elem.addClass('border border-danger').removeClass('border-success');
    }
});

$('#pin').keypress(function () {
    let value = $('#pin').val();
    let elem = $('#pin');

    if (value != null && checkForNumericOnly(value)) {
        elem.addClass('border border-success').removeClass('border-danger');
    }
    else {
        elem.addClass('border border-danger').removeClass('border-success');
    }
});