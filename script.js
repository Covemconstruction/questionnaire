
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
    
