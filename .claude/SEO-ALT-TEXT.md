# SEO Alt Text Optimization — Eureqa3D

**Objetivo:** Mejorar Google Images search + accesibilidad + relevancia keyword.

---

## 🖼️ Imágenes en Index.html (Homepage)

| Image Path | Current Alt | ❌ Problem | ✅ Optimized Alt |
|---|---|---|---|
| `assets/img/foto/impresora.jpg` | "Impresora 3D fabricando un modelo anatómico quirúrgico" | Good pero genérico | ✅ Already good |
| `assets/img/modelos/pseudoaneurisma-a.jpg` | "Modelo digital 3D interactivo de un caso vascular" | ✅ Good | ✅ Keep |
| `assets/img/modelos/cancer-pancreas.jpg` | "Modelo digital 3D de un caso de cáncer de páncreas" | ✅ Good | ✅ Keep |
| `assets/img/clientes/*` | Missing? | Check | Add: "Hospital [name] logo - cliente de Eureqa3D" |

---

## 🖼️ Imágenes en Traumatologia.html

| Image | Current Alt | ✅ Optimized Alt |
|---|---|---|
| `assets/img/traumatologia/humero-proximal.jpg` | "Fractura de húmero proximal" | ✅ Already good (keyword-rich) |
| `assets/img/traumatologia/acetabulo.jpg` | "Fractura de acetábulo" | ✅ Keep |
| `assets/img/traumatologia/pilon-tibial.jpg` | "Fractura de pilón tibial" | ✅ Keep |
| Similar carousel images | All good | ✅ No changes needed |

---

## 🖼️ Imágenes en Visor-3D.html

| Image | ✅ Alt Text (Keyword + Descriptive) |
|---|---|
| `assets/img/modelos/pseudoaneurisma-a.jpg` | "Modelo 3D de pseudoaneurisma cardiaco - caso quirúrgico interactivo" |
| `assets/img/modelos/cancer-pancreas.jpg` | "Modelo 3D de tumor pancreático - planificación quirúrgica con impresión 3D" |
| `assets/img/modelos/a-chub202608.jpg` | "Reconstrucción 3D de páncreas y red vascular - cirugía hepatobiliopancreática" |

---

## 🎥 Video Posters (Hero Videos)

**For:** `assets/video/hero-visor.mp4` and similar

```html
<!-- CURRENT -->
<video poster="/assets/img/modelos/hero-civ-cardiaca.jpg">

<!-- ADD SCHEMA -->
<img alt="Visor 3D interactivo: modelo anatómico 3D de caso cardiaco real" src="/assets/img/modelos/hero-civ-cardiaca.jpg">
```

**Schema for video (future enhancement):**
```json
{
  "@type": "VideoObject",
  "name": "Visor 3D: Modelo anatómico 3D interactivo",
  "description": "Demostración del EureqaVisor3D con caso real de cirugía cardiaca",
  "thumbnailUrl": "https://www.eureqa3d.com/assets/img/modelos/hero-civ-cardiaca.jpg",
  "uploadDate": "2026-08-03"
}
```

---

## ✅ ALT TEXT FORMULA

**Structure:** `[Medical Specialty/Procedure] + [Anatomy] + [Context]`

**Examples:**

```
✅ "Modelo 3D de fractura de húmero proximal - Traumatología quirúrgica"
✅ "Reconstrucción 3D de tumor pancreático - Planificación oncológica"
✅ "Modelo anatómico 3D de pseudoaneurisma cardiaco - Cirugía cardiaca intervencionista"
✅ "Visor 3D interactivo para modelos quirúrgicos - Planificación preoperatoria"
```

**Avoid:**
```
❌ "Image"
❌ "Picture"
❌ "Model" (too vague)
❌ Keyword stuffing: "3D modelo 3D impresión 3D fractura 3D..."
```

---

## 📍 Logo Alt Text (Critical for Brand)

**Current:** Likely missing or "Eureqa3D"

**Optimized:**
```html
<img src="/assets/img/logo.svg" alt="Eureqa3D - Impresión 3D y modelos digitales para cirugía">
```

---

## 🔗 Check Existing Alt Text

**Bash command to find missing alt text:**
```bash
grep -E '<img(?!.*alt=)' views/public/*.html
```

---

## ✅ Implementation Checklist

- [ ] Verify all `<img>` tags have `alt` attribute (required for accessibility + SEO)
- [ ] Check carousel images in traumatologia.html (confirm alt text)
- [ ] Add alt text to client logos if missing
- [ ] Review video poster images for alt text
- [ ] Test in Google Search Console: Images report
- [ ] Validate with accessibility tools (WAVE, Axe)

---

**Status:** Most images already have good alt text. Only gaps: logos, video posters.
**Updated:** 2026-08-03
