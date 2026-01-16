# Legal Pages - Razorpay Compliance

## ✅ COMPLETE

All mandatory policy pages for Razorpay compliance have been added.

---

## 📄 Pages Created

### 1. Contact Us
**Route:** `/contact`
**File:** `frontend/src/pages/legal/Contact.jsx`

**Content:**
- Email support: contact@evizenai.com
- Feedback section
- About Replai information
- Response time: 24-48 hours

---

### 2. Terms & Conditions
**Route:** `/terms`
**File:** `frontend/src/pages/legal/Terms.jsx`

**Sections:**
- Acceptance of Terms
- Service Description
- User Responsibilities
- Payment Terms
- AI-Generated Content disclaimer
- Limitation of Liability
- Account Termination
- Changes to Terms
- Contact information

---

### 3. Privacy Policy
**Route:** `/privacy`
**File:** `frontend/src/pages/legal/Privacy.jsx`

**Sections:**
- Information We Collect
- How We Use Your Information
- Data Storage & Security
- Third-Party Services (Razorpay, OpenRouter, Supabase)
- Data Retention
- Your Rights
- Cookies & Tracking
- Children's Privacy
- Changes to Privacy Policy
- Contact information

---

### 4. Cancellations & Refunds
**Route:** `/refunds`
**File:** `frontend/src/pages/legal/Refunds.jsx`

**Sections:**
- Refund Policy
- Eligible Refund Cases
- Non-Refundable Cases
- How to Request a Refund
- Refund Processing Time (5-7 business days)
- Cancellation Policy
- Payment Disputes
- Contact information

---

### 5. Shipping Policy
**Route:** `/shipping`
**File:** `frontend/src/pages/legal/Shipping.jsx`

**Content:**
- **Clear "Not Applicable" notice**
- Explanation: Digital service, no physical goods
- Service Delivery (instant)
- Digital Product Nature
- Instant Activation
- Contact information

---

## 🔗 Navigation

### Footer Links Added
All pages are accessible via footer links on the landing page:

```
Contact | Terms | Privacy | Refunds | Shipping
```

**Location:** `frontend/src/components/Landing/Landing.jsx`

---

## 📧 Contact Email

All pages use: **contact@evizenai.com**

This email is mentioned in:
- Contact Us page (primary)
- Terms & Conditions
- Privacy Policy
- Cancellations & Refunds
- Shipping Policy

---

## 🎨 Design

All pages follow the existing Replai design system:
- Clean, minimal layout
- Rose accent color (#E11D48)
- White background with gray-50 page background
- Rounded cards with subtle shadows
- Consistent typography
- Mobile-responsive
- "Back to Home" link on each page

---

## 🚀 Routes Added

```javascript
// Legal Pages (Public - No Auth Required)
/contact   → Contact.jsx
/terms     → Terms.jsx
/privacy   → Privacy.jsx
/refunds   → Refunds.jsx
/shipping  → Shipping.jsx
```

**File:** `frontend/src/App.jsx`

---

## ✅ Razorpay Compliance

### Required Pages ✓
- ✅ Contact Us
- ✅ Terms & Conditions
- ✅ Privacy Policy
- ✅ Cancellations & Refunds
- ✅ Shipping Policy (marked as N/A for digital service)

### Content Requirements ✓
- ✅ Product name: Replai
- ✅ Nature: Digital AI service
- ✅ Payment method: Razorpay
- ✅ Support email: contact@evizenai.com
- ✅ Refund policy clearly stated
- ✅ Shipping policy marked as Not Applicable
- ✅ Privacy policy covers data collection
- ✅ Terms cover service usage

---

## 🧪 Testing

### Build Test
```bash
cd frontend
npm run build
```
**Result:** ✅ Build successful

### Manual Testing
Visit the following URLs after deployment:
- https://replai-sandy.vercel.app/contact
- https://replai-sandy.vercel.app/terms
- https://replai-sandy.vercel.app/privacy
- https://replai-sandy.vercel.app/refunds
- https://replai-sandy.vercel.app/shipping

---

## 📋 Files Modified

### New Files Created
```
frontend/src/pages/legal/Contact.jsx
frontend/src/pages/legal/Terms.jsx
frontend/src/pages/legal/Privacy.jsx
frontend/src/pages/legal/Refunds.jsx
frontend/src/pages/legal/Shipping.jsx
```

### Modified Files
```
frontend/src/App.jsx (added routes)
frontend/src/components/Landing/Landing.jsx (added footer links)
```

---

## 🎯 Key Features

### Professional Content
- Realistic, startup-safe language
- No legal over-claiming
- No fake addresses
- Clear, concise explanations
- User-friendly tone

### Razorpay-Specific
- Payment processing via Razorpay mentioned
- Refund policy aligned with digital services
- Shipping policy clearly states "Not Applicable"
- Contact information for disputes

### Privacy & Security
- Data collection transparency
- Third-party services listed
- User rights clearly stated
- GDPR-friendly language

---

## 🚀 Deployment

No additional deployment steps required. The pages are:
- ✅ Part of the frontend build
- ✅ Publicly accessible (no auth required)
- ✅ Linked in footer
- ✅ SEO-friendly URLs

Simply deploy the frontend as usual:
```bash
git add .
git commit -m "Add legal pages for Razorpay compliance"
git push origin main
```

Vercel will auto-deploy.

---

## ✅ Compliance Checklist

- ✅ Contact page with support email
- ✅ Terms & Conditions with service description
- ✅ Privacy Policy with data handling details
- ✅ Refund policy with clear guidelines
- ✅ Shipping policy marked as N/A for digital service
- ✅ All pages accessible via footer
- ✅ Professional, trustworthy content
- ✅ Contact email: contact@evizenai.com
- ✅ Razorpay mentioned as payment provider
- ✅ No fake information or addresses

---

## 🎉 Ready for Production

All legal pages are complete and ready for Razorpay compliance verification.
