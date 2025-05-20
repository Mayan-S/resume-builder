const numInstitutionsInput = document.getElementById('num-institutions');
const educationFormsContainer = document.getElementById('education-forms');

let educationData = [];

function createEducationForm(index) {
    return `
        <div class="education-form" id="education-form-${index}">
            <hr>
            <label for="institute-${index}">Name of Institute:</label>
            <input type="text" id="institute-${index}" name="institute-${index}" required><br>

            <label for="degree-${index}">Name of Degree:</label>
            <input type="text" id="degree-${index}" name="degree-${index}" required><br>

            <label for="start-date-${index}">Start Date:</label>
            <input type="text" id="start-date-${index}" name="start-date-${index}" required><br>

            <label for="end-date-${index}">End Date:</label>
            <input type="text" id="end-date-${index}" name="end-date-${index}" required><br>

            <label for="gpa-${index}">GPA (Optional) (Three Significant Figures):</label>
            <input type="text" id="gpa-${index}" name="gpa-${index}"><br>
        </div>
    `;
}

function updateEducationForms() {
    let numInstitutions = parseInt(numInstitutionsInput.value, 10) || 0;
    
    // Ensure the number is within the valid range
    if (numInstitutions < 0) {
        numInstitutions = 0;
    } else if (numInstitutions > 4) {
        numInstitutions = 4;
    }
    
    numInstitutionsInput.value = numInstitutions; // Update the input value to reflect the valid range

    educationFormsContainer.innerHTML = '';
    educationData = [];
    for (let i = 1; i <= numInstitutions; i++) {
        educationFormsContainer.innerHTML += createEducationForm(i);
        educationData.push({
            institute: '',
            degree: '',
            startDate: '',
            endDate: '',
            gpa: ''
        });
    }
    attachEducationListeners();
}

function attachEducationListeners() {
    educationData.forEach((_, index) => {
        const instituteInput = document.getElementById(`institute-${index + 1}`);
        const degreeInput = document.getElementById(`degree-${index + 1}`);
        const startDateInput = document.getElementById(`start-date-${index + 1}`);
        const endDateInput = document.getElementById(`end-date-${index + 1}`);
        const gpaInput = document.getElementById(`gpa-${index + 1}`);

        instituteInput.addEventListener('input', (event) => {
            educationData[index].institute = event.target.value;
            console.log(`Institute ${index + 1}:`, educationData[index].institute);
        });

        degreeInput.addEventListener('input', (event) => {
            educationData[index].degree = event.target.value;
            console.log(`Degree ${index + 1}:`, educationData[index].degree);
        });

        startDateInput.addEventListener('input', (event) => {
            educationData[index].startDate = event.target.value;
            console.log(`Start Date ${index + 1}:`, educationData[index].startDate);
        });

        endDateInput.addEventListener('input', (event) => {
            educationData[index].endDate = event.target.value;
            console.log(`End Date ${index + 1}:`, educationData[index].endDate);
        });

        gpaInput.addEventListener('input', (event) => {
            educationData[index].gpa = event.target.value;
            console.log(`GPA ${index + 1}:`, educationData[index].gpa);
        });
    });
}

numInstitutionsInput.addEventListener('input', updateEducationForms);

updateEducationForms();