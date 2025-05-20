const numExperiencesInput = document.getElementById('num-experiences');
const experienceFormsContainer = document.getElementById('experience-forms');

let experienceData = [];

function createExperienceForm(index) {
    return `
        <div class="experience-form" id="experience-form-${index}">
            <hr>
            <label for="position-${index}">Position:</label>
            <input type="text" id="position-${index}" name="position-${index}" required><br>
            
            <label for="organization-${index}">Name of Organization:</label>
            <input type="text" id="organization-${index}" name="organization-${index}" required><br>

            <label for="exp-start-date-${index}">Start Date:</label>
            <input type="text" id="exp-start-date-${index}" name="exp-start-date-${index}" required><br>

            <label for="exp-end-date-${index}">End Date ('Present' if necessary):</label>
            <input type="text" id="exp-end-date-${index}" name="exp-end-date-${index}" required><br>

            <label for="num-points-${index}">Number of Points:</label>
            <input type="number" id="num-points-${index}" min="0" max="10" value="0"><br>
            <div id="points-container-${index}"></div>
        </div>
    `;
}

function updateExperienceForms() {
    let numExperiences = parseInt(numExperiencesInput.value, 10) || 0;
    
    // Ensure the number is within the valid range
    if (numExperiences < 0) {
        numExperiences = 0;
    } else if (numExperiences > 8) {
        numExperiences = 8;
    }
    
    numExperiencesInput.value = numExperiences; // Update the input value to reflect the valid range

    experienceFormsContainer.innerHTML = '';
    experienceData = [];
    for (let i = 1; i <= numExperiences; i++) {
        experienceFormsContainer.innerHTML += createExperienceForm(i);
        experienceData.push({
            organization: '',
            position: '',
            startDate: '',
            endDate: '',
            points: []
        });
    }
    attachExperienceListeners();
}

function attachExperienceListeners() {
    experienceData.forEach((_, index) => {
        const organizationInput = document.getElementById(`organization-${index + 1}`);
        const positionInput = document.getElementById(`position-${index + 1}`);
        const startDateInput = document.getElementById(`exp-start-date-${index + 1}`);
        const endDateInput = document.getElementById(`exp-end-date-${index + 1}`);
        const numPointsInput = document.getElementById(`num-points-${index + 1}`);
        const pointsContainer = document.getElementById(`points-container-${index + 1}`);

        organizationInput.addEventListener('input', (event) => {
            experienceData[index].organization = event.target.value;
            console.log(`Organization ${index + 1}:`, experienceData[index].organization);
        });

        positionInput.addEventListener('input', (event) => {
            experienceData[index].position = event.target.value;
            console.log(`Position ${index + 1}:`, experienceData[index].position);
        });

        startDateInput.addEventListener('input', (event) => {
            experienceData[index].startDate = event.target.value;
            console.log(`Start Date ${index + 1}:`, experienceData[index].startDate);
        });

        endDateInput.addEventListener('input', (event) => {
            experienceData[index].endDate = event.target.value;
            console.log(`End Date ${index + 1}:`, experienceData[index].endDate);
        });

        numPointsInput.addEventListener('input', () => {
            let numPoints = parseInt(numPointsInput.value, 10) || 0;
            
            // Ensure the number is within the valid range
            if (numPoints < 0) {
                numPoints = 0;
            } else if (numPoints > 10) {
                numPoints = 10;
            }
            
            numPointsInput.value = numPoints; // Update the input value to reflect the valid range

            pointsContainer.innerHTML = '';
            experienceData[index].points = Array(numPoints).fill('');
            for (let j = 1; j <= numPoints; j++) {
                const pointInput = document.createElement('input');
                pointInput.type = 'text';
                pointInput.id = `point-${index + 1}-${j}`;
                pointInput.placeholder = `Point #${j}`;
                pointInput.required = true;
                pointInput.addEventListener('input', (event) => {
                    experienceData[index].points[j - 1] = event.target.value;
                    console.log(`Experience ${index + 1} Point ${j}:`, experienceData[index].points[j - 1]);
                });
                pointsContainer.appendChild(pointInput);
            }
        });

        numPointsInput.dispatchEvent(new Event('input'));
    });
}

numExperiencesInput.addEventListener('input', updateExperienceForms);

updateExperienceForms();