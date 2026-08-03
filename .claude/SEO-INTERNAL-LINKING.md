# SEO Internal Linking Strategy — Eureqa3D

**Objetivo:** Mejorar flujo de autoridad y guiar usuarios a través del sitio con anchor text keyword-rich.

---

## 📍 Homepage → Especialidades (Reforzar)

**De:** `index.html` (Hero section)
**A:** `/traumatologia`, `/otras-especialidades`

**Anchor text (keyword-focused):**
- ❌ "Ver detalle"
- ✅ "Modelos 3D para traumatología"
- ✅ "Impresión 3D para oncología"

**Dónde:** Hero CTA + sección "Áreas de aplicación"

---

## 📍 Especialidades → Método (Explicar proceso)

**De:** `/traumatologia`, `/otras-especialidades`
**A:** `/metodo-eureqa`

**Anchor text:**
- ❌ "Conoce el Método"
- ✅ "Método Eureqa para planificación quirúrgica"
- ✅ "Proceso de conversión DICOM a modelo 3D"

**Dónde:** Final de cada página de especialidad (antes de CTA contacto)

---

## 📍 Todas las páginas → FAQ (Respuestas)

**De:** Cualquier página
**A:** `/faq`

**Anchor text:**
- ❌ "FAQ"
- ✅ "Preguntas frecuentes sobre impresión 3D"
- ✅ "¿Cuánto tarda un modelo 3D?"

**Dónde:** Footer o sección CTA

---

## 📍 Todas las páginas → Contacto (Conversión)

**De:** Todas
**A:** `/contacto`

**Anchor text (CTA):**
- "Solicita un caso de prueba"
- "Contactar ahora"
- "Llamar: +34 654 55 20 44"

**Dónde:** CTA buttons, footer

---

## 🔗 Estructura de Navegación Propuesta

```
Homepage (/)*
├─→ Quiénes Somos (/quienes-somos)
├─→ Método Eureqa (/metodo-eureqa)*
│   └─→ Especialidades
├─→ Traumatología (/traumatologia)*
│   └─→ Método (/metodo-eureqa)
├─→ Otras Especialidades (/otras-especialidades)*
│   └─→ Método (/metodo-eureqa)
├─→ Visor 3D (/visor-3d)*
├─→ FAQ (/faq)*
├─→ Contacto (/contacto)*
├─→ Noticias (/noticias)
└─→ Legal Pages
    ├─ Aviso Legal
    ├─ Política de Privacidad
    └─ Política de Cookies

* = High priority (main user journey)
```

---

## 🎯 Anchor Text Guidelines

**Evitar:** "Click here", "More", "Learn more", "Read more"
**Preferir:** Descriptive keywords

**Ejemplos:**

```html
<!-- ❌ MALO -->
<a href="/traumatologia">Ver detalle</a>

<!-- ✅ BUENO -->
<a href="/traumatologia">Modelos 3D para traumatología: fracturas complejas</a>

<!-- ✅ BUENO (corto) -->
<a href="/faq">Preguntas frecuentes sobre impresión 3D</a>
```

---

## 📊 Link Distribution by Page Priority

| Page | Incoming Links | Anchor Focus |
|------|----------------|-------------|
| Homepage | Self | Brand |
| Traumatología | Home + FAQ | "traumatología 3D", "fracturas" |
| Oncología | Home + FAQ | "oncología 3D", "impresión 3D tumor" |
| Método Eureqa | All specialties | "Método Eureqa", "proceso DICOM" |
| Visor 3D | Home + Método | "Visor 3D", "visualización 3D" |
| FAQ | All pages | Long-tail keywords |
| Contacto | All pages (CTAs) | "Solicitar caso" |

---

## ⚠️ Redirection Opportunities

**Agregar 301 redirect:**
- `/modelos-3d` → `/visor-3d` (ya existe)
- Futuro: `/impresion-3d` → `/metodo-eureqa`

---

## ✅ Implementation Checklist

- [ ] Añadir link FAQ en footer
- [ ] Añadir link Método Eureqa en páginas especialidades
- [ ] Verificar anchor text keyword-focused en CTA
- [ ] Comprobar que no hay broken links internos
- [ ] Validar en Google Search Console: Coverage + Internal Links report

---

**Status:** Ready to implement
**Updated:** 2026-08-03
