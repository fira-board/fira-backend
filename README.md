
# Fira Application

This document provides instructions on how to set up, configure, and run the Fira application. Ensure you have the necessary environment variables and dependencies installed before proceeding.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** (>= 14.x recommended)
- **Docker** (optional, for containerized deployment)
- **MongoDB** instance (either local or cloud-based)
- **Azure Services** (for storage, OpenAI, and communication APIs)
  
---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/fira-app.git
   cd fira-app
   ```

2. **Install Dependencies:**

   Run the following command to install the required packages:

   ```bash
   npm install
   ```

---

## Configuration

1. **Environment Variables:**

   Create a `.env` file in the root directory of the project and add the following variables:

   ```env
   OPENAI_GPT4_MODEL = 'your_openai_gpt4_model_url'
   OPENAI_GPT3_MODEL = 'your_openai_gpt3_model_url'
   OPENAI_API_KEY = 'your_openai_api_key'

   AZURE_STORAGE_CONNECTION_STRING = 'your_azure_storage_connection_string'
   Azure_COMM_SERVICE_CONNECTION_STRING = 'your_azure_comm_service_connection_string'

   MONGO_URI = 'your_mongo_db_uri'

   APP_NAME = 'Fira'
   API_URL = 'https://api.firaboard.ai'
   PORT = 3001

   WEBSITE_URL = 'https://firaboard.ai'
   WEBSITE_PORT = 3000

   SUPER_TOKENS_CORE_URL = 'your_supertokens_core_url'
   SUPER_TOKENS_API_KEY = 'your_supertokens_api_key'
   ```

   > **Note:** Replace `your_*` values with your actual credentials.

---

## Running the Application

### Running Locally

1. **Start the Application:**

   Use the following command to start the app:

   ```bash
   npm start
   ```

2. **Access the Application:**

   - API: [http://localhost:3001](http://localhost:3001)
   - Website: [http://localhost:3000](http://localhost:3000)

### Running with Docker

1. **Build the Docker Image:**

   ```bash
   docker build -t fira-app .
   ```

2. **Run the Docker Container:**

   ```bash
   docker run -p 3001:3001 -p 3000:3000 --env-file .env fira-app
   ```

---

## Usage

Once the app is running, you can interact with it via the API or the web interface.

- **API Endpoints**: View the available API endpoints at `http://localhost:3001/api`.
- **Web Interface**: Access the website at `http://localhost:3000`.

---

## Troubleshooting

- **Environment Variables Not Found**: Make sure you've created the `.env` file with the correct variable values.
- **Port Conflicts**: If ports 3001 or 3000 are in use, update the `PORT` and `WEBSITE_PORT` variables in `.env` to available ports.
- **MongoDB Connection Issues**: Verify your `MONGO_URI` is correct and the MongoDB instance is accessible.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For questions or support, please contact the Fira development team at [support@fira.ai](mailto:support@fira.ai).
