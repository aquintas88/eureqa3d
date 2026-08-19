'use strict';

/* ──────────────────────────────────────────────────────────────
   Eureqa3D · Internacionalización (cliente, sin dependencias)
   Idiomas: Español (base) + Inglés, Francés, Alemán, Italiano, Griego
   ────────────────────────────────────────────────────────────── */
(function () {
  const STORAGE_KEY = 'eureqa3d_lang';

  const LANGS = [
    { code: 'es', label: 'Español',  flag: '🇪🇸' },
    { code: 'en', label: 'English',  flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  ];

  const LOCALE = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', el: 'el-GR' };

  /* Diccionario: clave = texto/HTML en español (normalizado) → traducciones */
  const DICT = {
    /* ── Navegación / cabecera ── */
    'Inicio': { en: 'Home', fr: 'Accueil', de: 'Start', it: 'Home', el: 'Αρχική' },
    'Quiénes somos': { en: 'About us', fr: 'À propos', de: 'Über uns', it: 'Chi siamo', el: 'Ποιοι είμαστε' },
    'Método Eureqa': { en: 'Eureqa Method', fr: 'Méthode Eureqa', de: 'Eureqa-Methode', it: 'Metodo Eureqa', el: 'Μέθοδος Eureqa' },
    'Traumatología': { en: 'Traumatology', fr: 'Traumatologie', de: 'Traumatologie', it: 'Traumatologia', el: 'Τραυματολογία' },
    'Otras especialidades': { en: 'Other specialties', fr: 'Autres spécialités', de: 'Weitere Fachbereiche', it: 'Altre specialità', el: 'Άλλες ειδικότητες' },
    'Cirugía Oncológica': { en: 'Oncological Surgery', fr: 'Chirurgie Oncologique', de: 'Onkologische Chirurgie', it: 'Chirurgia Oncologica', el: 'Ογκολογική Χειρουργική' },
    'Modelos 3D digitales': { en: 'Digital 3D Models', fr: 'Modèles 3D numériques', de: 'Digitale 3D-Modelle', it: 'Modelli 3D digitali', el: 'Ψηφιακά τρισδιάστατα μοντέλα' },
    'Noticias': { en: 'News', fr: 'Actualités', de: 'Aktuelles', it: 'Notizie', el: 'Νέα' },
    'Contacto': { en: 'Contact', fr: 'Contact', de: 'Kontakt', it: 'Contatti', el: 'Επικοινωνία' },
    'Solicita un caso de prueba': { en: 'Request a test case', fr: 'Demandez un cas test', de: 'Testfall anfragen', it: 'Richiedi un caso di prova', el: 'Ζητήστε δοκιμαστική περίπτωση' },
    'Caso de prueba': { en: 'Test case', fr: 'Cas test', de: 'Testfall', it: 'Caso di prova', el: 'Δοκιμαστική περίπτωση' },

    /* ── Pie ── */
    'Servicio integral de impresión 3D y modelos digitales especializado en el sector salud. Tecnología y cirugía al servicio del profesional.': {
      en: 'Comprehensive 3D printing and digital models service specialized in the healthcare sector. Technology and surgery at the service of the professional.',
      fr: "Service complet d'impression 3D et de modèles numériques spécialisé dans le secteur de la santé. La technologie et la chirurgie au service du professionnel.",
      de: 'Umfassender Service für 3D-Druck und digitale Modelle, spezialisiert auf den Gesundheitssektor. Technologie und Chirurgie im Dienste des Fachpersonals.',
      it: 'Servizio completo di stampa 3D e modelli digitali specializzato nel settore sanitario. Tecnologia e chirurgia al servizio del professionista.',
      el: 'Ολοκληρωμένη υπηρεσία τρισδιάστατης εκτύπωσης και ψηφιακών μοντέλων ειδικευμένη στον τομέα της υγείας. Τεχνολογία και χειρουργική στην υπηρεσία του επαγγελματία.' },
    'Acceso': { en: 'Login', fr: 'Accès', de: 'Zugang', it: 'Accedi', el: 'Είσοδος' },
    'Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres': { en: 'Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres', fr: 'Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres', de: 'Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres', it: 'Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres', el: 'Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres' },
    'Navegación': { en: 'Navigation', fr: 'Navigation', de: 'Navigation', it: 'Navigazione', el: 'Πλοήγηση' },
    'Aviso legal': { en: 'Legal notice', fr: 'Mentions légales', de: 'Impressum', it: 'Note legali', el: 'Νομική σημείωση' },
    'Privacidad': { en: 'Privacy', fr: 'Confidentialité', de: 'Datenschutz', it: 'Privacy', el: 'Απόρρητο' },
    'Todos los derechos reservados.': { en: 'All rights reserved.', fr: 'Tous droits réservés.', de: 'Alle Rechte vorbehalten.', it: 'Tutti i diritti riservati.', el: 'Με την επιφύλαξη παντός δικαιώματος.' },

    /* ── Inicio ── */
    'Impresión 3D y modelos digitales · Sector salud': { en: '3D Printing & digital models · Healthcare', fr: 'Impression 3D et modèles numériques · Santé', de: '3D-Druck & digitale Modelle · Gesundheitswesen', it: 'Stampa 3D e modelli digitali · Sanità', el: 'Τρισδιάστατη εκτύπωση & ψηφιακά μοντέλα · Υγεία' },
    'Revolucionamos el <span>sector salud</span> con Impresión 3D y modelos digitales': {
      en: 'We are revolutionizing the <span>healthcare sector</span> with 3D Printing and digital models',
      fr: "Nous révolutionnons le <span>secteur de la santé</span> avec l'impression 3D et les modèles numériques",
      de: 'Wir revolutionieren den <span>Gesundheitssektor</span> mit 3D-Druck und digitalen Modellen',
      it: 'Rivoluzioniamo il <span>settore sanitario</span> con la stampa 3D e i modelli digitali',
      el: 'Φέρνουμε επανάσταση στον <span>τομέα της υγείας</span> με τρισδιάστατη εκτύπωση και ψηφιακά μοντέλα' },
    'Trabajamos directamente con los especialistas, facilitándoles la incorporación de la impresión 3D y los modelos digitales de forma fácil y sencilla, con un servicio externo profesional, especializado y exclusivo del sector.': {
      en: 'We work directly with specialists, making it easy and simple for them to adopt 3D printing and digital models, with a professional external service that is specialized and exclusive to the sector.',
      fr: "Nous travaillons directement avec les spécialistes, en leur facilitant l'adoption de l'impression 3D et des modèles numériques de façon simple et aisée, grâce à un service externe professionnel, spécialisé et exclusif au secteur.",
      de: 'Wir arbeiten direkt mit den Fachleuten zusammen und erleichtern ihnen den einfachen und unkomplizierten Einstieg in den 3D-Druck und digitale Modelle – mit einem professionellen externen Service, der auf die Branche spezialisiert und ausschließlich auf sie ausgerichtet ist.',
      it: "Lavoriamo direttamente con gli specialisti, facilitando loro l'adozione della stampa 3D e dei modelli digitali in modo facile e semplice, con un servizio esterno professionale, specializzato ed esclusivo del settore.",
      el: 'Συνεργαζόμαστε απευθείας με τους ειδικούς, διευκολύνοντας την ενσωμάτωση της τρισδιάστατης εκτύπωσης και των ψηφιακών μοντέλων με εύκολο και απλό τρόπο, μέσω μιας επαγγελματικής εξωτερικής υπηρεσίας, εξειδικευμένης και αποκλειστικής για τον κλάδο.' },
    'Conoce el Método Eureqa': { en: 'Discover the Eureqa Method', fr: 'Découvrez la Méthode Eureqa', de: 'Lernen Sie die Eureqa-Methode kennen', it: 'Scopri il Metodo Eureqa', el: 'Γνωρίστε τη Μέθοδο Eureqa' },
    'Qué ofrecemos': { en: 'What we offer', fr: 'Ce que nous offrons', de: 'Was wir bieten', it: 'Cosa offriamo', el: 'Τι προσφέρουμε' },
    'Una nueva y exclusiva herramienta en manos del profesional': { en: 'A new and exclusive tool in the hands of the professional', fr: 'Un outil nouveau et exclusif entre les mains du professionnel', de: 'Ein neues und exklusives Werkzeug in den Händen des Fachmanns', it: 'Un nuovo ed esclusivo strumento nelle mani del professionista', el: 'Ένα νέο και αποκλειστικό εργαλείο στα χέρια του επαγγελματία' },
    'Una nueva y exclusiva herramienta en manos del profesional.': { en: 'A new and exclusive tool in the hands of the professional.', fr: 'Un outil nouveau et exclusif entre les mains du professionnel.', de: 'Ein neues und exklusives Werkzeug in den Händen des Fachmanns.', it: 'Un nuovo ed esclusivo strumento nelle mani del professionista.', el: 'Ένα νέο και αποκλειστικό εργαλείο στα χέρια του επαγγελματία.' },
    'Especializados en el tratamiento de la imagen médica, segmentación, diseño, impresión 3D y modelos digitales: obtenemos una reconstrucción a tamaño real, física o digital, réplica o modelo único de máxima calidad, adaptado a cada patología.': {
      en: 'Specialized in medical image processing, segmentation, design, 3D printing and digital models: we produce a full-scale reconstruction, physical or digital, a replica or unique model of the highest quality, tailored to each pathology.',
      fr: "Spécialisés dans le traitement de l'image médicale, la segmentation, la conception, l'impression 3D et les modèles numériques : nous obtenons une reconstruction à taille réelle, physique ou numérique, une réplique ou un modèle unique de la plus haute qualité, adapté à chaque pathologie.",
      de: 'Spezialisiert auf die Verarbeitung medizinischer Bilder, Segmentierung, Design, 3D-Druck und digitale Modelle: Wir erstellen eine Rekonstruktion in Originalgröße, physisch oder digital, eine Replik oder ein einzigartiges Modell höchster Qualität, das an jede Pathologie angepasst ist.',
      it: "Specializzati nel trattamento dell'immagine medica, segmentazione, progettazione, stampa 3D e modelli digitali: otteniamo una ricostruzione a grandezza naturale, fisica o digitale, una replica o un modello unico della massima qualità, adattato a ogni patologia.",
      el: 'Εξειδικευμένοι στην επεξεργασία ιατρικής εικόνας, την κατάτμηση, τον σχεδιασμό, την τρισδιάστατη εκτύπωση και τα ψηφιακά μοντέλα: δημιουργούμε μια ανακατασκευή σε πραγματικό μέγεθος, φυσική ή ψηφιακή, ένα αντίγραφο ή μοναδικό μοντέλο ύψιστης ποιότητας, προσαρμοσμένο σε κάθε παθολογία.' },
    'Modelos digitales 3D': { en: 'Digital 3D models', fr: 'Modèles numériques 3D', de: 'Digitale 3D-Modelle', it: 'Modelli digitali 3D', el: 'Ψηφιακά τρισδιάστατα μοντέλα' },
    'Reconstrucciones interactivas con transparencias, opción de mostrar u ocultar órganos y anotaciones clínicas, potenciadas con inteligencia artificial.': {
      en: 'Interactive reconstructions with transparency, the option to show or hide organs and clinical annotations, powered by artificial intelligence.',
      fr: "Des reconstructions interactives avec transparences, possibilité d'afficher ou de masquer des organes et annotations cliniques, propulsées par l'intelligence artificielle.",
      de: 'Interaktive Rekonstruktionen mit Transparenzen, der Möglichkeit, Organe ein- oder auszublenden, und klinischen Anmerkungen – unterstützt durch künstliche Intelligenz.',
      it: "Ricostruzioni interattive con trasparenze, possibilità di mostrare o nascondere organi e annotazioni cliniche, potenziate dall'intelligenza artificiale.",
      el: 'Διαδραστικές ανακατασκευές με διαφάνειες, δυνατότητα εμφάνισης ή απόκρυψης οργάνων και κλινικές σημειώσεις, ενισχυμένες με τεχνητή νοημοσύνη.' },
    'Qué puedes hacer': { en: 'What you can do', fr: 'Ce que vous pouvez faire', de: 'Was Sie tun können', it: 'Cosa puoi fare', el: 'Τι μπορείτε να κάνετε' },
    'Mucho más que ver un modelo': { en: 'Much more than viewing a model', fr: 'Bien plus que regarder un modèle', de: 'Viel mehr als ein Modell ansehen', it: 'Molto più che vedere un modello', el: 'Πολύ περισσότερα από την απλή προβολή ενός μοντέλου' },
    'Cada reconstrucción digital es interactiva: la exploras en tiempo real desde el navegador, sin instalar nada.': {
      en: 'Every digital reconstruction is interactive: explore it in real time from the browser, with nothing to install.',
      fr: 'Chaque reconstruction numérique est interactive : explorez-la en temps réel depuis le navigateur, sans rien installer.',
      de: 'Jede digitale Rekonstruktion ist interaktiv: Erkunden Sie sie in Echtzeit im Browser, ohne etwas zu installieren.',
      it: 'Ogni ricostruzione digitale è interattiva: la esplori in tempo reale dal browser, senza installare nulla.',
      el: 'Κάθε ψηφιακή ανακατασκευή είναι διαδραστική: την εξερευνάτε σε πραγματικό χρόνο από τον browser, χωρίς εγκατάσταση.' },
    'Gira y amplía 360°': { en: 'Rotate and zoom 360°', fr: 'Tournez et zoomez à 360°', de: 'Drehen und zoomen in 360°', it: 'Ruota e ingrandisci a 360°', el: 'Περιστροφή και ζουμ 360°' },
    'Rota el modelo y haz zoom sobre cualquier detalle anatómico en tiempo real.': {
      en: 'Rotate the model and zoom into any anatomical detail in real time.',
      fr: "Faites pivoter le modèle et zoomez sur n'importe quel détail anatomique en temps réel.",
      de: 'Drehen Sie das Modell und zoomen Sie in Echtzeit auf jedes anatomische Detail.',
      it: 'Ruota il modello e ingrandisci qualsiasi dettaglio anatomico in tempo reale.',
      el: 'Περιστρέψτε το μοντέλο και κάντε ζουμ σε οποιαδήποτε ανατομική λεπτομέρεια σε πραγματικό χρόνο.' },
    'Transparencias': { en: 'Transparency', fr: 'Transparences', de: 'Transparenzen', it: 'Trasparenze', el: 'Διαφάνειες' },
    'Ajusta la opacidad de cada tejido para ver las estructuras que hay debajo.': {
      en: 'Adjust the opacity of each tissue to see the structures underneath.',
      fr: "Ajustez l'opacité de chaque tissu pour voir les structures en dessous.",
      de: 'Passen Sie die Deckkraft jedes Gewebes an, um die darunterliegenden Strukturen zu sehen.',
      it: "Regola l'opacità di ogni tessuto per vedere le strutture sottostanti.",
      el: 'Ρυθμίστε τη διαφάνεια κάθε ιστού για να δείτε τις δομές από κάτω.' },
    'Ver u ocultar órganos': { en: 'Show or hide organs', fr: 'Afficher ou masquer des organes', de: 'Organe ein- oder ausblenden', it: 'Mostra o nascondi organi', el: 'Εμφάνιση ή απόκρυψη οργάνων' },
    'Aísla órganos, vasos o lesiones para centrarte en lo que importa de cada caso.': {
      en: 'Isolate organs, vessels or lesions to focus on what matters in each case.',
      fr: "Isolez organes, vaisseaux ou lésions pour vous concentrer sur l'essentiel de chaque cas.",
      de: 'Isolieren Sie Organe, Gefäße oder Läsionen, um sich auf das Wesentliche jedes Falls zu konzentrieren.',
      it: 'Isola organi, vasi o lesioni per concentrarti su ciò che conta in ogni caso.',
      el: 'Απομονώστε όργανα, αγγεία ή βλάβες για να εστιάσετε σε αυτό που έχει σημασία σε κάθε περίπτωση.' },
    'Potenciado con IA': { en: 'Powered by AI', fr: "Propulsé par l'IA", de: 'Mit KI unterstützt', it: "Potenziato dall'IA", el: 'Με τη δύναμη της ΤΝ' },
    'Aplicamos inteligencia artificial en la segmentación y el procesado de la imagen médica.': {
      en: 'We apply artificial intelligence in the segmentation and processing of the medical image.',
      fr: "Nous appliquons l'intelligence artificielle à la segmentation et au traitement de l'image médicale.",
      de: 'Wir setzen künstliche Intelligenz bei der Segmentierung und Verarbeitung des medizinischen Bildes ein.',
      it: "Applichiamo l'intelligenza artificiale nella segmentazione e nell'elaborazione dell'immagine medica.",
      el: 'Εφαρμόζουμε τεχνητή νοημοσύνη στην κατάτμηση και την επεξεργασία της ιατρικής εικόνας.' },
    'Imagen médica a 3D': { en: 'Medical imaging to 3D', fr: "De l'image médicale au 3D", de: 'Vom medizinischen Bild zum 3D-Modell', it: "Dall'immagine medica al 3D", el: 'Από ιατρική εικόνα σε 3D' },
    'Convertimos estudios radiológicos 2D en modelos anatómicos 3D físicos precisos, listos para el quirófano.': {
      en: 'We turn 2D radiological studies into precise physical 3D anatomical models, ready for the operating room.',
      fr: 'Nous transformons les études radiologiques 2D en modèles anatomiques 3D physiques précis, prêts pour le bloc opératoire.',
      de: 'Wir verwandeln 2D-Röntgenstudien in präzise physische 3D-Anatomiemodelle, bereit für den Operationssaal.',
      it: 'Trasformiamo gli studi radiologici 2D in modelli anatomici 3D fisici precisi, pronti per la sala operatoria.',
      el: 'Μετατρέπουμε δισδιάστατες ακτινολογικές μελέτες σε ακριβή φυσικά ανατομικά μοντέλα 3D, έτοιμα για το χειρουργείο.' },
    'Tiempo récord': { en: 'Record time', fr: 'Temps record', de: 'Rekordzeit', it: 'Tempo record', el: 'Χρόνος-ρεκόρ' },
    'Entregamos los modelos en 7 días según solicitud, material y destino. Tu tiempo importa.': {
      en: 'We deliver the models within 7 days depending on request, material and destination. Your time matters.',
      fr: 'Nous livrons les modèles en 7 jours selon la demande, le matériau et la destination. Votre temps compte.',
      de: 'Wir liefern die Modelle innerhalb von 7 Tagen, je nach Anfrage, Material und Zielort. Ihre Zeit zählt.',
      it: 'Consegniamo i modelli entro 7 giorni in base alla richiesta, al materiale e alla destinazione. Il tuo tempo conta.',
      el: 'Παραδίδουμε τα μοντέλα σε 7 ημέρες ανάλογα με το αίτημα, το υλικό και τον προορισμό. Ο χρόνος σας μετράει.' },
    'Plazo de entrega': { en: 'Delivery time', fr: 'Délai de livraison', de: 'Lieferzeit', it: 'Tempi di consegna', el: 'Χρόνος παράδοσης' },
    'Calidad certificada': { en: 'Certified quality', fr: 'Qualité certifiée', de: 'Zertifizierte Qualität', it: 'Qualità certificata', el: 'Πιστοποιημένη ποιότητα' },
    'Modelos a medida': { en: 'Custom-made models', fr: 'Modèles sur mesure', de: 'Maßgeschneiderte Modelle', it: 'Modelli su misura', el: 'Μοντέλα κατά παραγγελία' },
    'Confidencialidad': { en: 'Confidentiality', fr: 'Confidentialité', de: 'Vertraulichkeit', it: 'Riservatezza', el: 'Εμπιστευτικότητα' },
    'Áreas de aplicación': { en: 'Areas of application', fr: "Domaines d'application", de: 'Anwendungsbereiche', it: 'Aree di applicazione', el: 'Τομείς εφαρμογής' },
    'Tecnología que revoluciona la cirugía': { en: 'Technology that revolutionizes surgery', fr: 'Une technologie qui révolutionne la chirurgie', de: 'Technologie, die die Chirurgie revolutioniert', it: 'Tecnologia che rivoluziona la chirurgia', el: 'Τεχνολογία που φέρνει επανάσταση στη χειρουργική' },
    'La planificación con modelos anatómicos 3D facilita el estudio de la anatomía, el abordaje y la previsión de complicaciones intraoperatorias.': {
      en: 'Planning with 3D anatomical models makes it easier to study the anatomy, plan the approach and anticipate intraoperative complications.',
      fr: "La planification avec des modèles anatomiques 3D facilite l'étude de l'anatomie, l'abord et l'anticipation des complications peropératoires.",
      de: 'Die Planung mit 3D-Anatomiemodellen erleichtert das Studium der Anatomie, den Zugang und die Vorhersage intraoperativer Komplikationen.',
      it: "La pianificazione con modelli anatomici 3D facilita lo studio dell'anatomia, l'approccio e la previsione delle complicanze intraoperatorie.",
      el: 'Ο σχεδιασμός με ανατομικά μοντέλα 3D διευκολύνει τη μελέτη της ανατομίας, την προσέγγιση και την πρόβλεψη διεγχειρητικών επιπλοκών.' },
    '<a class="more" href="/traumatologia" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Ver detalle →</a>': {
      en: '<a class="more" href="/traumatologia" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">View details →</a>',
      fr: '<a class="more" href="/traumatologia" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Voir le détail →</a>',
      de: '<a class="more" href="/traumatologia" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Mehr erfahren →</a>',
      it: '<a class="more" href="/traumatologia" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Vedi dettagli →</a>',
      el: '<a class="more" href="/traumatologia" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Δείτε λεπτομέρειες →</a>' },
    '<a class="more" href="/otras-especialidades" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Ver detalle →</a>': {
      en: '<a class="more" href="/otras-especialidades" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">View details →</a>',
      fr: '<a class="more" href="/otras-especialidades" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Voir le détail →</a>',
      de: '<a class="more" href="/otras-especialidades" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Mehr erfahren →</a>',
      it: '<a class="more" href="/otras-especialidades" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Vedi dettagli →</a>',
      el: '<a class="more" href="/otras-especialidades" style="font-family:var(--head);font-weight:700;color:var(--orange-dark)">Δείτε λεπτομέρειες →</a>' },
    'Urología, cardiología, maxilofacial, neurocirugía, vascular, torácica, ORL, digestivo y ginecología.': {
      en: 'Urology, cardiology, maxillofacial, neurosurgery, vascular, thoracic, ENT, digestive and gynecology.',
      fr: 'Urologie, cardiologie, maxillo-facial, neurochirurgie, vasculaire, thoracique, ORL, digestif et gynécologie.',
      de: 'Urologie, Kardiologie, Mund-Kiefer-Gesichtschirurgie, Neurochirurgie, Gefäß-, Thoraxchirurgie, HNO, Viszeral- und Gynäkologie.',
      it: 'Urologia, cardiologia, maxillo-facciale, neurochirurgia, vascolare, toracica, ORL, digestivo e ginecologia.',
      el: 'Ουρολογία, καρδιολογία, γναθοπροσωπική, νευροχειρουργική, αγγειακή, θωρακική, ΩΡΛ, πεπτικό και γυναικολογία.' },
    'Confianza': { en: 'Trust', fr: 'Confiance', de: 'Vertrauen', it: 'Fiducia', el: 'Εμπιστοσύνη' },
    'Han confiado en nosotros': { en: 'They have trusted us', fr: 'Ils nous ont fait confiance', de: 'Sie haben uns vertraut', it: 'Si sono affidati a noi', el: 'Μας εμπιστεύτηκαν' },
    'Hospitales, mutuas y referentes del sector salud que trabajan con Eureqa3D.': {
      en: 'Hospitals, insurers and leaders in the healthcare sector who work with Eureqa3D.',
      fr: 'Hôpitaux, mutuelles et références du secteur de la santé qui travaillent avec Eureqa3D.',
      de: 'Krankenhäuser, Versicherer und führende Akteure im Gesundheitssektor, die mit Eureqa3D arbeiten.',
      it: 'Ospedali, mutue e punti di riferimento del settore sanitario che lavorano con Eureqa3D.',
      el: 'Νοσοκομεία, ασφαλιστικοί φορείς και κορυφαίοι του τομέα υγείας που συνεργάζονται με την Eureqa3D.' },
    'Agenda': { en: 'Agenda', fr: 'Agenda', de: 'Termine', it: 'Agenda', el: 'Ατζέντα' },
    'Jornadas y eventos': { en: 'Conferences and events', fr: 'Journées et événements', de: 'Veranstaltungen und Events', it: 'Giornate ed eventi', el: 'Ημερίδες και εκδηλώσεις' },
    'Actualidad': { en: 'News', fr: 'Actualité', de: 'Aktuelles', it: 'Attualità', el: 'Επικαιρότητα' },
    'Últimas noticias': { en: 'Latest news', fr: 'Dernières actualités', de: 'Neueste Nachrichten', it: 'Ultime notizie', el: 'Τελευταία νέα' },
    'Apariciones de Eureqa3D en los medios y novedades del proyecto.': {
      en: "Eureqa3D's media appearances and project updates.",
      fr: "Apparitions d'Eureqa3D dans les médias et nouveautés du projet.",
      de: 'Medienauftritte von Eureqa3D und Neuigkeiten zum Projekt.',
      it: 'Apparizioni di Eureqa3D sui media e novità del progetto.',
      el: 'Εμφανίσεις της Eureqa3D στα μέσα ενημέρωσης και νέα του έργου.' },
    'Ver todas las noticias': { en: 'View all news', fr: 'Voir toutes les actualités', de: 'Alle Nachrichten ansehen', it: 'Vedi tutte le notizie', el: 'Δείτε όλα τα νέα' },
    '¿Quieres hacer un caso de prueba?': { en: 'Want to run a test case?', fr: 'Vous souhaitez réaliser un cas test ?', de: 'Möchten Sie einen Testfall durchführen?', it: 'Vuoi realizzare un caso di prova?', el: 'Θέλετε να κάνετε μια δοκιμαστική περίπτωση;' },
    'Sabemos lo importante que es tu tiempo. Déjanos ayudarte a incorporar la tecnología 3D a tu práctica clínica.': {
      en: 'We know how important your time is. Let us help you bring 3D technology into your clinical practice.',
      fr: "Nous savons à quel point votre temps est précieux. Laissez-nous vous aider à intégrer la technologie 3D dans votre pratique clinique.",
      de: 'Wir wissen, wie wertvoll Ihre Zeit ist. Lassen Sie uns Ihnen helfen, die 3D-Technologie in Ihre klinische Praxis zu integrieren.',
      it: 'Sappiamo quanto è importante il tuo tempo. Lascia che ti aiutiamo a integrare la tecnologia 3D nella tua pratica clinica.',
      el: 'Γνωρίζουμε πόσο σημαντικός είναι ο χρόνος σας. Αφήστε μας να σας βοηθήσουμε να εντάξετε την τρισδιάστατη τεχνολογία στην κλινική σας πρακτική.' },
    'Contacta con nosotros': { en: 'Get in touch', fr: 'Contactez-nous', de: 'Kontaktieren Sie uns', it: 'Contattaci', el: 'Επικοινωνήστε μαζί μας' },
    'Modelo anatómico 3D real de tu paciente, listo en <span>tiempo récord</span>': {
      en: 'Real 3D anatomical model of your patient, ready in <span>record time</span>',
      fr: 'Modèle anatomique 3D réel de votre patient, prêt en <span>temps record</span>',
      de: 'Echtes 3D-Anatomiemodell Ihres Patienten, fertig in <span>Rekordzeit</span>',
      it: 'Modello anatomico 3D reale del tuo paziente, pronto in <span>tempo record</span>',
      el: 'Πραγματικό ανατομικό μοντέλο 3D του ασθενούς σας, έτοιμο σε <span>χρόνο-ρεκόρ</span>' },
    'Sin compromiso: analizamos tu caso y te decimos si es viable.': {
      en: 'No commitment: we analyze your case and tell you if it is viable.',
      fr: "Sans engagement : nous analysons votre cas et vous disons s'il est réalisable.",
      de: 'Unverbindlich: Wir analysieren Ihren Fall und sagen Ihnen, ob er machbar ist.',
      it: 'Senza impegno: analizziamo il tuo caso e ti diciamo se è fattibile.',
      el: 'Χωρίς δέσμευση: αναλύουμε την περίπτωσή σας και σας λέμε αν είναι εφικτή.' },
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>RGPD': {
      en: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>GDPR',
      fr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>RGPD',
      de: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>DSGVO',
      it: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>GDPR',
      el: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>ΓΚΠΔ' },
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Entrega en 7 días': {
      en: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Delivery in 7 days',
      fr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Livraison en 7 jours',
      de: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Lieferung in 7 Tagen',
      it: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Consegna in 7 giorni',
      el: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Παράδοση σε 7 ημέρες' },
    'Modelos anatómicos 3D para cada especialidad quirúrgica': {
      en: '3D anatomical models for every surgical specialty',
      fr: 'Modèles anatomiques 3D pour chaque spécialité chirurgicale',
      de: '3D-Anatomiemodelle für jeden chirurgischen Fachbereich',
      it: 'Modelli anatomici 3D per ogni specialità chirurgica',
      el: 'Ανατομικά μοντέλα 3D για κάθε χειρουργική ειδικότητα' },
    'Reconstrucciones interactivas con transparencias, órganos ocultables y anotaciones clínicas, potenciadas con IA.': {
      en: 'Interactive reconstructions with transparency, hideable organs and clinical annotations, powered by AI.',
      fr: "Reconstructions interactives avec transparences, organes masquables et annotations cliniques, propulsées par l'IA.",
      de: 'Interaktive Rekonstruktionen mit Transparenzen, ausblendbaren Organen und klinischen Anmerkungen, unterstützt durch KI.',
      it: "Ricostruzioni interattive con trasparenze, organi nascondibili e annotazioni cliniche, potenziate dall'IA.",
      el: 'Διαδραστικές ανακατασκευές με διαφάνειες, όργανα που αποκρύπτονται και κλινικές σημειώσεις, ενισχυμένες με ΤΝ.' },
    'Proceso propio con trazabilidad completa y confidencialidad (RGPD).': {
      en: 'Proprietary process with full traceability and confidentiality (GDPR).',
      fr: 'Processus propriétaire avec traçabilité complète et confidentialité (RGPD).',
      de: 'Eigener Prozess mit vollständiger Rückverfolgbarkeit und Vertraulichkeit (DSGVO).',
      it: 'Processo proprietario con tracciabilità completa e riservatezza (GDPR).',
      el: 'Ιδιόκτητη διαδικασία με πλήρη ιχνηλασιμότητα και εμπιστευτικότητα (ΓΚΠΔ).' },
    'Del hueso a los tejidos blandos: modelos que puedes rotar, seccionar y explorar capa a capa, directamente en el navegador.': {
      en: 'From bone to soft tissue: models you can rotate, section and explore layer by layer, right in your browser.',
      fr: "De l'os aux tissus mous : des modèles que vous pouvez faire pivoter, sectionner et explorer couche par couche, directement dans le navigateur.",
      de: 'Vom Knochen zum Weichgewebe: Modelle, die Sie drehen, in Schichten zerlegen und Schicht für Schicht erkunden können – direkt im Browser.',
      it: "Dall'osso ai tessuti molli: modelli che puoi ruotare, sezionare ed esplorare strato dopo strato, direttamente nel browser.",
      el: 'Από το οστό στους μαλακούς ιστούς: μοντέλα που μπορείτε να περιστρέψετε, να τεμαχίσετε και να εξερευνήσετε στρώση προς στρώση, απευθείας στον browser.' },
    'EureqaVisor3D · Caso real': { en: 'EureqaVisor3D · Real case', fr: 'EureqaVisor3D · Cas réel', de: 'EureqaVisor3D · Echter Fall', it: 'EureqaVisor3D · Caso reale', el: 'EureqaVisor3D · Πραγματική περίπτωση' },
    'Trabajamos directamente con cirujanos: tú te centras en el caso, nosotros en el modelo 3D. Sin necesidad de realizar una formación específica ni de adquirir un software nuevo que aprender — un servicio externo especializado y exclusivo del sector salud.': {
      en: 'We work directly with surgeons: you focus on the case, we focus on the 3D model. No need for specific training or new software to learn — a specialized external service exclusive to the healthcare sector.',
      fr: 'Nous travaillons directement avec les chirurgiens : vous vous concentrez sur le cas, nous sur le modèle 3D. Sans besoin de formation spécifique ni de nouveau logiciel à apprendre — un service externe spécialisé et exclusif au secteur de la santé.',
      de: 'Wir arbeiten direkt mit Chirurgen zusammen: Sie konzentrieren sich auf den Fall, wir auf das 3D-Modell. Ohne dass eine spezielle Schulung oder neue Software erlernt werden muss — ein spezialisierter externer Service, ausschließlich für den Gesundheitssektor.',
      it: 'Lavoriamo direttamente con i chirurghi: tu ti concentri sul caso, noi sul modello 3D. Senza bisogno di una formazione specifica né di imparare un nuovo software — un servizio esterno specializzato ed esclusivo del settore sanitario.',
      el: 'Συνεργαζόμαστε απευθείας με χειρουργούς: εσείς επικεντρώνεστε στην περίπτωση, εμείς στο τρισδιάστατο μοντέλο. Χωρίς ανάγκη ειδικής εκπαίδευσης ή εκμάθησης νέου λογισμικού — μια εξειδικευμένη εξωτερική υπηρεσία αποκλειστική για τον τομέα της υγείας.' },
    'Qué ofrecemos al hospital o clínica privada': { en: 'What we offer hospitals and private clinics', fr: 'Ce que nous offrons aux hôpitaux et cliniques privées', de: 'Was wir Krankenhäusern und Privatkliniken bieten', it: 'Cosa offriamo agli ospedali e alle cliniche private', el: 'Τι προσφέρουμε σε νοσοκομεία και ιδιωτικές κλινικές' },
    'Convertimos el estudio radiológico en un modelo anatómico 3D, explicado en cuatro pasos': {
      en: 'We turn the radiological study into a 3D anatomical model, explained in four steps',
      fr: "Nous transformons l'étude radiologique en un modèle anatomique 3D, expliqué en quatre étapes",
      de: 'Wir verwandeln die radiologische Untersuchung in ein 3D-Anatomiemodell, erklärt in vier Schritten',
      it: 'Trasformiamo lo studio radiologico in un modello anatomico 3D, spiegato in quattro passaggi',
      el: 'Μετατρέπουμε την ακτινολογική μελέτη σε ανατομικό μοντέλο 3D, σε τέσσερα βήματα' },
    'Tratamos la imagen médica del paciente —segmentación anatómica y diseño digital— hasta obtener una reconstrucción a tamaño real a escala 1:1, en formato digital o fabricado con impresión 3D. Cada modelo es único y adaptado a la patología concreta de cada caso. <a href="/faq" style="color: var(--teal); text-decoration: none; font-weight: 600;">¿Preguntas frecuentes sobre el proceso?</a>': {
      en: "We process the patient's medical image —anatomical segmentation and digital design— to obtain a full-scale 1:1 reconstruction, in digital format or manufactured with 3D printing. Each model is unique and tailored to the specific pathology of each case. <a href=\"/faq\" style=\"color: var(--teal); text-decoration: none; font-weight: 600;\">Frequently asked questions about the process?</a>",
      fr: "Nous traitons l'image médicale du patient —segmentation anatomique et conception numérique— jusqu'à obtenir une reconstruction à taille réelle à l'échelle 1:1, au format numérique ou fabriquée par impression 3D. Chaque modèle est unique et adapté à la pathologie précise de chaque cas. <a href=\"/faq\" style=\"color: var(--teal); text-decoration: none; font-weight: 600;\">Questions fréquentes sur le processus ?</a>",
      de: 'Wir verarbeiten das medizinische Bild des Patienten —anatomische Segmentierung und digitales Design— bis wir eine originalgetreue Rekonstruktion im Maßstab 1:1 erhalten, digital oder im 3D-Druck gefertigt. Jedes Modell ist einzigartig und auf die konkrete Pathologie jedes Falls abgestimmt. <a href="/faq" style="color: var(--teal); text-decoration: none; font-weight: 600;">Häufige Fragen zum Prozess?</a>',
      it: "Trattiamo l'immagine medica del paziente —segmentazione anatomica e progettazione digitale— fino a ottenere una ricostruzione a grandezza naturale in scala 1:1, in formato digitale o realizzata con stampa 3D. Ogni modello è unico e adattato alla patologia specifica di ogni caso. <a href=\"/faq\" style=\"color: var(--teal); text-decoration: none; font-weight: 600;\">Domande frequenti sul processo?</a>",
      el: 'Επεξεργαζόμαστε την ιατρική εικόνα του ασθενούς —ανατομική κατάτμηση και ψηφιακό σχεδιασμό— έως ότου επιτύχουμε μια ανακατασκευή σε πραγματικό μέγεθος, κλίμακας 1:1, σε ψηφιακή μορφή ή κατασκευασμένη με τρισδιάστατη εκτύπωση. Κάθε μοντέλο είναι μοναδικό και προσαρμοσμένο στη συγκεκριμένη παθολογία κάθε περίπτωσης. <a href="/faq" style="color: var(--teal); text-decoration: none; font-weight: 600;">Συχνές ερωτήσεις σχετικά με τη διαδικασία;</a>' },
    'Imagen médica a impresión 3D': { en: 'Medical imaging to 3D printing', fr: "De l'image médicale à l'impression 3D", de: 'Vom medizinischen Bild zum 3D-Druck', it: "Dall'immagine medica alla stampa 3D", el: 'Από ιατρική εικόνα σε τρισδιάστατη εκτύπωση' },
    'Entrega en 7 días, según solicitud, material y destino.': {
      en: 'Delivered within 7 days, depending on the request, material and destination.',
      fr: 'Livraison en 7 jours, selon la demande, le matériau et la destination.',
      de: 'Lieferung innerhalb von 7 Tagen, je nach Anfrage, Material und Zielort.',
      it: 'Consegna in 7 giorni, in base alla richiesta, al materiale e alla destinazione.',
      el: 'Παράδοση σε 7 ημέρες, ανάλογα με το αίτημα, το υλικό και τον προορισμό.' },
    'Casos anonimizados': { en: 'Anonymized cases', fr: 'Cas anonymisés', de: 'Anonymisierte Fälle', it: 'Casi anonimizzati', el: 'Ανωνυμοποιημένες περιπτώσεις' },
    'Cumplimiento normativo': { en: 'Regulatory compliance', fr: 'Conformité réglementaire', de: 'Regulatorische Konformität', it: 'Conformità normativa', el: 'Κανονιστική συμμόρφωση' },
    'Cirugía Oncológica (todas las especialidades)': { en: 'Oncological Surgery (all specialties)', fr: 'Chirurgie Oncologique (toutes spécialités)', de: 'Onkologische Chirurgie (alle Fachbereiche)', it: 'Chirurgia Oncologica (tutte le specialità)', el: 'Ογκολογική Χειρουργική (όλες οι ειδικότητες)' },
    'Cirugía general y hepatobiliopancreática, urología, ginecología, cirugía torácica, cirugía cardiovascular, otorrinolaringología y cirugía pediátrica.': {
      en: 'General and hepatobiliopancreatic surgery, urology, gynecology, thoracic surgery, cardiovascular surgery, otolaryngology and pediatric surgery.',
      fr: 'Chirurgie générale et hépatobiliopancréatique, urologie, gynécologie, chirurgie thoracique, chirurgie cardiovasculaire, oto-rhino-laryngologie et chirurgie pédiatrique.',
      de: 'Allgemein- und hepatobiliopankreatische Chirurgie, Urologie, Gynäkologie, Thoraxchirurgie, Herz-Kreislauf-Chirurgie, HNO-Heilkunde und Kinderchirurgie.',
      it: 'Chirurgia generale ed epatobiliopancreatica, urologia, ginecologia, chirurgia toracica, chirurgia cardiovascolare, otorinolaringoiatria e chirurgia pediatrica.',
      el: 'Γενική και ηπατοχολοπαγκρεατική χειρουργική, ουρολογία, γυναικολογία, θωρακική χειρουργική, καρδιαγγειακή χειρουργική, ωτορινολαρυγγολογία και παιδοχειρουργική.' },
    'Traumatología y Cirugía Maxilofacial': { en: 'Traumatology and Maxillofacial Surgery', fr: 'Traumatologie et Chirurgie Maxillo-faciale', de: 'Traumatologie und Mund-Kiefer-Gesichtschirurgie', it: 'Traumatologia e Chirurgia Maxillo-facciale', el: 'Τραυματολογία και Γναθοπροσωπική Χειρουργική' },
    'La planificación con modelos anatómicos 3D físicos (impresión 3D) facilita el estudio de la anatomía, permite simular el abordaje, ayuda a seleccionar el material de osteosíntesis y facilita la previsión de complicaciones intraoperatorias.': {
      en: 'Planning with physical 3D anatomical models (3D printing) makes it easier to study the anatomy, allows the approach to be simulated, helps select the osteosynthesis material and facilitates the anticipation of intraoperative complications.',
      fr: "La planification avec des modèles anatomiques 3D physiques (impression 3D) facilite l'étude de l'anatomie, permet de simuler l'abord, aide à sélectionner le matériel d'ostéosynthèse et facilite l'anticipation des complications peropératoires.",
      de: 'Die Planung mit physischen 3D-Anatomiemodellen (3D-Druck) erleichtert das Studium der Anatomie, ermöglicht die Simulation des Zugangs, hilft bei der Auswahl des Osteosynthesematerials und erleichtert die Vorhersage intraoperativer Komplikationen.',
      it: "La pianificazione con modelli anatomici 3D fisici (stampa 3D) facilita lo studio dell'anatomia, consente di simulare l'approccio, aiuta a selezionare il materiale di osteosintesi e facilita la previsione delle complicanze intraoperatorie.",
      el: 'Ο σχεδιασμός με φυσικά ανατομικά μοντέλα 3D (τρισδιάστατη εκτύπωση) διευκολύνει τη μελέτη της ανατομίας, επιτρέπει την προσομοίωση της προσέγγισης, βοηθά στην επιλογή υλικού οστεοσύνθεσης και διευκολύνει την πρόβλεψη διεγχειρητικών επιπλοκών.' },

    /* ── Quiénes somos ── */
    'Especialistas en impresión 3D y modelos digitales en el sector salud': { en: 'Specialists in 3D printing and digital models for the healthcare sector', fr: "Spécialistes de l'impression 3D et des modèles numériques dans le secteur de la santé", de: 'Spezialisten für 3D-Druck und digitale Modelle im Gesundheitssektor', it: 'Specialisti nella stampa 3D e nei modelli digitali nel settore sanitario', el: 'Ειδικοί στην τρισδιάστατη εκτύπωση και τα ψηφιακά μοντέλα στον τομέα της υγείας' },
    'Eureqa3D es una empresa joven formada por <strong>ingenieros y médicos</strong>. Convertimos la imagen médica del paciente en modelos anatómicos 3D físicos y digitales que ayudan al profesional a planificar cada cirugía con más seguridad.': {
      en: 'Eureqa3D is a young company made up of <strong>engineers and doctors</strong>. We convert the patient\'s medical imaging into physical and digital 3D anatomical models that help the professional plan each surgery with more confidence.',
      fr: "Eureqa3D est une jeune entreprise composée d'<strong>ingénieurs et de médecins</strong>. Nous convertissons l'image médicale du patient en modèles anatomiques 3D physiques et numériques qui aident le professionnel à planifier chaque intervention en toute confiance.",
      de: 'Eureqa3D ist ein junges Unternehmen aus <strong>Ingenieuren und Ärzten</strong>. Wir wandeln die medizinische Bildgebung des Patienten in physische und digitale 3D-Anatomiemodelle um, die dem Fachmann helfen, jede Operation mit mehr Sicherheit zu planen.',
      it: "Eureqa3D è una giovane azienda formata da <strong>ingegneri e medici</strong>. Convertiamo l'immagine medica del paziente in modelli anatomici 3D fisici e digitali che aiutano il professionista a pianificare ogni intervento con maggiore sicurezza.",
      el: 'Η Eureqa3D είναι μια νέα εταιρεία αποτελούμενη από <strong>μηχανικούς και ιατρούς</strong>. Μετατρέπουμε την ιατρική εικόνα του ασθενούς σε φυσικά και ψηφιακά ανατομικά μοντέλα 3D που βοηθούν τον επαγγελματία να σχεδιάσει κάθε επέμβαση με μεγαλύτερη ασφάλεια.' },
    'Estamos especializados en el tratamiento de la imagen médica: segmentación, diseño e impresión 3D. El resultado es una reconstrucción a tamaño real —física o digital— adaptada a la patología y a las necesidades del profesional.': {
      en: 'We specialize in medical image processing: segmentation, design and 3D printing. The result is a full-scale reconstruction —physical or digital— tailored to the pathology and the professional\'s needs.',
      fr: "Nous sommes spécialisés dans le traitement de l'image médicale : segmentation, conception et impression 3D. Le résultat est une reconstruction à taille réelle —physique ou numérique— adaptée à la pathologie et aux besoins du professionnel.",
      de: 'Wir sind spezialisiert auf die Verarbeitung medizinischer Bilder: Segmentierung, Design und 3D-Druck. Das Ergebnis ist eine Rekonstruktion in Originalgröße —physisch oder digital— abgestimmt auf die Pathologie und die Bedürfnisse des Fachmanns.',
      it: "Siamo specializzati nel trattamento dell'immagine medica: segmentazione, progettazione e stampa 3D. Il risultato è una ricostruzione a grandezza naturale —fisica o digitale— adattata alla patologia e alle esigenze del professionista.",
      el: 'Είμαστε εξειδικευμένοι στην επεξεργασία ιατρικής εικόνας: κατάτμηση, σχεδιασμός και τρισδιάστατη εκτύπωση. Το αποτέλεσμα είναι μια ανακατασκευή σε πραγματικό μέγεθος —φυσική ή ψηφιακή— προσαρμοσμένη στην παθολογία και στις ανάγκες του επαγγελματία.' },
    '«Ingenieros y médicos, alrededor de la misma mesa»': {
      en: '«Engineers and doctors, around the same table»',
      fr: '« Ingénieurs et médecins, autour de la même table »',
      de: '„Ingenieure und Ärzte, an einem Tisch“',
      it: '«Ingegneri e medici, intorno allo stesso tavolo»',
      el: '«Μηχανικοί και ιατροί, γύρω από το ίδιο τραπέζι»' },
    'Garantizamos la máxima calidad de nuestros trabajos gracias a nuestro método de producción, el <strong>Método Eureqa</strong>, y a un equipo de profesionales altamente cualificados.': {
      en: 'We guarantee the highest quality of our work thanks to our production method, the <strong>Eureqa Method</strong>, and a team of highly qualified professionals.',
      fr: 'Nous garantissons la plus haute qualité de nos travaux grâce à notre méthode de production, la <strong>Méthode Eureqa</strong>, et à une équipe de professionnels hautement qualifiés.',
      de: 'Wir garantieren höchste Qualität unserer Arbeit dank unserer Produktionsmethode, der <strong>Eureqa-Methode</strong>, sowie einem Team hochqualifizierter Fachleute.',
      it: 'Garantiamo la massima qualità dei nostri lavori grazie al nostro metodo di produzione, il <strong>Metodo Eureqa</strong>, e a un team di professionisti altamente qualificati.',
      el: 'Εγγυόμαστε την ύψιστη ποιότητα των εργασιών μας χάρη στη μέθοδο παραγωγής μας, τη <strong>Μέθοδο Eureqa</strong>, και σε μια ομάδα άρτια καταρτισμένων επαγγελματιών.' },
    'Trabajamos en tiempo récord, entregando los modelos en <strong>7 días</strong> (según tiempos y condiciones: solicitud, material y destino).': {
      en: 'We work in record time, delivering the models within <strong>7 days</strong> (depending on times and conditions: request, material and destination).',
      fr: 'Nous travaillons en temps record, en livrant les modèles en <strong>7 jours</strong> (selon les délais et conditions : demande, matériau et destination).',
      de: 'Wir arbeiten in Rekordzeit und liefern die Modelle innerhalb von <strong>7 Tagen</strong> (je nach Fristen und Bedingungen: Anfrage, Material und Zielort).',
      it: 'Lavoriamo in tempo record, consegnando i modelli entro <strong>7 giorni</strong> (in base a tempi e condizioni: richiesta, materiale e destinazione).',
      el: 'Εργαζόμαστε σε χρόνο-ρεκόρ, παραδίδοντας τα μοντέλα σε <strong>7 ημέρες</strong> (ανάλογα με τους χρόνους και τις συνθήκες: αίτημα, υλικό και προορισμός).' },
    'Tecnología propia': { en: 'Proprietary technology', fr: 'Technologie propriétaire', de: 'Eigene Technologie', it: 'Tecnologia proprietaria', el: 'Ιδιόκτητη τεχνολογία' },
    'Del estudio radiológico al modelo físico o digital': { en: 'From radiological study to physical or digital model', fr: "De l'étude radiologique au modèle physique ou numérique", de: 'Von der radiologischen Studie zum physischen oder digitalen Modell', it: 'Dallo studio radiologico al modello fisico o digitale', el: 'Από την ακτινολογική μελέτη στο φυσικό ή ψηφιακό μοντέλο' },
    'Combinamos software de segmentación, inteligencia artificial e impresión 3D de precisión para transformar la imagen médica del paciente en una réplica anatómica fiel —física o digital interactiva— lista para planificar la intervención.': {
      en: "We combine segmentation software, artificial intelligence and precision 3D printing to transform the patient's medical image into a faithful anatomical replica —physical or interactive digital— ready to plan the intervention.",
      fr: "Nous combinons un logiciel de segmentation, l'intelligence artificielle et l'impression 3D de précision pour transformer l'image médicale du patient en une réplique anatomique fidèle —physique ou numérique interactive— prête pour planifier l'intervention.",
      de: 'Wir kombinieren Segmentierungssoftware, künstliche Intelligenz und Präzisions-3D-Druck, um das medizinische Bild des Patienten in eine originalgetreue anatomische Replik zu verwandeln – physisch oder interaktiv digital – bereit zur Planung des Eingriffs.',
      it: "Combiniamo software di segmentazione, intelligenza artificiale e stampa 3D di precisione per trasformare l'immagine medica del paziente in una replica anatomica fedele —fisica o digitale interattiva— pronta per pianificare l'intervento.",
      el: 'Συνδυάζουμε λογισμικό κατάτμησης, τεχνητή νοημοσύνη και τρισδιάστατη εκτύπωση ακριβείας για να μετατρέψουμε την ιατρική εικόνα του ασθενούς σε ένα πιστό ανατομικό αντίγραφο —φυσικό ή ψηφιακό διαδραστικό— έτοιμο για τον σχεδιασμό της επέμβασης.' },
    'Equipo multidisciplinar': { en: 'Multidisciplinary team', fr: 'Équipe pluridisciplinaire', de: 'Multidisziplinäres Team', it: 'Team multidisciplinare', el: 'Διεπιστημονική ομάδα' },
    'Ingenieros y médicos trabajando juntos.': { en: 'Engineers and doctors working together.', fr: 'Ingénieurs et médecins travaillant ensemble.', de: 'Ingenieure und Ärzte arbeiten zusammen.', it: 'Ingegneri e medici che lavorano insieme.', el: 'Μηχανικοί και ιατροί που εργάζονται μαζί.' },
    'Calidad certificada': { en: 'Certified quality', fr: 'Qualité certifiée', de: 'Zertifizierte Qualität', it: 'Qualità certificata', el: 'Πιστοποιημένη ποιότητα' },
    'Método de producción propio certificado.': { en: 'Our own certified production method.', fr: 'Méthode de production propriétaire certifiée.', de: 'Eigene zertifizierte Produktionsmethode.', it: 'Metodo di produzione proprietario certificato.', el: 'Ιδιόκτητη πιστοποιημένη μέθοδος παραγωγής.' },
    'Cumplimiento estricto del RGPD en cada caso.': { en: 'Strict GDPR compliance in every case.', fr: 'Respect strict du RGPD dans chaque cas.', de: 'Strikte DSGVO-Konformität in jedem Fall.', it: 'Rigorosa conformità al GDPR in ogni caso.', el: 'Αυστηρή συμμόρφωση με τον GDPR σε κάθε περίπτωση.' },
    'Trabajemos juntos': { en: "Let's work together", fr: 'Travaillons ensemble', de: 'Arbeiten wir zusammen', it: 'Lavoriamo insieme', el: 'Ας συνεργαστούμε' },
    'Déjanos ayudarte a incorporar la tecnología 3D a tu práctica clínica.': {
      en: 'Let us help you bring 3D technology into your clinical practice.',
      fr: "Laissez-nous vous aider à intégrer la technologie 3D dans votre pratique clinique.",
      de: 'Lassen Sie uns Ihnen helfen, die 3D-Technologie in Ihre klinische Praxis zu integrieren.',
      it: 'Lascia che ti aiutiamo a integrare la tecnologia 3D nella tua pratica clinica.',
      el: 'Αφήστε μας να σας βοηθήσουμε να εντάξετε την τρισδιάστατη τεχνολογία στην κλινική σας πρακτική.' },
    'Especialistas en impresión 3D y modelos digitales<br>en el sector salud': {
      en: 'Specialists in 3D printing and digital models<br>for the healthcare sector',
      fr: "Spécialistes de l'impression 3D et des modèles numériques<br>dans le secteur de la santé",
      de: 'Spezialisten für 3D-Druck und digitale Modelle<br>im Gesundheitssektor',
      it: 'Specialisti nella stampa 3D e nei modelli digitali<br>nel settore sanitario',
      el: 'Ειδικοί στην τρισδιάστατη εκτύπωση και τα ψηφιακά μοντέλα<br>στον τομέα της υγείας' },
    'Ingenieros y médicos trabajando juntos en un mismo modelo.': {
      en: 'Engineers and doctors working together on the same model.',
      fr: 'Ingénieurs et médecins travaillant ensemble sur un même modèle.',
      de: 'Ingenieure und Ärzte arbeiten gemeinsam an demselben Modell.',
      it: 'Ingegneri e medici che lavorano insieme sullo stesso modello.',
      el: 'Μηχανικοί και ιατροί που εργάζονται μαζί πάνω στο ίδιο μοντέλο.' },
    'Estamos especializados en el tratamiento de la imagen médica: segmentación anatómica, diseño e impresión 3D. El resultado es una reconstrucción a tamaño real —física o digital, a escala 1:1— adaptada a la patología de cada paciente y a las necesidades del profesional.': {
      en: "We specialize in medical image processing: anatomical segmentation, design and 3D printing. The result is a full-scale reconstruction —physical or digital, at a 1:1 scale— tailored to each patient's pathology and the professional's needs.",
      fr: "Nous sommes spécialisés dans le traitement de l'image médicale : segmentation anatomique, conception et impression 3D. Le résultat est une reconstruction à taille réelle —physique ou numérique, à l'échelle 1:1— adaptée à la pathologie de chaque patient et aux besoins du professionnel.",
      de: 'Wir sind spezialisiert auf die Verarbeitung medizinischer Bilder: anatomische Segmentierung, Design und 3D-Druck. Das Ergebnis ist eine Rekonstruktion in Originalgröße —physisch oder digital, im Maßstab 1:1— abgestimmt auf die Pathologie jedes Patienten und die Bedürfnisse des Fachmanns.',
      it: "Siamo specializzati nel trattamento dell'immagine medica: segmentazione anatomica, progettazione e stampa 3D. Il risultato è una ricostruzione a grandezza naturale —fisica o digitale, in scala 1:1— adattata alla patologia di ogni paziente e alle esigenze del professionista.",
      el: 'Είμαστε εξειδικευμένοι στην επεξεργασία ιατρικής εικόνας: ανατομική κατάτμηση, σχεδιασμός και τρισδιάστατη εκτύπωση. Το αποτέλεσμα είναι μια ανακατασκευή σε πραγματικό μέγεθος —φυσική ή ψηφιακή, σε κλίμακα 1:1— προσαρμοσμένη στην παθολογία κάθε ασθενούς και στις ανάγκες του επαγγελματία.' },
    'Trabajamos en tiempo récord, entregando los modelos en 7 días (según necesidades y condiciones de cada intervención: solicitud, material de fabricación y destino). También ofrecemos <strong>opción de solicitudes urgentes</strong>.': {
      en: 'We work in record time, delivering the models within 7 days (depending on the needs and conditions of each intervention: request, manufacturing material and destination). We also offer an <strong>option for urgent requests</strong>.',
      fr: "Nous travaillons en temps record, en livrant les modèles en 7 jours (selon les besoins et conditions de chaque intervention : demande, matériau de fabrication et destination). Nous proposons également une <strong>option de demandes urgentes</strong>.",
      de: 'Wir arbeiten in Rekordzeit und liefern die Modelle innerhalb von 7 Tagen (je nach Bedarf und Bedingungen jedes Eingriffs: Anfrage, Herstellungsmaterial und Zielort). Wir bieten außerdem eine <strong>Option für dringende Anfragen</strong>.',
      it: "Lavoriamo in tempo record, consegnando i modelli in 7 giorni (in base alle esigenze e alle condizioni di ogni intervento: richiesta, materiale di fabbricazione e destinazione). Offriamo anche un'<strong>opzione per richieste urgenti</strong>.",
      el: 'Εργαζόμαστε σε χρόνο-ρεκόρ, παραδίδοντας τα μοντέλα σε 7 ημέρες (ανάλογα με τις ανάγκες και τις συνθήκες κάθε επέμβασης: αίτημα, υλικό κατασκευής και προορισμός). Προσφέρουμε επίσης <strong>επιλογή επειγόντων αιτημάτων</strong>.' },

    /* ── Método Eureqa ── */
    'El método para alcanzar la excelencia': { en: 'The method to achieve excellence', fr: "La méthode pour atteindre l'excellence", de: 'Die Methode, um Spitzenleistung zu erreichen', it: 'Il metodo per raggiungere l\'eccellenza', el: 'Η μέθοδος για την επίτευξη της αριστείας' },
    'Un método de trabajo único e innovador basado en la tecnología digital aplicada al diseño y tratamiento de imágenes.': {
      en: 'A unique and innovative working method based on digital technology applied to image design and processing.',
      fr: 'Une méthode de travail unique et innovante basée sur la technologie numérique appliquée à la conception et au traitement des images.',
      de: 'Eine einzigartige und innovative Arbeitsmethode auf Basis digitaler Technologie für Bildgestaltung und -verarbeitung.',
      it: 'Un metodo di lavoro unico e innovativo basato sulla tecnologia digitale applicata alla progettazione e al trattamento delle immagini.',
      el: 'Μια μοναδική και καινοτόμος μέθοδος εργασίας βασισμένη στην ψηφιακή τεχνολογία που εφαρμόζεται στον σχεδιασμό και την επεξεργασία εικόνων.' },
    'En Eureqa ofrecemos un servicio diferencial al haber desarrollado un método de trabajo único e innovador basado en la tecnología digital y la inteligencia artificial aplicadas al diseño y tratamiento de imágenes, obteniendo una reconstrucción física o digital mediante la impresión 3D y los modelos digitales en el sector salud: el <strong>Método Eureqa</strong>.': {
      en: 'At Eureqa we offer a differentiating service, having developed a unique and innovative working method based on digital technology and artificial intelligence applied to image design and processing, producing a physical or digital reconstruction through 3D printing and digital models in the healthcare sector: the <strong>Eureqa Method</strong>.',
      fr: "Chez Eureqa, nous proposons un service différenciant en ayant développé une méthode de travail unique et innovante basée sur la technologie numérique et l'intelligence artificielle appliquées à la conception et au traitement des images, obtenant une reconstruction physique ou numérique par impression 3D et modèles numériques dans le secteur de la santé : la <strong>Méthode Eureqa</strong>.",
      de: 'Bei Eureqa bieten wir einen differenzierenden Service, da wir eine einzigartige und innovative Arbeitsmethode auf Basis digitaler Technologie und künstlicher Intelligenz für Bildgestaltung und -verarbeitung entwickelt haben und damit eine physische oder digitale Rekonstruktion durch 3D-Druck und digitale Modelle im Gesundheitssektor erstellen: die <strong>Eureqa-Methode</strong>.',
      it: "In Eureqa offriamo un servizio differenziante avendo sviluppato un metodo di lavoro unico e innovativo basato sulla tecnologia digitale e l'intelligenza artificiale applicate alla progettazione e al trattamento delle immagini, ottenendo una ricostruzione fisica o digitale tramite la stampa 3D e i modelli digitali nel settore sanitario: il <strong>Metodo Eureqa</strong>.",
      el: 'Στην Eureqa προσφέρουμε μια διαφοροποιημένη υπηρεσία, έχοντας αναπτύξει μια μοναδική και καινοτόμο μέθοδο εργασίας βασισμένη στην ψηφιακή τεχνολογία και την τεχνητή νοημοσύνη που εφαρμόζονται στον σχεδιασμό και την επεξεργασία εικόνων, δημιουργώντας μια φυσική ή ψηφιακή ανακατασκευή μέσω τρισδιάστατης εκτύπωσης και ψηφιακών μοντέλων στον τομέα της υγείας: τη <strong>Μέθοδο Eureqa</strong>.' },
    'Nuestro método garantiza la <strong>trazabilidad completa</strong> de cada caso en la conversión de imágenes médicas de 2D a 3D, así como la <strong>confidencialidad</strong> de los pacientes en cumplimiento con el RGPD.': {
      en: 'Our method guarantees the <strong>complete traceability</strong> of each case in the conversion of medical images from 2D to 3D, as well as the <strong>confidentiality</strong> of patients in compliance with the GDPR.',
      fr: 'Notre méthode garantit la <strong>traçabilité complète</strong> de chaque cas dans la conversion des images médicales de 2D à 3D, ainsi que la <strong>confidentialité</strong> des patients conformément au RGPD.',
      de: 'Unsere Methode gewährleistet die <strong>vollständige Rückverfolgbarkeit</strong> jedes Falls bei der Umwandlung medizinischer Bilder von 2D in 3D sowie die <strong>Vertraulichkeit</strong> der Patienten gemäß der DSGVO.',
      it: 'Il nostro metodo garantisce la <strong>completa tracciabilità</strong> di ogni caso nella conversione delle immagini mediche da 2D a 3D, nonché la <strong>riservatezza</strong> dei pazienti nel rispetto del GDPR.',
      el: 'Η μέθοδός μας εγγυάται την <strong>πλήρη ιχνηλασιμότητα</strong> κάθε περίπτωσης στη μετατροπή ιατρικών εικόνων από 2D σε 3D, καθώς και την <strong>εμπιστευτικότητα</strong> των ασθενών σύμφωνα με τον GDPR.' },
    '«No hay dos cirugías iguales y no hay dos reconstrucciones 3D iguales»': {
      en: '«No two surgeries are alike, and no two 3D reconstructions are alike»',
      fr: '« Il n\'y a pas deux chirurgies identiques et pas deux reconstructions 3D identiques »',
      de: '„Keine zwei Operationen sind gleich, und keine zwei 3D-Rekonstruktionen sind gleich“',
      it: '«Non esistono due interventi uguali e non esistono due ricostruzioni 3D uguali»',
      el: '«Δεν υπάρχουν δύο ίδιες χειρουργικές επεμβάσεις ούτε δύο ίδιες τρισδιάστατες ανακατασκευές»' },
    'Calidad y precisión': { en: 'Quality and precision', fr: 'Qualité et précision', de: 'Qualität und Präzision', it: 'Qualità e precisione', el: 'Ποιότητα και ακρίβεια' },
    'Reconstrucciones 3D únicas a tamaño real': { en: 'Unique full-scale 3D reconstructions', fr: 'Des reconstructions 3D uniques à taille réelle', de: 'Einzigartige 3D-Rekonstruktionen in Originalgröße', it: 'Ricostruzioni 3D uniche a grandezza naturale', el: 'Μοναδικές τρισδιάστατες ανακατασκευές σε πραγματικό μέγεθος' },
    'Cada modelo anatómico 3D se diseña a escala 1:1 a partir de un TC o RMN del paciente, garantizando la fidelidad anatómica que el cirujano necesita para planificar una cirugía con mayor confianza y seguridad.': {
      en: "Each 3D anatomical model is designed at 1:1 scale from the patient's CT or MRI, ensuring the anatomical fidelity the surgeon needs to plan surgery with greater confidence and safety.",
      fr: "Chaque modèle anatomique 3D est conçu à l'échelle 1:1 à partir d'un scanner ou d'une IRM du patient, garantissant la fidélité anatomique dont le chirurgien a besoin pour planifier une intervention avec plus de confiance et de sécurité.",
      de: 'Jedes 3D-Anatomiemodell wird im Maßstab 1:1 anhand eines CT oder MRT des Patienten entworfen und gewährleistet die anatomische Genauigkeit, die der Chirurg benötigt, um eine Operation mit mehr Vertrauen und Sicherheit zu planen.',
      it: "Ogni modello anatomico 3D viene progettato in scala 1:1 a partire da una TC o RM del paziente, garantendo la fedeltà anatomica di cui il chirurgo ha bisogno per pianificare un intervento con maggiore fiducia e sicurezza.",
      el: 'Κάθε ανατομικό μοντέλο 3D σχεδιάζεται σε κλίμακα 1:1 από αξονική ή μαγνητική τομογραφία του ασθενούς, εξασφαλίζοντας την ανατομική πιστότητα που χρειάζεται ο χειρουργός για να σχεδιάσει μια επέμβαση με μεγαλύτερη εμπιστοσύνη και ασφάλεια.' },
    'El proceso': { en: 'The process', fr: 'Le processus', de: 'Der Prozess', it: 'Il processo', el: 'Η διαδικασία' },
    '¿Cómo lo hacemos?': { en: 'How do we do it?', fr: 'Comment procédons-nous ?', de: 'Wie machen wir das?', it: 'Come lo facciamo?', el: 'Πώς το κάνουμε;' },
    'El trabajo empieza en el momento en que el cirujano se pone en contacto con Eureqa.': {
      en: 'The work begins the moment the surgeon gets in touch with Eureqa.',
      fr: 'Le travail commence dès que le chirurgien contacte Eureqa.',
      de: 'Die Arbeit beginnt in dem Moment, in dem der Chirurg Eureqa kontaktiert.',
      it: 'Il lavoro inizia nel momento in cui il chirurgo contatta Eureqa.',
      el: 'Η εργασία ξεκινά τη στιγμή που ο χειρουργός έρχεται σε επαφή με την Eureqa.' },
    'Recogida de información': { en: 'Information gathering', fr: "Collecte d'informations", de: 'Informationserfassung', it: 'Raccolta di informazioni', el: 'Συλλογή πληροφοριών' },
    'Definimos el caso y las necesidades del profesional.': { en: "We define the case and the professional's needs.", fr: 'Nous définissons le cas et les besoins du professionnel.', de: 'Wir definieren den Fall und die Bedürfnisse des Fachmanns.', it: 'Definiamo il caso e le esigenze del professionista.', el: 'Καθορίζουμε την περίπτωση και τις ανάγκες του επαγγελματία.' },
    'Obtención de imágenes': { en: 'Image acquisition', fr: "Acquisition d'images", de: 'Bilderfassung', it: 'Acquisizione delle immagini', el: 'Λήψη εικόνων' },
    'Partimos del estudio radiológico del paciente.': { en: "We start from the patient's radiological study.", fr: "Nous partons de l'étude radiologique du patient.", de: 'Wir gehen von der radiologischen Studie des Patienten aus.', it: 'Partiamo dallo studio radiologico del paziente.', el: 'Ξεκινάμε από την ακτινολογική μελέτη του ασθενούς.' },
    'Tratamiento de imagen médica': { en: 'Medical image processing', fr: "Traitement de l'image médicale", de: 'Verarbeitung medizinischer Bilder', it: "Trattamento dell'immagine medica", el: 'Επεξεργασία ιατρικής εικόνας' },
    'Aplicamos el Método Eureqa, apoyado en inteligencia artificial para la segmentación, y obtenemos una reconstrucción 3D única, exclusiva y de alta calidad.': {
      en: 'We apply the Eureqa Method, supported by artificial intelligence for segmentation, and obtain a unique, exclusive and high-quality 3D reconstruction.',
      fr: "Nous appliquons la Méthode Eureqa, assistée par l'intelligence artificielle pour la segmentation, et obtenons une reconstruction 3D unique, exclusive et de haute qualité.",
      de: 'Wir wenden die Eureqa-Methode an, unterstützt durch künstliche Intelligenz zur Segmentierung, und erhalten eine einzigartige, exklusive und hochwertige 3D-Rekonstruktion.',
      it: "Applichiamo il Metodo Eureqa, supportato dall'intelligenza artificiale per la segmentazione, e otteniamo una ricostruzione 3D unica, esclusiva e di alta qualità.",
      el: 'Εφαρμόζουμε τη Μέθοδο Eureqa, υποστηριζόμενη από τεχνητή νοημοσύνη για την κατάτμηση, και αποκτούμε μια μοναδική, αποκλειστική και υψηλής ποιότητας τρισδιάστατη ανακατασκευή.' },
    'Fabricación del modelo': { en: 'Model manufacturing', fr: 'Fabrication du modèle', de: 'Herstellung des Modells', it: 'Fabbricazione del modello', el: 'Κατασκευή του μοντέλου' },
    'Producimos el modelo anatómico mediante impresión 3D.': { en: 'We produce the anatomical model through 3D printing.', fr: "Nous produisons le modèle anatomique par impression 3D.", de: 'Wir fertigen das Anatomiemodell mittels 3D-Druck.', it: 'Produciamo il modello anatomico tramite stampa 3D.', el: 'Παράγουμε το ανατομικό μοντέλο μέσω τρισδιάστατης εκτύπωσης.' },
    'Simulación quirúrgica (opcional)': { en: 'Surgical simulation (optional)', fr: 'Simulation chirurgicale (facultatif)', de: 'Chirurgische Simulation (optional)', it: 'Simulazione chirurgica (opzionale)', el: 'Χειρουργική προσομοίωση (προαιρετικά)' },
    'Posibilidad de simular el procedimiento quirúrgico sobre el modelo.': { en: 'Possibility of simulating the surgical procedure on the model.', fr: "Possibilité de simuler l'intervention chirurgicale sur le modèle.", de: 'Möglichkeit, den chirurgischen Eingriff am Modell zu simulieren.', it: 'Possibilità di simulare la procedura chirurgica sul modello.', el: 'Δυνατότητα προσομοίωσης της χειρουργικής επέμβασης στο μοντέλο.' },
    'Preparación y envío': { en: 'Preparation and shipping', fr: 'Préparation et expédition', de: 'Vorbereitung und Versand', it: 'Preparazione e spedizione', el: 'Προετοιμασία και αποστολή' },
    'Entregamos el modelo en tiempo récord, listo para el quirófano.': { en: 'We deliver the model in record time, ready for the operating room.', fr: 'Nous livrons le modèle en temps record, prêt pour le bloc opératoire.', de: 'Wir liefern das Modell in Rekordzeit, bereit für den Operationssaal.', it: 'Consegniamo il modello in tempo record, pronto per la sala operatoria.', el: 'Παραδίδουμε το μοντέλο σε χρόνο-ρεκόρ, έτοιμο για το χειρουργείο.' },
    '¿Quieres ver el método en acción?': { en: 'Want to see the method in action?', fr: 'Vous voulez voir la méthode en action ?', de: 'Möchten Sie die Methode in Aktion sehen?', it: 'Vuoi vedere il metodo in azione?', el: 'Θέλετε να δείτε τη μέθοδο σε δράση;' },
    'Solicita un caso de prueba y comprueba la calidad del Método Eureqa.': {
      en: 'Request a test case and see the quality of the Eureqa Method for yourself.',
      fr: 'Demandez un cas test et constatez la qualité de la Méthode Eureqa.',
      de: 'Fordern Sie einen Testfall an und überzeugen Sie sich von der Qualität der Eureqa-Methode.',
      it: 'Richiedi un caso di prova e verifica la qualità del Metodo Eureqa.',
      el: 'Ζητήστε μια δοκιμαστική περίπτωση και διαπιστώστε την ποιότητα της Μεθόδου Eureqa.' },
    'Solicitar caso de prueba': { en: 'Request a test case', fr: 'Demander un cas test', de: 'Testfall anfordern', it: 'Richiedi un caso di prova', el: 'Ζητήστε δοκιμαστική περίπτωση' },
    'Un método, seis pasos, cero improvisación': {
      en: 'One method, six steps, zero improvisation',
      fr: 'Une méthode, six étapes, zéro improvisation',
      de: 'Eine Methode, sechs Schritte, keine Improvisation',
      it: 'Un metodo, sei passaggi, zero improvvisazione',
      el: 'Μία μέθοδος, έξι βήματα, μηδενικός αυτοσχεδιασμός' },
    'En Eureqa hemos desarrollado un método propio que combina tecnología digital e inteligencia artificial para el diseño y tratamiento de imágenes médicas. El resultado es una reconstrucción física o digital mediante impresión 3D y modelos digitales: el <strong>Método Eureqa</strong>.': {
      en: 'At Eureqa we have developed our own method that combines digital technology and artificial intelligence for the design and processing of medical images. The result is a physical or digital reconstruction through 3D printing and digital models: the <strong>Eureqa Method</strong>.',
      fr: "Chez Eureqa, nous avons développé une méthode propre qui combine technologie numérique et intelligence artificielle pour la conception et le traitement des images médicales. Le résultat est une reconstruction physique ou numérique par impression 3D et modèles numériques : la <strong>Méthode Eureqa</strong>.",
      de: 'Bei Eureqa haben wir eine eigene Methode entwickelt, die digitale Technologie und künstliche Intelligenz für die Gestaltung und Verarbeitung medizinischer Bilder kombiniert. Das Ergebnis ist eine physische oder digitale Rekonstruktion durch 3D-Druck und digitale Modelle: die <strong>Eureqa-Methode</strong>.',
      it: 'In Eureqa abbiamo sviluppato un metodo proprio che combina tecnologia digitale e intelligenza artificiale per la progettazione e il trattamento delle immagini mediche. Il risultato è una ricostruzione fisica o digitale tramite stampa 3D e modelli digitali: il <strong>Metodo Eureqa</strong>.',
      el: 'Στην Eureqa έχουμε αναπτύξει τη δική μας μέθοδο που συνδυάζει ψηφιακή τεχνολογία και τεχνητή νοημοσύνη για τον σχεδιασμό και την επεξεργασία ιατρικών εικόνων. Το αποτέλεσμα είναι μια φυσική ή ψηφιακή ανακατασκευή μέσω τρισδιάστατης εκτύπωσης και ψηφιακών μοντέλων: η <strong>Μέθοδος Eureqa</strong>.' },
    'Paso opcional': { en: 'Optional step', fr: 'Étape facultative', de: 'Optionaler Schritt', it: 'Passaggio opzionale', el: 'Προαιρετικό βήμα' },
    'Ensaya la cirugía antes de entrar en quirófano': { en: 'Rehearse the surgery before entering the operating room', fr: "Répétez l'intervention avant d'entrer au bloc opératoire", de: 'Üben Sie die Operation, bevor Sie den OP betreten', it: "Prova l'intervento prima di entrare in sala operatoria", el: 'Εξασκηθείτε στην επέμβαση πριν μπείτε στο χειρουργείο' },
    'Nuestros modelos también se fabrican en materiales blandos que reproducen la consistencia de cada tejido, para que el equipo quirúrgico pueda simular el abordaje, practicar la técnica y anticipar complicaciones sobre una réplica fiel del caso real.': {
      en: 'Our models are also manufactured in soft materials that reproduce the consistency of each tissue, so the surgical team can simulate the approach, practice the technique and anticipate complications on a faithful replica of the real case.',
      fr: "Nos modèles sont également fabriqués dans des matériaux souples qui reproduisent la consistance de chaque tissu, afin que l'équipe chirurgicale puisse simuler l'abord, s'entraîner à la technique et anticiper les complications sur une réplique fidèle du cas réel.",
      de: 'Unsere Modelle werden auch aus weichen Materialien gefertigt, die die Konsistenz jedes Gewebes nachbilden, damit das chirurgische Team den Zugang simulieren, die Technik üben und Komplikationen an einer originalgetreuen Replik des realen Falls vorhersehen kann.',
      it: "I nostri modelli vengono realizzati anche in materiali morbidi che riproducono la consistenza di ogni tessuto, in modo che l'équipe chirurgica possa simulare l'approccio, esercitarsi nella tecnica e anticipare le complicanze su una replica fedele del caso reale.",
      el: 'Τα μοντέλα μας κατασκευάζονται επίσης από μαλακά υλικά που αναπαράγουν τη σύσταση κάθε ιστού, ώστε η χειρουργική ομάδα να μπορεί να προσομοιώσει την προσέγγιση, να εξασκηθεί στην τεχνική και να προβλέψει επιπλοκές πάνω σε ένα πιστό αντίγραφο της πραγματικής περίπτωσης.' },
    'Partimos del estudio radiológico del paciente. Envío seguro: te ayudamos a enviarlo o lo hacemos nosotros por ti.': {
      en: "We start from the patient's radiological study. Secure delivery: we help you send it, or we do it for you.",
      fr: "Nous partons de l'étude radiologique du patient. Envoi sécurisé : nous vous aidons à l'envoyer ou nous le faisons pour vous.",
      de: 'Wir gehen von der radiologischen Untersuchung des Patienten aus. Sicherer Versand: Wir helfen Ihnen beim Versand oder übernehmen ihn für Sie.',
      it: 'Partiamo dallo studio radiologico del paziente. Invio sicuro: ti aiutiamo a inviarlo o lo facciamo noi per te.',
      el: 'Ξεκινάμε από την ακτινολογική μελέτη του ασθενούς. Ασφαλής αποστολή: σας βοηθάμε να τη στείλετε ή το κάνουμε εμείς για εσάς.' },
    'Fabricación del modelo (físico o digital)': { en: 'Model manufacturing (physical or digital)', fr: 'Fabrication du modèle (physique ou numérique)', de: 'Herstellung des Modells (physisch oder digital)', it: 'Fabbricazione del modello (fisico o digitale)', el: 'Κατασκευή του μοντέλου (φυσικό ή ψηφιακό)' },
    'Producimos el modelo anatómico mediante impresión 3D o preparamos un modelo 3D digital con el que puedes interactuar desde el navegador de tu ordenador, tablet o teléfono móvil.': {
      en: 'We produce the anatomical model through 3D printing, or prepare a digital 3D model you can interact with from the browser of your computer, tablet or mobile phone.',
      fr: "Nous produisons le modèle anatomique par impression 3D ou préparons un modèle 3D numérique avec lequel vous pouvez interagir depuis le navigateur de votre ordinateur, tablette ou téléphone mobile.",
      de: 'Wir fertigen das Anatomiemodell mittels 3D-Druck oder erstellen ein digitales 3D-Modell, mit dem Sie über den Browser Ihres Computers, Tablets oder Mobiltelefons interagieren können.',
      it: "Produciamo il modello anatomico tramite stampa 3D oppure prepariamo un modello 3D digitale con cui puoi interagire dal browser del tuo computer, tablet o telefono cellulare.",
      el: 'Παράγουμε το ανατομικό μοντέλο μέσω τρισδιάστατης εκτύπωσης ή προετοιμάζουμε ένα ψηφιακό τρισδιάστατο μοντέλο με το οποίο μπορείτε να αλληλεπιδράσετε από το πρόγραμμα περιήγησης του υπολογιστή, του tablet ή του κινητού σας τηλεφώνου.' },
    'Posibilidad de simular el procedimiento quirúrgico sobre el modelo con ayuda del equipo de Eureqa3D.': {
      en: 'Possibility of simulating the surgical procedure on the model with the help of the Eureqa3D team.',
      fr: "Possibilité de simuler l'intervention chirurgicale sur le modèle avec l'aide de l'équipe Eureqa3D.",
      de: 'Möglichkeit, den chirurgischen Eingriff mit Unterstützung des Eureqa3D-Teams am Modell zu simulieren.',
      it: "Possibilità di simulare la procedura chirurgica sul modello con l'aiuto del team di Eureqa3D.",
      el: 'Δυνατότητα προσομοίωσης της χειρουργικής επέμβασης στο μοντέλο με τη βοήθεια της ομάδας της Eureqa3D.' },
    'Preparación y envío (modelos físicos con impresión 3D)': { en: 'Preparation and shipping (physical models with 3D printing)', fr: 'Préparation et expédition (modèles physiques imprimés en 3D)', de: 'Vorbereitung und Versand (physische Modelle im 3D-Druck)', it: 'Preparazione e spedizione (modelli fisici con stampa 3D)', el: 'Προετοιμασία και αποστολή (φυσικά μοντέλα με τρισδιάστατη εκτύπωση)' },

    /* ── Traumatología ── */
    'Servicios · Traumatología': { en: 'Services · Traumatology', fr: 'Services · Traumatologie', de: 'Leistungen · Traumatologie', it: 'Servizi · Traumatologia', el: 'Υπηρεσίες · Τραυματολογία' },
    'La tecnología que revoluciona la cirugía': { en: 'The technology that revolutionizes surgery', fr: 'La technologie qui révolutionne la chirurgie', de: 'Die Technologie, die die Chirurgie revolutioniert', it: 'La tecnologia che rivoluziona la chirurgia', el: 'Η τεχνολογία που φέρνει επανάσταση στη χειρουργική' },
    'La planificación quirúrgica con ayuda de un modelo anatómico 3D facilita el estudio de la anatomía, la preparación del abordaje y el instrumental, y mejora la previsión de complicaciones intraoperatorias.': {
      en: 'Surgical planning with the help of a 3D anatomical model makes it easier to study the anatomy, prepare the approach and instruments, and improves the anticipation of intraoperative complications.',
      fr: "La planification chirurgicale à l'aide d'un modèle anatomique 3D facilite l'étude de l'anatomie, la préparation de l'abord et de l'instrumentation, et améliore l'anticipation des complications peropératoires.",
      de: 'Die chirurgische Planung mithilfe eines 3D-Anatomiemodells erleichtert das Studium der Anatomie, die Vorbereitung von Zugang und Instrumentarium und verbessert die Vorhersage intraoperativer Komplikationen.',
      it: "La pianificazione chirurgica con l'aiuto di un modello anatomico 3D facilita lo studio dell'anatomia, la preparazione dell'approccio e della strumentazione, e migliora la previsione delle complicanze intraoperatorie.",
      el: 'Ο χειρουργικός σχεδιασμός με τη βοήθεια ενός ανατομικού μοντέλου 3D διευκολύνει τη μελέτη της ανατομίας, την προετοιμασία της προσέγγισης και των εργαλείων, και βελτιώνει την πρόβλεψη διεγχειρητικών επιπλοκών.' },
    'Casos habituales': { en: 'Common cases', fr: 'Cas fréquents', de: 'Häufige Fälle', it: 'Casi frequenti', el: 'Συνήθεις περιπτώσεις' },
    'Modelos anatómicos donde la impresión 3D marca la diferencia': { en: '3D anatomical models where 3D printing makes the difference', fr: "Des modèles anatomiques où l'impression 3D fait la différence", de: 'Anatomiemodelle, bei denen der 3D-Druck den Unterschied macht', it: 'Modelli anatomici dove la stampa 3D fa la differenza', el: 'Ανατομικά μοντέλα όπου η τρισδιάστατη εκτύπωση κάνει τη διαφορά' },
    'Réplicas a tamaño real impresas a partir del estudio radiológico del paciente.': {
      en: "Full-scale replicas printed from the patient's radiological study.",
      fr: "Des répliques à taille réelle imprimées à partir de l'étude radiologique du patient.",
      de: 'Repliken in Originalgröße, gedruckt aus der radiologischen Studie des Patienten.',
      it: 'Repliche a grandezza naturale stampate a partire dallo studio radiologico del paziente.',
      el: 'Αντίγραφα σε πραγματικό μέγεθος εκτυπωμένα από την ακτινολογική μελέτη του ασθενούς.' },
    'Húmero proximal': { en: 'Proximal humerus', fr: 'Humérus proximal', de: 'Proximaler Humerus', it: 'Omero prossimale', el: 'Εγγύς βραχιόνιο' },
    'Fractura de húmero proximal': { en: 'Proximal humerus fracture', fr: "Fracture de l'humérus proximal", de: 'Fraktur des proximalen Humerus', it: "Frattura dell'omero prossimale", el: 'Κάταγμα εγγύς βραχιονίου' },
    'Acetábulo': { en: 'Acetabulum', fr: 'Acétabulum', de: 'Azetabulum', it: 'Acetabolo', el: 'Κοτύλη' },
    'Fractura de acetábulo': { en: 'Acetabular fracture', fr: "Fracture de l'acétabulum", de: 'Azetabulumfraktur', it: "Frattura dell'acetabolo", el: 'Κάταγμα κοτύλης' },
    'Pilón tibial': { en: 'Tibial pilon', fr: 'Pilon tibial', de: 'Pilon tibiale', it: 'Pilone tibiale', el: 'Κνημιαίος πυλώνας' },
    'Fractura de pilón tibial': { en: 'Tibial pilon fracture', fr: 'Fracture du pilon tibial', de: 'Pilon-tibiale-Fraktur', it: 'Frattura del pilone tibiale', el: 'Κάταγμα κνημιαίου πυλώνα' },
    'Radio distal': { en: 'Distal radius', fr: 'Radius distal', de: 'Distaler Radius', it: 'Radio distale', el: 'Άπω κερκίδα' },
    'Fractura de radio distal': { en: 'Distal radius fracture', fr: 'Fracture du radius distal', de: 'Distale Radiusfraktur', it: 'Frattura del radio distale', el: 'Κάταγμα άπω κερκίδας' },
    'Calcáneo': { en: 'Calcaneus', fr: 'Calcanéum', de: 'Kalkaneus', it: 'Calcagno', el: 'Πτέρνα' },
    'Fractura de calcáneo': { en: 'Calcaneal fracture', fr: 'Fracture du calcanéum', de: 'Kalkaneusfraktur', it: 'Frattura del calcagno', el: 'Κάταγμα πτέρνας' },
    'Meseta tibial': { en: 'Tibial plateau', fr: 'Plateau tibial', de: 'Tibiaplateau', it: 'Piatto tibiale', el: 'Κνημιαίο πλατώ' },
    'Fractura de meseta tibial': { en: 'Tibial plateau fracture', fr: 'Fracture du plateau tibial', de: 'Tibiaplateaufraktur', it: 'Frattura del piatto tibiale', el: 'Κάταγμα κνημιαίου πλατώ' },
    'Beneficios para el profesional y el paciente': { en: 'Benefits for the professional and the patient', fr: 'Des bénéfices pour le professionnel et le patient', de: 'Vorteile für Fachpersonal und Patient', it: 'Benefici per il professionista e il paziente', el: 'Οφέλη για τον επαγγελματία και τον ασθενή' },
    'El resultado principal es un <strong>aumento de la garantía de éxito de la operación</strong>, ayudando al cirujano a conseguir mayor precisión y confianza en el quirófano.': {
      en: 'The main outcome is an <strong>increase in the assurance of a successful operation</strong>, helping the surgeon achieve greater precision and confidence in the operating room.',
      fr: "Le principal résultat est une <strong>augmentation de la garantie de réussite de l'opération</strong>, aidant le chirurgien à gagner en précision et en confiance au bloc opératoire.",
      de: 'Das wichtigste Ergebnis ist eine <strong>erhöhte Erfolgsgarantie der Operation</strong>, die dem Chirurgen zu mehr Präzision und Sicherheit im Operationssaal verhilft.',
      it: "Il risultato principale è un <strong>aumento della garanzia di successo dell'operazione</strong>, aiutando il chirurgo a ottenere maggiore precisione e sicurezza in sala operatoria.",
      el: 'Το κύριο αποτέλεσμα είναι μια <strong>αύξηση της εγγύησης επιτυχίας της επέμβασης</strong>, βοηθώντας τον χειρουργό να επιτύχει μεγαλύτερη ακρίβεια και σιγουριά στο χειρουργείο.' },
    'Esto supone un beneficio que repercute en el paciente con una <strong>disminución de complicaciones</strong> y del tiempo de intervención.': {
      en: 'This brings a benefit that reaches the patient through a <strong>reduction in complications</strong> and in intervention time.',
      fr: 'Cela représente un bénéfice qui se répercute sur le patient par une <strong>diminution des complications</strong> et du temps d\'intervention.',
      de: 'Dies bringt einen Vorteil, der sich beim Patienten durch <strong>weniger Komplikationen</strong> und eine kürzere Eingriffsdauer auswirkt.',
      it: 'Questo comporta un beneficio che si ripercuote sul paziente con una <strong>diminuzione delle complicanze</strong> e del tempo di intervento.',
      el: 'Αυτό συνεπάγεται όφελος που αντανακλάται στον ασθενή με <strong>μείωση των επιπλοκών</strong> και του χρόνου της επέμβασης.' },
    'La suma de estas mejoras consigue, además, un <strong>ahorro en el coste del tratamiento</strong> para el servicio de salud.': {
      en: 'The sum of these improvements also achieves <strong>savings in the cost of treatment</strong> for the health service.',
      fr: 'La somme de ces améliorations permet en outre une <strong>réduction du coût du traitement</strong> pour le service de santé.',
      de: 'Die Summe dieser Verbesserungen führt zudem zu einer <strong>Kostenersparnis bei der Behandlung</strong> für das Gesundheitssystem.',
      it: 'La somma di questi miglioramenti consente inoltre un <strong>risparmio sul costo del trattamento</strong> per il servizio sanitario.',
      el: 'Το σύνολο αυτών των βελτιώσεων επιτυγχάνει επιπλέον <strong>εξοικονόμηση στο κόστος της θεραπείας</strong> για την υπηρεσία υγείας.' },
    '¿Tienes un caso complejo?': { en: 'Do you have a complex case?', fr: 'Vous avez un cas complexe ?', de: 'Haben Sie einen komplexen Fall?', it: 'Hai un caso complesso?', el: 'Έχετε μια πολύπλοκη περίπτωση;' },
    'Solicita un modelo anatómico 3D y planifica tu intervención con total confianza.': {
      en: 'Request a 3D anatomical model and plan your intervention with total confidence.',
      fr: 'Demandez un modèle anatomique 3D et planifiez votre intervention en toute confiance.',
      de: 'Fordern Sie ein 3D-Anatomiemodell an und planen Sie Ihren Eingriff mit voller Sicherheit.',
      it: 'Richiedi un modello anatomico 3D e pianifica il tuo intervento con totale sicurezza.',
      el: 'Ζητήστε ένα ανατομικό μοντέλο 3D και σχεδιάστε την επέμβασή σας με απόλυτη σιγουριά.' },
    'El hueso de cada paciente, en tus manos antes de empezar la cirugía': { en: "Each patient's bone, in your hands before the surgery begins", fr: "L'os de chaque patient, entre vos mains avant le début de l'intervention", de: 'Der Knochen jedes Patienten, in Ihren Händen, bevor die Operation beginnt', it: "L'osso di ogni paziente, nelle tue mani prima di iniziare l'intervento", el: 'Το οστό κάθε ασθενούς, στα χέρια σας πριν ξεκινήσει η χειρουργική επέμβαση' },
    'Beneficios para el profesional y para el paciente': { en: 'Benefits for the professional and for the patient', fr: 'Bénéfices pour le professionnel et pour le patient', de: 'Vorteile für Fachpersonal und für den Patienten', it: 'Benefici per il professionista e per il paziente', el: 'Οφέλη για τον επαγγελματία και για τον ασθενή' },

    /* ── Otras especialidades ── */
    'Servicios · Otras especialidades': { en: 'Services · Other specialties', fr: 'Services · Autres spécialités', de: 'Leistungen · Weitere Fachbereiche', it: 'Servizi · Altre specialità', el: 'Υπηρεσίες · Άλλες ειδικότητες' },
    'La impresión 3D es útil en muchas más áreas': { en: '3D printing is useful in many more areas', fr: "L'impression 3D est utile dans bien d'autres domaines", de: 'Der 3D-Druck ist in vielen weiteren Bereichen nützlich', it: 'La stampa 3D è utile in molte altre aree', el: 'Η τρισδιάστατη εκτύπωση είναι χρήσιμη σε πολλούς ακόμη τομείς' },
    'Más allá de la traumatología, los modelos anatómicos 3D ayudan a planificar intervenciones en numerosas especialidades quirúrgicas.': {
      en: 'Beyond traumatology, 3D anatomical models help plan interventions across numerous surgical specialties.',
      fr: 'Au-delà de la traumatologie, les modèles anatomiques 3D aident à planifier des interventions dans de nombreuses spécialités chirurgicales.',
      de: 'Über die Traumatologie hinaus helfen 3D-Anatomiemodelle bei der Planung von Eingriffen in zahlreichen chirurgischen Fachbereichen.',
      it: 'Oltre alla traumatologia, i modelli anatomici 3D aiutano a pianificare interventi in numerose specialità chirurgiche.',
      el: 'Πέρα από την τραυματολογία, τα ανατομικά μοντέλα 3D βοηθούν στον σχεδιασμό επεμβάσεων σε πολυάριθμες χειρουργικές ειδικότητες.' },
    'Urología': { en: 'Urology', fr: 'Urologie', de: 'Urologie', it: 'Urologia', el: 'Ουρολογία' },
    'Neoplasia renal: cirugía de nefrectomía parcial': { en: 'Renal neoplasia: partial nephrectomy surgery', fr: 'Néoplasie rénale : chirurgie de néphrectomie partielle', de: 'Nierenneoplasie: Operation zur partiellen Nephrektomie', it: 'Neoplasia renale: chirurgia di nefrectomia parziale', el: 'Νεφρική νεοπλασία: χειρουργική μερικής νεφρεκτομής' },
    'Neoplasia prostática': { en: 'Prostate neoplasia', fr: 'Néoplasie prostatique', de: 'Prostataneoplasie', it: 'Neoplasia prostatica', el: 'Νεοπλασία προστάτη' },
    'Malformaciones y alteraciones anatómicas de las vías urinarias': { en: 'Malformations and anatomical alterations of the urinary tract', fr: 'Malformations et altérations anatomiques des voies urinaires', de: 'Fehlbildungen und anatomische Veränderungen der Harnwege', it: 'Malformazioni e alterazioni anatomiche delle vie urinarie', el: 'Δυσπλασίες και ανατομικές αλλοιώσεις του ουροποιητικού συστήματος' },
    'Trasplante renal de donante vivo con alteraciones vasculares': { en: 'Living-donor kidney transplant with vascular alterations', fr: 'Transplantation rénale de donneur vivant avec altérations vasculaires', de: 'Nierentransplantation von Lebendspendern mit Gefäßveränderungen', it: 'Trapianto renale da donatore vivente con alterazioni vascolari', el: 'Μεταμόσχευση νεφρού από ζώντα δότη με αγγειακές αλλοιώσεις' },
    'Cardiología': { en: 'Cardiology', fr: 'Cardiologie', de: 'Kardiologie', it: 'Cardiologia', el: 'Καρδιολογία' },
    'Reparación de defectos septales (CIA / CIV)': { en: 'Repair of septal defects (ASD / VSD)', fr: 'Réparation des communications septales (CIA / CIV)', de: 'Verschluss von Septumdefekten (ASD / VSD)', it: 'Riparazione di difetti settali (DIA / DIV)', el: 'Αποκατάσταση μεσοκολπικών/μεσοκοιλιακών ελλειμμάτων (ASD / VSD)' },
    'Cirugía neonatal de malformaciones cardiacas congénitas': { en: 'Neonatal surgery for congenital heart malformations', fr: 'Chirurgie néonatale des malformations cardiaques congénitales', de: 'Neonatale Chirurgie angeborener Herzfehler', it: 'Chirurgia neonatale di malformazioni cardiache congenite', el: 'Νεογνική χειρουργική συγγενών καρδιακών ανωμαλιών' },
    'Maxilofacial – Dental': { en: 'Maxillofacial – Dental', fr: 'Maxillo-facial – Dentaire', de: 'Mund-Kiefer-Gesicht – Dental', it: 'Maxillo-facciale – Dentale', el: 'Γναθοπροσωπική – Οδοντιατρική' },
    'Cirugía ortognática': { en: 'Orthognathic surgery', fr: 'Chirurgie orthognathique', de: 'Orthognathe Chirurgie', it: 'Chirurgia ortognatica', el: 'Ορθογναθική χειρουργική' },
    'Resección de carcinomas mandibulares': { en: 'Resection of mandibular carcinomas', fr: 'Résection de carcinomes mandibulaires', de: 'Resektion von Unterkieferkarzinomen', it: 'Resezione di carcinomi mandibolari', el: 'Εκτομή καρκινωμάτων κάτω γνάθου' },
    'Neurocirugía': { en: 'Neurosurgery', fr: 'Neurochirurgie', de: 'Neurochirurgie', it: 'Neurochirurgia', el: 'Νευροχειρουργική' },
    'Traumatismos y reconstrucciones de huesos craneales': { en: 'Trauma and reconstruction of cranial bones', fr: 'Traumatismes et reconstructions des os crâniens', de: 'Traumata und Rekonstruktionen von Schädelknochen', it: 'Traumi e ricostruzioni di ossa craniche', el: 'Τραυματισμοί και ανακατασκευές κρανιακών οστών' },
    'Implantes de calota': { en: 'Calvarial implants', fr: 'Implants de la voûte crânienne', de: 'Kalottenimplantate', it: 'Impianti della calotta cranica', el: 'Εμφυτεύματα κρανιακού θόλου' },
    'Planificación de tumores del SNC': { en: 'Planning of CNS tumors', fr: 'Planification des tumeurs du SNC', de: 'Planung von ZNS-Tumoren', it: 'Pianificazione di tumori del SNC', el: 'Σχεδιασμός όγκων του ΚΝΣ' },
    'Cirugía vascular': { en: 'Vascular surgery', fr: 'Chirurgie vasculaire', de: 'Gefäßchirurgie', it: 'Chirurgia vascolare', el: 'Αγγειοχειρουργική' },
    'Reparación de lesiones aneurismáticas y disecciones de aorta': { en: 'Repair of aneurysmal lesions and aortic dissections', fr: 'Réparation de lésions anévrismales et de dissections aortiques', de: 'Behandlung von Aneurysmen und Aortendissektionen', it: 'Riparazione di lesioni aneurismatiche e dissezioni aortiche', el: 'Αποκατάσταση ανευρυσματικών βλαβών και διαχωρισμών αορτής' },
    'Cirugía torácica': { en: 'Thoracic surgery', fr: 'Chirurgie thoracique', de: 'Thoraxchirurgie', it: 'Chirurgia toracica', el: 'Θωρακοχειρουργική' },
    'Resección de masa mediastínica': { en: 'Resection of mediastinal mass', fr: 'Résection de masse médiastinale', de: 'Resektion einer Mediastinalmasse', it: 'Resezione di massa mediastinica', el: 'Εκτομή μεσοθωρακικής μάζας' },
    'Otorrinolaringología': { en: 'Otolaryngology', fr: 'Oto-rhino-laryngologie', de: 'Hals-Nasen-Ohren-Heilkunde', it: 'Otorinolaringoiatria', el: 'Ωτορινολαρυγγολογία' },
    'Resección de tumoraciones de cabeza y cuello': { en: 'Resection of head and neck tumors', fr: 'Résection de tumeurs de la tête et du cou', de: 'Resektion von Kopf-Hals-Tumoren', it: 'Resezione di tumori della testa e del collo', el: 'Εκτομή όγκων κεφαλής και τραχήλου' },
    'General y digestivo': { en: 'General and digestive', fr: 'Générale et digestive', de: 'Allgemein- und Viszeralchirurgie', it: 'Generale e digestivo', el: 'Γενική και πεπτικού' },
    'Cirugía hepática: resección de hepatocarcinoma': { en: 'Liver surgery: resection of hepatocarcinoma', fr: "Chirurgie hépatique : résection d'hépatocarcinome", de: 'Leberchirurgie: Resektion eines Leberzellkarzinoms', it: 'Chirurgia epatica: resezione di epatocarcinoma', el: 'Ηπατική χειρουργική: εκτομή ηπατοκαρκινώματος' },
    'Cirugía pancreática: resección de carcinoma de cabeza de páncreas': { en: 'Pancreatic surgery: resection of carcinoma of the pancreatic head', fr: 'Chirurgie pancréatique : résection de carcinome de la tête du pancréas', de: 'Pankreaschirurgie: Resektion eines Karzinoms des Pankreaskopfes', it: 'Chirurgia pancreatica: resezione di carcinoma della testa del pancreas', el: 'Παγκρεατική χειρουργική: εκτομή καρκινώματος κεφαλής παγκρέατος' },
    'Ginecología': { en: 'Gynecology', fr: 'Gynécologie', de: 'Gynäkologie', it: 'Ginecologia', el: 'Γυναικολογία' },
    'Resección de carcinomas ginecológicos': { en: 'Resection of gynecological carcinomas', fr: 'Résection de carcinomes gynécologiques', de: 'Resektion gynäkologischer Karzinome', it: 'Resezione di carcinomi ginecologici', el: 'Εκτομή γυναικολογικών καρκινωμάτων' },
    '¿Tu especialidad no está en la lista?': { en: 'Is your specialty not on the list?', fr: "Votre spécialité n'est pas dans la liste ?", de: 'Ist Ihr Fachgebiet nicht aufgeführt?', it: 'La tua specialità non è in elenco?', el: 'Η ειδικότητά σας δεν είναι στη λίστα;' },
    'Cuéntanos tu caso: el modelado 3D tiene aplicación en prácticamente cualquier procedimiento que requiera planificación anatómica.': {
      en: 'Tell us about your case: 3D modeling can be applied to virtually any procedure that requires anatomical planning.',
      fr: "Parlez-nous de votre cas : la modélisation 3D s'applique à pratiquement toute intervention nécessitant une planification anatomique.",
      de: 'Erzählen Sie uns von Ihrem Fall: Die 3D-Modellierung lässt sich bei praktisch jedem Eingriff anwenden, der eine anatomische Planung erfordert.',
      it: 'Raccontaci il tuo caso: la modellazione 3D si applica praticamente a qualsiasi procedura che richieda una pianificazione anatomica.',
      el: 'Πείτε μας την περίπτωσή σας: η τρισδιάστατη μοντελοποίηση εφαρμόζεται σχεδόν σε κάθε επέμβαση που απαιτεί ανατομικό σχεδιασμό.' },
    'Hablemos de tu caso': { en: "Let's talk about your case", fr: 'Parlons de votre cas', de: 'Sprechen wir über Ihren Fall', it: 'Parliamo del tuo caso', el: 'Ας μιλήσουμε για την περίπτωσή σας' },
    'Servicios · Cirugía Oncológica (todas las especialidades)': { en: 'Services · Oncological Surgery (all specialties)', fr: 'Services · Chirurgie Oncologique (toutes spécialités)', de: 'Leistungen · Onkologische Chirurgie (alle Fachbereiche)', it: 'Servizi · Chirurgia Oncologica (tutte le specialità)', el: 'Υπηρεσίες · Ογκολογική Χειρουργική (όλες οι ειδικότητες)' },
    'Modelos anatómicos 3D para cirugía oncológica y otras especialidades quirúrgicas: general y hepatobiliopancreática, urología, ginecología, torácica, cardiovascular, otorrinolaringología y neurocirugía.': {
      en: '3D anatomical models for oncological surgery and other surgical specialties: general and hepatobiliopancreatic, urology, gynecology, thoracic, cardiovascular, otolaryngology and neurosurgery.',
      fr: "Modèles anatomiques 3D pour la chirurgie oncologique et d'autres spécialités chirurgicales : générale et hépatobiliopancréatique, urologie, gynécologie, thoracique, cardiovasculaire, oto-rhino-laryngologie et neurochirurgie.",
      de: '3D-Anatomiemodelle für die onkologische Chirurgie und weitere chirurgische Fachbereiche: Allgemein- und hepatobiliopankreatische Chirurgie, Urologie, Gynäkologie, Thoraxchirurgie, Herz-Kreislauf-Chirurgie, HNO-Heilkunde und Neurochirurgie.',
      it: 'Modelli anatomici 3D per la chirurgia oncologica e altre specialità chirurgiche: generale ed epatobiliopancreatica, urologia, ginecologia, toracica, cardiovascolare, otorinolaringoiatria e neurochirurgia.',
      el: 'Ανατομικά μοντέλα 3D για ογκολογική χειρουργική και άλλες χειρουργικές ειδικότητες: γενική και ηπατοχολοπαγκρεατική, ουρολογία, γυναικολογία, θωρακική, καρδιαγγειακή, ωτορινολαρυγγολογία και νευροχειρουργική.' },
    'Cirugía General y Hepatobiliopancreática': { en: 'General and Hepatobiliopancreatic Surgery', fr: 'Chirurgie Générale et Hépatobiliopancréatique', de: 'Allgemein- und Hepatobiliopankreatische Chirurgie', it: 'Chirurgia Generale ed Epatobiliopancreatica', el: 'Γενική και Ηπατοχολοπαγκρεατική Χειρουργική' },
    'Hepatocarcinoma y metástasis hepáticas': { en: 'Hepatocarcinoma and liver metastases', fr: 'Hépatocarcinome et métastases hépatiques', de: 'Leberzellkarzinom und Lebermetastasen', it: 'Epatocarcinoma e metastasi epatiche', el: 'Ηπατοκαρκίνωμα και ηπατικές μεταστάσεις' },
    'Neoplasia de vías biliares (tumor de Klatskin, otros)': { en: 'Biliary tract neoplasia (Klatskin tumor, others)', fr: 'Néoplasie des voies biliaires (tumeur de Klatskin, autres)', de: 'Neoplasie der Gallenwege (Klatskin-Tumor, andere)', it: 'Neoplasia delle vie biliari (tumore di Klatskin, altri)', el: 'Νεοπλασία χοληφόρων οδών (όγκος Klatskin, άλλα)' },
    'Carcinoma de páncreas (adenocarcinoma de cabeza de páncreas, otros)': { en: 'Pancreatic carcinoma (adenocarcinoma of the pancreatic head, others)', fr: 'Carcinome du pancréas (adénocarcinome de la tête du pancréas, autres)', de: 'Pankreaskarzinom (Adenokarzinom des Pankreaskopfes, andere)', it: 'Carcinoma del pancreas (adenocarcinoma della testa del pancreas, altri)', el: 'Καρκίνωμα παγκρέατος (αδενοκαρκίνωμα κεφαλής παγκρέατος, άλλα)' },
    'Otras neoplasias retroperitoneales o de pared abdominal': { en: 'Other retroperitoneal or abdominal wall neoplasms', fr: 'Autres néoplasies rétropéritonéales ou de la paroi abdominale', de: 'Weitere retroperitoneale Neoplasien oder Neoplasien der Bauchwand', it: 'Altre neoplasie retroperitoneali o della parete addominale', el: 'Άλλες οπισθοπεριτοναϊκές νεοπλασίες ή νεοπλασίες κοιλιακού τοιχώματος' },
    'Neoplasias de mama': { en: 'Breast neoplasms', fr: 'Néoplasies du sein', de: 'Brustneoplasien', it: 'Neoplasie della mammella', el: 'Νεοπλασίες μαστού' },
    'Tumor de ovario para cirugía citorreductora': { en: 'Ovarian tumor for cytoreductive surgery', fr: "Tumeur de l'ovaire pour chirurgie de cytoréduction", de: 'Eierstocktumor für zytoreduktive Chirurgie', it: 'Tumore ovarico per chirurgia citoriduttiva', el: 'Όγκος ωοθήκης για κυτταρομειωτική χειρουργική' },
    'Otras neoplasias ginecológicas': { en: 'Other gynecological neoplasms', fr: 'Autres néoplasies gynécologiques', de: 'Weitere gynäkologische Neoplasien', it: 'Altre neoplasie ginecologiche', el: 'Άλλες γυναικολογικές νεοπλασίες' },
    'Cirugía Cardiovascular (cirugía pediátrica y adultos)': { en: 'Cardiovascular Surgery (pediatric and adult surgery)', fr: 'Chirurgie Cardiovasculaire (chirurgie pédiatrique et adulte)', de: 'Herz-Kreislauf-Chirurgie (Kinder- und Erwachsenenchirurgie)', it: 'Chirurgia Cardiovascolare (chirurgia pediatrica e adulti)', el: 'Καρδιαγγειακή Χειρουργική (παιδιατρική και ενηλίκων)' },
    'Reparación de anomalías congénitas de las arterias coronarias': { en: 'Repair of congenital coronary artery anomalies', fr: 'Réparation des anomalies congénitales des artères coronaires', de: 'Korrektur angeborener Koronararterienanomalien', it: 'Riparazione di anomalie congenite delle arterie coronarie', el: 'Αποκατάσταση συγγενών ανωμαλιών στεφανιαίων αρτηριών' },
    'Neoplasias cardíacas (lipoma, otros)': { en: 'Cardiac neoplasms (lipoma, others)', fr: 'Néoplasies cardiaques (lipome, autres)', de: 'Herzneoplasien (Lipom, andere)', it: 'Neoplasie cardiache (lipoma, altri)', el: 'Καρδιακές νεοπλασίες (λίπωμα, άλλα)' },
    'Recambio valvular complejo (aórtica, mitral o tricúspide)': { en: 'Complex valve replacement (aortic, mitral or tricuspid)', fr: 'Remplacement valvulaire complexe (aortique, mitrale ou tricuspide)', de: 'Komplexer Klappenersatz (Aorten-, Mitral- oder Trikuspidalklappe)', it: 'Sostituzione valvolare complessa (aortica, mitralica o tricuspide)', el: 'Σύνθετη αντικατάσταση βαλβίδας (αορτική, μιτροειδής ή τριγλώχινα)' },
    'Cirugía Torácica': { en: 'Thoracic Surgery', fr: 'Chirurgie Thoracique', de: 'Thoraxchirurgie', it: 'Chirurgia Toracica', el: 'Θωρακοχειρουργική' },
    'Tumores mediastínicos': { en: 'Mediastinal tumors', fr: 'Tumeurs médiastinales', de: 'Mediastinaltumoren', it: 'Tumori mediastinici', el: 'Μεσοθωρακικοί όγκοι' },
    'Mesoteliomas y otros tumores de la pared torácica': { en: 'Mesotheliomas and other chest wall tumors', fr: 'Mésothéliomes et autres tumeurs de la paroi thoracique', de: 'Mesotheliome und andere Tumoren der Brustwand', it: 'Mesoteliomi e altri tumori della parete toracica', el: 'Μεσοθηλιώματα και άλλοι όγκοι θωρακικού τοιχώματος' },
    'Neoplasias cervicales complejas': { en: 'Complex cervical neoplasms', fr: 'Néoplasies cervicales complexes', de: 'Komplexe Halsneoplasien', it: 'Neoplasie cervicali complesse', el: 'Σύνθετες τραχηλικές νεοπλασίες' },
    'Carcinoma de parótida y glándulas salivales': { en: 'Parotid and salivary gland carcinoma', fr: 'Carcinome de la parotide et des glandes salivaires', de: 'Karzinom der Ohrspeichel- und Speicheldrüsen', it: 'Carcinoma della parotide e delle ghiandole salivari', el: 'Καρκίνωμα παρωτίδας και σιελογόνων αδένων' },
    'Paragangliomas vasculares (glomus carotídeo)': { en: 'Vascular paragangliomas (carotid body tumor)', fr: 'Paragangliomes vasculaires (glomus carotidien)', de: 'Vaskuläre Paragangliome (Glomus caroticum)', it: 'Paragangliomi vascolari (glomo carotideo)', el: 'Αγγειακά παραγαγγλιώματα (καρωτιδικό σωμάτιο)' },
    'Neoplasias del oído medio e interno': { en: 'Middle and inner ear neoplasms', fr: "Néoplasies de l'oreille moyenne et interne", de: 'Neoplasien des Mittel- und Innenohrs', it: "Neoplasie dell'orecchio medio e interno", el: 'Νεοπλασίες μέσου και έσω ωτός' },
    'Planificación de tumores del SNC (glioblastoma multiforme, craneofaringioma, astrocitoma, meningiomas gigantes, otros)': { en: 'Planning of CNS tumors (glioblastoma multiforme, craniopharyngioma, astrocytoma, giant meningiomas, others)', fr: 'Planification des tumeurs du SNC (glioblastome multiforme, craniopharyngiome, astrocytome, méningiomes géants, autres)', de: 'Planung von ZNS-Tumoren (Glioblastoma multiforme, Kraniopharyngeom, Astrozytom, Riesenmeningeome, andere)', it: 'Pianificazione di tumori del SNC (glioblastoma multiforme, craniofaringioma, astrocitoma, meningiomi giganti, altri)', el: 'Σχεδιασμός όγκων ΚΝΣ (πολύμορφο γλοιοβλάστωμα, κρανιοφαρυγγίωμα, αστροκύττωμα, γιγαντιαία μηνιγγιώματα, άλλα)' },

    /* ── Noticias ── */
    'Apariciones en medios, premios y novedades de Eureqa3D.': {
      en: 'Media appearances, awards and updates from Eureqa3D.',
      fr: "Apparitions médiatiques, prix et nouveautés d'Eureqa3D.",
      de: 'Medienauftritte, Auszeichnungen und Neuigkeiten von Eureqa3D.',
      it: 'Apparizioni sui media, premi e novità di Eureqa3D.',
      el: 'Εμφανίσεις στα μέσα, βραβεία και νέα της Eureqa3D.' },

    /* ── Banner de cookies ── */
    'Cookies': { en: 'Cookies', fr: 'Cookies', de: 'Cookies', it: 'Cookie', el: 'Cookies' },
    'Tu privacidad': { en: 'Your privacy', fr: 'Votre vie privée', de: 'Ihre Privatsphäre', it: 'La tua privacy', el: 'Το απόρρητό σας' },
    'Usamos cookies analíticas para entender cómo se usa la web. No se activan hasta que las aceptas.': {
      en: 'We use analytics cookies to understand how the site is used. They stay off until you accept them.',
      fr: "Nous utilisons des cookies analytiques pour comprendre comment le site est utilisé. Ils restent désactivés tant que vous ne les acceptez pas.",
      de: 'Wir verwenden Analyse-Cookies, um zu verstehen, wie die Website genutzt wird. Sie bleiben deaktiviert, bis Sie sie akzeptieren.',
      it: "Utilizziamo cookie analitici per capire come viene utilizzato il sito. Restano disattivati finché non li accetti.",
      el: 'Χρησιμοποιούμε cookies ανάλυσης για να κατανοήσουμε πώς χρησιμοποιείται ο ιστότοπος. Παραμένουν ανενεργά έως ότου τα αποδεχτείτε.' },
    'Aceptar': { en: 'Accept', fr: 'Accepter', de: 'Akzeptieren', it: 'Accetta', el: 'Αποδοχή' },
    'Rechazar': { en: 'Reject', fr: 'Refuser', de: 'Ablehnen', it: 'Rifiuta', el: 'Απόρριψη' },

    /* ── Contacto ── */
    'Cuéntanos tu caso y te responderemos lo antes posible.': {
      en: "Tell us about your case and we'll get back to you as soon as possible.",
      fr: 'Parlez-nous de votre cas et nous vous répondrons dans les meilleurs délais.',
      de: 'Erzählen Sie uns von Ihrem Fall und wir antworten Ihnen so schnell wie möglich.',
      it: 'Raccontaci il tuo caso e ti risponderemo il prima possibile.',
      el: 'Πείτε μας την περίπτωσή σας και θα σας απαντήσουμε το συντομότερο δυνατό.' },
    'Nombre': { en: 'Name', fr: 'Nom', de: 'Name', it: 'Nome', el: 'Όνομα' },
    'Correo electrónico': { en: 'Email', fr: 'E-mail', de: 'E-Mail', it: 'Email', el: 'Email' },
    'Asunto': { en: 'Subject', fr: 'Objet', de: 'Betreff', it: 'Oggetto', el: 'Θέμα' },
    'Mensaje': { en: 'Message', fr: 'Message', de: 'Nachricht', it: 'Messaggio', el: 'Μήνυμα' },
    'Enviar mensaje': { en: 'Send message', fr: 'Envoyer le message', de: 'Nachricht senden', it: 'Invia messaggio', el: 'Αποστολή μηνύματος' },
    'Llámanos': { en: 'Call us', fr: 'Appelez-nous', de: 'Rufen Sie uns an', it: 'Chiamaci', el: 'Καλέστε μας' },
    /* ── Cadenas dinámicas (JS) ── */
    'Leer más →': { en: 'Read more →', fr: 'Lire la suite →', de: 'Mehr lesen →', it: 'Leggi di più →', el: 'Διαβάστε περισσότερα →' },
    'Próximamente publicaremos novedades aquí.': { en: "We'll publish updates here soon.", fr: 'Nous publierons bientôt des nouveautés ici.', de: 'Hier veröffentlichen wir bald Neuigkeiten.', it: 'Presto pubblicheremo novità qui.', el: 'Σύντομα θα δημοσιεύσουμε νέα εδώ.' },
    'No se pudieron cargar las noticias.': { en: 'The news could not be loaded.', fr: 'Impossible de charger les actualités.', de: 'Die Nachrichten konnten nicht geladen werden.', it: 'Impossibile caricare le notizie.', el: 'Δεν ήταν δυνατή η φόρτωση των νέων.' },
    '← Volver a noticias': { en: '← Back to news', fr: '← Retour aux actualités', de: '← Zurück zu den Nachrichten', it: '← Torna alle notizie', el: '← Επιστροφή στα νέα' },
    'Noticia no encontrada': { en: 'Article not found', fr: 'Article introuvable', de: 'Artikel nicht gefunden', it: 'Notizia non trovata', el: 'Το άρθρο δεν βρέθηκε' },
    'Cargando…': { en: 'Loading…', fr: 'Chargement…', de: 'Wird geladen…', it: 'Caricamento…', el: 'Φόρτωση…' },
    'Fuente:': { en: 'Source:', fr: 'Source :', de: 'Quelle:', it: 'Fonte:', el: 'Πηγή:' },
    '¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.': { en: 'Thank you! We have received your message and will reply soon.', fr: 'Merci ! Nous avons bien reçu votre message et vous répondrons bientôt.', de: 'Vielen Dank! Wir haben Ihre Nachricht erhalten und melden uns bald.', it: 'Grazie! Abbiamo ricevuto il tuo messaggio e ti risponderemo presto.', el: 'Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα απαντήσουμε σύντομα.' },
    'No se pudo enviar': { en: 'Could not send', fr: "Échec de l'envoi", de: 'Konnte nicht gesendet werden', it: 'Impossibile inviare', el: 'Δεν ήταν δυνατή η αποστολή' },

    /* ── Visor 3D propio (Slicer) ── */
    'Visor 3D': { en: '3D Viewer', fr: 'Visionneuse 3D', de: '3D-Viewer', it: 'Visore 3D', el: 'Πρόγραμμα προβολής 3D' },
    '<span class="play-ic">▶</span><span class="play-tx">Probar el visor</span>': {
      en: '<span class="play-ic">▶</span><span class="play-tx">Try the viewer</span>',
      fr: '<span class="play-ic">▶</span><span class="play-tx">Essayer la visionneuse</span>',
      de: '<span class="play-ic">▶</span><span class="play-tx">Viewer testen</span>',
      it: '<span class="play-ic">▶</span><span class="play-tx">Prova il visore</span>',
      el: '<span class="play-ic">▶</span><span class="play-tx">Δοκιμάστε το πρόγραμμα προβολής</span>' },
    'Lo nuevo · Visor digital 3D': { en: 'New · Digital 3D viewer', fr: 'Nouveau · Visionneuse 3D', de: 'Neu · Digitaler 3D-Viewer', it: 'Novità · Visore digitale 3D', el: 'Νέο · Ψηφιακό πρόγραμμα προβολής 3D' },
    'Herramienta de apoyo a la visualización de modelos anatómicos 3D digitales. No es un producto sanitario certificado para la visualización de estudios radiológicos y no sustituye a un informe radiológico. No usar con fines diagnósticos.': {
      en: 'A support tool for viewing digital 3D anatomical models. It is not a certified medical device for viewing radiological studies and does not replace a radiological report. Not for diagnostic use.',
      fr: "Outil d'aide à la visualisation de modèles anatomiques 3D numériques. Ce n'est pas un dispositif médical certifié pour la visualisation d'études radiologiques et il ne remplace pas un compte rendu radiologique. À ne pas utiliser à des fins diagnostiques.",
      de: 'Hilfsmittel zur Visualisierung digitaler 3D-Anatomiemodelle. Es handelt sich nicht um ein zertifiziertes Medizinprodukt zur Betrachtung radiologischer Studien und ersetzt keinen radiologischen Befund. Nicht für diagnostische Zwecke verwenden.',
      it: 'Strumento di supporto alla visualizzazione di modelli anatomici 3D digitali. Non è un dispositivo medico certificato per la visualizzazione di studi radiologici e non sostituisce un referto radiologico. Da non utilizzare a scopo diagnostico.',
      el: 'Εργαλείο υποστήριξης για την οπτικοποίηση ψηφιακών ανατομικών μοντέλων 3D. Δεν αποτελεί πιστοποιημένο ιατροτεχνολογικό προϊόν για την προβολή ακτινολογικών μελετών και δεν αντικαθιστά ακτινολογική έκθεση. Να μη χρησιμοποιείται για διαγνωστικούς σκοπούς.' },
    'Explora la anatomía del paciente en 3D, desde el navegador': {
      en: "Explore the patient's anatomy in 3D, right from the browser",
      fr: "Explorez l'anatomie du patient en 3D, directement depuis le navigateur",
      de: 'Erkunden Sie die Anatomie des Patienten in 3D – direkt im Browser',
      it: "Esplora l'anatomia del paziente in 3D, direttamente dal browser",
      el: 'Εξερευνήστε την ανατομία του ασθενούς σε 3D, απευθείας από τον browser' },
    'Sin instalar nada: secciones, transparencias y la posibilidad de mostrar u ocultar cada estructura. El visor propio de Eureqa3D que lleva la planificación quirúrgica a otro nivel.': {
      en: "With nothing to install: sections, transparency and the ability to show or hide every structure. Eureqa3D's own viewer that takes surgical planning to another level.",
      fr: "Sans rien installer : coupes, transparences et possibilité d'afficher ou de masquer chaque structure. La visionneuse propre à Eureqa3D qui élève la planification chirurgicale à un autre niveau.",
      de: 'Ohne Installation: Schnitte, Transparenzen und die Möglichkeit, jede Struktur ein- oder auszublenden. Der eigene Viewer von Eureqa3D, der die chirurgische Planung auf ein neues Niveau hebt.',
      it: 'Senza installare nulla: sezioni, trasparenze e la possibilità di mostrare o nascondere ogni struttura. Il visore proprietario di Eureqa3D che porta la pianificazione chirurgica a un altro livello.',
      el: 'Χωρίς καμία εγκατάσταση: τομές, διαφάνειες και δυνατότητα εμφάνισης ή απόκρυψης κάθε δομής. Το ιδιόκτητο πρόγραμμα προβολής της Eureqa3D που ανεβάζει τον χειρουργικό σχεδιασμό σε άλλο επίπεδο.' },
    'Demo en vivo': { en: 'Live demo', fr: 'Démo en direct', de: 'Live-Demo', it: 'Demo dal vivo', el: 'Ζωντανή επίδειξη' },
    'Pruébalo ahora mismo': { en: 'Try it right now', fr: 'Essayez-le maintenant', de: 'Jetzt ausprobieren', it: 'Provalo subito', el: 'Δοκιμάστε το τώρα' },
    'Carga un modelo real, gíralo, aplica cortes y ajusta la transparencia. Funciona en cualquier navegador y dispositivo.': {
      en: 'Load a real model, rotate it, apply cuts and adjust transparency. It works in any browser and device.',
      fr: 'Chargez un modèle réel, faites-le pivoter, appliquez des coupes et ajustez la transparence. Fonctionne sur tout navigateur et appareil.',
      de: 'Laden Sie ein echtes Modell, drehen Sie es, wenden Sie Schnitte an und passen Sie die Transparenz an. Funktioniert in jedem Browser und auf jedem Gerät.',
      it: 'Carica un modello reale, ruotalo, applica tagli e regola la trasparenza. Funziona su qualsiasi browser e dispositivo.',
      el: 'Φορτώστε ένα πραγματικό μοντέλο, περιστρέψτε το, εφαρμόστε τομές και ρυθμίστε τη διαφάνεια. Λειτουργεί σε κάθε browser και συσκευή.' },
    'Apoyo a la visualización y la planificación. No es producto sanitario certificado ni debe usarse con fines diagnósticos.': {
      en: 'Support for visualization and planning. It is not a certified medical device and must not be used for diagnostic purposes.',
      fr: "Aide à la visualisation et à la planification. Ce n'est pas un dispositif médical certifié et ne doit pas être utilisé à des fins diagnostiques.",
      de: 'Unterstützung bei Visualisierung und Planung. Es ist kein zertifiziertes Medizinprodukt und darf nicht zu diagnostischen Zwecken verwendet werden.',
      it: 'Supporto alla visualizzazione e alla pianificazione. Non è un dispositivo medico certificato e non deve essere utilizzato a scopo diagnostico.',
      el: 'Υποστήριξη οπτικοποίησης και σχεδιασμού. Δεν είναι πιστοποιημένο ιατροτεχνολογικό προϊόν και δεν πρέπει να χρησιμοποιείται για διαγνωστικούς σκοπούς.' },
    'Qué permite': { en: 'What it offers', fr: 'Ce qu\'il permet', de: 'Was es ermöglicht', it: 'Cosa permette', el: 'Τι προσφέρει' },
    'Las herramientas que pedían los cirujanos': { en: 'The tools surgeons were asking for', fr: 'Les outils que réclamaient les chirurgiens', de: 'Die Werkzeuge, die Chirurgen gefordert haben', it: 'Gli strumenti che i chirurghi chiedevano', el: 'Τα εργαλεία που ζητούσαν οι χειρουργοί' },
    'Cortes y secciones': { en: 'Cuts and sections', fr: 'Coupes et sections', de: 'Schnitte und Schnittebenen', it: 'Tagli e sezioni', el: 'Τομές και διατομές' },
    'Secciona el modelo en los planos axial, sagital y coronal para ver el interior.': {
      en: 'Section the model in the axial, sagittal and coronal planes to see inside.',
      fr: "Sectionnez le modèle dans les plans axial, sagittal et coronal pour voir l'intérieur.",
      de: 'Schneiden Sie das Modell in axialer, sagittaler und koronaler Ebene, um das Innere zu sehen.',
      it: "Seziona il modello nei piani assiale, sagittale e coronale per vedere l'interno.",
      el: 'Τμηματοποιήστε το μοντέλο στα αξονικά, οβελιαία και στεφανιαία επίπεδα για να δείτε το εσωτερικό.' },
    'Enlace seguro con caducidad': { en: 'Secure link with expiry', fr: 'Lien sécurisé avec expiration', de: 'Sicherer Link mit Ablauf', it: 'Link sicuro con scadenza', el: 'Ασφαλής σύνδεσμος με λήξη' },
    'Comparte cada caso con un enlace privado que caduca a los 30 días (RGPD).': {
      en: 'Share each case with a private link that expires after 30 days (GDPR).',
      fr: 'Partagez chaque cas avec un lien privé qui expire au bout de 30 jours (RGPD).',
      de: 'Teilen Sie jeden Fall über einen privaten Link, der nach 30 Tagen abläuft (DSGVO).',
      it: 'Condividi ogni caso con un link privato che scade dopo 30 giorni (GDPR).',
      el: 'Μοιραστείτε κάθε περίπτωση με έναν ιδιωτικό σύνδεσμο που λήγει μετά από 30 ημέρες (GDPR).' },
    'Cómo funciona': { en: 'How it works', fr: 'Comment ça marche', de: 'So funktioniert es', it: 'Come funziona', el: 'Πώς λειτουργεί' },
    'Del TAC al visor, en cuatro pasos': { en: 'From CT scan to viewer, in four steps', fr: 'Du scanner à la visionneuse, en quatre étapes', de: 'Vom CT zum Viewer in vier Schritten', it: 'Dalla TAC al visore, in quattro passaggi', el: 'Από την αξονική στο πρόγραμμα προβολής, σε τέσσερα βήματα' },
    'Subimos el caso': { en: 'We upload the case', fr: 'Nous chargeons le cas', de: 'Wir laden den Fall hoch', it: 'Carichiamo il caso', el: 'Ανεβάζουμε την περίπτωση' },
    'A partir del TAC o la RMN del paciente generamos el modelo 3D, con apoyo de inteligencia artificial en la segmentación.': {
      en: "From the patient's CT or MRI we generate the 3D model, with artificial intelligence support in the segmentation.",
      fr: "À partir du scanner ou de l'IRM du patient, nous générons le modèle 3D, avec l'aide de l'intelligence artificielle pour la segmentation.",
      de: 'Aus dem CT oder MRT des Patienten erstellen wir das 3D-Modell, unterstützt durch künstliche Intelligenz bei der Segmentierung.',
      it: "Dalla TAC o dalla RMN del paziente generiamo il modello 3D, con il supporto dell'intelligenza artificiale nella segmentazione.",
      el: 'Από την αξονική ή τη μαγνητική του ασθενούς δημιουργούμε το τρισδιάστατο μοντέλο, με υποστήριξη τεχνητής νοημοσύνης στην κατάτμηση.' },
    'Enviamos un enlace seguro': { en: 'We send a secure link', fr: 'Nous envoyons un lien sécurisé', de: 'Wir senden einen sicheren Link', it: 'Inviamo un link sicuro', el: 'Στέλνουμε έναν ασφαλή σύνδεσμο' },
    'El especialista recibe un enlace privado, sin instalar ningún programa.': {
      en: 'The specialist receives a private link, without installing any software.',
      fr: 'Le spécialiste reçoit un lien privé, sans installer aucun logiciel.',
      de: 'Der Facharzt erhält einen privaten Link, ohne Software zu installieren.',
      it: 'Lo specialista riceve un link privato, senza installare alcun programma.',
      el: 'Ο ειδικός λαμβάνει έναν ιδιωτικό σύνδεσμο, χωρίς να εγκαταστήσει κανένα πρόγραμμα.' },
    'Explora en cualquier dispositivo': { en: 'Explore on any device', fr: 'Explorez sur tout appareil', de: 'Auf jedem Gerät erkunden', it: 'Esplora su qualsiasi dispositivo', el: 'Εξερευνήστε σε οποιαδήποτε συσκευή' },
    'Ordenador, tablet o móvil: cortes, transparencias y estructuras al instante.': {
      en: 'Computer, tablet or phone: cuts, transparency and structures instantly.',
      fr: 'Ordinateur, tablette ou mobile : coupes, transparences et structures instantanément.',
      de: 'Computer, Tablet oder Smartphone: Schnitte, Transparenzen und Strukturen sofort.',
      it: "Computer, tablet o cellulare: tagli, trasparenze e strutture all'istante.",
      el: 'Υπολογιστής, tablet ή κινητό: τομές, διαφάνειες και δομές άμεσα.' },
    'Caduca automáticamente': { en: 'It expires automatically', fr: 'Il expire automatiquement', de: 'Läuft automatisch ab', it: 'Scade automaticamente', el: 'Λήγει αυτόματα' },
    'El enlace expira a los 30 días para proteger los datos del paciente (RGPD).': {
      en: "The link expires after 30 days to protect the patient's data (GDPR).",
      fr: 'Le lien expire au bout de 30 jours pour protéger les données du patient (RGPD).',
      de: 'Der Link läuft nach 30 Tagen ab, um die Patientendaten zu schützen (DSGVO).',
      it: 'Il link scade dopo 30 giorni per proteggere i dati del paziente (GDPR).',
      el: 'Ο σύνδεσμος λήγει μετά από 30 ημέρες για την προστασία των δεδομένων του ασθενούς (GDPR).' },
    '¿Quieres verlo con un caso real?': { en: 'Want to see it with a real case?', fr: 'Vous voulez le voir avec un cas réel ?', de: 'Möchten Sie es mit einem echten Fall sehen?', it: 'Vuoi vederlo con un caso reale?', el: 'Θέλετε να το δείτε με μια πραγματική περίπτωση;' },
    'Te preparamos una demo con un caso real y te enviamos el enlace para que lo explores tú mismo.': {
      en: "We'll prepare a demo with a real case and send you the link to explore it yourself.",
      fr: "Nous préparons une démo avec un cas réel et nous vous envoyons le lien pour l'explorer vous-même.",
      de: 'Wir bereiten eine Demo mit einem echten Fall vor und senden Ihnen den Link, um sie selbst zu erkunden.',
      it: 'Prepariamo una demo con un caso reale e ti inviamo il link per esplorarlo tu stesso.',
      el: 'Ετοιμάζουμε μια επίδειξη με μια πραγματική περίπτωση και σας στέλνουμε τον σύνδεσμο για να την εξερευνήσετε μόνοι σας.' },
    'El gran salto': { en: 'The big leap', fr: 'Le grand saut', de: 'Der große Sprung', it: 'Il grande salto', el: 'Το μεγάλο άλμα' },
    'El visor 3D que explora el interior del paciente': {
      en: 'The 3D viewer that explores inside the patient',
      fr: "La visionneuse 3D qui explore l'intérieur du patient",
      de: 'Der 3D-Viewer, der ins Innere des Patienten blickt',
      it: "Il visore 3D che esplora l'interno del paziente",
      el: 'Το πρόγραμμα προβολής 3D που εξερευνά το εσωτερικό του ασθενούς' },
    'Secciones, transparencias y estructuras on/off en el navegador, sin instalar nada. Nuestra tecnología propia para planificar como nunca antes.': {
      en: 'Sections, transparency and on/off structures in the browser, with nothing to install. Our own technology to plan like never before.',
      fr: 'Coupes, transparences et structures activables/désactivables dans le navigateur, sans rien installer. Notre technologie propre pour planifier comme jamais.',
      de: 'Schnitte, Transparenzen und ein-/ausblendbare Strukturen im Browser, ohne Installation. Unsere eigene Technologie, um wie nie zuvor zu planen.',
      it: 'Sezioni, trasparenze e strutture on/off nel browser, senza installare nulla. La nostra tecnologia proprietaria per pianificare come mai prima.',
      el: 'Τομές, διαφάνειες και δομές on/off στον browser, χωρίς εγκατάσταση. Η δική μας τεχνολογία για σχεδιασμό όπως ποτέ πριν.' },
    'Probar el visor 3D': { en: 'Try the 3D viewer', fr: 'Essayer la visionneuse 3D', de: 'Den 3D-Viewer testen', it: 'Prova il visore 3D', el: 'Δοκιμάστε το πρόγραμμα προβολής 3D' },
    'Visor 3D — Eureqa3D': { en: '3D Viewer — Eureqa3D', fr: 'Visionneuse 3D — Eureqa3D', de: '3D-Viewer — Eureqa3D', it: 'Visore 3D — Eureqa3D', el: 'Πρόγραμμα προβολής 3D — Eureqa3D' },

    /* ── Visor 3D (página fusionada con Modelos 3D) ── */
    'Lo nuevo · EureqaVisor3D': { en: 'New · EureqaVisor3D', fr: 'Nouveau · EureqaVisor3D', de: 'Neu · EureqaVisor3D', it: 'Novità · EureqaVisor3D', el: 'Νέο · EureqaVisor3D' },
    'El visor digital de Eureqa3D, directamente en el navegador': {
      en: "Eureqa3D's digital viewer, right in your browser",
      fr: "La visionneuse numérique d'Eureqa3D, directement dans le navigateur",
      de: 'Der digitale Viewer von Eureqa3D, direkt im Browser',
      it: 'Il visore digitale di Eureqa3D, direttamente nel browser',
      el: 'Το ψηφιακό πρόγραμμα προβολής της Eureqa3D, απευθείας στον browser' },
    'Explora la anatomía del paciente en 3D sin instalar nada: cortes, transparencias y la posibilidad de mostrar u ocultar cada estructura, en cualquier ordenador, tablet o móvil.': {
      en: "Explore the patient's anatomy in 3D without installing anything: sections, transparency and the ability to show or hide every structure, on any computer, tablet or phone.",
      fr: "Explorez l'anatomie du patient en 3D sans rien installer : coupes, transparences et possibilité d'afficher ou de masquer chaque structure, sur tout ordinateur, tablette ou mobile.",
      de: 'Erkunden Sie die Anatomie des Patienten in 3D, ohne etwas zu installieren: Schnitte, Transparenzen und die Möglichkeit, jede Struktur ein- oder auszublenden – auf jedem Computer, Tablet oder Smartphone.',
      it: "Esplora l'anatomia del paziente in 3D senza installare nulla: sezioni, trasparenze e possibilità di mostrare o nascondere ogni struttura, su qualsiasi computer, tablet o cellulare.",
      el: 'Εξερευνήστε την ανατομία του ασθενούς σε 3D χωρίς καμία εγκατάσταση: τομές, διαφάνειες και δυνατότητα εμφάνισης ή απόκρυψης κάθε δομής, σε οποιονδήποτε υπολογιστή, tablet ή κινητό.' },
    'Para el especialista': { en: 'For the specialist', fr: 'Pour le spécialiste', de: 'Für den Facharzt', it: 'Per lo specialista', el: 'Για τον ειδικό' },
    'Pensado para el quirófano, no para el laboratorio': {
      en: 'Built for the operating room, not the laboratory',
      fr: 'Conçu pour le bloc opératoire, pas pour le laboratoire',
      de: 'Für den Operationssaal gemacht, nicht für das Labor',
      it: 'Pensato per la sala operatoria, non per il laboratorio',
      el: 'Σχεδιασμένο για το χειρουργείο, όχι για το εργαστήριο' },
    'Rota el modelo, aplica cortes en los planos axial, sagital y coronal, ajusta la transparencia de cada tejido y aísla la estructura que te interesa: el vaso, el tumor, el hueso. Todo con el ratón o con el dedo, sin curva de aprendizaje y sin instalar software especializado en tu equipo.': {
      en: 'Rotate the model, apply cuts in the axial, sagittal and coronal planes, adjust the transparency of each tissue and isolate the structure you need: the vessel, the tumor, the bone. All with your mouse or your finger, with no learning curve and no specialized software to install on your computer.',
      fr: "Faites pivoter le modèle, appliquez des coupes dans les plans axial, sagittal et coronal, ajustez la transparence de chaque tissu et isolez la structure qui vous intéresse : le vaisseau, la tumeur, l'os. Le tout avec la souris ou le doigt, sans courbe d'apprentissage et sans installer de logiciel spécialisé sur votre équipement.",
      de: 'Drehen Sie das Modell, wenden Sie Schnitte in axialer, sagittaler und koronaler Ebene an, passen Sie die Transparenz jedes Gewebes an und isolieren Sie die gewünschte Struktur: das Gefäß, den Tumor, den Knochen. Alles mit Maus oder Finger, ohne Lernkurve und ohne spezialisierte Software auf Ihrem Rechner zu installieren.',
      it: "Ruota il modello, applica tagli nei piani assiale, sagittale e coronale, regola la trasparenza di ogni tessuto e isola la struttura che ti interessa: il vaso, il tumore, l'osso. Tutto con il mouse o con il dito, senza curva di apprendimento e senza installare software specializzato sul tuo computer.",
      el: 'Περιστρέψτε το μοντέλο, εφαρμόστε τομές στα αξονικά, οβελιαία και στεφανιαία επίπεδα, ρυθμίστε τη διαφάνεια κάθε ιστού και απομονώστε τη δομή που σας ενδιαφέρει: το αγγείο, τον όγκο, το οστό. Όλα με το ποντίκι ή το δάχτυλο, χωρίς καμπύλη εκμάθησης και χωρίς εγκατάσταση εξειδικευμένου λογισμικού στον υπολογιστή σας.' },
    'Por dentro': { en: 'Under the hood', fr: "Dans les coulisses", de: 'Dahinter', it: 'Dietro le quinte', el: 'Από μέσα' },
    'Tecnología sin fricción': { en: 'Friction-free technology', fr: 'Une technologie sans friction', de: 'Reibungslose Technologie', it: 'Tecnologia senza attriti', el: 'Τεχνολογία χωρίς τριβές' },
    'El modelo se genera a partir del TC o la RMN del paciente mediante el Método Eureqa, con segmentación asistida por inteligencia artificial. Se sirve por navegador (WebGL, sin plugins ni descargas) a través de un enlace privado con caducidad de 30 días, alojado en infraestructura propia de Eureqa3D — ideal para compartir un caso con el resto del equipo quirúrgico sin mover archivos ni instalar nada.': {
      en: "The model is generated from the patient's CT or MRI using the Eureqa Method, with AI-assisted segmentation. It is served through the browser (WebGL, no plugins or downloads) via a private link that expires after 30 days, hosted on Eureqa3D's own infrastructure — ideal for sharing a case with the rest of the surgical team without moving files or installing anything.",
      fr: "Le modèle est généré à partir du scanner ou de l'IRM du patient grâce à la Méthode Eureqa, avec une segmentation assistée par intelligence artificielle. Il est servi par navigateur (WebGL, sans plugin ni téléchargement) via un lien privé qui expire au bout de 30 jours, hébergé sur l'infrastructure propre d'Eureqa3D — idéal pour partager un cas avec le reste de l'équipe chirurgicale sans déplacer de fichiers ni rien installer.",
      de: 'Das Modell wird aus dem CT oder MRT des Patienten mittels der Eureqa-Methode erstellt, mit KI-unterstützter Segmentierung. Es wird über den Browser bereitgestellt (WebGL, ohne Plugins oder Downloads) über einen privaten Link, der nach 30 Tagen abläuft, gehostet auf eigener Infrastruktur von Eureqa3D — ideal, um einen Fall mit dem übrigen OP-Team zu teilen, ohne Dateien zu verschieben oder etwas zu installieren.',
      it: "Il modello viene generato a partire dalla TAC o dalla RM del paziente tramite il Metodo Eureqa, con segmentazione assistita dall'intelligenza artificiale. Viene servito tramite browser (WebGL, senza plugin né download) attraverso un link privato che scade dopo 30 giorni, ospitato su infrastruttura proprietaria di Eureqa3D — ideale per condividere un caso con il resto dell'équipe chirurgica senza spostare file né installare nulla.",
      el: 'Το μοντέλο δημιουργείται από την αξονική ή τη μαγνητική του ασθενούς μέσω της Μεθόδου Eureqa, με κατάτμηση υποβοηθούμενη από τεχνητή νοημοσύνη. Παρέχεται μέσω browser (WebGL, χωρίς plugins ή λήψεις) μέσω ενός ιδιωτικού συνδέσμου που λήγει μετά από 30 ημέρες, φιλοξενούμενο σε δική της υποδομή της Eureqa3D — ιδανικό για την κοινή χρήση μιας περίπτωσης με την υπόλοιπη χειρουργική ομάδα χωρίς μετακίνηση αρχείων ή εγκατάσταση.' },
    'Funcionalidades principales': { en: 'Key features', fr: 'Fonctionnalités principales', de: 'Hauptfunktionen', it: 'Funzionalità principali', el: 'Βασικές λειτουργίες' },
    'Ver u ocultar estructuras': { en: 'Show or hide structures', fr: 'Afficher ou masquer des structures', de: 'Strukturen ein- oder ausblenden', it: 'Mostra o nascondi strutture', el: 'Εμφάνιση ή απόκρυψη δομών' },
    'Segmentación con IA': { en: 'AI-assisted segmentation', fr: 'Segmentation par IA', de: 'KI-gestützte Segmentierung', it: 'Segmentazione con IA', el: 'Κατάτμηση με ΤΝ' },
    'El Método Eureqa aplica inteligencia artificial en la segmentación de cada caso.': {
      en: 'The Eureqa Method applies artificial intelligence to the segmentation of each case.',
      fr: "La Méthode Eureqa applique l'intelligence artificielle à la segmentation de chaque cas.",
      de: 'Die Eureqa-Methode setzt künstliche Intelligenz bei der Segmentierung jedes Falls ein.',
      it: "Il Metodo Eureqa applica l'intelligenza artificiale nella segmentazione di ogni caso.",
      el: 'Η Μέθοδος Eureqa εφαρμόζει τεχνητή νοημοσύνη στην κατάτμηση κάθε περίπτωσης.' },
    'Cualquier dispositivo': { en: 'Any device', fr: "Tout appareil", de: 'Jedes Gerät', it: 'Qualsiasi dispositivo', el: 'Οποιαδήποτε συσκευή' },
    'Ordenador, tablet o móvil: funciona en el navegador, sin instalar nada.': {
      en: 'Computer, tablet or phone: it works in the browser, with nothing to install.',
      fr: 'Ordinateur, tablette ou mobile : fonctionne dans le navigateur, sans rien installer.',
      de: 'Computer, Tablet oder Smartphone: funktioniert im Browser, ohne Installation.',
      it: 'Computer, tablet o cellulare: funziona nel browser, senza installare nulla.',
      el: 'Υπολογιστής, tablet ή κινητό: λειτουργεί στον browser, χωρίς εγκατάσταση.' },
    'Trazabilidad completa y confidencialidad del paciente en cada caso.': {
      en: "Full traceability and patient confidentiality in every case.",
      fr: 'Traçabilité complète et confidentialité du patient pour chaque cas.',
      de: 'Vollständige Rückverfolgbarkeit und Vertraulichkeit des Patienten bei jedem Fall.',
      it: 'Tracciabilità completa e riservatezza del paziente in ogni caso.',
      el: 'Πλήρης ιχνηλασιμότητα και εμπιστευτικότητα ασθενούς σε κάθε περίπτωση.' },
    'Casos reales': { en: 'Real cases', fr: 'Cas réels', de: 'Echte Fälle', it: 'Casi reali', el: 'Πραγματικές περιπτώσεις' },
    'Ejemplos de modelos ya trabajados en el visor': {
      en: 'Examples of models already processed in the viewer',
      fr: 'Exemples de modèles déjà traités dans la visionneuse',
      de: 'Beispiele bereits bearbeiteter Modelle im Viewer',
      it: 'Esempi di modelli già lavorati nel visore',
      el: 'Παραδείγματα μοντέλων που έχουν ήδη επεξεργαστεί στο πρόγραμμα προβολής' },
    'Cada uno de estos casos es un modelo interactivo real, del mismo tipo que verías tú en el EureqaVisor3D.': {
      en: "Each of these cases is a real interactive model, the same kind you'd see in EureqaVisor3D.",
      fr: "Chacun de ces cas est un modèle interactif réel, du même type que celui que vous verriez dans EureqaVisor3D.",
      de: 'Jeder dieser Fälle ist ein echtes interaktives Modell, wie Sie es auch in EureqaVisor3D sehen würden.',
      it: 'Ognuno di questi casi è un modello interattivo reale, dello stesso tipo che vedresti nell\'EureqaVisor3D.',
      el: 'Κάθε μία από αυτές τις περιπτώσεις είναι ένα πραγματικό διαδραστικό μοντέλο, ίδιου τύπου με αυτό που θα βλέπατε στο EureqaVisor3D.' },

    /* ── Chat de captación ── */
    'Asistente de Eureqa3D': { en: 'Eureqa3D Assistant', fr: 'Assistant Eureqa3D', de: 'Eureqa3D-Assistent', it: 'Assistente Eureqa3D', el: 'Βοηθός Eureqa3D' },
    'Normalmente responde en minutos': { en: 'Usually replies within minutes', fr: 'Répond généralement en quelques minutes', de: 'Antwortet meist innerhalb von Minuten', it: 'Di solito risponde in pochi minuti', el: 'Συνήθως απαντά μέσα σε λεπτά' },
    'Escribe tu respuesta…': { en: 'Type your answer…', fr: 'Écrivez votre réponse…', de: 'Antwort eingeben…', it: 'Scrivi la tua risposta…', el: 'Γράψτε την απάντησή σας…' },
    'Abrir chat': { en: 'Open chat', fr: 'Ouvrir le chat', de: 'Chat öffnen', it: 'Apri chat', el: 'Άνοιγμα συνομιλίας' },
    'Cerrar chat': { en: 'Close chat', fr: 'Fermer le chat', de: 'Chat schließen', it: 'Chiudi chat', el: 'Κλείσιμο συνομιλίας' },
    '👋 ¡Hola! Soy el asistente de Eureqa3D. Te hago un par de preguntas y te contactamos.': {
      en: "👋 Hi! I'm the Eureqa3D assistant. I'll ask you a couple of questions and we'll get in touch.",
      fr: "👋 Bonjour ! Je suis l'assistant d'Eureqa3D. Je vous pose deux ou trois questions et nous vous recontactons.",
      de: '👋 Hallo! Ich bin der Eureqa3D-Assistent. Ich stelle Ihnen ein paar Fragen und wir melden uns bei Ihnen.',
      it: "👋 Ciao! Sono l'assistente di Eureqa3D. Ti faccio un paio di domande e ti ricontattiamo.",
      el: '👋 Γεια σας! Είμαι ο βοηθός της Eureqa3D. Θα σας κάνω μερικές ερωτήσεις και θα επικοινωνήσουμε μαζί σας.' },
    'Para empezar, ¿cómo te llamas?': { en: "To start, what's your name?", fr: 'Pour commencer, comment vous appelez-vous ?', de: 'Zum Anfang: Wie heißen Sie?', it: 'Per iniziare, come ti chiami?', el: 'Αρχικά, πώς σας λένε;' },
    'Encantado, {name}. ¿De qué empresa, hospital o centro nos escribes?': {
      en: 'Nice to meet you, {name}. Which company, hospital or centre are you writing from?',
      fr: 'Enchanté, {name}. De quelle entreprise, hôpital ou centre nous écrivez-vous ?',
      de: 'Freut mich, {name}. Von welchem Unternehmen, Krankenhaus oder Zentrum schreiben Sie uns?',
      it: 'Piacere, {name}. Da quale azienda, ospedale o centro ci scrivi?',
      el: 'Χαίρω πολύ, {name}. Από ποια εταιρεία, νοσοκομείο ή κέντρο μας γράφετε;' },
    '¿Y un email donde podamos contactarte?': { en: 'And an email where we can reach you?', fr: 'Et un email où nous pouvons vous joindre ?', de: 'Und eine E-Mail, unter der wir Sie erreichen können?', it: "E un'email dove possiamo contattarti?", el: 'Και ένα email για να επικοινωνήσουμε μαζί σας;' },
    'Por último, cuéntanos brevemente qué necesitas.': { en: 'Finally, tell us briefly what you need.', fr: 'Enfin, dites-nous brièvement ce dont vous avez besoin.', de: 'Zum Schluss: Sagen Sie uns kurz, was Sie brauchen.', it: 'Infine, raccontaci brevemente di cosa hai bisogno.', el: 'Τέλος, πείτε μας σύντομα τι χρειάζεστε.' },
    '¡Gracias, {name}! 🙌 Hemos recibido tu solicitud y te contactaremos muy pronto.': {
      en: "Thank you, {name}! 🙌 We've received your request and will contact you very soon.",
      fr: 'Merci, {name} ! 🙌 Nous avons reçu votre demande et vous contacterons très bientôt.',
      de: 'Vielen Dank, {name}! 🙌 Wir haben Ihre Anfrage erhalten und melden uns sehr bald.',
      it: 'Grazie, {name}! 🙌 Abbiamo ricevuto la tua richiesta e ti contatteremo molto presto.',
      el: 'Ευχαριστούμε, {name}! 🙌 Λάβαμε το αίτημά σας και θα επικοινωνήσουμε πολύ σύντομα.' },
    'Mmm, ese email no parece válido. ¿Puedes revisarlo?': {
      en: "Hmm, that email doesn't look valid. Could you check it?",
      fr: 'Hmm, cet email ne semble pas valide. Pouvez-vous le vérifier ?',
      de: 'Hmm, diese E-Mail sieht ungültig aus. Können Sie sie überprüfen?',
      it: "Mmm, quell'email non sembra valida. Puoi controllarla?",
      el: 'Χμμ, αυτό το email δεν φαίνεται έγκυρο. Μπορείτε να το ελέγξετε;' },
    'Ups, no hemos podido enviar tu solicitud. Inténtalo de nuevo en un momento.': {
      en: "Oops, we couldn't send your request. Please try again in a moment.",
      fr: "Oups, nous n'avons pas pu envoyer votre demande. Réessayez dans un instant.",
      de: 'Hoppla, wir konnten Ihre Anfrage nicht senden. Bitte versuchen Sie es gleich noch einmal.',
      it: 'Ops, non siamo riusciti a inviare la tua richiesta. Riprova tra un momento.',
      el: 'Ωχ, δεν μπορέσαμε να στείλουμε το αίτημά σας. Δοκιμάστε ξανά σε λίγο.' },

    /* ── aria-labels ── */
    'Menú': { en: 'Menu', fr: 'Menu', de: 'Menü', it: 'Menu', el: 'Μενού' },
    'Anterior': { en: 'Previous', fr: 'Précédent', de: 'Zurück', it: 'Precedente', el: 'Προηγούμενο' },
    'Siguiente': { en: 'Next', fr: 'Suivant', de: 'Weiter', it: 'Successivo', el: 'Επόμενο' },
    'Simulación quirúrgica real sobre un modelo anatómico 3D de Eureqa3D': { en: 'Real surgical simulation on a 3D anatomical model by Eureqa3D', fr: "Simulation chirurgicale réelle sur un modèle anatomique 3D d'Eureqa3D", de: 'Reale chirurgische Simulation an einem 3D-Anatomiemodell von Eureqa3D', it: 'Simulazione chirurgica reale su un modello anatomico 3D di Eureqa3D', el: 'Πραγματική χειρουργική προσομοίωση σε ανατομικό μοντέλο 3D της Eureqa3D' },
    'Simulación quirúrgica sobre un modelo anatómico 3D flexible de Eureqa3D': { en: 'Surgical simulation on a flexible 3D anatomical model by Eureqa3D', fr: "Simulation chirurgicale sur un modèle anatomique 3D souple d'Eureqa3D", de: 'Chirurgische Simulation an einem flexiblen 3D-Anatomiemodell von Eureqa3D', it: 'Simulazione chirurgica su un modello anatomico 3D flessibile di Eureqa3D', el: 'Χειρουργική προσομοίωση σε εύκαμπτο ανατομικό μοντέλο 3D της Eureqa3D' },

    /* ── Modelos 3D ── */
    'Modelos 3D': { en: '3D Models', fr: 'Modèles 3D', de: '3D-Modelle', it: 'Modelli 3D', el: '3D Μοντέλα' },
    'Innovación': { en: 'Innovation', fr: 'Innovation', de: 'Innovation', it: 'Innovazione', el: 'Καινοτομία' },
    'Innovación · Modelos digitales': { en: 'Innovation · Digital models', fr: 'Innovation · Modèles numériques', de: 'Innovation · Digitale Modelle', it: 'Innovazione · Modelli digitali', el: 'Καινοτομία · Ψηφιακά μοντέλα' },
    'Modelos digitales 3D de tejidos blandos': { en: 'Digital 3D models of soft tissue', fr: 'Modèles numériques 3D de tissus mous', de: 'Digitale 3D-Modelle von Weichgewebe', it: 'Modelli digitali 3D di tessuti molli', el: 'Ψηφιακά τρισδιάστατα μοντέλα μαλακών ιστών' },
    'Reconstrucciones interactivas a partir de imagen médica real. Rota, amplía y explora cada modelo con sus anotaciones clínicas, directamente en el navegador.': {
      en: 'Interactive reconstructions from real medical imaging. Rotate, zoom and explore each model with its clinical annotations, right in your browser.',
      fr: "Des reconstructions interactives à partir d'imagerie médicale réelle. Tournez, zoomez et explorez chaque modèle avec ses annotations cliniques, directement dans le navigateur.",
      de: 'Interaktive Rekonstruktionen aus echter medizinischer Bildgebung. Drehen, zoomen und erkunden Sie jedes Modell mit seinen klinischen Anmerkungen – direkt im Browser.',
      it: 'Ricostruzioni interattive a partire da immagini mediche reali. Ruota, ingrandisci ed esplora ogni modello con le sue annotazioni cliniche, direttamente nel browser.',
      el: 'Διαδραστικές ανακατασκευές από πραγματική ιατρική απεικόνιση. Περιστρέψτε, μεγεθύνετε και εξερευνήστε κάθε μοντέλο με τις κλινικές του σημειώσεις, απευθείας στον browser.' },
    '<span class="play-ic">▶</span><span class="play-tx">Ver en 3D</span>': {
      en: '<span class="play-ic">▶</span><span class="play-tx">View in 3D</span>',
      fr: '<span class="play-ic">▶</span><span class="play-tx">Voir en 3D</span>',
      de: '<span class="play-ic">▶</span><span class="play-tx">In 3D ansehen</span>',
      it: '<span class="play-ic">▶</span><span class="play-tx">Vedi in 3D</span>',
      el: '<span class="play-ic">▶</span><span class="play-tx">Προβολή σε 3D</span>' },
    'Cirugía cardiaca': { en: 'Cardiac surgery', fr: 'Chirurgie cardiaque', de: 'Herzchirurgie', it: 'Chirurgia cardiaca', el: 'Καρδιοχειρουργική' },
    'Cirugía pancreática': { en: 'Pancreatic surgery', fr: 'Chirurgie pancréatique', de: 'Pankreaschirurgie', it: 'Chirurgia pancreatica', el: 'Παγκρεατική χειρουργική' },
    'Modelo anatómico': { en: 'Anatomical model', fr: 'Modèle anatomique', de: 'Anatomisches Modell', it: 'Modello anatomico', el: 'Ανατομικό μοντέλο' },
    'Pseudoaneurisma cardiaco · Modelo A': { en: 'Cardiac pseudoaneurysm · Model A', fr: 'Pseudo-anévrisme cardiaque · Modèle A', de: 'Kardiales Pseudoaneurysma · Modell A', it: 'Pseudoaneurisma cardiaco · Modello A', el: 'Καρδιακό ψευδοανεύρυσμα · Μοντέλο A' },
    'Pseudoaneurisma cardiaco · Modelo B': { en: 'Cardiac pseudoaneurysm · Model B', fr: 'Pseudo-anévrisme cardiaque · Modèle B', de: 'Kardiales Pseudoaneurysma · Modell B', it: 'Pseudoaneurisma cardiaco · Modello B', el: 'Καρδιακό ψευδοανεύρυσμα · Μοντέλο B' },
    'Modelo 3D de un pseudoaneurisma cardiaco sobre el miocardio para el estudio y la planificación quirúrgica. Variante A.': {
      en: '3D model of a cardiac pseudoaneurysm on the myocardium for study and surgical planning. Variant A.',
      fr: "Modèle 3D d'un pseudo-anévrisme cardiaque sur le myocarde pour l'étude et la planification chirurgicale. Variante A.",
      de: '3D-Modell eines kardialen Pseudoaneurysmas am Myokard für Studie und chirurgische Planung. Variante A.',
      it: 'Modello 3D di uno pseudoaneurisma cardiaco sul miocardio per lo studio e la pianificazione chirurgica. Variante A.',
      el: 'Τρισδιάστατο μοντέλο καρδιακού ψευδοανευρύσματος στο μυοκάρδιο για μελέτη και χειρουργικό σχεδιασμό. Παραλλαγή A.' },
    'Modelo 3D de un pseudoaneurisma cardiaco sobre el miocardio para el estudio y la planificación quirúrgica. Variante B.': {
      en: '3D model of a cardiac pseudoaneurysm on the myocardium for study and surgical planning. Variant B.',
      fr: "Modèle 3D d'un pseudo-anévrisme cardiaque sur le myocarde pour l'étude et la planification chirurgicale. Variante B.",
      de: '3D-Modell eines kardialen Pseudoaneurysmas am Myokard für Studie und chirurgische Planung. Variante B.',
      it: 'Modello 3D di uno pseudoaneurisma cardiaco sul miocardio per lo studio e la pianificazione chirurgica. Variante B.',
      el: 'Τρισδιάστατο μοντέλο καρδιακού ψευδοανευρύσματος στο μυοκάρδιο για μελέτη και χειρουργικό σχεδιασμό. Παραλλαγή B.' },
    'Páncreas y entorno vascular': { en: 'Pancreas and vascular environment', fr: 'Pancréas et environnement vasculaire', de: 'Pankreas und Gefäßumgebung', it: 'Pancreas e contesto vascolare', el: 'Πάγκρεας και αγγειακό περιβάλλον' },
    'Reconstrucción 3D de la región pancreática con su red vascular (vena porta, arterias y conductos) y anotaciones interactivas para el estudio del caso.': {
      en: '3D reconstruction of the pancreatic region with its vascular network (portal vein, arteries and ducts) and interactive annotations for case study.',
      fr: "Reconstruction 3D de la région pancréatique avec son réseau vasculaire (veine porte, artères et canaux) et des annotations interactives pour l'étude du cas.",
      de: '3D-Rekonstruktion der Pankreasregion mit ihrem Gefäßnetz (Pfortader, Arterien und Gänge) und interaktiven Anmerkungen zur Fallanalyse.',
      it: 'Ricostruzione 3D della regione pancreatica con la sua rete vascolare (vena porta, arterie e dotti) e annotazioni interattive per lo studio del caso.',
      el: 'Τρισδιάστατη ανακατασκευή της παγκρεατικής περιοχής με το αγγειακό της δίκτυο (πυλαία φλέβα, αρτηρίες και πόροι) και διαδραστικές σημειώσεις για τη μελέτη της περίπτωσης.' },
    'Cáncer de páncreas': { en: 'Pancreatic cancer', fr: 'Cancer du pancréas', de: 'Bauchspeicheldrüsenkrebs', it: 'Cancro del pancreas', el: 'Καρκίνος παγκρέατος' },
    'Modelo 3D de un tumor de páncreas y su relación con los principales ejes vasculares, útil para planificar el abordaje quirúrgico.': {
      en: '3D model of a pancreatic tumor and its relationship with the main vascular axes, useful for planning the surgical approach.',
      fr: "Modèle 3D d'une tumeur du pancréas et de sa relation avec les principaux axes vasculaires, utile pour planifier l'abord chirurgical.",
      de: '3D-Modell eines Pankreastumors und seiner Beziehung zu den wichtigsten Gefäßachsen, nützlich für die Planung des chirurgischen Zugangs.',
      it: 'Modello 3D di un tumore del pancreas e della sua relazione con i principali assi vascolari, utile per pianificare l\'approccio chirurgico.',
      el: 'Τρισδιάστατο μοντέλο ενός όγκου παγκρέατος και της σχέσης του με τους κύριους αγγειακούς άξονες, χρήσιμο για τον σχεδιασμό της χειρουργικής προσέγγισης.' },
    'Maxilofacial · ORL': { en: 'Maxillofacial · ENT', fr: 'Maxillo-facial · ORL', de: 'MKG · HNO', it: 'Maxillo-facciale · ORL', el: 'Γναθοπροσωπική · ΩΡΛ' },
    'Neoplasia de parótida izquierda': { en: 'Left parotid gland neoplasm', fr: 'Néoplasie de la parotide gauche', de: 'Neoplasie der linken Ohrspeicheldrüse', it: 'Neoplasia della parotide sinistra', el: 'Νεόπλασμα αριστερής παρωτίδας' },
    'Modelo 3D de una neoplasia de la glándula parótida izquierda para el estudio anatómico y la planificación quirúrgica. Caso solicitado por el Dr. Eladio Rejas.': {
      en: '3D model of a neoplasm of the left parotid gland for anatomical study and surgical planning. Case requested by Dr. Eladio Rejas.',
      fr: "Modèle 3D d'une néoplasie de la glande parotide gauche pour l'étude anatomique et la planification chirurgicale. Cas demandé par le Dr Eladio Rejas.",
      de: '3D-Modell einer Neoplasie der linken Ohrspeicheldrüse zur anatomischen Untersuchung und chirurgischen Planung. Fall angefordert von Dr. Eladio Rejas.',
      it: 'Modello 3D di una neoplasia della ghiandola parotide sinistra per lo studio anatomico e la pianificazione chirurgica. Caso richiesto dal Dr. Eladio Rejas.',
      el: 'Τρισδιάστατο μοντέλο νεοπλάσματος της αριστερής παρωτίδας για ανατομική μελέτη και χειρουργικό σχεδιασμό. Περίπτωση κατόπιν αιτήματος του Δρ. Eladio Rejas.' },
    'Explora nuestros modelos 3D': { en: 'Explore our 3D models', fr: 'Explorez nos modèles 3D', de: 'Entdecken Sie unsere 3D-Modelle', it: 'Esplora i nostri modelli 3D', el: 'Εξερευνήστε τα τρισδιάστατα μοντέλα μας' },
    'Del hueso al tejido blando: reconstrucciones digitales interactivas que llevan la planificación quirúrgica a otro nivel.': {
      en: 'From bone to soft tissue: interactive digital reconstructions that take surgical planning to another level.',
      fr: "De l'os aux tissus mous : des reconstructions numériques interactives qui élèvent la planification chirurgicale à un autre niveau.",
      de: 'Vom Knochen zum Weichgewebe: interaktive digitale Rekonstruktionen, die die chirurgische Planung auf ein neues Niveau heben.',
      it: 'Dall\'osso al tessuto molle: ricostruzioni digitali interattive che portano la pianificazione chirurgica a un altro livello.',
      el: 'Από το οστό στον μαλακό ιστό: διαδραστικές ψηφιακές ανακατασκευές που ανεβάζουν τον χειρουργικό σχεδιασμό σε άλλο επίπεδο.' },
    'Ver todos los modelos 3D': { en: 'View all 3D models', fr: 'Voir tous les modèles 3D', de: 'Alle 3D-Modelle ansehen', it: 'Vedi tutti i modelli 3D', el: 'Δείτε όλα τα τρισδιάστατα μοντέλα' },
    '¿Quieres un modelo 3D de tu caso?': { en: 'Want a 3D model of your case?', fr: 'Vous voulez un modèle 3D de votre cas ?', de: 'Möchten Sie ein 3D-Modell Ihres Falls?', it: 'Vuoi un modello 3D del tuo caso?', el: 'Θέλετε ένα τρισδιάστατο μοντέλο της περίπτωσής σας;' },
    'Convertimos la imagen médica de tu paciente en un modelo digital interactivo y en un modelo anatómico 3D físico listo para el quirófano.': {
      en: "We turn your patient's medical image into an interactive digital model and a physical 3D anatomical model ready for the operating room.",
      fr: "Nous transformons l'image médicale de votre patient en un modèle numérique interactif et un modèle anatomique 3D physique prêt pour le bloc opératoire.",
      de: 'Wir verwandeln das medizinische Bild Ihres Patienten in ein interaktives digitales Modell und ein physisches 3D-Anatomiemodell, bereit für den Operationssaal.',
      it: "Trasformiamo l'immagine medica del tuo paziente in un modello digitale interattivo e in un modello anatomico 3D fisico pronto per la sala operatoria.",
      el: 'Μετατρέπουμε την ιατρική εικόνα του ασθενούς σας σε ένα διαδραστικό ψηφιακό μοντέλο και σε ένα φυσικό ανατομικό μοντέλο 3D έτοιμο για το χειρουργείο.' },
    'Modelos 3D — Eureqa3D': { en: '3D Models — Eureqa3D', fr: 'Modèles 3D — Eureqa3D', de: '3D-Modelle — Eureqa3D', it: 'Modelli 3D — Eureqa3D', el: '3D Μοντέλα — Eureqa3D' },
    'Reconstrucciones interactivas a partir de imagen médica real, disponibles en nuestro EureqaVisor3D. Rota, amplía y explora cada modelo con sus anotaciones clínicas, directamente en el navegador.': {
      en: 'Interactive reconstructions from real medical imaging, available in our EureqaVisor3D. Rotate, zoom and explore each model with its clinical annotations, right in your browser.',
      fr: "Des reconstructions interactives à partir d'imagerie médicale réelle, disponibles dans notre EureqaVisor3D. Tournez, zoomez et explorez chaque modèle avec ses annotations cliniques, directement dans le navigateur.",
      de: 'Interaktive Rekonstruktionen aus echter medizinischer Bildgebung, verfügbar in unserem EureqaVisor3D. Drehen, zoomen und erkunden Sie jedes Modell mit seinen klinischen Anmerkungen – direkt im Browser.',
      it: 'Ricostruzioni interattive a partire da immagini mediche reali, disponibili nel nostro EureqaVisor3D. Ruota, ingrandisci ed esplora ogni modello con le sue annotazioni cliniche, direttamente nel browser.',
      el: 'Διαδραστικές ανακατασκευές από πραγματική ιατρική απεικόνιση, διαθέσιμες στο EureqaVisor3D μας. Περιστρέψτε, μεγεθύνετε και εξερευνήστε κάθε μοντέλο με τις κλινικές του σημειώσεις, απευθείας στον browser.' },
    'Tumor mediastínico': { en: 'Mediastinal tumor', fr: 'Tumeur médiastinale', de: 'Mediastinaltumor', it: 'Tumore mediastinico', el: 'Μεσοθωρακικός όγκος' },
    'Reconstrucción 3D de un tumor mediastínico y su relación con el corazón y los grandes vasos, para planificar el abordaje quirúrgico con mayor seguridad.': {
      en: '3D reconstruction of a mediastinal tumor and its relationship with the heart and great vessels, to plan the surgical approach with greater safety.',
      fr: "Reconstruction 3D d'une tumeur médiastinale et de sa relation avec le cœur et les gros vaisseaux, pour planifier l'abord chirurgical en toute sécurité.",
      de: '3D-Rekonstruktion eines Mediastinaltumors und seiner Beziehung zum Herzen und den großen Gefäßen, um den chirurgischen Zugang mit größerer Sicherheit zu planen.',
      it: "Ricostruzione 3D di un tumore mediastinico e della sua relazione con il cuore e i grandi vasi, per pianificare l'approccio chirurgico con maggiore sicurezza.",
      el: 'Τρισδιάστατη ανακατασκευή ενός μεσοθωρακικού όγκου και της σχέσης του με την καρδιά και τα μεγάλα αγγεία, για τον σχεδιασμό της χειρουργικής προσέγγισης με μεγαλύτερη ασφάλεια.' },

    /* ── Títulos de página (<title>) ── */
    'Eureqa3D — Impresión 3D y modelos digitales para el sector salud': { en: 'Eureqa3D — 3D Printing & digital models for healthcare', fr: 'Eureqa3D — Impression 3D et modèles numériques pour la santé', de: 'Eureqa3D — 3D-Druck & digitale Modelle für das Gesundheitswesen', it: 'Eureqa3D — Stampa 3D e modelli digitali per la sanità', el: 'Eureqa3D — Τρισδιάστατη εκτύπωση & ψηφιακά μοντέλα για την υγεία' },
    'Quiénes somos — Eureqa3D': { en: 'About us — Eureqa3D', fr: 'À propos — Eureqa3D', de: 'Über uns — Eureqa3D', it: 'Chi siamo — Eureqa3D', el: 'Ποιοι είμαστε — Eureqa3D' },
    'Método Eureqa — Eureqa3D': { en: 'Eureqa Method — Eureqa3D', fr: 'Méthode Eureqa — Eureqa3D', de: 'Eureqa-Methode — Eureqa3D', it: 'Metodo Eureqa — Eureqa3D', el: 'Μέθοδος Eureqa — Eureqa3D' },
    'Traumatología — Eureqa3D': { en: 'Traumatology — Eureqa3D', fr: 'Traumatologie — Eureqa3D', de: 'Traumatologie — Eureqa3D', it: 'Traumatologia — Eureqa3D', el: 'Τραυματολογία — Eureqa3D' },
    'Otras especialidades — Eureqa3D': { en: 'Other specialties — Eureqa3D', fr: 'Autres spécialités — Eureqa3D', de: 'Weitere Fachbereiche — Eureqa3D', it: 'Altre specialità — Eureqa3D', el: 'Άλλες ειδικότητες — Eureqa3D' },
    'Cirugía Oncológica — Eureqa3D': { en: 'Oncological Surgery — Eureqa3D', fr: 'Chirurgie Oncologique — Eureqa3D', de: 'Onkologische Chirurgie — Eureqa3D', it: 'Chirurgia Oncologica — Eureqa3D', el: 'Ογκολογική Χειρουργική — Eureqa3D' },
    'Noticias — Eureqa3D': { en: 'News — Eureqa3D', fr: 'Actualités — Eureqa3D', de: 'Aktuelles — Eureqa3D', it: 'Notizie — Eureqa3D', el: 'Νέα — Eureqa3D' },
    'Noticia — Eureqa3D': { en: 'News — Eureqa3D', fr: 'Actualité — Eureqa3D', de: 'Nachricht — Eureqa3D', it: 'Notizia — Eureqa3D', el: 'Είδηση — Eureqa3D' },
    'Contacto — Eureqa3D': { en: 'Contact — Eureqa3D', fr: 'Contact — Eureqa3D', de: 'Kontakt — Eureqa3D', it: 'Contatti — Eureqa3D', el: 'Επικοινωνία — Eureqa3D' },

    /* ══════════════════════════════════════════════════════════════════════════
       LEGAL PAGES — Aviso legal, Política de privacidad, Política de cookies
       ══════════════════════════════════════════════════════════════════════════ */
  'Aviso legal — Eureqa3D': {
    en: 'Legal Notice — Eureqa3D',
    fr: 'Mentions légales — Eureqa3D',
    de: 'Impressum — Eureqa3D',
    it: 'Note legali — Eureqa3D',
    el: 'Νομική σημείωση — Eureqa3D'
  },

  'AVISO LEGAL': {
    en: 'LEGAL NOTICE',
    fr: 'MENTIONS LÉGALES',
    de: 'IMPRESSUM',
    it: 'NOTE LEGALI',
    el: 'ΝΟΜΙΚΉ ΣΗΜΕΊΩΣΗ'
  },

  'Última actualización: julio de 2026.': {
    en: 'Last updated: July 2026.',
    fr: 'Dernière mise à jour : juillet 2026.',
    de: 'Letzte Aktualisierung: Juli 2026.',
    it: 'Ultimo aggiornamento: luglio 2026.',
    el: 'Τελευταία ενημέρωση: Ιούλιος 2026.'
  },

  '1. Datos identificativos del titular': {
    en: '1. Identification of the Owner',
    fr: '1. Données d\'identification du propriétaire',
    de: '1. Identifikationsdaten des Inhabers',
    it: '1. Dati identificativi del titolare',
    el: '1. Δεδομένα αναγνώρισης του ιδιοκτήτη'
  },

  'En cumplimiento del artículo 10 de la LSSI-CE, se informa de los siguientes datos: el titular de este sitio web es <strong>Eureqa Medicina y Cirugía S.L.</strong> (CIF <strong>B10474732</strong>), con domicilio social en C/ Alborada, 26, 10200 Trujillo, Cáceres (España), operando bajo el nombre comercial "Eureqa3D" (en adelante, "Eureqa3D" o "el Sitio"). Las oficinas se ubican en Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.': {
    en: 'In compliance with Article 10 of Directive 2000/31/EC (Electronic Commerce Directive), we provide the following information: the owner of this website is <strong>Eureqa Medicina y Cirugía S.L.</strong> (Tax ID <strong>B10474732</strong>), with registered office at C/ Alborada, 26, 10200 Trujillo, Cáceres (Spain), operating under the commercial name "Eureqa3D" (hereinafter, "Eureqa3D" or "the Site"). The offices are located at Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.',
    fr: 'Conformément à l\'article 10 de la Directive 2000/31/CE (Directive sur le commerce électronique), nous fournissons les informations suivantes : le propriétaire de ce site web est <strong>Eureqa Medicina y Cirugía S.L.</strong> (Numéro de TVA <strong>B10474732</strong>), ayant son siège social à C/ Alborada, 26, 10200 Trujillo, Cáceres (Espagne), opérant sous le nom commercial « Eureqa3D » (ci-après, « Eureqa3D » ou « le Site »). Les bureaux sont situés au Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.',
    de: 'Gemäß Artikel 10 der Richtlinie 2000/31/EG (E-Commerce-Richtlinie) teilen wir folgende Informationen mit: Der Inhaber dieser Website ist <strong>Eureqa Medicina y Cirugía S.L.</strong> (Steuernummer <strong>B10474732</strong>), mit Sitz in C/ Alborada, 26, 10200 Trujillo, Cáceres (Spanien), tätig unter dem Handelsnamen „Eureqa3D" (nachstehend „Eureqa3D" oder „die Website"). Die Büros befinden sich in Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.',
    it: 'In conformità all\'articolo 10 della Direttiva 2000/31/CE (Direttiva sul commercio elettronico), forniamo le seguenti informazioni: il proprietario di questo sito web è <strong>Eureqa Medicina y Cirugía S.L.</strong> (Codice Fiscale <strong>B10474732</strong>), con sede legale in C/ Alborada, 26, 10200 Trujillo, Cáceres (Spagna), operante con il nome commerciale "Eureqa3D" (di seguito, "Eureqa3D" o "il Sito"). Gli uffici si trovano presso Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.',
    el: 'Σύμφωνα με το άρθρο 10 της Οδηγίας 2000/31/ΕΚ (Οδηγία για το ηλεκτρονικό εμπόριο), παρέχουμε τις ακόλουθες πληροφορίες: ο κάτοχος αυτής της ιστοσελίδας είναι η <strong>Eureqa Medicina y Cirugía S.L.</strong> (Αριθμός φόρου <strong>B10474732</strong>), με έδρα στη C/ Alborada, 26, 10200 Trujillo, Cáceres (Ισπανία), που δραστηριοποιείται με το εμπορικό όνομα "Eureqa3D" (στο εξής, "Eureqa3D" ή "το Ιστοχώρο"). Τα γραφεία βρίσκονται στο Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.'
  },

  'Contacto: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> · <a href="tel:+34654552044">+34 654 55 20 44</a>': {
    en: 'Contact: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> · <a href="tel:+34654552044">+34 654 55 20 44</a>',
    fr: 'Contact : <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> · <a href="tel:+34654552044">+34 654 55 20 44</a>',
    de: 'Kontakt: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> · <a href="tel:+34654552044">+34 654 55 20 44</a>',
    it: 'Contatti: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> · <a href="tel:+34654552044">+34 654 55 20 44</a>',
    el: 'Επικοινωνία: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> · <a href="tel:+34654552044">+34 654 55 20 44</a>'
  },

  '2. Objeto y ámbito de aplicación': {
    en: '2. Purpose and Scope',
    fr: '2. Objet et champ d\'application',
    de: '2. Zweck und Anwendungsbereich',
    it: '2. Oggetto e ambito di applicazione',
    el: '2. Σκοπός και εφαρμογή'
  },

  'Este aviso legal regula el acceso y el uso de este sitio web, cuya finalidad es dar a conocer los servicios de impresión 3D y modelos digitales de Eureqa3D en el sector salud, y facilitar el contacto con profesionales y centros interesados. El acceso a este sitio web es gratuito y no requiere registro previo, salvo para el acceso a las zonas privadas destinadas a clientes y colaboradores.': {
    en: 'This legal notice governs access to and use of this website, whose purpose is to present Eureqa3D\'s 3D printing and digital model services in the healthcare sector, and to facilitate contact with interested healthcare professionals and centres. Access to this website is free and does not require prior registration, except for access to private areas reserved for clients and partners.',
    fr: 'Cet avis juridique régit l\'accès et l\'utilisation de ce site web, dont l\'objectif est de présenter les services d\'impression 3D et de modélisation numérique d\'Eureqa3D dans le secteur de la santé, et de faciliter le contact avec les professionnels et les centres de santé intéressés. L\'accès à ce site web est gratuit et ne nécessite pas d\'enregistrement préalable, sauf pour accéder aux zones privées réservées aux clients et partenaires.',
    de: 'Diese Rechtshinweise regeln den Zugang zu und die Nutzung dieser Website, deren Zweck darin besteht, die 3D-Druck- und digitalen Modellierungsdienste von Eureqa3D im Gesundheitswesen bekannt zu machen und den Kontakt mit interessierten Gesundheitsfachleuten und Einrichtungen zu erleichtern. Der Zugang zu dieser Website ist kostenlos und erfordert keine vorherige Registrierung, außer für den Zugriff auf private Bereiche für Kunden und Partner.',
    it: 'Questo avviso legale regola l\'accesso e l\'utilizzo di questo sito web, il cui scopo è presentare i servizi di stampa 3D e modellazione digitale di Eureqa3D nel settore sanitario, e facilitare il contatto con professionisti e strutture sanitarie interessati. L\'accesso a questo sito web è gratuito e non richiede registrazione preliminare, ad eccezione dell\'accesso alle aree private riservate ai clienti e ai partner.',
    el: 'Αυτή η νομική σημείωση διέπει την πρόσβαση και τη χρήση αυτής της ιστοσελίδας, της οποίας σκοπός είναι να παρουσιάσει τις υπηρεσίες τρισδιάστατης εκτύπωσης και ψηφιακής μοντελοποίησης της Eureqa3D στον τομέα της υγειονομικής περίθαλψης, και να διευκολύνει την επικοινωνία με ενδιαφερόμενους επαγγελματίες υγείας και κέντρα. Η πρόσβαση σε αυτήν την ιστοσελίδα είναι δωρεάν και δεν απαιτεί προηγούμενη εγγραφή, εκτός για την πρόσβαση σε ιδιωτικές περιοχές που προορίζονται για πελάτες και συνεργάτες.'
  },

  '3. Condiciones de acceso y uso': {
    en: '3. Terms of Access and Use',
    fr: '3. Conditions d\'accès et d\'utilisation',
    de: '3. Zugangs- und Nutzungsbedingungen',
    it: '3. Condizioni di accesso e utilizzo',
    el: '3. Όροι πρόσβασης και χρήσης'
  },

  'El uso de este sitio web atribuye la condición de usuario e implica la aceptación de las condiciones incluidas en este aviso legal. El usuario se compromete a hacer un uso adecuado y lícito del Sitio, de conformidad con la legislación aplicable, la buena fe, el orden público y este aviso legal, absteniéndose de utilizarlo de cualquier forma que pueda impedir, dañar o deteriorar su normal funcionamiento.': {
    en: 'Use of this website constitutes acceptance of the terms and conditions contained in this legal notice. The user undertakes to use the Site appropriately and lawfully, in accordance with applicable legislation, good faith, public order, and this legal notice, refraining from using it in any way that could prevent, damage, or impair its normal functioning.',
    fr: 'L\'utilisation de ce site web implique l\'acceptation des conditions énoncées dans cet avis juridique. L\'utilisateur s\'engage à utiliser le Site de manière appropriée et légale, conformément à la législation applicable, à la bonne foi, à l\'ordre public et à cet avis juridique, en s\'abstenant de l\'utiliser de toute manière qui pourrait empêcher, endommager ou altérer son fonctionnement normal.',
    de: 'Die Nutzung dieser Website stellt eine Annahme der in diesem Rechtshinweis enthaltenen Bedingungen dar. Der Benutzer verpflichtet sich, die Website ordnungsgemäß und rechtmäßig in Übereinstimmung mit geltender Gesetzgebung, gutem Glauben, öffentlicher Ordnung und diesem Rechtshinweis zu nutzen und sie nicht auf eine Weise zu nutzen, die ihr normales Funktionieren verhindern, beschädigen oder beeinträchtigen könnte.',
    it: 'L\'uso di questo sito web costituisce l\'accettazione dei termini e delle condizioni contenute in questo avviso legale. L\'utente si impegna a utilizzare il Sito in modo appropriato e legittimo, in conformità alla legislazione applicabile, alla buona fede, all\'ordine pubblico e a questo avviso legale, astendendosi dall\'utilizzarlo in qualsiasi modo che potrebbe impedire, danneggiare o compromettere il suo funzionamento normale.',
    el: 'Η χρήση αυτής της ιστοσελίδας συνιστά αποδοχή των όρων και προϋποθέσεων που περιέχονται σε αυτή τη νομική σημείωση. Ο χρήστης δεσμεύεται να χρησιμοποιεί το Ιστοχώρο κατάλληλα και νόμιμα, σύμφωνα με την ισχύουσα νομοθεσία, την καλή πίστη, τη δημόσια τάξη και αυτή τη νομική σημείωση, αποχόμενος από τη χρήση του με οποιονδήποτε τρόπο που θα μπορούσε να εμποδίσει, να βλάψει ή να διακυβεύσει τη φυσιολογική λειτουργία του.'
  },

  '4. Propiedad intelectual e industrial': {
    en: '4. Intellectual and Industrial Property Rights',
    fr: '4. Propriété intellectuelle et industrielle',
    de: '4. Geistige Eigentumsrechte und Gewerbliche Schutzrechte',
    it: '4. Proprietà intellettuale e industriale',
    el: '4. Πνευματική ιδιοκτησία και βιομηχανική ιδιοκτησία'
  },

  'Todos los contenidos de este sitio web —textos, imágenes, vídeos, modelos anatómicos digitales, logotipos, diseño, código fuente y demás elementos— son titularidad de Eureqa3D o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución, comunicación pública o transformación, total o parcial, sin autorización escrita previa de Eureqa3D, salvo para uso personal y privado.': {
    en: 'All content on this website —texts, images, videos, digital anatomical models, logos, design, source code, and other elements— is owned by Eureqa3D or by third parties who have authorized its use, and is protected by intellectual and industrial property law. Reproduction, distribution, public communication, or transformation, in whole or in part, is strictly prohibited without Eureqa3D\'s prior written authorization, except for personal and private use.',
    fr: 'Tous les contenus de ce site web —textes, images, vidéos, modèles anatomiques numériques, logos, conception, code source et autres éléments— sont la propriété d\'Eureqa3D ou de tiers ayant autorisé son utilisation, et sont protégés par la législation sur la propriété intellectuelle et industrielle. Leur reproduction, distribution, communication publique ou transformation, en tout ou en partie, est strictement interdite sans l\'autorisation écrite préalable d\'Eureqa3D, sauf pour un usage personnel et privé.',
    de: 'Alle Inhalte auf dieser Website —Texte, Bilder, Videos, digitale anatomische Modelle, Logos, Design, Quellcode und andere Elemente— sind Eigentum von Eureqa3D oder von Dritten, die ihre Nutzung genehmigt haben, und sind durch Gesetze über Geistige Eigentumsrechte und Gewerbliche Schutzrechte geschützt. Die Vervielfältigung, Verbreitung, öffentliche Mitteilung oder Umwandlung, ganz oder teilweise, ist ohne vorherige schriftliche Genehmigung von Eureqa3D streng untersagt, außer für persönliche und private Nutzung.',
    it: 'Tutti i contenuti di questo sito web —testi, immagini, video, modelli anatomici digitali, loghi, design, codice sorgente e altri elementi— sono di proprietà di Eureqa3D o di terze parti che hanno autorizzato il loro utilizzo, e sono protetti dalla normativa sulla proprietà intellettuale e industriale. La riproduzione, distribuzione, comunicazione pubblica o trasformazione, in tutto o in parte, è rigorosamente vietata senza la previa autorizzazione scritta di Eureqa3D, salvo per uso personale e privato.',
    el: 'Όλο το περιεχόμενο αυτής της ιστοσελίδας —κείμενα, εικόνες, βίντεο, ψηφιακά ανατομικά μοντέλα, λογότυπα, σχεδιασμός, πηγαίος κώδικας και άλλα στοιχεία— είναι ιδιοκτησία της Eureqa3D ή τρίτων που έχουν εγκρίνει τη χρήση του, και προστατεύεται από τη νομοθεσία περί πνευματικής ιδιοκτησίας και βιομηχανικής ιδιοκτησίας. Η αναπαραγωγή, διανομή, δημόσια επικοινωνία ή μετατροπή, εν όλω ή εν μέρει, απαγορεύεται αυστηρώς χωρίς προηγούμενη γραπτή έγκριση της Eureqa3D, εκτός από προσωπική και ιδιωτική χρήση.'
  },

  'Si consideras que algún contenido de este Sitio infringe tus derechos de propiedad intelectual o industrial, puedes notificarlo a <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>, indicando el contenido afectado y acreditando tu titularidad.': {
    en: 'If you believe that any content on this Site infringes your intellectual or industrial property rights, you can report it to <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>, indicating the affected content and proving your ownership.',
    fr: 'Si vous estimez qu\'un contenu de ce Site porte atteinte à vos droits de propriété intellectuelle ou industrielle, vous pouvez le signaler à <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>, en indiquant le contenu concerné et en justifiant de votre titularité.',
    de: 'Wenn Sie der Meinung sind, dass Inhalte dieser Website Ihre Rechte an geistigem oder gewerblichem Eigentum verletzen, können Sie dies an <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> melden und dabei den betroffenen Inhalt angeben sowie Ihre Rechtsinhaberschaft nachweisen.',
    it: 'Se ritieni che un contenuto di questo Sito violi i tuoi diritti di proprietà intellettuale o industriale, puoi segnalarlo a <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>, indicando il contenuto interessato e comprovando la tua titolarità.',
    el: 'Εάν θεωρείτε ότι κάποιο περιεχόμενο αυτού του Ιστοχώρου παραβιάζει τα δικαιώματα πνευματικής ή βιομηχανικής ιδιοκτησίας σας, μπορείτε να το αναφέρετε στο <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>, υποδεικνύοντας το σχετικό περιεχόμενο και αποδεικνύοντας την κυριότητά σας.'
  },

  'Las imágenes y grabaciones de modelos anatómicos 3D mostradas en el Sitio corresponden a casos reales tratados con el consentimiento correspondiente y anonimizados; no constituyen, en ningún caso, un historial clínico ni deben usarse con fines diagnósticos.': {
    en: 'The images and recordings of 3D anatomical models displayed on the Site correspond to real cases treated with appropriate consent and anonymized; they do not constitute, under any circumstances, a medical record and must not be used for diagnostic purposes.',
    fr: 'Les images et enregistrements de modèles anatomiques 3D affichés sur le Site correspondent à des cas réels traités avec le consentement approprié et anonymisés ; ils ne constituent en aucun cas un dossier médical et ne doivent pas être utilisés à des fins diagnostiques.',
    de: 'Die auf der Website angezeigten Bilder und Aufnahmen von 3D-anatomischen Modellen entsprechen realen Fällen, die mit angemessener Zustimmung behandelt und anonymisiert wurden; sie stellen unter keinen Umständen eine Krankenakte dar und dürfen nicht für diagnostische Zwecke verwendet werden.',
    it: 'Le immagini e le registrazioni di modelli anatomici 3D visualizzati sul Sito corrispondono a casi reali trattati con il consenso appropriato e anonimizzati; non costituiscono in nessun caso una cartella clinica e non devono essere utilizzati per scopi diagnostici.',
    el: 'Οι εικόνες και τα βίντεο των τρισδιάστατων ανατομικών μοντέλων που εμφανίζονται στο Ιστοχώρο αντιστοιχούν σε πραγματικές περιπτώσεις που αντιμετωπίστηκαν με κατάλληλη συγκατάθεση και ανωνυμοποίηση· δεν αποτελούν σε καμία περίπτωση ιατρικό αρχείο και δεν πρέπει να χρησιμοποιούνται για διαγνωστικούς σκοπούς.'
  },

  '5. El EureqaVisor3D no es un producto sanitario': {
    en: '5. EureqaVisor3D is Not a Medical Device',
    fr: '5. EureqaVisor3D n\'est pas un produit sanitaire',
    de: '5. EureqaVisor3D ist kein Medizinprodukt',
    it: '5. EureqaVisor3D non è un dispositivo medico',
    el: '5. Το EureqaVisor3D δεν είναι ιατρικό προϊόν'
  },

  'El EureqaVisor3D —la herramienta de visualización de modelos anatómicos 3D digitales referenciada en este sitio web— es una herramienta de apoyo a la visualización. <strong>No es un producto sanitario certificado</strong> para la visualización de estudios radiológicos, no sustituye a un informe radiológico y no debe emplearse con fines diagnósticos.': {
    en: 'EureqaVisor3D —the tool for viewing digital 3D anatomical models referenced on this website— is a visualization support tool. <strong>It is not a certified medical device</strong> for viewing radiological studies, does not replace a radiological report, and must not be used for diagnostic purposes.',
    fr: 'EureqaVisor3D —l\'outil de visualisation de modèles anatomiques 3D numériques référencé sur ce site web— est un outil d\'aide à la visualisation. <strong>Ce n\'est pas un produit sanitaire certifié</strong> pour la visualisation d\'études radiologiques, ne remplace pas un rapport radiologique et ne doit pas être utilisé à des fins diagnostiques.',
    de: 'EureqaVisor3D —das Tool zur Anzeige digitaler 3D-anatomischer Modelle, auf das auf dieser Website verwiesen wird— ist ein Visualisierungswerkzeug. <strong>Es ist kein zertifiziertes Medizinprodukt</strong> zur Anzeige radiologischer Untersuchungen, ersetzt keinen radiologischen Bericht und darf nicht für diagnostische Zwecke verwendet werden.',
    it: 'EureqaVisor3D —lo strumento per visualizzare modelli anatomici 3D digitali referenziato su questo sito web— è uno strumento di supporto alla visualizzazione. <strong>Non è un dispositivo medico certificato</strong> per la visualizzazione di studi radiologici, non sostituisce un rapporto radiologico e non deve essere utilizzato per scopi diagnostici.',
    el: 'Το EureqaVisor3D —το εργαλείο προβολής ψηφιακών τρισδιάστατων ανατομικών μοντέλων που αναφέρεται σε αυτήν την ιστοσελίδα— είναι ένα εργαλείο υποστήριξης προβολής. <strong>Δεν είναι πιστοποιημένο ιατρικό προϊόν</strong> για την προβολή ακτινολογικών μελετών, δεν αντικαθιστά μια ακτινολογική έκθεση και δεν πρέπει να χρησιμοποιείται για διαγνωστικούς σκοπούς.'
  },

  '6. Enlaces a terceros': {
    en: '6. Third-Party Links',
    fr: '6. Liens vers des tiers',
    de: '6. Hyperlinks zu Drittanbietern',
    it: '6. Collegamenti a terzi',
    el: '6. Σύνδεσμοι προς τρίτους'
  },

  'Este sitio web puede incluir enlaces a sitios web de terceros (por ejemplo, redes sociales). Eureqa3D no se hace responsable del contenido, políticas de privacidad o prácticas de dichos sitios, que se rigen por sus propias condiciones.': {
    en: 'This website may include links to third-party websites (for example, social media). Eureqa3D is not responsible for the content, privacy policies, or practices of such sites, which are governed by their own terms and conditions.',
    fr: 'Ce site web peut inclure des liens vers des sites web de tiers (par exemple, les réseaux sociaux). Eureqa3D n\'est pas responsable du contenu, des politiques de confidentialité ou des pratiques de ces sites, qui sont régis par leurs propres conditions.',
    de: 'Diese Website kann Links zu Websites von Drittanbietern enthalten (z. B. soziale Medien). Eureqa3D ist nicht verantwortlich für den Inhalt, die Datenschutzrichtlinien oder die Praktiken solcher Websites, die durch ihre eigenen Bedingungen geregelt werden.',
    it: 'Questo sito web può includere link a siti web di terzi (ad esempio, social media). Eureqa3D non è responsabile del contenuto, delle politiche sulla privacy o delle pratiche di tali siti, che sono regolati dai loro propri termini e condizioni.',
    el: 'Αυτή η ιστοσελίδα μπορεί να περιλαμβάνει συνδέσμους προς ιστοσελίδες τρίτων (για παράδειγμα, κοινωνικά μέσα). Η Eureqa3D δεν είναι υπεύθυνη για το περιεχόμενο, τις πολιτικές απορρήτου ή τις πρακτικές τέτοιων ιστοσελίδων, οι οποίες διέπονται από τους δικούς τους όρους και προϋποθέσεις.'
  },

  '7. Exclusión de responsabilidad': {
    en: '7. Disclaimer',
    fr: '7. Clause de non-responsabilité',
    de: '7. Haftungsausschluss',
    it: '7. Esclusione di responsabilità',
    el: '7. Αποποίηση ευθύνης'
  },

  'Eureqa3D no garantiza la disponibilidad y continuidad ininterrumpida del funcionamiento del Sitio, y no se hace responsable de los daños que puedan derivarse de la falta de disponibilidad o de fallos de acceso, sin perjuicio de las medidas razonables que adopta para evitar este tipo de incidencias.': {
    en: 'Eureqa3D does not guarantee the availability and uninterrupted functioning of the Site, and is not responsible for damages arising from lack of availability or access failures, notwithstanding the reasonable measures it takes to prevent such incidents.',
    fr: 'Eureqa3D ne garantit pas la disponibilité et le fonctionnement ininterrompu du Site, et n\'est pas responsable des dommages résultant d\'une indisponibilité ou de défaillances d\'accès, sans préjudice des mesures raisonnables qu\'elle prend pour prévenir de tels incidents.',
    de: 'Eureqa3D garantiert nicht die Verfügbarkeit und ununterbrochene Funktionsfähigkeit der Website und ist nicht verantwortlich für Schäden, die sich aus mangelnder Verfügbarkeit oder Zugriffsstörungen ergeben, unbeschadet der angemessenen Maßnahmen, die es trifft, um solche Zwischenfälle zu vermeiden.',
    it: 'Eureqa3D non garantisce la disponibilità e il funzionamento ininterrotto del Sito, e non è responsabile dei danni derivanti dalla mancanza di disponibilità o da guasti di accesso, fatti salvi i provvedimenti ragionevoli che adotta per prevenire tali incidenti.',
    el: 'Η Eureqa3D δεν εγγυάται τη διαθεσιμότητα και τη διακοπτόμενη λειτουργία του Ιστοχώρου, και δεν είναι υπεύθυνη για ζημίες που προκύπτουν από την έλλειψη διαθεσιμότητας ή αποτυχίες πρόσβασης, χωρίς να θίγονται τα εύλογα μέτρα που λαμβάνει για την αποτροπή τέτοιων περιστατικών.'
  },

  '8. Legislación aplicable y jurisdicción': {
    en: '8. Applicable Law and Jurisdiction',
    fr: '8. Loi applicable et juridiction',
    de: '8. Anwendbares Recht und Gerichtsbarkeit',
    it: '8. Legge applicabile e competenza giurisdizionale',
    el: '8. Εφαρμοστέο δίκαιο και δικαιοδοσία'
  },

  'Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia relacionada con este sitio web, las partes se someten a los juzgados y tribunales que correspondan conforme a derecho.': {
    en: 'These terms and conditions are governed by Spanish law. For the resolution of any dispute related to this website, the parties submit to the courts and tribunals that are competent under law.',
    fr: 'Ces conditions générales sont régies par la loi espagnole. Pour la résolution de tout différend lié à ce site web, les parties se soumettent aux tribunaux compétents conformément à la loi.',
    de: 'Diese Bedingungen unterliegen spanischem Recht. Für die Beilegung aller Streitigkeiten im Zusammenhang mit dieser Website unterwerfen sich die Parteien den nach Recht zuständigen Gerichten.',
    it: 'Questi termini e condizioni sono disciplinati dalla legge spagnola. Per la risoluzione di qualsiasi controversia relativa a questo sito web, le parti si sottomettono ai tribunali competenti secondo la legge.',
    el: 'Αυτοί οι όροι και προϋποθέσεις διέπονται από το ισπανικό δίκαιο. Για την επίλυση οποιασδήποτε διαφοράς που σχετίζεται με αυτήν την ιστοσελίδα, τα μέρη υπακούουν στα δικαστήρια που είναι αρμόδια σύμφωνα με το νόμο.'
  },

  '9. Modificaciones': {
    en: '9. Modifications',
    fr: '9. Modifications',
    de: '9. Änderungen',
    it: '9. Modifiche',
    el: '9. Τροποποιήσεις'
  },

  'Eureqa3D se reserva el derecho a modificar este aviso legal para adaptarlo a novedades legislativas o cambios en el Sitio. Se recomienda revisar esta página periódicamente.': {
    en: 'Eureqa3D reserves the right to modify this legal notice to adapt it to legislative changes or updates to the Site. We recommend reviewing this page regularly.',
    fr: 'Eureqa3D se réserve le droit de modifier cet avis juridique pour l\'adapter aux changements législatifs ou aux mises à jour du Site. Nous recommandons de consulter cette page régulièrement.',
    de: 'Eureqa3D behält sich das Recht vor, diese Rechtshinweise zu ändern, um sie an Gesetzesänderungen oder Updates der Website anzupassen. Wir empfehlen, diese Seite regelmäßig zu überprüfen.',
    it: 'Eureqa3D si riserva il diritto di modificare questo avviso legale per adattarlo a cambiamenti legislativi o aggiornamenti del Sito. Ti consigliamo di consultare questa pagina regolarmente.',
    el: 'Η Eureqa3D διατηρεί το δικαίωμα να τροποποιήσει αυτή τη νομική σημείωση για να την προσαρμόσει σε νομοθετικές αλλαγές ή ενημερώσεις του Ιστοχώρου. Συνιστούμε να ελέγχετε αυτή τη σελίδα τακτικά.'
  },

  'Para cualquier cuestión relacionada con este aviso legal, puedes escribirnos a <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>. Consulta también nuestra <a href="/politica-privacidad">Política de privacidad</a> y nuestra <a href="/politica-cookies">Política de cookies</a>.': {
    en: 'For any question related to this legal notice, you can write to us at <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>. See also our <a href="/politica-privacidad">Privacy Policy</a> and our <a href="/politica-cookies">Cookie Policy</a>.',
    fr: 'Pour toute question relative à ces mentions légales, vous pouvez nous écrire à <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>. Consultez également notre <a href="/politica-privacidad">Politique de confidentialité</a> et notre <a href="/politica-cookies">Politique sur les cookies</a>.',
    de: 'Bei Fragen zu diesem Impressum können Sie uns unter <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a> schreiben. Beachten Sie auch unsere <a href="/politica-privacidad">Datenschutzerklärung</a> und unsere <a href="/politica-cookies">Cookie-Richtlinie</a>.',
    it: 'Per qualsiasi domanda relativa a questo avviso legale, puoi scriverci a <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>. Consulta anche la nostra <a href="/politica-privacidad">Informativa sulla privacy</a> e la nostra <a href="/politica-cookies">Politica sui cookie</a>.',
    el: 'Για οποιοδήποτε ζήτημα σχετικό με αυτήν τη νομική σημείωση, μπορείτε να μας γράψετε στο <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>. Συμβουλευτείτε επίσης την <a href="/politica-privacidad">Πολιτική απορρήτου</a> και την <a href="/politica-cookies">Πολιτική cookies</a> μας.'
  },

  // ============================================================================
  // PRIVACY POLICY / POLÍTICA DE PRIVACIDAD
  // ============================================================================

  'Política de privacidad — Eureqa3D': {
    en: 'Privacy Policy — Eureqa3D',
    fr: 'Politique de confidentialité — Eureqa3D',
    de: 'Datenschutzerklärung — Eureqa3D',
    it: 'Informativa sulla privacy — Eureqa3D',
    el: 'Πολιτική απορρήτου — Eureqa3D'
  },

  'POLÍTICA DE PRIVACIDAD': {
    en: 'PRIVACY POLICY',
    fr: 'POLITIQUE DE CONFIDENTIALITÉ',
    de: 'DATENSCHUTZERKLÄRUNG',
    it: 'INFORMATIVA SULLA PRIVACY',
    el: 'ΠΟΛΙΤΙΚΉ ΑΠΟΡΡΉΤΟΥ'
  },

  'Política de privacidad': {
    en: 'Privacy Policy',
    fr: 'Politique de confidentialité',
    de: 'Datenschutzerklärung',
    it: 'Informativa sulla privacy',
    el: 'Πολιτική απορρήτου'
  },

  '1. Responsable del tratamiento': {
    en: '1. Data Controller',
    fr: '1. Responsable du traitement',
    de: '1. Verantwortlicher für die Datenverarbeitung',
    it: '1. Titolare del trattamento',
    el: '1. Υπεύθυνος επεξεργασίας δεδομένων'
  },

  'Eureqa Medicina y Cirugía S.L. (nombre comercial "Eureqa3D"), CIF B10474732, con domicilio social en C/ Alborada, 26, 10200 Trujillo, Cáceres (España). Oficinas en Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.<br> Contacto para cuestiones de privacidad: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.': {
    en: 'Eureqa Medicina y Cirugía S.L. (commercial name "Eureqa3D"), Tax ID B10474732, with registered office at C/ Alborada, 26, 10200 Trujillo, Cáceres (Spain). Offices at Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.<br>\n      Contact for privacy matters: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    fr: 'Eureqa Medicina y Cirugía S.L. (nom commercial « Eureqa3D »), numéro de TVA B10474732, ayant son siège social à C/ Alborada, 26, 10200 Trujillo, Cáceres (Espagne). Bureaux au Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.<br>\n      Contact pour les questions de confidentialité : <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    de: 'Eureqa Medicina y Cirugía S.L. (Handelsname „Eureqa3D"), Steuernummer B10474732, mit Sitz in C/ Alborada, 26, 10200 Trujillo, Cáceres (Spanien). Büros in Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.<br>\n      Kontakt für Datenschutzfragen: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    it: 'Eureqa Medicina y Cirugía S.L. (nome commerciale "Eureqa3D"), Codice Fiscale B10474732, con sede legale in C/ Alborada, 26, 10200 Trujillo, Cáceres (Spagna). Uffici presso Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.<br>\n      Contatto per questioni relative alla privacy: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    el: 'Eureqa Medicina y Cirugía S.L. (εμπορικό όνομα "Eureqa3D"), Αριθμός φόρου B10474732, με έδρα στη C/ Alborada, 26, 10200 Trujillo, Cáceres (Ισπανία). Γραφεία στο Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres.<br>\n      Επικοινωνία για θέματα απορρήτου: <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.'
  },

  '2. Aviso importante: este sitio web no trata imágenes médicas de pacientes': {
    en: '2. Important Notice: This website does not process patient medical images',
    fr: '2. Avis important : ce site web ne traite pas les images médicales de patients',
    de: '2. Wichtiger Hinweis: Diese Website verarbeitet keine Patientenmedizinbilder',
    it: '2. Avviso importante: questo sito web non elabora immagini mediche di pazienti',
    el: '2. Σημαντικό σημείωμα: Αυτή η ιστοσελίδα δεν επεξεργάζεται ιατρικές εικόνες ασθενών'
  },

  'Este sitio web es un escaparate informativo y comercial. <strong>No se suben, procesan ni almacenan estudios radiológicos, imágenes médicas ni datos de salud de pacientes a través de los formularios públicos de esta web.</strong> Cuando un profesional o centro sanitario solicita un caso de prueba, el envío del estudio radiológico y cualquier dato de salud asociado se gestiona siempre por un canal seguro acordado directamente con el equipo de Eureqa3D, fuera de este sitio web, y con las garantías de confidencialidad y trazabilidad propias del Método Eureqa.': {
    en: 'This website is an informational and commercial showcase. <strong>Radiological studies, medical images, or patient health data are not uploaded, processed, or stored through the public forms on this website.</strong> When a healthcare professional or facility requests a trial case, the transmission of radiological studies and any associated health data is always managed through a secure channel agreed upon directly with the Eureqa3D team, outside of this website, and with the confidentiality and traceability guarantees inherent to the Eureqa Method.',
    fr: 'Ce site web est une vitrine informative et commerciale. <strong>Aucune étude radiologique, image médicale ou donnée de santé de patients n\'est téléchargée, traitée ou stockée via les formulaires publics de ce site web.</strong> Lorsqu\'un professionnel ou un centre de santé demande un cas d\'essai, la transmission de l\'étude radiologique et de toute donnée de santé associée est toujours gérée par un canal sécurisé convenu directement avec l\'équipe Eureqa3D, en dehors de ce site web, et avec les garanties de confidentialité et de traçabilité propres à la Méthode Eureqa.',
    de: 'Diese Website ist ein informatives und kommerzielles Schaufenster. <strong>Radiologische Untersuchungen, medizinische Bilder oder Patientengesundheitsdaten werden nicht über die öffentlichen Formulare auf dieser Website hochgeladen, verarbeitet oder gespeichert.</strong> Wenn ein Gesundheitsfachmann oder eine Einrichtung einen Testfall anfordert, wird die Übermittlung radiologischer Untersuchungen und aller damit verbundenen Gesundheitsdaten immer über einen sicheren Kanal verwaltet, der direkt mit dem Eureqa3D-Team außerhalb dieser Website vereinbart wurde, und mit den Vertraulichkeits- und Nachverfolgungsgarantien, die der Eureqa-Methode eigen sind.',
    it: 'Questo sito web è una vetrina informativa e commerciale. <strong>Studi radiologici, immagini mediche o dati sanitari dei pazienti non vengono caricati, elaborati o archiviati attraverso i moduli pubblici di questo sito web.</strong> Quando un professionista sanitario o una struttura richiede un caso di prova, la trasmissione dello studio radiologico e di qualsiasi dato sanitario associato è sempre gestita attraverso un canale sicuro concordato direttamente con il team di Eureqa3D, al di fuori di questo sito web, e con le garanzie di riservatezza e tracciabilità proprie del Metodo Eureqa.',
    el: 'Αυτή η ιστοσελίδα είναι μια ενημερωτική και εμπορική βιτρίνα. <strong>Ακτινολογικές μελέτες, ιατρικές εικόνες ή δεδομένα υγείας ασθενών δεν ανεβαίνουν, δεν επεξεργάζονται ή δεν αποθηκεύονται μέσω των δημόσιων φορμών σε αυτήν την ιστοσελίδα.</strong> Όταν ένας επαγγελματίας υγείας ή μια δομή ζητά μια δοκιμαστική περίπτωση, η μετάδοση της ακτινολογικής μελέτης και οποιωνδήποτε σχετικών δεδομένων υγείας διαχειρίζεται πάντα μέσω ενός ασφαλούς καναλιού που συμφωνήθηκε απευθείας με την ομάδα Eureqa3D, έξω από αυτήν την ιστοσελίδα, και με τις εγγυήσεις εμπιστευτικότητας και ανιχνευσιμότητας που είναι ενυπάρχουσες στη Μέθοδο Eureqa.'
  },

  '3. Qué datos recogemos y para qué': {
    en: '3. What Data We Collect and Why',
    fr: '3. Quelles données nous collectons et pourquoi',
    de: '3. Welche Daten wir sammeln und warum',
    it: '3. Quali dati raccogliamo e perché',
    el: '3. Ποια δεδομένα συλλέγουμε και γιατί'
  },

  '3.1 Formulario de contacto y chat de la web': {
    en: '3.1 Contact Form and Website Chat',
    fr: '3.1 Formulaire de contact et chat du site web',
    de: '3.1 Kontaktformular und Website-Chat',
    it: '3.1 Modulo di contatto e chat del sito web',
    el: '3.1 Φόρμα επικοινωνίας και συνομιλία ιστοσελίδας'
  },

  'Cuando escribes a través del formulario de contacto o del chat del Sitio, recogemos el nombre, correo electrónico, asunto y el contenido del mensaje que nos facilitas voluntariamente. Estos datos se utilizan exclusivamente para responder a tu consulta o solicitud de caso de prueba, y para enviarte, si procede, un correo de confirmación de que hemos recibido tu mensaje.': {
    en: 'When you write to us through the contact form or website chat, we collect your name, email address, subject, and message content that you provide voluntarily. This data is used exclusively to respond to your inquiry or trial case request, and to send you, if applicable, a confirmation email that we have received your message.',
    fr: 'Lorsque vous nous écrivez via le formulaire de contact ou le chat du site, nous collectons votre nom, adresse e-mail, sujet et le contenu du message que vous nous fournissez volontairement. Ces données sont utilisées exclusivement pour répondre à votre demande de renseignements ou de cas d\'essai, et pour vous envoyer, le cas échéant, un e-mail de confirmation que nous avons reçu votre message.',
    de: 'Wenn Sie uns über das Kontaktformular oder den Website-Chat schreiben, erfassen wir Ihren Namen, Ihre E-Mail-Adresse, den Betreff und den Nachrichteninhalt, den Sie uns freiwillig zur Verfügung stellen. Diese Daten werden ausschließlich verwendet, um auf Ihre Anfrage oder Anfrage für einen Testfall zu antworten und Ihnen gegebenenfalls eine Bestätigungse-Mail zu senden, dass wir Ihre Nachricht erhalten haben.',
    it: 'Quando ci scrivi tramite il modulo di contatto o la chat del sito web, raccogliamo il tuo nome, indirizzo e-mail, oggetto e il contenuto del messaggio che ci fornisci volontariamente. Questi dati vengono utilizzati esclusivamente per rispondere alla tua richiesta di informazioni o alla tua richiesta di caso di prova, e per inviarti, se applicabile, un\'e-mail di conferma che abbiamo ricevuto il tuo messaggio.',
    el: 'Όταν μας γράφετε μέσω της φόρμας επικοινωνίας ή της συνομιλίας της ιστοσελίδας, συλλέγουμε το όνομα σας, διεύθυνση ηλεκτρονικού ταχυδρομείου, θέμα και περιεχόμενο του μηνύματος που μας παρέχετε εθελοντικά. Αυτά τα δεδομένα χρησιμοποιούνται αποκλειστικά για να απαντήσουμε στο ερώτημά σας ή στο αίτημα δοκιμαστικής περίπτωσης, και για να σας στείλουμε, εάν ισχύει, ένα email επιβεβαίωσης ότι λάβαμε το μήνυμά σας.'
  },

  '3.2 Zona privada (clientes y colaboradores)': {
    en: '3.2 Private Area (Clients and Partners)',
    fr: '3.2 Zone privée (clients et collaborateurs)',
    de: '3.2 Privater Bereich (Clients und Partner)',
    it: '3.2 Area privata (clienti e partner)',
    el: '3.2 Ιδιωτική περιοχή (πελάτες και συνεργάτες)'
  },

  'Si eres cliente o colaborador y accedes a la zona privada del Sitio (panel o visor de casos), se crea una sesión técnica necesaria para mantenerte identificado mientras usas el servicio. Estos accesos son nominales y se conceden de forma individual por el equipo de Eureqa3D.': {
    en: 'If you are a client or partner and access the private area of the Site (case panel or viewer), a technical session is created that is necessary to keep you identified while you use the service. These accesses are personal and are granted individually by the Eureqa3D team.',
    fr: 'Si vous êtes un client ou un collaborateur et que vous accédez à la zone privée du Site (panneau ou visionneuse de cas), une session technique est créée qui est nécessaire pour vous maintenir identifié pendant que vous utilisez le service. Ces accès sont personnels et sont accordés individuellement par l\'équipe Eureqa3D.',
    de: 'Wenn Sie ein Kunde oder Partner sind und auf den privaten Bereich der Website (Fallpanel oder Viewer) zugreifen, wird eine technische Sitzung erstellt, die erforderlich ist, um Sie während der Nutzung des Dienstes identifiziert zu halten. Diese Zugriffe sind persönlich und werden von der Eureqa3D-Team einzeln gewährt.',
    it: 'Se sei un cliente o un partner e accedi all\'area privata del Sito (pannello di caso o visualizzatore), viene creata una sessione tecnica necessaria per mantenerti identificato mentre utilizzi il servizio. Questi accessi sono personali e vengono concessi individualmente dal team di Eureqa3D.',
    el: 'Εάν είστε πελάτης ή συνεργάτης και αποκτάτε πρόσβαση στην ιδιωτική περιοχή του Ιστοχώρου (πίνακα περιπτώσεων ή προβολέα), δημιουργείται μια τεχνική συνεδρία που είναι απαραίτητη για να σας κρατήσει αναγνωρισμένο ενώ χρησιμοποιείτε την υπηρεσία. Αυτές οι πρόσβάσεις είναι προσωπικές και χορηγούνται ατομικά από την ομάδα Eureqa3D.'
  },

  '3.3 Navegación general': {
    en: '3.3 General Navigation',
    fr: '3.3 Navigation générale',
    de: '3.3 Allgemeine Navigation',
    it: '3.3 Navigazione generale',
    el: '3.3 Γενική πλοήγηση'
  },

  'Si no rellenas ningún formulario ni inicias sesión, tu visita a las páginas públicas de este Sitio no genera ningún registro de datos personales en nuestros servidores más allá de los registros técnicos habituales de cualquier servidor web (dirección IP, fecha y hora de la petición), que se conservan por motivos de seguridad.': {
    en: 'If you do not fill out any form or log in, your visit to the public pages of this Site does not generate any personal data record on our servers beyond the usual technical logs of any web server (IP address, date, and time of the request), which are retained for security reasons.',
    fr: 'Si vous ne remplissez aucun formulaire et ne vous connectez pas, votre visite des pages publiques de ce Site ne génère aucun enregistrement de données personnelles sur nos serveurs au-delà des journaux techniques habituels de tout serveur web (adresse IP, date et heure de la demande), qui sont conservés pour des raisons de sécurité.',
    de: 'Wenn Sie kein Formular ausfüllen und sich nicht anmelden, generiert Ihr Besuch auf den öffentlichen Seiten dieser Website keine persönlichen Datensätze auf unseren Servern über die üblichen technischen Protokolle eines beliebigen Webservers hinaus (IP-Adresse, Datum und Uhrzeit der Anfrage), die aus Sicherheitsgründen beibehalten werden.',
    it: 'Se non compili alcun modulo e non accedi, la tua visita alle pagine pubbliche di questo Sito non genera alcun record di dati personali sui nostri server oltre ai soliti log tecnici di qualsiasi server web (indirizzo IP, data e ora della richiesta), che vengono conservati per motivi di sicurezza.',
    el: 'Εάν δεν συμπληρώσετε κανένα έντυπο και δεν συνδεθείτε, η επίσκεψή σας στις δημόσιες σελίδες αυτού του Ιστοχώρου δεν δημιουργεί κανένα αρχείο προσωπικών δεδομένων στους διακομιστές μας πέρα από τα συνήθη τεχνικά αρχεία οποιουδήποτε διακομιστή ιστού (διεύθυνση IP, ημερομηνία και ώρα του αιτήματος), τα οποία διατηρούνται για λόγους ασφαλείας.'
  },

  '4. Carácter obligatorio o facultativo de los datos': {
    en: '4. Mandatory or Optional Nature of the Data',
    fr: '4. Caractère obligatoire ou facultatif des données',
    de: '4. Pflicht- oder freiwillige Angaben',
    it: '4. Natura obbligatoria o facoltativa dei dati',
    el: '4. Υποχρεωτικός ή προαιρετικός χαρακτήρας των δεδομένων'
  },

  'En el formulario de contacto, el nombre y el correo electrónico son obligatorios para poder responderte; el asunto y el resto de campos son opcionales. En el chat de la web, el nombre y el correo electrónico también son obligatorios para poder atender tu solicitud; la empresa o centro del que nos escribes es opcional. Si no facilitas los datos obligatorios, no podremos dar respuesta a tu consulta.': {
    en: 'In the contact form, your name and email address are mandatory so we can respond to you; the subject and other fields are optional. In the website chat, your name and email address are also mandatory so we can attend to your request; the company or centre you write to us from is optional. If you do not provide the mandatory data, we will not be able to respond to your inquiry.',
    fr: 'Dans le formulaire de contact, le nom et l\'adresse e-mail sont obligatoires pour pouvoir vous répondre ; l\'objet et les autres champs sont facultatifs. Dans le chat du site, le nom et l\'adresse e-mail sont également obligatoires pour pouvoir traiter votre demande ; l\'entreprise ou le centre depuis lequel vous nous écrivez est facultatif. Si vous ne fournissez pas les données obligatoires, nous ne pourrons pas répondre à votre demande.',
    de: 'Im Kontaktformular sind Name und E-Mail-Adresse Pflichtfelder, damit wir Ihnen antworten können; Betreff und die übrigen Felder sind optional. Im Website-Chat sind Name und E-Mail-Adresse ebenfalls Pflichtfelder, damit wir Ihre Anfrage bearbeiten können; das Unternehmen oder die Einrichtung, von der aus Sie uns schreiben, ist optional. Wenn Sie die Pflichtangaben nicht machen, können wir Ihre Anfrage nicht beantworten.',
    it: 'Nel modulo di contatto, il nome e l\'indirizzo e-mail sono obbligatori per poterti rispondere; l\'oggetto e gli altri campi sono facoltativi. Nella chat del sito, il nome e l\'indirizzo e-mail sono anch\'essi obbligatori per poter gestire la tua richiesta; l\'azienda o la struttura da cui ci scrivi è facoltativa. Se non fornisci i dati obbligatori, non potremo rispondere alla tua richiesta.',
    el: 'Στη φόρμα επικοινωνίας, το όνομα και το email είναι υποχρεωτικά ώστε να μπορέσουμε να σας απαντήσουμε· το θέμα και τα υπόλοιπα πεδία είναι προαιρετικά. Στη συνομιλία της ιστοσελίδας, το όνομα και το email είναι επίσης υποχρεωτικά ώστε να εξυπηρετήσουμε το αίτημά σας· η εταιρεία ή το κέντρο από το οποίο μας γράφετε είναι προαιρετικό. Εάν δεν παρέχετε τα υποχρεωτικά δεδομένα, δεν θα μπορέσουμε να απαντήσουμε στο ερώτημά σας.'
  },

  '5. Base jurídica del tratamiento': {
    en: '5. Legal Basis for Processing',
    fr: '5. Base juridique du traitement',
    de: '5. Rechtsgrundlage für die Verarbeitung',
    it: '5. Base giuridica del trattamento',
    el: '5. Νομική βάση της επεξεργασίας'
  },

  'La base jurídica para tratar los datos del formulario de contacto y del chat es tu <strong>consentimiento</strong>, prestado al rellenar y enviar voluntariamente el formulario (art. 6.1.a RGPD), así como nuestro <strong>interés legítimo</strong> en responder a las consultas comerciales que se nos dirigen (art. 6.1.f RGPD). El acceso a la zona privada se basa en la <strong>ejecución de la relación contractual o de colaboración</strong> con cada cliente (art. 6.1.b RGPD).': {
    en: 'The legal basis for processing contact form and chat data is your <strong>consent</strong>, given when you voluntarily fill out and submit the form (Article 6.1.a GDPR), as well as our <strong>legitimate interest</strong> in responding to commercial inquiries directed to us (Article 6.1.f GDPR). Access to the private area is based on the <strong>performance of the contractual or partnership relationship</strong> with each client (Article 6.1.b GDPR).',
    fr: 'La base juridique du traitement des données du formulaire de contact et du chat est votre <strong>consentement</strong>, donné lorsque vous remplissez et soumettez volontairement le formulaire (article 6.1.a RGPD), ainsi que notre <strong>intérêt légitime</strong> à répondre aux demandes commerciales qui nous sont adressées (article 6.1.f RGPD). L\'accès à la zone privée est basé sur l\'<strong>exécution de la relation contractuelle ou de partenariat</strong> avec chaque client (article 6.1.b RGPD).',
    de: 'Die Rechtsgrundlage für die Verarbeitung von Kontaktformular- und Chat-Daten ist Ihre <strong>Zustimmung</strong>, die gegeben wird, wenn Sie das Formular freiwillig ausfüllen und absenden (Artikel 6.1.a DSGVO), sowie unser <strong>berechtigtes Interesse</strong>, auf an uns gerichtete geschäftliche Anfragen zu antworten (Artikel 6.1.f DSGVO). Der Zugriff auf den privaten Bereich basiert auf der <strong>Erfüllung der vertraglichen oder Partnerschaftsbeziehung</strong> mit jedem Kunden (Artikel 6.1.b DSGVO).',
    it: 'La base giuridica per il trattamento dei dati del modulo di contatto e della chat è il tuo <strong>consenso</strong>, fornito quando compili e invii volontariamente il modulo (articolo 6.1.a RGPD), nonché il nostro <strong>interesse legittimo</strong> nel rispondere alle richieste commerciali rivolteci (articolo 6.1.f RGPD). L\'accesso all\'area privata si basa sull\'<strong>esecuzione della relazione contrattuale o di partnership</strong> con ogni cliente (articolo 6.1.b RGPD).',
    el: 'Η νομική βάση για την επεξεργασία δεδομένων φόρμας επικοινωνίας και συνομιλίας είναι η <strong>συγκατάθεσή</strong> σας, δεδομένη όταν συμπληρώσετε και υποβάλετε εθελοντικά τη φόρμα (Άρθρο 6.1.α GDPR), καθώς και το δικό μας <strong>νόμιμο συμφέρον</strong> να αποκρινόμαστε σε εμπορικές ερωτήσεις που μας απευθύνονται (Άρθρο 6.1.f GDPR). Η πρόσβαση στην ιδιωτική περιοχή βασίζεται στην <strong>εκτέλεση της συμβατικής ή εταιρικής σχέσης</strong> με κάθε πελάτη (Άρθρο 6.1.β GDPR).'
  },

  '6. Plazo de conservación': {
    en: '6. Data Retention Period',
    fr: '6. Durée de conservation',
    de: '6. Aufbewahrungsdauer',
    it: '6. Periodo di conservazione',
    el: '6. Περίοδος διατήρησης δεδομένων'
  },

  'Los datos de los formularios de contacto se conservan mientras exista una relación comercial o de interés mutuo con el remitente, y en todo caso hasta que solicites su supresión. Puedes pedir en cualquier momento que eliminemos tu mensaje y tus datos de contacto escribiendo a info@eureqa3d.com.': {
    en: 'Contact form data is retained as long as there is a commercial relationship or mutual interest with the sender, and in any case until you request its deletion. You can ask at any time for us to delete your message and contact data by writing to info@eureqa3d.com.',
    fr: 'Les données du formulaire de contact sont conservées tant qu\'il existe une relation commerciale ou un intérêt mutuel avec l\'expéditeur, et en tout cas jusqu\'à ce que vous en demandiez la suppression. Vous pouvez demander à tout moment la suppression de votre message et de vos données de contact en écrivant à info@eureqa3d.com.',
    de: 'Kontaktformulardaten werden beibehalten, solange ein geschäftliches Verhältnis oder gegenseitiges Interesse zum Absender besteht, und in jedem Fall bis Sie deren Löschung anfordern. Sie können jederzeit die Löschung Ihrer Nachricht und Kontaktdaten anfordern, indem Sie an info@eureqa3d.com schreiben.',
    it: 'I dati del modulo di contatto vengono conservati fintanto che vi sia una relazione commerciale o interesse reciproco con il mittente, e in ogni caso fino a quando non ne richiedi la cancellazione. Puoi richiedere in qualsiasi momento l\'eliminazione del tuo messaggio e dei tuoi dati di contatto scrivendo a info@eureqa3d.com.',
    el: 'Τα δεδομένα της φόρμας επικοινωνίας διατηρούνται εφόσον υπάρχει εμπορική σχέση ή αμοιβαίο ενδιαφέρον με τον αποστολέα, και σε κάθε περίπτωση έως ότου ζητήσετε τη διαγραφή του. Μπορείτε να ζητήσετε ανά πάσα στιγμή τη διαγραφή του μηνύματος και των δεδομένων επικοινωνίας σας γράφοντας στο info@eureqa3d.com.'
  },

  '7. Destinatarios y encargados del tratamiento': {
    en: '7. Recipients and Data Processors',
    fr: '7. Destinataires et sous-traitants',
    de: '7. Empfänger und Datenverarbeiter',
    it: '7. Destinatari e responsabili del trattamento',
    el: '7. Αποδέκτες και υπεργολάβοι επεξεργασίας'
  },

  'Tus datos no se ceden a terceros salvo obligación legal. Para prestar el servicio, contamos con los siguientes proveedores, que actúan como encargados del tratamiento:': {
    en: 'Your data is not shared with third parties except where legally required. To provide the service, we use the following providers, who act as data processors:',
    fr: 'Vos données ne sont pas partagées avec des tiers sauf en cas d\'obligation légale. Pour fournir le service, nous utilisons les fournisseurs suivants, qui agissent comme sous-traitants :',
    de: 'Ihre Daten werden nicht mit Dritten geteilt, außer wenn gesetzlich erforderlich. Um den Dienst bereitzustellen, nutzen wir die folgenden Anbieter, die als Datenverarbeiter fungieren:',
    it: 'I tuoi dati non vengono condivisi con terze parti se non quando richiesto legalmente. Per fornire il servizio, utilizziamo i seguenti provider, che agiscono come responsabili del trattamento:',
    el: 'Τα δεδομένα σας δεν διαμοιράζονται με τρίτους εκτός εάν απαιτείται νόμιμα. Για να παράσχουμε την υπηρεσία, χρησιμοποιούμε τους ακόλουθους παρόχους, οι οποίοι λειτουργούν ως υπεργολάβοι επεξεργασίας:'
  },

  '- Railway (Railway Corp., EE. UU.) — aloja el servidor y la base de datos de este sitio web.': {
    en: '- Railway (Railway Corp., USA) — hosts the server and database for this website.',
    fr: '- Railway (Railway Corp., États-Unis) — héberge le serveur et la base de données de ce site web.',
    de: '- Railway (Railway Corp., USA) — hostet den Server und die Datenbank dieser Website.',
    it: '- Railway (Railway Corp., USA) — ospita il server e il database di questo sito web.',
    el: '- Railway (Railway Corp., USA) — φιλοξενεί το διακομιστή και τη βάση δεδομένων αυτής της ιστοσελίδας.'
  },

  '- Brevo (Sendinblue SAS, Francia) — gestiona el envío de los correos de notificación y confirmación cuando escribes por el formulario de contacto.': {
    en: '- Brevo (Sendinblue SAS, France) — manages the sending of notification and confirmation emails when you write through the contact form.',
    fr: '- Brevo (Sendinblue SAS, France) — gère l\'envoi des emails de notification et de confirmation lorsque vous écrivez via le formulaire de contact.',
    de: '- Brevo (Sendinblue SAS, Frankreich) — verwaltet den Versand von Benachrichtigungs- und Bestätigungs-E-Mails, wenn Sie über das Kontaktformular schreiben.',
    it: '- Brevo (Sendinblue SAS, Francia) — gestisce l\'invio di email di notifica e conferma quando scrivi tramite il modulo di contatto.',
    el: '- Brevo (Sendinblue SAS, Γαλλία) — διαχειρίζεται την αποστολή ειδοποιήσεων και μηνυμάτων ηλεκτρονικού ταχυδρομείου επιβεβαίωσης όταν γράφετε μέσω της φόρμας επικοινωνίας.'
  },

  '- Google Analytics (Google Ireland Ltd. / Google LLC) — actualmente inactivo en este Sitio. Si en el futuro se activa, solo tratará datos de navegación tras tu consentimiento expreso a través del banner de cookies.': {
    en: '- Google Analytics (Google Ireland Ltd. / Google LLC) — currently inactive on this Site. If activated in the future, it will only process navigation data after your explicit consent through the cookie banner.',
    fr: '- Google Analytics (Google Ireland Ltd. / Google LLC) — actuellement inactif sur ce Site. S\'il est activé à l\'avenir, il ne traitera que les données de navigation après votre consentement explicite via la bannière de cookies.',
    de: '- Google Analytics (Google Ireland Ltd. / Google LLC) — derzeit auf dieser Website inaktiv. Falls es in Zukunft aktiviert wird, verarbeitet es nur Navigationsdaten nach Ihrer ausdrücklichen Zustimmung über das Cookie-Banner.',
    it: '- Google Analytics (Google Ireland Ltd. / Google LLC) — attualmente inattivo su questo Sito. Se attivato in futuro, elaborerà solo dati di navigazione dopo il vostro consenso esplicito tramite il banner dei cookie.',
    el: '- Google Analytics (Google Ireland Ltd. / Google LLC) — επί του παρόντος ανενεργό σε αυτόν τον Ιστοχώρο. Εάν ενεργοποιηθεί στο μέλλον, θα επεξεργάζεται μόνο δεδομένα πλοήγησης μετά τη ρητή συγκατάθεσή σας μέσω του banner των cookies.'
  },

  '8. Transferencias internacionales': {
    en: '8. International Transfers',
    fr: '8. Transferts internationaux',
    de: '8. Internationale Datenübertragungen',
    it: '8. Trasferimenti internazionali',
    el: '8. Διεθνείς μεταφορές δεδομένων'
  },

  'Railway y Google son empresas con sede en Estados Unidos. Cuando los datos se procesan fuera del Espacio Económico Europeo, se hace al amparo de las garantías previstas en el RGPD (cláusulas contractuales tipo de la Comisión Europea y, en el caso de Google, su adhesión al marco de protección de datos UE-EE.UU. — EU-U.S. Data Privacy Framework).': {
    en: 'Railway and Google are companies based in the United States. When data is processed outside the European Economic Area, it is done under the safeguards provided in the GDPR (Standard Contractual Clauses of the European Commission and, in the case of Google, its adherence to the EU-U.S. Data Privacy Framework).',
    fr: 'Railway et Google sont des entreprises basées aux États-Unis. Lorsque les données sont traitées en dehors de l\'Espace économique européen, c\'est sous les garanties prévues par le RGPD (clauses contractuelles types de la Commission européenne et, dans le cas de Google, son adhésion au cadre de protection des données UE-États-Unis).',
    de: 'Railway und Google sind Unternehmen mit Sitz in den Vereinigten Staaten. Wenn Daten außerhalb des Europäischen Wirtschaftsraums verarbeitet werden, geschieht dies unter den im DSGVO vorgesehenen Schutzmaßnahmen (Standardvertragsklauseln der Europäischen Kommission und im Fall von Google deren Beitritt zum EU-U.S. Data Privacy Framework).',
    it: 'Railway e Google sono aziende con sede negli Stati Uniti. Quando i dati vengono elaborati al di fuori dello Spazio economico europeo, ciò avviene secondo le garanzie previste dal RGPD (Clausole contrattuali standard della Commissione europea e, nel caso di Google, la sua adesione al quadro di protezione dei dati UE-USA).',
    el: 'Η Railway και η Google είναι εταιρείες με έδρα στις Ηνωμένες Πολιτείες. Όταν τα δεδομένα επεξεργάζονται έξω από τον Ευρωπαϊκό Οικονομικό Χώρο, γίνεται με τις εγγυήσεις που προβλέπονται στο GDPR (Τυποποιημένες Ρήτρες Συμβολαίου της Ευρωπαϊκής Επιτροπής και, στην περίπτωση της Google, η δέσμευσή της με το Πλαίσιο Προστασίας Δεδομένων ΕΕ-ΗΠΑ).'
  },

  '9. Tus derechos': {
    en: '9. Your Rights',
    fr: '9. Vos droits',
    de: '9. Ihre Rechte',
    it: '9. I tuoi diritti',
    el: '9. Τα δικαιώματά σας'
  },

  'Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición escribiendo a info@eureqa3d.com, indicando el derecho que deseas ejercer y adjuntando, si es necesario, un documento que acredite tu identidad. Responderemos a tu solicitud en el plazo legalmente establecido.': {
    en: 'You can exercise at any time your rights of access, rectification, erasure, restriction of processing, data portability, and opposition by writing to info@eureqa3d.com, indicating the right you wish to exercise and attaching, if necessary, a document proving your identity. We will respond to your request within the legally established timeframe.',
    fr: 'Vous pouvez exercer à tout moment vos droits d\'accès, de rectification, d\'effacement, de limitation du traitement, de portabilité et d\'opposition en écrivant à info@eureqa3d.com, en indiquant le droit que vous souhaitez exercer et en joignant, si nécessaire, un document prouvant votre identité. Nous répondrons à votre demande dans le délai légalement établi.',
    de: 'Sie können jederzeit Ihre Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenportabilität und Widerspruch ausüben, indem Sie an info@eureqa3d.com schreiben, das Recht angeben, das Sie ausüben möchten, und falls erforderlich ein Dokument beilegen, das Ihre Identität nachweist. Wir werden auf Ihre Anfrage innerhalb des gesetzlich festgelegten Zeitrahmens antworten.',
    it: 'Puoi esercitare in qualsiasi momento i tuoi diritti di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità e opposizione scrivendo a info@eureqa3d.com, indicando il diritto che desideri esercitare e allegando, se necessario, un documento che provi la tua identità. Risponderemo alla tua richiesta entro il termine legalmente stabilito.',
    el: 'Μπορείτε να ασκήσετε ανά πάσα στιγμή τα δικαιώματα πρόσβασης, διόρθωσης, διaγραφής, περιορισμού της επεξεργασίας, μεταφορability και αντίθεσης γράφοντας στο info@eureqa3d.com, υποδεικνύοντας το δικαίωμα που επιθυμείτε να ασκήσετε και επισυνάπτοντας, εάν είναι απαραίτητο, ένα έγγραφο που αποδεικνύει την ταυτότητά σας. Θα απαντήσουμε στο αίτημά σας εντός του νόμιμα καθορισμένου χρόνου.'
  },

  'Si consideras que el tratamiento de tus datos no se ajusta a la normativa vigente, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), autoridad de control en materia de protección de datos en España.': {
    en: 'If you believe that the processing of your data does not comply with current regulations, you have the right to lodge a complaint with the Spanish Data Protection Agency (AEPD), the supervisory authority for data protection in Spain.',
    fr: 'Si vous pensez que le traitement de vos données n\'est pas conforme à la réglementation en vigueur, vous avez le droit de déposer une plainte auprès de l\'Agence espagnole de protection des données (AEPD), l\'autorité de contrôle en matière de protection des données en Espagne.',
    de: 'Wenn Sie der Meinung sind, dass die Verarbeitung Ihrer Daten nicht den geltenden Vorschriften entspricht, haben Sie das Recht, eine Beschwerde bei der spanischen Datenschutzbehörde (Agencia Española de Protección de Datos, AEPD) einzureichen, der zuständigen Aufsichtsbehörde für Datenschutz in Spanien.',
    it: 'Se ritieni che il trattamento dei tuoi dati non sia conforme alle normative vigenti, hai il diritto di presentare un reclamo all\'Agenzia spagnola per la protezione dei dati (AEPD), l\'autorità di controllo in materia di protezione dei dati in Spagna.',
    el: 'Εάν θεωρείτε ότι η επεξεργασία των δεδομένων σας δεν συμμορφώνεται με τις ισχύουσες κανονιστικές διατάξεις, έχετε το δικαίωμα να υποβάλετε καταγγελία στην Ισπανική Αρχή Προστασίας Δεδομένων (AEPD), την αρμόδια εποπτική αρχή για την προστασία δεδομένων στην Ισπανία.'
  },

  '10. Medidas de seguridad': {
    en: '10. Security Measures',
    fr: '10. Mesures de sécurité',
    de: '10. Sicherheitsmaßnahmen',
    it: '10. Misure di sicurezza',
    el: '10. Μέτρα ασφαλείας'
  },

  'Aplicamos medidas técnicas y organizativas razonables para proteger los datos personales que tratamos frente a accesos no autorizados, pérdida o alteración, adecuadas al riesgo del tratamiento descrito en esta política.': {
    en: 'We apply reasonable technical and organizational measures to protect the personal data we process against unauthorized access, loss, or alteration, appropriate to the risk of processing described in this policy.',
    fr: 'Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger les données personnelles que nous traitons contre l\'accès non autorisé, la perte ou l\'altération, adaptées au risque du traitement décrit dans cette politique.',
    de: 'Wir ergreifen angemessene technische und organisatorische Maßnahmen, um die persönlichen Daten, die wir verarbeiten, vor unbefugtem Zugriff, Verlust oder Änderung zu schützen, passend zum Risiko der in dieser Richtlinie beschriebenen Verarbeitung.',
    it: 'Applichiamo misure tecniche e organizzative ragionevoli per proteggere i dati personali che trattiamo da accessi non autorizzati, perdita o alterazione, appropriate al rischio del trattamento descritto in questa politica.',
    el: 'Εφαρμόζουμε λογικές τεχνικές και οργανωτικές μέτρα για να προστατεύσουμε τα προσωπικά δεδομένα που επεξεργαζόμαστε από μη εξουσιοδοτημένη πρόσβαση, απώλεια ή τροποποίηση, κατάλληλα για τον κίνδυνο της επεξεργασίας που περιγράφεται σε αυτή την πολιτική.'
  },

  '11. Menores de edad': {
    en: '11. Minors',
    fr: '11. Mineurs',
    de: '11. Minderjährige',
    it: '11. Minori',
    el: '11. Ανήλικοι'
  },

  'Este Sitio está dirigido a profesionales del sector salud y no está destinado a menores de edad. No recogemos conscientemente datos de menores a través de los formularios de esta web.': {
    en: 'This Site is directed at healthcare professionals and is not intended for minors. We do not knowingly collect data from minors through the forms on this website.',
    fr: 'Ce Site s\'adresse aux professionnels de la santé et n\'est pas destiné aux mineurs. Nous ne collectons pas consciemment les données des mineurs via les formulaires de ce site web.',
    de: 'Diese Website richtet sich an Gesundheitsfachleute und ist nicht für Minderjährige bestimmt. Wir sammeln nicht bewusst Daten von Minderjährigen über die Formulare auf dieser Website.',
    it: 'Questo Sito è rivolto ai professionisti della salute e non è destinato a minori. Non raccogliamo consapevolmente dati da minori tramite i moduli su questo sito web.',
    el: 'Αυτός ο Ιστοχώρος απευθύνεται σε επαγγελματίες υγείας και δεν προορίζεται για ανηλίκους. Δεν συλλέγουμε επίτηδες δεδομένα από ανηλίκους μέσω των φορμών σε αυτήν την ιστοσελίδα.'
  },

  '12. Cambios en esta política': {
    en: '12. Changes to This Policy',
    fr: '12. Modifications de cette politique',
    de: '12. Änderungen dieser Richtlinie',
    it: '12. Modifiche a questa politica',
    el: '12. Αλλαγές σε αυτή την πολιτική'
  },

  'Podemos actualizar esta política de privacidad para adaptarla a cambios legislativos o en nuestros servicios. La fecha de la última actualización figura al principio de esta página.': {
    en: 'We may update this privacy policy to adapt it to legislative changes or changes in our services. The date of the last update is shown at the beginning of this page.',
    fr: 'Nous pouvons mettre à jour cette politique de confidentialité pour l\'adapter aux changements législatifs ou aux modifications de nos services. La date de la dernière mise à jour est indiquée au début de cette page.',
    de: 'Wir können diese Datenschutzrichtlinie aktualisieren, um sie an Gesetzesänderungen oder Änderungen unserer Dienstleistungen anzupassen. Das Datum der letzten Aktualisierung finden Sie am Anfang dieser Seite.',
    it: 'Possiamo aggiornare questa politica sulla privacy per adattarla a cambiamenti legislativi o modifiche ai nostri servizi. La data dell\'ultimo aggiornamento è mostrata all\'inizio di questa pagina.',
    el: 'Ενδέχεται να ενημερώσουμε αυτή την πολιτική απορρήτου για να την προσαρμόσουμε σε νομοθετικές αλλαγές ή αλλαγές στις υπηρεσίες μας. Η ημερομηνία της τελευταίας ενημέρωσης εμφανίζεται στην αρχή αυτής της σελίδας.'
  },

  // ============================================================================
  // COOKIE POLICY / POLÍTICA DE COOKIES
  // ============================================================================

  'Política de cookies — Eureqa3D': {
    en: 'Cookie Policy — Eureqa3D',
    fr: 'Politique sur les cookies — Eureqa3D',
    de: 'Cookie-Richtlinie — Eureqa3D',
    it: 'Politica sui cookie — Eureqa3D',
    el: 'Πολιτική cookies — Eureqa3D'
  },

  'POLÍTICA DE COOKIES': {
    en: 'COOKIE POLICY',
    fr: 'POLITIQUE SUR LES COOKIES',
    de: 'COOKIE-RICHTLINIE',
    it: 'POLITICA SUI COOKIE',
    el: 'ΠΟΛΙΤΙΚΉ ΣΧΕΤΙΚΆ ΜΕ ΤΑ COOKIES'
  },

  'Política de cookies': {
    en: 'Cookie Policy',
    fr: 'Politique sur les cookies',
    de: 'Cookie-Richtlinie',
    it: 'Politica sui cookie',
    el: 'Πολιτική cookies'
  },

  '1. Qué es una cookie': {
    en: '1. What is a Cookie',
    fr: '1. Qu\'est-ce qu\'un cookie',
    de: '1. Was ist ein Cookie',
    it: '1. Che cos\'è un cookie',
    el: '1. Τι είναι ένα cookie'
  },

  'Una cookie es un pequeño archivo que un sitio web guarda en tu navegador para recordar información entre visitas o durante tu sesión. Este sitio web también usa <strong>almacenamiento local del navegador (localStorage)</strong>, una tecnología similar que, a diferencia de las cookies, no se envía automáticamente a nuestro servidor: los datos se quedan en tu propio dispositivo.': {
    en: 'A cookie is a small file that a website stores in your browser to remember information between visits or during your session. This website also uses <strong>browser local storage (localStorage)</strong>, a similar technology that, unlike cookies, is not automatically sent to our server: the data remains on your own device.',
    fr: 'Un cookie est un petit fichier qu\'un site web stocke dans votre navigateur pour mémoriser les informations entre les visites ou pendant votre session. Ce site web utilise également le <strong>stockage local du navigateur (localStorage)</strong>, une technologie similaire qui, contrairement aux cookies, n\'est pas automatiquement envoyée à notre serveur : les données restent sur votre propre appareil.',
    de: 'Ein Cookie ist eine kleine Datei, die eine Website in Ihrem Browser speichert, um Informationen zwischen Besuchen oder während Ihrer Sitzung zu speichern. Diese Website verwendet auch den <strong>lokalen Browser-Speicher (localStorage)</strong>, eine ähnliche Technologie, die im Gegensatz zu Cookies nicht automatisch an unseren Server gesendet wird: Die Daten bleiben auf Ihrem Gerät.',
    it: 'Un cookie è un piccolo file che un sito web memorizza nel tuo browser per ricordare le informazioni tra le visite o durante la tua sessione. Questo sito web utilizza anche l\'<strong>archiviazione locale del browser (localStorage)</strong>, una tecnologia simile che, a differenza dei cookie, non viene inviata automaticamente al nostro server: i dati rimangono sul tuo dispositivo.',
    el: 'Ένα cookie είναι ένα μικρό αρχείο που μια ιστοσελίδα αποθηκεύει στο πρόγραμμα περιήγησής σας για να θυμάται πληροφορίες μεταξύ επισκέψεων ή κατά τη διάρκεια της συνεδρίας σας. Αυτή η ιστοσελίδα χρησιμοποιεί επίσης <strong>τοπικό αποθηκευτικό χώρο του προγράμματος περιήγησης (localStorage)</strong>, μια παρόμοια τεχνολογία που, σε αντίθεση με τα cookies, δεν αποστέλλεται αυτόματα στο διακομιστή μας: τα δεδομένα παραμένουν στη δική σας συσκευή.'
  },

  '2. Qué usamos hoy en este sitio web': {
    en: '2. What We Use Today on This Website',
    fr: '2. Ce que nous utilisons aujourd\'hui sur ce site web',
    de: '2. Was wir heute auf dieser Website verwenden',
    it: '2. Quello che usiamo oggi su questo sito web',
    el: '2. Αυτό που χρησιμοποιούμε σήμερα σε αυτήν την ιστοσελίδα'
  },

  'Si navegas por las páginas públicas de este Sitio sin iniciar sesión, <strong>no se instala ninguna cookie de seguimiento ni analítica</strong>. Concretamente:': {
    en: 'If you navigate the public pages of this Site without logging in, <strong>no tracking or analytics cookies are installed</strong>. Specifically:',
    fr: 'Si vous naviguez dans les pages publiques de ce Site sans vous connecter, <strong>aucun cookie de suivi ou d\'analyse n\'est installé</strong>. Concrètement :',
    de: 'Wenn Sie die öffentlichen Seiten dieser Website durchsuchen, ohne sich anzumelden, <strong>werden keine Tracking- oder Analyse-Cookies installiert</strong>. Insbesondere:',
    it: 'Se navighi le pagine pubbliche di questo Sito senza accedere, <strong>non vengono installati cookie di tracciamento o analitici</strong>. Nello specifico:',
    el: 'Εάν περιηγηθείτε στις δημόσιες σελίδες αυτού του Ιστοχώρου χωρίς να συνδεθείτε, <strong>δεν εγκαθίστανται cookies παρακολούθησης ή ανάλυσης</strong>. Συγκεκριμένα:'
  },

  '- connect.sid: Cookie técnica (propia). Mantiene tu sesión iniciada si accedes al panel privado o al visor de casos. Solo se crea si inicias sesión; no afecta a la navegación pública. Duración: 7 días o hasta cerrar sesión.': {
    en: '- connect.sid: Technical cookie (own). Keeps your session active if you access the private panel or case viewer. Only created if you log in; does not affect public navigation. Duration: 7 days or until you log out.',
    fr: '- connect.sid : Cookie technique (propre). Maintient votre session active si vous accédez au panneau privé ou à la visionneuse de cas. Créé uniquement si vous vous connectez; n\'affecte pas la navigation publique. Durée : 7 jours ou jusqu\'à votre déconnexion.',
    de: '- connect.sid: Technisches Cookie (eigenes). Behält Ihre Sitzung bei, wenn Sie auf das private Panel oder den Case Viewer zugreifen. Wird nur erstellt, wenn Sie sich anmelden; beeinflusst nicht die öffentliche Navigation. Dauer: 7 Tage oder bis zur Abmeldung.',
    it: '- connect.sid: Cookie tecnico (proprio). Mantiene la tua sessione attiva se accedi al pannello privato o al visualizzatore di casi. Creato solo se accedi; non influisce sulla navigazione pubblica. Durata: 7 giorni o fino alla disconnessione.',
    el: '- connect.sid: Τεχνικό cookie (δικό μας). Διατηρεί τη συνεδρία σας ενεργή εάν αποκτάτε πρόσβαση στον ιδιωτικό πίνακα ή στο πρόγραμμα προβολής περιπτώσεων. Δημιουργείται μόνο εάν συνδεθείτε· δεν επηρεάζει τη δημόσια πλοήγηση. Διάρκεια: 7 ημέρες ή έως τη διαδρομή αποσύνδεσης.'
  },

  '- eureqa3d_lang: localStorage (propio, no es una cookie). Recuerda el idioma que has elegido en el selector de banderas. Duración: Hasta que lo borres o cambies de idioma.': {
    en: '- eureqa3d_lang: localStorage (own, not a cookie). Remembers the language you selected in the flag selector. Duration: Until you delete it or change language.',
    fr: '- eureqa3d_lang : localStorage (propre, ce n\'est pas un cookie). Mémorise la langue que vous avez sélectionnée dans le sélecteur de drapeaux. Durée : Jusqu\'à ce que vous la supprimiez ou changiez de langue.',
    de: '- eureqa3d_lang: localStorage (eigenes, kein Cookie). Merkt sich die Sprache, die Sie in der Flaggenauswahl ausgewählt haben. Dauer: Bis Sie sie löschen oder die Sprache ändern.',
    it: '- eureqa3d_lang: localStorage (proprio, non è un cookie). Ricorda la lingua che hai selezionato nel selettore di bandiere. Durata: Fino a quando non la elimini o cambi lingua.',
    el: '- eureqa3d_lang: localStorage (δικό μας, δεν είναι cookie). Θυμάται τη γλώσσα που επιλέξατε στο πρόγραμμα επιλογής σημαιών. Διάρκεια: Έως ότου το διαγράψετε ή αλλάξετε γλώσσα.'
  },

  '- eureqa3d_cookie_consent: localStorage (propio, no es una cookie). Recuerda si aceptaste o rechazaste las cookies analíticas, para no volver a preguntarte en cada visita. Duración: Hasta que lo borres o cambies tu elección.': {
    en: '- eureqa3d_cookie_consent: localStorage (own, not a cookie). Remembers whether you accepted or rejected analytics cookies, so we don\'t ask you again on each visit. Duration: Until you delete it or change your choice.',
    fr: '- eureqa3d_cookie_consent : localStorage (propre, ce n\'est pas un cookie). Mémorise si vous avez accepté ou refusé les cookies d\'analyse, afin que nous ne vous le demandions plus à chaque visite. Durée : Jusqu\'à ce que vous la supprimiez ou changiez votre choix.',
    de: '- eureqa3d_cookie_consent: localStorage (eigenes, kein Cookie). Merkt sich, ob Sie Analyse-Cookies akzeptiert oder abgelehnt haben, sodass wir Sie bei jedem Besuch nicht erneut fragen. Dauer: Bis Sie es löschen oder Ihre Wahl ändern.',
    it: '- eureqa3d_cookie_consent: localStorage (proprio, non è un cookie). Ricorda se hai accettato o rifiutato i cookie analitici, in modo da non doverti chiedere di nuovo ad ogni visita. Durata: Fino a quando non lo elimini o cambi la tua scelta.',
    el: '- eureqa3d_cookie_consent: localStorage (δικό μας, δεν είναι cookie). Θυμάται εάν δεχθήκατε ή απορρίψατε τα cookies ανάλυσης, ώστε να μην σας ρωτήσουμε ξανά σε κάθε επίσκεψη. Διάρκεια: Έως ότου το διαγράψετε ή αλλάξετε την επιλογή σας.'
  },

  '3. Cookies analíticas (Google Analytics) — solo si las aceptas': {
    en: '3. Analytics Cookies (Google Analytics) — only if you accept them',
    fr: '3. Cookies d\'analyse (Google Analytics) — uniquement si vous les acceptez',
    de: '3. Analyse-Cookies (Google Analytics) — nur wenn Sie sie akzeptieren',
    it: '3. Cookie analitici (Google Analytics) — solo se li accetti',
    el: '3. Cookies ανάλυσης (Google Analytics) — μόνο εάν τα δεχθείτε'
  },

  'Este Sitio está preparado para usar Google Analytics 4 con el fin de entender, de forma agregada, qué páginas se visitan más y en qué idioma. <strong>A día de hoy esta herramienta está desactivada.</strong> Si en el futuro se activa, antes de instalar ninguna cookie de Google te pediremos tu consentimiento mediante el banner que aparece al entrar en la web. Si activamos Analytics, las cookies que instalaría serían, orientativamente:': {
    en: 'This Site is set up to use Google Analytics 4 in order to understand, in aggregate, which pages are visited most and in which language. <strong>As of today, this tool is inactive.</strong> If it is activated in the future, before installing any Google cookie, we will ask for your consent through the banner that appears when you enter the website. If we activate Analytics, the cookies it would install would be, roughly:',
    fr: 'Ce Site est configuré pour utiliser Google Analytics 4 afin de comprendre, de façon agrégée, quelles pages sont visitées le plus et dans quelle langue. <strong>À ce jour, cet outil est désactivé.</strong> S\'il est activé à l\'avenir, avant d\'installer un cookie Google, nous vous demandons votre consentement via la bannière qui apparaît lorsque vous entrez sur le site. Si nous activons Analytics, les cookies qu\'il installerait seraient, orientatif :',
    de: 'Diese Website ist für die Verwendung von Google Analytics 4 konfiguriert, um zu verstehen, wie Seiten zusammengefasst am meisten besucht werden und in welcher Sprache. <strong>Heute ist dieses Tool inaktiv.</strong> Sollte es in Zukunft aktiviert werden, werden wir vor der Installation eines Google-Cookies Ihre Zustimmung über das Banner anfordern, das beim Betreten der Website erscheint. Wenn wir Analytics aktivieren, wären die Cookies, die es installieren würde, grob gesagt:',
    it: 'Questo Sito è configurato per utilizzare Google Analytics 4 al fine di comprendere, in modo aggregato, quali pagine vengono visitate più frequentemente e in quale lingua. <strong>Ad oggi, questo strumento è disattivato.</strong> Se attivato in futuro, prima di installare un cookie Google, ti chiederemo il tuo consenso tramite il banner che appare quando entri nel sito web. Se attivassimo Analytics, i cookie che instalerebbe sarebbero, indicativamente:',
    el: 'Αυτός ο Ιστοχώρος είναι ρυθμισμένος για τη χρήση του Google Analytics 4 για να καταλάβει, συνολικά, ποιες σελίδες επισκέπτονται περισσότερο και σε ποια γλώσσα. <strong>Σήμερα, αυτό το εργαλείο είναι ανενεργό.</strong> Εάν ενεργοποιηθεί στο μέλλον, πριν εγκαταστήσουμε ένα cookie της Google, θα σας ζητήσουμε τη συγκατάθεσή σας μέσω του banner που εμφανίζεται όταν εισέλθετε στην ιστοσελίδα. Εάν ενεργοποιούσαμε Analytics, τα cookies που θα εγκατέστησε θα ήταν, κατά προσέγγιση:'
  },

  '- _ga: Google Analytics. Distingue usuarios de forma anónima para las estadísticas de uso. Duración: Hasta 2 años.': {
    en: '- _ga: Google Analytics. Distinguishes users anonymously for usage statistics. Duration: Up to 2 years.',
    fr: '- _ga : Google Analytics. Distingue les utilisateurs de manière anonyme pour les statistiques d\'utilisation. Durée : Jusqu\'à 2 ans.',
    de: '- _ga: Google Analytics. Unterscheidet Benutzer anonym für Nutzungsstatistiken. Dauer: Bis zu 2 Jahre.',
    it: '- _ga: Google Analytics. Distingue gli utenti in modo anonimo per le statistiche di utilizzo. Durata: Fino a 2 anni.',
    el: '- _ga: Google Analytics. Διακρίνει τους χρήστες ανώνυμα για τις στατιστικές χρήσης. Διάρκεια: Έως 2 χρόνια.'
  },

  '- _ga_*: Google Analytics. Mantiene el estado de la sesión de navegación para las estadísticas. Duración: Hasta 2 años.': {
    en: '- _ga_*: Google Analytics. Maintains the status of the browsing session for statistics. Duration: Up to 2 years.',
    fr: '- _ga_* : Google Analytics. Maintient l\'état de la session de navigation pour les statistiques. Durée : Jusqu\'à 2 ans.',
    de: '- _ga_*: Google Analytics. Behält den Status der Browser-Sitzung für Statistiken bei. Dauer: Bis zu 2 Jahre.',
    it: '- _ga_*: Google Analytics. Mantiene lo stato della sessione di navigazione per le statistiche. Durata: Fino a 2 anni.',
    el: '- _ga_*: Google Analytics. Διατηρεί την κατάσταση της συνεδρίας περιήγησης για τις στατιστικές. Διάρκεια: Έως 2 χρόνια.'
  },

  '4. Cómo gestionar tu consentimiento': {
    en: '4. How to Manage Your Consent',
    fr: '4. Comment gérer votre consentement',
    de: '4. Wie Sie Ihre Zustimmung verwalten',
    it: '4. Come gestire il tuo consenso',
    el: '4. Πώς να διαχειριστείτε τη συγκατάθεσή σας'
  },

  '5. Más información': {
    en: '5. More Information',
    fr: '5. Plus d\'informations',
    de: '5. Weitere Informationen',
    it: '5. Maggiori informazioni',
    el: '5. Περισσότερες πληροφορίες'
  },

  'Puedes cambiar en cualquier momento la decisión que tomaste en el banner de cookies. También puedes bloquear o eliminar las cookies en cualquier momento desde la configuración de tu navegador (Chrome, Firefox, Safari, Edge u otro). Ten en cuenta que bloquear la cookie técnica connect.sid te impedirá mantener la sesión iniciada en el panel privado.': {
    en: 'You can change your cookie banner decision at any time. You can also block or delete cookies at any time from your browser settings (Chrome, Firefox, Safari, Edge, or other). Please note that blocking the technical cookie connect.sid will prevent you from maintaining your session in the private panel.',
    fr: 'Vous pouvez modifier votre décision sur la bannière de cookies à tout moment. Vous pouvez également bloquer ou supprimer les cookies à tout moment dans les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge ou autre). Notez que bloquer le cookie technique connect.sid vous empêchera de maintenir votre session dans le panneau privé.',
    de: 'Sie können Ihre Cookie-Banner-Entscheidung jederzeit ändern. Sie können auch Cookies jederzeit in den Einstellungen Ihres Browsers (Chrome, Firefox, Safari, Edge oder andere) blockieren oder löschen. Beachten Sie, dass das Blockieren des technischen Cookies connect.sid Sie daran hindert, Ihre Sitzung im privaten Panel beizubehalten.',
    it: 'Puoi modificare la tua decisione sul banner dei cookie in qualsiasi momento. Puoi anche bloccare o eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser (Chrome, Firefox, Safari, Edge o altri). Tieni presente che il blocco del cookie tecnico connect.sid ti impedirà di mantenere la tua sessione nel pannello privato.',
    el: 'Μπορείτε να αλλάξετε την απόφασή σας για το banner των cookies ανά πάσα στιγμή. Μπορείτε επίσης να αποκλείσετε ή να διαγράψετε cookies ανά πάσα στιγμή από τις ρυθμίσεις του προγράμματος περιήγησής σας (Chrome, Firefox, Safari, Edge ή άλλο). Σημειώστε ότι το αποκλεισμό του τεχνικού cookie connect.sid θα σας εμποδίσει να διατηρήσετε τη συνεδρία σας στον ιδιωτικό πίνακα.'
  },

  'Puedes cambiar en cualquier momento la decisión que tomaste en el banner de cookies:': {
    en: 'You can change your cookie banner decision at any time:',
    fr: 'Vous pouvez modifier votre décision sur la bannière de cookies à tout moment :',
    de: 'Sie können Ihre Cookie-Banner-Entscheidung jederzeit ändern:',
    it: 'Puoi modificare la tua decisione sul banner dei cookie in qualsiasi momento:',
    el: 'Μπορείτε να αλλάξετε την απόφασή σας για το banner των cookies ανά πάσα στιγμή:'
  },

  'También puedes bloquear o eliminar las cookies en cualquier momento desde la configuración de tu navegador. Ten en cuenta que bloquear la cookie técnica <code>connect.sid</code> te impedirá mantener la sesión iniciada en el panel privado. Instrucciones para los navegadores más comunes:': {
    en: 'You can also block or delete cookies at any time from your browser settings. Please note that blocking the technical cookie <code>connect.sid</code> will prevent you from staying logged into the private panel. Instructions for the most common browsers:',
    fr: 'Vous pouvez également bloquer ou supprimer les cookies à tout moment dans les paramètres de votre navigateur. Notez que bloquer le cookie technique <code>connect.sid</code> vous empêchera de rester connecté au panneau privé. Instructions pour les navigateurs les plus courants :',
    de: 'Sie können Cookies auch jederzeit in den Einstellungen Ihres Browsers blockieren oder löschen. Beachten Sie, dass das Blockieren des technischen Cookies <code>connect.sid</code> Sie daran hindert, im privaten Panel angemeldet zu bleiben. Anleitungen für die gängigsten Browser:',
    it: 'Puoi anche bloccare o eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser. Tieni presente che il blocco del cookie tecnico <code>connect.sid</code> ti impedirà di rimanere connesso al pannello privato. Istruzioni per i browser più comuni:',
    el: 'Μπορείτε επίσης να αποκλείσετε ή να διαγράψετε cookies ανά πάσα στιγμή από τις ρυθμίσεις του προγράμματος περιήγησής σας. Σημειώστε ότι το αποκλεισμό του τεχνικού cookie <code>connect.sid</code> θα σας εμποδίσει να παραμείνετε συνδεδεμένοι στον ιδιωτικό πίνακα. Οδηγίες για τους πιο συνηθισμένους browsers:'
  },

  'Consulta también nuestra <a href="/politica-privacidad">Política de privacidad</a> y nuestro <a href="/aviso-legal">Aviso legal</a>. Para cualquier duda sobre cookies, escríbenos a <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.': {
    en: 'See also our <a href="/politica-privacidad">Privacy Policy</a> and our <a href="/aviso-legal">Legal Notice</a>. For any question about cookies, write to us at <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    fr: 'Consultez également notre <a href="/politica-privacidad">Politique de confidentialité</a> et nos <a href="/aviso-legal">Mentions légales</a>. Pour toute question sur les cookies, écrivez-nous à <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    de: 'Beachten Sie auch unsere <a href="/politica-privacidad">Datenschutzerklärung</a> und unser <a href="/aviso-legal">Impressum</a>. Bei Fragen zu Cookies schreiben Sie uns an <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    it: 'Consulta anche la nostra <a href="/politica-privacidad">Informativa sulla privacy</a> e le nostre <a href="/aviso-legal">Note legali</a>. Per qualsiasi dubbio sui cookie, scrivici a <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.',
    el: 'Συμβουλευτείτε επίσης την <a href="/politica-privacidad">Πολιτική απορρήτου</a> και τη <a href="/aviso-legal">Νομική σημείωση</a> μας. Για οποιαδήποτε απορία σχετικά με τα cookies, γράψτε μας στο <a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>.'
  },

  /* ── Tabla de cookies ── */
  'Nombre': { en: 'Name', fr: 'Nom', de: 'Name', it: 'Nome', el: 'Όνομα' },
  'Tipo': { en: 'Type', fr: 'Type', de: 'Typ', it: 'Tipo', el: 'Τύπος' },
  'Finalidad': { en: 'Purpose', fr: 'Finalité', de: 'Zweck', it: 'Finalità', el: 'Σκοπός' },
  'Duración': { en: 'Duration', fr: 'Durée', de: 'Dauer', it: 'Durata', el: 'Διάρκεια' },
  'Proveedor': { en: 'Provider', fr: 'Fournisseur', de: 'Anbieter', it: 'Fornitore', el: 'Πάροχος' },
  'Cookie técnica (propia)': { en: 'Technical cookie (own)', fr: 'Cookie technique (propre)', de: 'Technisches Cookie (eigenes)', it: 'Cookie tecnico (proprio)', el: 'Τεχνικό cookie (δικό μας)' },
  'localStorage (propio, no es una cookie)': { en: 'localStorage (own, not a cookie)', fr: 'localStorage (propre, ce n\'est pas un cookie)', de: 'localStorage (eigenes, kein Cookie)', it: 'localStorage (proprio, non è un cookie)', el: 'localStorage (δικό μας, δεν είναι cookie)' },
  'Mantiene tu sesión iniciada si accedes al panel privado o al visor de casos. Solo se crea si inicias sesión; no afecta a la navegación pública.': {
    en: 'Keeps your session active if you access the private panel or case viewer. Only created if you log in; does not affect public navigation.',
    fr: 'Maintient votre session active si vous accédez au panneau privé ou à la visionneuse de cas. Créé uniquement si vous vous connectez ; n\'affecte pas la navigation publique.',
    de: 'Hält Ihre Sitzung aktiv, wenn Sie auf das private Panel oder den Case Viewer zugreifen. Wird nur erstellt, wenn Sie sich anmelden; beeinflusst nicht die öffentliche Navigation.',
    it: 'Mantiene la tua sessione attiva se accedi al pannello privato o al visualizzatore di casi. Creato solo se accedi; non influisce sulla navigazione pubblica.',
    el: 'Διατηρεί τη συνεδρία σας ενεργή εάν αποκτάτε πρόσβαση στον ιδιωτικό πίνακα ή στο πρόγραμμα προβολής περιπτώσεων. Δημιουργείται μόνο εάν συνδεθείτε· δεν επηρεάζει τη δημόσια πλοήγηση.'
  },
  '7 días o hasta cerrar sesión': { en: '7 days or until logout', fr: '7 jours ou jusqu\'à la déconnexion', de: '7 Tage oder bis zur Abmeldung', it: '7 giorni o fino alla disconnessione', el: '7 ημέρες ή έως την αποσύνδεση' },
  'Recuerda el idioma que has elegido en el selector de banderas.': {
    en: 'Remembers the language you selected in the flag selector.',
    fr: 'Mémorise la langue que vous avez sélectionnée dans le sélecteur de drapeaux.',
    de: 'Merkt sich die Sprache, die Sie in der Flaggenauswahl ausgewählt haben.',
    it: 'Ricorda la lingua che hai selezionato nel selettore di bandiere.',
    el: 'Θυμάται τη γλώσσα που επιλέξατε στο πρόγραμμα επιλογής σημαιών.'
  },
  'Hasta que lo borres o cambies de idioma': { en: 'Until you delete it or change language', fr: 'Jusqu\'à ce que vous le supprimiez ou changiez de langue', de: 'Bis Sie es löschen oder die Sprache ändern', it: 'Fino a quando non lo elimini o cambi lingua', el: 'Έως ότου το διαγράψετε ή αλλάξετε γλώσσα' },
  'Recuerda si aceptaste o rechazaste las cookies analíticas, para no volver a preguntarte en cada visita.': {
    en: 'Remembers whether you accepted or rejected analytics cookies, so we don\'t ask you again on each visit.',
    fr: 'Mémorise si vous avez accepté ou refusé les cookies d\'analyse, afin de ne pas vous le redemander à chaque visite.',
    de: 'Merkt sich, ob Sie Analyse-Cookies akzeptiert oder abgelehnt haben, damit wir Sie nicht bei jedem Besuch erneut fragen.',
    it: 'Ricorda se hai accettato o rifiutato i cookie analitici, per non chiedertelo di nuovo a ogni visita.',
    el: 'Θυμάται εάν δεχθήκατε ή απορρίψατε τα cookies ανάλυσης, ώστε να μην σας ρωτάμε ξανά σε κάθε επίσκεψη.'
  },
  'Hasta que lo borres o cambies tu elección': { en: 'Until you delete it or change your choice', fr: 'Jusqu\'à ce que vous le supprimiez ou changiez votre choix', de: 'Bis Sie es löschen oder Ihre Wahl ändern', it: 'Fino a quando non lo elimini o cambi la tua scelta', el: 'Έως ότου το διαγράψετε ή αλλάξετε την επιλογή σας' },
  'Distingue usuarios de forma anónima para las estadísticas de uso.': {
    en: 'Distinguishes users anonymously for usage statistics.',
    fr: 'Distingue les utilisateurs de manière anonyme pour les statistiques d\'utilisation.',
    de: 'Unterscheidet Benutzer anonym für Nutzungsstatistiken.',
    it: 'Distingue gli utenti in modo anonimo per le statistiche di utilizzo.',
    el: 'Διακρίνει τους χρήστες ανώνυμα για τις στατιστικές χρήσης.'
  },
  'Hasta 2 años': { en: 'Up to 2 years', fr: 'Jusqu\'à 2 ans', de: 'Bis zu 2 Jahre', it: 'Fino a 2 anni', el: 'Έως 2 χρόνια' },
  'Mantiene el estado de la sesión de navegación para las estadísticas.': {
    en: 'Maintains the browsing session state for statistics.',
    fr: 'Maintient l\'état de la session de navigation pour les statistiques.',
    de: 'Behält den Status der Browser-Sitzung für Statistiken bei.',
    it: 'Mantiene lo stato della sessione di navigazione per le statistiche.',
    el: 'Διατηρεί την κατάσταση της συνεδρίας περιήγησης για τις στατιστικές.'
  },

  /* ── Otros huecos sueltos ── */
  '7 días': { en: '7 days', fr: '7 jours', de: '7 Tage', it: '7 giorni', el: '7 ημέρες' },
  'Total': { en: 'Total', fr: 'Total', de: 'Gesamt', it: 'Totale', el: 'Σύνολο' },
  'RGPD': { en: 'GDPR', fr: 'RGPD', de: 'DSGVO', it: 'GDPR', el: 'ΓΚΠΔ' },
  'Ver detalle →': { en: 'View details →', fr: 'Voir le détail →', de: 'Mehr erfahren →', it: 'Vedi dettagli →', el: 'Δείτε λεπτομέρειες →' },

  'Modelos 3D quirúrgicos para planificación preoperatoria | Eureqa3D': {
    en: 'Surgical 3D Models for Preoperative Planning | Eureqa3D',
    fr: 'Modèles 3D chirurgicaux pour la planification préopératoire | Eureqa3D',
    de: 'Chirurgische 3D-Modelle für die präoperative Planung | Eureqa3D',
    it: 'Modelli 3D chirurgici per la pianificazione preoperatoria | Eureqa3D',
    el: 'Χειρουργικά μοντέλα 3D για προεγχειρητικό σχεδιασμό | Eureqa3D'
  },
  'Quiénes somos — Empresa de impresión 3D quirúrgica': {
    en: 'About Us — Surgical 3D Printing Company',
    fr: 'Qui sommes-nous — Entreprise d\'impression 3D chirurgicale',
    de: 'Über uns — Unternehmen für chirurgischen 3D-Druck',
    it: 'Chi siamo — Azienda di stampa 3D chirurgica',
    el: 'Ποιοι είμαστε — Εταιρεία χειρουργικής τρισδιάστατης εκτύπωσης'
  },
  'Método Eureqa — Proceso de impresión 3D quirúrgica RGPD': {
    en: 'Eureqa Method — GDPR-Compliant Surgical 3D Printing Process',
    fr: 'Méthode Eureqa — Processus d\'impression 3D chirurgicale conforme RGPD',
    de: 'Eureqa-Methode — DSGVO-konformer chirurgischer 3D-Druckprozess',
    it: 'Metodo Eureqa — Processo di stampa 3D chirurgica conforme al RGPD',
    el: 'Μέθοδος Eureqa — Διαδικασία χειρουργικής τρισδιάστατης εκτύπωσης σύμφωνη με τον GDPR'
  },
  'Modelos 3D para traumatología — Impresión 3D de fracturas complejas': {
    en: '3D Models for Traumatology — 3D Printing of Complex Fractures',
    fr: 'Modèles 3D pour la traumatologie — Impression 3D de fractures complexes',
    de: '3D-Modelle für die Traumatologie — 3D-Druck komplexer Frakturen',
    it: 'Modelli 3D per la traumatologia — Stampa 3D di fratture complesse',
    el: 'Μοντέλα 3D για την τραυματολογία — Τρισδιάστατη εκτύπωση σύνθετων καταγμάτων'
  },
  'Impresión 3D oncológica — Modelos para cirugía tumor': {
    en: 'Oncological 3D Printing — Models for Tumor Surgery',
    fr: 'Impression 3D oncologique — Modèles pour la chirurgie tumorale',
    de: 'Onkologischer 3D-Druck — Modelle für die Tumorchirurgie',
    it: 'Stampa 3D oncologica — Modelli per la chirurgia del tumore',
    el: 'Ογκολογική τρισδιάστατη εκτύπωση — Μοντέλα για χειρουργική όγκου'
  },
  'Visor 3D interactivo para modelos anatómicos quirúrgicos': {
    en: 'Interactive 3D Viewer for Surgical Anatomical Models',
    fr: 'Visionneuse 3D interactive pour modèles anatomiques chirurgicaux',
    de: 'Interaktiver 3D-Viewer für chirurgische Anatomiemodelle',
    it: 'Visualizzatore 3D interattivo per modelli anatomici chirurgici',
    el: 'Διαδραστικός προβολέας 3D για χειρουργικά ανατομικά μοντέλα'
  },

  '<span class="ic" data-ic="mail"></span><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>': {
    en: '<span class="ic" data-ic="mail"></span><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>',
    fr: '<span class="ic" data-ic="mail"></span><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>',
    de: '<span class="ic" data-ic="mail"></span><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>',
    it: '<span class="ic" data-ic="mail"></span><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>',
    el: '<span class="ic" data-ic="mail"></span><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a>'
  },
  '<span class="ic" data-ic="twitter"></span><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a>': {
    en: '<span class="ic" data-ic="twitter"></span><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a>',
    fr: '<span class="ic" data-ic="twitter"></span><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a>',
    de: '<span class="ic" data-ic="twitter"></span><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a>',
    it: '<span class="ic" data-ic="twitter"></span><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a>',
    el: '<span class="ic" data-ic="twitter"></span><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a>'
  },
  '<span class="ic" data-ic="mapPin"></span><span>Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres</span>': {
    en: '<span class="ic" data-ic="mapPin"></span><span>Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres</span>',
    fr: '<span class="ic" data-ic="mapPin"></span><span>Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres</span>',
    de: '<span class="ic" data-ic="mapPin"></span><span>Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres</span>',
    it: '<span class="ic" data-ic="mapPin"></span><span>Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres</span>',
    el: '<span class="ic" data-ic="mapPin"></span><span>Centro iNovo, Av. Miajadas, 32, 10200 Trujillo, Cáceres</span>'
  },

  /* ══════════════════════════════════════════════════════════════════════════
     FAQ PAGE — Preguntas frecuentes
     ══════════════════════════════════════════════════════════════════════════ */
  'Preguntas frecuentes': { en: 'Frequently Asked Questions', fr: 'Questions fréquentes', de: 'Häufig gestellte Fragen', it: 'Domande frequenti', el: 'Συχνές ερωτήσεις' },
  'Preguntas frecuentes — Impresión 3D quirúrgica | Eureqa3D': {
    en: 'Frequently Asked Questions — Surgical 3D Printing | Eureqa3D',
    fr: 'Questions fréquentes — Impression 3D chirurgicale | Eureqa3D',
    de: 'Häufig gestellte Fragen — Chirurgischer 3D-Druck | Eureqa3D',
    it: 'Domande frequenti — Stampa 3D chirurgica | Eureqa3D',
    el: 'Συχνές ερωτήσεις — Χειρουργική τρισδιάστατη εκτύπωση | Eureqa3D'
  },
  'Dudas sobre impresión 3D quirúrgica': { en: 'Questions about surgical 3D printing', fr: 'Questions sur l\'impression 3D chirurgicale', de: 'Fragen zum chirurgischen 3D-Druck', it: 'Domande sulla stampa 3D chirurgica', el: 'Ερωτήσεις σχετικά με τη χειρουργική τρισδιάστατη εκτύπωση' },
  'Respuestas a las preguntas más comunes sobre el Método Eureqa, timeline, confidencialidad y especialidades.': {
    en: 'Answers to the most common questions about the Eureqa Method, timeline, confidentiality and specialties.',
    fr: 'Réponses aux questions les plus fréquentes sur la Méthode Eureqa, les délais, la confidentialité et les spécialités.',
    de: 'Antworten auf die häufigsten Fragen zur Eureqa-Methode, zum Zeitplan, zur Vertraulichkeit und zu den Fachbereichen.',
    it: 'Risposte alle domande più comuni sul Metodo Eureqa, tempistiche, riservatezza e specialità.',
    el: 'Απαντήσεις στις πιο συνηθισμένες ερωτήσεις σχετικά με τη Μέθοδο Eureqa, το χρονοδιάγραμμα, την εμπιστευτικότητα και τις ειδικότητες.'
  },

  '¿Cuánto tarda en entregarse un modelo 3D? <span style="margin-left: 1rem;">+</span>': {
    en: 'How long does it take to deliver a 3D model? <span style="margin-left: 1rem;">+</span>',
    fr: 'Combien de temps faut-il pour livrer un modèle 3D ? <span style="margin-left: 1rem;">+</span>',
    de: 'Wie lange dauert die Lieferung eines 3D-Modells? <span style="margin-left: 1rem;">+</span>',
    it: 'Quanto tempo occorre per consegnare un modello 3D? <span style="margin-left: 1rem;">+</span>',
    el: 'Πόσο χρόνο χρειάζεται η παράδοση ενός μοντέλου 3D; <span style="margin-left: 1rem;">+</span>'
  },
  'El Método Eureqa garantiza entrega en 7 días según especificaciones, material y destino. Desde la recogida de información hasta el envío del modelo listo para quirófano.': {
    en: 'The Eureqa Method guarantees delivery within 7 days depending on specifications, material and destination — from gathering the information to shipping the model ready for the operating room.',
    fr: 'La Méthode Eureqa garantit une livraison en 7 jours selon les spécifications, le matériau et la destination — de la collecte des informations à l\'envoi du modèle prêt pour le bloc opératoire.',
    de: 'Die Eureqa-Methode garantiert die Lieferung innerhalb von 7 Tagen, je nach Spezifikationen, Material und Zielort — von der Informationserfassung bis zum Versand des OP-fertigen Modells.',
    it: 'Il Metodo Eureqa garantisce la consegna entro 7 giorni in base a specifiche, materiale e destinazione — dalla raccolta delle informazioni all\'invio del modello pronto per la sala operatoria.',
    el: 'Η Μέθοδος Eureqa εγγυάται παράδοση σε 7 ημέρες ανάλογα με τις προδιαγραφές, το υλικό και τον προορισμό — από τη συλλογή πληροφοριών έως την αποστολή του μοντέλου έτοιμου για το χειρουργείο.'
  },

  '¿Cómo se garantiza la confidencialidad del paciente? <span style="margin-left: 1rem;">+</span>': {
    en: 'How is patient confidentiality guaranteed? <span style="margin-left: 1rem;">+</span>',
    fr: 'Comment la confidentialité du patient est-elle garantie ? <span style="margin-left: 1rem;">+</span>',
    de: 'Wie wird die Vertraulichkeit des Patienten gewährleistet? <span style="margin-left: 1rem;">+</span>',
    it: 'Come viene garantita la riservatezza del paziente? <span style="margin-left: 1rem;">+</span>',
    el: 'Πώς διασφαλίζεται η εμπιστευτικότητα του ασθενούς; <span style="margin-left: 1rem;">+</span>'
  },
  'Todos los casos se tratan con total anonimización y cumplimiento RGPD. Trazabilidad completa del proceso, envío seguro de imágenes médicas, y destrucción de datos tras finalizar el caso.': {
    en: 'All cases are handled with full anonymization and GDPR compliance: complete process traceability, secure transmission of medical images, and data deletion once the case is finished.',
    fr: 'Tous les cas sont traités avec une anonymisation totale et dans le respect du RGPD : traçabilité complète du processus, transmission sécurisée des images médicales, et destruction des données à la clôture du cas.',
    de: 'Alle Fälle werden vollständig anonymisiert und DSGVO-konform behandelt: vollständige Rückverfolgbarkeit des Prozesses, sichere Übertragung medizinischer Bilder und Löschung der Daten nach Abschluss des Falls.',
    it: 'Tutti i casi vengono trattati con completa anonimizzazione e conformità al RGPD: tracciabilità completa del processo, trasmissione sicura delle immagini mediche e cancellazione dei dati al termine del caso.',
    el: 'Όλες οι περιπτώσεις αντιμετωπίζονται με πλήρη ανωνυμοποίηση και συμμόρφωση με τον GDPR: πλήρης ιχνηλασιμότητα της διαδικασίας, ασφαλής μετάδοση ιατρικών εικόνων και διαγραφή δεδομένων μετά την ολοκλήρωση της περίπτωσης.'
  },

  '¿Para qué especialidades funciona la impresión 3D? <span style="margin-left: 1rem;">+</span>': {
    en: 'Which specialties does 3D printing work for? <span style="margin-left: 1rem;">+</span>',
    fr: 'Pour quelles spécialités l\'impression 3D fonctionne-t-elle ? <span style="margin-left: 1rem;">+</span>',
    de: 'Für welche Fachbereiche eignet sich der 3D-Druck? <span style="margin-left: 1rem;">+</span>',
    it: 'Per quali specialità funziona la stampa 3D? <span style="margin-left: 1rem;">+</span>',
    el: 'Για ποιες ειδικότητες λειτουργεί η τρισδιάστατη εκτύπωση; <span style="margin-left: 1rem;">+</span>'
  },
  'Traumatología, cirugía oncológica (general, hepatobiliopancreática, urología, ginecología, torácica), cardiología intervencionista, maxilofacial y otras especialidades quirúrgicas. Cada caso es único.': {
    en: 'Traumatology, oncological surgery (general, hepatobiliopancreatic, urology, gynecology, thoracic), interventional cardiology, maxillofacial and other surgical specialties. Every case is unique.',
    fr: 'Traumatologie, chirurgie oncologique (générale, hépatobiliopancréatique, urologie, gynécologie, thoracique), cardiologie interventionnelle, maxillo-faciale et autres spécialités chirurgicales. Chaque cas est unique.',
    de: 'Traumatologie, onkologische Chirurgie (allgemein, hepatobiliopankreatisch, Urologie, Gynäkologie, Thorax), interventionelle Kardiologie, Mund-Kiefer-Gesichtschirurgie und weitere chirurgische Fachbereiche. Jeder Fall ist einzigartig.',
    it: 'Traumatologia, chirurgia oncologica (generale, epatobiliopancreatica, urologia, ginecologia, toracica), cardiologia interventistica, maxillo-facciale e altre specialità chirurgiche. Ogni caso è unico.',
    el: 'Τραυματολογία, ογκολογική χειρουργική (γενική, ηπατοχολοπαγκρεατική, ουρολογία, γυναικολογία, θωρακική), επεμβατική καρδιολογία, γναθοπροσωπική και άλλες χειρουργικές ειδικότητες. Κάθε περίπτωση είναι μοναδική.'
  },

  '¿Qué imágenes médicas se necesitan? <span style="margin-left: 1rem;">+</span>': {
    en: 'What medical images are needed? <span style="margin-left: 1rem;">+</span>',
    fr: 'Quelles images médicales sont nécessaires ? <span style="margin-left: 1rem;">+</span>',
    de: 'Welche medizinischen Bilder werden benötigt? <span style="margin-left: 1rem;">+</span>',
    it: 'Quali immagini mediche sono necessarie? <span style="margin-left: 1rem;">+</span>',
    el: 'Ποιες ιατρικές εικόνες χρειάζονται; <span style="margin-left: 1rem;">+</span>'
  },
  'TC (TAC) o RMN del paciente. El formato DICOM es ideal. Nosotros te ayudamos a enviar las imágenes de forma segura o las podemos gestionar nosotros por ti.': {
    en: 'A CT scan or MRI of the patient. DICOM format is ideal. We can help you send the images securely, or we can manage it for you.',
    fr: 'Un scanner (CT) ou une IRM du patient. Le format DICOM est idéal. Nous pouvons vous aider à envoyer les images en toute sécurité, ou nous en charger pour vous.',
    de: 'Ein CT oder MRT des Patienten. Das DICOM-Format ist ideal. Wir helfen Ihnen, die Bilder sicher zu übertragen, oder übernehmen dies für Sie.',
    it: 'Una TC o una RM del paziente. Il formato DICOM è ideale. Possiamo aiutarti a inviare le immagini in modo sicuro, oppure occuparcene noi per te.',
    el: 'Αξονική ή μαγνητική τομογραφία του ασθενούς. Η μορφή DICOM είναι ιδανική. Μπορούμε να σας βοηθήσουμε να στείλετε τις εικόνες με ασφάλεια, ή να το διαχειριστούμε εμείς για εσάς.'
  },

  '¿Cuál es la diferencia entre impresión 3D y modelo digital? <span style="margin-left: 1rem;">+</span>': {
    en: 'What is the difference between 3D printing and a digital model? <span style="margin-left: 1rem;">+</span>',
    fr: 'Quelle est la différence entre l\'impression 3D et un modèle numérique ? <span style="margin-left: 1rem;">+</span>',
    de: 'Was ist der Unterschied zwischen 3D-Druck und digitalem Modell? <span style="margin-left: 1rem;">+</span>',
    it: 'Qual è la differenza tra stampa 3D e modello digitale? <span style="margin-left: 1rem;">+</span>',
    el: 'Ποια είναι η διαφορά μεταξύ τρισδιάστατης εκτύπωσης και ψηφιακού μοντέλου; <span style="margin-left: 1rem;">+</span>'
  },
  'Impresión 3D: réplica física del modelo a tamaño real (1:1), tangible, útil para simular cirugía en el quirófano. Modelo digital: visualización interactiva en navegador (Visor 3D), con rotación 360°, transparencias, sin instalaciones.': {
    en: '3D printing: a full-scale (1:1) physical replica of the model, tangible, useful for simulating surgery in the operating room. Digital model: interactive browser viewing (3D Viewer), with 360° rotation, transparency, nothing to install.',
    fr: 'Impression 3D : réplique physique du modèle à taille réelle (1:1), tangible, utile pour simuler la chirurgie au bloc opératoire. Modèle numérique : visualisation interactive dans le navigateur (Visor 3D), avec rotation à 360°, transparences, sans installation.',
    de: '3D-Druck: physische Nachbildung des Modells in Originalgröße (1:1), greifbar, nützlich zur Simulation der Operation im OP. Digitales Modell: interaktive Ansicht im Browser (3D-Viewer), mit 360°-Drehung, Transparenzen, ohne Installation.',
    it: 'Stampa 3D: replica fisica del modello a grandezza naturale (1:1), tangibile, utile per simulare l\'intervento in sala operatoria. Modello digitale: visualizzazione interattiva nel browser (Visor 3D), con rotazione a 360°, trasparenze, senza installazioni.',
    el: 'Τρισδιάστατη εκτύπωση: φυσικό αντίγραφο του μοντέλου σε πραγματικό μέγεθος (1:1), απτό, χρήσιμο για την προσομοίωση της επέμβασης στο χειρουργείο. Ψηφιακό μοντέλο: διαδραστική προβολή στον browser (Visor 3D), με περιστροφή 360°, διαφάνειες, χωρίς εγκαταστάσεις.'
  },

  '¿Puedo simular la cirugía sobre el modelo? <span style="margin-left: 1rem;">+</span>': {
    en: 'Can I simulate the surgery on the model? <span style="margin-left: 1rem;">+</span>',
    fr: 'Puis-je simuler l\'intervention sur le modèle ? <span style="margin-left: 1rem;">+</span>',
    de: 'Kann ich die Operation am Modell simulieren? <span style="margin-left: 1rem;">+</span>',
    it: 'Posso simulare l\'intervento sul modello? <span style="margin-left: 1rem;">+</span>',
    el: 'Μπορώ να προσομοιώσω την επέμβαση πάνω στο μοντέλο; <span style="margin-left: 1rem;">+</span>'
  },
  'Sí. Es un paso opcional del Método Eureqa. Fabricamos el modelo en materiales blandos que reproducen la consistencia de los tejidos, permitiendo ensayar el abordaje y anticipar complicaciones.': {
    en: 'Yes. It\'s an optional step of the Eureqa Method. We manufacture the model in soft materials that reproduce tissue consistency, allowing you to rehearse the approach and anticipate complications.',
    fr: 'Oui. C\'est une étape optionnelle de la Méthode Eureqa. Nous fabriquons le modèle dans des matériaux souples qui reproduisent la consistance des tissus, permettant de répéter l\'abord et d\'anticiper les complications.',
    de: 'Ja. Das ist ein optionaler Schritt der Eureqa-Methode. Wir fertigen das Modell aus weichen Materialien, die die Gewebekonsistenz nachbilden, sodass Sie den Zugang einüben und Komplikationen vorwegnehmen können.',
    it: 'Sì. È un passaggio opzionale del Metodo Eureqa. Realizziamo il modello con materiali morbidi che riproducono la consistenza dei tessuti, permettendo di provare l\'approccio e anticipare le complicanze.',
    el: 'Ναι. Είναι ένα προαιρετικό βήμα της Μεθόδου Eureqa. Κατασκευάζουμε το μοντέλο σε μαλακά υλικά που αναπαράγουν τη σύσταση των ιστών, επιτρέποντας να δοκιμάσετε την προσέγγιση και να προβλέψετε επιπλοκές.'
  },

  '¿Es el Visor 3D un producto médico certificado? <span style="margin-left: 1rem;">+</span>': {
    en: 'Is the 3D Viewer a certified medical device? <span style="margin-left: 1rem;">+</span>',
    fr: 'Le Visor 3D est-il un produit médical certifié ? <span style="margin-left: 1rem;">+</span>',
    de: 'Ist der 3D-Viewer ein zertifiziertes Medizinprodukt? <span style="margin-left: 1rem;">+</span>',
    it: 'Il Visor 3D è un dispositivo medico certificato? <span style="margin-left: 1rem;">+</span>',
    el: 'Είναι το Visor 3D πιστοποιημένο ιατρικό προϊόν; <span style="margin-left: 1rem;">+</span>'
  },
  'No. El EureqaVisor3D es una herramienta de apoyo a la visualización de modelos anatómicos 3D. No es un producto sanitario para visualizar estudios radiológicos y no sustituye a un informe radiológico. No usar con fines diagnósticos.': {
    en: 'No. EureqaVisor3D is a support tool for viewing 3D anatomical models. It is not a medical device for viewing radiological studies and does not replace a radiological report. Not for diagnostic use.',
    fr: 'Non. EureqaVisor3D est un outil d\'aide à la visualisation de modèles anatomiques 3D. Ce n\'est pas un produit sanitaire pour visualiser des études radiologiques et il ne remplace pas un rapport radiologique. Ne pas utiliser à des fins diagnostiques.',
    de: 'Nein. EureqaVisor3D ist ein Hilfsmittel zur Anzeige von 3D-Anatomiemodellen. Es ist kein Medizinprodukt zur Anzeige radiologischer Untersuchungen und ersetzt keinen radiologischen Bericht. Nicht für diagnostische Zwecke verwenden.',
    it: 'No. EureqaVisor3D è uno strumento di supporto per la visualizzazione di modelli anatomici 3D. Non è un dispositivo medico per visualizzare studi radiologici e non sostituisce un referto radiologico. Non utilizzare a scopo diagnostico.',
    el: 'Όχι. Το EureqaVisor3D είναι ένα εργαλείο υποστήριξης για την προβολή ανατομικών μοντέλων 3D. Δεν είναι ιατρικό προϊόν για την προβολή ακτινολογικών μελετών και δεν αντικαθιστά μια ακτινολογική έκθεση. Να μη χρησιμοποιείται για διαγνωστικούς σκοπούς.'
  },

  '¿Cuál es el proceso completo? <span style="margin-left: 1rem;">+</span>': {
    en: 'What is the full process? <span style="margin-left: 1rem;">+</span>',
    fr: 'Quel est le processus complet ? <span style="margin-left: 1rem;">+</span>',
    de: 'Wie läuft der gesamte Prozess ab? <span style="margin-left: 1rem;">+</span>',
    it: 'Qual è il processo completo? <span style="margin-left: 1rem;">+</span>',
    el: 'Ποια είναι η πλήρης διαδικασία; <span style="margin-left: 1rem;">+</span>'
  },
  '1. Recogida de información y necesidades. 2. Obtención segura de imágenes (TC/RMN). 3. Tratamiento de imagen médica con Método Eureqa. 4. Fabricación del modelo (físico o digital). 5. Simulación quirúrgica (opcional). 6. Preparación y envío.': {
    en: '1. Gathering information and requirements. 2. Secure acquisition of images (CT/MRI). 3. Medical image processing with the Eureqa Method. 4. Manufacturing the model (physical or digital). 5. Surgical simulation (optional). 6. Preparation and shipping.',
    fr: '1. Recueil des informations et besoins. 2. Obtention sécurisée des images (CT/IRM). 3. Traitement de l\'image médicale avec la Méthode Eureqa. 4. Fabrication du modèle (physique ou numérique). 5. Simulation chirurgicale (optionnelle). 6. Préparation et envoi.',
    de: '1. Erfassung von Informationen und Anforderungen. 2. Sichere Beschaffung der Bilder (CT/MRT). 3. Verarbeitung der medizinischen Bilder mit der Eureqa-Methode. 4. Fertigung des Modells (physisch oder digital). 5. Chirurgische Simulation (optional). 6. Vorbereitung und Versand.',
    it: '1. Raccolta di informazioni e necessità. 2. Acquisizione sicura delle immagini (TC/RM). 3. Trattamento dell\'immagine medica con il Metodo Eureqa. 4. Fabbricazione del modello (fisico o digitale). 5. Simulazione chirurgica (opzionale). 6. Preparazione e spedizione.',
    el: '1. Συλλογή πληροφοριών και αναγκών. 2. Ασφαλής λήψη εικόνων (CT/MRI). 3. Επεξεργασία ιατρικής εικόνας με τη Μέθοδο Eureqa. 4. Κατασκευή του μοντέλου (φυσικό ή ψηφιακό). 5. Χειρουργική προσομοίωση (προαιρετικό). 6. Προετοιμασία και αποστολή.'
  },

  '¿Cómo puedo solicitar un caso? <span style="margin-left: 1rem;">+</span>': {
    en: 'How can I request a case? <span style="margin-left: 1rem;">+</span>',
    fr: 'Comment puis-je demander un cas ? <span style="margin-left: 1rem;">+</span>',
    de: 'Wie kann ich einen Fall anfragen? <span style="margin-left: 1rem;">+</span>',
    it: 'Come posso richiedere un caso? <span style="margin-left: 1rem;">+</span>',
    el: 'Πώς μπορώ να ζητήσω μια περίπτωση; <span style="margin-left: 1rem;">+</span>'
  },
  'Contacta con nosotros: llamada +34 654 55 20 44, email info@eureqa3d.com, o rellena el formulario de contacto. Analizamos tu caso y te decimos si es viable. Sin compromiso.': {
    en: 'Get in touch: call +34 654 55 20 44, email info@eureqa3d.com, or fill in the contact form. We\'ll analyze your case and tell you if it\'s viable. No commitment.',
    fr: 'Contactez-nous : appelez le +34 654 55 20 44, écrivez à info@eureqa3d.com, ou remplissez le formulaire de contact. Nous analysons votre cas et vous disons s\'il est réalisable. Sans engagement.',
    de: 'Kontaktieren Sie uns: Anruf unter +34 654 55 20 44, E-Mail an info@eureqa3d.com, oder füllen Sie das Kontaktformular aus. Wir analysieren Ihren Fall und sagen Ihnen, ob er machbar ist. Unverbindlich.',
    it: 'Contattaci: chiama il +34 654 55 20 44, scrivi a info@eureqa3d.com, oppure compila il modulo di contatto. Analizziamo il tuo caso e ti diciamo se è fattibile. Senza impegno.',
    el: 'Επικοινωνήστε μαζί μας: κλήση στο +34 654 55 20 44, email στο info@eureqa3d.com, ή συμπληρώστε τη φόρμα επικοινωνίας. Αναλύουμε την περίπτωσή σας και σας λέμε αν είναι εφικτή. Χωρίς δέσμευση.'
  },

  '¿Tienes otra pregunta?': { en: 'Have another question?', fr: 'Vous avez une autre question ?', de: 'Haben Sie noch eine Frage?', it: 'Hai un\'altra domanda?', el: 'Έχετε άλλη ερώτηση;' },
  'Ponte en contacto directo con nosotros. Te responderemos lo antes posible.': {
    en: 'Get in direct touch with us. We\'ll get back to you as soon as possible.',
    fr: 'Contactez-nous directement. Nous vous répondrons dans les plus brefs délais.',
    de: 'Nehmen Sie direkt Kontakt mit uns auf. Wir antworten Ihnen so schnell wie möglich.',
    it: 'Contattaci direttamente. Ti risponderemo il prima possibile.',
    el: 'Επικοινωνήστε απευθείας μαζί μας. Θα σας απαντήσουμε το συντομότερο δυνατό.'
  },
  'Contactar': { en: 'Contact', fr: 'Contacter', de: 'Kontaktieren', it: 'Contatta', el: 'Επικοινωνία' },

  'Cuéntanos tu caso: la impresión 3D tiene aplicación en prácticamente cualquier procedimiento que requiera planificación anatómica.': {
    en: 'Tell us about your case: 3D printing has applications in practically any procedure that requires anatomical planning.',
    fr: 'Parlez-nous de votre cas : l\'impression 3D s\'applique à pratiquement toute intervention nécessitant une planification anatomique.',
    de: 'Erzählen Sie uns von Ihrem Fall: 3D-Druck lässt sich bei praktisch jedem Eingriff einsetzen, der eine anatomische Planung erfordert.',
    it: 'Raccontaci il tuo caso: la stampa 3D si applica praticamente a qualsiasi procedura che richieda una pianificazione anatomica.',
    el: 'Πείτε μας για την περίπτωσή σας: η τρισδιάστατη εκτύπωση εφαρμόζεται σχεδόν σε κάθε διαδικασία που απαιτεί ανατομικό σχεδιασμό.'
  },
};

  /* Elementos de contenido a traducir (clave = innerHTML normalizado) */
  const RICH = 'h1,h2,h3,h4,h5,h6,p,li,button,td,th,summary,.eyebrow,a.btn,.lbl,.model-spec,.big,.num,.more,.hero-demo-label';

  const ORIG = new WeakMap();
  const norm = (s) => s.replace(/\s+/g, ' ').trim();

  function getLang() {
    const l = localStorage.getItem(STORAGE_KEY);
    return LANGS.some(x => x.code === l) ? l : 'es';
  }

  function setLang(code) {
    if (!LANGS.some(x => x.code === code)) return;
    localStorage.setItem(STORAGE_KEY, code);
    location.reload();
  }

  /* Traduce una cadena suelta (para textos generados por JS) */
  function t(es) {
    const lang = getLang();
    if (lang === 'es' || es == null) return es;
    const e = DICT[norm(es)];
    return (e && e[lang]) || es;
  }

  function apply() {
    const lang = getLang();
    document.documentElement.lang = lang;

    // <title>
    if (document.documentElement.__t0 === undefined) document.documentElement.__t0 = document.title;
    const te = DICT[norm(document.documentElement.__t0)];
    document.title = (lang === 'es' || !te) ? document.documentElement.__t0 : (te[lang] || document.documentElement.__t0);

    // Bloques de contenido
    document.querySelectorAll(RICH).forEach(el => {
      if (el.closest('[data-no-i18n]')) return;
      let orig = ORIG.get(el);
      if (orig === undefined) { orig = el.innerHTML; ORIG.set(el, orig); }
      const e = DICT[norm(orig)];
      if (!e) return;
      el.innerHTML = (lang === 'es') ? orig : (e[lang] || orig);
    });

    // Labels de formulario (traducir solo el primer nodo de texto)
    document.querySelectorAll('label').forEach(lab => {
      if (lab.closest('[data-no-i18n]')) return;
      const tn = [...lab.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
      if (!tn) return;
      let o = ORIG.get(tn);
      if (o === undefined) { o = tn.nodeValue; ORIG.set(tn, o); }
      const k = o.trim();
      const e = DICT[k];
      if (!e) return;
      tn.nodeValue = (lang === 'es') ? o : o.replace(k, e[lang] || k);
    });

    // aria-label
    document.querySelectorAll('[aria-label]').forEach(el => {
      if (el.closest('[data-no-i18n]')) return;
      let o = el.__origAria;
      if (o === undefined) { o = el.getAttribute('aria-label'); el.__origAria = o; }
      const e = DICT[o];
      if (!e) return;
      el.setAttribute('aria-label', (lang === 'es') ? o : (e[lang] || o));
    });
  }

  window.I18N = { LANGS, LOCALE, DICT, getLang, setLang, t, apply, locale: () => LOCALE[getLang()] || 'es-ES' };
})();
