
// Get menu button and container elements
const menuBtn = document.getElementById("menuBTN");
const menuContiner = document.getElementById('active');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('opened');
    menuBtn.setAttribute('aria-expanded', menuBtn.classList.contains('opened'));
    menuContiner.classList.toggle('visible');
});

let responses = {};
let questionStack = []; // Stack to track question navigation

// Load data from Data.json
async function loadData() {
    try {
        const response = await fetch('http://0.0.0.0:8000/Datajson'); // Update the path if necessary
        const data = await response.json();

        // Populate the responses object including subquestions
        data.forEach(item => {
            responses[item.question] = {
                answer: item.answer || "No answer available",
                image: item.image || "",
                subquestions: item.subquestion || []
            };
        });

        // Render top-level questions in the UI
        renderQuestions(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

const chatButton = document.getElementById("chatButton");
const chatQuestions = document.getElementById("chatQuestions");
const chatOutputContainer = document.querySelector(".chatoutput-container");
const chatOutput = document.getElementById("chatOutput");
const mainImage = document.querySelector(".main-img");
const chatImage = document.getElementById("chat-icon");
const chatContent = document.querySelector(".chat-button-content");

// Function to toggle chat questions visibility
function toggleQuestions() {
    // Check if the chatQuestions is currently visible
    if (chatQuestions.style.display === "none" || chatQuestions.style.display === "") {
        // Show the questions and hide the chat button
        chatQuestions.style.display = "block";
        chatButton.style.display = "none";
        mainImage.style.display = "none";

        // Adjust chat output height for mobile view
        if (window.innerWidth <= 480) {
            chatOutputContainer.style.height = "45vh";
        }
    } else {
        // Hide the questions and show the chat button
        chatQuestions.style.display = "none";
        chatButton.style.display = "block";
        chatButton.style.bottom = "";

        // Adjust chat output height for mobile view
        if (window.innerWidth <= 480) {
            chatOutputContainer.style.height = "90vh";
        }
    }

    // Reset height for larger screens
    if (window.innerWidth > 480) {
        chatOutputContainer.style.height = "";
    }
}

// Hide chatQuestions and expand chatOutputContainer when interacting with chatOutput
// chatOutput.addEventListener("scroll", () => {
//     chatQuestions.style.display = "none";
//     chatButton.style.display = "block";

//     // Expand chat output for mobile view
//     if (window.innerWidth <= 480) {
//         chatOutputContainer.style.height = "90vh";
//     }
// });

chatOutput.addEventListener("touchstart", () => {
    chatQuestions.style.display = "none";
    chatButton.style.display = "block";

    // Expand chat output for mobile view
    if (window.innerWidth <= 480) {
        chatOutputContainer.style.height = "90vh";
    }
});


function renderQuestions(data) {
    const questionsContainer = document.querySelector('.chat-questions ul');
    questionsContainer.innerHTML = ''; // Clear existing questions

    data.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.question}`;
        li.onclick = () => handleQuestionClick(item.question, data);
        questionsContainer.appendChild(li);
    });
    // Scroll to the top of the container
    questionsContainer.scrollTop = 0;
}

function renderSubquestions(parentQuestion, subquestions) {
    const questionsContainer = document.querySelector('.chat-questions ul');
    questionsContainer.innerHTML = ''; // Clear existing questions

    subquestions.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.question}`;
        li.onclick = () => handleSubquestionClick(parentQuestion, item);
        questionsContainer.appendChild(li);
    });
    // Scroll to the top of the container
    questionsContainer.scrollTop = 0;
}

function handleQuestionClick(question, parentData) {
    const botResponse = responses[question];

    // Add the user's question as a message
    addMessage(question, 'user');

    // Check if the question has subquestions
    if (botResponse && botResponse.subquestions.length > 0) {
        // Save the current questions to the stack
        questionStack.push(parentData);

        // Render the subquestions dynamically
        renderSubquestions(question, botResponse.subquestions);
    } else if (botResponse) {
        // Add the bot's answer as a message after a delay
        setTimeout(() => addMessage(botResponse.answer, 'bot', botResponse.image), 500);
    } else {
        // Handle the case where no answer is available
        setTimeout(() => addMessage("I'm sorry, I don't have an answer for that.", 'bot'), 500);
    }
}

function handleSubquestionClick(parentQuestion, subquestion) {
    addMessage(subquestion.question, 'user');
    setTimeout(() => {
        // Ensure the image is correctly handled
        const imageUrl = subquestion.image ? subquestion.image : "";

        addMessage(subquestion.answer, 'bot', imageUrl);

        // Automatically go back to the parent question list after displaying the answer
        const parentData = questionStack.pop(); // Get the parent questions from the stack
        if (parentData) {
            renderQuestions(parentData);
        }
    }, 500);
}


function addMessage(text, type, image = "") {
    const chatOutput = document.getElementById('chatOutput');

    // Create a new message container
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type); // Assign type-specific class (e.g., 'user' or 'bot')
    
    

    // Format the text content (replace newlines with <br> for rendering)
    const formattedText = text.replace(/\r?\n/g, '<br>');

    // Create a span to hold the text
    const textSpan = document.createElement('span');
    textSpan.innerHTML = formattedText; // Use innerHTML to support <br> tags
    messageDiv.appendChild(textSpan);

    // If an image URL is provided, include the image in the message
    if (image) {
        const img = document.createElement('img');
        img.src = image;
        img.alt = "Response Image";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";

        // Handle case where the image might not load
        img.onerror = () => {
            console.warn(`Image not found: ${image}`);
            img.remove(); // Remove the image if it can't load
        };

        messageDiv.appendChild(img);
    }

    // Add the new message to the chat output container
    const li = document.createElement('li');
    li.appendChild(messageDiv);
    chatOutput.appendChild(li);

    // Scroll to the bottom of the chat to show the latest message
    chatOutput.scrollTop = chatOutput.scrollHeight; // Scrolls to the bottom immediately after appending
}

// Initialize data loading
loadData();