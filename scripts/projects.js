const numProjectsInput = document.getElementById('num-projects');
const projectFormsContainer = document.getElementById('project-forms');

let projectData = [];

function createProjectForm(index) {
    return `
        <div class="project-form" id="project-form-${index}">
            <hr>
            <label for="project-name-${index}">Name of Project:</label>
            <input type="text" id="project-name-${index}" name="project-name-${index}" required><br>

            <label for="link-or-team-${index}">Link or Team Name:</label>
            <input type="text" id="link-or-team-${index}" name="link-or-team-${index}" required><br>

            <label for="proj-start-date-${index}">Start Date:</label>
            <input type="text" id="proj-start-date-${index}" name="proj-start-date-${index}" required><br>

            <label for="proj-end-date-${index}">End Date ('Present' if necessary):</label>
            <input type="text" id="proj-end-date-${index}" name="proj-end-date-${index}" required><br>

            <label for="proj-num-points-${index}">Number of Points:</label>
            <input type="number" id="proj-num-points-${index}" min="0" max="10" value="0"><br>
            <div id="proj-points-container-${index}"></div>
        </div>
    `;
}

function updateProjectForms() {
    let numProjects = parseInt(numProjectsInput.value, 10) || 0;
    
    // Ensure the number is within the valid range
    if (numProjects < 0) {
        numProjects = 0;
    } else if (numProjects > 8) {
        numProjects = 8;
    }
    
    numProjectsInput.value = numProjects; // Update the input value to reflect the valid range

    projectFormsContainer.innerHTML = '';
    projectData = [];
    for (let i = 1; i <= numProjects; i++) {
        projectFormsContainer.innerHTML += createProjectForm(i);
        projectData.push({
            projectName: '',
            linkOrTeam: '',
            startDate: '',
            endDate: '',
            points: []
        });
    }
    attachProjectListeners();
}

function attachProjectListeners() {
    projectData.forEach((_, index) => {
        const projectNameInput = document.getElementById(`project-name-${index + 1}`);
        const linkOrTeamInput = document.getElementById(`link-or-team-${index + 1}`);
        const startDateInput = document.getElementById(`proj-start-date-${index + 1}`);
        const endDateInput = document.getElementById(`proj-end-date-${index + 1}`);
        const numPointsInput = document.getElementById(`proj-num-points-${index + 1}`);
        const pointsContainer = document.getElementById(`proj-points-container-${index + 1}`);

        projectNameInput.addEventListener('input', (event) => {
            projectData[index].projectName = event.target.value;
            console.log(`Project ${index + 1} Name:`, projectData[index].projectName);
        });

        linkOrTeamInput.addEventListener('input', (event) => {
            projectData[index].linkOrTeam = event.target.value;
            console.log(`Project ${index + 1} Link/Team:`, projectData[index].linkOrTeam);
        });

        startDateInput.addEventListener('input', (event) => {
            projectData[index].startDate = event.target.value;
            console.log(`Project ${index + 1} Start Date:`, projectData[index].startDate);
        });

        endDateInput.addEventListener('input', (event) => {
            projectData[index].endDate = event.target.value;
            console.log(`Project ${index + 1} End Date:`, projectData[index].endDate);
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
            projectData[index].points = Array(numPoints).fill('');
            for (let j = 1; j <= numPoints; j++) {
                const pointInput = document.createElement('input');
                pointInput.type = 'text';
                pointInput.id = `proj-point-${index + 1}-${j}`;
                pointInput.placeholder = `Point #${j}`;
                pointInput.required = true;
                pointInput.addEventListener('input', (event) => {
                    projectData[index].points[j - 1] = event.target.value;
                    console.log(`Project ${index + 1} Point ${j}:`, projectData[index].points[j - 1]);
                });
                pointsContainer.appendChild(pointInput);
            }
        });

        numPointsInput.dispatchEvent(new Event('input'));
    });
}

numProjectsInput.addEventListener('input', updateProjectForms);

updateProjectForms();