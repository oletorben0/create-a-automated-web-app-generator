// elq0_create_a_automa.js

// Import required modules
const express = require('express');
const fs = require('fs');
const handlebars = require('handlebars');
const inquirer = require('inquirer');

// Create an express app
const app = express();

// Define the templates directory
const templatesDir = './templates';

// Define the output directory
const outputDir = './generated-apps';

// Define the available templates
const templates = [
  {
    name: 'Basic Web App',
    template: 'basic-web-app',
  },
  {
    name: 'Blog',
    template: 'blog',
  },
  {
    name: 'E-commerce',
    template: 'e-commerce',
  },
];

// Define the questions to ask the user
const questions = [
  {
    type: 'list',
    name: 'template',
    message: 'Choose a template:',
    choices: templates.map((template) => template.name),
  },
  {
    type: 'input',
    name: 'appName',
    message: 'Enter the app name:',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Enter your name:',
  },
];

// Define the generateApp function
async function generateApp(answers) {
  // Get the selected template
  const template = templates.find((template) => template.name === answers.template);

  // Create the app directory
  const appDir = `${outputDir}/${answers.appName}`;
  fs.mkdirSync(appDir);

  // Generate the app files
  const files = [
    {
      filename: 'index.html',
      content: generateIndexHtml(answers, template),
    },
    {
      filename: 'package.json',
      content: generatePackageJson(answers),
    },
  ];

  files.forEach((file) => {
    fs.writeFileSync(`${appDir}/${file.filename}`, file.content);
  });

  console.log(`App generated successfully in ${appDir}`);
}

// Define the generateIndexHtml function
function generateIndexHtml(answers, template) {
  // Get the template file
  const templateFile = `${templatesDir}/${template.template}.hbs`;
  const templateContent = fs.readFileSync(templateFile, 'utf8');

  // Compile the template
  const compiledTemplate = handlebars.compile(templateContent);

  // Render the template
  const html = compiledTemplate(answers);

  return html;
}

// Define the generatePackageJson function
function generatePackageJson(answers) {
  return `{
  "name": "${answers.appName}",
  "version": "1.0.0",
  "author": "${answers.author}",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
`;
}

// Start the app generation process
app.get('/', (req, res) => {
  inquirer.prompt(questions).then((answers) => {
    generateApp(answers);
    res.send('App generated successfully!');
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});