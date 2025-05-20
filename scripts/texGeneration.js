document.getElementById('create-resume').addEventListener('click', () => {
    if (validateForm() && checkSpecialCharacters()) {
        const texContent = generateTexContent();
        downloadTexFile(texContent);
    } else if(validateForm()){
        alert("The following special characters are not accepted: #, $, %, &, ~, _, ^, \\, {, }");
    } else {
        alert('Please fill out all required fields.');
    }
});

function validateForm() {
    return fullName && gmail && educationData.every(ed => ed.institute && ed.degree && ed.startDate && ed.endDate) &&
        experienceData.every(exp => exp.organization && exp.position && exp.startDate && exp.endDate && exp.points.every(p => p)) &&
        projectData.every(proj => proj.projectName && proj.linkOrTeam && proj.startDate && proj.endDate && proj.points.every(p => p)) &&
        skillsData.every(skill => skill.sectionTitle && skill.associatedSkills);
}

function checkSpecialCharacters() {
    const specialChars = /[#\$%&~_^\\{}]/;
    const fields = [
        fullName, gmail, phone, linkedin, github,
        ...educationData.flatMap(ed => [ed.institute, ed.degree, ed.startDate, ed.endDate, ed.gpa]),
        ...experienceData.flatMap(exp => [exp.organization, exp.position, exp.startDate, exp.endDate, ...exp.points]),
        ...projectData.flatMap(proj => [proj.projectName, proj.linkOrTeam, proj.startDate, proj.endDate, ...proj.points]),
        ...skillsData.flatMap(skill => [skill.sectionTitle, skill.associatedSkills])
    ];

    for (const field of fields) {
        if (field && specialChars.test(field)) {
            return false;
        }
    }
    return true;
}

function generateTexContent() {
    let tex = `\\documentclass[11pt]{article}       
\\usepackage[letterpaper,                
top=0.5in,                          
bottom=0.5in,                       
left=0.5in,                         
right=0.5in]{geometry}              
                       
\\usepackage{XCharter}               
\\usepackage[T1]{fontenc}            
\\usepackage[utf8]{inputenc}         
\\usepackage{enumitem}               
\\usepackage[hidelinks]{hyperref}    
\\usepackage{titlesec}               
\\raggedright                        
\\pagestyle{empty}                   
\\usepackage{fontawesome5}           

\\titleformat{\\section}{\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule\\vspace{-6.5pt}]

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\setlist[itemize]{itemsep=-2pt, leftmargin=12pt, topsep=7pt} 

\\begin{document}`;

    tex += generateProfileSection();

    const order = getOrder(selectedDescription);
    order.forEach(section => {
        if (section === 'Education' && educationData.length > 0) {
            tex += generateEducationSection();
        } else if (section === 'Skills' && skillsData.length > 0) {
            tex += generateSkillsSection();
        } else if (section === 'Projects' && projectData.length > 0) {
            tex += generateProjectsSection();
        } else if (section === 'Experience' && experienceData.length > 0) {
            tex += generateExperienceSection();
        }
    });

    tex += '\\end{document}';
    return tex;
}

function generateProfileSection() {
    let profile = '\n';
    profile += `\\centerline{\\Huge \\textbf{${fullName}}}\n\\vspace{5pt}\n\\centerline{`;

    const fields = [phone, gmail, linkedin, github].filter(Boolean);
    profile += fields.join(' | ');
    profile += '}\n\\vspace{-5.5pt}';
    return profile;
}

function getOrder(description) {
    if (description === 'student-no-experience') {
        return ['Education', 'Skills', 'Projects', 'Experience'];
    } else if (description === 'student-some-experience') {
        return ['Education', 'Skills', 'Experience', 'Projects'];
    } else {
        return ['Skills', 'Experience', 'Projects', 'Education'];
    }
}

function generateEducationSection() {
    let tex = '\\section*{Education}\n';
    educationData.forEach(ed => {
        tex += `\\textbf{${ed.institute}} | ${ed.degree} \\hfill ${ed.startDate} - ${ed.endDate} \\\\\n`;
        if (ed.gpa) {
            tex += `\\textbf{GPA: ${ed.gpa}/4.00} \\\\\n`;
        }
    });
    tex += `\\vspace{-6.5pt}\n`;
    return tex;
}

function generateSkillsSection() {
    let tex = '\\section*{Skills}\n';
    skillsData.forEach(skill => {
        tex += `\\textbf{${skill.sectionTitle}:} ${skill.associatedSkills} \\\\\n`;
    });
    tex += `\\vspace{-6.5pt}\n`;
    return tex;
}

function generateProjectsSection() {
    let tex = '\\section*{Projects}\n';
    projectData.forEach(proj => {
        tex += `\\textbf{${proj.projectName}} | ${proj.linkOrTeam} \\hfill ${proj.startDate} - ${proj.endDate} \\\\\n\\vspace{-9pt}\n`;
        tex += `\\begin{itemize}\n`;
        if (proj.points.length > 0) {
            proj.points.forEach(point => {
                tex += `\\item ${point}\n`;
            });
        }
        else{
            tex += `\\vspace{9pt}\n`;
        }
        tex += `\\end{itemize}\n`;
    });
    tex += `\\vspace{-16.5pt}\n`;
    return tex;
}

function generateExperienceSection() {
    let tex = '\\section{Experience}\n';
    experienceData.forEach(exp => {
        tex += `\\textbf{${exp.position}} | ${exp.organization} \\hfill ${exp.startDate} - ${exp.endDate} \\\\\n\\vspace{-9pt}\n`;
        tex += `\\begin{itemize}\n`;
        if (exp.points.length > 0) {
            exp.points.forEach(point => {
                tex += `\\item ${point}\n`;
            });
        }
        else{
            tex += `\\vspace{9pt}\n`;
        }
        tex += `\\end{itemize}\n`;
    });
    tex += `\\vspace{-16.5pt}\n`;
    return tex;
}

function downloadTexFile(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.tex';
    link.click();
}