document.getElementById('create-pdf-resume').addEventListener('click', () => {
    if (validateForm()) {
        generatePdf();
    } else {
        alert('Please fill out all required fields.');
    }
});

async function generatePdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
    });

    const margin = 0.5;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('calibri', 'normal');
    doc.setFontSize(24);
    doc.setLineHeightFactor(1.07);
    doc.text(fullName, pageWidth / 2, margin + 0.25, { align: 'center' });

    doc.setFontSize(11);
    let yOffset = margin + 0.65;

    const contactInfo = [phone, gmail, linkedin, github].filter(Boolean).join(' | ');
    const contactLines = doc.splitTextToSize(contactInfo, pageWidth - 2 * margin);

    contactLines.forEach((line, index) => {
        doc.text(line, pageWidth / 2, margin + 0.5 + index * 0.2, { align: 'center' });
        yOffset += 0.2;
    });

    let sectionsOrder;

    if (selectedDescription === 'student-no-experience') {
        sectionsOrder = ['Education', 'Skills', 'Projects', 'Experience'];
    } else if (selectedDescription === 'student-some-experience') {
        sectionsOrder = ['Education', 'Skills', 'Experience', 'Projects'];
    } else if (selectedDescription === 'graduate-experience') {
        sectionsOrder = ['Skills', 'Experience', 'Projects', 'Education'];
    }

    sectionsOrder.forEach(section => {
        if (section === 'Education' && educationData.length > 0) {
            yOffset = addEducationSection(doc, yOffset, pageWidth);
        } else if (section === 'Skills' && skillsData.length > 0) {
            yOffset = addSkillsSection(doc, yOffset, pageWidth);
        } else if (section === 'Projects' && projectData.length > 0) {
            yOffset = addProjectsSection(doc, yOffset, pageWidth);
        } else if (section === 'Experience' && experienceData.length > 0) {
            yOffset = addExperienceSection(doc, yOffset, pageWidth);
        }
    });

    function addEducationSection(doc, yOffset, pageWidth) {
        doc.setFontSize(12.5);
        doc.setFont('calibri', 'normal');
        doc.text('Education', margin, yOffset);

        const lineWidth = 0.75 / 72;
        doc.setLineWidth(lineWidth);
        doc.line(margin, yOffset + 0.05, pageWidth - margin, yOffset + 0.05);

        yOffset += 0.2;

        educationData.forEach(ed => {
            doc.setFontSize(11);
            doc.setFont('calibri', 'bold');
            doc.text(`${ed.institute} | `, margin, yOffset);

            const degreeWidth = doc.getTextWidth(`${ed.institute} | `);
            doc.setFont('calibri', 'normal');
            doc.text(ed.degree, margin + degreeWidth, yOffset);

            doc.text(`${ed.startDate} – ${ed.endDate}`, pageWidth - margin, yOffset, { align: 'right' });

            yOffset += 0.2;

            if (ed.gpa) {
                doc.setFont('calibri', 'bold');
                doc.text('GPA: ', margin, yOffset);

                const gpaLabelWidth = doc.getTextWidth('GPA: ');
                doc.setFont('calibri', 'normal');
                doc.text(ed.gpa+'/4.00', margin + gpaLabelWidth, yOffset);

                yOffset += 0.2;
            }

            yOffset += 0.1;
        });

        return yOffset;
    }


    function addSkillsSection(doc, yOffset, pageWidth) {
        doc.setFontSize(12.5);
        doc.setFont('calibri', 'normal');
        doc.text('Skills', margin, yOffset);

        const lineWidth = 0.75 / 72;
        doc.setLineWidth(lineWidth);
        doc.line(margin, yOffset + 0.05, pageWidth - margin, yOffset + 0.05);

        yOffset += 0.2;

        skillsData.forEach(skill => {
            doc.setFontSize(11);
            doc.setFont('calibri', 'bold');
            doc.text(`${skill.sectionTitle}:  `, margin, yOffset);

            const titleWidth = doc.getTextWidth(`${skill.sectionTitle}: `);
            doc.setFont('calibri', 'normal');
            doc.text(skill.associatedSkills, margin + titleWidth, yOffset);

            yOffset += 0.2;
        });

        return yOffset + 0.1;
    }

    function addProjectsSection(doc, yOffset, pageWidth) {
        doc.setFontSize(12.5);
        doc.setFont('calibri', 'normal');
        doc.text('Projects', margin, yOffset);

        const lineWidth = 0.75 / 72;
        doc.setLineWidth(lineWidth);
        doc.line(margin, yOffset + 0.05, pageWidth - margin, yOffset + 0.05);

        yOffset += 0.2;

        projectData.forEach(proj => {
            doc.setFontSize(11);
            doc.setFont('calibri', 'bold');
            doc.text(`${proj.projectName} | `, margin, yOffset);

            const projectNameWidth = doc.getTextWidth(`${proj.projectName} | `);
            doc.setFont('calibri', 'normal');
            doc.text(proj.linkOrTeam, margin + projectNameWidth, yOffset);

            doc.text(`${proj.startDate} – ${proj.endDate}`, pageWidth - margin, yOffset, { align: 'right' });

            yOffset += 0.2;

            proj.points.forEach(point => {
                doc.setFont('calibri', 'normal');
                const lines = doc.splitTextToSize(`• ${point}`, pageWidth - 2 * margin);
                doc.text(lines, margin, yOffset);
                yOffset += lines.length * 0.2;
            });

            yOffset += 0.1;
        });

        return yOffset;
    }

    function addExperienceSection(doc, yOffset, pageWidth) {
        doc.setFontSize(12.5);
        doc.setFont('calibri', 'normal');
        doc.text('Experience', margin, yOffset);

        const lineWidth = 0.75 / 72;
        doc.setLineWidth(lineWidth);
        doc.line(margin, yOffset + 0.05, pageWidth - margin, yOffset + 0.05);

        yOffset += 0.2;

        experienceData.forEach(exp => {
            doc.setFontSize(11);
            doc.setFont('calibri', 'bold');
            doc.text(`${exp.position} | `, margin, yOffset);

            const positionWidth = doc.getTextWidth(`${exp.position} | `);
            doc.setFont('calibri', 'normal');
            doc.text(exp.organization, margin + positionWidth, yOffset);

            doc.text(`${exp.startDate} – ${exp.endDate}`, pageWidth - margin, yOffset, { align: 'right' });

            yOffset += 0.2;

            exp.points.forEach(point => {
                doc.setFont('calibri', 'normal');
                const lines = doc.splitTextToSize(`• ${point}`, pageWidth - 2 * margin);
                doc.text(lines, margin, yOffset);
                yOffset += lines.length * 0.2;
            });

            yOffset += 0.1;
        });

        return yOffset;
    }

    doc.save('resume.pdf');
}