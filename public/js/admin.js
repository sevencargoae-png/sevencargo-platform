(function () {
  'use strict';
  const { $, $$, esc, t, api } = SC;

  SC.addDict({
    ar: {
      a_login_title: 'دخول لوحة الإدارة', a_login_sub: 'خاص بموظفي عمليات SEVENCARGO', a_username: 'اسم المستخدم',
      a_notifications: 'الإشعارات', a_mark_read: 'تعليم الكل كمقروء', a_no_notif: 'لا توجد إشعارات',
      n_dashboard: 'نظرة عامة', n_orders: 'الطلبات', n_live: 'الخريطة المباشرة', n_drivers: 'المندوبون', n_chat: 'محادثات المندوبين',
      n_complaints: 'الشكاوى والبلاغات', n_ratings: 'التقييمات', n_cash: 'النقدية المحصلة', n_settings: 'الأسعار والإعدادات', n_staff: 'الموظفون', n_account: 'حسابي',
      s_pending: 'بانتظار التعيين', s_assigned: 'بانتظار قبول المندوب', s_progress: 'قيد التوصيل', s_delivered_today: 'تم تسليمها اليوم',
      s_on_duty: 'مندوبون حاضرون', s_open_complaints: 'شكاوى مفتوحة', s_rating: 'متوسط التقييم', s_cash: 'نقدية لدى المندوبين', s_revenue: 'إيراد الشهر (مسلّم)', s_flagged: 'طلبات عليها تنبيه',
      s_last24: 'طلبات آخر 24 ساعة', s_by_emirate: 'الطلبات حسب الإمارة (30 يوم)',
      d_recent_pending: 'طلبات تحتاج تعيين مندوب', d_on_duty: 'المندوبون الحاضرون الآن',
      f_active: 'النشطة', f_flagged: '⚠ تنبيهات', f_all: 'الكل', f_search_ph: 'بحث برقم الشحنة، الهاتف، الاسم…', f_all_emirates: 'كل الإمارات',
      c_no: 'رقم الشحنة', c_status: 'الحالة', c_route: 'المسار', c_sender: 'المرسل', c_receiver: 'المستلم', c_driver: 'المندوب', c_amount: 'المبلغ', c_payment: 'الدفع', c_date: 'التاريخ',
      c_name: 'الاسم', c_phone: 'الهاتف', c_emirate: 'الإمارة', c_duty: 'الحضور', c_active_orders: 'طلبات نشطة', c_delivered: 'مسلّمة', c_rating: 'التقييم', c_cash_due: 'نقدية مستحقة',
      duty_available: 'حاضر وجاهز', duty_off: 'غير حاضر', inactive: 'موقوف', no_data: 'لا توجد بيانات',
      o_detail: 'تفاصيل الطلب', o_assign: 'تعيين مندوب', o_assign_btn: 'تعيين', o_reassign: 'إعادة تعيين', o_show_all_drivers: 'إظهار كل المندوبين', o_no_drivers: 'لا يوجد مندوبون حاضرون في هذه الإمارة',
      o_distance_from: '{km} كم من الاستلام', o_change_status: 'تغيير الحالة (صلاحية إدارية)', o_apply: 'تطبيق', o_note: 'ملاحظة / سبب',
      o_mark_paid: 'تسجيل كمدفوع', o_mark_paid_q: 'سبب تسجيل الدفع يدويًا', o_notes: 'ملاحظات داخلية', o_save_notes: 'حفظ الملاحظات', o_needs_loc: 'ينقصه لوكيشن', o_missing: 'ينقص هذا الطلب', o_m_pickup: 'لوكيشن الاستلام', o_m_dropoff: 'لوكيشن التسليم', o_m_price: 'السعر', o_ask_wa: 'اطلبه من العميل على واتساب', wa_ask_loc: 'مرحبًا، معك SEVENCARGO بخصوص شحنتك رقم {no}. من فضلك أرسل لنا لوكيشن الاستلام ولوكيشن المستلم هنا على واتساب.', o_no_pin: 'بدون لوكيشن', o_edit_details: 'إكمال / تعديل بيانات الطلب', o_emirate_l: 'الإمارة', o_area_l: 'المنطقة', o_addr_l: 'العنوان', o_loc_l: 'اللوكيشن (رابط خرائط جوجل أو إحداثيات)', o_loc_ph: 'https://maps.app.goo.gl/… أو 25.2,55.3', o_sname_l: 'اسم المرسل', o_rname_l: 'اسم المستلم', o_rphone_l: 'هاتف المستلم', o_price_l: 'السعر النهائي (درهم) — اتركه فارغًا لعدم التغيير', o_unflag: 'تمت المراجعة — إزالة التنبيه',
      o_flag_banner: '⚠ هذا الطلب عليه تنبيه (استلام/تسليم خارج النطاق أو كود خاطئ متكرر). راجع السجل.',
      o_wa_sender: 'واتساب المرسل', o_wa_receiver: 'واتساب المستلم', o_photos: 'الصور', o_parcel_photo: 'صورة الشحنة', o_pickup_photo: 'صورة الاستلام', o_delivery_photo: 'صورة التسليم',
      o_log: 'سجل العمليات', o_parcel: 'الشحنة', o_declared: 'القيمة المعلنة', o_code: 'كود التسليم', o_force_q: 'المندوب غير حاضر أو من إمارة أخرى. تعيين على أي حال؟',
      o_assigned_ok: 'تم تعيين المندوب', o_status_ok: 'تم تحديث الحالة', o_breakdown: 'تفصيل السعر',
      wa_status_msg: 'مرحبًا {name}، تحديث شحنتك {no} من SEVENCARGO: {status}.\nتتبع الشحنة: {url}',
      dr_add: 'إضافة مندوب', dr_edit: 'بيانات المندوب', dr_route: 'خط السير / المناطق', dr_route_ph: 'مثال: ديرة، القصيص، النهدة…', dr_vehicle: 'نوع المركبة', dr_plate: 'رقم اللوحة',
      dr_license: 'رقم الرخصة', dr_notes: 'ملاحظات', dr_password: 'كلمة المرور', dr_password_hint: 'اتركها فارغة لتوليد كلمة مرور تلقائيًا', dr_created: 'تم إنشاء حساب المندوب',
      dr_cred: 'بيانات دخول المندوب (انسخها الآن، لن تظهر مجددًا):', dr_login_url: 'رابط الدخول', dr_reset_pw: 'إعادة تعيين كلمة المرور', dr_set_on: 'تسجيل حضور', dr_set_off: 'تسجيل انصراف',
      dr_deactivate: 'إيقاف الحساب', dr_activate: 'تفعيل الحساب', dr_attendance: 'سجل الحضور', dr_in: 'حضور', dr_out: 'انصراف', dr_by_admin: 'بواسطة الإدارة', dr_last_loc: 'آخر موقع',
      dr_send_cred: 'إرسال البيانات للمندوب واتساب', dr_cred_msg: 'مرحبًا {name}، بيانات دخولك لبوابة مندوبي SEVENCARGO:\nالرابط: {url}\nالهاتف: {phone}\nكلمة المرور: {pw}',
      ch_select: 'اختر مندوبًا لبدء المحادثة', cm_customer: 'شكاوى العملاء', cm_driver: 'بلاغات المندوبين', cm_status_open: 'مفتوحة', cm_status_in_progress: 'قيد المعالجة', cm_status_resolved: 'تم الحل',
      cm_reply: 'رد / إجراء متخذ', cm_update: 'تحديث', cm_cat: 'النوع', cm_location: 'الموقع على الخريطة',
      cc_delay: 'تأخير', cc_damage: 'تلف', cc_lost: 'فقدان', cc_driver: 'سلوك المندوب', cc_payment: 'الدفع', cc_other: 'أخرى',
      ic_accident: 'حادث', ic_vehicle: 'عطل مركبة', ic_customer: 'مشكلة مع عميل', ic_address: 'عنوان غير صحيح', ic_damage: 'تلف شحنة', ic_emergency: 'ظرف طارئ', ic_other: 'أخرى',
      cash_settle: 'تسوية (استلام النقدية)', cash_settle_q: 'تأكيد استلام {amount} من {name}؟', cash_settled: 'تمت التسوية', cash_none: 'لا توجد نقدية معلقة',
      set_pricing: 'التسعير (بالدرهم)', set_base: 'السعر الأساسي', set_active: 'مفعّلة', set_included_km: 'كم مشمولة في السعر الأساسي', set_per_km: 'سعر الكيلومتر الإضافي',
      set_included_kg: 'كجم مشمولة', set_per_kg: 'سعر الكيلو الإضافي', set_inter: 'رسوم بين الإمارات', set_cod: 'رسوم الدفع عند الاستلام', set_vat: 'ضريبة القيمة المضافة %',
      set_vol: 'معامل الوزن الحجمي (سم³/كجم)', set_min: 'أقل سعر للشحنة', set_limits: 'الحدود والأمان', set_max_w: 'أقصى وزن (كجم)', set_max_d: 'أقصى بُعد (سم)',
      set_geofence: 'نطاق التحقق من الموقع (متر)', set_req_photo: 'إلزام صورة عند التسليم', set_contact: 'التواصل', set_wa: 'رقم واتساب (بالصيغة الدولية)', set_wa_disp: 'طريقة عرض الرقم',
      set_email: 'البريد الإلكتروني', set_prohibited: 'قائمة المواد الممنوعة', set_prohibited_hint: 'سطر لكل مادة بالصيغة: العربي | English', set_saved: 'تم حفظ الإعدادات',
      set_preview: 'مثال: دبي → الشارقة، 28 كم، 7 كجم = {p}',
      st_users: 'حسابات الموظفين', st_add: 'إضافة موظف', st_role_admin: 'مدير (كل الصلاحيات)', st_role_staff: 'موظف عمليات', st_role: 'الصلاحية', st_active: 'فعّال', stf_created: 'تم إنشاء الحساب — كلمة المرور: {pw}',
      acc_change_pw: 'تغيير كلمة المرور', acc_current: 'كلمة المرور الحالية', acc_new: 'كلمة المرور الجديدة (8 أحرف على الأقل)', acc_changed: 'تم تغيير كلمة المرور، سجّل الدخول مجددًا',
      r_avg: 'المتوسط', r_count: 'عدد التقييمات', enable_notif: 'تفعيل إشعارات سطح المكتب',
    },
    en: {
      a_login_title: 'Admin sign in', a_login_sub: 'SEVENCARGO operations staff only', a_username: 'Username',
      a_notifications: 'Notifications', a_mark_read: 'Mark all read', a_no_notif: 'No notifications',
      n_dashboard: 'Overview', n_orders: 'Orders', n_live: 'Live map', n_drivers: 'Couriers', n_chat: 'Courier chats',
      n_complaints: 'Complaints & reports', n_ratings: 'Ratings', n_cash: 'Collected cash', n_settings: 'Pricing & settings', n_staff: 'Staff', n_account: 'My account',
      s_pending: 'Awaiting assignment', s_assigned: 'Awaiting courier', s_progress: 'In delivery', s_delivered_today: 'Delivered today',
      s_on_duty: 'Couriers on duty', s_open_complaints: 'Open complaints', s_rating: 'Average rating', s_cash: 'Cash held by couriers', s_revenue: 'Revenue this month (delivered)', s_flagged: 'Flagged orders',
      s_last24: 'Orders last 24h', s_by_emirate: 'Orders by emirate (30 days)',
      d_recent_pending: 'Orders needing a courier', d_on_duty: 'Couriers on duty now',
      f_active: 'Active', f_flagged: '⚠ Flagged', f_all: 'All', f_search_ph: 'Search tracking no, phone, name…', f_all_emirates: 'All emirates',
      c_no: 'Tracking no.', c_status: 'Status', c_route: 'Route', c_sender: 'Sender', c_receiver: 'Receiver', c_driver: 'Courier', c_amount: 'Amount', c_payment: 'Payment', c_date: 'Date',
      c_name: 'Name', c_phone: 'Phone', c_emirate: 'Emirate', c_duty: 'Duty', c_active_orders: 'Active orders', c_delivered: 'Delivered', c_rating: 'Rating', c_cash_due: 'Cash due',
      duty_available: 'On duty', duty_off: 'Off duty', inactive: 'Suspended', no_data: 'No data',
      o_detail: 'Order details', o_assign: 'Assign courier', o_assign_btn: 'Assign', o_reassign: 'Reassign', o_show_all_drivers: 'Show all couriers', o_no_drivers: 'No couriers on duty in this emirate',
      o_distance_from: '{km} km from pickup', o_change_status: 'Change status (admin override)', o_apply: 'Apply', o_note: 'Note / reason',
      o_mark_paid: 'Mark as paid', o_mark_paid_q: 'Reason for manual payment', o_notes: 'Internal notes', o_save_notes: 'Save notes', o_needs_loc: 'Missing location', o_missing: 'This order is missing', o_m_pickup: 'pickup location', o_m_dropoff: 'delivery location', o_m_price: 'price', o_ask_wa: 'ask the customer on WhatsApp', wa_ask_loc: 'Hello, this is SEVENCARGO about your shipment {no}. Please send us the pickup location and the receiver location here on WhatsApp.', o_no_pin: 'no pin', o_edit_details: 'Complete / edit order details', o_emirate_l: 'Emirate', o_area_l: 'Area', o_addr_l: 'Address', o_loc_l: 'Location (Google Maps link or coordinates)', o_loc_ph: 'https://maps.app.goo.gl/… or 25.2,55.3', o_sname_l: 'Sender name', o_rname_l: 'Receiver name', o_rphone_l: 'Receiver phone', o_price_l: 'Final price (AED) — leave empty to keep', o_unflag: 'Reviewed — clear flag',
      o_flag_banner: '⚠ This order is flagged (pickup/delivery outside zone or repeated wrong code). Check the log.',
      o_wa_sender: 'WhatsApp sender', o_wa_receiver: 'WhatsApp receiver', o_photos: 'Photos', o_parcel_photo: 'Parcel photo', o_pickup_photo: 'Pickup photo', o_delivery_photo: 'Delivery photo',
      o_log: 'Activity log', o_parcel: 'Parcel', o_declared: 'Declared value', o_code: 'Delivery code', o_force_q: 'Courier is off duty or from another emirate. Assign anyway?',
      o_assigned_ok: 'Courier assigned', o_status_ok: 'Status updated', o_breakdown: 'Price breakdown',
      wa_status_msg: 'Hello {name}, update on your SEVENCARGO shipment {no}: {status}.\nTrack: {url}',
      dr_add: 'Add courier', dr_edit: 'Courier details', dr_route: 'Route / areas', dr_route_ph: 'e.g. Deira, Al Qusais, Al Nahda…', dr_vehicle: 'Vehicle type', dr_plate: 'Plate number',
      dr_license: 'Licence no.', dr_notes: 'Notes', dr_password: 'Password', dr_password_hint: 'Leave empty to auto-generate', dr_created: 'Courier account created',
      dr_cred: 'Courier sign-in details (copy now, they will not be shown again):', dr_login_url: 'Sign-in link', dr_reset_pw: 'Reset password', dr_set_on: 'Check in', dr_set_off: 'Check out',
      dr_deactivate: 'Suspend account', dr_activate: 'Activate account', dr_attendance: 'Attendance', dr_in: 'In', dr_out: 'Out', dr_by_admin: 'by admin', dr_last_loc: 'Last location',
      dr_send_cred: 'Send details to courier on WhatsApp', dr_cred_msg: 'Hi {name}, your SEVENCARGO courier portal sign-in:\nLink: {url}\nPhone: {phone}\nPassword: {pw}',
      ch_select: 'Pick a courier to start chatting', cm_customer: 'Customer complaints', cm_driver: 'Courier reports', cm_status_open: 'Open', cm_status_in_progress: 'In progress', cm_status_resolved: 'Resolved',
      cm_reply: 'Reply / action taken', cm_update: 'Update', cm_cat: 'Type', cm_location: 'Location on map',
      cc_delay: 'Delay', cc_damage: 'Damage', cc_lost: 'Lost', cc_driver: 'Courier behaviour', cc_payment: 'Payment', cc_other: 'Other',
      ic_accident: 'Accident', ic_vehicle: 'Vehicle breakdown', ic_customer: 'Customer issue', ic_address: 'Wrong address', ic_damage: 'Parcel damage', ic_emergency: 'Emergency', ic_other: 'Other',
      cash_settle: 'Settle (cash received)', cash_settle_q: 'Confirm receiving {amount} from {name}?', cash_settled: 'Settled', cash_none: 'No pending cash',
      set_pricing: 'Pricing (AED)', set_base: 'Base price', set_active: 'Enabled', set_included_km: 'Km included in base', set_per_km: 'Price per extra km',
      set_included_kg: 'Kg included', set_per_kg: 'Price per extra kg', set_inter: 'Inter-emirate fee', set_cod: 'Cash on delivery fee', set_vat: 'VAT %',
      set_vol: 'Volumetric divisor (cm³/kg)', set_min: 'Minimum price', set_limits: 'Limits & security', set_max_w: 'Max weight (kg)', set_max_d: 'Max dimension (cm)',
      set_geofence: 'Location check radius (m)', set_req_photo: 'Require photo on delivery', set_contact: 'Contact', set_wa: 'WhatsApp number (international)', set_wa_disp: 'Display format',
      set_email: 'Email', set_prohibited: 'Prohibited items', set_prohibited_hint: 'One item per line: Arabic | English', set_saved: 'Settings saved',
      set_preview: 'Example: Dubai → Sharjah, 28 km, 7 kg = {p}',
      st_users: 'Staff accounts', st_add: 'Add staff', st_role_admin: 'Admin (full access)', st_role_staff: 'Operations staff', st_role: 'Role', st_active: 'Active', stf_created: 'Account created — password: {pw}',
      acc_change_pw: 'Change password', acc_current: 'Current password', acc_new: 'New password (min 8 chars)', acc_changed: 'Password changed, please sign in again',
      r_avg: 'Average', r_count: 'Ratings', enable_notif: 'Enable desktop notifications',
    },
  });

  const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
    orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3z"/><path d="M9 7v13M15 4v13"/></svg>',
    drivers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    complaints: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    ratings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    staff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  };

  let me = null; let socket = null; let pageName = 'dashboard'; let pageCleanup = null;
  const state = { orderFilter: 'active', orderQ: '', orderEm: '', chatDriver: null, cmSource: 'customer', unread: 0 };
  let openOrderModal = null; // { id, reload, chat, map, driverMarker }
  let liveMap = null; const liveMarkers = {};

  // ---------------- boot ----------------
  SC.initLang();
  SC.onLang(() => { if (me) { renderNav(); go(pageName, true); } });

  async function boot() {
    try { me = await api('/api/admin/me'); } catch { me = null; }
    if (!me) { showLogin(); return; }
    $('#login-view').classList.add('hidden');
    $('#app-view').classList.remove('hidden');
    $('#me-box').innerHTML = `${esc(me.name)}<br><span class="ltr">@${esc(me.username)}</span> · ${esc(me.role === 'admin' ? t('st_role_admin') : t('st_role_staff'))}`;
    renderNav();
    connectSocket();
    loadNotifications();
    const h = location.hash.replace('#', '');
    go(h || 'dashboard');
    SC.loadConfig().catch(() => {});
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => SC.toast(t('enable_notif'), 'info'), 1500);
      document.addEventListener('click', function once() { Notification.requestPermission().catch(() => {}); document.removeEventListener('click', once); });
    }
  }
  function showLogin() {
    $('#app-view').classList.add('hidden');
    $('#login-view').classList.remove('hidden');
    SC.applyI18n();
  }
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); $('#l-err').textContent = '';
    const btn = e.target.querySelector('button[type=submit]'); btn.disabled = true;
    try { await api('/api/admin/login', { body: { username: $('#l-user').value.trim(), password: $('#l-pass').value } }); $('#l-pass').value = ''; boot(); }
    catch (err) { $('#l-err').textContent = err.message; } finally { btn.disabled = false; }
  });
  $('#logout').addEventListener('click', async () => { try { await api('/api/admin/logout', { body: {} }); } catch { /* */ } if (socket) socket.disconnect(); me = null; showLogin(); });

  // global 401 handling
  const origFail = SC.fail;
  SC.fail = (e) => { if (e && e.status === 401) { me = null; showLogin(); } origFail(e); };

  // ---------------- nav ----------------
  const NAV = () => ['dashboard', 'orders', 'live', 'drivers', 'chat', 'complaints', 'ratings', 'cash', 'settings', ...(me && me.role === 'admin' ? ['staff'] : []), 'account'];
  function renderNav() {
    $('#side-nav').innerHTML = NAV().map((n) => `<a href="#${n}" data-nav="${n}" class="${n === pageName ? 'active' : ''}">${ICONS[n]}<span>${t('n_' + n)}</span>${n === 'orders' ? '<span class="badge hidden" id="badge-orders"></span>' : ''}${n === 'complaints' ? '<span class="badge hidden" id="badge-complaints"></span>' : ''}</a>`).join('');
    refreshBadges();
  }
  $('#side-nav').addEventListener('click', (e) => { const a = e.target.closest('[data-nav]'); if (!a) return; e.preventDefault(); go(a.dataset.nav); closeSidebar(); });
  $('#menu-toggle').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#side-back').classList.add('open'); });
  $('#side-back').addEventListener('click', closeSidebar);
  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#side-back').classList.remove('open'); }
  window.addEventListener('hashchange', () => { const h = location.hash.replace('#', ''); if (h && h !== pageName && NAV().includes(h)) go(h); });

  async function refreshBadges() {
    try {
      const s = await api('/api/admin/stats');
      const b1 = $('#badge-orders'); if (b1) { b1.textContent = s.orders.pending; b1.classList.toggle('hidden', !s.orders.pending); }
      const b2 = $('#badge-complaints'); if (b2) { b2.textContent = s.complaints.open; b2.classList.toggle('hidden', !s.complaints.open); }
    } catch { /* ignore */ }
  }

  const PAGES = {};
  function go(name, keep) {
    if (!NAV().includes(name)) name = 'dashboard';
    if (pageCleanup) { try { pageCleanup(); } catch { /* */ } pageCleanup = null; }
    pageName = name;
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    $$('#side-nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === name));
    $('#page-title').textContent = t('n_' + name);
    const el = $('#page');
    if (!keep) el.innerHTML = `<div class="empty">${t('loading')}</div>`;
    PAGES[name](el).catch((e) => { el.innerHTML = `<div class="empty">${esc(e.message)}</div>`; SC.fail(e); });
  }
  const reloadPage = debounce(() => { if (me) go(pageName, true); }, 400);
  function debounce(fn, ms) { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), ms); }; }

  // ---------------- realtime ----------------
  function connectSocket() {
    if (socket) socket.disconnect();
    socket = io({ auth: { role: 'admin' } });
    socket.on('notify', (n) => {
      state.unread++; updateBell();
      prependNotif(n);
      SC.beep(); SC.toast(n.body || '', ['flag', 'emergency'].includes(n.type) ? 'error' : 'info', n.title);
      SC.desktopNotify(n.title, n.body);
      refreshBadges();
    });
    socket.on('order-changed', (p) => {
      if (openOrderModal && openOrderModal.id === p.id) openOrderModal.reload();
      if (['dashboard', 'orders', 'live', 'cash'].includes(pageName)) reloadPage();
      refreshBadges();
    });
    socket.on('drivers-changed', () => { if (['dashboard', 'drivers', 'live'].includes(pageName)) reloadPage(); });
    socket.on('driver-loc', (p) => {
      if (liveMap && liveMarkers[p.driver_id]) liveMarkers[p.driver_id].setLatLng([p.lat, p.lng]);
      else if (liveMap && pageName === 'live') reloadPage();
      if (openOrderModal && openOrderModal.driverId === p.driver_id && openOrderModal.map) {
        if (openOrderModal.driverMarker) openOrderModal.driverMarker.setLatLng([p.lat, p.lng]);
        else openOrderModal.driverMarker = L.marker([p.lat, p.lng], { icon: SC.carIcon() }).addTo(openOrderModal.map);
      }
    });
    socket.on('chat', (m) => {
      if (m.order_id && openOrderModal && openOrderModal.id === m.order_id && openOrderModal.chat) openOrderModal.chat.add(m);
      if (!m.order_id && pageName === 'chat') {
        if (state.chatWidget && state.chatDriver === m.driver_id) state.chatWidget.add(m);
        loadChatList();
      }
    });
    socket.on('connect', () => { if (openOrderModal) socket.emit('join-order', openOrderModal.id); });
  }

  // ---------------- notifications ----------------
  function updateBell() { const c = $('#bell-count'); c.textContent = state.unread > 99 ? '99+' : state.unread; c.classList.toggle('hidden', !state.unread); }
  function notifHtml(n) { return `<div class="notif ${n.read ? '' : 'unread'}" data-order="${n.order_id || ''}"><b>${esc(n.title)}</b><div>${esc(n.body)}</div><div class="d">${SC.date(n.created_at)}</div></div>`; }
  function prependNotif(n) { const l = $('#notif-list'); const e = l.querySelector('.empty'); if (e) e.remove(); l.insertAdjacentHTML('afterbegin', notifHtml(n)); }
  async function loadNotifications() {
    try {
      const r = await api('/api/admin/notifications');
      state.unread = r.unread; updateBell();
      $('#notif-list').innerHTML = r.items.length ? r.items.map(notifHtml).join('') : `<div class="empty small">${t('a_no_notif')}</div>`;
    } catch { /* */ }
  }
  const bellDd = $('#bell-dd');
  $('#bell').addEventListener('click', (e) => { e.stopPropagation(); bellDd.classList.toggle('open'); });
  document.addEventListener('click', (e) => { if (!bellDd.contains(e.target)) bellDd.classList.remove('open'); });
  $('#notif-read').addEventListener('click', async () => { try { await api('/api/admin/notifications/read', { body: {} }); state.unread = 0; updateBell(); $$('.notif.unread').forEach((n) => n.classList.remove('unread')); } catch (e) { SC.fail(e); } });
  $('#notif-list').addEventListener('click', (e) => { const n = e.target.closest('.notif'); if (n && n.dataset.order) { bellDd.classList.remove('open'); orderModal(Number(n.dataset.order)); } });

  // ---------------- helpers ----------------
  const table = (heads, rows, empty) => rows.length
    ? `<div class="table-wrap"><table><thead><tr>${heads.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`
    : `<div class="card flat empty">${empty || t('no_data')}</div>`;
  const dutyPill = (d) => !d.active ? `<span class="pill bad">${t('inactive')}</span>` : d.duty_status === 'available' ? `<span class="pill ok"><span class="dot"></span>${t('duty_available')}</span>` : `<span class="pill"><span class="dot" style="color:var(--muted)"></span>${t('duty_off')}</span>`;
  const orderRow = (o) => `<tr class="click" data-order="${o.id}"><td class="ltr"><b>${esc(o.tracking_no)}</b>${o.flagged ? ' ⚠' : ''}${o.needs_location && !['delivered', 'cancelled'].includes(o.status) ? ` <span title="${esc(t('o_needs_loc'))}">📍</span>` : ''}</td><td>${SC.status(o.status)}</td>
      <td>${esc(SC.em(o.pickup_emirate))} ← ${esc(SC.em(o.dropoff_emirate))}</td><td>${esc(o.sender_name || '—')}<div class="small muted"><span class="ltr">${SC.phoneFmt(o.sender_phone)}</span></div></td>
      <td>${esc(o.receiver_name || '—')}<div class="small muted"><span class="ltr">${SC.phoneFmt(o.receiver_phone)}</span></div></td><td>${esc(o.driver_name || '—')}</td>
      <td>${SC.price(o)}<div class="small ${o.payment_status === 'paid' ? '' : 'muted'}">${esc(t('ps_' + o.payment_status))}</div></td><td class="small">${SC.date(o.created_at)}</td></tr>`;
  const orderHeads = () => [t('c_no'), t('c_status'), t('c_route'), t('c_sender'), t('c_receiver'), t('c_driver'), t('c_amount'), t('c_date')];
  document.addEventListener('click', (e) => { const r = e.target.closest('tr[data-order]'); if (r && !e.target.closest('button,a')) orderModal(Number(r.dataset.order)); });

  // ---------------- dashboard ----------------
  PAGES.dashboard = async (el) => {
    const [s, pend, drivers] = await Promise.all([api('/api/admin/stats'), api('/api/admin/orders?status=pending&limit=10'), api('/api/admin/drivers')]);
    const onDuty = drivers.filter((d) => d.active && d.duty_status === 'available');
    const stat = (v, l, cls = '') => `<div class="card stat ${cls}"><div class="v">${v}</div><div class="l">${l}</div></div>`;
    const maxE = Math.max(1, ...s.by_emirate.map((x) => x.n));
    el.innerHTML = `
      <div class="grid g4 stats" style="margin-bottom:16px">
        ${stat(s.orders.pending, t('s_pending'), s.orders.pending ? 'gold' : '')}
        ${stat(s.orders.assigned, t('s_assigned'))}
        ${stat(s.orders.in_progress, t('s_progress'), 'accent')}
        ${stat(s.orders.delivered_today, t('s_delivered_today'), 'accent')}
        ${stat(`${s.drivers.on_duty}/${s.drivers.total}`, t('s_on_duty'))}
        ${stat(s.complaints.open, t('s_open_complaints'), s.complaints.open ? 'danger' : '')}
        ${stat(SC.money(s.cash.unsettled), t('s_cash'), 'gold')}
        ${stat(SC.money(s.orders.revenue_month), t('s_revenue'))}
        ${stat(s.ratings.avg ? s.ratings.avg + ' ★' : '—', t('s_rating'))}
        ${stat(s.orders.last24, t('s_last24'))}
        ${stat(s.orders.flagged, t('s_flagged'), s.orders.flagged ? 'danger' : '')}
      </div>
      <div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:16px" id="dash-grid">
        <div class="card"><h3>${t('d_recent_pending')}</h3>${table(orderHeads(), pend.orders.map(orderRow))}</div>
        <div>
          <div class="card" style="margin-bottom:16px"><h3>${t('d_on_duty')}</h3>${onDuty.length ? onDuty.map((d) => `<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><b>${esc(d.name)}</b><span class="spacer"></span><span class="small muted">${esc(SC.em(d.emirate))} · ${d.active_orders}</span></div>`).join('') : `<div class="muted small">${t('no_data')}</div>`}</div>
          <div class="card"><h3>${t('s_by_emirate')}</h3>${s.by_emirate.length ? s.by_emirate.map((x) => `<div style="margin:8px 0"><div class="row small"><span>${esc(SC.em(x.emirate))}</span><span class="spacer"></span><b>${x.n}</b></div><div style="height:6px;border-radius:6px;background:rgba(255,255,255,.06)"><div style="height:6px;border-radius:6px;background:var(--grad);width:${(x.n / maxE) * 100}%"></div></div></div>`).join('') : `<div class="muted small">${t('no_data')}</div>`}</div>
        </div>
      </div>`;
    if (window.innerWidth < 960) $('#dash-grid').style.gridTemplateColumns = '1fr';
  };

  // ---------------- orders ----------------
  PAGES.orders = async (el) => {
    const F = ['active', 'pending', 'assigned', 'accepted', 'picked_up', 'delivered', 'failed', 'cancelled', 'awaiting_payment', 'flagged', ''];
    const qs = new URLSearchParams({ status: state.orderFilter, q: state.orderQ, emirate: state.orderEm, limit: 100 });
    const r = await api('/api/admin/orders?' + qs);
    el.innerHTML = `
      <div class="tabs">${F.map((f) => `<button data-f="${f}" class="${state.orderFilter === f ? 'active' : ''}">${f === 'active' ? t('f_active') : f === 'flagged' ? t('f_flagged') : f === '' ? t('f_all') : t('st_' + f)}</button>`).join('')}</div>
      <div class="filters"><input id="o-q" value="${esc(state.orderQ)}" placeholder="${t('f_search_ph')}"><select id="o-em"><option value="">${t('f_all_emirates')}</option>${Object.keys(SC.EMIRATES).map((c) => `<option value="${c}" ${state.orderEm === c ? 'selected' : ''}>${esc(SC.em(c))}</option>`).join('')}</select></div>
      <div class="small muted" style="margin-bottom:8px">${r.total}</div>
      ${table(orderHeads(), r.orders.map(orderRow))}`;
    el.querySelectorAll('[data-f]').forEach((b) => b.onclick = () => { state.orderFilter = b.dataset.f; go('orders', true); });
    const qi = $('#o-q'); qi.addEventListener('input', debounce(() => { state.orderQ = qi.value.trim(); go('orders', true); }, 450));
    $('#o-em').onchange = (e) => { state.orderEm = e.target.value; go('orders', true); };
    if (state.orderQ) { qi.focus(); qi.setSelectionRange(qi.value.length, qi.value.length); }
  };

  async function orderModal(id) {
    let drivers = null; let showAll = false;
    const m = SC.modal(`<div class="modal-head"><h3>${t('o_detail')}</h3><button class="btn btn-ghost btn-sm" data-close>${t('close')}</button></div><div id="om-body"><div class="empty">${t('loading')}</div></div>`, {
      wide: true,
      onClose: () => { if (socket) socket.emit('leave-order', id); if (openOrderModal && openOrderModal.map) openOrderModal.map.remove(); openOrderModal = null; },
    });
    openOrderModal = { id, reload: null, chat: null, map: null, driverMarker: null, driverId: null };
    if (socket) socket.emit('join-order', id);
    const body = m.el.querySelector('#om-body');

    async function load() {
      let d;
      try { [d, drivers] = await Promise.all([api('/api/admin/orders/' + id), api('/api/admin/drivers')]); } catch (e) { SC.fail(e); return; }
      if (!openOrderModal || openOrderModal.id !== id) return;
      render(d);
    }
    openOrderModal.reload = debounce(load, 250);

    function render(d) {
      const o = d.order;
      openOrderModal.driverId = o.driver_id;
      const trackUrl = `${location.origin}/track?no=${o.tracking_no}`;
      const statusMsg = (name) => t('wa_status_msg', { name, no: o.tracking_no, status: t('st_' + o.status), url: trackUrl });
      const canAssign = ['pending', 'assigned', 'failed'].includes(o.status);
      const withDist = drivers.filter((x) => x.active).map((x) => ({ ...x, km: x.last_lat != null && o.pickup_lat != null ? haversine(x.last_lat, x.last_lng, o.pickup_lat, o.pickup_lng) : null }));
      const eligible = withDist.filter((x) => showAll || (x.emirate === o.pickup_emirate && x.duty_status === 'available')).sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9));
      const pb = o.price_breakdown || {};
      const editable = !['delivered', 'cancelled'].includes(o.status);
      const missing = [];
      if (editable) {
        if (!SC.hasPt(o, 'pickup') && !['picked_up'].includes(o.status)) missing.push('o_m_pickup');
        if (!SC.hasPt(o, 'dropoff')) missing.push('o_m_dropoff');
        if (o.price_pending) missing.push('o_m_price');
      }
      const prevChat = openOrderModal.chat ? body.querySelector('#om-chat') : null;
      if (openOrderModal.map) { openOrderModal.map.remove(); openOrderModal.map = null; openOrderModal.driverMarker = null; }

      body.innerHTML = `
        ${o.flagged ? `<div class="cash-banner" style="margin-bottom:12px;color:var(--danger);border-color:rgba(255,107,107,.5);background:rgba(255,107,107,.08)">${t('o_flag_banner')} <button class="btn btn-sm btn-ghost" id="om-unflag">${t('o_unflag')}</button></div>` : ''}
        <div class="row" style="margin-bottom:12px"><span style="font-size:1.4rem;font-weight:900" class="ltr">${esc(o.tracking_no)}</span>${SC.status(o.status)}<span class="pill ${o.payment_status === 'paid' ? 'ok' : 'warn'}">${esc(t('ps_' + o.payment_status))} · ${esc(t('pm_' + o.payment_method))}</span><span class="spacer"></span>
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(o.sender_phone, statusMsg(o.sender_name))}">${t('o_wa_sender')}</a>
          ${o.receiver_phone ? `<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(o.receiver_phone, statusMsg(o.receiver_name || ''))}">${t('o_wa_receiver')}</a>` : ''}</div>
        ${missing.length ? `<div class="cash-banner" style="margin-bottom:12px">📍 ${t('o_missing')}: ${missing.map((k) => esc(t(k))).join('، ')} — <a target="_blank" rel="noopener" href="${SC.waLink(o.sender_phone, t('wa_ask_loc', { no: o.tracking_no }))}">${t('o_ask_wa')}</a></div>` : ''}
        <div class="grid g2">
          <div>
            <div id="om-map" class="map" style="height:280px;margin-bottom:12px"></div>
            <dl class="kv card flat" style="margin-bottom:12px">
              <dt>${t('c_sender')}</dt><dd>${esc(o.sender_name || '—')} · <a class="ltr" href="tel:+${esc(o.sender_phone)}">${SC.phoneFmt(o.sender_phone)}</a><div class="small muted">A · ${esc(SC.em(o.pickup_emirate))} — ${esc(SC.addr(o, 'pickup'))}${SC.hasPt(o, 'pickup') ? '' : ' · ' + t('o_no_pin')}</div></dd>
              <dt>${t('c_receiver')}</dt><dd>${esc(o.receiver_name || '—')} · ${o.receiver_phone ? `<a class="ltr" href="tel:+${esc(o.receiver_phone)}">${SC.phoneFmt(o.receiver_phone)}</a>` : '—'}<div class="small muted">B · ${esc(SC.em(o.dropoff_emirate))} — ${esc(SC.addr(o, 'dropoff'))}${SC.hasPt(o, 'dropoff') ? '' : ' · ' + t('o_no_pin')}</div></dd>
              <dt>${t('o_parcel')}</dt><dd>${esc(SC.parcel(o))}${o.description ? `<div class="small muted">${esc(o.description)}</div>` : ''}</dd>
              ${o.declared_value != null ? `<dt>${t('o_declared')}</dt><dd>${SC.money(o.declared_value)}</dd>` : ''}
              <dt>${t('c_amount')}</dt><dd><b>${SC.price(o)}</b>${o.distance_km != null ? ` · ${o.distance_km} ${t('km')}` : ''}${pb.base != null && !pb.manual ? `<div class="small muted">${t('o_breakdown')}: ${pb.base} + ${pb.distance_fee} + ${pb.weight_fee}${pb.inter_emirate_fee ? ' + ' + pb.inter_emirate_fee : ''}${pb.cod_fee ? ' + ' + pb.cod_fee : ''}${pb.vat ? ' + VAT ' + pb.vat : ''}</div>` : ''}</dd>
              <dt>${t('o_code')}</dt><dd class="ltr"><b>${esc(o.delivery_code)}</b></dd>
              <dt>${t('c_driver')}</dt><dd>${o.driver ? `${esc(o.driver.name)} · <a class="ltr" href="tel:+${esc(o.driver.phone)}">${SC.phoneFmt(o.driver.phone)}</a>` : '—'}</dd>
              <dt>${t('c_date')}</dt><dd>${SC.date(o.created_at)}</dd>
            </dl>
            <div class="grid g3" style="margin-bottom:12px">
              ${o.photo_url ? `<div><div class="small muted">${t('o_parcel_photo')}</div><img class="photo-thumb" src="${esc(o.photo_url)}" alt=""></div>` : ''}
              ${o.pickup_photo_url ? `<div><div class="small muted">${t('o_pickup_photo')}</div><img class="photo-thumb" src="${esc(o.pickup_photo_url)}" alt=""></div>` : ''}
              ${o.delivery_photo_url ? `<div><div class="small muted">${t('o_delivery_photo')}</div><img class="photo-thumb" src="${esc(o.delivery_photo_url)}" alt=""></div>` : ''}
            </div>
            <div class="card flat"><h3>${t('o_log')}</h3><ul class="timeline">${d.events.map((e) => `<li class="${e.flagged || ['failed', 'cancelled', 'rejected'].includes(e.status) ? 'bad' : 'done'}"><div class="t">${esc(t('st_' + e.status))}${e.flagged ? ' ⚠' : ''}</div><div class="d">${SC.date(e.created_at)} · ${esc(t(e.actor_type))}${e.actor_name ? ' (' + esc(e.actor_name) + ')' : ''}${e.note ? ' — ' + esc(e.note) : ''}${e.lat != null ? ` · <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${e.lat}&mlon=${e.lng}#map=17/${e.lat}/${e.lng}">📍</a>` : ''}</div></li>`).join('')}</ul></div>
          </div>
          <div>
            ${editable ? `<details class="card flat" style="margin-bottom:12px" ${missing.length ? 'open' : ''}><summary style="cursor:pointer;font-weight:800">✏️ ${t('o_edit_details')}</summary>
              <div class="grid g2" style="margin-top:10px">
                ${['pickup', 'dropoff'].map((sd) => `<div class="card flat" style="padding:10px;border-top:4px solid ${sd === 'pickup' ? 'var(--cyan)' : '#ff9f43'}"><b>${sd === 'pickup' ? 'A · ' + t('c_sender') : 'B · ' + t('c_receiver')}</b>
                  <div class="field"><label>${t('o_emirate_l')}</label><select data-ed="${sd}_emirate"><option value="">—</option>${Object.keys(SC.EMIRATES).map((c) => `<option value="${c}" ${o[sd + '_emirate'] === c ? 'selected' : ''}>${esc(SC.em(c))}</option>`).join('')}</select></div>
                  <div class="field"><label>${t('o_area_l')}</label><input data-ed="${sd}_area" value="${esc(o[sd + '_area'])}"></div>
                  <div class="field"><label>${t('o_addr_l')}</label><input data-ed="${sd}_address" value="${esc(o[sd + '_address'] || '')}"></div>
                  <div class="field"><label>${t('o_loc_l')}</label><input data-ed="${sd}_location" dir="ltr" placeholder="${t('o_loc_ph')}" value="${SC.hasPt(o, sd) ? o[sd + '_lat'].toFixed(6) + ',' + o[sd + '_lng'].toFixed(6) : ''}"></div>
                  ${sd === 'pickup' ? `<div class="field"><label>${t('o_sname_l')}</label><input data-ed="sender_name" value="${esc(o.sender_name || '')}"></div>`
                    : `<div class="field"><label>${t('o_rname_l')}</label><input data-ed="receiver_name" value="${esc(o.receiver_name || '')}"></div><div class="field"><label>${t('o_rphone_l')}</label><input data-ed="receiver_phone" dir="ltr" value="${esc(o.receiver_phone || '')}"></div>`}
                </div>`).join('')}
              </div>
              ${o.payment_status !== 'paid' ? `<div class="field" style="margin-top:8px"><label>${t('o_price_l')}</label><input type="number" min="0" step="1" data-ed="amount" placeholder="${o.price_pending ? t('price_tbd') : o.amount}"></div>` : ''}
              <button class="btn btn-primary btn-sm" id="om-save-details" style="margin-top:8px">${t('save')}</button></details>` : ''}
            ${canAssign ? `<div class="card flat" style="margin-bottom:12px"><div class="row"><h3 style="margin:0">${o.driver_id ? t('o_reassign') : t('o_assign')}</h3><span class="spacer"></span><label class="check small" style="margin:0"><input type="checkbox" id="om-all" ${showAll ? 'checked' : ''}> ${t('o_show_all_drivers')}</label></div>
              <div style="margin-top:10px;max-height:260px;overflow:auto">${eligible.length ? eligible.map((x) => `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><div><b>${esc(x.name)}</b> ${dutyPill(x)}<div class="small muted">${esc(SC.em(x.emirate))} · ${x.active_orders} ${t('c_active_orders')}${x.km != null ? ' · ' + t('o_distance_from', { km: x.km.toFixed(1) }) : ''}${x.route_areas ? ' · ' + esc(x.route_areas.slice(0, 60)) : ''}</div></div><span class="spacer"></span><button class="btn btn-primary btn-sm" data-assign="${x.id}" ${x.id === o.driver_id ? 'disabled' : ''}>${t('o_assign_btn')}</button></div>`).join('') : `<div class="muted small">${t('o_no_drivers')}</div>`}</div></div>` : ''}
            <div class="card flat" style="margin-bottom:12px"><h3>${t('chat')}</h3><div id="om-chat"></div></div>
            <div class="card flat" style="margin-bottom:12px"><h3>${t('o_change_status')}</h3>
              <div class="grid g2"><select id="om-status">${['pending', 'assigned', 'accepted', 'picked_up', 'delivered', 'failed', 'cancelled'].map((s) => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${esc(t('st_' + s))}</option>`).join('')}</select><input id="om-note" placeholder="${t('o_note')}"></div>
              <div class="row" style="margin-top:10px"><button class="btn btn-ghost btn-sm" id="om-apply">${t('o_apply')}</button>${o.payment_status !== 'paid' ? `<button class="btn btn-ok btn-sm" id="om-paid">${t('o_mark_paid')}</button>` : ''}</div></div>
            <div class="card flat"><h3>${t('o_notes')}</h3><textarea id="om-notes" maxlength="2000">${esc(o.admin_notes || '')}</textarea><button class="btn btn-ghost btn-sm" style="margin-top:8px" id="om-save-notes">${t('o_save_notes')}</button></div>
          </div>
        </div>`;

      // map
      const emC = (c) => (c && SC.EMIRATES[c] ? [SC.EMIRATES[c].lat, SC.EMIRATES[c].lng] : null);
      const center = SC.hasPt(o, 'pickup') ? [o.pickup_lat, o.pickup_lng] : emC(o.pickup_emirate) || [25.0, 55.4];
      const map = SC.makeMap(body.querySelector('#om-map'), center, SC.hasPt(o, 'pickup') ? 12 : 9);
      openOrderModal.map = map;
      const pts = [center];
      if (SC.hasPt(o, 'pickup')) L.marker([o.pickup_lat, o.pickup_lng], { icon: SC.pinIcon('A', 'a') }).addTo(map);
      if (SC.hasPt(o, 'dropoff')) { L.marker([o.dropoff_lat, o.dropoff_lng], { icon: SC.pinIcon('B', 'b') }).addTo(map); pts.push([o.dropoff_lat, o.dropoff_lng]); }
      if (o.driver_location && o.driver_id) { openOrderModal.driverMarker = L.marker([o.driver_location.lat, o.driver_location.lng], { icon: SC.carIcon() }).addTo(map); pts.push([o.driver_location.lat, o.driver_location.lng]); }
      if (pts.length > 1) map.fitBounds(L.latLngBounds(pts).pad(0.25));
      setTimeout(() => map.invalidateSize(), 60);

      // chat
      if (prevChat) body.querySelector('#om-chat').replaceWith(prevChat);
      else openOrderModal.chat = SC.chat({ el: body.querySelector('#om-chat'), me: 'admin', initial: d.messages, send: (b) => api(`/api/admin/orders/${id}/messages`, { body: { body: b } }) });

      // actions
      const all = body.querySelector('#om-all'); if (all) all.onchange = () => { showAll = all.checked; render(d); };
      body.querySelectorAll('[data-assign]').forEach((b) => b.onclick = async () => {
        const drv = drivers.find((x) => x.id === Number(b.dataset.assign));
        let force = false;
        if (drv.duty_status !== 'available' || drv.emirate !== o.pickup_emirate) { if (!(await SC.confirmBox(t('o_force_q')))) return; force = true; }
        b.disabled = true;
        try { await api(`/api/admin/orders/${id}/assign`, { body: { driver_id: drv.id, force } }); SC.toast(t('o_assigned_ok'), 'ok'); load(); } catch (e) { SC.fail(e); b.disabled = false; }
      });
      body.querySelector('#om-apply').onclick = async () => {
        try { await api(`/api/admin/orders/${id}/status`, { body: { status: body.querySelector('#om-status').value, note: body.querySelector('#om-note').value } }); SC.toast(t('o_status_ok'), 'ok'); load(); } catch (e) { SC.fail(e); }
      };
      const paid = body.querySelector('#om-paid');
      if (paid) paid.onclick = async () => { const note = await SC.confirmBox(t('o_mark_paid'), { input: t('o_mark_paid_q') }); if (!note) return; try { await api(`/api/admin/orders/${id}/mark-paid`, { body: { note } }); load(); } catch (e) { SC.fail(e); } };
      body.querySelector('#om-save-notes').onclick = async () => { try { await api(`/api/admin/orders/${id}/notes`, { body: { admin_notes: body.querySelector('#om-notes').value } }); SC.toast(t('save'), 'ok'); } catch (e) { SC.fail(e); } };
      const sd = body.querySelector('#om-save-details');
      if (sd) sd.onclick = async () => {
        const payload = {};
        body.querySelectorAll('[data-ed]').forEach((inp) => {
          const k = inp.dataset.ed; const v = inp.value.trim();
          if (k === 'amount') { if (v !== '') payload.amount = v; return; }
          const cur = k.endsWith('_location') ? (SC.hasPt(o, k.replace('_location', '')) ? o[k.replace('_location', '_lat')].toFixed(6) + ',' + o[k.replace('_location', '_lng')].toFixed(6) : '') : (o[k] || '');
          if (v !== String(cur)) payload[k] = v;
        });
        if (!Object.keys(payload).length) { SC.toast(t('e_nothing_to_update')); return; }
        sd.disabled = true;
        try { await api(`/api/admin/orders/${id}/details`, { body: payload }); SC.toast(t('save'), 'ok'); load(); } catch (e) { SC.fail(e); sd.disabled = false; }
      };
      const unflag = body.querySelector('#om-unflag'); if (unflag) unflag.onclick = async () => { try { await api(`/api/admin/orders/${id}/unflag`, { body: {} }); load(); } catch (e) { SC.fail(e); } };
    }
    load();
  }
  function haversine(a1, o1, a2, o2) { const R = 6371, r = (x) => x * Math.PI / 180; const dA = r(a2 - a1), dO = r(o2 - o1); const h = Math.sin(dA / 2) ** 2 + Math.cos(r(a1)) * Math.cos(r(a2)) * Math.sin(dO / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }

  // ---------------- live map ----------------
  PAGES.live = async (el) => {
    const r = await api('/api/admin/live');
    el.innerHTML = `<div class="card" style="padding:10px"><div id="live-map" class="map tall"></div></div><div class="grid g3" style="margin-top:14px" id="live-list"></div>`;
    liveMap = SC.makeMap($('#live-map'), [25.0, 55.4], 8);
    for (const k of Object.keys(liveMarkers)) delete liveMarkers[k];
    const pts = [];
    r.drivers.forEach((d) => {
      const mk = L.marker([d.last_lat, d.last_lng], { icon: SC.carIcon(d.duty_status !== 'available') }).addTo(liveMap)
        .bindPopup(`<b>${esc(d.name)}</b><br>${esc(SC.em(d.emirate))} · ${t(d.duty_status === 'available' ? 'duty_available' : 'duty_off')}<br><small>${SC.ago(d.last_loc_at)}</small>`);
      liveMarkers[d.id] = mk; pts.push([d.last_lat, d.last_lng]);
    });
    r.orders.forEach((o) => {
      const target = ['pending', 'assigned', 'accepted'].includes(o.status) ? [o.pickup_lat, o.pickup_lng] : [o.dropoff_lat, o.dropoff_lng];
      if (target[0] == null || target[1] == null) return;
      const mk = L.marker(target, { icon: SC.pinIcon(o.status === 'picked_up' ? 'B' : 'A', o.status === 'picked_up' ? 'b' : 'a') }).addTo(liveMap)
        .bindPopup(`<b class="ltr">${esc(o.tracking_no)}</b><br>${esc(t('st_' + o.status))}<br><a href="#" data-open-order="${o.id}">${t('view')}</a>`);
      mk.on('popupopen', (ev) => { const a = ev.popup.getElement().querySelector('[data-open-order]'); if (a) a.onclick = (e2) => { e2.preventDefault(); orderModal(o.id); }; });
      pts.push(target);
    });
    if (pts.length) liveMap.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 13 });
    $('#live-list').innerHTML = r.drivers.map((d) => `<div class="card flat row"><span style="font-size:1.4rem">🚚</span><div><b>${esc(d.name)}</b><div class="small muted">${esc(SC.em(d.emirate))} · ${SC.ago(d.last_loc_at)}</div></div><span class="spacer"></span><button class="btn btn-ghost btn-sm" data-focus="${d.id}">📍</button></div>`).join('');
    $$('[data-focus]').forEach((b) => b.onclick = () => { const mk = liveMarkers[b.dataset.focus]; if (mk) { liveMap.setView(mk.getLatLng(), 15); mk.openPopup(); } });
    pageCleanup = () => { if (liveMap) { liveMap.remove(); liveMap = null; } };
  };

  // ---------------- drivers ----------------
  PAGES.drivers = async (el) => {
    const list = await api('/api/admin/drivers');
    el.innerHTML = `<div class="row" style="margin-bottom:14px"><span class="spacer"></span><button class="btn btn-primary" id="dr-add">+ ${t('dr_add')}</button></div>
      ${table([t('c_name'), t('c_phone'), t('c_emirate'), t('c_duty'), t('c_active_orders'), t('c_delivered'), t('c_rating'), t('c_cash_due'), ''],
        list.map((d) => `<tr class="click" data-driver="${d.id}"><td><b>${esc(d.name)}</b><div class="small muted">${esc(d.vehicle_type)} ${esc(d.vehicle_plate)}</div></td><td class="ltr">${SC.phoneFmt(d.phone)}</td><td>${esc(SC.em(d.emirate))}</td><td>${dutyPill(d)}</td><td>${d.active_orders}</td><td>${d.delivered}</td><td>${d.rating != null ? d.rating + ' ★' : '—'}</td><td>${SC.money(d.cash_due)}</td>
          <td>${d.active ? `<button class="btn btn-sm ${d.duty_status === 'available' ? 'btn-ghost' : 'btn-ok'}" data-duty="${d.id}" data-to="${d.duty_status === 'available' ? 'off' : 'available'}">${d.duty_status === 'available' ? t('dr_set_off') : t('dr_set_on')}</button>` : ''}</td></tr>`))}`;
    $('#dr-add').onclick = () => driverModal(null);
    el.querySelectorAll('tr[data-driver]').forEach((tr) => tr.addEventListener('click', (e) => { if (!e.target.closest('button')) driverModal(list.find((d) => d.id === Number(tr.dataset.driver))); }));
    el.querySelectorAll('[data-duty]').forEach((b) => b.onclick = async () => { b.disabled = true; try { await api(`/api/admin/drivers/${b.dataset.duty}/duty`, { body: { status: b.dataset.to } }); go('drivers', true); } catch (e) { SC.fail(e); b.disabled = false; } });
  };

  function credBox(d, pw) {
    const url = `${location.origin}/driver`;
    const msg = t('dr_cred_msg', { name: d.name, url, phone: SC.phoneFmt(d.phone), pw });
    return `<div class="card flat" style="border-color:var(--gold)"><p>${t('dr_cred')}</p><dl class="kv"><dt>${t('dr_login_url')}</dt><dd class="ltr">${esc(url)}</dd><dt>${t('c_phone')}</dt><dd class="ltr">${SC.phoneFmt(d.phone)}</dd><dt>${t('dr_password')}</dt><dd class="ltr"><b style="font-size:1.2rem">${esc(pw)}</b></dd></dl>
      <div class="row" style="margin-top:10px"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(d.phone, msg)}">${t('dr_send_cred')}</a><button class="btn btn-ghost btn-sm" data-copy="${esc(msg)}">${t('copy')}</button></div></div>`;
  }
  document.addEventListener('click', (e) => { const c = e.target.closest('[data-copy]'); if (c) SC.copy(c.dataset.copy); });

  async function driverModal(d) {
    const isNew = !d;
    d = d || { name: '', phone: '', emirate: 'DXB', route_areas: '', vehicle_type: '', vehicle_plate: '', license_no: '', notes: '', active: true };
    const m = SC.modal(`<div class="modal-head"><h3>${isNew ? t('dr_add') : t('dr_edit')}</h3><button class="btn btn-ghost btn-sm" data-close>${t('close')}</button></div>
      <form id="dr-form"><div class="grid g2">
        <div class="field"><label>${t('c_name')}</label><input name="name" required value="${esc(d.name)}"></div>
        <div class="field"><label>${t('c_phone')}</label><input name="phone" required dir="ltr" value="${esc(d.phone ? '0' + String(d.phone).replace(/^971/, '') : '')}" placeholder="05XXXXXXXX"></div>
        <div class="field"><label>${t('c_emirate')}</label><select name="emirate">${Object.keys(SC.EMIRATES).map((c) => `<option value="${c}" ${d.emirate === c ? 'selected' : ''}>${esc(SC.em(c))}</option>`).join('')}</select></div>
        <div class="field"><label>${t('dr_vehicle')}</label><input name="vehicle_type" value="${esc(d.vehicle_type)}"></div>
        <div class="field"><label>${t('dr_plate')}</label><input name="vehicle_plate" value="${esc(d.vehicle_plate)}"></div>
        <div class="field"><label>${t('dr_license')}</label><input name="license_no" value="${esc(d.license_no)}"></div>
      </div>
      <div class="field"><label>${t('dr_route')}</label><textarea name="route_areas" placeholder="${t('dr_route_ph')}">${esc(d.route_areas)}</textarea></div>
      <div class="field"><label>${t('dr_notes')}</label><textarea name="notes" style="min-height:60px">${esc(d.notes)}</textarea></div>
      ${isNew ? `<div class="field"><label>${t('dr_password')}</label><input name="password" dir="ltr" autocomplete="new-password"><div class="hint">${t('dr_password_hint')}</div></div>` : ''}
      <div class="err" id="dr-err"></div>
      <div class="row"><button class="btn btn-primary" type="submit">${t('save')}</button><span class="spacer"></span>
        ${!isNew ? `<button type="button" class="btn btn-ghost btn-sm" id="dr-reset">${t('dr_reset_pw')}</button><button type="button" class="btn btn-sm ${d.active ? 'btn-danger' : 'btn-ok'}" id="dr-toggle">${d.active ? t('dr_deactivate') : t('dr_activate')}</button>` : ''}</div>
      </form><div id="dr-extra" style="margin-top:14px"></div>`);
    const f = m.el.querySelector('#dr-form');
    f.onsubmit = async (e) => {
      e.preventDefault(); m.el.querySelector('#dr-err').textContent = '';
      const data = Object.fromEntries(new FormData(f).entries());
      try {
        if (isNew) {
          const r = await api('/api/admin/drivers', { body: data });
          SC.toast(t('dr_created'), 'ok');
          f.classList.add('hidden');
          m.el.querySelector('#dr-extra').innerHTML = credBox({ name: data.name, phone: SC.normPhone(data.phone) }, r.password);
        } else {
          await api('/api/admin/drivers/' + d.id, { method: 'PUT', body: data });
          SC.toast(t('save'), 'ok'); m.close();
        }
        if (pageName === 'drivers') go('drivers', true);
      } catch (err) { m.el.querySelector('#dr-err').textContent = err.message; }
    };
    if (!isNew) {
      m.el.querySelector('#dr-reset').onclick = async () => {
        if (!(await SC.confirmBox(t('dr_reset_pw') + '?'))) return;
        try { const r = await api(`/api/admin/drivers/${d.id}/password`, { body: {} }); m.el.querySelector('#dr-extra').innerHTML = credBox(d, r.password); } catch (e) { SC.fail(e); }
      };
      m.el.querySelector('#dr-toggle').onclick = async () => {
        if (!(await SC.confirmBox((d.active ? t('dr_deactivate') : t('dr_activate')) + '?', { danger: d.active }))) return;
        try { await api('/api/admin/drivers/' + d.id, { method: 'PUT', body: { active: !d.active } }); m.close(); go('drivers', true); } catch (e) { SC.fail(e); }
      };
      try {
        const att = await api(`/api/admin/drivers/${d.id}/attendance`);
        m.el.querySelector('#dr-extra').insertAdjacentHTML('beforeend', `<h3>${t('dr_attendance')}</h3>${table([t('dr_in'), t('dr_out'), ''], att.slice(0, 20).map((a) => `<tr><td>${SC.date(a.check_in)}</td><td>${a.check_out ? SC.date(a.check_out) : '—'}</td><td class="small muted">${a.by_admin ? t('dr_by_admin') : ''}</td></tr>`))}
          ${d.last_lat != null ? `<p class="small" style="margin-top:10px">${t('dr_last_loc')}: <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${d.last_lat}&mlon=${d.last_lng}#map=16/${d.last_lat}/${d.last_lng}">📍 ${SC.ago(d.last_loc_at)}</a></p>` : ''}`);
      } catch { /* */ }
    }
  }

  // ---------------- chat with drivers ----------------
  async function loadChatList() {
    const box = $('#chat-list'); if (!box) return;
    const list = await api('/api/admin/chats');
    box.innerHTML = list.map((c) => `<a href="#" data-cd="${c.driver_id}" class="notif ${state.chatDriver === c.driver_id ? 'unread' : ''}" style="display:block;color:var(--text)"><b>${esc(c.name)}</b> <span class="small muted">${esc(SC.em(c.emirate))}</span>${c.body ? `<div class="small muted">${c.sender_type === 'driver' ? '' : t('you') + ': '}${esc(c.body.slice(0, 50))}</div><div class="d">${SC.ago(c.created_at)}</div>` : ''}</a>`).join('') || `<div class="empty small">${t('no_data')}</div>`;
    box.querySelectorAll('[data-cd]').forEach((a) => a.onclick = (e) => { e.preventDefault(); openDriverChat(Number(a.dataset.cd)); });
  }
  async function openDriverChat(id) {
    state.chatDriver = id;
    $$('#chat-list [data-cd]').forEach((a) => a.classList.toggle('unread', Number(a.dataset.cd) === id));
    const pane = $('#chat-pane');
    pane.innerHTML = '<div id="dchat"></div>';
    state.chatWidget = SC.chat({ el: $('#dchat'), me: 'admin', load: () => api(`/api/admin/drivers/${id}/messages`), send: (b) => api(`/api/admin/drivers/${id}/messages`, { body: { body: b } }) });
    $('#dchat').style.height = '520px';
  }
  PAGES.chat = async (el) => {
    el.innerHTML = `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:16px" id="chat-grid"><div class="card" style="padding:0;overflow:hidden"><div id="chat-list" class="notif-list" style="max-height:560px"></div></div><div class="card" id="chat-pane"><div class="empty">${t('ch_select')}</div></div></div>`;
    if (window.innerWidth < 960) $('#chat-grid').style.gridTemplateColumns = '1fr';
    await loadChatList();
    if (state.chatDriver) openDriverChat(state.chatDriver);
    pageCleanup = () => { state.chatWidget = null; };
  };

  // ---------------- complaints ----------------
  PAGES.complaints = async (el) => {
    const list = await api('/api/admin/complaints?source=' + state.cmSource);
    const catLabel = (c) => t((c.source === 'driver' ? 'ic_' : 'cc_') + c.category);
    const stPill = (s) => `<span class="pill ${s === 'resolved' ? 'ok' : s === 'open' ? 'bad' : 'warn'}">${t('cm_status_' + s)}</span>`;
    el.innerHTML = `<div class="tabs"><button data-src="customer" class="${state.cmSource === 'customer' ? 'active' : ''}">${t('cm_customer')}</button><button data-src="driver" class="${state.cmSource === 'driver' ? 'active' : ''}">${t('cm_driver')}</button></div>
      <div class="grid g2">${list.map((c) => `<div class="card ${['emergency', 'accident'].includes(c.category) && c.status !== 'resolved' ? '' : 'flat'}" style="${['emergency', 'accident'].includes(c.category) && c.status !== 'resolved' ? 'border-color:var(--danger)' : ''}">
        <div class="row"><b>#${c.id}</b>${stPill(c.status)}<span class="pill">${esc(catLabel(c))}</span><span class="spacer"></span><span class="small muted">${SC.date(c.created_at)}</span></div>
        <p style="margin:10px 0">${esc(c.body)}</p>
        <div class="small muted">${esc(c.source === 'driver' ? c.driver_name || c.name : c.name)} · <a class="ltr" href="tel:+${esc(c.phone)}">${SC.phoneFmt(c.phone)}</a>${c.tracking_no ? ` · <a href="#" data-open-order="${c.order_id}" class="ltr">${esc(c.tracking_no)}</a>` : ''}${c.lat != null ? ` · <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=16/${c.lat}/${c.lng}">📍 ${t('cm_location')}</a>` : ''}</div>
        ${c.photo_url ? `<img class="photo-thumb" style="margin-top:10px;max-height:160px" src="${esc(c.photo_url)}" alt="">` : ''}
        <div class="field" style="margin-top:10px"><textarea data-reply="${c.id}" placeholder="${t('cm_reply')}" style="min-height:60px">${esc(c.admin_reply)}</textarea></div>
        <div class="row"><select data-cst="${c.id}" style="width:auto">${['open', 'in_progress', 'resolved'].map((s) => `<option value="${s}" ${c.status === s ? 'selected' : ''}>${t('cm_status_' + s)}</option>`).join('')}</select><button class="btn btn-primary btn-sm" data-cupd="${c.id}">${t('cm_update')}</button>
          ${c.source === 'customer' ? `<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${SC.waLink(c.phone)}">${t('whatsapp')}</a>` : `<button class="btn btn-ghost btn-sm" data-chat-driver="${c.driver_id}">${t('chat')}</button>`}</div>
      </div>`).join('') || `<div class="card flat empty">${t('no_data')}</div>`}</div>`;
    el.querySelectorAll('[data-src]').forEach((b) => b.onclick = () => { state.cmSource = b.dataset.src; go('complaints', true); });
    el.querySelectorAll('[data-cupd]').forEach((b) => b.onclick = async () => {
      const id = b.dataset.cupd;
      try { await api('/api/admin/complaints/' + id, { method: 'PUT', body: { status: el.querySelector(`[data-cst="${id}"]`).value, admin_reply: el.querySelector(`[data-reply="${id}"]`).value } }); SC.toast(t('save'), 'ok'); refreshBadges(); go('complaints', true); } catch (e) { SC.fail(e); }
    });
    el.querySelectorAll('[data-open-order]').forEach((a) => a.onclick = (e) => { e.preventDefault(); orderModal(Number(a.dataset.openOrder)); });
    el.querySelectorAll('[data-chat-driver]').forEach((b) => b.onclick = () => { state.chatDriver = Number(b.dataset.chatDriver); go('chat'); });
  };

  // ---------------- ratings ----------------
  PAGES.ratings = async (el) => {
    const list = await api('/api/admin/ratings');
    const avg = list.length ? (list.reduce((a, r) => a + r.stars, 0) / list.length).toFixed(2) : '—';
    el.innerHTML = `<div class="grid g2" style="margin-bottom:16px"><div class="card stat accent"><div class="v">${avg} ★</div><div class="l">${t('r_avg')}</div></div><div class="card stat"><div class="v">${list.length}</div><div class="l">${t('r_count')}</div></div></div>
      ${table([t('c_no'), t('c_rating'), t('c_driver'), '', t('c_date')], list.map((r) => `<tr class="click" data-order="${r.order_id}"><td class="ltr">${esc(r.tracking_no)}</td><td style="color:var(--gold)">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</td><td>${esc(r.driver_name || '—')}</td><td class="wrap">${esc(r.comment)}</td><td class="small">${SC.date(r.created_at)}</td></tr>`))}`;
  };

  // ---------------- cash ----------------
  PAGES.cash = async (el) => {
    const rows = await api('/api/admin/cash');
    const byDriver = {};
    rows.forEach((r) => { (byDriver[r.driver_id] = byDriver[r.driver_id] || { name: r.driver_name, total: 0, items: [] }); byDriver[r.driver_id].total += r.cash_collected; byDriver[r.driver_id].items.push(r); });
    const ids = Object.keys(byDriver);
    el.innerHTML = ids.length ? ids.map((id) => { const g = byDriver[id]; return `<div class="card" style="margin-bottom:14px"><div class="row"><h3 style="margin:0">${esc(g.name)}</h3><span class="pill warn">${SC.money(g.total)}</span><span class="spacer"></span><button class="btn btn-ok btn-sm" data-settle="${id}" data-amount="${g.total}" data-name="${esc(g.name)}">${t('cash_settle')}</button></div>
      <div style="margin-top:10px">${table([t('c_no'), t('c_payment'), t('c_amount'), t('c_date')], g.items.map((r) => `<tr class="click" data-order="${r.id}"><td class="ltr">${esc(r.tracking_no)}</td><td>${esc(t('pm_' + r.payment_method))}</td><td>${SC.money(r.cash_collected)}</td><td class="small">${SC.date(r.delivered_at || r.picked_up_at)}</td></tr>`))}</div></div>`; }).join('')
      : `<div class="card flat empty">${t('cash_none')}</div>`;
    el.querySelectorAll('[data-settle]').forEach((b) => b.onclick = async () => {
      if (!(await SC.confirmBox(t('cash_settle_q', { amount: SC.money(b.dataset.amount), name: b.dataset.name })))) return;
      try { await api(`/api/admin/drivers/${b.dataset.settle}/settle`, { body: {} }); SC.toast(t('cash_settled'), 'ok'); go('cash', true); } catch (e) { SC.fail(e); }
    });
  };

  // ---------------- settings ----------------
  PAGES.settings = async (el) => {
    const s = await api('/api/admin/settings');
    const P = s.pricing, Lm = s.limits, C = s.contact;
    const ro = me.role !== 'admin' ? 'disabled' : '';
    const numF = (k, label, v, step = '0.01') => `<div class="field"><label>${label}</label><input type="number" step="${step}" min="0" data-p="${k}" value="${v}" ${ro}></div>`;
    el.innerHTML = `
      <div class="card" style="margin-bottom:16px"><h3>${t('set_pricing')}</h3>
        ${table([t('c_emirate'), t('set_base'), t('set_active')], Object.keys(SC.EMIRATES).map((c) => `<tr><td>${esc(SC.em(c))}</td><td><input type="number" min="0" step="0.5" data-eb="${c}" value="${P.emirates[c] ? P.emirates[c].base : 0}" style="max-width:120px" ${ro}></td><td><input type="checkbox" data-ea="${c}" ${P.emirates[c] && P.emirates[c].active !== false ? 'checked' : ''} ${ro}></td></tr>`))}
        <div class="grid g4" style="margin-top:14px">
          ${numF('included_km', t('set_included_km'), P.included_km, '1')}${numF('per_km', t('set_per_km'), P.per_km)}${numF('included_kg', t('set_included_kg'), P.included_kg, '0.5')}${numF('per_kg', t('set_per_kg'), P.per_kg)}
          ${numF('inter_emirate_fee', t('set_inter'), P.inter_emirate_fee)}${numF('cod_fee', t('set_cod'), P.cod_fee)}${numF('vat_percent', t('set_vat'), P.vat_percent, '0.5')}${numF('min_price', t('set_min'), P.min_price)}
          ${numF('vol_divisor', t('set_vol'), P.vol_divisor, '100')}
        </div>
        <p class="small muted" id="set-preview"></p>
      </div>
      <div class="grid g2">
        <div class="card" style="margin-bottom:16px"><h3>${t('set_limits')}</h3><div class="grid g2">
          <div class="field"><label>${t('set_max_w')}</label><input type="number" data-l="max_weight_kg" value="${Lm.max_weight_kg}" ${ro}></div>
          <div class="field"><label>${t('set_max_d')}</label><input type="number" data-l="max_dim_cm" value="${Lm.max_dim_cm}" ${ro}></div>
          <div class="field"><label>${t('set_geofence')}</label><input type="number" data-l="geofence_m" value="${Lm.geofence_m}" ${ro}></div>
          <div class="field"><label class="check" style="margin-top:30px"><input type="checkbox" id="req-photo" ${Lm.require_delivery_photo ? 'checked' : ''} ${ro}> ${t('set_req_photo')}</label></div></div></div>
        <div class="card" style="margin-bottom:16px"><h3>${t('set_contact')}</h3>
          <div class="field"><label>${t('set_wa')}</label><input id="c-wa" dir="ltr" value="${esc(C.whatsapp)}" ${ro}></div>
          <div class="field"><label>${t('set_wa_disp')}</label><input id="c-wad" dir="ltr" value="${esc(C.whatsapp_display)}" ${ro}></div>
          <div class="field"><label>${t('set_email')}</label><input id="c-email" dir="ltr" value="${esc(C.email || '')}" ${ro}></div></div>
      </div>
      <div class="card" style="margin-bottom:16px"><h3>${t('set_prohibited')}</h3><p class="hint">${t('set_prohibited_hint')}</p>
        <textarea id="prohib" style="min-height:220px" ${ro}>${esc(s.prohibited.map((p) => `${p.ar} | ${p.en}`).join('\n'))}</textarea></div>
      ${ro ? '' : `<button class="btn btn-primary btn-lg" id="set-save">${t('save')}</button>`}`;
    const collect = () => {
      const pricing = { emirates: {} };
      Object.keys(SC.EMIRATES).forEach((c) => { pricing.emirates[c] = { base: Number(el.querySelector(`[data-eb="${c}"]`).value), active: el.querySelector(`[data-ea="${c}"]`).checked }; });
      el.querySelectorAll('[data-p]').forEach((i) => { pricing[i.dataset.p] = Number(i.value); });
      const limits = { require_delivery_photo: $('#req-photo').checked };
      el.querySelectorAll('[data-l]').forEach((i) => { limits[i.dataset.l] = Number(i.value); });
      const prohibited = $('#prohib').value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [ar, en] = l.split('|').map((x) => (x || '').trim()); return { ar: ar || en, en: en || ar }; });
      return { pricing, limits, contact: { whatsapp: $('#c-wa').value, whatsapp_display: $('#c-wad').value, email: $('#c-email').value }, prohibited };
    };
    const preview = () => {
      const { pricing: p } = collect();
      const km = 28, kg = 7;
      let sub = p.emirates.DXB.base + Math.max(0, km - p.included_km) * p.per_km + Math.max(0, Math.ceil(kg - p.included_kg)) * p.per_kg + p.inter_emirate_fee;
      sub = Math.max(sub, p.min_price); const tot = sub * (1 + p.vat_percent / 100);
      $('#set-preview').textContent = t('set_preview', { p: SC.money(Math.round(tot * 100) / 100) });
    };
    el.addEventListener('input', preview); preview();
    const sv = $('#set-save');
    if (sv) sv.onclick = async () => { sv.disabled = true; try { await api('/api/admin/settings', { method: 'PUT', body: collect() }); SC.config = null; SC.toast(t('set_saved'), 'ok'); } catch (e) { SC.fail(e); } finally { sv.disabled = false; } };
  };

  // ---------------- staff ----------------
  PAGES.staff = async (el) => {
    const users = await api('/api/admin/users');
    el.innerHTML = `<div class="card" style="margin-bottom:16px"><h3>${t('st_add')}</h3><form id="st-form" class="grid g4">
        <input name="name" required placeholder="${t('c_name')}"><input name="username" required dir="ltr" placeholder="${t('a_username')}">
        <select name="role"><option value="staff">${t('st_role_staff')}</option><option value="admin">${t('st_role_admin')}</option></select>
        <button class="btn btn-primary" type="submit">${t('st_add')}</button></form><div id="st-out" style="margin-top:10px"></div></div>
      <div class="card"><h3>${t('st_users')}</h3>${table([t('c_name'), t('a_username'), t('st_role'), t('st_active'), ''], users.map((u) => `<tr><td>${esc(u.name)}</td><td class="ltr">${esc(u.username)}</td><td>${u.role === 'admin' ? t('st_role_admin') : t('st_role_staff')}</td><td>${u.active ? '✅' : '⛔'}</td>
        <td>${u.id === me.id ? '' : `<button class="btn btn-ghost btn-sm" data-urole="${u.id}" data-role="${u.role === 'admin' ? 'staff' : 'admin'}" data-active="${u.active}">${u.role === 'admin' ? t('st_role_staff') : t('st_role_admin')}</button> <button class="btn btn-sm ${u.active ? 'btn-danger' : 'btn-ok'}" data-uact="${u.id}" data-role="${u.role}" data-active="${!u.active}">${u.active ? t('dr_deactivate') : t('dr_activate')}</button> <button class="btn btn-ghost btn-sm" data-upw="${u.id}">${t('dr_reset_pw')}</button>`}</td></tr>`))}</div>`;
    $('#st-form').onsubmit = async (e) => {
      e.preventDefault();
      try { const r = await api('/api/admin/users', { body: Object.fromEntries(new FormData(e.target).entries()) }); $('#st-out').innerHTML = `<div class="cash-banner">${esc(t('stf_created', { pw: r.password }))}</div>`; e.target.reset(); setTimeout(() => go('staff', true), 8000); } catch (err) { SC.fail(err); }
    };
    el.querySelectorAll('[data-urole]').forEach((b) => b.onclick = async () => { try { await api('/api/admin/users/' + b.dataset.urole, { method: 'PUT', body: { role: b.dataset.role, active: b.dataset.active === 'true' } }); go('staff', true); } catch (e) { SC.fail(e); } });
    el.querySelectorAll('[data-uact]').forEach((b) => b.onclick = async () => { try { await api('/api/admin/users/' + b.dataset.uact, { method: 'PUT', body: { role: b.dataset.role, active: b.dataset.active === 'true' } }); go('staff', true); } catch (e) { SC.fail(e); } });
    el.querySelectorAll('[data-upw]').forEach((b) => b.onclick = async () => { try { const r = await api(`/api/admin/users/${b.dataset.upw}/password`, { body: {} }); $('#st-out').innerHTML = `<div class="cash-banner">${esc(t('stf_created', { pw: r.password }))}</div>`; } catch (e) { SC.fail(e); } });
  };

  // ---------------- account ----------------
  PAGES.account = async (el) => {
    el.innerHTML = `<div class="card" style="max-width:480px"><h3>${t('acc_change_pw')}</h3><form id="pw-form">
      <div class="field"><label>${t('acc_current')}</label><input type="password" name="current" required autocomplete="current-password" dir="ltr"></div>
      <div class="field"><label>${t('acc_new')}</label><input type="password" name="next" required minlength="8" autocomplete="new-password" dir="ltr"></div>
      <button class="btn btn-primary" type="submit">${t('save')}</button></form></div>`;
    $('#pw-form').onsubmit = async (e) => {
      e.preventDefault();
      try { await api('/api/admin/me/password', { body: Object.fromEntries(new FormData(e.target).entries()) }); SC.toast(t('acc_changed'), 'ok'); setTimeout(() => location.reload(), 1200); } catch (err) { SC.fail(err); }
    };
  };

  boot();
})();
