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
                subquestions: item.subquestion || [],
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
    addMessage(subquestion.question, 'user');  // Add subquestion to the chat

    setTimeout(() => {
        const imageUrl = subquestion.image || "";  // Use the image URL if available

        // Add the subquestion's answer and image
        addMessage(subquestion.answer || " ", 'bot', imageUrl);

        // If the subquestion has its own subquestions, recursively handle them
        if (subquestion.subquestion && subquestion.subquestion.length > 0) {
            questionStack.push(responses[parentQuestion].subquestions); // Save the current subquestions
            renderSubquestions(subquestion.question, subquestion.subquestion); // Render nested subquestions
        } else {
            // If no more subquestions, go back to the parent question
            const parentData = questionStack.pop(); // Get the parent data
            if (parentData) {
                renderQuestions(parentData);  // Re-render parent questions
            } else {
                // Ensure that you return to a proper state if no parent data exists
                renderQuestions(parentData || []);
            }
        }
    }, 500);
}

// Function to render subquestions and display images correctly
function renderSubquestions(parentQuestion, subquestions) {
    const questionsContainer = document.querySelector('.chat-questions ul');
    questionsContainer.innerHTML = ''; // Clear existing questions

    subquestions.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.question}`;
        li.onclick = () => handleSubquestionClick(parentQuestion, item); // Handle click for nested subquestions
        questionsContainer.appendChild(li);
    });

    // Scroll to the top of the container to show the new questions
    questionsContainer.scrollTop = 0;
}

// Modified function to handle messages with images correctly
function addMessage(text, type, image = "") {
    if (!text.trim() && type === 'bot') {
        return; // Don't add a message if no text is available
    }

    const chatOutput = document.getElementById('chatOutput');

    // Create a new message container
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type); // Assign type-specific class (e.g., 'user' or 'bot')

    // Format the text content (replace newlines with <br> for rendering)
    const formattedText = text.replace(/\r?\n/g, '<br>');
    const textSpan = document.createElement('span');
    textSpan.innerHTML = formattedText;
    messageDiv.appendChild(textSpan);

    // Handle image if provided
    if (image) {
        const img = document.createElement('img');
        img.src = image;  // Set the image source
        img.alt = "Response Image";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";

        img.onerror = () => {
            console.warn(`Image not found: ${image}`);
            img.remove(); // Remove the image if it can't load
        };

        messageDiv.appendChild(img); // Add image to the message
    }

    // Add the message to the chat output
    if (text.trim()) {
        const li = document.createElement('li');
        li.appendChild(messageDiv);
        chatOutput.appendChild(li);

        // Scroll to the bottom to display the latest message
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
}


// Initialize data loading
loadData();