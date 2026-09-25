(function () {
  'use strict';
  const { $, $$, esc, t } = SC;
  SC.addDict({
    ar: {
      o_title: 'اشحن الآن', o_sub: 'أربع خطوات سريعة وتكون شحنتك جاهزة للاستلام.',
      o_pickup: 'موقع الاستلام وبيانات المرسل', o_dropoff: 'موقع التسليم وبيانات المستلم', o_parcel: 'تفاصيل الشحنة', o_price_pay: 'السعر والدفع',
      o_use_location: 'استخدم موقعي الحالي', o_locating: 'جارِ تحديد موقعك…', o_located: 'تم تحديد موقعك بدقة ±{m} م',
      o_map_hint: 'اسحب الدبوس أو اضغط على الخريطة لضبط موقع الاستلام بدقة.', o_map_hint2: 'ابحث عن العنوان أو اضغط على الخريطة لتحديد موقع التسليم.',
      o_emirate: 'الإمارة', o_address: 'العنوان التفصيلي', o_address_ph: 'المنطقة، الشارع، المبنى، رقم الشقة/الفيلا',
      o_sender_name: 'اسم المرسل', o_sender_phone: 'هاتف المرسل', o_receiver_name: 'اسم المستلم', o_receiver_phone: 'هاتف المستلم',
      o_search_ph: 'ابحث عن منطقة أو معلم…', o_no_results: 'لا توجد نتائج',
      o_photo: 'صورة الشحنة', o_photo_hint: '📷 اضغط لالتقاط أو رفع صورة الشحنة', o_weight: 'الوزن', o_length: 'الطول', o_width: 'العرض', o_height: 'الارتفاع',
      o_limits: 'الحد الأقصى: {w} كجم، وأي بُعد {d} سم.', o_content: 'نوع المحتوى', o_value: 'القيمة التقريبية', o_desc: 'وصف الشحنة', o_desc_ph: 'مثال: كرتونة ملابس، قابلة للكسر…',
      ct_documents: 'مستندات', ct_electronics: 'إلكترونيات', ct_clothing: 'ملابس وأحذية', ct_cosmetics: 'مستحضرات تجميل', ct_household: 'أدوات منزلية',
      ct_spare_parts: 'قطع غيار', ct_gifts: 'هدايا', ct_other: 'أخرى',
      pro_title2: 'المواد الممنوعة', o_ack_prohibited: 'أقر بأن الشحنة لا تحتوي على أي من المواد الممنوعة، وأتحمل المسؤولية القانونية عن محتواها.',
      o_payment: 'طريقة الدفع', pm_online_d: 'بطاقة ائتمان/خصم عبر بوابة آمنة', pm_cash_sender_d: 'تدفع للمندوب عند استلام الشحنة منك',
      pm_cash_receiver_d: 'يدفع المستلم للمندوب عند التسليم', pm_online_off: 'غير متاح حاليًا',
      o_accept_terms: 'أوافق على <a href="/terms" target="_blank">شروط الخدمة</a> و<a href="/privacy" target="_blank">سياسة الخصوصية</a>.',
      o_submit: 'تأكيد الطلب', o_submitting: 'جارِ إنشاء الطلب…',
      p_base: 'رسوم أساسية ({e})', p_distance: 'المسافة {km} كم', p_weight: 'الوزن المحتسب {kg} كجم', p_inter: 'رسوم بين الإمارات', p_cod: 'رسوم الدفع عند الاستلام',
      p_vat: 'ضريبة القيمة المضافة {p}%', p_total: 'الإجمالي', p_est: 'المسافة تقديرية',
      v_pickup_point: 'حدد موقع الاستلام على الخريطة', v_drop_point: 'حدد موقع التسليم على الخريطة', v_required: 'أكمل الحقول المطلوبة',
      v_photo: 'أضف صورة للشحنة', v_ack: 'يجب الإقرار بقائمة المواد الممنوعة', v_terms: 'يجب الموافقة على الشروط', v_weight_max: 'الوزن يتجاوز الحد الأقصى', v_dim_max: 'أحد الأبعاد يتجاوز الحد الأقصى',
      v_same: 'موقع التسليم مطابق لموقع الاستلام',
      s_title: 'تم إنشاء طلبك بنجاح 🎉', s_no: 'رقم الشحنة', s_code: 'كود التسليم', s_code_d: 'أرسل هذا الكود للمستلم فقط. المندوب لن يسلّم الشحنة إلا بعد إدخاله.',
      s_share: 'أرسل الكود للمستلم عبر واتساب', s_track: 'تتبع الشحنة', s_new: 'شحنة جديدة', s_redirect: 'جارِ تحويلك لصفحة الدفع الآمن…',
      s_wa_msg: 'مرحبًا {name}، لديك شحنة من {sender} عبر SEVENCARGO.\nرقم الشحنة: {no}\nكود التسليم: {code}\n(أعطِ الكود للمندوب عند الاستلام فقط)\nتتبع الشحنة: {url}',
    },
    en: {
      o_title: 'Ship now', o_sub: 'Four quick steps and your parcel is ready for pickup.',
      o_pickup: 'Pickup location & sender', o_dropoff: 'Delivery location & receiver', o_parcel: 'Parcel details', o_price_pay: 'Price & payment',
      o_use_location: 'Use my current location', o_locating: 'Locating you…', o_located: 'Location found (±{m} m)',
      o_map_hint: 'Drag the pin or tap the map to fine-tune the pickup point.', o_map_hint2: 'Search an address or tap the map to set the delivery point.',
      o_emirate: 'Emirate', o_address: 'Detailed address', o_address_ph: 'Area, street, building, flat/villa number',
      o_sender_name: 'Sender name', o_sender_phone: 'Sender phone', o_receiver_name: 'Receiver name', o_receiver_phone: 'Receiver phone',
      o_search_ph: 'Search an area or landmark…', o_no_results: 'No results',
      o_photo: 'Parcel photo', o_photo_hint: '📷 Tap to take or upload a photo of the parcel', o_weight: 'Weight', o_length: 'Length', o_width: 'Width', o_height: 'Height',
      o_limits: 'Maximum: {w} kg, and {d} cm on any side.', o_content: 'Content type', o_value: 'Approx. value', o_desc: 'Description', o_desc_ph: 'e.g. box of clothes, fragile…',
      ct_documents: 'Documents', ct_electronics: 'Electronics', ct_clothing: 'Clothing & shoes', ct_cosmetics: 'Cosmetics', ct_household: 'Household items',
      ct_spare_parts: 'Spare parts', ct_gifts: 'Gifts', ct_other: 'Other',
      pro_title2: 'Prohibited items', o_ack_prohibited: 'I confirm the parcel contains none of the prohibited items and I am legally responsible for its content.',
      o_payment: 'Payment method', pm_online_d: 'Credit/debit card via a secure gateway', pm_cash_sender_d: 'You pay the courier at pickup',
      pm_cash_receiver_d: 'The receiver pays the courier on delivery', pm_online_off: 'Not available right now',
      o_accept_terms: 'I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.',
      o_submit: 'Confirm order', o_submitting: 'Creating your order…',
      p_base: 'Base fee ({e})', p_distance: 'Distance {km} km', p_weight: 'Chargeable weight {kg} kg', p_inter: 'Inter-emirate fee', p_cod: 'Cash on delivery fee',
      p_vat: 'VAT {p}%', p_total: 'Total', p_est: 'Estimated distance',
      v_pickup_point: 'Set the pickup point on the map', v_drop_point: 'Set the delivery point on the map', v_required: 'Please complete the required fields',
      v_photo: 'Add a photo of the parcel', v_ack: 'Please confirm the prohibited items list', v_terms: 'Please accept the terms', v_weight_max: 'Weight exceeds the maximum', v_dim_max: 'A dimension exceeds the maximum',
      v_same: 'Delivery point is the same as pickup',
      s_title: 'Your order is confirmed 🎉', s_no: 'Tracking number', s_code: 'Delivery code', s_code_d: 'Share this code with the receiver only. The courier will not hand over the parcel without it.',
      s_share: 'Send the code to the receiver on WhatsApp', s_track: 'Track shipment', s_new: 'New shipment', s_redirect: 'Redirecting you to secure payment…',
      s_wa_msg: 'Hi {name}, you have a parcel from {sender} via SEVENCARGO.\nTracking number: {no}\nDelivery code: {code}\n(Give the code to the courier only at delivery)\nTrack: {url}',
    },
  });

  let cfg = null;
  let step = 1;
  const state = { pickup: null, drop: null, photo: null, quote: null };
  let mapP, mapD, markerP, markerD;

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
    if (step === 4 && state.quote) renderPrice();
  }

  // ---------- maps ----------
  async function reverseEmirate(lat, lng, sel) {
    try {
      const r = await SC.api(`/api/geo/reverse?lat=${lat}&lng=${lng}`);
      if (r.emirate) sel.value = r.emirate;
    } catch { /* ignore */ }
  }
  function setPickup(lat, lng, pan = true) {
    state.pickup = { lat, lng };
    if (!markerP) {
      markerP = L.marker([lat, lng], { draggable: true, icon: SC.pinIcon('A', 'a') }).addTo(mapP);
      markerP.on('dragend', () => { const p = markerP.getLatLng(); setPickup(p.lat, p.lng, false); });
    } else markerP.setLatLng([lat, lng]);
    if (pan) mapP.setView([lat, lng], 16);
    reverseEmirate(lat, lng, $('#pickup-emirate'));
  }
  function setDrop(lat, lng, pan = true) {
    state.drop = { lat, lng };
    if (!markerD) {
      markerD = L.marker([lat, lng], { draggable: true, icon: SC.pinIcon('B', 'b') }).addTo(mapD);
      markerD.on('dragend', () => { const p = markerD.getLatLng(); setDrop(p.lat, p.lng, false); });
    } else markerD.setLatLng([lat, lng]);
    if (pan) mapD.setView([lat, lng], 16);
    reverseEmirate(lat, lng, $('#drop-emirate'));
  }
  async function locate() {
    const st = $('#locate-status');
    st.textContent = t('o_locating');
    try {
      const p = await SC.getLocation();
      setPickup(p.lat, p.lng);
      st.textContent = t('o_located', { m: Math.round(p.accuracy) });
    } catch (e) { st.textContent = e.message; }
  }
  async function searchDrop() {
    const qv = $('#drop-search').value.trim();
    const box = $('#drop-results');
    if (qv.length < 2) return;
    box.classList.remove('hidden'); box.innerHTML = `<div class="small muted" style="padding:8px">${t('loading')}</div>`;
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ae&limit=6&accept-language=${SC.lang}&q=${encodeURIComponent(qv)}`);
      const list = await r.json();
      if (!list.length) { box.innerHTML = `<div class="small muted" style="padding:8px">${t('o_no_results')}</div>`; return; }
      box.innerHTML = list.map((x, i) => `<a href="#" data-i="${i}" style="display:block;padding:8px 10px;border-radius:8px;color:var(--text)" class="small">${esc(x.display_name)}</a>`).join('');
      box.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => {
        e.preventDefault();
        const x = list[Number(a.dataset.i)];
        setDrop(Number(x.lat), Number(x.lon));
        if (!$('#drop-address').value) $('#drop-address').value = x.display_name.split(',').slice(0, 3).join('،');
        box.classList.add('hidden');
      }));
    } catch { box.innerHTML = `<div class="small muted" style="padding:8px">${t('e_network')}</div>`; }
  }

  // ---------- steps ----------
  function showStep(n) {
    step = n;
    $$('.step-pane').forEach((p) => p.classList.toggle('hidden', Number(p.dataset.step) !== n));
    $$('.stepper .st').forEach((s, i) => s.classList.toggle('on', i < n));
    $('#btn-back').style.visibility = n === 1 ? 'hidden' : 'visible';
    $('#btn-next').classList.toggle('hidden', n === 4);
    $('#btn-submit').classList.toggle('hidden', n !== 4);
    $('#form-err').textContent = '';
    if (n === 2) {
      if (!mapD) {
        const c = state.pickup ? [state.pickup.lat, state.pickup.lng] : [25.2048, 55.2708];
        mapD = SC.makeMap('map-drop', c, 12);
        mapD.on('click', (e) => setDrop(e.latlng.lat, e.latlng.lng, false));
      }
      setTimeout(() => mapD.invalidateSize(), 50);
    }
    if (n === 4) getQuote();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const val = (id) => $(id).value.trim();
  const phoneOk = (v) => /^(\+?971|00971|0)?5\d{8}$/.test(v.replace(/[\s-]/g, '')) || /^(\+|00)?9\d{9,13}$/.test(v.replace(/[\s-]/g, ''));

  function validate(n) {
    const err = (k) => { $('#form-err').textContent = t(k); return false; };
    if (n === 1) {
      if (!state.pickup) return err('v_pickup_point');
      if (!val('#pickup-emirate') || !val('#pickup-address') || val('#sender-name').length < 2) return err('v_required');
      if (!phoneOk(val('#sender-phone'))) return err('e_invalid_sender_phone');
    }
    if (n === 2) {
      if (!state.drop) return err('v_drop_point');
      if (!val('#drop-emirate') || !val('#drop-address') || val('#receiver-name').length < 2) return err('v_required');
      if (!phoneOk(val('#receiver-phone'))) return err('e_invalid_receiver_phone');
      if (Math.abs(state.drop.lat - state.pickup.lat) < 1e-5 && Math.abs(state.drop.lng - state.pickup.lng) < 1e-5) return err('v_same');
    }
    if (n === 3) {
      if (!state.photo) return err('v_photo');
      const w = Number(val('#weight')), l = Number(val('#length')), wd = Number(val('#width')), h = Number(val('#height'));
      if (!(w > 0 && l > 0 && wd > 0 && h > 0)) return err('v_required');
      if (cfg && w > cfg.limits.max_weight_kg) return err('v_weight_max');
      if (cfg && Math.max(l, wd, h) > cfg.limits.max_dim_cm) return err('v_dim_max');
      if (!$('#ack-prohibited').checked) return err('v_ack');
    }
    return true;
  }

  function payload() {
    return {
      pickup: { ...state.pickup, emirate: val('#pickup-emirate') },
      dropoff: { ...state.drop, emirate: val('#drop-emirate') },
      weight_kg: Number(val('#weight')), length_cm: Number(val('#length')), width_cm: Number(val('#width')), height_cm: Number(val('#height')),
      payment_method: ($('input[name=pay]:checked') || {}).value || 'cash_sender',
    };
  }

  async function getQuote() {
    $('#price-box').innerHTML = `<div class="muted">${t('loading')}</div>`;
    try {
      const r = await SC.api('/api/quote', { body: payload() });
      state.quote = r;
      if (r.pickup_emirate && r.pickup_emirate !== val('#pickup-emirate')) $('#pickup-emirate').value = r.pickup_emirate;
      if (r.dropoff_emirate && r.dropoff_emirate !== val('#drop-emirate')) $('#drop-emirate').value = r.dropoff_emirate;
      renderPrice();
    } catch (e) { state.quote = null; $('#price-box').innerHTML = `<div class="err">${esc(e.message)}</div>`; }
  }
  function renderPrice() {
    const p = state.quote.price;
    const row = (l, v) => `<div class="price-row"><span>${esc(l)}</span><span>${SC.money(v)}</span></div>`;
    let h = row(t('p_base', { e: SC.em(state.quote.pickup_emirate) }), p.base);
    h += row(t('p_distance', { km: p.distance_km }), p.distance_fee);
    h += row(t('p_weight', { kg: p.chargeable_kg }), p.weight_fee);
    if (p.inter_emirate_fee) h += row(t('p_inter'), p.inter_emirate_fee);
    if (p.cod_fee) h += row(t('p_cod'), p.cod_fee);
    if (p.vat) h += row(t('p_vat', { p: p.vat_percent }), p.vat);
    h += `<div class="price-row total"><span>${t('p_total')}</span><span>${SC.money(p.total)}</span></div>`;
    if (p.distance_source === 'estimate') h += `<div class="hint">${t('p_est')}</div>`;
    $('#price-box').innerHTML = h;
    $('#summary').innerHTML = `<div><b>A</b> ${esc(SC.em(state.quote.pickup_emirate))} — ${esc(val('#pickup-address'))}</div>
      <div><b>B</b> ${esc(SC.em(state.quote.dropoff_emirate))} — ${esc(val('#drop-address'))}</div>
      <div class="muted">${esc(val('#receiver-name'))} · <span class="ltr">${esc(val('#receiver-phone'))}</span></div>`;
  }

  async function submit(e) {
    e.preventDefault();
    if (step !== 4) return;
    if (!state.quote) return getQuote();
    if (!$('#accept-terms').checked) { $('#form-err').textContent = t('v_terms'); return; }
    const btn = $('#btn-submit'); btn.disabled = true; btn.textContent = t('o_submitting');
    try {
      const body = {
        ...payload(),
        sender_name: val('#sender-name'), sender_phone: val('#sender-phone'), pickup_address: val('#pickup-address'),
        receiver_name: val('#receiver-name'), receiver_phone: val('#receiver-phone'), dropoff_address: val('#drop-address'),
        content_type: val('#content-type'), description: val('#description'), declared_value: val('#declared-value'),
        photo: state.photo, accept_terms: true, website: $('input[name=website]').value,
      };
      const r = await SC.api('/api/orders', { body });
      showSuccess(r, body);
    } catch (err) {
      $('#form-err').textContent = err.message;
    } finally { btn.disabled = false; btn.textContent = t('o_submit'); }
  }

  function showSuccess(r, body) {
    $('#order-form').classList.add('hidden');
    const box = $('#success'); box.classList.remove('hidden');
    const url = `${location.origin}/track?no=${r.tracking_no}`;
    if (r.checkout_url) {
      box.innerHTML = `<h2>${t('s_title')}</h2><p>${t('s_no')}</p><div class="big">${esc(r.tracking_no)}</div><p class="muted" style="margin-top:16px">${t('s_redirect')}</p>`;
      setTimeout(() => { location.href = r.checkout_url; }, 1200);
      return;
    }
    const msg = t('s_wa_msg', { name: body.receiver_name, sender: body.sender_name, no: r.tracking_no, code: r.delivery_code, url });
    box.innerHTML = `
      <h2>${t('s_title')}</h2>
      <p class="muted">${t('s_no')}</p>
      <div class="big">${esc(r.tracking_no)}</div>
      <p class="muted" style="margin-top:18px">${t('s_code')}</p>
      <div class="code-box">${esc(r.delivery_code)}</div>
      <p class="small muted" style="max-width:460px;margin:10px auto">${t('s_code_d')}</p>
      <div class="row" style="justify-content:center;margin-top:16px">
        <a class="btn btn-wa" target="_blank" rel="noopener" href="${SC.waLink(SC.normPhone(body.receiver_phone), msg)}">${t('s_share')}</a>
        <a class="btn btn-primary" href="/track?no=${esc(r.tracking_no)}">${t('s_track')}</a>
        <a class="btn btn-ghost" href="/order">${t('s_new')}</a>
      </div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- init ----------
  SC.renderChrome('order');
  SC.onLang(renderDynamic);
  SC.initLang();
  SC.reveal();

  mapP = SC.makeMap('map-pickup', [25.2048, 55.2708], 11);
  mapP.on('click', (e) => setPickup(e.latlng.lat, e.latlng.lng, false));
  $('#btn-locate').addEventListener('click', locate);
  $('#btn-drop-search').addEventListener('click', searchDrop);
  $('#drop-search').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); searchDrop(); } });
  $('#photo-input').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      state.photo = await SC.compressImage(f);
      const img = $('#photo-preview'); img.src = state.photo; img.classList.remove('hidden');
    } catch (err) { SC.fail(err); }
  });
  $('#btn-next').addEventListener('click', () => { if (validate(step)) showStep(step + 1); });
  $('#btn-back').addEventListener('click', () => showStep(Math.max(1, step - 1)));
  $$('input[name=pay]').forEach((r) => r.addEventListener('change', () => { if (step === 4) getQuote(); }));
  $('#order-form').addEventListener('submit', submit);
  showStep(1);

  SC.loadConfig().then((c) => { cfg = c; SC.renderChrome('order'); SC.setLang(SC.lang); }).catch(SC.fail);
  locate();
})();
