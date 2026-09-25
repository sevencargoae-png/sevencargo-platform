/* SEVENCARGO shared client utilities */
(function () {
  'use strict';
  const SC = (window.SC = window.SC || {});

  // ---------------- i18n ----------------
  const DICT = { ar: {}, en: {} };
  SC.addDict = (d) => { Object.assign(DICT.ar, d.ar || {}); Object.assign(DICT.en, d.en || {}); };
  const scope = () => (document.body && document.body.dataset.scope) || 'public';
  const langKey = () => 'sc_lang_' + scope();
  SC.lang = (() => { try { return localStorage.getItem('sc_lang_' + ((document.currentScript && document.currentScript.dataset.scope) || 'public')) || 'ar'; } catch { return 'ar'; } })();
  SC.t = (k, vars) => {
    let s = DICT[SC.lang][k]; if (s == null) s = DICT.en[k]; if (s == null) s = k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.split('{' + a + '}').join(b);
    return s;
  };
  SC.applyI18n = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = SC.t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = SC.t(el.dataset.i18nHtml); });
    root.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', SC.t(el.dataset.i18nPh)); });
    root.querySelectorAll('[data-i18n-title]').forEach((el) => { el.setAttribute('title', SC.t(el.dataset.i18nTitle)); });
  };
  const listeners = [];
  SC.onLang = (fn) => listeners.push(fn);
  SC.setLang = (l) => {
    SC.lang = l === 'en' ? 'en' : 'ar';
    try { localStorage.setItem(langKey(), SC.lang); } catch { /* ignore */ }
    document.documentElement.lang = SC.lang;
    document.documentElement.dir = SC.lang === 'ar' ? 'rtl' : 'ltr';
    SC.applyI18n();
    document.querySelectorAll('[data-lang-toggle]').forEach((b) => { b.textContent = SC.lang === 'ar' ? 'English' : 'العربية'; });
    listeners.forEach((fn) => { try { fn(SC.lang); } catch (e) { console.error(e); } });
  };
  SC.initLang = () => {
    try { SC.lang = localStorage.getItem(langKey()) || 'ar'; } catch { SC.lang = 'ar'; }
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lang-toggle]');
      if (b) { e.preventDefault(); SC.setLang(SC.lang === 'ar' ? 'en' : 'ar'); }
    });
    SC.setLang(SC.lang);
  };

  SC.addDict({
    ar: {
      brand: 'SEVENCARGO', home: 'الرئيسية', ship_now: 'اشحن الآن', track: 'تتبع شحنة', complaints: 'الشكاوى', login: 'الدخول',
      login_admin: 'لوحة الإدارة', login_admin_sub: 'لموظفي العمليات', login_driver: 'بوابة المندوب', login_driver_sub: 'للمندوبين والسائقين',
      login_customer: 'شحناتي', login_customer_sub: 'تتبع برقم الهاتف أو رقم الشحنة',
      privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', cookies: 'سياسة الكوكيز', rights: 'جميع الحقوق محفوظة',
      aed: 'درهم', km: 'كم', kg: 'كجم', cm: 'سم', close: 'إغلاق', cancel: 'إلغاء', save: 'حفظ', send: 'إرسال', confirm: 'تأكيد',
      loading: 'جارِ التحميل…', error: 'حدث خطأ', retry: 'إعادة المحاولة', yes: 'نعم', no: 'لا', back: 'رجوع', next: 'التالي',
      logout: 'تسجيل الخروج', password: 'كلمة المرور', phone: 'رقم الهاتف', name: 'الاسم', search: 'بحث', all: 'الكل',
      whatsapp: 'واتساب', call: 'اتصال', navigate: 'الملاحة', copy: 'نسخ', copied: 'تم النسخ', view: 'عرض', edit: 'تعديل', optional: 'اختياري',
      type_message: 'اكتب رسالة…', no_messages: 'لا توجد رسائل بعد', chat: 'المحادثة', now: 'الآن',
      ct_documents: 'مستندات', ct_electronics: 'إلكترونيات', ct_clothing: 'ملابس وأحذية', ct_cosmetics: 'مستحضرات تجميل', ct_household: 'أدوات منزلية',
      ct_spare_parts: 'قطع غيار', ct_gifts: 'هدايا', ct_other: 'أخرى',
      you: 'أنت', customer: 'العميل', admin: 'الإدارة', driver: 'المندوب', system: 'النظام',
      // statuses
      st_created: 'تم إنشاء الطلب', st_awaiting_payment: 'بانتظار الدفع', st_pending: 'بانتظار تعيين مندوب', st_assigned: 'تم تعيين مندوب',
      st_accepted: 'المندوب في الطريق للاستلام', st_picked_up: 'تم الاستلام — في الطريق للتسليم', st_delivered: 'تم التسليم',
      st_failed: 'تعذّر التسليم', st_cancelled: 'ملغي', st_paid: 'تم الدفع', st_cash_collected: 'تم تحصيل المبلغ نقدًا',
      st_rejected: 'رفض المندوب', st_reassigned: 'إعادة تعيين', st_note: 'ملاحظة', st_payment_pending: 'بانتظار الدفع', st_cash_settled: 'تمت تسوية النقدية',
      pm_online: 'دفع أونلاين (بطاقة)', pm_cash_sender: 'كاش — يدفع المرسل عند الاستلام', pm_cash_receiver: 'كاش — يدفع المستلم عند التسليم',
      ps_paid: 'مدفوع', ps_unpaid: 'غير مدفوع', ps_refunded: 'مسترد',
      // errors
      e_network: 'تعذّر الاتصال بالخادم', e_server_error: 'خطأ في الخادم، حاول مرة أخرى', e_unauthorized: 'انتهت الجلسة، سجّل الدخول مجددًا',
      e_invalid_credentials: 'بيانات الدخول غير صحيحة', e_too_many_attempts: 'محاولات كثيرة، انتظر قليلًا', e_too_many_requests: 'طلبات كثيرة، انتظر قليلًا',
      e_not_found: 'غير موجود', e_invalid_phone: 'رقم الهاتف غير صحيح', e_invalid_sender_phone: 'رقم هاتف المرسل غير صحيح',
      e_invalid_receiver_phone: 'رقم هاتف المستلم غير صحيح', e_outside_service_area: 'الموقع خارج نطاق الخدمة (داخل الإمارات فقط)',
      e_emirate_not_served: 'الخدمة غير متاحة حاليًا في هذه الإمارة', e_invalid_weight: 'الوزن غير صحيح أو يتجاوز الحد المسموح',
      e_invalid_length: 'الطول غير صحيح', e_invalid_width: 'العرض غير صحيح', e_invalid_height: 'الارتفاع غير صحيح',
      e_missing_photo: 'صورة الشحنة مطلوبة', e_invalid_photo: 'صيغة الصورة غير مدعومة', e_too_large_photo: 'حجم الصورة كبير جدًا',
      e_must_accept_terms: 'يجب الموافقة على الشروط وقائمة المواد الممنوعة', e_online_payment_unavailable: 'الدفع الأونلاين غير متاح حاليًا',
      e_invalid_tracking: 'رقم الشحنة غير صحيح', e_no_access: 'لا تملك صلاحية عرض هذه الشحنة', e_cannot_cancel: 'لا يمكن إلغاء الشحنة في هذه المرحلة',
      e_already_rated: 'تم التقييم مسبقًا', e_not_delivered: 'لم يتم التسليم بعد', e_wrong_delivery_code: 'كود التسليم غير صحيح',
      e_outside_geofence: 'أنت بعيد عن موقع العميل', e_confirm_cash_collected: 'أكّد تحصيل المبلغ نقدًا', e_driver_not_on_duty: 'المندوب غير مسجّل حضور',
      e_driver_other_emirate: 'المندوب تابع لإمارة أخرى', e_phone_exists: 'رقم الهاتف مسجّل مسبقًا', e_cannot_assign_in_status: 'لا يمكن التعيين في هذه الحالة',
      e_invalid_status_for_action: 'الإجراء غير متاح في الحالة الحالية', e_too_large: 'حجم البيانات كبير جدًا', e_forbidden: 'غير مصرح',
      e_note_required_for_reopen: 'اكتب سببًا لتغيير حالة طلب منتهٍ', e_assign_driver_first: 'عيّن مندوبًا أولًا', e_weak_password: 'كلمة المرور ضعيفة',
      e_wrong_password: 'كلمة المرور الحالية غير صحيحة', e_username_exists: 'اسم المستخدم مستخدم مسبقًا', e_already_paid: 'مدفوع مسبقًا',
      e_geo_denied: 'لم يتم السماح بالوصول للموقع. فعّل خدمة الموقع وحاول مجددًا', e_geo_unavailable: 'تعذّر تحديد الموقع',
    },
    en: {
      brand: 'SEVENCARGO', home: 'Home', ship_now: 'Ship now', track: 'Track', complaints: 'Complaints', login: 'Sign in',
      login_admin: 'Admin dashboard', login_admin_sub: 'Operations staff', login_driver: 'Courier portal', login_driver_sub: 'Couriers & drivers',
      login_customer: 'My shipments', login_customer_sub: 'Track by phone or tracking number',
      privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy', rights: 'All rights reserved',
      aed: 'AED', km: 'km', kg: 'kg', cm: 'cm', close: 'Close', cancel: 'Cancel', save: 'Save', send: 'Send', confirm: 'Confirm',
      loading: 'Loading…', error: 'Something went wrong', retry: 'Retry', yes: 'Yes', no: 'No', back: 'Back', next: 'Next',
      logout: 'Sign out', password: 'Password', phone: 'Phone number', name: 'Name', search: 'Search', all: 'All',
      whatsapp: 'WhatsApp', call: 'Call', navigate: 'Navigate', copy: 'Copy', copied: 'Copied', view: 'View', edit: 'Edit', optional: 'optional',
      type_message: 'Type a message…', no_messages: 'No messages yet', chat: 'Chat', now: 'now',
      ct_documents: 'Documents', ct_electronics: 'Electronics', ct_clothing: 'Clothing & shoes', ct_cosmetics: 'Cosmetics', ct_household: 'Household items',
      ct_spare_parts: 'Spare parts', ct_gifts: 'Gifts', ct_other: 'Other',
      you: 'You', customer: 'Customer', admin: 'Operations', driver: 'Courier', system: 'System',
      st_created: 'Order placed', st_awaiting_payment: 'Awaiting payment', st_pending: 'Awaiting courier assignment', st_assigned: 'Courier assigned',
      st_accepted: 'Courier on the way to pick up', st_picked_up: 'Picked up — out for delivery', st_delivered: 'Delivered',
      st_failed: 'Delivery failed', st_cancelled: 'Cancelled', st_paid: 'Payment received', st_cash_collected: 'Cash collected',
      st_rejected: 'Courier declined', st_reassigned: 'Reassigned', st_note: 'Note', st_payment_pending: 'Awaiting payment', st_cash_settled: 'Cash settled',
      pm_online: 'Pay online (card)', pm_cash_sender: 'Cash — sender pays at pickup', pm_cash_receiver: 'Cash — receiver pays on delivery',
      ps_paid: 'Paid', ps_unpaid: 'Unpaid', ps_refunded: 'Refunded',
      e_network: 'Could not reach the server', e_server_error: 'Server error, please try again', e_unauthorized: 'Session expired, please sign in again',
      e_invalid_credentials: 'Invalid credentials', e_too_many_attempts: 'Too many attempts, please wait', e_too_many_requests: 'Too many requests, please wait',
      e_not_found: 'Not found', e_invalid_phone: 'Invalid phone number', e_invalid_sender_phone: 'Invalid sender phone',
      e_invalid_receiver_phone: 'Invalid receiver phone', e_outside_service_area: 'Location is outside our service area (UAE only)',
      e_emirate_not_served: 'Service is not available in this emirate yet', e_invalid_weight: 'Invalid weight or above the allowed limit',
      e_invalid_length: 'Invalid length', e_invalid_width: 'Invalid width', e_invalid_height: 'Invalid height',
      e_missing_photo: 'A photo of the parcel is required', e_invalid_photo: 'Unsupported image format', e_too_large_photo: 'Image is too large',
      e_must_accept_terms: 'Please accept the terms and prohibited items list', e_online_payment_unavailable: 'Online payment is not available right now',
      e_invalid_tracking: 'Invalid tracking number', e_no_access: 'You do not have access to this shipment', e_cannot_cancel: 'This shipment can no longer be cancelled',
      e_already_rated: 'Already rated', e_not_delivered: 'Not delivered yet', e_wrong_delivery_code: 'Wrong delivery code',
      e_outside_geofence: 'You are far from the customer location', e_confirm_cash_collected: 'Confirm the cash was collected', e_driver_not_on_duty: 'Courier is not checked in',
      e_driver_other_emirate: 'Courier belongs to another emirate', e_phone_exists: 'Phone number already registered', e_cannot_assign_in_status: 'Cannot assign in this status',
      e_invalid_status_for_action: 'Action not available in the current status', e_too_large: 'Payload too large', e_forbidden: 'Not allowed',
      e_note_required_for_reopen: 'Add a reason to change a closed order', e_assign_driver_first: 'Assign a courier first', e_weak_password: 'Password is too weak',
      e_wrong_password: 'Current password is wrong', e_username_exists: 'Username already exists', e_already_paid: 'Already paid',
      e_geo_denied: 'Location permission denied. Enable location services and retry', e_geo_unavailable: 'Could not get your location',
    },
  });

  SC.errText = (code) => {
    const k = 'e_' + code;
    const s = SC.t(k);
    if (s !== k) return s;
    if (/^invalid_|^missing_|^too_long_/.test(code)) return SC.t('error') + ' (' + code + ')';
    return SC.t('error');
  };

  // ---------------- api ----------------
  SC.api = async (url, opts = {}) => {
    const o = { method: opts.method || (opts.body ? 'POST' : 'GET'), headers: {}, credentials: 'same-origin' };
    if (opts.body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(opts.body); }
    let r;
    try { r = await fetch(url, o); } catch { const e = new Error(SC.t('e_network')); e.code = 'network'; throw e; }
    let data = null;
    try { data = await r.json(); } catch { /* not json */ }
    if (!r.ok) {
      const code = (data && data.error) || (r.status === 401 ? 'unauthorized' : 'server_error');
      const e = new Error(SC.errText(code)); e.code = code; e.status = r.status; e.data = data; throw e;
    }
    return data;
  };

  // ---------------- dom helpers ----------------
  SC.$ = (s, r = document) => r.querySelector(s);
  SC.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  SC.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  SC.h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  SC.toast = (msg, type = 'info', title) => {
    let box = SC.$('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = (title ? '<b>' + SC.esc(title) + '</b>' : '') + SC.esc(msg);
    box.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, type === 'error' ? 6000 : 4200);
  };
  SC.fail = (e) => SC.toast(e && e.message ? e.message : SC.t('error'), 'error');

  SC.modal = (html, { wide = false, onClose } = {}) => {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div>`;
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    back.addEventListener('mousedown', (e) => { if (e.target === back) close(); });
    back.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(back);
    SC.applyI18n(back);
    return { el: back.firstElementChild, close };
  };
  SC.confirmBox = (text, { danger = false, input = null } = {}) => new Promise((resolve) => {
    const m = SC.modal(`<div class="modal-head"><h3>${SC.esc(text)}</h3></div>
      ${input ? `<div class="field"><label>${SC.esc(input)}</label><textarea data-in></textarea></div>` : ''}
      <div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-no>${SC.t('cancel')}</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-yes>${SC.t('confirm')}</button></div>`,
    { onClose: () => resolve(null) });
    m.el.querySelector('[data-no]').onclick = () => m.close();
    m.el.querySelector('[data-yes]').onclick = () => {
      const v = input ? m.el.querySelector('[data-in]').value.trim() : true;
      if (input && !v) { m.el.querySelector('[data-in]').focus(); return; }
      resolve(v); m.el.parentElement.remove();
    };
  });
  SC.imageViewer = (src) => SC.modal(`<div class="modal-head"><h3></h3><button class="btn btn-ghost btn-sm" data-close>${SC.t('close')}</button></div><img src="${SC.esc(src)}" style="width:100%;border-radius:12px">`, { wide: true });
  document.addEventListener('click', (e) => { const im = e.target.closest('img.photo-thumb'); if (im) SC.imageViewer(im.src); });

  // ---------------- formatting ----------------
  SC.money = (v) => `${Number(v || 0).toLocaleString(SC.lang === 'ar' ? 'ar-AE' : 'en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${SC.t('aed')}`;
  SC.date = (d) => d ? new Date(d).toLocaleString(SC.lang === 'ar' ? 'ar-AE' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai' }) : '—';
  SC.time = (d) => d ? new Date(d).toLocaleTimeString(SC.lang === 'ar' ? 'ar-AE' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }) : '';
  SC.ago = (d) => {
    if (!d) return '—';
    const s = Math.max(0, (Date.now() - new Date(d).getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(SC.lang, { numeric: 'auto' });
    if (s < 60) return SC.t('now');
    if (s < 3600) return rtf.format(-Math.round(s / 60), 'minute');
    if (s < 86400) return rtf.format(-Math.round(s / 3600), 'hour');
    return rtf.format(-Math.round(s / 86400), 'day');
  };
  SC.status = (s) => `<span class="pill s-${SC.esc(s)}"><span class="dot"></span>${SC.esc(SC.t('st_' + s))}</span>`;
  SC.EMIRATES = { AUH: { ar: 'أبوظبي', en: 'Abu Dhabi' }, DXB: { ar: 'دبي', en: 'Dubai' }, SHJ: { ar: 'الشارقة', en: 'Sharjah' }, AJM: { ar: 'عجمان', en: 'Ajman' }, UAQ: { ar: 'أم القيوين', en: 'Umm Al Quwain' }, RAK: { ar: 'رأس الخيمة', en: 'Ras Al Khaimah' }, FUJ: { ar: 'الفجيرة', en: 'Fujairah' } };
  SC.em = (c) => (SC.EMIRATES[c] ? SC.EMIRATES[c][SC.lang] : c || '—');
  SC.phoneFmt = (p) => { const s = String(p || ''); return s.startsWith('971') ? '+971 ' + s.slice(3) : '+' + s; };
  SC.normPhone = (p) => {
    let s = String(p || '').replace(/[^\d]/g, '');
    if (s.startsWith('00')) s = s.slice(2);
    if (/^05\d{8}$/.test(s)) s = '971' + s.slice(1);
    else if (/^5\d{8}$/.test(s)) s = '971' + s;
    return s;
  };
  SC.waLink = (phone, text) => `https://wa.me/${String(phone).replace(/\D/g, '')}${text ? '?text=' + encodeURIComponent(text) : ''}`;
  SC.navLink = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  SC.wazeLink = (lat, lng) => `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  SC.copy = async (text) => { try { await navigator.clipboard.writeText(text); SC.toast(SC.t('copied'), 'ok'); } catch { /* ignore */ } };

  // ---------------- images ----------------
  SC.compressImage = (file, maxSide = 1400, quality = 0.8) => new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error(SC.t('e_invalid_photo')));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(SC.t('e_invalid_photo')));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(SC.t('e_invalid_photo')));
      img.onload = () => {
        let { width: w, height: h } = img;
        const r = Math.min(1, maxSide / Math.max(w, h));
        w = Math.round(w * r); h = Math.round(h * r);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // ---------------- geolocation ----------------
  SC.getLocation = (opts = {}) => new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error(SC.t('e_geo_unavailable')));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (err) => reject(new Error(err.code === 1 ? SC.t('e_geo_denied') : SC.t('e_geo_unavailable'))),
      { enableHighAccuracy: true, timeout: opts.timeout || 15000, maximumAge: opts.maximumAge || 10000 }
    );
  });

  // ---------------- map helpers (Leaflet) ----------------
  SC.pinIcon = (label, cls) => window.L.divIcon({ className: '', html: `<div class="pin ${cls}"><span>${label}</span></div>`, iconSize: [30, 30], iconAnchor: [15, 30] });
  SC.carIcon = (off) => window.L.divIcon({ className: '', html: `<div class="car-pin ${off ? 'off' : ''}">🚚</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
  SC.makeMap = (el, center = [25.2048, 55.2708], zoom = 11) => {
    const map = window.L.map(el, { zoomControl: true, attributionControl: true }).setView(center, zoom);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    return map;
  };

  // ---------------- chat widget ----------------
  // opts: { el, me: 'customer'|'admin'|'driver', load: async()=>msgs, send: async(body)=>msg }
  SC.chat = (opts) => {
    const el = opts.el;
    el.classList.add('chat');
    el.innerHTML = `<div class="msgs"></div><form><input maxlength="1000" data-i18n-ph="type_message" placeholder="${SC.t('type_message')}"><button class="btn btn-primary btn-sm" type="submit">${SC.t('send')}</button></form>`;
    const box = el.querySelector('.msgs');
    const seen = new Set();
    const add = (m) => {
      if (!m || seen.has(m.id)) return;
      seen.add(m.id);
      const empty = box.querySelector('.empty'); if (empty) empty.remove();
      const mine = m.sender_type === opts.me;
      const who = mine ? SC.t('you') : `${SC.t(m.sender_type)}${m.sender_name ? ' · ' + m.sender_name : ''}`;
      box.appendChild(SC.h(`<div class="msg ${m.sender_type} ${mine ? 'me' : ''}"><span class="who">${SC.esc(who)} · ${SC.time(m.created_at)}</span>${SC.esc(m.body)}</div>`));
      box.scrollTop = box.scrollHeight;
    };
    const render = (list) => { box.innerHTML = ''; seen.clear(); if (!list.length) box.innerHTML = `<div class="empty small">${SC.t('no_messages')}</div>`; list.forEach(add); };
    el.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = el.querySelector('input'); const body = input.value.trim(); if (!body) return;
      const btn = el.querySelector('button'); btn.disabled = true;
      try { add(await opts.send(body)); input.value = ''; } catch (err) { SC.fail(err); } finally { btn.disabled = false; input.focus(); }
    });
    const api = { add, render, reload: async () => render(await opts.load()) };
    if (opts.initial) render(opts.initial); else if (opts.load) api.reload().catch(SC.fail);
    return api;
  };

  // ---------------- notifications sound ----------------
  SC.beep = () => {
    try {
      const ctx = SC._ac || (SC._ac = new (window.AudioContext || window.webkitAudioContext)());
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.start(); o.stop(ctx.currentTime + 0.42);
    } catch { /* ignore */ }
  };
  SC.desktopNotify = (title, body) => {
    try { if ('Notification' in window && Notification.permission === 'granted' && document.hidden) new Notification(title, { body, icon: '/img/logo.png' }); } catch { /* ignore */ }
  };

  // ---------------- public chrome ----------------
  const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 6 6 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4M12 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8m8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4A11.8 11.8 0 0 0 20.4 3.6"/></svg>';
  SC.WA_SVG = WA_SVG;
  SC.contact = { whatsapp: '971553377985', whatsapp_display: '055 337 7985' };

  SC.renderChrome = (active) => {
    const header = SC.$('#site-header');
    if (header) {
      header.className = 'site-header';
      header.innerHTML = `<div class="container inner">
        <a href="/" class="brand"><img src="/img/logo.png" alt="SEVENCARGO"><span class="name">SEVEN<b>CARGO</b></span></a>
        <nav class="nav">
          <a href="/order" class="hide-sm ${active === 'order' ? 'active' : ''}" data-i18n="ship_now"></a>
          <a href="/track" class="hide-sm ${active === 'track' ? 'active' : ''}" data-i18n="track"></a>
          <a href="/complaints" class="hide-sm ${active === 'complaints' ? 'active' : ''}" data-i18n="complaints"></a>
        </nav>
        <span class="spacer"></span>
        <button class="btn btn-ghost btn-sm" data-lang-toggle>English</button>
        <div class="dropdown" id="login-dd">
          <button class="btn btn-primary btn-sm" type="button" aria-haspopup="true"><span data-i18n="login"></span> ▾</button>
          <div class="dropdown-menu">
            <a href="/track"><span>📦</span><span><span data-i18n="login_customer"></span><small data-i18n="login_customer_sub"></small></span></a>
            <a href="/driver"><span>🚚</span><span><span data-i18n="login_driver"></span><small data-i18n="login_driver_sub"></small></span></a>
            <a href="/admin"><span>🛡️</span><span><span data-i18n="login_admin"></span><small data-i18n="login_admin_sub"></small></span></a>
          </div>
        </div>
      </div>`;
      const dd = SC.$('#login-dd');
      dd.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); dd.classList.toggle('open'); });
      document.addEventListener('click', () => dd.classList.remove('open'));
    }
    const footer = SC.$('#site-footer');
    if (footer) {
      footer.className = 'site-footer';
      footer.innerHTML = `<div class="container inner">
        <div class="brand"><img src="/img/logo.png" alt="" style="width:30px;height:28px"><span>© ${new Date().getFullYear()} SEVENCARGO — <span data-i18n="rights"></span></span></div>
        <nav><a href="/order" data-i18n="ship_now"></a><a href="/track" data-i18n="track"></a><a href="/complaints" data-i18n="complaints"></a><a href="/privacy" data-i18n="privacy"></a><a href="/terms" data-i18n="terms"></a><a href="/cookies" data-i18n="cookies"></a></nav>
        <a class="ltr" href="${SC.waLink(SC.contact.whatsapp)}" target="_blank" rel="noopener">WhatsApp: ${SC.contact.whatsapp_display}</a>
      </div>`;
    }
    if (!SC.$('.wa-float')) {
      const a = document.createElement('a');
      a.className = 'wa-float'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'WhatsApp');
      a.href = SC.waLink(SC.contact.whatsapp); a.innerHTML = WA_SVG;
      document.body.appendChild(a);
    }
  };

  SC.reveal = () => {
    const els = SC.$$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  };

  SC.loadConfig = async () => {
    if (SC.config) return SC.config;
    SC.config = await SC.api('/api/config');
    if (SC.config.contact) SC.contact = SC.config.contact;
    return SC.config;
  };
})();
