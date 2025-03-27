# 🐾 CatBot – The Purrfect Chat Companion

CatBot is a delightful AI-powered chatbot that streams cute cat images and facts in real-time! Built with OpenAI's Assistant API and TheCatAPI, you can chat with CatBot and ask for specific breeds, request multiple images, and enjoy a smooth, persistent conversation experience.

---

## ✅ Features

- 💬 **Conversational Chat** with OpenAI Assistant API (`gpt-4o-mini`)
- 📷 **Cat Images on Demand** – Powered by TheCatAPI
- 🐈‍⬛ **Supports Specific Breeds** – e.g., "Show me a Siamese cat"
- 🖼️ **Multiple Image Support** – Ask for more than one image!
- ⚡ **Streaming Response Support** – Instant typing feedback and incremental loading
- 💾 **Persistent Threads** using `localStorage` (continue where you left off after refresh!)

---

## 🧑‍💻 Tech Stack

### 🖥️ Frontend

- **React.js**
- **Axios** – For communicating with the backend
- **CSS** – For styling the chat interface
- **localStorage** – Stores `threadId` and messages for persistence

### ⚙️ Backend

- **Node.js**
- **Express.js** – API routing
- **dotenv** – Securely manages environment variables (e.g., API keys)
- **OpenAI Assistant API** – Handles assistant logic and tool calling
- **TheCatAPI** – Source of all adorable cat images

---

## 🔒 Security

- API Keys are stored safely in a `.env` file and **never exposed to the frontend**
- `.gitignore` ensures `.env` is never committed to Git

---

## 📂 File Overview

```
/backend
  ├── server.js                # Express server
  ├── services/
  │   └── assistantService.js  # Handles chat, streaming, and tool calling
  ├── functions/
  │   └── getCatImage.js       # Fetches cat images from TheCatAPI
  └── catbotPrompt.js          # Custom assistant instructions

/frontend
  ├── components/
  │   ├── ChatInput.js
  │   └── ChatWindow.js
  ├── App.js
  └── styles/
      └── App.css, ChatWindow.css, ChatInput.css
```

---

## 🐞 Known Bugs

- 🔄 Chat only scrolls to the **start** of new messages (not entire message)
- 🧱 Occasional weird **spacing issues**
- 📋 Bullet points may **format incorrectly**

---

## 🚀 Running the Project

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env  # Add your OpenAI and CatAPI keys
node server.js
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The app will be available at:

```
Frontend: http://localhost:3000
Backend:  http://localhost:5001
```

---

## 💡 Example Prompts to Try

- "Show me a cat"
- "Can I see 5 Persian cats?"
- "Tell me a fun cat fact"

---

## 📬 Feedback

Issues? Suggestions? Feature ideas? Open a GitHub issue or contact us!

---

## 👨‍💻 Author

Made by **Brandon**  
Built for the incredible team at [Nika.eco](https://www.nikaplanet.com/carbon)  
🐱🌿 Inspiring change — one cheerful chat at a time.
