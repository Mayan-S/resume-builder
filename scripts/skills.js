const numSkillsSectionsInput = document.getElementById('num-skills-sections');
const skillsFormsContainer = document.getElementById('skills-forms');

let skillsData = [];

function createSkillsForm(index) {
    return `
        <div class="skills-form" id="skills-form-${index}">
            <hr>
            <label for="skills-title-${index}">Section Title:</label>
            <input type="text" id="skills-title-${index}" name="skills-title-${index}" required><br>

            <label for="associated-skills-${index}">Associated Skills (Separate by Commas):</label>
            <input type="text" id="associated-skills-${index}" name="associated-skills-${index}" required><br>
        </div>
    `;
}

function updateSkillsForms() {
    let numSkillsSections = parseInt(numSkillsSectionsInput.value, 10) || 0;
    
    // Ensure the number is within the valid range
    if (numSkillsSections < 0) {
        numSkillsSections = 0;
    } else if (numSkillsSections > 6) {
        numSkillsSections = 6;
    }
    
    numSkillsSectionsInput.value = numSkillsSections; // Update the input value to reflect the valid range

    skillsFormsContainer.innerHTML = '';
    skillsData = [];
    for (let i = 1; i <= numSkillsSections; i++) {
        skillsFormsContainer.innerHTML += createSkillsForm(i);
        skillsData.push({
            sectionTitle: '',
            associatedSkills: ''
        });
    }
    attachSkillsListeners();
}

function attachSkillsListeners() {
    skillsData.forEach((_, index) => {
        const sectionTitleInput = document.getElementById(`skills-title-${index + 1}`);
        const associatedSkillsInput = document.getElementById(`associated-skills-${index + 1}`);

        sectionTitleInput.addEventListener('input', (event) => {
            skillsData[index].sectionTitle = event.target.value;
            console.log(`Skills Section ${index + 1} Title:`, skillsData[index].sectionTitle);
        });

        associatedSkillsInput.addEventListener('input', (event) => {
            skillsData[index].associatedSkills = event.target.value;
            console.log(`Skills Section ${index + 1} Skills:`, skillsData[index].associatedSkills);
        });
    });
}

numSkillsSectionsInput.addEventListener('input', updateSkillsForms);

updateSkillsForms();