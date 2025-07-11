document.addEventListener('DOMContentLoaded', () => {
  const sectionCheckboxesContainer = document.getElementById('sectionCheckboxes');
  const questionsContainer = document.getElementById('questionsContainer');
  const saveAllSectionsButton = document.getElementById('saveAllSections');
  const showSummaryButton = document.getElementById('showSummary');
  const summaryContainer = document.getElementById('summaryContainer');
  const summaryContent = document.getElementById('summaryContent');
  const generatePdfButton = document.getElementById('generatePdfButton');
  const printPdfButton = document.getElementById('printPdfButton');
  const pdfActionsDiv = document.querySelector('.pdf-actions');

  const allAnswers = {};

  function generateSectionCheckboxes() {
    for (const key in allQuestions) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'selectedSection';
      checkbox.value = key;
      checkbox.addEventListener('change', renderSelectedSections);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + (sectionLabels[key] || key)));
      sectionCheckboxesContainer.appendChild(label);
      sectionCheckboxesContainer.appendChild(document.createElement('br'));
    }
  }

  function renderSelectedSections() {
    questionsContainer.innerHTML = '';
    const selectedSections = Array.from(document.querySelectorAll('input[name="selectedSection"]:checked')).map(cb => cb.value);
    selectedSections.forEach(section => {
      const title = document.createElement('h3');
      title.textContent = sectionLabels[section] || section;
      questionsContainer.appendChild(title);

      allQuestions[section].forEach(q => {
        const div = document.createElement('div');
        div.className = 'form-group';
        const label = document.createElement('label');
        label.textContent = q.label;
        div.appendChild(label);

        if (q.type === 'text' || q.type === 'textarea') {
          const input = q.type === 'text' ? document.createElement('input') : document.createElement('textarea');
          input.name = `${section}-${q.id}`;
          if (q.type === 'textarea') input.rows = 3;
          div.appendChild(input);
        } else if (q.type === 'radio') {
          q.options.forEach(opt => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `${section}-${q.id}`;
            input.value = opt.value;
            const optLabel = document.createElement('label');
            optLabel.textContent = opt.text;
            div.appendChild(input);
            div.appendChild(optLabel);
          });
        }

        questionsContainer.appendChild(div);
      });
    });

    saveAllSectionsButton.style.display = selectedSections.length > 0 ? 'inline-block' : 'none';
    showSummaryButton.style.display = selectedSections.length > 0 ? 'inline-block' : 'none';
  }

  window.saveProjectInfo = function() {
    allAnswers.projectName = document.getElementById('projectName').value;
    allAnswers.clientName = document.getElementById('clientName').value;
    allAnswers.clientAddress = document.getElementById('clientAddress').value;
    allAnswers.clientTel = document.getElementById('clientTel').value;
    allAnswers.clientEmail = document.getElementById('clientEmail').value;
    alert("Informations générales enregistrées.");
  }

  function saveAllSectionAnswers() {
    const selectedSections = Array.from(document.querySelectorAll('input[name="selectedSection"]:checked')).map(cb => cb.value);
    selectedSections.forEach(section => {
      allAnswers[section] = {};
      allQuestions[section].forEach(q => {
        const name = `${section}-${q.id}`;
        if (q.type === 'text' || q.type === 'textarea') {
          const input = document.querySelector(`[name="${name}"]`);
          allAnswers[section][q.id] = input?.value || '';
        } else if (q.type === 'radio') {
          const selected = document.querySelector(`input[name="${name}"]:checked`);
          allAnswers[section][q.id] = selected?.value || '';
        }
      });
    });
    alert("Réponses sauvegardées !");
    pdfActionsDiv.style.display = 'block';
  }

  function displaySummary() {
    let summary = '📝 RÉSUMÉ DU QUESTIONNAIRE COVEM\n\n';
    summary += `Projet : ${allAnswers.projectName || ''}\nClient : ${allAnswers.clientName || ''}\nAdresse : ${allAnswers.clientAddress || ''}\nTéléphone : ${allAnswers.clientTel || ''}\nCourriel : ${allAnswers.clientEmail || ''}\n\n`;

    for (const section in allAnswers) {
      if (sectionLabels[section]) {
        summary += `📌 ${sectionLabels[section]}\n`;
        const questions = allQuestions[section];
        if (questions) {
          questions.forEach(q => {
            const answer = allAnswers[section][q.id] || 'Non renseigné';
            summary += `- ${q.label}: ${answer}\n`;
          });
        }
        summary += '\n';
      }
    }

    summaryContent.textContent = summary;
    summaryContainer.style.display = 'block';
  }

  function generatePdf() {
    displaySummary();
    html2pdf().from(summaryContainer).save();
  }

  function printPdf() {
    displaySummary();
    html2pdf().from(summaryContainer).output('bloburl').then(url => {
      const win = window.open(url);
      win.onload = () => win.print();
    });
  }

  generateSectionCheckboxes();

  saveAllSectionsButton.addEventListener('click', saveAllSectionAnswers);
  showSummaryButton.addEventListener('click', displaySummary);
  generatePdfButton.addEventListener('click', generatePdf);
  printPdfButton.addEventListener('click', printPdf);
});
