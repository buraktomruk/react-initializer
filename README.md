# Custom React Setup 🚀

A CLI tool to bootstrap modern React applications with your preferred configuration (no `create-react-app` required).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## 🌟 Why Not Create-React-App?
While `create-react-app` (CRA) is great for beginners, this setup offers:
- **Full control** over Webpack/Babel configs 🔧
- **60% smaller** initial dependencies 📦
- **Optional features** (only what you need) ✅
- **Modern defaults** (Webpack 5, Babel 7, React 18) ⚡
- **No ejection** required for customization 🚫
- **Tailwind CSS** integrated from start 🎨
- **Production-optimized** builds 🚀

## 🚀 Quick Start
### Run Directly with npx
```bash
npx github:buraktomruk/react-initializer my-app
```
## Or Clone and Run Locally

# 1. Clone repository
```bash
git clone https://github.com/buraktomruk/react-initializer.git
```
# 2. Navigate to project
```bash
cd react-initializer
```

# 3. Make the script executable (Linux/macOS)
```bash
chmod +x setup-react-app.js
```

# 4. Run the CLI
```bash
./setup-react-app.js my-app
```

## 💻 Alternative Installation
```bash
node setup-react-app.js
```


## 🛠️ Interactive Setup
### The CLI will guide you through configuration:

```bash
? Project name: my-app
? Use TypeScript? (y/n) y
? Use Tailwind CSS? (y/n) y
? Use ESLint? (y/n) y
? Use React Router? (y/n) y
? Use Redux Toolkit? (y/n) y
? Use Testing Library? (y/n) y
```