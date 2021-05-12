const handleDrawing = e => {
  e.preventDefault();
  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);
  const name = document.querySelector("#drawingName").value.toLowerCase().replace(/\s/g, '-');

  if (name === "") {
    handleError("Please enter a name.");
    return false;
  }

  const canvas = document.querySelector("canvas");
  const image = canvas.toDataURL("image/png");
  document.querySelector("#imageURL").value = image;
  sendAjax('POST', $("#pictureForm").attr("action"), $("#pictureForm").serialize(), function () {
    clear();
    handleSuccess();
  });
  return false;
};

const handleSuccess = e => {
  $("#errorMessage").text("Success!");
  $("#errMsgBox").animate({
    width: 'toggle'
  }, 350);
};

const handleCorrect = e => {
  $("#errorMessage").text("Correct! +1 point");
  $("#errMsgBox").animate({
    width: 'toggle'
  }, 350);
};

const handleIncorrect = e => {
  $("#errorMessage").text("Incorrect! -1 point");
  $("#errMsgBox").animate({
    width: 'toggle'
  }, 350);
};

let ctx, canvas;
let canvasWidth = 800;
let canvasHeight = 600;
let strokeStyle = 'black';
let nameToGuess = ''; // Credit for canvas drawing code
// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
// last known position

let pos = {
  x: 0,
  y: 0
};
let storedImages = [];
let currentImage = 0;

const setPosition = e => {
  try {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    pos.x = mouseX;
    pos.y = mouseY;
  } catch (error) {}
};

const draw = e => {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;
  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = strokeStyle;
  ctx.moveTo(pos.x, pos.y); // from

  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!

  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);
}; // clears canvas


const clear = e => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  document.querySelector("#drawingName").value = '';
};

const next = e => {
  if (currentImage === storedImages.length - 1) return;
  if (currentImage === storedImages.length - 2) document.querySelector("#next").disabled = true;
  currentImage++;
  document.querySelector("#next").innerHTML = "SKIP ▶";
  document.querySelector("#guess").disabled = false;
  $("#errMsgBox").animate({
    width: 'hide'
  }, 350);
  renderCurrentImage();
};

const makeGuess = e => {
  const guessBox = document.querySelector("#guessBox");

  if (guessBox.value.trim().toLowerCase() === nameToGuess) {
    handleCorrect();
  } else {
    handleIncorrect();
  }

  document.querySelector("#guess").disabled = true;
  document.querySelector("#next").innerHTML = "NEXT ▶";
};

const DrawingForm = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "drawForm"
  }, /*#__PURE__*/React.createElement("canvas", {
    width: "800",
    height: "600",
    id: "drawing"
  }), /*#__PURE__*/React.createElement("button", {
    className: "block",
    id: "btnClear"
  }, "CLEAR"), /*#__PURE__*/React.createElement("form", {
    id: "pictureForm",
    name: "pictureForm",
    onSubmit: handleDrawing,
    action: "/make",
    method: "POST",
    className: "pictureForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "drawingName"
  }, "Image Name: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "name",
    id: "drawingName"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "encode",
    id: "imageURL"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "block",
    id: "btnSubmit",
    type: "submit",
    value: "SUBMIT"
  })));
};

const PicList = function (props) {
  if (props.pics.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "picList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "empty"
    }, "No Pictures found"));
  }

  storedImages = _.shuffle(props.pics);
  return /*#__PURE__*/React.createElement("div", {
    className: "picList"
  }, /*#__PURE__*/React.createElement("section", {
    id: "pictureContainer"
  }), /*#__PURE__*/React.createElement("div", {
    id: "controlContainer"
  }, /*#__PURE__*/React.createElement("input", {
    id: "guessBox",
    type: "text",
    name: "guess"
  }), /*#__PURE__*/React.createElement("button", {
    id: "guess",
    className: "control"
  }, "GUESS"), /*#__PURE__*/React.createElement("button", {
    id: "next",
    className: "control"
  }, "SKIP \u25B6")));
};

const DisplayPic = props => {
  nameToGuess = props.pic.name.trim().toLowerCase();
  return /*#__PURE__*/React.createElement("img", {
    id: "displayPic",
    src: props.pic.encode,
    alt: props.pic.name,
    width: "800",
    height: "600"
  });
};

const LandingNav = function () {
  return /*#__PURE__*/React.createElement("nav", {
    className: "landingNav"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "/logout"
  }, "SIGN OUT")), /*#__PURE__*/React.createElement("div", {
    id: "guessPageButton"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/guess"
  }, "GUESS")), /*#__PURE__*/React.createElement("div", {
    id: "makePageButton"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/make"
  }, "MAKE")));
};

const Landing = function () {
  return /*#__PURE__*/React.createElement("p", {
    className: "landing"
  }, "Welcome! Click one of the above links to begin.");
};

const createMakeWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(DrawingForm, {
    csrf: csrf
  }), document.querySelector("#content"));
};

const createGuessWindow = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(PicList, {
    pics: []
  }), document.querySelector("#content"));
  getDrawingsFromServer();
};

const getDrawingsFromServer = () => {
  sendAjax('GET', '/getDrawings', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(PicList, {
      pics: data.drawings
    }), document.querySelector("#content"));
    document.querySelector("#next").addEventListener("click", e => {
      next();
      return false;
    });
    document.querySelector("#guess").addEventListener("click", e => {
      makeGuess();
      return false;
    });

    if (data.drawings.length > 0) {
      currentImage = 0;
      renderCurrentImage();
    }
  });
};

const renderCurrentImage = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(DisplayPic, {
    pic: storedImages[currentImage]
  }), document.querySelector("#pictureContainer"));
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LandingNav, null), document.querySelector("#nav"));
  ReactDOM.render( /*#__PURE__*/React.createElement(Landing, null), document.querySelector("#content"));
  const makePageButton = document.querySelector("#makePageButton");
  const guessPageButton = document.querySelector("#guessPageButton");
  makePageButton.addEventListener("click", e => {
    e.preventDefault();
    createMakeWindow(csrf);
    setupCanvas();
    return false;
  });
  guessPageButton.addEventListener("click", e => {
    e.preventDefault();
    createGuessWindow();
    return false;
  });
};

const setupCanvas = () => {
  // canvas stuff
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  document.querySelector('#btnClear').addEventListener("click", clear);
  document.addEventListener('mousemove', draw);
  document.addEventListener('mousedown', setPosition);
  document.addEventListener('mouseenter', setPosition);
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
