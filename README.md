# Catch The Offer 🎯

A fun browser-based multiplayer game where players compete to catch job offers on a grid. This project was created for entertainment and pair programming practice.

## 🎮 Game Description

Catch The Offer is an interactive game where 1-4 players move around a grid trying to catch job offers (targets) that appear randomly. The first player to catch the required number of offers wins and gets "hired"! But be careful - if you miss too many offers, you'll be "rejected".

## ✨ Features

- **Multiplayer Support**: Play with 1-4 players simultaneously
- **Customizable Settings**: 
  - Grid sizes: 4x4, 5x5, 7x7, 8x8
  - Points to win (1-50)
  - Misses before losing (1-50)
- **Keyboard Controls**: 
  - Player 1: Arrow keys
  - Player 2: WASD keys
- **Achievement System**: Track your progress and unlock achievements
- **Sound Toggle**: Enable/disable game sounds
- **Responsive UI**: Clean and modern interface

## 🛠️ Technologies

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Backend**: Node.js with WebSocket support (optional)
- **Testing**: Jest with Babel
- **Code Quality**: Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js (for running tests and WebSocket server)
- A modern web browser

### Installation

1. Clone the repository:
git clone <repository-url>
cd CatchTheGoogle2. Install dependencies:h
npm install### Running the Game

**Option 1: Using npx serve**
cd CatchTheGoogle
npx serve -l 8080Then open `http://localhost:8080` in your browser.

**Option 2: Using Python**
cd CatchTheGoogle
python -m http.server 8080**Option 3: Using WebStorm/VS Code**
- Right-click on `index.html` → "Open in Browser"

### Running Tests
sh
npm testFor watch mode:
npm run test:watch## 🎯 How to Play

1. Configure your game settings (grid size, points to win, etc.)
2. Click "START GAME"
3. Move your player to catch the offers (targets) that appear on the grid
4. First player to catch the required number of offers wins!
5. If you miss too many offers, you lose

## 📁 Project Structure
