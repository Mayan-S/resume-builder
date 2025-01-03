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
    let tex = `
\\documentclass[10pt, letterpaper]{article}
\\usepackage[ignoreheadfoot, top=0.5in, bottom=0.5in, left=0.5in, right=0.5in, footskip=0.25in]{geometry}
\\usepackage{titlesec, tabularx, array, xcolor, enumitem, fontawesome5, amsmath, hyperref, eso-pic, calc, bookmark, lastpage, changepage, paracol, ifthen, needspace, iftex}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi
\\usepackage{charter}
\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\pagenumbering{gobble}
\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{-1pt}{0.3cm}{0.2cm}
\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\newenvironment{highlights}{\\begin{itemize}[topsep=0.10cm, parsep=0.10cm, partopsep=0pt, itemsep=0pt, leftmargin=0cm+10pt]}{\\end{itemize}}
\\newenvironment{highlightsforbulletentries}{\\begin{itemize}[topsep=0.10cm, parsep=0.10cm, partopsep=0pt, itemsep=0pt, leftmargin=10pt]}{\\end{itemize}}
\\newenvironment{onecolentry}{\\begin{adjustwidth}{0cm+0.00001cm}{0cm+0.00001cm}}{\\end{adjustwidth}}
\\newenvironment{twocolentry}[2][]{\\onecolentry\\def\\secondColumn{#2}\\setcolumnwidth{\\fill, 4.5cm}\\begin{paracol}{2}}{\\switchcolumn \\raggedleft \\secondColumn\\end{paracol}\\endonecolentry}
\\newenvironment{threecolentry}[3][]{\\onecolentry\\def\\thirdColumn{#3}\\setcolumnwidth{, \\fill, 4.5cm}\\begin{paracol}{3}{\\raggedright #2} \\switchcolumn}{\\switchcolumn \\raggedleft \\thirdColumn\\end{paracol}\\endonecolentry}
\\newenvironment{header}{\\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}}{\\par\\kern\\topsep}
\\newcommand{\\placelastupdatedtext}{\\AddToShipoutPictureFG*{\\put(\\LenToUnit{\\paperwidth-2cm-0cm+0.05cm},\\LenToUnit{\\paperheight-1.0cm}){\\vtop{{\\null}\\makebox[0pt][c]{\\small\\color{gray}\\textit{Last updated in September 2024}\\hspace{\\widthof{Last updated in September 2024}}}}}}}
\\let\\hrefWithoutArrow\\href
\\begin{document}
\\newcommand{\\AND}{\\unskip\\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox\\ignorespaces}
\\newsavebox\\ANDbox
\\sbox\\ANDbox{$|$}
`;

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
    let profile = '\\begin{header}\n';
    profile += `\\fontsize{25pt}{25pt}\\selectfont \\textbf{${fullName}}\n\\normalsize\n
    `;

    const fields = [phone, gmail, linkedin, github].filter(Boolean);
    profile += fields.join(' $|$~ ') + '\n';
    profile += '\\end{header}\n\\vspace{5pt}\n';
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
    let tex = '\\section{Education}\n';
    educationData.forEach(ed => {
        tex += `\\begin{twocolentry}{${ed.startDate} - ${ed.endDate}}\n`;
        tex += `\\textbf{${ed.institute}} $|$ ${ed.degree}\\end{twocolentry}\n`;
        if (ed.gpa) {
            tex += '\\vspace{0.10cm}\n\\begin{onecolentry}\n\\begin{highlights}\n';
            tex += `\\item \\textbf{GPA: ${ed.gpa}/4.00}\n`;
            tex += '\\end{highlights}\n\\end{onecolentry}\n';
        }
        tex += `\\vspace{0.3cm}\n`;
    });
    tex += `\\vspace{-0.25cm}\n`;
    return tex;
}

function generateSkillsSection() {
    let tex = '\\section{Skills}\n';
    skillsData.forEach(skill => {
        tex += `\\begin{onecolentry}\n\\textbf{${skill.sectionTitle}:} ${skill.associatedSkills}\\end{onecolentry}\n\\vspace{0.1cm}\n`;
    });
    tex += `\\vspace{-0.05cm}\n`;
    return tex;
}

function generateProjectsSection() {
    let tex = '\\section{Projects}\n';
    projectData.forEach(proj => {
        if (proj.points.length > 0) {
            tex += `\\begin{twocolentry}{${proj.startDate} - ${proj.endDate}}\n`;
            tex += `\\textbf{${proj.projectName}} $|$ ${proj.linkOrTeam}\\end{twocolentry}\n`;
            tex += '\\vspace{0.10cm}\n\\begin{onecolentry}\n\\begin{highlights}\n';
            proj.points.forEach(point => {
                tex += `\\item ${point}\n`;
            });
            tex += '\\end{highlights}\n\\end{onecolentry}\n\\vspace{0.3cm}\n';
        }
        else{
            tex += `\\begin{twocolentry}{${proj.startDate} - ${proj.endDate}}\n`;
            tex += `\\textbf{${proj.projectName}} $|$ ${proj.linkOrTeam}\\end{twocolentry}\n`;
            tex += `\\vspace{0.3cm}\n`;
        }
    });
    tex += `\\vspace{-0.25cm}\n`;
    return tex;
}

function generateExperienceSection() {
    let tex = '\\section{Experience}\n';
    experienceData.forEach(exp => {
        if (exp.points.length > 0) {
            tex += `\\begin{twocolentry}{${exp.startDate} - ${exp.endDate}}\n`;
            tex += `\\textbf{${exp.organization}} $|$ ${exp.position}\\end{twocolentry}\n`;
            tex += '\\vspace{0.10cm}\n\\begin{onecolentry}\n\\begin{highlights}\n';
            exp.points.forEach(point => {
                tex += `\\item ${point}\n`;
            });
            tex += '\\end{highlights}\n\\end{onecolentry}\n\\vspace{0.3cm}\n';
        }
        else{
            tex += `\\begin{twocolentry}{${exp.startDate} - ${exp.endDate}}\n`;
            tex += `\\textbf{${exp.organization}} $|$ ${exp.position}\\end{twocolentry}\n`;
            tex += `\\vspace{0.3cm}\n`;
        }
    });
    tex += `\\vspace{-0.25cm}\n`;
    return tex;
}

function downloadTexFile(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.tex';
    link.click();
}