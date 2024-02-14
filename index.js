#!/usr/bin/env node

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');

async function setupProject() {
  const inquirer = (await import("inquirer")).default;
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
        validate: function(input) {
          if (/^[\w-]+$/.test(input)) return true;
          return 'Project name can only include letters, numbers, underscores, and hyphens.';
        }
      },
      {
        type: 'confirm',
        name: 'installReadlineSync',
        message: 'Do you want to install the readline-sync library?',
        default: false // Default no installation
      }
    ]);

    const { projectName, installReadlineSync } = answers;
    const currentDir = process.cwd();
    const projectDir = path.resolve(currentDir, projectName);
    fs.mkdirSync(projectDir, { recursive: true });

    const templateDir = path.resolve(__dirname, 'template');
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

    // Conditionally install readline-sync if the user requested it
    if (installReadlineSync) {
      console.log('Installing readline-sync...');
      spawn.sync('npm', ['install', 'readline-sync'], { stdio: 'inherit', cwd: projectDir });
      spawn.sync('npm', ['install', '--save-dev', '@types/readline-sync'], { stdio: 'inherit', cwd: projectDir });

     // Prepend import statement to index.ts
     const indexPath = path.join(projectDir, 'index.ts');
     let fileContent = fs.readFileSync(indexPath, { encoding: 'utf8' });
     fileContent = `import readline from 'readline-sync';\n\n` + fileContent;
     fs.writeFileSync(indexPath, fileContent);
    }

    console.log('Success! Your new project is ready.');
    console.log(`Created ${projectName} at ${projectDir}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

setupProject();
