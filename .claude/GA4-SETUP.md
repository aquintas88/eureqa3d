# Google Analytics 4 Setup — Eureqa3D

**What:** GA4 tracks user behavior: page views, sessions, conversions (form submissions), and more.  
**Why:** Measure SEO effectiveness + understand how visitors use your site.

---

## ✅ STEP 1: Create GA4 Property

1. Go to: https://analytics.google.com
2. Sign in with Google account
3. Click **"Admin"** (bottom left)
4. Click **"Create property"**
5. Enter:
   - **Property name:** `Eureqa3D` or `Eureqa3D - Production`
   - **Reporting timezone:** `Europe/Madrid` or `Spain`
   - **Currency:** `EUR`
6. Click **"Create"**

---

## ✅ STEP 2: Create Data Stream

1. **Property settings** → **Data streams**
2. Click **"Add stream"**
3. Choose **Web**
4. Enter:
   - **Website URL:** `https://www.eureqa3d.com`
   - **Stream name:** `Eureqa3D Website`
5. Click **"Create stream"**

**You'll get:** A Measurement ID (starts with `G-`), e.g., `G-XXXXXXXXXX`

---

## ✅ STEP 3: Install Tracking Code

### Option A: Using Google Tag Manager (Advanced)
- Setup GTM container for `www.eureqa3d.com`
- Add GA4 tag
- (Recommended if you have other tracking needs)

### Option B: Direct GA4 Code (Simple - Recommended)

1. Copy Measurement ID from Step 2
2. In your HTML `<head>`, add (or ask developer to add):

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': window.location.pathname
  });
</script>
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID.**

### For Eureqa3D:
Add to `/assets/analytics.js` or directly in HTML `<head>` of base layout.

**Note:** The codebase already has `/assets/analytics.js` — possibly add GA4 code there.

---

## ✅ STEP 4: Verify Tracking

1. **In GA4:** Reporting → Realtime
2. Visit your site: `https://www.eureqa3d-production.up.railway.app`
3. **Expected:** You should see yourself in "Realtime" active users

**If not showing:**
- Wait 30 seconds (GA is real-time but with slight delay)
- Clear browser cache and reload
- Check console for JS errors
- Verify Measurement ID is correct

---

## ✅ STEP 5: Set Up Goals (Conversions)

### Goal: Form Submission (Contact Form)

1. **In GA4:** Admin → Conversions
2. Click **"New conversion"**
3. **Event name:** `form_submit` (or whatever your form uses)
4. **Description:** `Contact form submission`
5. **Click "Create"**

**Note:** Your contact form in `/assets/site.js` needs to trigger this event:

```javascript
// In your form submit handler:
gtag('event', 'form_submit', {
  'event_category': 'engagement',
  'event_label': 'Contact form'
});
```

### Goal: FAQ Page View
1. Create conversion → **Event name:** `view_faq`
2. Add trigger when users view `/faq`

### Goal: Signup/Lead
If you have a lead capture form, create similar conversion.

---

## ✅ STEP 6: Link GSC to GA4

1. **In GA4:** Admin → Google Search Console links
2. Click **"Link"**
3. Select your GSC property from dropdown
4. Click **"Link"**

**Benefit:** See search queries, CTR, and impressions directly in GA4 under Acquisition > Google Search Console.

---

## 📊 Key Reports to Monitor

### 1. Realtime
- **What:** Users on site right now
- **Use:** Verify tracking is working
- **Check:** After publishing new content

### 2. Traffic Sources
- **Path:** Acquisition → Traffic source/medium
- **What:** Where users come from (organic, direct, referral)
- **Expected:** "organic" = Google search traffic (goal!)

### 3. Pages & Screens
- **Path:** Engagement → Pages and screens
- **What:** Which pages get most traffic
- **Expected:** Homepage, /faq, /traumatologia should rank high

### 4. Search Queries (after GSC link)
- **Path:** Acquisition → Google Search Console
- **What:** Keywords users searched to find you
- **Use:** Inform content strategy

### 5. Conversions
- **Path:** Monetization → Conversions (or Engagement if configured differently)
- **What:** Form submissions, goal completions
- **Expected:** Track contact form usage

---

## ⚙️ Custom Events to Track

Consider tracking these events for better insight:

```javascript
// When user clicks "Solicitar caso de prueba"
gtag('event', 'request_trial', {
  'event_category': 'engagement',
  'event_label': 'Trial request CTA'
});

// When user views FAQ
gtag('event', 'view_page', {
  'event_category': 'engagement',
  'event_label': '/faq'
});

// When user clicks "Contactar"
gtag('event', 'contact_click', {
  'event_category': 'engagement',
  'event_label': 'Contact button'
});
```

---

## 📅 Initial Setup Checklist

- [ ] GA4 property created
- [ ] Data stream created + Measurement ID obtained
- [ ] Tracking code installed in website
- [ ] Realtime shows active users
- [ ] GSC linked to GA4
- [ ] Contact form conversion configured
- [ ] FAQ page view tracking set up

---

## 🚀 Monitoring Schedule

| When | What | Why |
|------|------|-----|
| Daily | Realtime users | Ensure tracking works |
| Weekly | Traffic sources | Organic traffic trending up? |
| Weekly | Top pages | Which pages attract users? |
| Monthly | Search queries (GSC link) | What keywords bring traffic? |
| Monthly | Conversions | How many leads from organic? |

---

## 💡 Tips

1. **Don't track yourself** — Use incognito mode or exclude your IP from analytics
2. **Give it 24 hours** — GA needs time to accumulate data
3. **Check for spam** — Filter out bot traffic in Admin → Data streams
4. **Set up alerts** — Notifications if traffic drops suddenly
5. **Mobile tracking** — GA4 tracks mobile users separately, monitor both

---

## 🔗 External Resources

- **GA4 Help:** https://support.google.com/analytics
- **GA4 Events Guide:** https://developers.google.com/analytics/devguides/collection/ga4/events
- **GA4 Implementation:** https://support.google.com/analytics/answer/9744165

---

## ⚠️ Common Issues

| Issue | Fix |
|-------|-----|
| "No data after 48 hours" | Check Measurement ID is correct in code |
| Realtime shows "0 users" | Check you're not in incognito mode, clear cache |
| Search Console data missing | Link GSC to GA4 in Admin settings |
| Form submissions not tracked | Ensure `gtag('event', 'form_submit')` fires on submit |

---

**Status:** Ready to implement  
**Estimated time:** 20-30 minutes  
**Updated:** 2026-08-03  
**Owner:** Antonio Quintas (Médico)

---

## Next: After GA4 is Live (1-2 weeks)

1. Review traffic patterns in GA4
2. Cross-reference with GSC for keyword performance
3. Identify high-traffic pages and low-CTR keywords
4. Plan content to fill gaps (low traffic → high opportunity keywords)
