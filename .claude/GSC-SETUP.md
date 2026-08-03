# Google Search Console Setup — Eureqa3D

**What:** Google Search Console (GSC) is the direct communication tool between your site and Google.  
**Why:** Essential for monitoring indexation, tracking rankings, fixing errors, and understanding search performance.

---

## ✅ STEP 1: Verify Ownership

### Option A: Domain Verification (RECOMMENDED)
1. Go to: https://search.google.com/search-console
2. Click "Add property" → Enter `https://www.eureqa3d.com`
3. Choose verification method: **DNS record** (preferred for domain ownership)
4. Go to your DNS provider (wherever domain is registered)
5. Add TXT record with code provided by Google
6. Return to GSC, click "Verify"

**If you control DNS:** This is the most reliable method.

### Option B: HTML File Verification
1. In GSC, download verification HTML file
2. Upload to: `/public/google[code].html`
3. Verify in GSC

---

## ✅ STEP 2: Add Sitemap

1. **In GSC:** Left menu → Sitemaps
2. Click "Add a sitemap"
3. Enter: `https://www.eureqa3d.com/sitemap.xml`
4. Click "Submit"

**Expected:** Status shows "Success" within 24 hours.

---

## ✅ STEP 3: Check Coverage

1. **In GSC:** Left menu → Coverage
2. Review:
   - **✅ Valid:** Should show all public pages (11+)
   - **⚠️ Valid with warnings:** Check if any issues (usually harmless)
   - **❌ Excluded:** Pages Google chose not to index (check /login, /admin)
   - **❌ Errors:** Fix these

**Expected:** All public pages (/, /faq, /traumatologia, /metodo-eureqa, etc.) should be "Valid" or "Valid with warnings".

---

## ✅ STEP 4: Check Indexation

1. **In GSC:** Left menu → Pages
2. See which pages are indexed and their performance
3. If a page should be indexed but isn't:
   - Click "Request indexing" to expedite crawling

---

## ✅ STEP 5: Monitor Performance

1. **In GSC:** Left menu → Performance
2. You'll see:
   - **Queries:** Search keywords you're ranking for
   - **Clicks:** Users clicking your link in SERP
   - **Impressions:** Times your link showed in SERP
   - **CTR:** Click-through rate (%)
   - **Average position:** Where you rank (1-50+)

**What to look for:**
- Keywords with high impressions but low CTR → Optimize title/description
- Keywords with low impressions → Need more backlinks / internal links

---

## ✅ STEP 6: Check Mobile Usability

1. **In GSC:** Left menu → Mobile Usability
2. Should show "✅ No issues"
3. If issues: Fix and request re-crawl

**Expected:** No errors (already passed Lighthouse mobile test).

---

## ⚙️ Additional Settings

### Request Indexing
- Use when you add new pages or significantly update existing ones
- GSC → "Request indexing" on any page
- Google will crawl it within 24 hours

### URL Inspection
- Paste any URL from your site
- See: coverage status, last crawl date, structured data found
- Useful for debugging indexation issues

### Links Report
- See who links to you (backlinks)
- See your top internal links
- Useful for SEO strategy

---

## 📊 GSC Reports Checklist

- [ ] Verification successful
- [ ] Sitemap submitted and processed
- [ ] All public pages in Coverage report (no errors)
- [ ] Performance data starting to flow (24-48 hours)
- [ ] Mobile Usability shows "No issues"
- [ ] Links report shows your top pages

---

## 🚀 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Sitemap not found" | Check URL is exactly: `https://www.eureqa3d.com/sitemap.xml` |
| Pages not indexing | Request indexing manually in GSC |
| High impressions, low CTR | Improve title/description (too generic?) |
| No data after 48 hours | Wait another 24 hours, Google is still crawling |
| Mobile errors | Should be zero (you pass Lighthouse) |

---

## 📅 Monitoring Schedule

| Frequency | What | Why |
|-----------|------|-----|
| Daily | Check Performance (queries, CTR) | Spot trends early |
| Weekly | Check Coverage | Catch indexation issues |
| Monthly | Review top keywords | Plan content strategy |
| Monthly | Check backlinks | Monitor domain authority |

---

## 💡 Tips

1. **Set up email alerts** (GSC settings) for critical issues
2. **Link GSC to Google Analytics** for better tracking
3. **Use URL inspection** before launching new pages
4. **Request indexing** for important new pages (speeds up crawl)
5. **Monitor Mobile Usability** — Google prioritizes mobile-first indexing

---

## 🔗 External Resources

- **GSC Help:** https://support.google.com/webmasters
- **Structured Data Testing Tool:** https://schema.org/validate/
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly

---

**Status:** Ready to set up  
**Estimated time:** 15-20 minutes  
**Updated:** 2026-08-03  
**Owner:** Antonio Quintas (Médico)

---

## Next Step: After GSC Setup

Once GSC is live and data flows:
1. Identify top keywords (check Performance report)
2. Optimize pages targeting those keywords
3. Create content for keywords with search interest but no ranking
4. Build backlinks to top pages
