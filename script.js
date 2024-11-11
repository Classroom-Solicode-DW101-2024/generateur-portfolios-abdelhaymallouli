class Project {
    constructor(title, githublink, skills, date) { 
        this.title = title;
        this.githublink = githublink;
        this.skills = skills;
        this.date = date; 
    }
}

class Student{
    constructor(lastName , firstName, email, phone, group){
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.phone = phone;
        this.group = group;
        this.projects = [];
    }

    addProject(project){
        this.projects.push(project);
    }
}

// student part 
function validStudentForm() {
    document.querySelectorAll('.error').forEach((e) => e.textContent = '');

    const lastName = document.getElementById('lastname');
    const firstName = document.getElementById('firstname');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const group = document.getElementById('group');
    let valid = true;

    if (!lastName.value) {
        document.getElementById('lastNameError').textContent = 'Please enter your last name';
        valid = false;
    }
    if (!firstName.value) {
        document.getElementById('firstNameError').textContent = 'First Name is required.';
        valid = false;
    }
    if (!email.value) {
        document.getElementById('emailError').textContent = 'Email is required.';
        valid = false;
    } else if (!email.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        document.getElementById('emailError').textContent = 'Email format is invalid.';
        valid = false;
    }
    if (!phone.value || !phone.value.match(/^\+?212\s?(6|7)\d{1}\s?\d{2}\s?\d{2}\s?\d{2}$/)) {
        document.getElementById('phoneError').textContent = 'Phone format is invalid (expected format: +212 6X XX XX XX or +212 7X XX XX XX)';
        valid = false;
    }
    if (!group.value) {
        document.getElementById('groupError').textContent = 'Group is required.';
        valid = false;
    }
    return valid;
};

document.getElementById('studentForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validStudentForm()) {
        console.log("Form validation failed.");
        return;
    }

    console.log("Form validation passed.");

    const student = new Student(
        document.getElementById('lastname').value,
        document.getElementById('firstname').value,
        document.getElementById('email').value,
        document.getElementById('phone').value,
        document.getElementById('group').value
    );

    localStorage.setItem('student', JSON.stringify(student));
    document.getElementById('studentForm').reset();
    window.location.href = 'projects.html';
});


// Project Part 

function validprojectForm(){
    document.querySelectorAll('.error').forEach((e) => e.textContent = '');

    const title = document.getElementById('title');
    const githublink = document.getElementById('githublink');
    const skills = document.querySelectorAll('input[name="skills"]:checked');
    const date =  document.getElementById('date');
    let valid =  true;

    if(!title.value){
        document.getElementById('titleError').textContent = 'Title is required.';
        valid = false;
    }
    if (!githublink.value || !/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9._%+-]+\/[A-Za-z0-9._%+-]+/.test(githublink.value)) {
        document.getElementById('githublinkError').textContent = 'GitHub link must be a valid GitHub URL'; 
        valid = false;
    }

    if (skills.length === 0) {
        document.getElementById('skillsError').innerText = "Please select at least one skill.";
    } else {
        document.getElementById('skillsError').innerText = "";
    }

    if (!date.value) {
        document.getElementById('dateError').textContent = 'Date  is required.';
        valid = false;
    }
    return valid;
}


function addProject() {
    if (!validprojectForm()) return;

    const title = document.getElementById('title').value;
    const githublink = document.getElementById('githublink').value;
    const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(skill => skill.value);
    const date = document.getElementById('date').value;

    const studentData = JSON.parse(localStorage.getItem('student'));
    if (!studentData) {
        console.log("No student data found in local storage");
        return;
    }
    // Check for duplicate project title
    if (studentData.projects.some(project => project.title === title)) {
        console.log(`${title} Project title already added`);
        return;
    }

    const project = new Project(title, githublink, skills, date);
    studentData.projects.push(project);

    localStorage.setItem('student', JSON.stringify(studentData));
    displayProjects(studentData.projects);
}

function displayProjects(projects) {
    const projectlist = document.getElementById('projectList');
    projectlist.innerHTML = '';

    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.innerHTML = `
          <h3>${index + 1} ${project.title}</h3>
          <p><strong>GitHub:</strong> <a href="${project.githublink}" target="_blank">${project.githublink}</a></p>
          <p><strong>Skills:</strong> ${project.skills}</p>
          <p><strong>Date:</strong> ${project.date}</p> <!-- Make sure to use 'date' here -->
        `;
        projectlist.appendChild(projectDiv);
    });
}


function sendPortfolio() {
    window.location.href = 'portfolio.html';
}

function displayPortfolio(){
    const student = JSON.parse(localStorage.getItem('student'));
    const portfolio = document.getElementById('portfolio');
    portfolio.innerHTML = `
        <h2>${student.firstName} ${student.lastName}'s Portfolio</h2>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Phone:</strong> ${student.phone}</p>
        <p><strong>Group:</strong> ${student.group}</p>
        <h3>Projects</h3>
    `;

    student.projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.innerHTML = `
            <h4>Project ${index + 1}</h4>
            <p><strong>Title:</strong> ${project.title}</p>
            <p><strong>GitHub:</strong> <a href="${project.githublink}" target="_blank">${project.githublink}</a></p>
            <p><strong>Skills:</strong> ${project.skills}</p>
        `;
        portfolio.appendChild(projectCard);
    });
}

window.onload = function () {
    if (window.location.pathname.includes('projects.html')) {
        const student = JSON.parse(localStorage.getItem('student'));
        if (student && student.projects) displayProjects(student.projects);
    } else if (window.location.pathname.includes('portfolio.html')) {
        displayPortfolio();
    }
};


function downloadPDF() {
    const element = document.getElementById('portfolio');
    html2pdf(element);
}