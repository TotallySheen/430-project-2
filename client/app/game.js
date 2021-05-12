const handleDrawing = (e) => {
    e.preventDefault();

    $("#errMsgBox").animate({width:'hide'},350);

    const name = document.querySelector("#drawingName").value.toLowerCase().replace(/\s/g,'-');
    if (name === ""){
        handleError("Please enter a name.");
        return false;
    }

    const canvas = document.querySelector("canvas");
    const image = canvas.toDataURL("image/png");

    document.querySelector("#imageURL").value = image;

    sendAjax('POST', $("#pictureForm").attr("action"), $("#pictureForm").serialize(), function() {
        clear();
        handleSuccess();
    });

    return false;
}

const handleSuccess = (e) => {
    $("#errorMessage").text("Success!");
    $("#errMsgBox").animate({width:'toggle'},350);
}

const handleCorrect = (e) => {
    $("#errorMessage").text("Correct! +1 point");
    $("#errMsgBox").animate({width:'toggle'},350);
    localScore++;
    updateScore();
}

const handleIncorrect = (e) => {
    $("#errorMessage").text("Incorrect! -1 point");
    $("#errMsgBox").animate({width:'toggle'},350);
    localScore--;
    updateScore();
}

const updateScore = (e) => {
    document.querySelector("#hiddenScore").value = localScore;
    document.querySelector("#scoreBox").innerHTML = localName + "'s Score: " + localScore;
    
    sendAjax('POST', '/updateScore', $("#scoreForm").serialize(), () => {
        
    });
}

let ctx,canvas;
let canvasWidth = 800;
let canvasHeight = 600;
let strokeStyle = 'black';
let nameToGuess = '';
let localScore = 0;
let localName = 'null';
let token = '';

// Credit for canvas drawing code
// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

// last known position
let pos = { x: 0, y: 0 };

let storedImages = [];
let currentImage = 0;

const setPosition = (e) => {
    try{
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;
        pos.x = mouseX;
        pos.y = mouseY;
    } catch (error) {

    }
}

const draw = (e) => {
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

    $("#errMsgBox").animate({width:'hide'},350);
}
// clears canvas
const clear = (e) => {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    document.querySelector("#drawingName").value = '';
}

const next = (e) => {
    if (currentImage === storedImages.length - 1) {
        let csrf = document.querySelector("#hiddenScoreToken").value;
        createGuessWindow(csrf);
        return;
    };

    currentImage++;

    document.querySelector("#next").innerHTML = "SKIP ▶";
    document.querySelector("#guess").disabled = false;

    $("#errMsgBox").animate({width:'hide'},350);

    document.querySelector("#guessBox").value = '';

    
    if (currentImage === storedImages.length - 1) document.querySelector("#next").innerHTML = "RESET";

    renderCurrentImage();
}

const makeGuess = (e) => {
    const guessBox = document.querySelector("#guessBox");

    if (guessBox.value.trim().toLowerCase() === nameToGuess) {
        handleCorrect();
    } else {
        handleIncorrect();
    }
    document.querySelector("#guess").disabled = true;

    document.querySelector("#next").innerHTML = "NEXT ▶";
}

const DrawingForm = (props) => {
    return (
        <div className="drawForm">
            <canvas width="800" height="600" id="drawing"></canvas>
            <div id="colorContainer">
                <button className="color" id="blackBtn" value="black"></button>
                <button className="color" id="blueBtn" value="blue"></button>
                <button className="color" id="redBtn" value="red"></button>
                <button className="color" id="yellowBtn" value="yellow"></button>
                <button className="color" id="greenBtn" value="green"></button>
            </div>
            <button className="block" id="btnClear">CLEAR</button>
            
            <form id="pictureForm" name="pictureForm"
                onSubmit={handleDrawing}
                action="/make"
                method="POST"
                className="pictureForm"
            >
                <label htmlFor="drawingName">Image Name: </label>
                <input type="text" name="name" id="drawingName"/>
                <input type="text" name="encode" id="imageURL"/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="block" id="btnSubmit" type="submit" value="SUBMIT"/>
            </form>
        </div>
        );
}

const PicList = function(props) {
    if(props.components.pics.length === 0) {
        return (
            <div className="picList">
                <h3 className="empty">No Pictures found</h3>
            </div>
        );
    }

    storedImages = _.shuffle(props.components.pics);

    return (
        <div className="picList">
            <section id="pictureContainer"></section>
            <div id="controlContainer">
                <input id="guessBox" type="text" name="guess"/>
                <button id="guess" className="control">GUESS</button>
                <button id="next" className="control">SKIP ▶</button>
                <form id="scoreForm" name="scoreForm">
                    <input type="hidden" id="hiddenScore" name="score" value={props.components.score} />
                    <input type="hidden" id="hiddenScoreToken" name="_csrf" value={props.components.csrf} />
                </form>
                <div id="scoreBox">Score: 0</div>
            </div>
        </div>
    )
}

const Leaderboard = function(props) { 
    const sortedAccounts = props.accounts.sort((a, b) => {a.score - b.score})
    
    const scoreNodes = sortedAccounts.map(function(account) {
        return (
            <div key={account._id} className="leaderboardEntry">
                <h3 className="accName"> Name: {account.username} </h3>
                <h3 className="accScore"> Score: {account.score} </h3>
            </div>
        )
    });

    return (
        <div className="leaderboard">
            {scoreNodes}
        </div>
    );
}

const DisplayPic = (props) => {
    nameToGuess = props.pic.name.trim().toLowerCase();
    return (
        <img id="displayPic" src={props.pic.encode} alt={props.pic.name} width="800" height="600"></img>
    );
}

const LandingNav = function() {
    return (
        <nav className="landingNav">
            <div><a href="/logout">SIGN OUT</a></div>
            <div id="guessPageButton"><a href="/game">GUESS</a></div>
            <div id="makePageButton"><a href="/game">MAKE</a></div>
            <div id="leaderPageButton"><a href="/game">LEADERBOARD</a></div>
        </nav>
        );
}

const Landing = function() {
    return (
        <p className="landing">Welcome! Click one of the above links to begin.</p>
        );
}

const createMakeWindow = (csrf) => {
    ReactDOM.render(
        <DrawingForm csrf={csrf}/>,
        document.querySelector("#content")
    );
    for (let b of document.querySelectorAll(".color"))
    {
        b.addEventListener("click", (e) => {
            strokeStyle = e.target.value;
        })
    }
}

const createGuessWindow = (csrf) => {
    const props = {
        pics: [],
        score: localScore,
        csrf: csrf,
    }
    
    ReactDOM.render(
        <PicList components={props}/>, 
        document.querySelector("#content")
    );
    
    getDrawingsFromServer(csrf);
}

const createLeaderboardWindow = (csrf) => {
    ReactDOM.render(
        <Leaderboard accounts={[]}/>,
        document.querySelector("#content")
    );

    getScoresFromServer();
}

const getDrawingsFromServer = (csrf) => {
    sendAjax('GET', '/getDrawings', null, (data) => {
        const props = {
            pics: data.drawings,
            score: localScore,
            csrf: csrf,
        }
        
        ReactDOM.render(
            <PicList components={props} />, 
            document.querySelector("#content")
        );

        document.querySelector("#next").addEventListener("click", (e) => {
            next();
            return false;
        });

        document.querySelector("#guess").addEventListener("click", (e) => {
            makeGuess();
            return false;
        });
        
        if (data.drawings.length > 0) {
            currentImage = 0;
            renderCurrentImage();
        }

        // getting the user's score
        sendAjax('GET', '/getScore', null, (data) => {
            localScore = data.score;
            localName = data.username;
            document.querySelector("#scoreBox").innerHTML = data.username + "'s Score: " + data.score;
        })
    });
}

const getScoresFromServer = () => {
    sendAjax('GET', '/getScores', null, (data) => {
        ReactDOM.render(
            <Leaderboard accounts={data.accounts} />, 
            document.querySelector("#content")
        );
    })
}

const renderCurrentImage = () => {
    ReactDOM.render(
        <DisplayPic pic={storedImages[currentImage]} />,
        document.querySelector("#pictureContainer")
    )
}

const setup = function(csrf) {
    ReactDOM.render(
        <LandingNav/>,
        document.querySelector("#nav")
    );

    ReactDOM.render(
        <Landing/>,
        document.querySelector("#content")
    );

    const makePageButton = document.querySelector("#makePageButton");
    const guessPageButton = document.querySelector("#guessPageButton");
    const leaderPageButton = document.querySelector("#leaderPageButton");

    makePageButton.addEventListener("click", (e) => {
        e.preventDefault();
        createMakeWindow(csrf);
        setupCanvas();
        return false;
    });

    guessPageButton.addEventListener("click", (e) => {
        e.preventDefault();
        createGuessWindow(csrf);
        return false;
    });

    leaderPageButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLeaderboardWindow(csrf);
        return false;
    })
}

const setupCanvas = () => {
    // canvas stuff
    canvas = document.querySelector('canvas');

    ctx = canvas.getContext('2d');
    
    document.querySelector('#btnClear').addEventListener("click",clear);

    document.addEventListener('mousemove', draw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('mouseenter', setPosition);
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});