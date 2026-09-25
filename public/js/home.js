(function () {
  'use strict';
  const { $, esc } = SC;
  SC.addDict({
    ar: {
      h_badge: 'استلام وتوصيل داخل الإمارات السبع',
      h_title1: 'شحنتك تتحرك',
      h_title2: 'من بابك لباب المستلم',
      h_lead: 'اطلب شحنتك أونلاين في دقيقة، واعرف السعر فورًا حسب المسافة والإمارة، وتابع المندوب على الخريطة لحظة بلحظة حتى التسليم.',
      h_how: 'كيف تعمل الخدمة؟',
      h_track_ph: 'رقم الشحنة (SC…) أو رقم الهاتف',
      f_title: 'لماذا SEVENCARGO؟', f_sub: 'كل ما تحتاجه لشحن آمن وسريع في مكان واحد',
      f1_t: 'تحديد موقعك تلقائيًا', f1_d: 'نحدد موقع الاستلام من هاتفك مباشرة، ويمكنك تعديله على الخريطة بدقة.',
      f2_t: 'سعر فوري وشفاف', f2_d: 'السعر يُحسب تلقائيًا حسب المسافة والإمارة والوزن قبل تأكيد الطلب.',
      f3_t: 'تتبع مباشر للمندوب', f3_d: 'شاهد موقع المندوب على الخريطة وهو في الطريق إليك وإلى المستلم.',
      f4_t: 'دفع مرن', f4_d: 'ادفع أونلاين بالبطاقة، أو كاش عند الاستلام من المرسل، أو عند التسليم من المستلم.',
      f5_t: 'محادثة مباشرة', f5_d: 'تواصل مع الإدارة والمندوب من صفحة الشحنة مباشرة.',
      f6_t: 'تسليم آمن بكود', f6_d: 'لا يتم التسليم إلا بكود سري يعطيه المستلم للمندوب، مع صورة إثبات التسليم.',
      how_title: 'أربع خطوات فقط',
      s1_t: 'أنشئ الطلب', s1_d: 'حدد موقع الاستلام والتسليم وارفع صورة الشحنة وبياناتها.',
      s2_t: 'اعرف السعر وادفع', s2_d: 'يظهر السعر فورًا. ادفع أونلاين أو اختر الدفع كاش.',
      s3_t: 'المندوب يستلم', s3_d: 'نعيّن مندوب إمارتك، ويصلك إلى موقعك لاستلام الشحنة.',
      s4_t: 'التسليم والتقييم', s4_d: 'يسلّم المندوب الشحنة بالكود، ثم تقيّم الخدمة.',
      cov_title: 'نغطي الإمارات السبع', cov_sub: 'مندوبون مخصصون لكل إمارة وخطوط سير محددة',
      pro_title: 'المواد الممنوعة من الشحن', pro_sub: 'حفاظًا على سلامة الجميع ووفقًا لقوانين الدولة، لا نقبل شحن ما يلي:',
      cta_title: 'جاهز ترسل شحنتك؟', cta_sub: 'اطلب الآن أو تواصل معنا على واتساب لأي استفسار.',
    },
    en: {
      h_badge: 'Pickup & delivery across the 7 Emirates',
      h_title1: 'Your parcel, on the move',
      h_title2: 'from your door to theirs',
      h_lead: 'Book a shipment online in a minute, get an instant price based on distance and emirate, and follow your courier live on the map until delivery.',
      h_how: 'How it works',
      h_track_ph: 'Tracking number (SC…) or phone number',
      f_title: 'Why SEVENCARGO?', f_sub: 'Everything you need for safe, fast delivery in one place',
      f1_t: 'Automatic location', f1_d: 'We pick up your location straight from your phone — fine-tune it on the map.',
      f2_t: 'Instant, transparent price', f2_d: 'Price is calculated automatically from distance, emirate and weight before you confirm.',
      f3_t: 'Live courier tracking', f3_d: 'See your courier on the map on the way to you and to the receiver.',
      f4_t: 'Flexible payment', f4_d: 'Pay online by card, or cash by the sender at pickup or by the receiver on delivery.',
      f5_t: 'Live chat', f5_d: 'Talk to operations and your courier right from the shipment page.',
      f6_t: 'Code-secured delivery', f6_d: 'Delivery only happens with a secret code from the receiver, plus a proof-of-delivery photo.',
      how_title: 'Just four steps',
      s1_t: 'Create the order', s1_d: 'Set pickup and delivery points, upload a parcel photo and details.',
      s2_t: 'See the price & pay', s2_d: 'The price shows instantly. Pay online or choose cash.',
      s3_t: 'Courier picks up', s3_d: 'We assign a courier for your emirate who comes to your location.',
      s4_t: 'Delivery & rating', s4_d: 'The courier delivers using the code, then you rate the service.',
      cov_title: 'Covering all 7 Emirates', cov_sub: 'Dedicated couriers and routes for each emirate',
      pro_title: 'Prohibited items', pro_sub: 'For everyone\'s safety and in line with UAE law, we do not ship:',
      cta_title: 'Ready to send?', cta_sub: 'Book now or message us on WhatsApp with any question.',
    },
  });

  let cfg = null;
  function renderDynamic() {
    const em = $('#emirates');
    em.innerHTML = Object.keys(SC.EMIRATES).map((c) => {
      const on = !cfg || !cfg.emirates[c] || cfg.emirates[c].active;
      return `<span class="pill ${on ? 'ok' : ''}" style="font-size:.95rem;padding:8px 16px">${esc(SC.em(c))}</span>`;
    }).join('');
    if (cfg) {
      $('#prohibited-list').innerHTML = cfg.prohibited.map((p) => `<li>${esc(p[SC.lang] || p.en)}</li>`).join('');
    }
    $('#cta-wa').href = SC.waLink(SC.contact.whatsapp, SC.lang === 'ar' ? 'مرحبًا SEVENCARGO، عندي استفسار عن الشحن' : 'Hello SEVENCARGO, I have a shipping question');
  }

  SC.renderChrome('home');
  SC.onLang(renderDynamic);
  SC.initLang();
  SC.reveal();

  $('#track-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#track-input').value.trim();
    if (!v) return;
    const isNo = /^sc\d{8}$/i.test(v.replace(/\s/g, ''));
    location.href = '/track?' + (isNo ? 'no=' + encodeURIComponent(v.replace(/\s/g, '').toUpperCase()) : 'phone=' + encodeURIComponent(v));
  });

  SC.loadConfig().then((c) => { cfg = c; SC.renderChrome('home'); SC.setLang(SC.lang); }).catch(() => renderDynamic());
})();
