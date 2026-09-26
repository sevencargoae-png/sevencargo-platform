(function () {
  'use strict';
  const { $, $$, esc, t } = SC;
  SC.addDict({
    ar: {
      o_title: 'اشحن الآن',
      o_sub: 'على اليمين بياناتك أنت (المرسل)، وعلى اليسار بيانات المستلم. كل الحقول اختيارية ما عدا رقم هاتفك.',
      o_sender_h: 'المرسل — الاستلام منك', o_sender_sub: 'بياناتك أنت: من أين نستلم الشحنة؟',
      o_receiver_h: 'المرسل إليه — التسليم له', o_receiver_sub: 'بيانات الشخص الذي سيستلم الشحنة: إلى أين نوصلها؟',
      o_sender_note: 'يكفي اختيار الإمارة والمنطقة. سنؤكد عنوان الاستلام معك على واتساب.',
      o_receiver_note: 'لا تحتاج لتحديد لوكيشن المستلم الآن — سيتواصل معك المندوب أو خدمة العملاء لاستلامه.',
      o_area: 'المنطقة', o_area_ph: 'مثال: النهدة، البرشاء، الخالدية…',
      o_addr_approx: 'وصف العنوان التقريبي', o_addr_approx_ph: 'مثال: بجانب مسجد…، بناية…، شقة…',
      o_exact_toggle: 'إضافة موقعي الدقيق على الخريطة (اختياري)', o_use_location: 'استخدم موقعي الحالي', o_clear_loc: 'إلغاء الموقع',
      o_locating: 'جارِ تحديد موقعك…', o_located: 'تم تحديد موقعك بدقة ±{m} م',
      o_map_hint: 'اسحب الدبوس أو اضغط على الخريطة لضبط موقع الاستلام.',
      o_emirate: 'الإمارة', o_sender_name: 'اسمك', o_sender_phone: 'رقم هاتفك (واتساب)', o_receiver_name: 'اسم المستلم', o_receiver_phone: 'هاتف المستلم',
      o_parcel: 'تفاصيل الشحنة', o_photo: 'صورة الشحنة', o_photo_hint: '📷 اضغط لالتقاط أو رفع صورة الشحنة',
      o_weight: 'الوزن', o_length: 'الطول', o_width: 'العرض', o_height: 'الارتفاع',
      o_limits: 'الحد الأقصى: {w} كجم، وأي بُعد {d} سم.', o_content: 'نوع المحتوى', o_value: 'القيمة التقريبية', o_desc: 'وصف الشحنة', o_desc_ph: 'مثال: كرتونة ملابس، قابلة للكسر…',
      pro_title2: 'قائمة المواد الممنوعة',
      o_price_pay: 'السعر والدفع', pm_online_d: 'بطاقة ائتمان/خصم عبر بوابة آمنة', pm_cash_sender_d: 'تدفع للمندوب عند استلام الشحنة منك',
      pm_cash_receiver_d: 'يدفع المستلم للمندوب عند التسليم', pm_online_off: 'غير متاح حاليًا',
      o_accept_terms: 'أوافق على <a href="/terms" target="_blank">الشروط</a> و<a href="/privacy" target="_blank">الخصوصية</a>، وأقر بأن الشحنة لا تحتوي على مواد ممنوعة.',
      o_submit: 'تأكيد طلب الشحن', o_submitting: 'جارِ إنشاء الطلب…',
      p_base: 'رسوم أساسية ({e})', p_distance: 'المسافة {km} كم', p_weight: 'الوزن المحتسب {kg} كجم', p_inter: 'رسوم بين الإمارات', p_cod: 'رسوم الدفع عند الاستلام',
      p_vat: 'ضريبة القيمة المضافة {p}%', p_total: 'الإجمالي',
      p_est_note: 'سعر تقديري، يتأكد بعد تحديد العنوان والوزن الفعلي.',
      p_pending: 'اختر إمارة المرسل وإمارة المستلم لعرض السعر التقديري، أو أكمل الطلب وسنؤكد لك السعر على واتساب.',
      v_phone: 'أدخل رقم هاتفك الصحيح للتواصل معك', v_terms: 'يجب الموافقة على الشروط والإقرار بخلو الشحنة من المواد الممنوعة',
      s_title: 'تم تسجيل طلب الشحن بنجاح ✅', s_no: 'رقم الشحنة',
      s_contact: 'سيتواصل معك المندوب قريبًا لاستلام لوكيشن التوصيل الخاص بالمستلم.',
      s_contact_pickup: 'وسيتم تأكيد عنوان الاستلام منك على واتساب.',
      s_price_tbd: 'سيتم تأكيد السعر معك قبل الاستلام.',
      s_wa_btn: 'أرسل اللوكيشن الآن على واتساب',
      s_wa_ops: 'مرحبًا SEVENCARGO، طلب شحن رقم {no}.\nهذا لوكيشن {what}:',
      s_what_both: 'الاستلام والتسليم', s_what_drop: 'التسليم (المستلم)',
      s_code: 'كود التسليم', s_code_d: 'أعطِ هذا الكود للمستلم فقط. المندوب لن يسلّم الشحنة إلا بعد إدخاله.',
      s_share: 'أرسل الكود للمستلم على واتساب', s_track: 'تتبع الشحنة', s_new: 'شحنة جديدة', s_redirect: 'جارِ تحويلك لصفحة الدفع الآمن…',
      s_wa_msg: 'مرحبًا {name}، لديك شحنة من {sender} عبر SEVENCARGO.\nرقم الشحنة: {no}\nكود التسليم: {code}\n(أعطِ الكود للمندوب عند الاستلام فقط)\nتتبع الشحنة: {url}',
      s_someone: 'مرسل',
    },
    en: {
      o_title: 'Ship now',
      o_sub: 'Your details (sender) on one side, the receiver on the other. Everything is optional except your phone number.',
      o_sender_h: 'Sender — pickup from you', o_sender_sub: 'Your details: where do we pick up the parcel?',
      o_receiver_h: 'Receiver — delivery to', o_receiver_sub: 'The person receiving the parcel: where do we deliver?',
      o_sender_note: 'Choosing the emirate and area is enough. We will confirm the pickup address with you on WhatsApp.',
      o_receiver_note: 'No need to pin the receiver location now — the courier or customer service will contact you for it.',
      o_area: 'Area', o_area_ph: 'e.g. Al Nahda, Al Barsha, Al Khalidiya…',
      o_addr_approx: 'Approximate address', o_addr_approx_ph: 'e.g. next to … mosque, building …, flat …',
      o_exact_toggle: 'Add my exact location on the map (optional)', o_use_location: 'Use my current location', o_clear_loc: 'Remove location',
      o_locating: 'Locating you…', o_located: 'Location found (±{m} m)',
      o_map_hint: 'Drag the pin or tap the map to adjust the pickup point.',
      o_emirate: 'Emirate', o_sender_name: 'Your name', o_sender_phone: 'Your phone (WhatsApp)', o_receiver_name: 'Receiver name', o_receiver_phone: 'Receiver phone',
      o_parcel: 'Parcel details', o_photo: 'Parcel photo', o_photo_hint: '📷 Tap to take or upload a photo of the parcel',
      o_weight: 'Weight', o_length: 'Length', o_width: 'Width', o_height: 'Height',
      o_limits: 'Maximum: {w} kg, and {d} cm on any side.', o_content: 'Content type', o_value: 'Approx. value', o_desc: 'Description', o_desc_ph: 'e.g. box of clothes, fragile…',
      pro_title2: 'Prohibited items list',
      o_price_pay: 'Price & payment', pm_online_d: 'Credit/debit card via a secure gateway', pm_cash_sender_d: 'You pay the courier at pickup',
      pm_cash_receiver_d: 'The receiver pays the courier on delivery', pm_online_off: 'Not available right now',
      o_accept_terms: 'I agree to the <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a>, and confirm the parcel has no prohibited items.',
      o_submit: 'Confirm shipment', o_submitting: 'Creating your order…',
      p_base: 'Base fee ({e})', p_distance: 'Distance {km} km', p_weight: 'Chargeable weight {kg} kg', p_inter: 'Inter-emirate fee', p_cod: 'Cash on delivery fee',
      p_vat: 'VAT {p}%', p_total: 'Total',
      p_est_note: 'Estimated price, confirmed once the address and actual weight are known.',
      p_pending: 'Choose the sender and receiver emirates to see an estimate, or submit and we will confirm the price on WhatsApp.',
      v_phone: 'Enter a valid phone number so we can reach you', v_terms: 'Please accept the terms and confirm there are no prohibited items',
      s_title: 'Your shipment is registered ✅', s_no: 'Tracking number',
      s_contact: 'The courier will contact you shortly to get the receiver\'s delivery location.',
      s_contact_pickup: 'We will also confirm the pickup address with you on WhatsApp.',
      s_price_tbd: 'The price will be confirmed with you before pickup.',
      s_wa_btn: 'Send the location now on WhatsApp',
      s_wa_ops: 'Hello SEVENCARGO, shipment {no}.\nHere is the {what} location:',
      s_what_both: 'pickup and delivery', s_what_drop: 'delivery (receiver)',
      s_code: 'Delivery code', s_code_d: 'Share this code with the receiver only. The courier will not hand over the parcel without it.',
      s_share: 'Send the code to the receiver on WhatsApp', s_track: 'Track shipment', s_new: 'New shipment', s_redirect: 'Redirecting you to secure payment…',
      s_wa_msg: 'Hi {name}, you have a parcel from {sender} via SEVENCARGO.\nTracking number: {no}\nDelivery code: {code}\n(Give the code to the courier only at delivery)\nTrack: {url}',
      s_someone: 'a sender',
    },
  });

  let cfg = null;
  const state = { pickup: null, photo: null, quote: null };
  let mapP = null, markerP = null, quoteTimer = null, quoteSeq = 0;

  const val = (id) => $(id).value.trim();
  const phoneOk = (v) => /^(\+?971|00971|0)?5\d{8}$/.test(v.replace(/[\s-]/g, '')) || /^(\+|00)?9\d{9,13}$/.test(v.replace(/[\s-]/g, ''));

  function emirateOptions(sel) {
    const cur = sel.value;
    sel.innerHTML = `<option value="">—</option>` + Object.keys(SC.EMIRATES).map((c) => {
      const off = cfg && cfg.emirates[c] && !cfg.emirates[c].active;
      return `<option value="${c}" ${off ? 'disabled' : ''}>${esc(SC.em(c))}</option>`;
    }).join('');
    sel.value = cur;
  }
  function renderDynamic() {
    emirateOptions($('#pickup-emirate')); emirateOptions($('#drop-emirate'));
    if (cfg) {
      $('#prohibited-list').innerHTML = cfg.prohibited.map((p) => `<li>${esc(p[SC.lang] || p.en)}</li>`).join('');
      $('#limits-hint').textContent = t('o_limits', { w: cfg.limits.max_weight_kg, d: cfg.limits.max_dim_cm });
      const on = cfg.online_payment;
      const o = $('#opt-online'); o.classList.toggle('disabled', !on); o.querySelector('input').disabled = !on;
      if (!on) o.querySelector('small').textContent = t('pm_online_off');
    }
    renderPrice();
  }

  // ---------- optional exact pickup location ----------
  async function reverseEmirate(lat, lng) {
    try {
      const r = await SC.api(`/api/geo/reverse?lat=${lat}&lng=${lng}`);
      if (r.emirate) { $('#pickup-emirate').value = r.emirate; scheduleQuote(); }
    } catch { /* ignore */ }
  }
  function ensureMap() {
    if (mapP) { setTimeout(() => mapP.invalidateSize(), 60); return; }
    mapP = SC.makeMap('map-pickup', [25.2048, 55.2708], 11);
    mapP.on('click', (e) => setPickup(e.latlng.lat, e.latlng.lng, false));
    setTimeout(() => mapP.invalidateSize(), 60);
  }
  function setPickup(lat, lng, pan = true) {
    state.pickup = { lat, lng };
    if (!markerP) {
      markerP = L.marker([lat, lng], { draggable: true, icon: SC.pinIcon('1', 'a') }).addTo(mapP);
      markerP.on('dragend', () => { const p = markerP.getLatLng(); setPickup(p.lat, p.lng, false); });
    } else markerP.setLatLng([lat, lng]);
    if (pan) mapP.setView([lat, lng], 16);
    $('#btn-clear-loc').classList.remove('hidden');
    reverseEmirate(lat, lng);
    scheduleQuote();
  }
  function clearPickup() {
    state.pickup = null;
    if (markerP) { markerP.remove(); markerP = null; }
    $('#btn-clear-loc').classList.add('hidden');
    $('#locate-status').textContent = '';
    scheduleQuote();
  }
  async function locate() {
    ensureMap();
    const st = $('#locate-status');
    st.textContent = t('o_locating');
    try {
      const p = await SC.getLocation();
      setPickup(p.lat, p.lng);
      st.textContent = t('o_located', { m: Math.round(p.accuracy) });
    } catch (e) { st.textContent = e.message; }
  }

  // ---------- price ----------
  function payload() {
    return {
      pickup: state.pickup ? { ...state.pickup, emirate: val('#pickup-emirate') } : { emirate: val('#pickup-emirate') },
      dropoff: { emirate: val('#drop-emirate') },
      weight_kg: val('#weight'), length_cm: val('#length'), width_cm: val('#width'), height_cm: val('#height'),
      payment_method: ($('input[name=pay]:checked') || {}).value || 'cash_sender',
    };
  }
  function scheduleQuote() { clearTimeout(quoteTimer); quoteTimer = setTimeout(getQuote, 350); }
  async function getQuote() {
    const seq = ++quoteSeq;
    if (!val('#pickup-emirate') || !val('#drop-emirate')) { state.quote = null; renderPrice(); return; }
    $('#price-box').innerHTML = `<div class="muted">${t('loading')}</div>`;
    try {
      const r = await SC.api('/api/quote', { body: payload() });
      if (seq !== quoteSeq) return;
      state.quote = r;
      if (r.pickup_emirate && r.pickup_emirate !== val('#pickup-emirate')) $('#pickup-emirate').value = r.pickup_emirate;
    } catch (e) {
      if (seq !== quoteSeq) return;
      state.quote = { error: e.message };
    }
    renderPrice();
  }
  function renderPrice() {
    const box = $('#price-box');
    const qt = state.quote;
    const online = $('#opt-online input');
    if (!qt || !qt.price || qt.price.pending) {
      box.innerHTML = qt && qt.error ? `<div class="err">${esc(qt.error)}</div>` : `<div class="price-row total"><span>${t('p_total')}</span><span>${t('price_tbd')}</span></div><div class="hint">${t('p_pending')}</div>`;
      if (online && online.checked) { online.checked = false; $('input[name=pay][value=cash_sender]').checked = true; }
      if (online) online.disabled = true;
      return;
    }
    if (online && cfg) online.disabled = !cfg.online_payment;
    const p = qt.price;
    const row = (l, v) => `<div class="price-row"><span>${esc(l)}</span><span>${SC.money(v)}</span></div>`;
    let h = row(t('p_base', { e: SC.em(qt.pickup_emirate) }), p.base);
    if (p.distance_fee) h += row(t('p_distance', { km: p.distance_km }), p.distance_fee);
    if (p.weight_fee) h += row(t('p_weight', { kg: p.chargeable_kg }), p.weight_fee);
    if (p.inter_emirate_fee) h += row(t('p_inter'), p.inter_emirate_fee);
    if (p.cod_fee) h += row(t('p_cod'), p.cod_fee);
    if (p.vat) h += row(t('p_vat', { p: p.vat_percent }), p.vat);
    h += `<div class="price-row total"><span>${t('p_total')}${p.estimated ? ` <small class="muted">(${t('price_est')})</small>` : ''}</span><span>${SC.money(p.total)}</span></div>`;
    if (p.estimated) h += `<div class="hint">${t('p_est_note')}</div>`;
    box.innerHTML = h;
  }

  // ---------- submit ----------
  async function submit(e) {
    e.preventDefault();
    const err = $('#form-err'); err.textContent = '';
    if (!phoneOk(val('#sender-phone'))) { err.textContent = t('v_phone'); $('#sender-phone').focus(); return; }
    if (val('#receiver-phone') && !phoneOk(val('#receiver-phone'))) { err.textContent = t('e_invalid_receiver_phone'); $('#receiver-phone').focus(); return; }
    if (!$('#accept-terms').checked) { err.textContent = t('v_terms'); return; }
    const btn = $('#btn-submit'); btn.disabled = true; btn.textContent = t('o_submitting');
    try {
      const body = {
        ...payload(),
        sender_name: val('#sender-name'), sender_phone: val('#sender-phone'), pickup_area: val('#pickup-area'), pickup_address: val('#pickup-address'),
        receiver_name: val('#receiver-name'), receiver_phone: val('#receiver-phone'), dropoff_area: val('#drop-area'), dropoff_address: val('#drop-address'),
        content_type: val('#content-type'), description: val('#description'), declared_value: val('#declared-value'),
        photo: state.photo, accept_terms: true, website: $('input[name=website]').value,
      };
      const r = await SC.api('/api/orders', { body });
      showSuccess(r, body);
    } catch (ex) {
      err.textContent = ex.message;
    } finally { btn.disabled = false; btn.textContent = t('o_submit'); }
  }

  function showSuccess(r, body) {
    $('#order-form').classList.add('hidden');
    $('.order-page > .reveal').classList.add('hidden');
    const box = $('#success'); box.classList.remove('hidden');
    if (r.checkout_url) {
      box.innerHTML = `<h2>${t('s_title')}</h2><p>${t('s_no')}</p><div class="big">${esc(r.tracking_no)}</div><p class="muted" style="margin-top:16px">${t('s_redirect')}</p>`;
      setTimeout(() => { location.href = r.checkout_url; }, 1200);
      return;
    }
    const url = `${location.origin}/track?no=${r.tracking_no}`;
    const noPickupPin = !body.pickup.lat;
    const opsMsg = t('s_wa_ops', { no: r.tracking_no, what: t(noPickupPin ? 's_what_both' : 's_what_drop') });
    const rcvMsg = t('s_wa_msg', { name: body.receiver_name || '', sender: body.sender_name || t('s_someone'), no: r.tracking_no, code: r.delivery_code, url });
    box.innerHTML = `
      <h2>${t('s_title')}</h2>
      <p class="muted">${t('s_no')}</p>
      <div class="big">${esc(r.tracking_no)}</div>
      <div class="info-box">
        <b>📞 ${t('s_contact')}</b>
        ${noPickupPin ? `<div style="margin-top:4px">${t('s_contact_pickup')}</div>` : ''}
        ${r.price_pending ? `<div style="margin-top:4px">${t('s_price_tbd')}</div>` : ''}
        <a class="btn btn-wa" style="margin-top:12px;width:100%" target="_blank" rel="noopener" href="${SC.waLink(SC.contact.whatsapp, opsMsg)}">${t('s_wa_btn')}</a>
      </div>
      <p class="muted" style="margin-top:22px">${t('s_code')}</p>
      <div class="code-box">${esc(r.delivery_code)}</div>
      <p class="small muted" style="max-width:460px;margin:10px auto">${t('s_code_d')}</p>
      <div class="row" style="justify-content:center;margin-top:16px">
        ${body.receiver_phone ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="${SC.waLink(SC.normPhone(body.receiver_phone), rcvMsg)}">${t('s_share')}</a>` : ''}
        <a class="btn btn-primary" href="/track?no=${esc(r.tracking_no)}">${t('s_track')}</a>
        <a class="btn btn-ghost" href="/order">${t('s_new')}</a>
      </div>`;
    window.scrollTo({ top: 0 });
  }

  // ---------- init ----------
  SC.renderChrome('order');
  SC.onLang(renderDynamic);
  SC.initLang();
  SC.reveal();

  $('#pickup-exact').addEventListener('toggle', (e) => { if (e.target.open) { ensureMap(); if (!state.pickup) locate(); } });
  $('#btn-locate').addEventListener('click', locate);
  $('#btn-clear-loc').addEventListener('click', clearPickup);
  $('#photo-input').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      state.photo = await SC.compressImage(f);
      const img = $('#photo-preview'); img.src = state.photo; img.classList.remove('hidden');
    } catch (ex) { SC.fail(ex); }
  });
  ['#pickup-emirate', '#drop-emirate'].forEach((id) => $(id).addEventListener('change', scheduleQuote));
  ['#weight', '#length', '#width', '#height'].forEach((id) => $(id).addEventListener('input', scheduleQuote));
  $$('input[name=pay]').forEach((r) => r.addEventListener('change', scheduleQuote));
  $('#order-form').addEventListener('submit', submit);

  SC.loadConfig().then((c) => { cfg = c; SC.renderChrome('order'); SC.setLang(SC.lang); }).catch(SC.fail);
})();
