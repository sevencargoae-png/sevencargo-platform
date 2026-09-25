(function () {
  'use strict';
  const { $, esc, t } = SC;
  SC.addDict({
    ar: {
      t_title: 'تتبع شحنتك', t_sub: 'أدخل رقم الشحنة أو رقم هاتفك (المرسل أو المستلم) — بدون تسجيل حساب.', t_ph: 'SC12345678 أو 05XXXXXXXX',
      t_orders: 'شحناتك', t_no: 'رقم الشحنة', t_status: 'الحالة', t_route: 'المسار', t_open: 'فتح', t_from_to: '{a} ← {b}',
      t_payment: 'الدفع', t_amount: 'المبلغ', t_sender: 'المرسل', t_receiver: 'المستلم', t_parcel: 'الشحنة', t_timeline: 'مراحل الشحنة',
      t_code: 'كود التسليم', t_code_d: 'أعطِ هذا الكود للمندوب عند استلامك الشحنة فقط.', t_driver: 'المندوب', t_driver_wait: 'سيظهر المندوب هنا بعد قبوله الطلب.',
      t_live: 'موقع المندوب مباشر', t_updated: 'آخر تحديث {t}',
      t_pay_now: 'ادفع الآن', t_switch_cash: 'التحويل للدفع كاش', t_cash_who: 'من سيدفع؟', t_pay_verifying: 'جارِ التحقق من الدفع…', t_paid_ok: 'تم تأكيد الدفع بنجاح',
      t_pay_cancelled: 'لم تكتمل عملية الدفع. يمكنك المحاولة مجددًا.', t_cancel: 'إلغاء الشحنة', t_cancel_q: 'هل تريد إلغاء الشحنة؟', t_cancel_reason: 'سبب الإلغاء', t_cancelled_ok: 'تم إلغاء الشحنة',
      t_rate: 'قيّم الخدمة', t_rate_comment: 'تعليقك (اختياري)', t_rate_send: 'إرسال التقييم', t_rated: 'شكرًا لتقييمك', t_complain: 'تقديم شكوى',
      t_proof: 'صورة إثبات التسليم', t_details: 'تفاصيل', t_weight_dims: '{w} كجم · {l}×{wd}×{h} سم',
    },
    en: {
      t_title: 'Track your shipment', t_sub: 'Enter the tracking number or your phone (sender or receiver) — no account needed.', t_ph: 'SC12345678 or 05XXXXXXXX',
      t_orders: 'Your shipments', t_no: 'Tracking no.', t_status: 'Status', t_route: 'Route', t_open: 'Open', t_from_to: '{a} → {b}',
      t_payment: 'Payment', t_amount: 'Amount', t_sender: 'Sender', t_receiver: 'Receiver', t_parcel: 'Parcel', t_timeline: 'Shipment progress',
      t_code: 'Delivery code', t_code_d: 'Give this code to the courier only when you receive the parcel.', t_driver: 'Courier', t_driver_wait: 'Your courier will appear here once they accept.',
      t_live: 'Live courier location', t_updated: 'Updated {t}',
      t_pay_now: 'Pay now', t_switch_cash: 'Switch to cash', t_cash_who: 'Who will pay?', t_pay_verifying: 'Verifying payment…', t_paid_ok: 'Payment confirmed',
      t_pay_cancelled: 'Payment was not completed. You can try again.', t_cancel: 'Cancel shipment', t_cancel_q: 'Cancel this shipment?', t_cancel_reason: 'Reason', t_cancelled_ok: 'Shipment cancelled',
      t_rate: 'Rate the service', t_rate_comment: 'Your comment (optional)', t_rate_send: 'Send rating', t_rated: 'Thanks for your rating', t_complain: 'File a complaint',
      t_proof: 'Proof of delivery', t_details: 'Details', t_weight_dims: '{w} kg · {l}×{wd}×{h} cm',
    },
  });

  let socket = null; let current = null; let map = null; let driverMarker = null; let chat = null; let lastData = null;
  const params = new URLSearchParams(location.search);

  function ensureSocket() {
    if (socket) { socket.disconnect(); }
    socket = io({ auth: { role: 'customer' } });
    socket.on('connect', () => { if (current) socket.emit('join-order', current); });
    socket.on('order-changed', (p) => { if (current && p.id === current) openOrder(current, true); });
    socket.on('chat', (m) => { if (chat && m.order_id === current) chat.add(m); });
    socket.on('driver-loc', (p) => { if (lastData && ['accepted', 'picked_up'].includes(lastData.order.status)) moveDriver(p); });
  }

  async function search(qv) {
    $('#track-err').textContent = '';
    const v = qv.replace(/\s/g, '');
    const isNo = /^sc\d{8}$/i.test(v);
    try {
      const r = await SC.api('/api/track?' + (isNo ? 'no=' + encodeURIComponent(v.toUpperCase()) : 'phone=' + encodeURIComponent(v)));
      ensureSocket();
      if (r.orders.length === 1) { $('#list').classList.add('hidden'); openOrder(r.orders[0].id); } else renderList(r.orders);
    } catch (e) {
      $('#track-err').textContent = e.message;
      $('#list').classList.add('hidden'); $('#detail').classList.add('hidden');
    }
  }

  function renderList(orders) {
    const el = $('#list'); el.classList.remove('hidden'); $('#detail').classList.add('hidden');
    el.innerHTML = `<h2 style="font-size:1.2rem">${t('t_orders')}</h2><div class="table-wrap"><table><thead><tr>
      <th>${t('t_no')}</th><th>${t('t_status')}</th><th>${t('t_route')}</th><th>${t('t_amount')}</th><th></th></tr></thead><tbody>
      ${orders.map((o) => `<tr class="click" data-id="${o.id}"><td class="ltr"><b>${esc(o.tracking_no)}</b></td><td>${SC.status(o.status)}</td>
        <td>${esc(t('t_from_to', { a: SC.em(o.pickup_emirate), b: SC.em(o.dropoff_emirate) }))}<div class="small muted">${SC.date(o.created_at)}</div></td>
        <td>${SC.money(o.amount)}</td><td><button class="btn btn-ghost btn-sm">${t('t_open')}</button></td></tr>`).join('')}
      </tbody></table></div>`;
    el.querySelectorAll('tr[data-id]').forEach((tr) => tr.addEventListener('click', () => openOrder(Number(tr.dataset.id))));
  }

  function moveDriver(p) {
    if (!map || !p || p.lat == null) return;
    if (!driverMarker) driverMarker = L.marker([p.lat, p.lng], { icon: SC.carIcon() }).addTo(map);
    else driverMarker.setLatLng([p.lat, p.lng]);
    const u = $('#live-upd'); if (u) u.textContent = t('t_updated', { t: SC.time(p.at || new Date()) });
  }

  async function openOrder(id, refresh = false) {
    if (current && current !== id && socket) socket.emit('leave-order', current);
    current = id;
    if (socket && socket.connected) socket.emit('join-order', id);
    let data;
    try { data = await SC.api('/api/orders/' + id); } catch (e) { SC.fail(e); return; }
    lastData = data;
    render(data, refresh);
  }

  function render(data, refresh) {
    const o = data.order;
    const el = $('#detail'); el.classList.remove('hidden');
    const chatEl = refresh ? $('#chat') : null;
    const final = ['delivered', 'cancelled'].includes(o.status);
    const canCancel = ['awaiting_payment', 'pending', 'assigned'].includes(o.status) && o.payment_status !== 'paid';
    const live = ['accepted', 'picked_up'].includes(o.status);
    const bad = ['failed', 'cancelled'];
    const tl = data.events.map((e) => `<li class="${bad.includes(e.status) ? 'bad' : 'done'}"><div class="t">${esc(t('st_' + e.status))}</div><div class="d">${SC.date(e.created_at)}${e.note ? ' — ' + esc(e.note) : ''}</div></li>`).join('');

    el.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <div class="row">
          <div><div class="small muted">${t('t_no')}</div><div style="font-size:1.6rem;font-weight:900" class="ltr">${esc(o.tracking_no)}</div></div>
          <span class="spacer"></span>
          ${SC.status(o.status)}
          <span class="pill ${o.payment_status === 'paid' ? 'ok' : 'warn'}">${esc(t('ps_' + o.payment_status))}</span>
        </div>
        ${o.status === 'awaiting_payment' ? `<div class="row" style="margin-top:14px"><button class="btn btn-primary" id="btn-pay">${t('t_pay_now')} — ${SC.money(o.amount)}</button><button class="btn btn-ghost" id="btn-cash">${t('t_switch_cash')}</button></div>` : ''}
      </div>
      <div class="grid g2">
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="row" style="margin-bottom:8px"><h3 style="margin:0">${live ? t('t_live') : t('t_details')}</h3><span class="spacer"></span><span class="small muted" id="live-upd"></span></div>
            <div id="map" class="map"></div>
          </div>
          <div class="card" style="margin-bottom:16px"><h3>${t('t_timeline')}</h3><ul class="timeline">${tl}</ul></div>
        </div>
        <div>
          ${o.delivery_code ? `<div class="card" style="margin-bottom:16px;text-align:center"><h3>${t('t_code')}</h3><div class="code-box">${esc(o.delivery_code)}</div><p class="small muted" style="margin:8px 0 0">${t('t_code_d')}</p></div>` : ''}
          <div class="card" style="margin-bottom:16px">
            <h3>${t('t_driver')}</h3>
            ${o.driver ? `<div class="row"><div style="font-size:2rem">🚚</div><div><b>${esc(o.driver.name)}</b><div class="small muted">${esc(o.driver.vehicle || '')} ${esc(o.driver.plate || '')}</div></div><span class="spacer"></span>
              ${live ? `<a class="btn btn-ghost btn-sm" href="tel:+${esc(o.driver.phone)}">${t('call')}</a><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(o.driver.phone)}">${t('whatsapp')}</a>` : ''}</div>`
              : `<p class="muted small" style="margin:0">${t('t_driver_wait')}</p>`}
          </div>
          <div class="card" style="margin-bottom:16px">
            <dl class="kv">
              <dt>${t('t_sender')}</dt><dd>${esc(o.sender_name)} · <span class="ltr">${SC.phoneFmt(o.sender_phone)}</span><div class="small muted">${esc(SC.em(o.pickup_emirate))} — ${esc(o.pickup_address)}</div></dd>
              <dt>${t('t_receiver')}</dt><dd>${esc(o.receiver_name)} · <span class="ltr">${SC.phoneFmt(o.receiver_phone)}</span><div class="small muted">${esc(SC.em(o.dropoff_emirate))} — ${esc(o.dropoff_address)}</div></dd>
              <dt>${t('t_parcel')}</dt><dd>${esc(t('ct_' + o.content_type))} · ${esc(t('t_weight_dims', { w: o.weight_kg, l: o.length_cm, wd: o.width_cm, h: o.height_cm }))}</dd>
              <dt>${t('t_payment')}</dt><dd>${esc(t('pm_' + o.payment_method))}</dd>
              <dt>${t('t_amount')}</dt><dd><b>${SC.money(o.amount)}</b> <span class="small muted">(${o.distance_km} ${t('km')})</span></dd>
            </dl>
            ${o.photo_url ? `<img class="photo-thumb" style="margin-top:12px" src="${esc(o.photo_url)}" alt="">` : ''}
            ${o.delivery_photo_url ? `<div class="small muted" style="margin-top:12px">${t('t_proof')}</div><img class="photo-thumb" src="${esc(o.delivery_photo_url)}" alt="">` : ''}
          </div>
          ${o.status === 'delivered' ? (o.rating ? `<div class="card" style="margin-bottom:16px"><h3>${t('t_rated')}</h3><div style="font-size:1.4rem;color:var(--gold)">${'★'.repeat(o.rating.stars)}${'☆'.repeat(5 - o.rating.stars)}</div></div>`
            : `<div class="card" style="margin-bottom:16px" id="rate-card"><h3>${t('t_rate')}</h3><div id="stars" style="font-size:2rem;color:var(--gold);cursor:pointer;letter-spacing:4px">☆☆☆☆☆</div><div class="field"><textarea id="rate-comment" maxlength="500" placeholder="${t('t_rate_comment')}"></textarea></div><button class="btn btn-primary" id="btn-rate" disabled>${t('t_rate_send')}</button></div>`) : ''}
          <div class="card" style="margin-bottom:16px"><h3>${t('chat')}</h3><div id="chat"></div></div>
          <div class="row">
            <a class="btn btn-ghost" href="/complaints?no=${esc(o.tracking_no)}">${t('t_complain')}</a>
            ${canCancel ? `<button class="btn btn-danger" id="btn-cancel">${t('t_cancel')}</button>` : ''}
          </div>
        </div>
      </div>`;
    if (chatEl) $('#chat').replaceWith(chatEl);
    else chat = SC.chat({ el: $('#chat'), me: 'customer', initial: data.messages, send: (body) => SC.api(`/api/orders/${o.id}/messages`, { body: { body } }) });

    // map
    if (map) { map.remove(); map = null; driverMarker = null; }
    map = SC.makeMap($('#map'), [o.pickup_lat, o.pickup_lng], 12);
    const a = L.marker([o.pickup_lat, o.pickup_lng], { icon: SC.pinIcon('A', 'a') }).addTo(map);
    const b = L.marker([o.dropoff_lat, o.dropoff_lng], { icon: SC.pinIcon('B', 'b') }).addTo(map);
    const pts = [a.getLatLng(), b.getLatLng()];
    if (o.driver_location) { moveDriver(o.driver_location); pts.push(driverMarker.getLatLng()); }
    map.fitBounds(L.latLngBounds(pts).pad(0.25));
    if (!final) L.polyline([[o.pickup_lat, o.pickup_lng], [o.dropoff_lat, o.dropoff_lng]], { color: '#14dbdb', weight: 3, dashArray: '6 8', opacity: 0.7 }).addTo(map);

    // actions
    const payBtn = $('#btn-pay');
    if (payBtn) payBtn.onclick = async () => {
      payBtn.disabled = true;
      try { const r = await SC.api(`/api/orders/${o.id}/pay`, { body: {} }); location.href = r.checkout_url; } catch (e) { SC.fail(e); payBtn.disabled = false; }
    };
    const cashBtn = $('#btn-cash');
    if (cashBtn) cashBtn.onclick = () => {
      const m = SC.modal(`<div class="modal-head"><h3>${t('t_cash_who')}</h3></div><div class="pay-opts">
        <button class="btn btn-ghost btn-block" data-m="cash_sender">${t('pm_cash_sender')}</button>
        <button class="btn btn-ghost btn-block" data-m="cash_receiver">${t('pm_cash_receiver')}</button></div>`);
      m.el.querySelectorAll('[data-m]').forEach((b2) => b2.onclick = async () => {
        try { await SC.api(`/api/orders/${o.id}/switch-to-cash`, { body: { payment_method: b2.dataset.m } }); m.close(); openOrder(o.id, true); } catch (e) { SC.fail(e); }
      });
    };
    const cancelBtn = $('#btn-cancel');
    if (cancelBtn) cancelBtn.onclick = async () => {
      const reason = await SC.confirmBox(t('t_cancel_q'), { danger: true, input: t('t_cancel_reason') });
      if (!reason) return;
      try { await SC.api(`/api/orders/${o.id}/cancel`, { body: { reason } }); SC.toast(t('t_cancelled_ok'), 'ok'); openOrder(o.id, true); } catch (e) { SC.fail(e); }
    };
    const stars = $('#stars');
    if (stars) {
      let n = 0;
      const draw = (k) => { stars.textContent = '★'.repeat(k) + '☆'.repeat(5 - k); };
      stars.addEventListener('mousemove', (e) => { const r = stars.getBoundingClientRect(); let k = Math.ceil(((e.clientX - r.left) / r.width) * 5); if (document.dir === 'rtl') k = 6 - k; draw(Math.min(5, Math.max(1, k))); });
      stars.addEventListener('mouseleave', () => draw(n));
      stars.addEventListener('click', (e) => { const r = stars.getBoundingClientRect(); let k = Math.ceil(((e.clientX - r.left) / r.width) * 5); if (document.dir === 'rtl') k = 6 - k; n = Math.min(5, Math.max(1, k)); draw(n); $('#btn-rate').disabled = false; });
      $('#btn-rate').onclick = async () => {
        try { await SC.api(`/api/orders/${o.id}/rating`, { body: { stars: n, comment: $('#rate-comment').value } }); SC.toast(t('t_rated'), 'ok'); openOrder(o.id, true); } catch (e) { SC.fail(e); }
      };
    }
  }

  // ---------- init ----------
  SC.renderChrome('track');
  SC.onLang(() => { if (lastData) render(lastData, true); });
  SC.initLang();
  SC.reveal();

  $('#track-form').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#track-input').value.trim(); if (v) search(v); });

  (async () => {
    SC.loadConfig().then(() => { SC.renderChrome('track'); SC.setLang(SC.lang); }).catch(() => {});
    const no = params.get('no'); const ph = params.get('phone');
    if (no || ph) {
      $('#track-input').value = no || ph;
      await search(no || ph);
      if (params.get('paid') === '1' && current) {
        SC.toast(t('t_pay_verifying'));
        try { const r = await SC.api(`/api/orders/${current}/verify-payment`, { body: {} }); if (r.paid) { SC.toast(t('t_paid_ok'), 'ok'); openOrder(current, true); } } catch (e) { SC.fail(e); }
      } else if (params.get('paid') === '0') SC.toast(t('t_pay_cancelled'), 'error');
    }
  })();
})();
