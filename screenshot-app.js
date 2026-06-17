const { chromium } = require('playwright');
const path = require('path');

const APP = 'file://' + path.resolve(__dirname, 'pages/syriaway-app.html');
const OUT = path.resolve(__dirname, 'screenshots');
require('fs').mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  async function go(fn) { await fn(); await page.waitForTimeout(400); }
  const shot = (name) => page.screenshot({ path: path.join(OUT, name), fullPage: true });

  // 1. Home - English
  await page.goto(APP);
  await page.waitForTimeout(500);
  await shot('01-home-en.png');

  // 2. Packages - English
  await go(() => page.evaluate(() => showSection('packages')));
  await shot('02-packages-en.png');

  // 3. Booking modal - English
  await go(() => page.evaluate(() => openBooking(1)));
  await shot('03-booking-en.png');
  await go(() => page.evaluate(() => closeModal('bookingModal')));

  // 4. Admin login
  await go(() => page.evaluate(() => showSection('login')));
  await shot('04-login-en.png');

  // 5. Admin dashboard - English (log in first)
  await go(() => page.evaluate(() => { localStorage.setItem('swAdminLoggedIn','true'); showSection('dashboard'); renderBookings(); renderCustomers(); }));
  await shot('05-dashboard-en.png');

  // 6. Analytics tab - English
  await go(() => page.evaluate(() => { document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active')); document.querySelectorAll('.tab-button').forEach(b=>b.classList.remove('active')); document.getElementById('analytics-tab').classList.add('active'); }));
  await shot('06-analytics-en.png');

  // ===== ARABIC =====
  await go(() => page.evaluate(() => { toggleLanguage(); showSection('home'); }));
  await shot('07-home-ar.png');

  await go(() => page.evaluate(() => showSection('packages')));
  await shot('08-packages-ar.png');

  await go(() => page.evaluate(() => { localStorage.setItem('swAdminLoggedIn','true'); showSection('dashboard'); renderBookings(); renderCustomers(); }));
  await shot('09-dashboard-ar.png');

  await browser.close();
  console.log('Screenshots done in', OUT);
})();
