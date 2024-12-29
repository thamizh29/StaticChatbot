let responses = {};
let questionStack = []; // Stack to track question navigation
let data = [];
// Load data from Data.json
async function loadData() {
    try {
        const response = await fetch('https://chat.vglug.org/Datajson');
        //const response = await fetch('http://127.0.0.1:8000/Datajson'); // Update the path if necessary
        data = await response.json();

        // Populate the responses object including subquestions
        data.forEach(item => {
            responses[item.question] = {
                answer: item.answer || "No answer available",
                image: item.image || "",
                location: item.location || "",
                live_url: item.live_url || "",
                subquestions: item.subquestion || [],
            };
        });

        // Render top-level questions in the UI
        renderQuestions(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

console.log(responses)
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
        console.log("RENDERING SUB QUESTIONS")
        console.log(botResponse.subquestions)
        console.log("Sub Questions", question, botResponse.subquestions)
        // Render the subquestions dynamically
        renderSubquestions(question, botResponse.subquestions);
    } else if (botResponse) {
        // Add the bot's answer as a message after a delay
        console.log("ENters here with answer", botResponse.answer)
        setTimeout(() => addMessage(botResponse.answer, 'bot', botResponse.image, botResponse.location, botResponse.live_url), 500);
        renderQuestions(data)
    } else {
        // Handle the case where no answer is available
        setTimeout(() => addMessage("I'm sorry, I don't have an answer for that.", 'bot'), 500);
        renderQuestions(data)
    }
}

function handleSubquestionClick(parentQuestion, subquestion) {
    addMessage(subquestion.question, 'user');  // Add subquestion to the chat
    console.log("RENDERING 2 LEVEL SUB QUESTIONS", parentQuestion, subquestion)
    setTimeout(() => {
        const imageUrl = subquestion.image || "";  // Use the image URL if available
        const location = subquestion.location || "";
        const live_url = subquestion.live_url || "";
        // Add the subquestion's answer and image
        addMessage(subquestion.answer || " ", 'bot', imageUrl, location, live_url);

        // If the subquestion has its own subquestions, recursively handle them
        if (subquestion.subquestion && subquestion.subquestion.length > 0) {
            questionStack.push(responses[parentQuestion].subquestions); // Save the current subquestions
            renderSubquestions(subquestion.question, subquestion.subquestion); // Render nested subquestions
        } else {
            // If no more subquestions, go back to the parent question
            const parentData = data; // Get the parent data
            console.log("PARENT DATA", parentData)
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
    console.log("RENDERING --- SUB QUESTIONS", parentQuestion, subquestions)
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
function addMessage(text, type, image = "", location = "", live_url = "") {
    console.log("Adding message", text, type, image, location)
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
    if (location) {
        console.log("Adding location button", location)
        const location_btn = document.createElement('a');
        location_btn.href = location
        location_btn.target = "_blank"
        location_btn.textContent = "இடத்தைக் காட்டு"
        location_btn.classList.add("btn")
        messageDiv.appendChild(location_btn);
    }

    if (live_url) {
        const live_div = document.createElement('div');
        live_div.classList.add("video-container")
        const live_box = document.createElement('iframe');
        live_box.src = live_url
        live_box.style.border = "none"
        live_box.style.width = "100%"
        live_box.style.height = "100%"
        live_box.title = "Live Stream"
        live_box.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        live_box.allowFullscreen = true
        live_div.appendChild(live_box)
        messageDiv.appendChild(live_div)
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