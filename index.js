#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
// const argv = yargs(hideBin(process.argv)).argv


// If just one argument is passed, it will be the project name
var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: $0 [options]')
  .alias('p', 'projectName')
  .describe('p', 'Name of the project')
  .choices('projectType', ['Express.js', 'Node.js'])
  .alias('t', 'projectType')
  .describe('t', 'Type of the project')
  .help('help')
  .parse()
if (argv._.length === 1 && !argv.projectName) {
  argv.projectName = argv._[0];
}

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
  let template = "template_express_ejs";
  await createProject(template, projectName);
}

async function createNodeProject(projectName) {
  const inquirer = (await import("inquirer")).default;
  let template = "template_node";
  await createProject(template, projectName);
}

async function promptProjectName() {
  const inquirer = (await import("inquirer")).default;
  if (argv.projectName) return { projectName: argv.projectName };
  return await inquirer.prompt(
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      validate: function (input) {
        if (/^[\w-]+$/.test(input)) return true;
        return 'Project name can only include letters, numbers, underscores, and hyphens.';
      }
    });
}

async function promptProjectType() {
  const inquirer = (await import("inquirer")).default;
  let choices = ['Express.js', 'Node.js'];
  if (argv.projectType) {
    if (choices.includes(argv.projectType)) {
      return { projectType: argv.projectType };
    } else {
      console.error('Invalid project type. Please choose from Express.js or Node.js.');
      process.exit(1);
    }
  }
  return await inquirer.prompt(
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project would you like to create?',
      choices: choices
    });
}

async function setupProject() {
  try {
    let result = await promptProjectType();
    let projectName = await promptProjectName();

    if (result.projectType === 'Express.js') {
      await createExpressProject(projectName.projectName);
    } else if (result.projectType === 'Node.js') {
      await createNodeProject(projectName.projectName);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

setupProject();
