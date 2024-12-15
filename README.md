# StaticChatbot

A simple Flask-based web application for a chatbot that answers user queries and displays relevant images. The chatbot uses a JSON file as the data source for predefined questions, answers, and associated images.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)


## Description

`StaticChatbot` is a web-based chatbot built using Flask. It serves questions and answers, dynamically fetching them from a `Data.json` file and displaying relevant images. The application also supports subquestions and has a simple menu to interact with the chatbot.

### Features
- A list of predefined questions that users can click on.
- Dynamic rendering of answers along with images if available.
- Subquestions for further clarification.
- Typing indicator to simulate a real conversation.

## Installation

To set up and run the project on your local machine, follow these steps:

### Prerequisites

- Python 3.6 or higher
- Flask
- Flask-CORS (for handling cross-origin requests)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Vasanth2005kk/StaticChatbot.git
   cd StaticChatbot

    
2. **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. **Install dependencies**
    ```bash
    pip install -r requirements.txt

4. **Run the application:**
    ```bash
    python3 app.py

5. **Open your browser and navigate to http://localhost:5000.**


## Usage

1. After navigating to the home page, you'll see a list of questions.
2. Click on any question to see the bot's answer.
3. If the question has subquestions, clicking on them will show their answers.
4. If there is an image associated with the answer, it will be displayed alongside the text.

## Technologies

- Flask - A Python web framework for building web applications.
- Flask-CORS - For enabling cross-origin requests.
- HTML/CSS - For building the frontend UI.
- JavaScript - For handling interactivity and dynamic content updates.
- JSON - For storing questions, answers, and subquestions.