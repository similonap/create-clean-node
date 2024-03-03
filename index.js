#!/usr/bin/env node

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');

async function createProject(template, projectName) {
  const currentDir = process.cwd();
  const projectDir = path.resolve(currentDir, projectName);
  fs.mkdirSync(projectDir, { recursive: true });

  const templateDir = path.resolve(__dirname, template);
  fs.cpSync(templateDir, projectDir, { recursive: true });

  const projectPackageJsonPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(projectPackageJsonPath)) {
    const projectPackageJson = require(projectPackageJsonPath);
    projectPackageJson.name = projectName;
    fs.writeFileSync(
      projectPackageJsonPath,
      JSON.stringify(projectPackageJson, null, 2)
    );
  } else {
    console.error('Error: package.json does not exist in the template directory.');
    process.exit(1);
  }

  // Install base dependencies
  spawn.sync('npm', ['install'], { stdio: 'inherit', cwd: projectDir });

  console.log('Success! Your new project is ready.');
  console.log(`Created ${projectName} at ${projectDir}`);

}

async function createExpressProject(projectName) {
  let template = "template_node";
  
  const installEJS = await inquirer.prompt(
    {
      type: 'confirm',
      name: 'installReadlineSync',
      message: 'Do you want to install and enable EJS?',
      default: true 
    }
  );
  if (installEJS) {
    template = "template_express_ejs";
  }

  await createProject(template, projectName);
}

async function createNodeProject(projectName) {
  let template = "template_node";

  const installReadlineSync = await inquirer.prompt(
    {
      type: 'confirm',
      name: 'installReadlineSync',
      message: 'Do you want to install the readline-sync library?',
      default: false // Default no installation
    }
  );

  if (installReadlineSync) {
    template = "template_node_readline";
  }
  await createProject(template, projectName);
}

async function setupProject() {
  const inquirer = (await import("inquirer")).default;
  try {
    let result = await inquirer.prompt({
      type: 'list',
      name: 'projectType',
      message: 'What type of project would you like to create?',
      choices: ['Node.js', 'Express.js'],
      default: 'Simple Node.js',
    });

    let projectName = await inquirer.prompt(
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
        validate: function (input) {
          if (/^[\w-]+$/.test(input)) return true;
          return 'Project name can only include letters, numbers, underscores, and hyphens.';
        }
      });

    if (result.projectType === 'Express.js') {
      createExpressProject(projectName.projectName);
    } else if (result.projectType === 'Node.js') {
      createNodeProject(projectName.projectName);
    }



  } catch (error) {
    console.error('An error occurred:', error);
  }
}

setupProject();
