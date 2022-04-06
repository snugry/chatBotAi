var lastAnswer="";

function decode(inputStr){
	let testBack = "";
	let j=0;
	var outArr = inputStr.replace(/#!/g,'').match(/.{1,2}/g);
	for(var myTuple of outArr){
	  var hexStr = (myTuple.charCodeAt(0) -113 + j%3).toString(16);
	  hexStr += (myTuple.charCodeAt(1) -65 + j%3).toString(16);
	  testBack += String.fromCharCode(parseInt(hexStr, 16));
	  j++;
	}
	//console.log(testBack);
	return testBack;
}

function encode(inputStr){
	let outString = "#!";
	for(var i in inputStr){
	  var tempStr = inputStr.charCodeAt(i).toString(16);
	  outString += String.fromCharCode(parseInt(tempStr[0], 16) + 113 - i%3);
	  outString += String.fromCharCode(parseInt(tempStr[1], 16) + 65 - i%3);
	}
	outString += "#!";
	//console.log(outString);
	return outString;	
}

function compare(triggerArray, replyArray, text) {
  let item;
  for (let x = 0; x < triggerArray.length; x++) {
    for (let y = 0; y < replyArray.length; y++) {
      if (triggerArray[x][y] == text) {
        items = replyArray[x];
        item = items[Math.floor(Math.random() * items.length)];
      }
    }
  }
  return item;
}

function addChat(input, product) {
  const messagesContainer = document.getElementById("messages");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="images/user.png" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botImg = document.createElement("img");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botImg.src = "images/bot.png";
  botImg.className = "avatar";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  botDiv.appendChild(botImg);
  messagesContainer.appendChild(botDiv);
  // Keep messages at most recent
  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;

  // Fake delay to seem "real"
  setTimeout(() => {
    botText.innerText = `${product}`;
  }, product.length * 10
  )

}

function normalizeText(input){
	let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
  text = text
	.replace(/(\r\n|\n|\r)/gm, "")
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
	.replace(/wheres/g, "where is")
    .replace(/ please/g, "");
	
	return text;
}


function output(input) {
//cleaning up
  let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
  text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
	.replace(/wheres/g, "where is")
    .replace(/ please/g, "");
	
	$.post("php/getResponses.php", {'input': normalizeText(input),'lastAnswer':normalizeText(lastAnswer),'saveLastAnswers':'false'}, function(result){
		addChat(input, result);
		lastAnswer = result;
	});
}

$(document).ready(function(){
	var inputField = $("#input");
	inputField.keydown(function(e){
		if (e.which === 13) {
			var input = inputField.val();
			inputField.val("");

			if(input.startsWith("#!") && input.startsWith("#!",input.length -2))
			{
			  input = decode(input);
			}
			output(input);   
		}
	}); 

}); 