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
    contexteGeneral: [
            { id: 'raisonProjet', label: 'Quelle est la principale raison de ce projet ? (agrandir, rénover, vendre, adapter, louer, etc.)', type: 'text' },
            { id: 'elementDeclencheur', label: 'Quel est l’élément déclencheur ? (problème structurel, besoin de plus d’espace, héritage, etc.)', type: 'text' },
            { id: 'echeancier', label: 'Avez-vous un échéancier en tête ?', type: 'text', placeholder: 'Ex: 6 mois, Printemps 2026' },
            { id: 'contraintes', label: 'Y a-t-il des contraintes familiales, financières, légales ou personnelles importantes à considérer ?', type: 'textarea' },
            { id: 'honoraireNotes', label: 'HONORAIRE (0001 00) NOTES ET QUESTION:', type: 'textarea' }
        ],
        plansDocuments: [
            { id: 'avezPlans', label: 'Avez-vous des plans ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plansDeposesVille', label: 'Ces plans ont-ils été déposés à la Ville ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plansAJour', label: 'Ces plans sont-ils à jour avec vos intentions actuelles ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'avisNonConformite', label: 'Avez-vous reçu un avis de non-conformité ou un refus de permis ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plansIngenieux', label: 'Avez-vous des plans ingénieux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] }
        ],
        fraisGeneraux: [
            { id: 'fraisGenerauxNotes', label: 'FRAIS GÉNÉRAUX (0001 50) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'stationnementTravaux', label: 'Y a-t-il un espace pour stationnement pendant les travaux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'accesVehiculeLivraisonFacile', label: 'Les accès pour tout type de véhicule et livraison sont-ils faciles ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'accesMachinerieFacile', label: 'Accessibilité facile pour la machinerie ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'habiterPendantTravaux', label: 'Est ce que vous allez habiter dans la résidence durant les travaux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'espaceRangementTemporaire', label: 'Avez-vous prévu un espace de rangement temporaire ?', type: 'checkbox', options: [{ value: 'goCube', text: 'Go cube' }, { value: 'miniEntrepot', text: 'Mini- entrepôt' }, { value: 'autreMaison', text: 'Autre maison' }] },
            { id: 'fraisGenerauxCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        excavation: [
            { id: 'excavationNotes', label: 'EXCAVATION (0002 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'protectionCheminAcces', label: 'Besoin de protection des chemin d\'accès (Pavé, asphalte, etc)', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'clotureEnleverReplacer', label: 'Clôture à enlever et replacer', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'terrainMaterielRemblai', label: 'Espace de terrain disponible pour le matériel de remblai laissé sur place', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'demolitionAutreQuePlan', label: 'Démolition à retirer autre que selon plan ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'elementsAEmonderRetirer', label: 'Éléments à émonder/retirer :', type: 'checkbox', options: [{ value: 'emondage', text: 'Émondage' }, { value: 'soucheHaie', text: 'Souche - haie' }, { value: 'haie', text: 'Haie' }, { value: 'balcon', text: 'Balcon' }, { value: 'cabanon', text: 'Cabanon' }] },
            { id: 'etendueTravauxDrainFrancais', label: 'L\'étendue des travaux pour le drain français ?', type: 'radio', options: [{ value: 'refaireComplet', text: 'Refaire complet' }, { value: 'refairePartielAgrandissement', text: 'Refaire partiel ou seulement agrandissement' }, { value: 'maisonNeuve', text: 'Maison neuve' }] },
            { id: 'typeMembraneFondations', label: 'Type de membrane pour les fondations ?', type: 'radio', options: [{ value: 'enduitBitumeElastomere', text: 'Enduit bitume / Élastomère' }, { value: 'delta', text: 'Delta' }] },
            { id: 'excavationCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        demolition: [
            { id: 'demolitionNotes', label: 'DÉMOLITION (0002 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'demolitionPrevues', label: 'Démolition prévue :', type: 'radio', options: [{ value: 'partiel', text: 'Partiel' }, { value: 'complet', text: 'Complet' }] },
            { id: 'demolitionCommentaire', label: 'Commentaire :', type: 'textarea' },
            { id: 'elementsConserverReinstaller', label: 'Avez vous des éléments à conserver pour réinstaller ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'materiauxEntreposerSurPlace', label: 'Des matériaux à entreposer sur place ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] }
        ],
        beton: [
            { id: 'betonNotes', label: 'BÉTON (0003 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'fondationExistanteBonEtat', label: 'Vos fondation existantes sont-elles en bonne état ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'fissuresApparentes', label: 'Est-ce que vous avez des fissures apparentes ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'finitionDalleFondation', label: 'Finition de la dalle de fondation ?', type: 'checkbox', options: [{ value: 'truelle', text: 'Truelle' }, { value: 'mecanique', text: 'Mécanique' }, { value: 'scellant', text: 'Scellant' }, { value: 'epoxy', text: 'Epoxy' }] },
            { id: 'betonCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        pieuxVisses: [
            { id: 'pieuxVissesNotes', label: 'PIEUX VISSÉS (0003 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'accessibiliteMachineriePieux', label: 'Accessibilité de machinerie pour pieuter ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'pieuxVissesCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        maconnerie: [
            { id: 'maconnerieNotes', label: 'MAÇONNERIE (0004 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'etatMaconnerieExistante', label: 'Quel est l’état de la maçonnerie existante (brique, pierre, mortier) ?', type: 'radio', options: [{ value: 'aRemplacer', text: 'À remplacer' }, { value: 'aReparer', text: 'À réparer' }, { value: 'enBonEtat', text: 'En bonne état' }] },
            { id: 'choixMateriauxMaconnerieArretes', label: 'Vos choix de matériaux de maçonnerie sont-ils arrêtés ?', type: 'checkbox', options: [{ value: 'brique', text: 'Brique' }, { value: 'pierre', text: 'Pierre' }, { value: 'maconnerieDecorative', text: 'Maçonnerie décorative' }] },
            { id: 'maconnerieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        acierMetaux: [
            { id: 'acierMetauxNotes', label: 'ACIER MÉTAUX OUVRÉS (0005 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'accesLivraisonAcier', label: 'Accès pour la livraison ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'necessiteGrueInstallation', label: 'Nécessite une grue pour l’installation ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'acierMetauxCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        charpenteStructure: [
            { id: 'charpenteStructureNotes', label: 'CHARPENTE – STRUCTURE & RÉNOVATION INTÉRIEURE (0006 10) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'plancherTravauxNivellement', label: 'Des travaux sont-ils à prévoir pour un nivellement des planchers ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plancherMouRebondit', label: 'Avez-vous remarqué des endroits où le plancher ou le plafond est "mou" ou rebondit ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plancherDroitCreuxPentes', label: 'Le plancher est-il droit ou présente-t-il des creux ou des pentes à redresser ?', type: 'radio', options: [{ value: 'droit', text: 'Droit' }, { value: 'creuxPentes', text: 'Creux ou Pentes' }, { value: 'nonApplicable', text: 'N/A' }] },
            { id: 'signesAffaissementMouvementStructurel', label: 'Présente-t-il des signes d’affaissement ou de mouvement structurel ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'corrigerHauteurPlancher', label: 'Faut-il corriger une hauteur de plancher (matcher une extension ou un ancien plancher) ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'besoinRenforcerModifierStructure', label: 'Y a-t-il un besoin de renforcer ou modifier la structure existante ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'travauxCharpenteRenfortPasse', label: 'Y a-t-il déjà eu des travaux de charpente ou de renfort par le passé ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'modifieSansPermisIngenierie', label: 'Modifiée sans permis ou sans ingénierie ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }, { value: 'neSaitPas', text: 'Ne sait pas' }] },
            { id: 'elementsStructurelsDegarnirInspecter', label: 'Y a-t-il des éléments structurels à dégarnir ou mettre à nu pour inspection ou renforcement ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'espacesToitureEntreEtagesAccessibles', label: 'Les espaces de toiture ou entre-étages sont-ils facilement accessibles pour inspection ou renfort ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'charpenteCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        menuiserieBoiserie: [
            { id: 'menuiserieBoiserieNotes', label: 'MENUISERIE ET BOISERIE (0006 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacePortesBoiseries', label: 'Remplace-t-on les portes et boiseries ?', type: 'radio', options: [{ value: 'maisonComplet', text: 'Maison complet' }, { value: 'maisonPartiel', text: 'Maison partiel' }] },
            { id: 'choixTypeMoulure', label: 'Avez-vous fait un choix sur le type de moulure voulue ?', type: 'checkbox', options: [{ value: 'carree', text: 'Carrée' }, { value: 'zenBiseaute', text: 'Zen biseauté' }, { value: 'colonial', text: 'Colonial' }, { value: 'retourGypse', text: 'Retour en gypse' }] },
            { id: 'menuiserieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        ebenisterie: [
            { id: 'ebenisterieNotes', label: 'ÉBÉNISTERIE (0006 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'ebenisteriePriseEnChargePar', label: 'L’ébénisterie du projet est prise en charge par ?', type: 'radio', options: [{ value: 'client', text: 'Le client' }, { value: 'covem', text: 'COVEM' }] },
            { id: 'budgetArmoireCuisine', label: 'Voulez-vous un budget d’armoire cuisine ? Et le type de qualité souhaité ?', type: 'radio', options: [{ value: 'hautGamme', text: 'Haut gamme' }, { value: 'moyenneGamme', text: 'Moyenne gamme' }, { value: 'basDeGamme', text: 'Bas de gamme' }, { value: 'non', text: 'Non' }] },
            { id: 'vaniteArmoireFourniesPar', label: 'Les vanités et armoires de rangement sauront fournir par :', type: 'radio', options: [{ value: 'client', text: 'Le client' }, { value: 'covem', text: 'COVEM' }] },
            { id: 'ebenisterieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        escalier: [
            { id: 'escalierNotes', label: 'ESCALIER (0006 45) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'travauxEscalier', label: 'Travaux à faire pour l’escalier ?', type: 'checkbox', options: [{ value: 'nouvelleEscalier', text: 'Nouvelle escalier' }, { value: 'remplacementMarche', text: 'Remplacement de marche' }, { value: 'remplacementGardeCorps', text: 'Remplacement des garde corps' }, { value: 'sablerVernir', text: 'Sabler vernir' }] },
            { id: 'choixClientEscalier', label: 'Votre choix client d’escalier (Bois, acier, etc.)', type: 'radio', options: [{ value: 'plein', text: 'Plein' }, { value: 'limonCentrale', text: 'Limon centrale' }] },
            { id: 'essenceBoisEscalier', label: 'Essence du bois ?', type: 'checkbox', options: [{ value: 'erable', text: 'Érable' }, { value: 'chene', text: 'Chêne' }, { value: 'merisier', text: 'Merisier' }, { value: 'autre', text: 'Autre' }] },
            { id: 'escalierCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        balcon: [
            { id: 'balconNotes', label: 'BALCON (0006 60) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'choixStyleBalcon', label: 'Choix du style de balcon souhaité ?', type: 'radio', options: [{ value: 'boisTraitePlancherBoisTraiteBrun', text: 'Structure en Bois traité et Plancher bois traité brun' }, { value: 'boisTraitePlancherCedreRouge', text: 'Structure en Bois traité et Plancher en cèdre rouge' }, { value: 'boisTraitePlancherIpe', text: 'Structure en Bois traité et Plancher ipé' }, { value: 'boisTraitePlancherComposite', text: 'Structure en Bois traité et Plancher en composite' }, { value: 'aluminiumPlancherComposite', text: 'Structure en aluminium et Plancher composite' }] },
            { id: 'choixStyleGardeCorps', label: 'Choix du style de garde du corps souhaité ?', type: 'radio', options: [{ value: 'boisTraiteBrun', text: 'Bois traité brun' }, { value: 'aluminium', text: 'Aluminium' }, { value: 'verre', text: 'Verre' }] },
            { id: 'balconCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        isolation: [
            { id: 'isolationNotes', label: 'ISOLATION (0007 20) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'verifierIsolationToitExistant', label: 'Avez-vous besoin de vérifier l’isolation du toit existant ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'renoclimatSubventions', label: 'Avez-vous fait affaire avec Rénoclimat pour les subventions ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'anneeConstructionResidence', label: 'La résidence a été construite en quelle année ?', type: 'radio', options: [{ value: '1950', text: '1950' }, { value: '1960', text: '1960' }, { value: '1970', text: '1970' }, { value: '1980', text: '1980' }, { value: '1990', text: '1990' }, { value: '2000', text: '2000' }, { value: '2010', text: '2010' }, { value: '2020', text: '2020' }] },
            { id: 'isolationCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        toiturePente: [
            { id: 'toiturePenteNotes', label: 'TOITURE PENTE (0007 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacementBardeaux', label: 'Remplacement du bardeaux ?', type: 'radio', options: [{ value: 'toitureComplete', text: 'Toiture complète' }, { value: 'panToitureAnnexeSeulement', text: 'Pan de toiture seulement avec l\'annexe' }, { value: 'toiturePartielReagreage', text: 'Toiture partielle réagréage de la nouvelle à l\'existence' }] },
            { id: 'marqueCouleurBardeaux', label: 'Connaissez-vous la marque et la couleur de bardeaux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'bardeauxRemplaceAnnee', label: 'Votre bardeaux a été remplacé il y a combien d’années ?', type: 'number', placeholder: 'Nombre d\'années' },
            { id: 'toiturePenteCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        toiturePlat: [
            { id: 'toiturePlatNotes', label: 'TOITURE PLAT (0007 31) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacementMembrane', label: 'Remplacement de membrane ?', type: 'radio', options: [{ value: 'reparationSeulement', text: 'Réparation seulement' }, { value: 'toitureComplete', text: 'Toiture complète' }, { value: 'toiturePartielReagreage', text: 'Toiture partielle réagréage de la nouvelle à l\'existence' }] },
            { id: 'typeMembraneToiturePlat', label: 'Type membrane ?', type: 'radio', options: [{ value: 'asphalteGravier', text: 'Asphalte et gravier' }, { value: 'elastomere', text: 'Élastomère' }, { value: 'tpo', text: 'TPO' }, { value: 'epdm', text: 'EPDM' }] },
            { id: 'toiturePlatCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        revetementExterieur: [
            { id: 'revetementExterieurNotes', label: 'REVÊTEMENT EXTÉRIEUR (0007 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacageRevetement', label: 'Est-ce que nous remplaçons le revêtement ?', type: 'radio', options: [{ value: 'partieNeuveSeulement', text: 'Sur la partie neuve seulement' }, { value: 'facesParticulieres', text: 'Sur des faces en particulier (Ex.: arrière complet)' }, { value: 'maisonComplete', text: 'Remplacement du revêtement de la maison complète' }] },
            { id: 'choixRevetement', label: 'Quel est votre choix de revêtement ?', type: 'checkbox', options: [{ value: 'vinyle', text: 'Vinyle' }, { value: 'canexel', text: 'Canexel' }, { value: 'fibrociment', text: 'Fibrociment' }, { value: 'maibecBois', text: 'Maibec ou bois' }, { value: 'aluminium', text: 'Aluminium' }, { value: 'acierStyleMac', text: 'Acier style (MAC)' }] },
            { id: 'sensPoseRevetement', label: 'Le sens de pose ?', type: 'radio', options: [{ value: 'horizontale', text: 'Horizontale' }, { value: 'verticale', text: 'Verticale' }] },
            { id: 'choixCouleurFasciaGouttiere', label: 'Choix client couleur de fascia gouttière suffit ?', type: 'radio', options: [{ value: 'blanc', text: 'Blanc' }, { value: 'noir', text: 'Noir' }, { value: 'brunCommercial', text: 'Brun commercial' }, { value: 'autre', text: 'Autre' }] },
            { id: 'gouttiereTravaux', label: 'Gouttière', type: 'radio', options: [{ value: 'enleverReinstaller', text: 'Enlever et réinstaller' }, { value: 'remplacementPartiel', text: 'Remplacement partiel' }, { value: 'remplacementComplet', text: 'Remplacement complet' }] },
            { id: 'revetementExterieurCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        portesFenetres: [
            { id: 'portesFenetresNotes', label: 'PORTES ET FENÊTRES (0008 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'typeOuvrant', label: 'Type d’ouvrant', type: 'checkbox', options: [{ value: 'guillotine', text: 'Guillotine' }, { value: 'battant', text: 'Battant' }, { value: 'coulissante', text: 'Coulissante' }] },
            { id: 'typeFenetres', label: 'Type de fenêtres', type: 'checkbox', options: [{ value: 'pvc', text: 'PVC' }, { value: 'hybride', text: 'Hybride' }] },
            { id: 'choixCouleurPortesFenetres', label: 'Choix client couleur', type: 'checkbox', options: [{ value: 'blanc', text: 'Blanc' }, { value: 'noir', text: 'Noir' }, { value: 'brunCommercial', text: 'Brun commercial' }, { value: 'charcoal', text: 'Charcoal' }] },
            { id: 'choixTypeVerre', label: 'Choix client type de verre', type: 'radio', options: [{ value: 'double', text: 'Double' }, { value: 'triple', text: 'Triple' }] },
            { id: 'portesFenetresCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        vitrerie: [
            { id: 'vitrerieNotes', label: 'VITRERIE (0008 80) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'vitreDoucheFournisPar', label: 'Vitre de douche fournis par :', type: 'radio', options: [{ value: 'client', text: 'Fournis par le client' }, { value: 'covem', text: 'Fournis par COVEM' }] },
            { id: 'styleVitre', label: 'Style de vitre', type: 'radio', options: [{ value: 'prefabrique', text: 'Vitre préfabriqué' }, { value: 'surMesure', text: 'Vitre sur mesure' }] },
            { id: 'vitrerieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        systemeInterieur: [
            { id: 'systemeInterieurNotes', label: 'SYSTÈME INTÉRIEUR (0009 20) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'retourGypsePortesFenetres', label: 'Retour en gypse pour les portes, fenêtres ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'autreFinitionGypseNonStandard', label: 'Autre type de finition en gypse non standard.', type: 'textarea' },
            { id: 'systemeInterieurCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        ceramique: [
            { id: 'ceramiqueNotes', label: 'CÉRAMIQUE (0009 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'ceramiqueFourniePar', label: 'La Céramique est fournie :', type: 'radio', options: [{ value: 'client', text: 'Par le client' }, { value: 'covem', text: 'Par COVEM budgétaire' }] },
            { id: 'plancherChauffantCeramique', label: 'Est-ce que nous installons des planchers chauffants ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'ceramiqueCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        revetementSol: [
            { id: 'revetementSolNotes', label: 'REVÊTEMENT DE SOL (0009 60) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'revetementPlancherFournisPar', label: 'Le revêtement de plancher est fourni :', type: 'radio', options: [{ value: 'client', text: 'Par le client' }, { value: 'covem', text: 'Par COVEM budgétaire' }] },
            { id: 'typePlancherActuel', label: 'Quel est le type de votre plancher actuel ?', type: 'radio', options: [{ value: 'marqueterie', text: 'Marqueterie' }, { value: 'boisFranc', text: 'Bois franc' }, { value: 'ingenierie', text: 'Ingénierie' }, { value: 'vinyleClic', text: 'Vinyle clic' }, { value: 'flottant', text: 'Flottant' }] },
            { id: 'etatPlancherActuel', label: 'Quel est l\'état de votre plancher actuel ?', type: 'checkbox', options: [{ value: 'droit', text: 'Droit' }, { value: 'vallonne', text: 'Vallonné' }, { value: 'croche', text: 'Croche' }, { value: 'aSabler', text: 'À sabler' }] },
            { id: 'plancherChauffantRevetement', label: 'Est-ce que nous installons des planchers chauffants ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'choixClientTypePlancher', label: 'Choix client type de plancher ?', type: 'radio', options: [{ value: 'boisFranc', text: 'Bois franc' }, { value: 'ingenierie', text: 'Ingénierie' }, { value: 'vinyleClic', text: 'Vinyle clic' }, { value: 'flottant', text: 'Flottant' }] },
            { id: 'revetementSolCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        peintureEnduit: [
            { id: 'peintureEnduitNotes', label: 'PEINTURE ET ENDUIT (0009 90) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'etendueTravauxPeinture', label: 'Quelle est l’étendue des travaux ?', type: 'radio', options: [{ value: 'sectionRenoveeAgrandie', text: 'Peindre seulement la section rénovée ou agrandie' }, { value: 'toutEtageTravaux', text: 'Peindre tout l’étage des travaux' }, { value: 'touteMaison', text: 'Peindre toute la maison' }] },
            { id: 'zonesTransitionExclure', label: 'Zones de transition à exclure (ex. : corridors, plafonds, murs attenants)', type: 'textarea' },
            { id: 'choixCouleurs', label: 'Choix de vos couleurs', type: 'text', placeholder: 'Ex: Blanc cassé, Gris perle...' },
            { id: 'couleurUniqueOuDifferente', label: 'Voulez-vous une seule couleur partout ou des couleurs différentes par pièce?', type: 'radio', options: [{ value: 'unique', text: 'Une seule couleur partout' }, { value: 'differenteParPiece', text: 'Couleurs différentes par pièce' }] },
            { id: 'finiStandardOuSpecial', label: 'Préférez-vous un fini standard ou quelque chose de spécial (Plafond mat, Mur velour, boiseries semi lustré) ?', type: 'text', placeholder: 'Ex: Standard, Plafond mat, Mur velours...' },
            { id: 'etatMursPlafondsExistants', label: 'Les murs et plafonds sont-ils en bon état ou nécessitent-ils des réparations ?', type: 'text', placeholder: 'Décrire l\'état et les réparations si nécessaires' },
            { id: 'maisonPeinteRecemment', label: 'Est-ce que la maison a été peinte récemment ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'peintureCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        aspirateurCentral: [
            { id: 'aspirateurCentralNotes', label: 'ASPIRATEUR CENTRAL (0011 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'travauxBalayeuseCentrale', label: 'Balayeuse centrale', type: 'radio', options: [{ value: 'nouvelle', text: 'Nouvelle balayeuse' }, { value: 'modifierDeplacerSorties', text: 'Modifier ou déplacer les sorties seulement' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            { id: 'aspirateurCentralCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        plomberie: [
            { id: 'plomberieNotes', label: 'PLOMBERIE (0022 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'typeTravauxPlomberie', label: 'Type de travaux de plomberie', type: 'checkbox', options: [{ value: 'nouvelleComplete', text: 'Nouvelle plomberie complète' }, { value: 'sousDalle', text: 'Plomberie sous dalle' }, { value: 'roughSeulement', text: 'Plomberie rough seulement' }, { value: 'roughInstallationFinition', text: 'Plomberie rough et installation de la finition' }, { value: 'remplacementAppareilsTelQuel', text: 'Remplacement des appareils tel quel' }] },
            { id: 'complexiteTravauxPlomberie', label: 'Complexité des travaux de plomberie', type: 'radio', options: [{ value: 'facileAccessible', text: 'La plomberie est facile accessible' }, { value: 'deplacementMineur', text: 'Déplacement mineur' }, { value: 'deplacementMajeur', text: 'Déplacement majeur' }] },
            { id: 'baseDoucheChoisie', label: 'Base de douche choisie', type: 'radio', options: [{ value: 'acrylique', text: 'Acrylique' }, { value: 'doucheItalienSansSeuil', text: 'Douche Italien sans seuil' }] },
            { id: 'accessoiresFournisPar', label: 'Les accessoires sont fournis :', type: 'radio', options: [{ value: 'client', text: 'Par le client' }, { value: 'covem', text: 'Par COVEM budgétaire' }] },
            { id: 'plomberieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        ventilation: [
            { id: 'ventilationNotes', label: 'VENTILATION (0023 00) NOTES ET QUESTION:', type: 'textarea' },
            // Hotte de cuisine
            { id: 'hotteCuisineTravaux', label: 'Hotte de cuisine :', type: 'radio', options: [{ value: 'nouveauConduitsFinition', text: 'Nouveau conduits et finition' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Ventilateur de salle de bain
            { id: 'ventilateurSalleBainTravaux', label: 'Ventilateur de salle de bain :', type: 'radio', options: [{ value: 'nouveauConduitsFinition', text: 'Nouveau conduits et finition' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Sortie de sécheuse
            { id: 'sortieSecheuseTravaux', label: 'Sortie de sécheuse :', type: 'radio', options: [{ value: 'nouveauConduitsFinition', text: 'Nouveau conduits et finition' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Thermopompe murale
            { id: 'thermopompeMuraleTravaux', label: 'Thermopompe murale :', type: 'radio', options: [{ value: 'nouvelleInstallation', text: 'Nouvelle installation' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Thermopompe centrale
            { id: 'thermopompeCentraleTravaux', label: 'Thermopompe centrale :', type: 'radio', options: [{ value: 'nouvelleInstallation', text: 'Nouvelle installation' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Échangeur d’air existant
            { id: 'echangeurAirExistantTravaux', label: 'Échangeur d’air existant :', type: 'radio', options: [{ value: 'nouvelleInstallation', text: 'Nouvelle installation' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            { id: 'ventilationCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        chauffageGaz: [
            { id: 'chauffageGazNotes', label: 'CHAUFFAGE ET GAZ (0024 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'foyerGazEnPlace', label: 'Avez-vous un foyer au gaz déjà en place?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'foyerConformeFonctionnel', label: 'Est-ce qu’il est conforme et fonctionnel selon vos connaissances?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }, { value: 'neSaitPas', text: 'Ne sait pas' }] },
            { id: 'cuisiniereGazNaturelPropane', label: 'Est-ce que votre cuisinière ou autre appareil fonctionne au gaz naturel ou propane?', type: 'radio', options: [{ value: 'naturel', text: 'Gaz naturel' }, { value: 'propane', text: 'Propane' }, { value: 'electrique', text: 'Électrique' }] },
            { id: 'ajouterLigneGazExterieureBBQ', label: 'Souhaitez-vous ajouter une ligne de gaz extérieure pour un BBQ ou un autre appareil ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'chauffageGazCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        electricite: [
            { id: 'electriciteNotes', label: 'ÉLECTRICITÉ (0026 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'typePanneauElectrique', label: 'Type de panneau électrique', type: 'radio', options: [{ value: 'siemens', text: 'Siemens' }, { value: 'eatonCutlerHammer', text: 'Eaton / Cutler-Hammer' }, { value: 'squareD', text: 'Square D (Schneider Electric)' }, { value: 'federalPioneerSchneider', text: 'Federal Pioneer / Schneider' }, { value: 'homeline', text: 'Homeline (Schneider Electric)' }, { value: 'autre', text: 'Autre' }] },
            { id: 'typeTravauxElectricite', label: 'Type de travaux', type: 'checkbox', options: [{ value: 'menageAjoutBreaker', text: 'Ménage du panneaux et ajout de breaker' }, { value: 'ajoutPanneauSecondaire', text: 'Ajout de panneaux secondaire' }, { value: 'remplacementPanneauExistant', text: 'Remplacement du panneaux existant' }] },
            { id: 'capacitePanneauSecondaire', label: 'Capacité du panneau secondaire (si ajouté)', type: 'radio', options: [{ value: '30circuit', text: '30 circuit' }, { value: '60circuit', text: '60 circuit' }] },
            { id: 'capacitePanneauExistant', label: 'Capacité du panneau existant (si remplacé)', type: 'radio', options: [{ value: '100amp', text: '100 amp' }, { value: '200amp', text: '200 amp' }, { value: '300amp', text: '300 amp' }, { value: '400amp', text: '400 amp' }, { value: '600amp', text: '600 amp' }] },
            { id: 'panneauxEviterRemplacer', label: 'Panneaux à éviter ou à remplacer', type: 'checkbox', options: [{ value: 'commander', text: 'Commander' }, { value: 'zincoChallenger', text: 'Zinco et Challenger' }, { value: 'fpe', text: 'FPE (Federal Pacific Electric)' }] },
            { id: 'souhaitezGradateur', label: 'Souhaitez-vous des Gradateurs ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'souhaitezFixturesLuminairesParticuliers', label: 'Souhaitez-vous des fixtures ou des luminaires particuliers ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'electriciteCommentaire', label: 'Commentaire :', type: 'textarea' }
        ]
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
