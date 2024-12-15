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
        const response = await fetch('http://localhost:5000/Datajson'); // Update the path if necessary
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

function renderQuestions(data) {
    const questionsContainer = document.querySelector('.chat-questions ul');
    questionsContainer.innerHTML = ''; // Clear existing questions

    data.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.question}`;
        li.onclick = () => handleQuestionClick(item.question, data);
        questionsContainer.appendChild(li);
    });
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
        addMessage(subquestion.answer, 'bot', subquestion.image);

        // Automatically go back to the parent question list after displaying the answer
        const parentData = questionStack.pop(); // Get the parent questions from the stack
        if (parentData) {
            renderQuestions(parentData);
        }
    }, 500);
}

function addMessage(text, type, image = "", isTyping = false) {
    const chatOutput = document.getElementById('chatOutput');

    // Create a new message container
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type); // Assign type-specific class (e.g., 'user' or 'bot')

    // Handle typing indicator
    if (isTyping) {
        const typingIndicator = document.createElement('span');
        typingIndicator.textContent = "Typing...";
        typingIndicator.classList.add('typing-indicator');
        messageDiv.appendChild(typingIndicator);

        // Add the typing indicator to the chat
        const li = document.createElement('li');
        li.appendChild(messageDiv);
        chatOutput.appendChild(li);

        // Scroll to the bottom of the chat to show the typing animation
        chatOutput.scrollTop = chatOutput.scrollHeight;

        return messageDiv; // Return the message div to update it later
    }

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
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Example of adding typing animation in handleQuestionClick
function handleQuestionClick(question, parentData) {
    const botResponse = responses[question];

    // Add the user's question as a message
    addMessage(question, 'user');

    if (botResponse) {
        // Show typing animation
        const typingDiv = addMessage("", 'bot', "", true);

        setTimeout(() => {
            // Replace typing animation with the bot's response
            typingDiv.remove(); // Remove typing animation
            addMessage(botResponse.answer, 'bot', botResponse.image);
        }, 500); // Adjust delay as needed
    } else {
        setTimeout(() => addMessage("I'm sorry, I don't have an answer for that.", 'bot'), 1500);
    }
}

// Initialize data loading
loadData();



//  --------------------------------------------------------------------------------

// // Get menu button and container elements
// const menuBtn = document.getElementById("menuBTN");
// const menuContiner = document.getElementById('active');

// menuBtn.addEventListener('click', () => {
//     menuBtn.classList.toggle('opened');
//     menuBtn.setAttribute('aria-expanded', menuBtn.classList.contains('opened'));
//     menuContiner.classList.toggle('visible');
// });

// let responses = {};
// let questionStack = []; // Stack to track question navigation

// // Load data from Data.json
// async function loadData() {
//     try {
//         const response = await fetch('http://localhost:5000/Datajson'); // Update the path if necessary
//         const data = await response.json();

//         // Populate the responses object including subquestions
//         data.forEach(item => {
//             responses[item.question] = {
//                 answer: item.answer || "No answer available",
//                 image: item.image || "",
//                 subquestions: item.subquestion || []
//             };
//         });

//         // Render top-level questions in the UI
//         renderQuestions(data);
//     } catch (error) {
//         console.error('Error loading data:', error);
//     }
// }

// function renderQuestions(data) {
//     const questionsContainer = document.querySelector('.chat-questions ul');
//     questionsContainer.innerHTML = ''; // Clear existing questions

//     data.forEach((item, index) => {
//         const li = document.createElement('li');
//         li.textContent = `${index + 1}. ${item.question}`;
//         li.onclick = () => handleQuestionClick(item.question, data);
//         questionsContainer.appendChild(li);
//     });
// }

// function renderSubquestions(parentQuestion, subquestions) {
//     const questionsContainer = document.querySelector('.chat-questions ul');
//     questionsContainer.innerHTML = ''; // Clear existing questions

//     subquestions.forEach((item, index) => {
//         const li = document.createElement('li');
//         li.textContent = `${index + 1}. ${item.question}`;
//         li.onclick = () => handleSubquestionClick(parentQuestion, item);
//         questionsContainer.appendChild(li);
//     });
// }

// function handleQuestionClick(question, parentData) {
//     const botResponse = responses[question];

//     // Add the user's question as a message
//     addMessage(question, 'user');

//     // Check if the question has subquestions
//     if (botResponse && botResponse.subquestions.length > 0) {
//         // Save the current questions to the stack
//         questionStack.push(parentData);

//         // Render the subquestions dynamically
//         renderSubquestions(question, botResponse.subquestions);
//     } else if (botResponse) {
//         // Add the bot's answer as a message after a delay
//         setTimeout(() => addMessage(botResponse.answer, 'bot', botResponse.image), 500);
//     } else {
//         // Handle the case where no answer is available
//         setTimeout(() => addMessage("I'm sorry, I don't have an answer for that.", 'bot'), 500);
//     }
// }

// function handleSubquestionClick(parentQuestion, subquestion) {
//     addMessage(subquestion.question, 'user');
//     setTimeout(() => {
//         addMessage(subquestion.answer, 'bot', subquestion.image);

//         // Automatically go back to the parent question list after displaying the answer
//         const parentData = questionStack.pop(); // Get the parent questions from the stack
//         if (parentData) {
//             renderQuestions(parentData);
//         }
//     }, 500);
// }

// function addMessage(text, type, image = "") {
//     const chatOutput = document.getElementById('chatOutput');

//     // Create a new message container
//     const messageDiv = document.createElement('div');
//     messageDiv.classList.add('message', type); // Assign type-specific class (e.g., 'user' or 'bot')

//     // Format the text content (replace newlines with <br> for rendering)
//     const formattedText = text.replace(/\r?\n/g, '<br>');

//     // Create a span to hold the text
//     const textSpan = document.createElement('span');
//     textSpan.innerHTML = formattedText; // Use innerHTML to support <br> tags
//     messageDiv.appendChild(textSpan);

//     // If an image URL is provided, include the image in the message
//     if (image) {
//         const img = document.createElement('img');
//         img.src = image;
//         img.alt = "Response Image";
//         img.style.maxWidth = "100%";
//         img.style.borderRadius = "8px";

//         // Handle case where the image might not load
//         img.onerror = () => {
//             console.warn(`Image not found: ${image}`);
//             img.remove(); // Remove the image if it can't load
//         };

//         messageDiv.appendChild(img);
//     }

//     // Add the new message to the chat output container
//     const li = document.createElement('li');
//     li.appendChild(messageDiv);
//     chatOutput.appendChild(li);

//     // Scroll to the bottom of the chat to show the latest message
//     chatOutput.scrollTop = chatOutput.scrollHeight;
// }

// // Initialize data loading
// loadData();