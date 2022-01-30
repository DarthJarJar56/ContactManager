// Setting up query link for ease of use in functions.
const urlBase = 'http://contactmanager15.xyz/LAMPAPI';
const extension = 'php';

// Declaring variables to store user info once logged in.
let userId = 0;
let firstName = "";
let lastName = "";

function doForgot()
{
    let username = document.getElementById("verifyUser").value;
    let secq1 = document.getElementById("verifySecQ1").value;
    let secq2 = document.getElementById("verifySecQ2").value;
    
    var option = 1;

    let temp = {option:option,login:username,secQuestion1:secq1,secQuestion2:secq2};
    let jsonPayload = JSON.stringify( temp );

    console.log(JSON.stringify( temp ));	
    let url = urlBase + '/ForgotPassword.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        console.log("Hit the try");
        xhr.send(jsonPayload)
	    console.log("json payload in the air");    
        xhr.onreadystatechange = function()
        {
            if (this.readyState === 4 && this.status === 200)
            {
                console.log("Status good!");
                let jsonObject = JSON.parse( xhr.responseText );
                error = jsonObject.info;
		console.log(jsonObject);

		if (error != "")
                {
                    console.log(error);
                    return;
                }

                console.log("Success!");

                saveCookie();
                
                // take to the place where you tupe new password
                window.location.href = "index2.html";
            }

        }
    }
    catch (err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doReset()
{
    let newPassword = document.getElementById("resetPassword");
    var option = 2;

    let temp2 = {option:option,newPassword:newPassword};
    let jsonPayload2 = JSON.stringify( temp2 );

    console.log(JSON.stringify( temp2 ));	
    let xhr2 = new XMLHttpRequest();

    xhr2.open("POST", url, true);
    xhr2.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        console.log("Hit the try");
        xhr2.send(jsonPayload)
	    console.log("json payload in the air");    
        xhr2.onreadystatechange = function()
        {
            if (this.readyState === 4 && this.status === 200)
            {
                console.log("Status good!");
                let jsonObject2 = JSON.parse( xhr2.responseText );
                error = jsonObject2.error;

                if (error != "")
                {
                    console.log("Failed...returning");
                    return;
                }

                console.log("Success!");

                saveCookie();
                
                // take to the place where you tupe new password
                window.location.href = "index.html";
            }

        }
    }
    catch (err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doRegister()
{
    let username = document.getElementById("newUsername").value;
    let password = document.getElementById("newPassword").value;
    let firstName = document.getElementById("newFirstName").value;
    let lastName = document.getElementById("newLastName").value;
    let secq1 = document.getElementById("secQuestion1").value;
    let secq2 = document.getElementById("secQuestion2").value;

    let temp = {firstName:firstName,lastName:lastName,login:username,password:password,secQuestion1:secq1,secQuestion2:secq2};
    let jsonPayload = JSON.stringify( temp );

    console.log(JSON.stringify( temp ));	
    let url = urlBase + '/Register.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        console.log("Hit the try");
        xhr.send(jsonPayload)
	console.log("json payload in the air");    
        xhr.onreadystatechange = function()
        {
            if (this.readyState === 4 && this.status === 200)
            {
                console.log("Status good!");
                let jsonObject = JSON.parse( xhr.responseText );
                error = jsonObject.error;

                if (error != "")
                {
                    console.log("Failed...returning");
                    // register failed for some reason
                    return;
                }

                console.log("Success!");

                saveCookie();
               // window.location.href = "index.html";
            }

        }
    }
    catch (err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doLogin()
{
	// Grabbing the username and password from the input fields.
    let login = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;

	//var hash = md5( password );

    //document.getElementById("loginResult").innerHTML = "";

	// Setting up JSON object to be sent to the API, looks like this:
	// {
	//    "login": login,
	//	  "password": password
    // }
    let tmp = {login:login,password:password};
    //var tmp = {login:login,password:hash};

	// Converting the simple string version of the object to actual JSON.
    let jsonPayload = JSON.stringify( tmp );

	// Setting up the full link for the Login API query.
    let url = urlBase + '/Login.' + extension;

	// Creating a new API request object.
    let xhr = new XMLHttpRequest();

	// Giving the API object the link to the Login API and other necessary info.
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
		// We send the API query and wait for it to return.
		// The API queries are "asynchronous", which means that other
		// code can run in the background while the query is pending.
		xhr.send(jsonPayload);

		// Once the API query returns and is noted as ready, this function triggers.
        xhr.onreadystatechange = function()
        {
			// This tells if the query has returned and everything is correct with it.
            if (this.readyState === 4 && this.status === 200)
            {
				// Parsing the returned information from the query to a JSON object.
                let jsonObject = JSON.parse( xhr.responseText );

				// Getting the user's ID from the JSON object and storing it.
                userId = jsonObject.id;

				// If the user ID is less than 1, the API query found that no user exists in the database
				// with the given username and password.
                if( userId < 1 )
                {
                    //document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					// If we did not find any user, we exit the function.
                    return;
                }

				// Getting here means we successfully found a user in the database, so we save the user's information.
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

				// We save a cookie so that the user that logged in will have a max of 20 minutes on the website before
				// automatically getting logged out.
                saveCookie();

                window.location.href = "cover.html";
            }
        };
    }
    catch(err)
    {
		// This is just catching any error that may have occurred while sending a query to the API.
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++)
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] === "firstName" )
        {
            firstName = tokens[1];
        }
        else if( tokens[0] === "lastName" )
        {
            lastName = tokens[1];
        }
        else if( tokens[0] === "userId" )
        {
            userId = parseInt( tokens[1].trim() );
        }
    }

    if( userId < 0 )
    {
        window.location.href = "index.html";
    }
    else
    {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout()
{
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addColor()
{
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = {color:newColor,userId,userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }

}

function searchColor()
{
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";

    let colorList = "";

    let tmp = {search:srch,userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse( xhr.responseText );

                for( let i=0; i<jsonObject.results.length; i++ )
                {
                    colorList += jsonObject.results[i];
                    if( i < jsonObject.results.length - 1 )
                    {
                        colorList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }

}
