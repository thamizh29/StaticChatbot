# StaticChatbot

A simple Flask-based web application for a chatbot that answers user queries and displays relevant images. The chatbot uses a JSON file as the data source for predefined questions, answers, and associated images.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

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
