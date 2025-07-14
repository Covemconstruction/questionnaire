// Section labels and questions
const sectionLabels = {contexteGeneral: "1. Contexte général du projet", plansDocuments: "2. Plans et documents fournis", fraisGeneraux: "3. Frais Généraux", excavation: "4. Excavation", demolitio": "5. Démolition", beton: "6. Béton", pieuxVisses: "7. Pieux Vissés", maconnerie: "8. Maçonnerie", acierMetaux: "9. Acier Métaux Ouvrés", charpenteStructure: "10. Charpente – Structure & Rénovation Intérieure", menuiserieBoiserie: "11. Menuiserie et Boiserie", ebenisterie: "12. Ébénisterie", escalier: "13. Escalier", balcon: "14. Balcon", isolation: "15. Isolation", toiturePente: "16. Toiture Pente", toiturePlat: "17. Toiture Plat", "revetementExterieur": "18. Revêtement Extérieur", "portesFenetres": "19. Portes et Fenêtres", "vitrerie": "20. Vitrerie", "systemeInterieur": "21. Système Intérieur", "ceramique": "22. Céramique", "revetementSol": "23. Revêtement de Sol", "peintureEnduit": "24. Peinture et Enduit", "aspirateurCentral": "25. Aspirateur Central", "plomberie": "26. Plomberie", "ventilation": "27. Ventilation", "chauffageGaz": "28. Chauffage et Gaz", "electricite": "29. Électricité"};

const allquestions = {
contexteGeneral: [
    { id: 'q1', label: 'Question 1 pour 1. Contexte général du projet ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
plansDocuments: [
    { id: 'q1', label: 'Question 1 pour 2. Plans et documents fournis ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
fraisGeneraux: [
    { id: 'q1', label: 'Question 1 pour 3. Frais Généraux ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
excavation: [
    { id: 'q1', label: 'Question 1 pour 4. Excavation ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
demolition: [
    { id: 'q1', label: 'Question 1 pour 5. Démolition ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
beton: [
    { id: 'q1', label: 'Question 1 pour 6. Béton ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
pieuxVisses: [
    { id: 'q1', label: 'Question 1 pour 7. Pieux Vissés ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
maconnerie: [
    { id: 'q1', label: 'Question 1 pour 8. Maçonnerie ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
acierMetaux: [
    { id: 'q1', label: 'Question 1 pour 9. Acier Métaux Ouvrés ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
charpenteStructure: [
    { id: 'q1', label: 'Question 1 pour 10. Charpente – Structure & Rénovation Intérieure ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
menuiserieBoiserie: [
    { id: 'q1', label: 'Question 1 pour 11. Menuiserie et Boiserie ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
ebenisterie: [
    { id: 'q1', label: 'Question 1 pour 12. Ébénisterie ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
escalier: [
    { id: 'q1', label: 'Question 1 pour 13. Escalier ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
balcon: [
    { id: 'q1', label: 'Question 1 pour 14. Balcon ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
isolation: [
    { id: 'q1', label: 'Question 1 pour 15. Isolation ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
toiturePente: [
    { id: 'q1', label: 'Question 1 pour 16. Toiture Pente ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
toiturePlat: [
    { id: 'q1', label: 'Question 1 pour 17. Toiture Plat ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
revetementExterieur: [
    { id: 'q1', label: 'Question 1 pour 18. Revêtement Extérieur ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
portesFenetres: [
    { id: 'q1', label: 'Question 1 pour 19. Portes et Fenêtres ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
vitrerie: [
    { id: 'q1', label: 'Question 1 pour 20. Vitrerie ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
systemeInterieur: [
    { id: 'q1', label: 'Question 1 pour 21. Système Intérieur ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
ceramique: [
    { id: 'q1', label: 'Question 1 pour 22. Céramique ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
revetementSol: [
    { id: 'q1', label: 'Question 1 pour 23. Revêtement de Sol ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
peintureEnduit: [
    { id: 'q1', label: 'Question 1 pour 24. Peinture et Enduit ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
aspirateurCentral: [
    { id: 'q1', label: 'Question 1 pour 25. Aspirateur Central ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
plomberie: [
    { id: 'q1', label: 'Question 1 pour 26. Plomberie ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
ventilation: [
    { id: 'q1', label: 'Question 1 pour 27. Ventilation ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
chauffageGaz: [
    { id: 'q1', label: 'Question 1 pour 28. Chauffage et Gaz ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
electricite: [
    { id: 'q1', label: 'Question 1 pour 29. Électricité ?', type: 'text' },
    { id: 'q2', label: 'Avez-vous des informations supplémentaires ?', type: 'textarea' }
],
};
