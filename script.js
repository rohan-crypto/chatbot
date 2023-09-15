const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler"); 
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    //create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    
    // what to show in chat (html) according to className outgoing or incoming
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;

    //now the message will be set as the text of the paragraph whether it contains
    //html tags or not. Like if we pass html in chat then it will be considered
    //as a text instead of html.
    chatLi.querySelector("p").textContent = message;
    
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": userMessage}]
        })
    }

    // send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        console.log(data);
        messageElement.textContent = data.choices[0].message.content;
    }).catch((err) => {
        console.log(err);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    //slways auto scroll to bottom whenever chat overflows
}

const handleChat = () => {
    // getting entered message and removing extra whitespace
    userMessage = chatInput.value.trim();
    console.log(userMessage);

    if(!userMessage)
        return;

    //to make the chat input blank once message has been sent
    chatInput.value = "";

    //reseting the height of textarea to default once a message is sent
    chatInput.style.height = `${inputInitHeight}px`;
    
    // chatbox is a ul, append user's message as child in it
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    //auto scroll to bottom whenever chat overflows
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        
        //auto scroll to bottom whenever chat overflows
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    //adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    //if Enter key is pressed without shift key and the window width is 
    // greater than 800px, handle the chat
    if(e.key == "Enter" && !e.shiftKey && window.innerWidth > 800)
    {
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener("click", handleChat);

// to toggle hide and show of chatbot
chatbotToggler.addEventListener("click", () => document.body.classList.
toggle("show-chatbot"));

// to close chatbot on click of close btn in small screen
chatbotCloseBtn.addEventListener("click", () => document.body.classList.
remove("show-chatbot"));