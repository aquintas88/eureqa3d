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
    'Noticias': { en: 'News', fr: 'Actualités', de: 'Aktuelles', it: 'Notizie', el: 'Νέα' },
    'Contacto': { en: 'Contact', fr: 'Contact', de: 'Kontakt', it: 'Contatti', el: 'Επικοινωνία' },
    'Solicita un caso de prueba': { en: 'Request a test case', fr: 'Demandez un cas test', de: 'Testfall anfragen', it: 'Richiedi un caso di prova', el: 'Ζητήστε δοκιμαστική περίπτωση' },
    'Caso de prueba': { en: 'Test case', fr: 'Cas test', de: 'Testfall', it: 'Caso di prova', el: 'Δοκιμαστική περίπτωση' },

    /* ── Pie ── */
    'Servicio integral de impresión 3D especializado en el sector salud. Tecnología y cirugía al servicio del profesional.': {
      en: 'Comprehensive 3D printing service specialized in the healthcare sector. Technology and surgery at the service of the professional.',
      fr: "Service complet d'impression 3D spécialisé dans le secteur de la santé. La technologie et la chirurgie au service du professionnel.",
      de: 'Umfassender 3D-Druckservice, spezialisiert auf den Gesundheitssektor. Technologie und Chirurgie im Dienste des Fachpersonals.',
      it: 'Servizio completo di stampa 3D specializzato nel settore sanitario. Tecnologia e chirurgia al servizio del professionista.',
      el: 'Ολοκληρωμένη υπηρεσία τρισδιάστατης εκτύπωσης ειδικευμένη στον τομέα της υγείας. Τεχνολογία και χειρουργική στην υπηρεσία του επαγγελματία.' },
    'Extremadura · España': { en: 'Extremadura · Spain', fr: 'Estrémadure · Espagne', de: 'Extremadura · Spanien', it: 'Estremadura · Spagna', el: 'Εστρεμαδούρα · Ισπανία' },
    'Navegación': { en: 'Navigation', fr: 'Navigation', de: 'Navigation', it: 'Navigazione', el: 'Πλοήγηση' },
    'Todos los derechos reservados.': { en: 'All rights reserved.', fr: 'Tous droits réservés.', de: 'Alle Rechte vorbehalten.', it: 'Tutti i diritti riservati.', el: 'Με την επιφύλαξη παντός δικαιώματος.' },
    'Impresión 3D · Sector Salud · ISO 9001': { en: '3D Printing · Healthcare · ISO 9001', fr: 'Impression 3D · Santé · ISO 9001', de: '3D-Druck · Gesundheitswesen · ISO 9001', it: 'Stampa 3D · Sanità · ISO 9001', el: 'Τρισδιάστατη εκτύπωση · Υγεία · ISO 9001' },

    /* ── Inicio ── */
    'Impresión 3D · Sector salud · Extremadura': { en: '3D Printing · Healthcare · Extremadura', fr: 'Impression 3D · Santé · Estrémadure', de: '3D-Druck · Gesundheitswesen · Extremadura', it: 'Stampa 3D · Sanità · Estremadura', el: 'Τρισδιάστατη εκτύπωση · Υγεία · Εστρεμαδούρα' },
    'Revolucionamos el <span>sector salud</span> mediante la Impresión 3D': {
      en: 'We are revolutionizing the <span>healthcare sector</span> through 3D Printing',
      fr: "Nous révolutionnons le <span>secteur de la santé</span> grâce à l'impression 3D",
      de: 'Wir revolutionieren den <span>Gesundheitssektor</span> mit 3D-Druck',
      it: 'Rivoluzioniamo il <span>settore sanitario</span> con la stampa 3D',
      el: 'Φέρνουμε επανάσταση στον <span>τομέα της υγείας</span> μέσω της τρισδιάστατης εκτύπωσης' },
    'Trabajamos directamente con los especialistas, facilitándoles la incorporación a la impresión 3D de forma fácil y sencilla, con un servicio externo profesional, especializado y exclusivo del sector.': {
      en: 'We work directly with specialists, making it easy and simple for them to adopt 3D printing, with a professional external service that is specialized and exclusive to the sector.',
      fr: "Nous travaillons directement avec les spécialistes, en leur facilitant l'adoption de l'impression 3D de façon simple et aisée, grâce à un service externe professionnel, spécialisé et exclusif au secteur.",
      de: 'Wir arbeiten direkt mit den Fachleuten zusammen und erleichtern ihnen den einfachen und unkomplizierten Einstieg in den 3D-Druck – mit einem professionellen externen Service, der auf die Branche spezialisiert und ausschließlich auf sie ausgerichtet ist.',
      it: "Lavoriamo direttamente con gli specialisti, facilitando loro l'adozione della stampa 3D in modo facile e semplice, con un servizio esterno professionale, specializzato ed esclusivo del settore.",
      el: 'Συνεργαζόμαστε απευθείας με τους ειδικούς, διευκολύνοντας την ενσωμάτωση της τρισδιάστατης εκτύπωσης με εύκολο και απλό τρόπο, μέσω μιας επαγγελματικής εξωτερικής υπηρεσίας, εξειδικευμένης και αποκλειστικής για τον κλάδο.' },
    'Conoce el Método Eureqa': { en: 'Discover the Eureqa Method', fr: 'Découvrez la Méthode Eureqa', de: 'Lernen Sie die Eureqa-Methode kennen', it: 'Scopri il Metodo Eureqa', el: 'Γνωρίστε τη Μέθοδο Eureqa' },
    'Qué ofrecemos': { en: 'What we offer', fr: 'Ce que nous offrons', de: 'Was wir bieten', it: 'Cosa offriamo', el: 'Τι προσφέρουμε' },
    'Una nueva y exclusiva herramienta en manos del profesional': { en: 'A new and exclusive tool in the hands of the professional', fr: 'Un outil nouveau et exclusif entre les mains du professionnel', de: 'Ein neues und exklusives Werkzeug in den Händen des Fachmanns', it: 'Un nuovo ed esclusivo strumento nelle mani del professionista', el: 'Ένα νέο και αποκλειστικό εργαλείο στα χέρια του επαγγελματία' },
    'Una nueva y exclusiva herramienta en manos del profesional.': { en: 'A new and exclusive tool in the hands of the professional.', fr: 'Un outil nouveau et exclusif entre les mains du professionnel.', de: 'Ein neues und exklusives Werkzeug in den Händen des Fachmanns.', it: 'Un nuovo ed esclusivo strumento nelle mani del professionista.', el: 'Ένα νέο και αποκλειστικό εργαλείο στα χέρια του επαγγελματία.' },
    'Especializados en el tratamiento de la imagen médica, segmentación, diseño e impresión 3D: obtenemos una reconstrucción física a tamaño real, réplica o modelo único de máxima calidad, adaptado a cada patología.': {
      en: 'Specialized in medical image processing, segmentation, design and 3D printing: we produce a full-scale physical reconstruction, a replica or unique model of the highest quality, tailored to each pathology.',
      fr: "Spécialisés dans le traitement de l'image médicale, la segmentation, la conception et l'impression 3D : nous obtenons une reconstruction physique à taille réelle, une réplique ou un modèle unique de la plus haute qualité, adapté à chaque pathologie.",
      de: 'Spezialisiert auf die Verarbeitung medizinischer Bilder, Segmentierung, Design und 3D-Druck: Wir erstellen eine physische Rekonstruktion in Originalgröße, eine Replik oder ein einzigartiges Modell höchster Qualität, das an jede Pathologie angepasst ist.',
      it: "Specializzati nel trattamento dell'immagine medica, segmentazione, progettazione e stampa 3D: otteniamo una ricostruzione fisica a grandezza naturale, una replica o un modello unico della massima qualità, adattato a ogni patologia.",
      el: 'Εξειδικευμένοι στην επεξεργασία ιατρικής εικόνας, την κατάτμηση, τον σχεδιασμό και την τρισδιάστατη εκτύπωση: δημιουργούμε μια φυσική ανακατασκευή σε πραγματικό μέγεθος, ένα αντίγραφο ή μοναδικό μοντέλο ύψιστης ποιότητας, προσαρμοσμένο σε κάθε παθολογία.' },
    'Imagen médica a 3D': { en: 'Medical imaging to 3D', fr: "De l'image médicale au 3D", de: 'Vom medizinischen Bild zum 3D-Modell', it: "Dall'immagine medica al 3D", el: 'Από ιατρική εικόνα σε 3D' },
    'Convertimos estudios radiológicos 2D en biomodelos físicos precisos, listos para el quirófano.': {
      en: 'We turn 2D radiological studies into precise physical biomodels, ready for the operating room.',
      fr: 'Nous transformons les études radiologiques 2D en biomodèles physiques précis, prêts pour le bloc opératoire.',
      de: 'Wir verwandeln 2D-Röntgenstudien in präzise physische Biomodelle, bereit für den Operationssaal.',
      it: 'Trasformiamo gli studi radiologici 2D in biomodelli fisici precisi, pronti per la sala operatoria.',
      el: 'Μετατρέπουμε δισδιάστατες ακτινολογικές μελέτες σε ακριβή φυσικά βιομοντέλα, έτοιμα για το χειρουργείο.' },
    'Proceso propio certificado con sello de calidad ISO 9001 que garantiza trazabilidad y confidencialidad (RGPD).': {
      en: 'Our own process, certified with the ISO 9001 quality seal, guaranteeing traceability and confidentiality (GDPR).',
      fr: 'Un processus propriétaire certifié par le label qualité ISO 9001, garantissant la traçabilité et la confidentialité (RGPD).',
      de: 'Ein eigenes Verfahren, zertifiziert mit dem ISO-9001-Qualitätssiegel, das Rückverfolgbarkeit und Vertraulichkeit (DSGVO) gewährleistet.',
      it: 'Processo proprietario certificato con il marchio di qualità ISO 9001 che garantisce tracciabilità e riservatezza (GDPR).',
      el: 'Ιδιόκτητη διαδικασία πιστοποιημένη με τη σφραγίδα ποιότητας ISO 9001 που εγγυάται ιχνηλασιμότητα και εμπιστευτικότητα (GDPR).' },
    'Tiempo récord': { en: 'Record time', fr: 'Temps record', de: 'Rekordzeit', it: 'Tempo record', el: 'Χρόνος-ρεκόρ' },
    'Entregamos los modelos entre 24 y 48 horas según solicitud, material y destino. Tu tiempo importa.': {
      en: 'We deliver the models within 24 to 48 hours depending on request, material and destination. Your time matters.',
      fr: 'Nous livrons les modèles entre 24 et 48 heures selon la demande, le matériau et la destination. Votre temps compte.',
      de: 'Wir liefern die Modelle innerhalb von 24 bis 48 Stunden, je nach Anfrage, Material und Zielort. Ihre Zeit zählt.',
      it: 'Consegniamo i modelli entro 24-48 ore in base alla richiesta, al materiale e alla destinazione. Il tuo tempo conta.',
      el: 'Παραδίδουμε τα μοντέλα σε 24 έως 48 ώρες ανάλογα με το αίτημα, το υλικό και τον προορισμό. Ο χρόνος σας μετράει.' },
    'Plazo de entrega': { en: 'Delivery time', fr: 'Délai de livraison', de: 'Lieferzeit', it: 'Tempi di consegna', el: 'Χρόνος παράδοσης' },
    'Calidad certificada': { en: 'Certified quality', fr: 'Qualité certifiée', de: 'Zertifizierte Qualität', it: 'Qualità certificata', el: 'Πιστοποιημένη ποιότητα' },
    'Modelos a medida': { en: 'Custom-made models', fr: 'Modèles sur mesure', de: 'Maßgeschneiderte Modelle', it: 'Modelli su misura', el: 'Μοντέλα κατά παραγγελία' },
    'Confidencialidad': { en: 'Confidentiality', fr: 'Confidentialité', de: 'Vertraulichkeit', it: 'Riservatezza', el: 'Εμπιστευτικότητα' },
    'Áreas de aplicación': { en: 'Areas of application', fr: "Domaines d'application", de: 'Anwendungsbereiche', it: 'Aree di applicazione', el: 'Τομείς εφαρμογής' },
    'Tecnología que revoluciona la cirugía': { en: 'Technology that revolutionizes surgery', fr: 'Une technologie qui révolutionne la chirurgie', de: 'Technologie, die die Chirurgie revolutioniert', it: 'Tecnologia che rivoluziona la chirurgia', el: 'Τεχνολογία που φέρνει επανάσταση στη χειρουργική' },
    'La planificación con biomodelos 3D facilita el estudio de la anatomía, el abordaje y la previsión de complicaciones intraoperatorias.': {
      en: 'Planning with 3D biomodels makes it easier to study the anatomy, plan the approach and anticipate intraoperative complications.',
      fr: "La planification avec des biomodèles 3D facilite l'étude de l'anatomie, l'abord et l'anticipation des complications peropératoires.",
      de: 'Die Planung mit 3D-Biomodellen erleichtert das Studium der Anatomie, den Zugang und die Vorhersage intraoperativer Komplikationen.',
      it: "La pianificazione con biomodelli 3D facilita lo studio dell'anatomia, l'approccio e la previsione delle complicanze intraoperatorie.",
      el: 'Ο σχεδιασμός με τρισδιάστατα βιομοντέλα διευκολύνει τη μελέτη της ανατομίας, την προσέγγιση και την πρόβλεψη διεγχειρητικών επιπλοκών.' },
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
    'Sabemos lo importante que es tu tiempo. Déjanos ayudarte a incorporar la impresión 3D a tu práctica clínica.': {
      en: 'We know how important your time is. Let us help you bring 3D printing into your clinical practice.',
      fr: "Nous savons à quel point votre temps est précieux. Laissez-nous vous aider à intégrer l'impression 3D dans votre pratique clinique.",
      de: 'Wir wissen, wie wertvoll Ihre Zeit ist. Lassen Sie uns Ihnen helfen, den 3D-Druck in Ihre klinische Praxis zu integrieren.',
      it: 'Sappiamo quanto è importante il tuo tempo. Lascia che ti aiutiamo a integrare la stampa 3D nella tua pratica clinica.',
      el: 'Γνωρίζουμε πόσο σημαντικός είναι ο χρόνος σας. Αφήστε μας να σας βοηθήσουμε να εντάξετε την τρισδιάστατη εκτύπωση στην κλινική σας πρακτική.' },
    'Contacta con nosotros': { en: 'Get in touch', fr: 'Contactez-nous', de: 'Kontaktieren Sie uns', it: 'Contattaci', el: 'Επικοινωνήστε μαζί μας' },

    /* ── Quiénes somos ── */
    'Especialistas en impresión 3D en el sector salud': { en: 'Specialists in 3D printing for the healthcare sector', fr: "Spécialistes de l'impression 3D dans le secteur de la santé", de: 'Spezialisten für 3D-Druck im Gesundheitssektor', it: 'Specialisti nella stampa 3D nel settore sanitario', el: 'Ειδικοί στην τρισδιάστατη εκτύπωση στον τομέα της υγείας' },
    'Eureqa3D es una empresa joven formada por <strong>ingenieros, médicos y cirujanos</strong> que ofrece, a través de la impresión 3D, una innovadora tecnología al profesional, revolucionando el sector salud.': {
      en: 'Eureqa3D is a young company made up of <strong>engineers, doctors and surgeons</strong> that offers professionals an innovative technology through 3D printing, revolutionizing the healthcare sector.',
      fr: "Eureqa3D est une jeune entreprise composée d'<strong>ingénieurs, médecins et chirurgiens</strong> qui offre au professionnel, grâce à l'impression 3D, une technologie innovante, révolutionnant le secteur de la santé.",
      de: 'Eureqa3D ist ein junges Unternehmen aus <strong>Ingenieuren, Ärzten und Chirurgen</strong>, das Fachleuten durch den 3D-Druck eine innovative Technologie bietet und den Gesundheitssektor revolutioniert.',
      it: 'Eureqa3D è una giovane azienda formata da <strong>ingegneri, medici e chirurghi</strong> che offre al professionista, attraverso la stampa 3D, una tecnologia innovativa, rivoluzionando il settore sanitario.',
      el: 'Η Eureqa3D είναι μια νέα εταιρεία αποτελούμενη από <strong>μηχανικούς, ιατρούς και χειρουργούς</strong> που προσφέρει στον επαγγελματία, μέσω της τρισδιάστατης εκτύπωσης, μια καινοτόμο τεχνολογία, φέρνοντας επανάσταση στον τομέα της υγείας.' },
    'Ofrecemos un servicio diferencial, al estar especializados en el tratamiento de la imagen médica, segmentación, diseño e impresión 3D, obteniendo una reconstrucción física a tamaño real en 3D: réplica o modelo único de máxima calidad, adaptado a las necesidades de cada patología y del profesional.': {
      en: 'We offer a differentiating service, specialized in medical image processing, segmentation, design and 3D printing, producing a full-scale physical 3D reconstruction: a replica or unique model of the highest quality, tailored to the needs of each pathology and professional.',
      fr: "Nous proposons un service différenciant, spécialisés dans le traitement de l'image médicale, la segmentation, la conception et l'impression 3D, obtenant une reconstruction physique 3D à taille réelle : une réplique ou un modèle unique de la plus haute qualité, adapté aux besoins de chaque pathologie et de chaque professionnel.",
      de: 'Wir bieten einen differenzierenden Service: spezialisiert auf die Verarbeitung medizinischer Bilder, Segmentierung, Design und 3D-Druck, mit dem wir eine physische 3D-Rekonstruktion in Originalgröße erstellen – eine Replik oder ein einzigartiges Modell höchster Qualität, abgestimmt auf die Anforderungen jeder Pathologie und jedes Fachmanns.',
      it: "Offriamo un servizio differenziante, essendo specializzati nel trattamento dell'immagine medica, segmentazione, progettazione e stampa 3D, ottenendo una ricostruzione fisica 3D a grandezza naturale: una replica o un modello unico della massima qualità, adattato alle esigenze di ogni patologia e di ogni professionista.",
      el: 'Προσφέρουμε μια διαφοροποιημένη υπηρεσία, καθώς είμαστε εξειδικευμένοι στην επεξεργασία ιατρικής εικόνας, την κατάτμηση, τον σχεδιασμό και την τρισδιάστατη εκτύπωση, δημιουργώντας μια φυσική τρισδιάστατη ανακατασκευή σε πραγματικό μέγεθος: ένα αντίγραφο ή μοναδικό μοντέλο ύψιστης ποιότητας, προσαρμοσμένο στις ανάγκες κάθε παθολογίας και επαγγελματία.' },
    '«Una nueva y exclusiva herramienta en manos del profesional»': {
      en: '«A new and exclusive tool in the hands of the professional»',
      fr: '« Un outil nouveau et exclusif entre les mains du professionnel »',
      de: '„Ein neues und exklusives Werkzeug in den Händen des Fachmanns“',
      it: '«Un nuovo ed esclusivo strumento nelle mani del professionista»',
      el: '«Ένα νέο και αποκλειστικό εργαλείο στα χέρια του επαγγελματία»' },
    'Garantizamos la máxima calidad de nuestros trabajos gracias a nuestro método de producción, el <strong>Método Eureqa</strong>, certificado con el sello de calidad <strong>ISO 9001</strong>, y a un equipo de profesionales altamente cualificados.': {
      en: 'We guarantee the highest quality of our work thanks to our production method, the <strong>Eureqa Method</strong>, certified with the <strong>ISO 9001</strong> quality seal, and to a team of highly qualified professionals.',
      fr: 'Nous garantissons la plus haute qualité de nos travaux grâce à notre méthode de production, la <strong>Méthode Eureqa</strong>, certifiée par le label qualité <strong>ISO 9001</strong>, et à une équipe de professionnels hautement qualifiés.',
      de: 'Wir garantieren höchste Qualität unserer Arbeit dank unserer Produktionsmethode, der <strong>Eureqa-Methode</strong>, zertifiziert mit dem Qualitätssiegel <strong>ISO 9001</strong>, sowie einem Team hochqualifizierter Fachleute.',
      it: 'Garantiamo la massima qualità dei nostri lavori grazie al nostro metodo di produzione, il <strong>Metodo Eureqa</strong>, certificato con il marchio di qualità <strong>ISO 9001</strong>, e a un team di professionisti altamente qualificati.',
      el: 'Εγγυόμαστε την ύψιστη ποιότητα των εργασιών μας χάρη στη μέθοδο παραγωγής μας, τη <strong>Μέθοδο Eureqa</strong>, πιστοποιημένη με τη σφραγίδα ποιότητας <strong>ISO 9001</strong>, και σε μια ομάδα άρτια καταρτισμένων επαγγελματιών.' },
    'Trabajamos en tiempo récord, entregando los modelos entre <strong>24 y 48 horas</strong> (según tiempos y condiciones: solicitud, material y destino).': {
      en: 'We work in record time, delivering the models within <strong>24 to 48 hours</strong> (depending on times and conditions: request, material and destination).',
      fr: 'Nous travaillons en temps record, en livrant les modèles entre <strong>24 et 48 heures</strong> (selon les délais et conditions : demande, matériau et destination).',
      de: 'Wir arbeiten in Rekordzeit und liefern die Modelle innerhalb von <strong>24 bis 48 Stunden</strong> (je nach Fristen und Bedingungen: Anfrage, Material und Zielort).',
      it: 'Lavoriamo in tempo record, consegnando i modelli entro <strong>24-48 ore</strong> (in base a tempi e condizioni: richiesta, materiale e destinazione).',
      el: 'Εργαζόμαστε σε χρόνο-ρεκόρ, παραδίδοντας τα μοντέλα σε <strong>24 έως 48 ώρες</strong> (ανάλογα με τους χρόνους και τις συνθήκες: αίτημα, υλικό και προορισμός).' },
    'Tecnología propia': { en: 'Proprietary technology', fr: 'Technologie propriétaire', de: 'Eigene Technologie', it: 'Tecnologia proprietaria', el: 'Ιδιόκτητη τεχνολογία' },
    'Del estudio radiológico al modelo físico': { en: 'From radiological study to physical model', fr: "De l'étude radiologique au modèle physique", de: 'Von der radiologischen Studie zum physischen Modell', it: 'Dallo studio radiologico al modello fisico', el: 'Από την ακτινολογική μελέτη στο φυσικό μοντέλο' },
    'Combinamos software de segmentación e impresión 3D de precisión para transformar la imagen médica del paciente en una réplica anatómica fiel, lista para planificar la intervención.': {
      en: "We combine segmentation software and precision 3D printing to transform the patient's medical image into a faithful anatomical replica, ready to plan the intervention.",
      fr: "Nous combinons un logiciel de segmentation et l'impression 3D de précision pour transformer l'image médicale du patient en une réplique anatomique fidèle, prête pour planifier l'intervention.",
      de: 'Wir kombinieren Segmentierungssoftware und Präzisions-3D-Druck, um das medizinische Bild des Patienten in eine originalgetreue anatomische Replik zu verwandeln, bereit zur Planung des Eingriffs.',
      it: "Combiniamo software di segmentazione e stampa 3D di precisione per trasformare l'immagine medica del paziente in una replica anatomica fedele, pronta per pianificare l'intervento.",
      el: 'Συνδυάζουμε λογισμικό κατάτμησης και τρισδιάστατη εκτύπωση ακριβείας για να μετατρέψουμε την ιατρική εικόνα του ασθενούς σε ένα πιστό ανατομικό αντίγραφο, έτοιμο για τον σχεδιασμό της επέμβασης.' },
    'Equipo multidisciplinar': { en: 'Multidisciplinary team', fr: 'Équipe pluridisciplinaire', de: 'Multidisziplinäres Team', it: 'Team multidisciplinare', el: 'Διεπιστημονική ομάδα' },
    'Ingenieros, médicos y cirujanos trabajando juntos.': { en: 'Engineers, doctors and surgeons working together.', fr: 'Ingénieurs, médecins et chirurgiens travaillant ensemble.', de: 'Ingenieure, Ärzte und Chirurgen arbeiten zusammen.', it: 'Ingegneri, medici e chirurghi che lavorano insieme.', el: 'Μηχανικοί, ιατροί και χειρουργοί που εργάζονται μαζί.' },
    'Calidad ISO 9001': { en: 'ISO 9001 quality', fr: 'Qualité ISO 9001', de: 'ISO-9001-Qualität', it: 'Qualità ISO 9001', el: 'Ποιότητα ISO 9001' },
    'Método de producción propio certificado.': { en: 'Our own certified production method.', fr: 'Méthode de production propriétaire certifiée.', de: 'Eigene zertifizierte Produktionsmethode.', it: 'Metodo di produzione proprietario certificato.', el: 'Ιδιόκτητη πιστοποιημένη μέθοδος παραγωγής.' },
    'Cumplimiento estricto del RGPD en cada caso.': { en: 'Strict GDPR compliance in every case.', fr: 'Respect strict du RGPD dans chaque cas.', de: 'Strikte DSGVO-Konformität in jedem Fall.', it: 'Rigorosa conformità al GDPR in ogni caso.', el: 'Αυστηρή συμμόρφωση με τον GDPR σε κάθε περίπτωση.' },
    'Trabajemos juntos': { en: "Let's work together", fr: 'Travaillons ensemble', de: 'Arbeiten wir zusammen', it: 'Lavoriamo insieme', el: 'Ας συνεργαστούμε' },
    'Déjanos ayudarte a incorporar la impresión 3D a tu práctica clínica.': {
      en: 'Let us help you bring 3D printing into your clinical practice.',
      fr: "Laissez-nous vous aider à intégrer l'impression 3D dans votre pratique clinique.",
      de: 'Lassen Sie uns Ihnen helfen, den 3D-Druck in Ihre klinische Praxis zu integrieren.',
      it: 'Lascia che ti aiutiamo a integrare la stampa 3D nella tua pratica clinica.',
      el: 'Αφήστε μας να σας βοηθήσουμε να εντάξετε την τρισδιάστατη εκτύπωση στην κλινική σας πρακτική.' },

    /* ── Método Eureqa ── */
    'El método para alcanzar la excelencia': { en: 'The method to achieve excellence', fr: "La méthode pour atteindre l'excellence", de: 'Die Methode, um Spitzenleistung zu erreichen', it: 'Il metodo per raggiungere l\'eccellenza', el: 'Η μέθοδος για την επίτευξη της αριστείας' },
    'Un método de trabajo único e innovador basado en la tecnología digital aplicada al diseño y tratamiento de imágenes.': {
      en: 'A unique and innovative working method based on digital technology applied to image design and processing.',
      fr: 'Une méthode de travail unique et innovante basée sur la technologie numérique appliquée à la conception et au traitement des images.',
      de: 'Eine einzigartige und innovative Arbeitsmethode auf Basis digitaler Technologie für Bildgestaltung und -verarbeitung.',
      it: 'Un metodo di lavoro unico e innovativo basato sulla tecnologia digitale applicata alla progettazione e al trattamento delle immagini.',
      el: 'Μια μοναδική και καινοτόμος μέθοδος εργασίας βασισμένη στην ψηφιακή τεχνολογία που εφαρμόζεται στον σχεδιασμό και την επεξεργασία εικόνων.' },
    'En Eureqa ofrecemos un servicio diferencial al haber desarrollado un método de trabajo único e innovador basado en la tecnología digital aplicada al diseño y tratamiento de imágenes, obteniendo una reconstrucción física mediante la impresión 3D en el sector salud: el <strong>Método Eureqa</strong>.': {
      en: 'At Eureqa we offer a differentiating service, having developed a unique and innovative working method based on digital technology applied to image design and processing, producing a physical reconstruction through 3D printing in the healthcare sector: the <strong>Eureqa Method</strong>.',
      fr: "Chez Eureqa, nous proposons un service différenciant en ayant développé une méthode de travail unique et innovante basée sur la technologie numérique appliquée à la conception et au traitement des images, obtenant une reconstruction physique par impression 3D dans le secteur de la santé : la <strong>Méthode Eureqa</strong>.",
      de: 'Bei Eureqa bieten wir einen differenzierenden Service, da wir eine einzigartige und innovative Arbeitsmethode auf Basis digitaler Technologie für Bildgestaltung und -verarbeitung entwickelt haben und damit eine physische Rekonstruktion durch 3D-Druck im Gesundheitssektor erstellen: die <strong>Eureqa-Methode</strong>.',
      it: 'In Eureqa offriamo un servizio differenziante avendo sviluppato un metodo di lavoro unico e innovativo basato sulla tecnologia digitale applicata alla progettazione e al trattamento delle immagini, ottenendo una ricostruzione fisica tramite la stampa 3D nel settore sanitario: il <strong>Metodo Eureqa</strong>.',
      el: 'Στην Eureqa προσφέρουμε μια διαφοροποιημένη υπηρεσία, έχοντας αναπτύξει μια μοναδική και καινοτόμο μέθοδο εργασίας βασισμένη στην ψηφιακή τεχνολογία που εφαρμόζεται στον σχεδιασμό και την επεξεργασία εικόνων, δημιουργώντας μια φυσική ανακατασκευή μέσω τρισδιάστατης εκτύπωσης στον τομέα της υγείας: τη <strong>Μέθοδο Eureqa</strong>.' },
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
    'Reconstrucciones únicas a tamaño real': { en: 'Unique full-scale reconstructions', fr: 'Des reconstructions uniques à taille réelle', de: 'Einzigartige Rekonstruktionen in Originalgröße', it: 'Ricostruzioni uniche a grandezza naturale', el: 'Μοναδικές ανακατασκευές σε πραγματικό μέγεθος' },
    'Cada biomodelo se imprime a escala 1:1 a partir del estudio del paciente, garantizando la fidelidad anatómica que el cirujano necesita para planificar con confianza.': {
      en: "Each biomodel is printed at 1:1 scale from the patient's study, ensuring the anatomical fidelity the surgeon needs to plan with confidence.",
      fr: "Chaque biomodèle est imprimé à l'échelle 1:1 à partir de l'étude du patient, garantissant la fidélité anatomique dont le chirurgien a besoin pour planifier en toute confiance.",
      de: 'Jedes Biomodell wird im Maßstab 1:1 aus der Studie des Patienten gedruckt und gewährleistet die anatomische Genauigkeit, die der Chirurg benötigt, um souverän zu planen.',
      it: "Ogni biomodello viene stampato in scala 1:1 a partire dallo studio del paziente, garantendo la fedeltà anatomica di cui il chirurgo ha bisogno per pianificare con sicurezza.",
      el: 'Κάθε βιομοντέλο εκτυπώνεται σε κλίμακα 1:1 από τη μελέτη του ασθενούς, εξασφαλίζοντας την ανατομική πιστότητα που χρειάζεται ο χειρουργός για να σχεδιάσει με σιγουριά.' },
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
    'Aplicamos el Método Eureqa para obtener una reconstrucción 3D única, exclusiva y de alta calidad.': {
      en: 'We apply the Eureqa Method to obtain a unique, exclusive and high-quality 3D reconstruction.',
      fr: 'Nous appliquons la Méthode Eureqa pour obtenir une reconstruction 3D unique, exclusive et de haute qualité.',
      de: 'Wir wenden die Eureqa-Methode an, um eine einzigartige, exklusive und hochwertige 3D-Rekonstruktion zu erhalten.',
      it: 'Applichiamo il Metodo Eureqa per ottenere una ricostruzione 3D unica, esclusiva e di alta qualità.',
      el: 'Εφαρμόζουμε τη Μέθοδο Eureqa για να αποκτήσουμε μια μοναδική, αποκλειστική και υψηλής ποιότητας τρισδιάστατη ανακατασκευή.' },
    'Fabricación del modelo': { en: 'Model manufacturing', fr: 'Fabrication du modèle', de: 'Herstellung des Modells', it: 'Fabbricazione del modello', el: 'Κατασκευή του μοντέλου' },
    'Producimos el biomodelo mediante impresión 3D.': { en: 'We produce the biomodel through 3D printing.', fr: 'Nous produisons le biomodèle par impression 3D.', de: 'Wir fertigen das Biomodell mittels 3D-Druck.', it: 'Produciamo il biomodello tramite stampa 3D.', el: 'Παράγουμε το βιομοντέλο μέσω τρισδιάστατης εκτύπωσης.' },
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

    /* ── Traumatología ── */
    'Servicios · Traumatología': { en: 'Services · Traumatology', fr: 'Services · Traumatologie', de: 'Leistungen · Traumatologie', it: 'Servizi · Traumatologia', el: 'Υπηρεσίες · Τραυματολογία' },
    'La tecnología que revoluciona la cirugía': { en: 'The technology that revolutionizes surgery', fr: 'La technologie qui révolutionne la chirurgie', de: 'Die Technologie, die die Chirurgie revolutioniert', it: 'La tecnologia che rivoluziona la chirurgia', el: 'Η τεχνολογία που φέρνει επανάσταση στη χειρουργική' },
    'La planificación quirúrgica con ayuda de un biomodelo 3D facilita el estudio de la anatomía, la preparación del abordaje y el instrumental, y mejora la previsión de complicaciones intraoperatorias.': {
      en: 'Surgical planning with the help of a 3D biomodel makes it easier to study the anatomy, prepare the approach and instruments, and improves the anticipation of intraoperative complications.',
      fr: "La planification chirurgicale à l'aide d'un biomodèle 3D facilite l'étude de l'anatomie, la préparation de l'abord et de l'instrumentation, et améliore l'anticipation des complications peropératoires.",
      de: 'Die chirurgische Planung mithilfe eines 3D-Biomodells erleichtert das Studium der Anatomie, die Vorbereitung von Zugang und Instrumentarium und verbessert die Vorhersage intraoperativer Komplikationen.',
      it: "La pianificazione chirurgica con l'aiuto di un biomodello 3D facilita lo studio dell'anatomia, la preparazione dell'approccio e della strumentazione, e migliora la previsione delle complicanze intraoperatorie.",
      el: 'Ο χειρουργικός σχεδιασμός με τη βοήθεια ενός τρισδιάστατου βιομοντέλου διευκολύνει τη μελέτη της ανατομίας, την προετοιμασία της προσέγγισης και των εργαλείων, και βελτιώνει την πρόβλεψη διεγχειρητικών επιπλοκών.' },
    'Casos habituales': { en: 'Common cases', fr: 'Cas fréquents', de: 'Häufige Fälle', it: 'Casi frequenti', el: 'Συνήθεις περιπτώσεις' },
    'Biomodelos donde la impresión 3D marca la diferencia': { en: 'Biomodels where 3D printing makes the difference', fr: "Des biomodèles où l'impression 3D fait la différence", de: 'Biomodelle, bei denen der 3D-Druck den Unterschied macht', it: 'Biomodelli dove la stampa 3D fa la differenza', el: 'Βιομοντέλα όπου η τρισδιάστατη εκτύπωση κάνει τη διαφορά' },
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
    'Solicita un biomodelo y planifica tu intervención con total confianza.': {
      en: 'Request a biomodel and plan your intervention with total confidence.',
      fr: 'Demandez un biomodèle et planifiez votre intervention en toute confiance.',
      de: 'Fordern Sie ein Biomodell an und planen Sie Ihren Eingriff mit voller Sicherheit.',
      it: 'Richiedi un biomodello e pianifica il tuo intervento con totale sicurezza.',
      el: 'Ζητήστε ένα βιομοντέλο και σχεδιάστε την επέμβασή σας με απόλυτη σιγουριά.' },

    /* ── Otras especialidades ── */
    'Servicios · Otras especialidades': { en: 'Services · Other specialties', fr: 'Services · Autres spécialités', de: 'Leistungen · Weitere Fachbereiche', it: 'Servizi · Altre specialità', el: 'Υπηρεσίες · Άλλες ειδικότητες' },
    'La impresión 3D es útil en muchas más áreas': { en: '3D printing is useful in many more areas', fr: "L'impression 3D est utile dans bien d'autres domaines", de: 'Der 3D-Druck ist in vielen weiteren Bereichen nützlich', it: 'La stampa 3D è utile in molte altre aree', el: 'Η τρισδιάστατη εκτύπωση είναι χρήσιμη σε πολλούς ακόμη τομείς' },
    'Más allá de la traumatología, los biomodelos 3D ayudan a planificar intervenciones en numerosas especialidades quirúrgicas.': {
      en: 'Beyond traumatology, 3D biomodels help plan interventions across numerous surgical specialties.',
      fr: 'Au-delà de la traumatologie, les biomodèles 3D aident à planifier des interventions dans de nombreuses spécialités chirurgicales.',
      de: 'Über die Traumatologie hinaus helfen 3D-Biomodelle bei der Planung von Eingriffen in zahlreichen chirurgischen Fachbereichen.',
      it: 'Oltre alla traumatologia, i biomodelli 3D aiutano a pianificare interventi in numerose specialità chirurgiche.',
      el: 'Πέρα από την τραυματολογία, τα τρισδιάστατα βιομοντέλα βοηθούν στον σχεδιασμό επεμβάσεων σε πολυάριθμες χειρουργικές ειδικότητες.' },
    'Urología': { en: 'Urology', fr: 'Urologie', de: 'Urologie', it: 'Urologia', el: 'Ουρολογία' },
    'Nefrectomía parcial en carcinomas renales': { en: 'Partial nephrectomy in renal carcinomas', fr: 'Néphrectomie partielle pour carcinomes rénaux', de: 'Partielle Nephrektomie bei Nierenkarzinomen', it: 'Nefrectomia parziale nei carcinomi renali', el: 'Μερική νεφρεκτομή σε νεφρικά καρκινώματα' },
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
    'Cuéntanos tu caso: la impresión 3D tiene aplicación en prácticamente cualquier procedimiento que requiera planificación anatómica.': {
      en: 'Tell us about your case: 3D printing can be applied to virtually any procedure that requires anatomical planning.',
      fr: "Parlez-nous de votre cas : l'impression 3D s'applique à pratiquement toute intervention nécessitant une planification anatomique.",
      de: 'Erzählen Sie uns von Ihrem Fall: Der 3D-Druck lässt sich bei praktisch jedem Eingriff anwenden, der eine anatomische Planung erfordert.',
      it: 'Raccontaci il tuo caso: la stampa 3D si applica praticamente a qualsiasi procedura che richieda una pianificazione anatomica.',
      el: 'Πείτε μας την περίπτωσή σας: η τρισδιάστατη εκτύπωση εφαρμόζεται σχεδόν σε κάθε επέμβαση που απαιτεί ανατομικό σχεδιασμό.' },
    'Hablemos de tu caso': { en: "Let's talk about your case", fr: 'Parlons de votre cas', de: 'Sprechen wir über Ihren Fall', it: 'Parliamo del tuo caso', el: 'Ας μιλήσουμε για την περίπτωσή σας' },

    /* ── Noticias ── */
    'Apariciones en medios, premios y novedades de Eureqa3D.': {
      en: 'Media appearances, awards and updates from Eureqa3D.',
      fr: "Apparitions médiatiques, prix et nouveautés d'Eureqa3D.",
      de: 'Medienauftritte, Auszeichnungen und Neuigkeiten von Eureqa3D.',
      it: 'Apparizioni sui media, premi e novità di Eureqa3D.',
      el: 'Εμφανίσεις στα μέσα, βραβεία και νέα της Eureqa3D.' },

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
    '<span class="ic">📍</span><span>Extremadura · España</span>': {
      en: '<span class="ic">📍</span><span>Extremadura · Spain</span>',
      fr: '<span class="ic">📍</span><span>Estrémadure · Espagne</span>',
      de: '<span class="ic">📍</span><span>Extremadura · Spanien</span>',
      it: '<span class="ic">📍</span><span>Estremadura · Spagna</span>',
      el: '<span class="ic">📍</span><span>Εστρεμαδούρα · Ισπανία</span>' },

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

    /* ── aria-labels ── */
    'Menú': { en: 'Menu', fr: 'Menu', de: 'Menü', it: 'Menu', el: 'Μενού' },
    'Anterior': { en: 'Previous', fr: 'Précédent', de: 'Zurück', it: 'Precedente', el: 'Προηγούμενο' },
    'Siguiente': { en: 'Next', fr: 'Suivant', de: 'Weiter', it: 'Successivo', el: 'Επόμενο' },

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
    'Convertimos la imagen médica de tu paciente en un modelo digital interactivo y en un biomodelo físico listo para el quirófano.': {
      en: "We turn your patient's medical image into an interactive digital model and a physical biomodel ready for the operating room.",
      fr: "Nous transformons l'image médicale de votre patient en un modèle numérique interactif et un biomodèle physique prêt pour le bloc opératoire.",
      de: 'Wir verwandeln das medizinische Bild Ihres Patienten in ein interaktives digitales Modell und ein physisches Biomodell, bereit für den Operationssaal.',
      it: "Trasformiamo l'immagine medica del tuo paziente in un modello digitale interattivo e in un biomodello fisico pronto per la sala operatoria.",
      el: 'Μετατρέπουμε την ιατρική εικόνα του ασθενούς σας σε ένα διαδραστικό ψηφιακό μοντέλο και σε ένα φυσικό βιομοντέλο έτοιμο για το χειρουργείο.' },
    'Modelos 3D — Eureqa3D': { en: '3D Models — Eureqa3D', fr: 'Modèles 3D — Eureqa3D', de: '3D-Modelle — Eureqa3D', it: 'Modelli 3D — Eureqa3D', el: '3D Μοντέλα — Eureqa3D' },

    /* ── Títulos de página (<title>) ── */
    'Eureqa3D — Impresión 3D para el sector salud': { en: 'Eureqa3D — 3D Printing for the healthcare sector', fr: 'Eureqa3D — Impression 3D pour le secteur de la santé', de: 'Eureqa3D — 3D-Druck für den Gesundheitssektor', it: 'Eureqa3D — Stampa 3D per il settore sanitario', el: 'Eureqa3D — Τρισδιάστατη εκτύπωση για τον τομέα της υγείας' },
    'Quiénes somos — Eureqa3D': { en: 'About us — Eureqa3D', fr: 'À propos — Eureqa3D', de: 'Über uns — Eureqa3D', it: 'Chi siamo — Eureqa3D', el: 'Ποιοι είμαστε — Eureqa3D' },
    'Método Eureqa — Eureqa3D': { en: 'Eureqa Method — Eureqa3D', fr: 'Méthode Eureqa — Eureqa3D', de: 'Eureqa-Methode — Eureqa3D', it: 'Metodo Eureqa — Eureqa3D', el: 'Μέθοδος Eureqa — Eureqa3D' },
    'Traumatología — Eureqa3D': { en: 'Traumatology — Eureqa3D', fr: 'Traumatologie — Eureqa3D', de: 'Traumatologie — Eureqa3D', it: 'Traumatologia — Eureqa3D', el: 'Τραυματολογία — Eureqa3D' },
    'Otras especialidades — Eureqa3D': { en: 'Other specialties — Eureqa3D', fr: 'Autres spécialités — Eureqa3D', de: 'Weitere Fachbereiche — Eureqa3D', it: 'Altre specialità — Eureqa3D', el: 'Άλλες ειδικότητες — Eureqa3D' },
    'Noticias — Eureqa3D': { en: 'News — Eureqa3D', fr: 'Actualités — Eureqa3D', de: 'Aktuelles — Eureqa3D', it: 'Notizie — Eureqa3D', el: 'Νέα — Eureqa3D' },
    'Contacto — Eureqa3D': { en: 'Contact — Eureqa3D', fr: 'Contact — Eureqa3D', de: 'Kontakt — Eureqa3D', it: 'Contatti — Eureqa3D', el: 'Επικοινωνία — Eureqa3D' },
  };

  /* Elementos de contenido a traducir (clave = innerHTML normalizado) */
  const RICH = 'h1,h2,h3,h4,h5,h6,p,li,button,.eyebrow,a.btn,.lbl,.model-spec';

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
