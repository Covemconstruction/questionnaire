document.addEventListener('DOMContentLoaded', () => {
    const sectionCheckboxesContainer = document.getElementById('sectionCheckboxes');
    const questionsContainer = document.getElementById('questionsContainer');
    const saveAllSectionsButton = document.getElementById('saveAllSections');
    const showSummaryButton = document.getElementById('showSummary');
    const summaryContainer = document.getElementById('summaryContainer');
    const summaryContent = document.getElementById('summaryContent');
    const pdfActionsDiv = document.querySelector('.pdf-actions'); // Nouveau sélecteur pour le conteneur des boutons PDF
    const generatePdfButton = document.getElementById('generatePdfButton');
    const printPdfButton = document.getElementById('printPdfButton'); // Nouveau bouton d'impression

    let allAnswers = {};

    if (localStorage.getItem('covemQuestionnaireAnswers')) {
        allAnswers = JSON.parse(localStorage.getItem('covemQuestionnaireAnswers'));
        document.getElementById('projectName').value = allAnswers.projectName || '';
        document.getElementById('clientName').value = allAnswers.clientName || '';
        document.getElementById('clientAddress').value = allAnswers.clientAddress || '';
        document.getElementById('clientTel').value = allAnswers.clientTel || '';
        document.getElementById('clientEmail').value = allAnswers.clientEmail || '';

        if (Object.keys(allAnswers).length > 5) {
            showSummaryButton.style.display = 'inline-block';
            pdfActionsDiv.style.display = 'block'; // Afficher le conteneur des boutons PDF
        }
    }

    const allQuestions = {
        contexteGeneral: [ /* ... (vos questions) ... */ ],
        plansDocuments: [ /* ... (vos questions) ... */ ],
        fraisGeneraux: [ /* ... (vos questions) ... */ ],
        excavation: [ /* ... (vos questions) ... */ ],
        demolition: [ /* ... (vos questions) ... */ ],
        beton: [ /* ... (vos questions) ... */ ],
        pieuxVisses: [ /* ... (vos questions) ... */ ],
        maconnerie: [ /* ... (vos questions) ... */ ],
        acierMetaux: [ /* ... (vos questions) ... */ ],
        charpenteStructure: [ /* ... (vos questions) ... */ ],
        menuiserieBoiserie: [ /* ... (vos questions) ... */ ],
        ebenisterie: [ /* ... (vos questions) ... */ ],
        escalier: [ /* ... (vos questions) ... */ ],
        balcon: [ /* ... (vos questions) ... */ ],
        isolation: [ /* ... (vos questions) ... */ ],
        toiturePente: [ /* ... (vos questions) ... */ ],
        toiturePlat: [ /* ... (vos questions) ... */ ],
        revetementExterieur: [ /* ... (vos questions) ... */ ],
        portesFenetres: [ /* ... (vos questions) ... */ ],
        vitrerie: [ /* ... (vos questions) ... */ ],
        systemeInterieur: [ /* ... (vos questions) ... */ ],
        ceramique: [ /* ... (vos questions) ... */ ],
        revetementSol: [ /* ... (vos questions) ... */ ],
        peintureEnduit: [ /* ... (vos questions) ... */ ],
        aspirateurCentral: [ /* ... (vos questions) ... */ ],
        plomberie: [ /* ... (vos questions) ... */ ],
        ventilation: [ /* ... (vos questions) ... */ ],
        chauffageGaz: [ /* ... (vos questions) ... */ ],
        electricite: [ /* ... (vos questions) ... */ ]
    };

    function generateSectionCheckboxes() {
        for (const key in allQuestions) {
            const sectionTitle = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `section-${key}`;
            checkbox.name = 'selectedSection';
            checkbox.value = key;

            let textContent;
            switch(key) {
                case 'contexteGeneral': textContent = '1. Contexte général du projet'; break;
                case 'plansDocuments': textContent = '2. Plans et documents fournis'; break;
                case 'fraisGeneraux': textContent = 'Frais Généraux'; break;
                case 'excavation': textContent = 'Excavation'; break;
                case 'demolition': textContent = 'Démolition'; break;
                case 'beton': textContent = 'Béton'; break;
                case 'pieuxVisses': textContent = 'Pieux Vissés'; break;
                case 'maconnerie': textContent = 'Maçonnerie'; break;
                case 'acierMetaux': textContent = 'Acier Métaux Ouvrés'; break;
                case 'charpenteStructure': textContent = 'Charpente – Structure & Rénovation Intérieure'; break;
                case 'menuiserieBoiserie': textContent = 'Menuiserie et Boiserie'; break;
                case 'ebenisterie': textContent = 'Ébénisterie'; break;
                case 'escalier': textContent = 'Escalier'; break;
                case 'balcon': textContent = 'Balcon'; break;
                case 'isolation': textContent = 'Isolation'; break;
                case 'toiturePente': textContent = 'Toiture Pente'; break;
                case 'toiturePlat': textContent = 'Toiture Plat'; break;
                case 'revetementExterieur': textContent = 'Revêtement Extérieur'; break;
                case 'portesFenetres': textContent = 'Portes et Fenêtres'; break;
                case 'vitrerie': textContent = 'Vitrerie'; break;
                case 'systemeInterieur': textContent = 'Système Intérieur'; break;
                case 'ceramique': textContent = 'Céramique'; break;
                case 'revetementSol': textContent = 'Revêtement de Sol'; break;
                case 'peintureEnduit': textContent = 'Peinture et Enduit'; break;
                case 'aspirateurCentral': textContent = 'Aspirateur Central'; break;
                case 'plomberie': textContent = 'Plomberie'; break;
                case 'ventilation': textContent = 'Ventilation'; break;
                case 'chauffageGaz': textContent = 'Chauffage et Gaz'; break;
                case 'electricite': textContent = 'Électricité'; break;
                default: textContent = key;
            }

            sectionTitle.appendChild(checkbox);
            sectionTitle.appendChild(document.createTextNode(textContent));
            sectionCheckboxesContainer.appendChild(sectionTitle);

            checkbox.addEventListener('change', renderSelectedSections);
        }
    }

    function renderSelectedSections() {
        questionsContainer.innerHTML = '';
        saveAllSectionsButton.style.display = 'none';

        const selectedSectionKeys = Array.from(document.querySelectorAll('input[name="selectedSection"]:checked'))
                                       .map(cb => cb.value);

        if (selectedSectionKeys.length > 0) {
            selectedSectionKeys.forEach(sectionKey => {
                const questions = allQuestions[sectionKey];
                if (questions) {
                    const sectionTitleElement = document.createElement('h3');
                    const sectionNameElement = document.querySelector(`#section-${sectionKey} + label`);
                    sectionTitleElement.textContent = sectionNameElement ? sectionNameElement.textContent : `Section: ${sectionKey}`;
                    sectionTitleElement.style.marginTop = '25px';
                    sectionTitleElement.style.marginBottom = '15px';
                    sectionTitleElement.style.color = '#007bff';
                    questionsContainer.appendChild(sectionTitleElement);

                    questions.forEach(q => {
                        const formGroup = document.createElement('div');
                        formGroup.classList.add('form-group');

                        const label = document.createElement('label');
                        label.setAttribute('for', `${sectionKey}-${q.id}`);
                        label.textContent = q.label;
                        formGroup.appendChild(label);

                        if (q.notes) {
                            const notesSpan = document.createElement('span');
                            notesSpan.classList.add('question-notes');
                            notesSpan.textContent = q.notes;
                            label.appendChild(notesSpan);
                        }

                        const inputId = `${sectionKey}-${q.id}`;

                        if (q.type === 'text' || q.type === 'date' || q.type === 'number' || q.type === 'email' || q.type === 'tel') {
                            const input = document.createElement('input');
                            input.type = q.type;
                            input.id = inputId;
                            input.name = inputId;
                            if (q.placeholder) input.placeholder = q.placeholder;
                            input.value = allAnswers[sectionKey]?.[q.id] || '';
                            formGroup.appendChild(input);
                        } else if (q.type === 'textarea') {
                            const textarea = document.createElement('textarea');
                            textarea.id = inputId;
                            textarea.name = inputId;
                            textarea.rows = 4;
                            textarea.value = allAnswers[sectionKey]?.[q.id] || '';
                            formGroup.appendChild(textarea);
                        } else if (q.type === 'radio') {
                            const radioGroup = document.createElement('div');
                            radioGroup.classList.add('radio-group');
                            q.options.forEach(option => {
                                const radioInput = document.createElement('input');
                                radioInput.type = 'radio';
                                radioInput.id = `${inputId}-${option.value}`;
                                radioInput.name = inputId;
                                radioInput.value = option.value;
                                if (allAnswers[sectionKey]?.[q.id] === option.value) {
                                    radioInput.checked = true;
                                }

                                const radioLabel = document.createElement('label');
                                radioLabel.setAttribute('for', `${inputId}-${option.value}`);
                                radioLabel.textContent = option.text;

                                radioGroup.appendChild(radioInput);
                                radioGroup.appendChild(radioLabel);
                            });
                            formGroup.appendChild(radioGroup);
                        } else if (q.type === 'checkbox') {
                            const checkboxGroup = document.createElement('div');
                            checkboxGroup.classList.add('checkbox-group');
                            q.options.forEach(option => {
                                const checkboxInput = document.createElement('input');
                                checkboxInput.type = 'checkbox';
                                checkboxInput.id = `${inputId}-${option.value}`;
                                checkboxInput.name = inputId;
                                if (Array.isArray(allAnswers[sectionKey]?.[q.id]) && allAnswers[sectionKey][q.id].includes(option.value)) {
                                    checkboxInput.checked = true;
                                }

                                const checkboxLabel = document.createElement('label');
                                checkboxLabel.setAttribute('for', `${inputId}-${option.value}`);
                                checkboxLabel.textContent = option.text;

                                checkboxGroup.appendChild(checkboxInput);
                                checkboxGroup.appendChild(checkboxLabel);
                            });
                            formGroup.appendChild(checkboxGroup);
                        }
                        questionsContainer.appendChild(formGroup);
                    });
                }
            });
            saveAllSectionsButton.style.display = 'inline-block';
            showSummaryButton.style.display = 'inline-block';
        } else {
            showSummaryButton.style.display = 'none'; // Hide if no sections are selected
            pdfActionsDiv.style.display = 'none'; // Hide PDF buttons too
        }
    }

    window.saveProjectInfo = function() {
        allAnswers.projectName = document.getElementById('projectName').value;
        allAnswers.clientName = document.getElementById('clientName').value;
        allAnswers.clientAddress = document.getElementById('clientAddress').value;
        allAnswers.clientTel = document.getElementById('clientTel').value;
        allAnswers.clientEmail = document.getElementById('clientEmail').value;
        localStorage.setItem('covemQuestionnaireAnswers', JSON.stringify(allAnswers));
        alert('Informations générales du projet enregistrées !');
        showSummaryButton.style.display = 'inline-block';
        pdfActionsDiv.style.display = 'block'; // Afficher le conteneur des boutons PDF
    };

    function saveAllSectionAnswers() {
        const selectedSectionKeys = Array.from(document.querySelectorAll('input[name="selectedSection"]:checked'))
                                       .map(cb => cb.value);

        if (selectedSectionKeys.length === 0) {
            alert('Veuillez sélectionner au moins une section à enregistrer.');
            return;
        }

        let sectionsSavedCount = 0;

        selectedSectionKeys.forEach(sectionKey => {
            const currentSectionAnswers = {};
            const questionsInThisSection = allQuestions[sectionKey];

            if (questionsInThisSection) {
                questionsInThisSection.forEach(q => {
                    const inputId = `${sectionKey}-${q.id}`;
                    if (q.type === 'text' || q.type === 'date' || q.type === 'number' || q.type === 'email' || q.type === 'tel' || q.type === 'textarea') {
                        const input = document.getElementById(inputId);
                        if (input) {
                            currentSectionAnswers[q.id] = input.value;
                        }
                    } else if (q.type === 'radio') {
                        const selectedRadio = document.querySelector(`input[name="${inputId}"]:checked`);
                        if (selectedRadio) {
                            currentSectionAnswers[q.id] = selectedRadio.value;
                        } else {
                            currentSectionAnswers[q.id] = '';
                        }
                    } else if (q.type === 'checkbox') {
                        const checkedCheckboxes = Array.from(document.querySelectorAll(`input[name="${inputId}"]:checked`))
                                                        .map(cb => cb.value);
                        currentSectionAnswers[q.id] = checkedCheckboxes;
                    }
                });
                allAnswers[sectionKey] = currentSectionAnswers;
                sectionsSavedCount++;
            }
        });

        localStorage.setItem('covemQuestionnaireAnswers', JSON.stringify(allAnswers));
        alert(`Réponses pour ${sectionsSavedCount} section(s) enregistrées !`);
        showSummaryButton.style.display = 'inline-block';
        pdfActionsDiv.style.display = 'block'; // Afficher le conteneur des boutons PDF
    }

    function displaySummary() {
        summaryContainer.style.display = 'block';
        let summaryText = '--- Résumé du Questionnaire COVEM ---\n\n';

        summaryText += 'INFORMATIONS GÉNÉRALES DU PROJET:\n';
        summaryText += `Nom du projet: ${allAnswers.projectName || 'Non renseigné'}\n`;
        summaryText += `Nom client: ${allAnswers.clientName || 'Non renseigné'}\n`;
        summaryText += `Adresse: ${allAnswers.clientAddress || 'Non renseigné'}\n`;
        summaryText += `Tél.: ${allAnswers.clientTel || 'Non renseigné'}\n`;
        summaryText += `Courriel: ${allAnswers.clientEmail || 'Non renseigné'}\n\n`;
        summaryText += '-------------------------------------\n\n';

        for (const sectionKey in allQuestions) {
            if (allAnswers[sectionKey]) {
                const checkboxElement = document.getElementById(`section-${sectionKey}`);
                const sectionNameLabel = checkboxElement ? checkboxElement.nextSibling.textContent : sectionKey;
                summaryText += `SECTION: ${sectionNameLabel.toUpperCase()}\n`;
                allQuestions[sectionKey].forEach(q => {
                    let answer = allAnswers[sectionKey][q.id];
                    if (Array.isArray(answer)) {
                        answer = answer.length > 0 ? answer.join(', ') : 'Non sélectionné';
                    } else if (answer === undefined || answer === null || answer === '') {
                        answer = 'Non renseigné';
                    }
                    summaryText += `  ${q.label}: ${answer}\n`;
                });
                summaryText += '\n';
            }
        }
        summaryContent.textContent = summaryText;
        pdfActionsDiv.style.display = 'block'; // Afficher le conteneur des boutons PDF
    }

    // Fonction modifiée pour générer le PDF (téléchargement)
    function generatePdf() {
        displaySummary();

        const element = document.getElementById('summaryContainer');
        const opt = {
            margin: 1,
            filename: `Questionnaire_COVEM_${allAnswers.projectName || 'Sans_Nom'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Utilise .save() pour déclencher le téléchargement
        html2pdf().set(opt).from(element).save();
    }

    // Nouvelle fonction pour imprimer le PDF
    function printPdf() {
        displaySummary(); // Assure que le résumé est affiché et à jour

        const element = document.getElementById('summaryContainer');
        const opt = {
            margin: 1,
            filename: `Questionnaire_COVEM_Impression_${allAnswers.projectName || 'Sans_Nom'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Utilise .output('bloburl') pour obtenir l'URL du blob du PDF
        // Puis l'ouvre dans une nouvelle fenêtre pour l'impression
        html2pdf().set(opt).from(element).output('bloburl').then(function(pdfBlobUrl) {
            const printWindow = window.open(pdfBlobUrl);
            printWindow.onload = function() {
                printWindow.print();
            };
        });
    }

    generateSectionCheckboxes();

    saveAllSectionsButton.addEventListener('click', saveAllSectionAnswers);
    showSummaryButton.addEventListener('click', displaySummary);
    generatePdfButton.addEventListener('click', generatePdf);
    printPdfButton.addEventListener('click', printPdf); // Écouteur pour le bouton d'impression
});
