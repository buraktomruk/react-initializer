#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Project configuration
let projectConfig = {
  name: "",
  useTypeScript: false,
  useTailwind: false,
  useEslint: false,
  useRouter: false,
  useRedux: false,
  useTestingLibrary: false,
};

// Welcome message
console.log(
  "\x1b[36m%s\x1b[0m",
  "✨ Welcome to the Custom React Setup Package! ✨"
);
console.log(
  "This utility will help you create a new React application without create-react-app.\n"
);

// Ask for project name
function askProjectName() {
  rl.question("What is the name of your project? ", (answer) => {
    projectConfig.name = answer || "my-react-app";
    askTypeScript();
  });
}

// Ask for TypeScript
function askTypeScript() {
  rl.question("Would you like to use TypeScript? (y/n) ", (answer) => {
    projectConfig.useTypeScript = answer.toLowerCase() === "y";
    askTailwind();
  });
}

// Ask for Tailwind
function askTailwind() {
  rl.question("Would you like to use Tailwind CSS? (y/n) ", (answer) => {
    projectConfig.useTailwind = answer.toLowerCase() === "y";
    askEslint();
  });
}

// Ask for ESLint
function askEslint() {
  rl.question("Would you like to use ESLint? (y/n) ", (answer) => {
    projectConfig.useEslint = answer.toLowerCase() === "y";
    askRouter();
  });
}

// Ask for React Router
function askRouter() {
  rl.question("Would you like to use React Router? (y/n) ", (answer) => {
    projectConfig.useRouter = answer.toLowerCase() === "y";
    askRedux();
  });
}

// Ask for Redux
function askRedux() {
  rl.question("Would you like to use Redux Toolkit? (y/n) ", (answer) => {
    projectConfig.useRedux = answer.toLowerCase() === "y";
    askTestingLibrary();
  });
}

// Ask for Testing Library
function askTestingLibrary() {
  rl.question(
    "Would you like to use React Testing Library? (y/n) ",
    (answer) => {
      projectConfig.useTestingLibrary = answer.toLowerCase() === "y";
      createProject();
    }
  );
}

// Create project
function createProject() {
  console.log("\n🚀 Creating your React project...");

  // Create project directory
  const projectPath = path.join(process.cwd(), projectConfig.name);
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, {
      recursive: true,
    });
  }

  // Change to project directory
  process.chdir(projectPath);

  // Initialize package.json
  console.log("📦 Initializing package.json...");
  execSync("npm init -y", {
    stdio: "inherit",
  });

  // Install React
  console.log("⚛️ Installing React...");
  execSync("npm install react react-dom", {
    stdio: "inherit",
  });

  // Install Webpack
  console.log("🛠️ Installing Webpack...");
  execSync(
    "npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin",
    {
      stdio: "inherit",
    }
  );

  // Install Babel
  console.log("🔄 Installing Babel...");
  execSync(
    "npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader",
    {
      stdio: "inherit",
    }
  );

  // Create babel.config.js
  console.log("📝 Creating babel.config.js...");
  fs.writeFileSync(
    path.join(projectPath, "babel.config.js"),
    `module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};`
  );

  // Install TypeScript if requested
  if (projectConfig.useTypeScript) {
    console.log("📘 Installing TypeScript...");
    execSync(
      "npm install --save-dev typescript @types/react @types/react-dom ts-loader @babel/preset-typescript",
      {
        stdio: "inherit",
      }
    );

    // Update babel.config.js for TypeScript
    fs.writeFileSync(
      path.join(projectPath, "babel.config.js"),
      `module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ]
};`
    );

    // Create tsconfig.json
    fs.writeFileSync(
      path.join(projectPath, "tsconfig.json"),
      `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
`
    );
  }

  // Install Tailwind if requested
  if (projectConfig.useTailwind) {
    console.log("🎨 Installing Tailwind CSS...");
    try {
      // Install updated dependencies
      execSync(
        "npm install --save-dev tailwindcss postcss autoprefixer postcss-loader css-loader style-loader @tailwindcss/postcss postcss-import",
        {
          stdio: "inherit",
        }
      );

      // Create the tailwind.config.js
      console.log("📝 Creating Tailwind configuration...");
      fs.writeFileSync(
        path.join(projectPath, "tailwind.config.js"),
        `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
      );

      // Create updated PostCSS config
      fs.writeFileSync(
        path.join(projectPath, "postcss.config.js"),
        `module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {
      tailwindcss: './tailwind.config.js'
    },
    autoprefixer: {},
  }
}`
      );

      // Update webpack CSS rule
      const cssRule = `{
      test: /\\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    },`;

      // Create styles directory and main CSS file
      if (!fs.existsSync(path.join(projectPath, "src", "styles"))) {
        fs.mkdirSync(path.join(projectPath, "src", "styles"), {
          recursive: true,
        });
      }

      fs.writeFileSync(
        path.join(projectPath, "src", "styles", "main.css"),
        `@tailwind base;
@tailwind components;
@tailwind utilities;`
      );

      // Update webpack.config.js creation
      const webpackConfig = `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ... existing config
  module: {
    rules: [
      {
        test: /\\.${projectConfig.useTypeScript ? "tsx?$" : "jsx?$"}/, 
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      ${cssRule}
    ],
  },
  // ... rest of config
};`;

      fs.writeFileSync(
        path.join(projectPath, "webpack.config.js"),
        webpackConfig
      );
    } catch (error) {
      console.error("⚠️ Error setting up Tailwind CSS:", error.message);
      console.log("Creating minimal CSS setup instead...");

      // Fallback remains the same
    }
  }
  // Install ESLint if requested
  if (projectConfig.useEslint) {
    console.log("🧹 Installing ESLint...");
    execSync(
      "npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks",
      {
        stdio: "inherit",
      }
    );

    // Create .eslintrc.js
    fs.writeFileSync(
      path.join(projectPath, ".eslintrc.js"),
      `module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};`
    );

    // Add ESLint ignore file
    fs.writeFileSync(
      path.join(projectPath, ".eslintignore"),
      `node_modules
dist
build`
    );
  }

  // Install React Router if requested
  if (projectConfig.useRouter) {
    console.log("🧭 Installing React Router...");
    execSync("npm install react-router-dom", {
      stdio: "inherit",
    });
  }

  // Install Redux Toolkit if requested
  if (projectConfig.useRedux) {
    console.log("🔄 Installing Redux Toolkit...");
    execSync("npm install @reduxjs/toolkit react-redux", {
      stdio: "inherit",
    });
  }

  // Install Testing Library if requested
  if (projectConfig.useTestingLibrary) {
    console.log("🧪 Installing React Testing Library...");
    execSync(
      "npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom",
      {
        stdio: "inherit",
      }
    );

    // Create jest.config.js
    fs.writeFileSync(
      path.join(projectPath, "jest.config.js"),
      `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};`
    );

    // Create setupTests.js
    if (!fs.existsSync(path.join(projectPath, "src"))) {
      fs.mkdirSync(path.join(projectPath, "src"), {
        recursive: true,
      });
    }

    fs.writeFileSync(
      path.join(projectPath, "src", "setupTests.js"),
      `import '@testing-library/jest-dom';`
    );
  }

  // Create webpack configuration
  console.log("⚙️ Creating webpack configuration...");

  const webpackConfig = `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.${projectConfig.useTypeScript ? "tsx" : "jsx"}',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'${
      projectConfig.useTypeScript ? ", '.ts', '.tsx'" : ""
    }],
  },
  module: {
    rules: [
      {
        test: /\\.${projectConfig.useTypeScript ? "tsx?$" : "jsx?$"}/, 
        exclude: /node_modules/,
        use: 'babel-loader',
      },${
        projectConfig.useTailwind
          ? `
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },`
          : `
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      },`
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
};`;

  fs.writeFileSync(path.join(projectPath, "webpack.config.js"), webpackConfig);

  // Create public directory and index.html
  if (!fs.existsSync(path.join(projectPath, "public"))) {
    fs.mkdirSync(path.join(projectPath, "public"), {
      recursive: true,
    });
  }

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${projectConfig.name}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

  fs.writeFileSync(path.join(projectPath, "public", "index.html"), indexHtml);

  // Create source directory and files
  if (!fs.existsSync(path.join(projectPath, "src"))) {
    fs.mkdirSync(path.join(projectPath, "src"), {
      recursive: true,
    });
  }

  const extension = projectConfig.useTypeScript ? "tsx" : "jsx";

  // Create App component
  let appContent;

  if (projectConfig.useTailwind) {
    appContent = `import ${
      projectConfig.useTypeScript ? 'React from "react";' : ""
    }
${projectConfig.useTailwind ? `import './styles/main.css';` : ""}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to ${
          projectConfig.name
        }!</h1>
        <p className="text-gray-600">Your custom React app is ready for development.</p>
      </div>
    </div>
  );
}

export default App;`;
  } else {
    appContent = `import ${
      projectConfig.useTypeScript ? 'React from "react";' : ""
    }

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome to ${
          projectConfig.name
        }!</h1>
        <p>Your custom React app is ready for development.</p>
      </div>
    </div>
  );
}

export default App;`;
  }

  fs.writeFileSync(
    path.join(projectPath, "src", `App.${extension}`),
    appContent
  );

  // Create index file
  let indexContent;

  if (projectConfig.useRouter && projectConfig.useRedux) {
    indexContent = `import ${
      projectConfig.useTypeScript ? 'React from "react";' : ""
    }
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);`;
  } else if (projectConfig.useRouter) {
    indexContent = `import ${
      projectConfig.useTypeScript ? 'React from "react";' : ""
    }
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);`;
  } else if (projectConfig.useRedux) {
    indexContent = `import ${
      projectConfig.useTypeScript ? 'React from "react";' : ""
    }
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);`;
  } else {
    indexContent = `import ${
      projectConfig.useTypeScript ? 'React from "react";' : ""
    }
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);`;
  }

  fs.writeFileSync(
    path.join(projectPath, "src", `index.${extension}`),
    indexContent
  );

  // Create Redux store if requested
  if (projectConfig.useRedux) {
    // Create store directory
    if (!fs.existsSync(path.join(projectPath, "src", "store"))) {
      fs.mkdirSync(path.join(projectPath, "src", "store"), {
        recursive: true,
      });
    }

    // Create store.js
    const storeContent = `import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});`;

    fs.writeFileSync(
      path.join(
        projectPath,
        "src",
        "store",
        `index.${projectConfig.useTypeScript ? "ts" : "js"}`
      ),
      storeContent
    );

    // Create slices directory
    if (!fs.existsSync(path.join(projectPath, "src", "store", "slices"))) {
      fs.mkdirSync(path.join(projectPath, "src", "store", "slices"), {
        recursive: true,
      });
    }

    // Create counterSlice.js
    const counterSliceContent = `import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;`;

    fs.writeFileSync(
      path.join(
        projectPath,
        "src",
        "store",
        "slices",
        `counterSlice.${projectConfig.useTypeScript ? "ts" : "js"}`
      ),
      counterSliceContent
    );
  }

  // Update package.json scripts
  console.log("📝 Updating package.json scripts...");
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.scripts = {
    start: "webpack serve",
    build: "webpack --mode production",
    ...(projectConfig.useTestingLibrary
      ? {
          test: "jest",
        }
      : {}),
    ...(projectConfig.useEslint
      ? {
          lint: "eslint src",
        }
      : {}),
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create .gitignore
  fs.writeFileSync(
    path.join(projectPath, ".gitignore"),
    `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build
/dist

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*`
  );

  // Create README.md
  const readmeContent = `# ${projectConfig.name}

This project was bootstrapped with a custom React setup.

## Available Scripts

In the project directory, you can run:

### \`npm start\`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### \`npm run build\`

Builds the app for production to the \`dist\` folder.

${
  projectConfig.useTestingLibrary
    ? `### \`npm test\`

Launches the test runner.
`
    : ""
}
${
  projectConfig.useEslint
    ? `### \`npm run lint\`

Runs ESLint to check for code issues.
`
    : ""
}
`;

  fs.writeFileSync(path.join(projectPath, "README.md"), readmeContent);

  console.log("\n✅ Project created successfully!");
  console.log(`\nTo get started:
  cd ${projectConfig.name}
  npm start\n`);

  rl.close();
}

// Start the process
askProjectName();
