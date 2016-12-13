// Handle the debug mode query string parameter.
var debugMode = false;
if (window.location.search.indexOf("debug=1") > -1) {
	$("#toggle").val("Disable Debug Mode");
	debugMode = true;
} else {
	$("#toggle").val("Enable Debug Mode");
}

// Create our RiveScript interpreter.
var rs = new RiveScript({
	utf8: true,
	debug:   debugMode,
	onDebug: onDebug	
});

rs.unicodePunctuation = new RegExp(/[.,!?;:]/g); //?
// This won't work on the web!
//rs.loadDirectory("brain");

// Load our files from the brain/ folder.
rs.loadFile([
	"brain/brain.rive",
	"brain/CorpoBot.rive",
	"brain/chitchat.rive",
	"brain/topics.rive"
	], on_load_success, on_load_error);

// You can register objects that can then be called 
// using <call></call> syntax
rs.setSubroutine('fancyJSObject', function(rs, args){
	// doing complex stuff here
});

function on_load_success () {
	$("#message").removeAttr("disabled");
	$("#message").attr("placeholder", "Wyślij wiadomość");
	$("#message").focus();
	$("#dialogue").append("<div><span class='bot'>CorpoBot: </span>Witaj! Mam na imię CorpoBot i moim zadaniem jest przybliżyć Ci ofertę firmy Corpo. Jeśli zabraknie Ci pomysłów o czym moglibyśmy pogadać, poproś mnie o pomoc. Czy chcesz abym przedstawił Ci naszą ofertę?</div>");

	// Now to sort the replies!
	rs.sortReplies();
}

function on_load_error (err) {
	console.log("Loading error: " + err);
}

function replacePl(text) {
    return text.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}

// Handle sending a message to the bot.
function sendMessage () {
	var text = $("#message").val();
	$("#message").val("");
	$("#dialogue").append("<div><span class='user'>Ty:</span> " + text + "</div>");
	
	text = replacePl(text);

	try {
	var reply = rs.reply("soandso", text);
	reply = reply.replace(/\n/g, "<br>");
	$("#dialogue").append("<div><span class='bot'>CorpoBot:</span> " + reply + "</div>");
	$("#dialogue").animate({ scrollTop: $("#dialogue").height() }, 1000);
	} catch(e) {
		window.alert(e.message + "\n" + e.line);
		console.log(e);
	}

	return false;
}

// Button that turns debugging on and off.
function toggleDebug () {
	if (debugMode) {
		window.location = "?debug=0";
	} else {
		window.location = "?debug=1";
	}
}

function onDebug(message) {
	if (debugMode) {
		$("#debug").append("<div>[RS] " + escapeHtml(message) + "</div>");
	}
}

function escapeHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// -------------- ZAPIS LOGÓW ------------------- //

function savelogs(log) {

		qwest.post("https://s416196.students.wmi.amu.edu.pl/CorpoBot/log.php",{ data: log }, {
            cache: true,
            dataType: 'json'
        })
        .then(function(xhr, response) {
       		console.log("send a log");
            
        })
        .catch(function(e, xhr, response) {
            console.log("POST Error:" + e);
        });
	    
}


function getLogData(){
	var log = {
	    messages: []
	};

	var dialogue = document.getElementById("dialogue");
	var children = dialogue.children;

	for (var i = 0; i < children.length; i++) {
		log.messages.push({
			"text" : children[i].textContent
		})
	} 

	return log;
}

form.addEventListener('submit', function(){
	sendMessage();
	return false;
});


var saveLogButton = document.getElementById("save-logs");
saveLogButton.addEventListener('click',function(){
	savelogs(getLogData())
	swal("Dzięki!")
	//alert("Dzięki!");
});