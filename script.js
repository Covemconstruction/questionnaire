
document.addEventListener('DOMContentLoaded', () => {
    const sectionCheckboxesContainer = document.getElementById('sectionCheckboxes');
    const questionsContainer = document.getElementById('questionsContainer');
    const saveAllSectionsButton = document.getElementById('saveAllSections');
    const showSummaryButton = document.getElementById('showSummary');
    const summaryContainer = document.getElementById('summaryContainer');
    const summaryContent = document.getElementById('summaryContent');
    const pdfActionsDiv = document.querySelector('.pdf-actions');
    const generatePdfButton = document.getElementById('generatePdfButton');
    const printPdfButton = document.getElementById('printPdfButton');

    let allAnswers = {};
    const allQuestions = {
        contexteGeneral: [
            { id: 'raisonProjet', label: 'Quelle est la raison principale du projet ?', type: 'text' },
            { id: 'echeancier', label: 'Quel est l’échéancier prévu ?', type: 'text' }
        ],
        plansDocuments: [
            { id: 'plansExistants', label: 'Avez-vous des plans existants ?', type: 'text' }
        ]
    };

    function generateSectionCheckboxes() {
        for (const key in allQuestions) {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = key;
            checkbox.name = 'selectedSection';
            checkbox.addEventListener('change', renderSelectedSections);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + key));
            sectionCheckboxesContainer.appendChild(label);
            sectionCheckboxesContainer.appendChild(document.createElement('br'));
        }
    }

    function renderSelectedSections() {
        questionsContainer.innerHTML = '';
        const selectedKeys = Array.from(document.querySelectorAll('input[name="selectedSection"]:checked')).map(cb => cb.value);
        selectedKeys.forEach(section => {
            allQuestions[section].forEach(q => {
                const div = document.createElement('div');
                div.className = 'form-group';
                const label = document.createElement('label');
                label.textContent = q.label;
                const input = document.createElement('input');
                input.type = q.type;
                input.name = section + '-' + q.id;
                div.appendChild(label);
                div.appendChild(input);
                questionsContainer.appendChild(div);
            });
        });
        saveAllSectionsButton.style.display = selectedKeys.length > 0 ? 'inline-block' : 'none';
        showSummaryButton.style.display = selectedKeys.length > 0 ? 'inline-block' : 'none';
    }

    function saveProjectInfo() {
        allAnswers.projectName = document.getElementById('projectName').value;
        allAnswers.clientName = document.getElementById('clientName').value;
        allAnswers.clientAddress = document.getElementById('clientAddress').value;
        allAnswers.clientTel = document.getElementById('clientTel').value;
        allAnswers.clientEmail = document.getElementById('clientEmail').value;
        localStorage.setItem('covemQuestionnaireAnswers', JSON.stringify(allAnswers));
    }

    function displaySummary() {
        summaryContainer.style.display = 'block';
        summaryContent.textContent = JSON.stringify(allAnswers, null, 2);
        pdfActionsDiv.style.display = 'block';
    }

    function generatePdf() {
        displaySummary();
        const element = document.getElementById('summaryContainer');
        html2pdf().from(element).save();
    }

    function printPdf() {
        displaySummary();
        const element = document.getElementById('summaryContainer');
        html2pdf().from(element).output('bloburl').then(url => {
            const printWindow = window.open(url);
            printWindow.onload = () => printWindow.print();
        });
    }

    generateSectionCheckboxes();
    saveAllSectionsButton.addEventListener('click', () => {
        const selectedKeys = Array.from(document.querySelectorAll('input[name="selectedSection"]:checked')).map(cb => cb.value);
        selectedKeys.forEach(section => {
            const sectionAnswers = {};
            allQuestions[section].forEach(q => {
                const input = document.querySelector(`[name="${section}-${q.id}"]`);
                if (input) sectionAnswers[q.id] = input.value;
            });
            allAnswers[section] = sectionAnswers;
        });
        localStorage.setItem('covemQuestionnaireAnswers', JSON.stringify(allAnswers));
    });
    showSummaryButton.addEventListener('click', displaySummary);
    generatePdfButton.addEventListener('click', generatePdf);
    printPdfButton.addEventListener('click', printPdf);
});
