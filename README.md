# 🐾 CatBot — Your Cheerful Nika Companion

CatBot is a fun, friendly chatbot designed to boost motivation and spark joy for the amazing team at [Nika.eco](https://www.nikaplanet.com/carbon). Built using OpenAI's Assistants API and React, CatBot remembers your chats and even fetches cute cats (coming soon 🐱)!

---

## 🚀 Tech Stack

### 🖥️ Frontend

- **React.js**
- **Axios** — for HTTP requests to the backend
- **CSS** — custom chat UI
- **localStorage** — to store `threadId` and maintain memory between refreshes

### ⚙️ Backend

- **Node.js**
- **Express.js** — REST API routing
- **dotenv** — manages API keys via `.env` file

---

## 🔐 API Key & Credential Security

- `.env` file stores secrets like OpenAI and CatAPI keys
- Keys are accessed server-side using `dotenv`
- **Never exposed to frontend**
- `.gitignore` ensures `.env` is not tracked by Git

---

## 💡 Features

- ✅ Persistent memory using OpenAI **Assistant + Thread API**
- ✅ `threadId` stored in localStorage to resume chats after refresh
- ✅ Chat bubbles with:
  - Bot messages on **left** (light green)
  - User messages on **right** (dark green)
- ✅ Typing indicator while waiting for response
- ✅ Reset Chat button
- ✅ Markdown rendering for nicer formatting
- ✅ Cute, motivating, climate-conscious cat messages 😺🌱

---

## 📋 To-Do

### 🔧 Functionality

- [ ] **CatAPI Integration**
  - Triggered by OpenAI function calling
  - Support custom breeds & multiple image requests
- [ ] Store & restore **chat history** from memory
- [ ] Support multiple chat threads per user (advanced)
- [ ] (Optional) Login system with persistent threads via Supabase/Firebase

### 🎨 UI/UX Improvements

- [ ] Limit message bubble **width** to ~60–70% of screen
- [ ] Use full **vertical space** on page
- [ ] Add **timestamps** to each message
- [ ] Improve layout on smaller screens (responsive)
- [ ] Optional: **Dark mode toggle**

---

## 📦 Folder Structure

```
CatBot/
├── backend/
│   ├── server.js
│   ├── .env
│   └── catbotPrompt.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.js
│   │   │   ├── ChatInput.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── styles/
│   │   │   ├── ChatWindow.css
│   │   │   └── ChatInput.css
├── .gitignore
```

---

## 🛠️ Setup Instructions

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env`:

```env
OPENAI_API_KEY=sk-...
CAT_API_KEY=live_...
```

Start the server:

```bash
node server.js
```

### 💻 Frontend Setup

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

## ✨ Demo Prompt

```vbnet
User: Hey CatBot! I need a boost 😿
Bot: You’ve got this, Brandon! 💪🌍 Every action at Nika adds up to a better world. Want to see a cat for motivation? 😺
```

---

## 👨‍💻 Author

Made by **Brandon**  
Built for the incredible team at [Nika.eco](https://www.nikaplanet.com/carbon)  
🐱🌿 Inspiring change — one cheerful chat at a time.
