const fullNameInput = document.getElementById('full-name');
const gmailInput = document.getElementById('gmail');
const phoneInput = document.getElementById('phone');
const linkedinInput = document.getElementById('linkedin');
const githubInput = document.getElementById('github');

let fullName = '';
let gmail = '';
let phone = '';
let linkedin = '';
let github = '';

fullNameInput.addEventListener('input', (event) => {
    fullName = event.target.value;
    console.log('Full Name:', fullName);
});

gmailInput.addEventListener('input', (event) => {
    gmail = event.target.value;
    console.log('Gmail:', gmail);
});

phoneInput.addEventListener('input', (event) => {
    phone = event.target.value;
    console.log('Phone:', phone);
});

linkedinInput.addEventListener('input', (event) => {
    linkedin = event.target.value;
    console.log('LinkedIn:', linkedin);
});

githubInput.addEventListener('input', (event) => {
    github = event.target.value;
    console.log('GitHub:', github);
});