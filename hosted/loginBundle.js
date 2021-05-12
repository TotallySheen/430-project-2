const handleLogin = e => {
  e.preventDefault();
  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

const handleSignup = e => {
  e.preventDefault();
  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
};

const handlePassChange = e => {
  e.preventDefault();
  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
};

const LoginWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "text",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign In"
  }));
};

const SignupWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "text",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Confirm Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "text",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  }));
};

const ChangePassWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handlePassChange,
    action: "/changePass",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "text",
    name: "oldPass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "text",
    name: "pass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Confirm Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "text",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Submit"
  }));
};

const LoginNav = () => {
  return /*#__PURE__*/React.createElement("nav", {
    className: "loginNav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    id: "loginButton",
    href: "/login"
  }, "LOGIN")), /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    id: "signupButton",
    href: "/signup"
  }, "SIGN UP")), /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    id: "changePassButton",
    href: "/changePass"
  }, "CHANGE PASSWORD")));
};

const createLoginWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

const createSignupWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

const createChangePassWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

const setup = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginNav, null), document.querySelector("#nav"));
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  const changePassButton = document.querySelector("#changePassButton");
  signupButton.addEventListener("click", e => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", e => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  changePassButton.addEventListener("click", e => {
    e.preventDefault();
    createChangePassWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); //default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
const handleError = message => {
  $("#errorMessage").text(message);
  $("#errMsgBox").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success,
    success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
