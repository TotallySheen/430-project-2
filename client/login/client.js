const handleLogin = (e) => {
    e.preventDefault();

    $("#errMsgBox").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();

    $("#errMsgBox").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
}

const handlePassChange = (e) => {
    e.preventDefault();

    $("#errMsgBox").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
}

const LoginWindow = (props) => {
    return (
    <form id="loginForm" name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
    >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="text" name="pass" placeholder="password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign In"/>
    </form>
    );
}

const SignupWindow = (props) => {
    return (
    <form id="signupForm" name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
    >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="text" name="pass" placeholder="password"/>
        <label htmlFor="pass2">Confirm Password: </label>
        <input id="pass2" type="text" name="pass2" placeholder="retype password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign Up"/>
    </form>
    );
}

const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm" name="changePassForm"
            onSubmit={handlePassChange}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="oldPass">Old Password: </label>
            <input id="oldPass" type="text" name="oldPass" placeholder="password"/>
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="text" name="pass" placeholder="new password"/>
            <label htmlFor="pass2">Confirm Password: </label>
            <input id="pass2" type="text" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Submit"/>
        </form>
        );
}

const LoginNav = () => {
    return (
        <nav className="loginNav">
            <div className="navlink"><a id="loginButton" href="/login">LOGIN</a></div>
            <div className="navlink"><a id="signupButton" href="/signup">SIGN UP</a></div>
            <div className="navlink"><a id="changePassButton" href="/changePass">CHANGE PASSWORD</a></div>
        </nav>
    );
}

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createChangePassWindow = (csrf) => {
    ReactDOM.render(
        <ChangePassWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    ReactDOM.render(
        <LoginNav/>,
        document.querySelector("#nav")
    );
    
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changePassButton = document.querySelector("#changePassButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePassWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); //default view
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});