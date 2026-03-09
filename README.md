# A's Bistro - Restaurant Chatbot

A Node.js chatbot for restaurant order management served through a browser-based chat interface. Users interact with the bot by selecting numbered options to browse the menu, build an order, check out and view their order history.

Sessions are persisted in MongoDB, so a user's current order and history survive page refreshes within the same socket session.

---

## Table of Contents

- [A's Bistro - Restaurant Chatbot](#as-bistro---restaurant-chatbot)
  - [Table of Contents](#table-of-contents)
  - [How It Works](#how-it-works)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the App](#running-the-app)
  - [Usage](#usage)
    - [Commands](#commands)
    - [Menu](#menu)
  - [License](#license)

---

## How It Works

When a user opens the app, a Socket.io connection is established and the bot sends a welcome message with the available commands. The user types a number to interact. Selecting `1` displays the menu, after which they can pick items by number. Items are added to their current order until they type `99` to check out.

Each socket connection has a unique session ID. The session (current order, order history and state flags) is stored in MongoDB so the bot can track where each user is in the ordering flow.

```
User connects
    |
    v
Bot sends welcome message + command list
    |
    v
User types 1 --> Bot displays menu
    |
    v
User selects item numbers --> Items added to current order
    |
    v
User types 99 --> Order checked out, moved to order history
```

---

## Tech Stack

| Layer                   | Technology                    |
| ----------------------- | ----------------------------- |
| Runtime                 | Node.js                       |
| Framework               | Express.js                    |
| Real-time Communication | Socket.io                     |
| Database                | MongoDB (via Mongoose)        |
| Frontend                | Vanilla HTML, CSS, JavaScript |

---

## Project Structure

```
restaurant-chatbot/
├── config/
│   └── db.js                # MongoDB connection
├── controllers/
│   └── chatController.js    # Message handling and order logic
├── models/
│   └── userSession.js       # Mongoose schema for session state
├── public/
│   ├── index.html           # Chat UI
│   ├── script.js            # Socket.io client + DOM logic
│   └── styles.css
├── server.js                # Express + Socket.io server
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB database (local or hosted e.g., MongoDB Atlas)

### Installation

```bash
git clone https://github.com/adetolaa99/restaurant-chatbot.git
cd restaurant-chatbot
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/restaurant-chatbot
```

### Running the App

```bash
npm start
```

Open your browser and go to `http://localhost:3000`.

---

## Usage

### Commands

| Input | Action                                               |
| ----- | ---------------------------------------------------- |
| `1`   | Browse the menu and start adding items               |
| `1–5` | Select a menu item by number (only after typing `1`) |
| `97`  | View your current order                              |
| `98`  | View your order history                              |
| `99`  | Check out and place your current order               |
| `0`   | Cancel your current order                            |

### Menu

| #   | Item              | Price  |
| --- | ----------------- | ------ |
| 1   | Pizza             | ₦4,780 |
| 2   | Burger            | ₦3,250 |
| 3   | Chicken and Chips | ₦5,125 |
| 4   | Shawarma          | ₦3,100 |
| 5   | Milkshake         | ₦2,500 |

> The menu is currently fixed in `controllers/chatController.js`. To update items or prices, edit the `menuItems` array in that file.

---

## License

This project is licensed under the [MIT License](LICENSE).

---
