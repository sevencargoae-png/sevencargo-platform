(function () {
  'use strict';
  const { $, $$, esc, t, api } = SC;

  SC.addDict({
    ar: {
      d_login_title: 'بوابة المندوب', d_login_sub: 'سجّل الدخول برقم هاتفك وكلمة المرور من الإدارة',
      dt_orders: 'طلباتي', dt_history: 'السجل', dt_chat: 'الإدارة', dt_report: 'بلاغ', dt_profile: 'حسابي',
      duty_on: 'حاضر وجاهز للاستلام', duty_off_l: 'غير مسجّل حضور', check_in: 'تسجيل حضور', check_out: 'تسجيل انصراف', check_out_q: 'تسجيل الانصراف؟ لن تستقبل طلبات جديدة.',
      gps_on: 'GPS يعمل — موقعك يُرسل للإدارة', gps_off: 'GPS متوقف', gps_err: 'فعّل خدمة الموقع للمتصفح',
      no_orders: 'لا توجد طلبات حاليًا. سيصلك إشعار عند تعيين طلب جديد.', no_history: 'لا يوجد سجل بعد',
      new_order: 'طلب جديد', accept: 'قبول', reject: 'رفض', reject_q: 'سبب عدم إمكانية التوصيل', rejected_ok: 'تم الرفض وإبلاغ الإدارة', accepted_ok: 'تم قبول الطلب',
      pickup_point: 'الاستلام', drop_point: 'التسليم', collect: 'حصّل من {who}: {amount}', collect_none: 'مدفوع مسبقًا — لا تحصّل أي مبلغ',
      who_sender: 'المرسل', who_receiver: 'المستلم',
      confirm_pickup: 'تأكيد الاستلام', confirm_delivery: 'تأكيد التسليم', fail: 'تعذّر', fail_q: 'سبب تعذّر الاستلام/التسليم',
      take_photo: '📷 التقط صورة للشحنة', photo_taken: 'تم التقاط الصورة ✓', cash_ok: 'استلمت المبلغ نقدًا: {amount}', code: 'كود التسليم من المستلم',
      locating: 'جارِ تحديد موقعك…', outside: 'أنت على بعد {m} متر من الموقع المحدد. اكتب السبب للمتابعة (سيتم إبلاغ الإدارة):', override: 'السبب',
      picked_ok: 'تم تأكيد الاستلام', delivered_ok: 'تم التسليم بنجاح 🎉', failed_ok: 'تم إبلاغ الإدارة',
      order_chat: 'محادثة الطلب', details: 'التفاصيل', parcel: 'الشحنة', google: 'Google Maps', waze: 'Waze', no_pin: '📍 لا يوجد لوكيشن — اطلبه من العميل على واتساب ثم احفظه', set_loc: '📍 حفظ اللوكيشن', set_loc_q: 'الصق رابط اللوكيشن (خرائط جوجل) أو الإحداثيات', loc_saved: 'تم حفظ اللوكيشن', ask_loc: 'اطلب اللوكيشن', ask_loc_msg: 'مرحبًا، معك مندوب SEVENCARGO بخصوص الشحنة رقم {no}. من فضلك أرسل لي {what} هنا على واتساب.', what_pickup: 'لوكيشن الاستلام', what_drop: 'لوكيشن المستلم (التسليم)', price_pending_banner: '⚠ السعر لم يُحدد بعد — تواصل مع العمليات قبل التحصيل',
      r_title: 'إرسال بلاغ / ظرف طارئ', r_cat: 'نوع البلاغ', r_order: 'الطلب المرتبط', r_none: 'بدون', r_body: 'اوصف المشكلة أو الظرف الطارئ', r_photo: '📷 صورة المشكلة', r_send: 'إرسال البلاغ',
      r_sent: 'تم إرسال البلاغ للإدارة', r_mine: 'بلاغاتي', r_loc_note: 'سيتم إرفاق موقعك الحالي تلقائيًا',
      ic_accident: 'حادث', ic_vehicle: 'عطل مركبة', ic_customer: 'مشكلة مع عميل', ic_address: 'عنوان غير صحيح', ic_damage: 'تلف شحنة', ic_emergency: 'ظرف طارئ', ic_other: 'أخرى',
      cm_status_open: 'مفتوح', cm_status_in_progress: 'قيد المعالجة', cm_status_resolved: 'تم الحل',
      p_today: 'تسليمات اليوم', p_cash: 'نقدية معك (لم تُسلّم للإدارة)', p_rating: 'تقييمك', p_route: 'خط السير', p_vehicle: 'المركبة', p_notif: 'الإشعارات',
      ops_chat: 'محادثة الإدارة', wa_ops: 'واتساب خدمة العملاء',
    },
    en: {
      d_login_title: 'Courier portal', d_login_sub: 'Sign in with your phone and the password from operations',
      dt_orders: 'My orders', dt_history: 'History', dt_chat: 'Operations', dt_report: 'Report', dt_profile: 'Account',
      duty_on: 'On duty & ready', duty_off_l: 'Not checked in', check_in: 'Check in', check_out: 'Check out', check_out_q: 'Check out? You will not receive new orders.',
      gps_on: 'GPS on — sharing your location with operations', gps_off: 'GPS off', gps_err: 'Enable location for your browser',
      no_orders: 'No orders right now. You will be notified when one is assigned.', no_history: 'No history yet',
      new_order: 'New order', accept: 'Accept', reject: 'Decline', reject_q: 'Why can you not deliver this order?', rejected_ok: 'Declined — operations notified', accepted_ok: 'Order accepted',
      pickup_point: 'Pickup', drop_point: 'Delivery', collect: 'Collect from {who}: {amount}', collect_none: 'Prepaid — do not collect any cash',
      who_sender: 'sender', who_receiver: 'receiver',
      confirm_pickup: 'Confirm pickup', confirm_delivery: 'Confirm delivery', fail: 'Failed', fail_q: 'Why did pickup/delivery fail?',
      take_photo: '📷 Take a photo of the parcel', photo_taken: 'Photo captured ✓', cash_ok: 'I collected the cash: {amount}', code: 'Delivery code from receiver',
      locating: 'Getting your location…', outside: 'You are {m} m from the set location. Enter a reason to continue (operations will be notified):', override: 'Reason',
      picked_ok: 'Pickup confirmed', delivered_ok: 'Delivered successfully 🎉', failed_ok: 'Operations notified',
      order_chat: 'Order chat', details: 'Details', parcel: 'Parcel', google: 'Google Maps', waze: 'Waze', no_pin: '📍 No location yet — ask the customer on WhatsApp, then save it', set_loc: '📍 Save location', set_loc_q: 'Paste the location link (Google Maps) or coordinates', loc_saved: 'Location saved', ask_loc: 'Ask for location', ask_loc_msg: 'Hello, this is your SEVENCARGO courier about shipment {no}. Please send me the {what} here on WhatsApp.', what_pickup: 'pickup location', what_drop: 'receiver (delivery) location', price_pending_banner: '⚠ Price not set yet — contact operations before collecting',
      r_title: 'Send a report / emergency', r_cat: 'Type', r_order: 'Related order', r_none: 'None', r_body: 'Describe the problem or emergency', r_photo: '📷 Photo of the problem', r_send: 'Send report',
      r_sent: 'Report sent to operations', r_mine: 'My reports', r_loc_note: 'Your current location will be attached automatically',
      ic_accident: 'Accident', ic_vehicle: 'Vehicle breakdown', ic_customer: 'Customer issue', ic_address: 'Wrong address', ic_damage: 'Parcel damage', ic_emergency: 'Emergency', ic_other: 'Other',
      cm_status_open: 'Open', cm_status_in_progress: 'In progress', cm_status_resolved: 'Resolved',
      p_today: 'Deliveries today', p_cash: 'Cash with you (not yet handed in)', p_rating: 'Your rating', p_route: 'Route', p_vehicle: 'Vehicle', p_notif: 'Notifications',
      ops_chat: 'Chat with operations', wa_ops: 'Customer care WhatsApp',
    },
  });

  let me = null; let socket = null; let tab = 'orders'; let watchId = null; let lastPos = null; let wakeLock = null;
  let orders = []; let chatWidget = null; let orderChat = null;

  SC.initLang();
  SC.onLang(() => { if (me) { renderDuty(); render(); } });

  async function boot() {
    try { me = await api('/api/driver/me'); } catch { me = null; }
    if (!me) { showLogin(); return; }
    $('#login-view').classList.add('hidden');
    $('#app-view').classList.remove('hidden');
    $('#bottom-nav').classList.remove('hidden');
    $('#d-name').textContent = me.name;
    $('#d-sub').textContent = `${SC.em(me.emirate)} · ${me.vehicle_type || ''} ${me.vehicle_plate || ''}`;
    connectSocket();
    renderDuty();
    if (me.duty_status === 'available') startGps();
    loadNotifCount();
    SC.loadConfig().catch(() => {});
    render();
  }
  function showLogin() {
    stopGps();
    $('#app-view').classList.add('hidden'); $('#bottom-nav').classList.add('hidden');
    $('#login-view').classList.remove('hidden');
  }
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); $('#l-err').textContent = '';
    const btn = e.target.querySelector('button[type=submit]'); btn.disabled = true;
    try { await api('/api/driver/login', { body: { phone: $('#l-phone').value, password: $('#l-pass').value } }); $('#l-pass').value = ''; boot(); }
    catch (err) { $('#l-err').textContent = err.message; } finally { btn.disabled = false; }
  });
  async function logout() { try { await api('/api/driver/logout', { body: {} }); } catch { /* */ } if (socket) socket.disconnect(); me = null; showLogin(); }
  $('#logout').addEventListener('click', logout);
  const origFail = SC.fail;
  SC.fail = (e) => { if (e && e.status === 401) { me = null; showLogin(); } origFail(e); };

  // ---------------- realtime ----------------
  function connectSocket() {
    if (socket) socket.disconnect();
    socket = io({ auth: { role: 'driver' } });
    socket.on('notify', (n) => {
      SC.beep(); if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      SC.toast(n.body || '', n.type === 'order_assigned' ? 'ok' : 'info', n.title);
      SC.desktopNotify(n.title, n.body);
      loadNotifCount();
      if (n.type === 'chat' && !n.order_id && tab !== 'chat') { const b = $('#b-chat'); b.textContent = '•'; b.classList.remove('hidden'); }
    });
    socket.on('order-changed', () => { if (tab === 'orders' || tab === 'history') render(); });
    socket.on('chat', (m) => {
      if (!m.order_id && chatWidget) chatWidget.add(m);
      if (m.order_id && orderChat && orderChat.id === m.order_id) orderChat.w.add(m);
    });
    socket.on('duty-changed', async () => { me = await api('/api/driver/me'); renderDuty(); if (me.duty_status === 'available') startGps(); else stopGps(); });
    socket.on('force-logout', logout);
    socket.on('connect', () => { if (lastPos) socket.emit('loc', lastPos); });
  }

  // ---------------- GPS ----------------
  function startGps() {
    if (watchId != null || !navigator.geolocation) return;
    watchId = navigator.geolocation.watchPosition((p) => {
      lastPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      if (socket) socket.emit('loc', lastPos);
      const g = $('#gps-state'); if (g) { g.textContent = t('gps_on'); g.style.color = 'var(--ok)'; }
    }, () => { const g = $('#gps-state'); if (g) { g.textContent = t('gps_err'); g.style.color = 'var(--danger)'; } },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    requestWakeLock();
  }
  function stopGps() { if (watchId != null) { navigator.geolocation.clearWatch(watchId); watchId = null; } if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } }
  async function requestWakeLock() { try { if ('wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch { /* */ } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && me && me.duty_status === 'available') requestWakeLock(); });
  // periodic heartbeat so the map stays fresh even when the phone is stationary
  setInterval(() => { if (socket && lastPos && me && me.duty_status === 'available') socket.emit('loc', lastPos); }, 30000);

  function renderDuty() {
    const on = me.duty_status === 'available';
    $('#duty-card').innerHTML = `<div style="font-size:1.6rem">${on ? '🟢' : '⚪'}</div><div style="flex:1"><div class="state">${on ? t('duty_on') : t('duty_off_l')}</div><div class="small" id="gps-state" style="color:var(--muted)">${on ? (watchId != null ? t('gps_on') : t('locating')) : t('gps_off')}</div></div>
      <button class="btn ${on ? 'btn-ghost' : 'btn-primary'}" id="duty-btn">${on ? t('check_out') : t('check_in')}</button>`;
    $('#duty-btn').onclick = async () => {
      const b = $('#duty-btn'); b.disabled = true;
      try {
        if (on) {
          if (!(await SC.confirmBox(t('check_out_q')))) { b.disabled = false; return; }
          await api('/api/driver/checkout', { body: {} }); stopGps();
        } else {
          let pos = {}; try { pos = await SC.getLocation(); } catch (e) { SC.toast(e.message, 'error'); }
          await api('/api/driver/checkin', { body: { lat: pos.lat, lng: pos.lng } }); startGps();
        }
        me = await api('/api/driver/me'); renderDuty();
      } catch (e) { SC.fail(e); b.disabled = false; }
    };
  }

  // ---------------- tabs ----------------
  $('#bottom-nav').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (!b) return; tab = b.dataset.tab; $$('#bottom-nav [data-tab]').forEach((x) => x.classList.toggle('active', x === b)); if (tab === 'chat') $('#b-chat').classList.add('hidden'); render(); window.scrollTo(0, 0); });
  async function render() {
    chatWidget = null;
    const v = $('#view');
    try {
      if (tab === 'orders') await renderOrders(v, 'active');
      else if (tab === 'history') await renderOrders(v, 'history');
      else if (tab === 'chat') renderChat(v);
      else if (tab === 'report') await renderReport(v);
      else if (tab === 'profile') await renderProfile(v);
    } catch (e) { SC.fail(e); }
  }

  // ---------------- orders ----------------
  async function renderOrders(v, scope) {
    orders = await api('/api/driver/orders?scope=' + scope);
    if (scope === 'active') { const b = $('#b-orders'); const n = orders.filter((o) => o.status === 'assigned').length; b.textContent = n; b.classList.toggle('hidden', !n); }
    if (!orders.length) { v.innerHTML = `<div class="empty">${t(scope === 'active' ? 'no_orders' : 'no_history')}</div>`; return; }
    v.innerHTML = orders.map((o) => card(o, scope)).join('');
    v.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => action(b.dataset.act, Number(b.dataset.id), b.dataset.target)));
  }
  function card(o, scope) {
    const toPickup = ['assigned', 'accepted'].includes(o.status);
    const target = toPickup ? { lat: o.pickup_lat, lng: o.pickup_lng } : { lat: o.dropoff_lat, lng: o.dropoff_lng };
    const cashWho = o.payment_method === 'cash_sender' ? t('who_sender') : t('who_receiver');
    const cash = o.price_pending && o.payment_status !== 'paid' ? `<div class="cash-banner">${t('price_pending_banner')}</div>` : o.cash_to_collect > 0 ? `<div class="cash-banner">💵 ${esc(t('collect', { who: cashWho, amount: SC.money(o.cash_to_collect) }))}</div>` : `<div class="cash-banner" style="color:var(--ok);border-color:rgba(46,204,143,.4);background:rgba(46,204,143,.08)">✓ ${t('collect_none')}</div>`;
    let actions = '';
    if (scope === 'active') {
      if (o.status === 'assigned') actions = `<button class="btn btn-primary" data-act="accept" data-id="${o.id}">${t('accept')}</button><button class="btn btn-danger" data-act="reject" data-id="${o.id}">${t('reject')}</button>`;
      else if (o.status === 'accepted') actions = `<button class="btn btn-primary" data-act="pickup" data-id="${o.id}">${t('confirm_pickup')}</button><button class="btn btn-ghost" data-act="reject" data-id="${o.id}">${t('reject')}</button><button class="btn btn-danger" data-act="fail" data-id="${o.id}">${t('fail')}</button>`;
      else if (o.status === 'picked_up') actions = `<button class="btn btn-primary" data-act="deliver" data-id="${o.id}">${t('confirm_delivery')}</button><button class="btn btn-danger" data-act="fail" data-id="${o.id}">${t('fail')}</button>`;
      actions += `<button class="btn btn-ghost" data-act="chat" data-id="${o.id}">💬 ${t('order_chat')}</button>`;
    }
    const person = toPickup ? { n: o.sender_name, p: o.sender_phone } : { n: o.receiver_name, p: o.receiver_phone || o.sender_phone };
    const hasPin = target.lat != null && target.lng != null;
    const askMsg = t('ask_loc_msg', { no: o.tracking_no, what: t(toPickup ? 'what_pickup' : 'what_drop') });
    const needDropPin = o.status === 'accepted' && o.dropoff_lat == null;
    return `<div class="card order-card">
      <div class="row">${o.status === 'assigned' ? `<span class="pill warn">🔔 ${t('new_order')}</span>` : ''}<b class="ltr">${esc(o.tracking_no)}</b><span class="spacer"></span>${SC.status(o.status)}</div>
      <div class="route">
        <div class="pt"><span class="tag a">A</span><div><b>${t('pickup_point')}</b> · ${esc(SC.em(o.pickup_emirate))}<div class="small">${esc(SC.addr(o, 'pickup'))}</div><div class="small muted">${esc(o.sender_name || '—')} · <span class="ltr">${SC.phoneFmt(o.sender_phone)}</span></div></div></div>
        <div class="pt"><span class="tag b">B</span><div><b>${t('drop_point')}</b> · ${esc(SC.em(o.dropoff_emirate))}<div class="small">${esc(SC.addr(o, 'dropoff'))}</div><div class="small muted">${esc(o.receiver_name || '—')} · <span class="ltr">${SC.phoneFmt(o.receiver_phone)}</span></div></div></div>
      </div>
      <div class="small muted" style="margin-bottom:8px">📦 ${esc(SC.parcel(o))}${o.distance_km != null ? ' · ' + o.distance_km + ' ' + t('km') : ''} · ${SC.price(o)}${o.description ? ' — ' + esc(o.description) : ''}</div>
      ${o.photo_url ? `<img class="photo-thumb" src="${esc(o.photo_url)}" alt="" style="max-height:150px;margin-bottom:8px">` : ''}
      ${scope === 'active' ? cash : `<div class="small muted">${SC.date(o.delivered_at || o.updated_at)}${o.fail_reason ? ' — ' + esc(o.fail_reason) : ''}</div>`}
      ${scope === 'active' && o.status !== 'assigned' && !hasPin ? `<div class="cash-banner" style="margin-top:8px">${t('no_pin')}</div>` : ''}
      ${scope === 'active' && o.status !== 'assigned' ? `<div class="actions">
        ${hasPin ? `<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${SC.navLink(target.lat, target.lng)}">🧭 ${t('google')}</a>
        <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${SC.wazeLink(target.lat, target.lng)}">🚗 ${t('waze')}</a>`
        : `<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(person.p, askMsg)}">${t('ask_loc')}</a>`}
        ${!hasPin || needDropPin ? `<button class="btn btn-ghost btn-sm" data-act="setloc" data-target="${!hasPin ? (toPickup ? 'pickup' : 'dropoff') : 'dropoff'}" data-id="${o.id}">${t('set_loc')}${hasPin ? ' (B)' : ''}</button>` : ''}
        <a class="btn btn-ghost btn-sm" href="tel:+${esc(person.p)}">📞 ${t('call')}</a>
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(person.p)}">${t('whatsapp')}</a></div>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>`;
  }

  function takePhoto() {
    return new Promise((resolve) => {
      const inp = $('#cam'); inp.value = '';
      inp.onchange = async () => { const f = inp.files[0]; if (!f) return resolve(null); try { resolve(await SC.compressImage(f, 1280, 0.75)); } catch (e) { SC.fail(e); resolve(null); } };
      inp.click();
    });
  }

  async function action(act, id, target) {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    try {
      if (act === 'accept') { await api(`/api/driver/orders/${id}/accept`, { body: {} }); SC.toast(t('accepted_ok'), 'ok'); render(); }
      else if (act === 'reject') { const reason = await SC.confirmBox(t('reject'), { danger: true, input: t('reject_q') }); if (!reason) return; await api(`/api/driver/orders/${id}/reject`, { body: { reason } }); SC.toast(t('rejected_ok'), 'ok'); render(); }
      else if (act === 'fail') { const reason = await SC.confirmBox(t('fail'), { danger: true, input: t('fail_q') }); if (!reason) return; let pos = {}; try { pos = await SC.getLocation(); } catch { /* */ } await api(`/api/driver/orders/${id}/fail`, { body: { reason, lat: pos.lat, lng: pos.lng } }); SC.toast(t('failed_ok'), 'ok'); render(); }
      else if (act === 'pickup' || act === 'deliver') proofModal(o, act);
      else if (act === 'chat') openOrderChat(o);
      else if (act === 'setloc') {
        const loc = await SC.confirmBox(t('set_loc'), { input: t('set_loc_q') });
        if (!loc) return;
        await api(`/api/driver/orders/${id}/location`, { body: { target, location: loc } });
        SC.toast(t('loc_saved'), 'ok'); render();
      }
    } catch (e) { SC.fail(e); }
  }

  function proofModal(o, act) {
    const isPickup = act === 'pickup';
    const needCash = o.cash_to_collect > 0 && ((isPickup && o.payment_method === 'cash_sender') || (!isPickup && o.payment_method === 'cash_receiver'));
    const m = SC.modal(`<div class="modal-head"><h3>${isPickup ? t('confirm_pickup') : t('confirm_delivery')} — <span class="ltr">${esc(o.tracking_no)}</span></h3><button class="btn btn-ghost btn-sm" data-close>${t('close')}</button></div>
      ${!isPickup ? `<div class="field"><label>${t('code')}</label><input id="pf-code" inputmode="numeric" maxlength="4" dir="ltr" style="font-size:1.6rem;letter-spacing:10px;text-align:center"></div>` : ''}
      <button class="btn btn-ghost btn-block" id="pf-photo">${t('take_photo')}</button><img id="pf-prev" class="hidden photo-thumb" style="margin-top:10px" alt="">
      ${needCash ? `<label class="check" style="margin-top:14px"><input type="checkbox" id="pf-cash"> <b>${esc(t('cash_ok', { amount: SC.money(o.cash_to_collect) }))}</b></label>` : ''}
      <div id="pf-over" class="hidden" style="margin-top:12px"><p class="small" id="pf-over-t" style="color:var(--warn)"></p><input id="pf-reason" placeholder="${t('override')}"></div>
      <div class="err" id="pf-err"></div>
      <button class="btn btn-primary btn-block btn-lg" id="pf-go" style="margin-top:14px">${t('confirm')}</button>`);
    let photo = null;
    m.el.querySelector('#pf-photo').onclick = async () => { const p = await takePhoto(); if (p) { photo = p; const i = m.el.querySelector('#pf-prev'); i.src = p; i.classList.remove('hidden'); m.el.querySelector('#pf-photo').textContent = t('photo_taken'); } };
    m.el.querySelector('#pf-go').onclick = async () => {
      const err = m.el.querySelector('#pf-err'); err.textContent = '';
      const btn = m.el.querySelector('#pf-go'); btn.disabled = true; btn.textContent = t('locating');
      try {
        let pos;
        try { pos = await SC.getLocation({ maximumAge: 5000 }); } catch (e) { if (lastPos) pos = lastPos; else throw e; }
        const body = { lat: pos.lat, lng: pos.lng, photo, cash_confirmed: needCash ? m.el.querySelector('#pf-cash').checked : undefined, override_reason: m.el.querySelector('#pf-reason').value.trim() || undefined };
        if (!isPickup) body.code = m.el.querySelector('#pf-code').value.trim();
        await api(`/api/driver/orders/${o.id}/${act}`, { body });
        m.close(); SC.toast(isPickup ? t('picked_ok') : t('delivered_ok'), 'ok'); render();
      } catch (e) {
        if (e.code === 'outside_geofence') {
          m.el.querySelector('#pf-over').classList.remove('hidden');
          m.el.querySelector('#pf-over-t').textContent = t('outside', { m: e.data && e.data.meters });
          m.el.querySelector('#pf-reason').focus();
        } else err.textContent = e.message;
      } finally { btn.disabled = false; btn.textContent = t('confirm'); }
    };
  }

  async function openOrderChat(o) {
    const m = SC.modal(`<div class="modal-head"><h3>${t('order_chat')} — <span class="ltr">${esc(o.tracking_no)}</span></h3><button class="btn btn-ghost btn-sm" data-close>${t('close')}</button></div><div id="oc"></div>`, { onClose: () => { orderChat = null; } });
    const d = await api(`/api/driver/orders/${o.id}`);
    orderChat = { id: o.id, w: SC.chat({ el: m.el.querySelector('#oc'), me: 'driver', initial: d.messages, send: (b) => api(`/api/driver/orders/${o.id}/messages`, { body: { body: b } }) }) };
  }

  // ---------------- chat with ops ----------------
  function renderChat(v) {
    v.innerHTML = `<div class="card" style="margin:14px"><div class="row" style="margin-bottom:10px"><h3 style="margin:0">${t('ops_chat')}</h3><span class="spacer"></span><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(SC.contact.whatsapp)}">${t('whatsapp')}</a></div><div id="ops-chat"></div></div>`;
    chatWidget = SC.chat({ el: $('#ops-chat'), me: 'driver', load: () => api('/api/driver/messages'), send: (b) => api('/api/driver/messages', { body: { body: b } }) });
    $('#ops-chat').style.height = 'calc(100vh - 330px)';
  }

  // ---------------- report / incidents ----------------
  async function renderReport(v) {
    const [mine, act] = await Promise.all([api('/api/driver/incidents'), api('/api/driver/orders?scope=active')]);
    const cats = ['emergency', 'accident', 'vehicle', 'customer', 'address', 'damage', 'other'];
    v.innerHTML = `<div class="card" style="margin:14px"><h3>🚨 ${t('r_title')}</h3>
      <div class="field"><label>${t('r_cat')}</label><select id="r-cat">${cats.map((c) => `<option value="${c}">${t('ic_' + c)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('r_order')}</label><select id="r-order"><option value="">${t('r_none')}</option>${act.map((o) => `<option value="${o.id}">${esc(o.tracking_no)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('r_body')}</label><textarea id="r-body" maxlength="2000"></textarea></div>
      <button class="btn btn-ghost btn-block" id="r-photo">${t('r_photo')}</button><img id="r-prev" class="hidden photo-thumb" style="margin-top:10px" alt="">
      <p class="hint">${t('r_loc_note')}</p><div class="err" id="r-err"></div>
      <button class="btn btn-danger btn-block btn-lg" id="r-send">${t('r_send')}</button></div>
      <div class="card" style="margin:14px"><h3>${t('r_mine')}</h3>${mine.length ? mine.map((c) => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div class="row"><b>#${c.id}</b><span class="pill">${t('ic_' + c.category)}</span><span class="pill ${c.status === 'resolved' ? 'ok' : 'warn'}">${t('cm_status_' + c.status)}</span><span class="spacer"></span><span class="small muted">${SC.ago(c.created_at)}</span></div><div class="small">${esc(c.body)}</div>${c.admin_reply ? `<div class="small" style="color:var(--gold-soft)">↳ ${esc(c.admin_reply)}</div>` : ''}</div>`).join('') : `<div class="muted small">${t('no_history')}</div>`}</div>`;
    let photo = null;
    $('#r-photo').onclick = async () => { const p = await takePhoto(); if (p) { photo = p; $('#r-prev').src = p; $('#r-prev').classList.remove('hidden'); } };
    $('#r-send').onclick = async () => {
      $('#r-err').textContent = '';
      const body = $('#r-body').value.trim();
      if (body.length < 5) { $('#r-err').textContent = t('r_body'); return; }
      const b = $('#r-send'); b.disabled = true;
      let pos = lastPos || {}; try { pos = await SC.getLocation({ timeout: 8000 }); } catch { /* use last */ }
      try { await api('/api/driver/incidents', { body: { category: $('#r-cat').value, order_id: $('#r-order').value || null, body, photo, lat: pos.lat, lng: pos.lng } }); SC.toast(t('r_sent'), 'ok'); render(); }
      catch (e) { $('#r-err').textContent = e.message; b.disabled = false; }
    };
  }

  // ---------------- profile ----------------
  async function loadNotifCount() { try { const r = await api('/api/driver/notifications'); const b = $('#b-notif'); b.textContent = r.unread; b.classList.toggle('hidden', !r.unread); return r; } catch { return null; } }
  async function renderProfile(v) {
    me = await api('/api/driver/me');
    const n = await api('/api/driver/notifications');
    v.innerHTML = `<div class="grid g2" style="margin:14px">
        <div class="card stat accent"><div class="v">${me.delivered_today}</div><div class="l">${t('p_today')}</div></div>
        <div class="card stat gold"><div class="v">${SC.money(me.cash_due)}</div><div class="l">${t('p_cash')}</div></div>
        <div class="card stat"><div class="v">${me.rating != null ? me.rating + ' ★' : '—'}</div><div class="l">${t('p_rating')} (${me.ratings})</div></div>
      </div>
      <div class="card" style="margin:14px"><dl class="kv"><dt>${t('phone')}</dt><dd class="ltr">${SC.phoneFmt(me.phone)}</dd><dt>${t('p_vehicle')}</dt><dd>${esc(me.vehicle_type)} ${esc(me.vehicle_plate)}</dd><dt>${t('p_route')}</dt><dd>${esc(SC.em(me.emirate))}${me.route_areas ? ' — ' + esc(me.route_areas) : ''}</dd></dl></div>
      <div class="card" style="margin:14px;padding:0"><div style="padding:12px 16px"><b>${t('p_notif')}</b></div><div class="notif-list">${n.items.map((x) => `<div class="notif ${x.read ? '' : 'unread'}"><b>${esc(x.title)}</b><div>${esc(x.body)}</div><div class="d">${SC.date(x.created_at)}</div></div>`).join('') || `<div class="empty small">—</div>`}</div></div>`;
    if (n.unread) { await api('/api/driver/notifications/read', { body: {} }); $('#b-notif').classList.add('hidden'); }
  }

  boot();
})();
