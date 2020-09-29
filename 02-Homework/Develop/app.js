const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const getEmployees = async (employees = []) => {
    const questionTemplte = 'What is the employee\'s'
    const generalPrompt = [
        {
            name: 'name',
            type: 'input',
            message: `${questionTemplte} name`
        },
        {
            name: 'id',
            type: 'input',
            message: `${questionTemplte} id`
        },
        {
            name: 'email',
            type: 'input',
            message: `${questionTemplte} email`
        },
        {
            name: 'role',
            type: 'list',
            message: `${questionTemplte} role`,
            choices: [
                'Intern',
                'Engineer',
                'Manager'
            ]
        }
    ]

    const { ...response } = await inquirer.prompt(generalPrompt);


    const confirmPrompt = {
        name: 'confirm',
        type: 'confirm',
        message: 'Do you want to keep adding employees?'
    };

    const rolePrompt = {
        name: 'roleInfo',
        type: 'input',
    }
    
    if(response.role === 'Intern') {
        rolePrompt.message = `${questionTemplte} school`
    }
    if(response.role === 'Engineer') {
        rolePrompt.message = `${questionTemplte} GitHub`
    }
    if(response.role === 'Manager') {
        rolePrompt.message = `${questionTemplte} office`
    }

    const { confirm, ...roleResponse } = await inquirer.prompt([rolePrompt, confirmPrompt]);

    if(response.role === 'Intern') {
        employee = new Intern(response.name, response.id, response.email, roleResponse.roleInfo)
    }
    if(response.role === 'Engineer') {
        employee = new Engineer(response.name, response.id, response.email, roleResponse.roleInfo)
    }
    if(response.role === 'Manager') {
        employee = new Manager(response.name, response.id, response.email, roleResponse.roleInfo)
    }
    const newEmployees = [...employees, employee]
    return confirm ? getEmployees(newEmployees) : newEmployees;
};

const main = async () => {

    const employees = await getEmployees();
    fs.writeFile(outputPath, render(employees), (err) => {
        try{
            if(err) {
                throw err
            }
            console.log('saved')
        }
        catch(err){
            console.warn(err)d
        }
    })
}

main();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
