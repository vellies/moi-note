export type Lang = 'en' | 'ta';

export const labels = {
  contributorName: { en: 'Contributor Name', ta: 'கொடையாளர் பெயர்' },
  place: { en: 'Place', ta: 'இடம்' },
  mobileNumber: { en: 'Mobile Number', ta: 'மொபைல் எண்' },
  amount: { en: 'Amount (₹)', ta: 'தொகை (₹)' },
  paymentMode: { en: 'Payment Mode', ta: 'பணம் செலுத்தும் முறை' },
  notes: { en: 'Notes', ta: 'குறிப்புகள்' },
  save: { en: 'Save', ta: 'சேமி' },
  cancel: { en: 'Cancel', ta: 'ரத்து' },
  addMoi: { en: 'Add Moi', ta: 'மொய் சேர்' },
  search: { en: 'Search', ta: 'தேடு' },
  functions: { en: 'Functions', ta: 'நிகழ்வுகள்' },
  reports: { en: 'Reports', ta: 'அறிக்கைகள்' },
  dashboard: { en: 'Dashboard', ta: 'டாஷ்போர்டு' },
  totalCollected: { en: 'Total Collected', ta: 'மொத்த வசூல்' },
  entries: { en: 'Entries', ta: 'உள்ளீடுகள்' },
  exportExcel: { en: 'Export Excel', ta: 'எக்செல் ஏற்றுமதி' },
  exportPdf: { en: 'Export PDF', ta: 'PDF ஏற்றுமதி' },
  functionType: { en: 'Function Type', ta: 'நிகழ்வு வகை' },
  date: { en: 'Date', ta: 'தேதி' },
  venue: { en: 'Venue', ta: 'இடம் / மண்டபம்' },
  title: { en: 'Title', ta: 'தலைப்பு' },
  newFunction: { en: 'New Function', ta: 'புதிய நிகழ்வு' },
  welcome: { en: 'Welcome', ta: 'வணக்கம்' },
  logout: { en: 'Logout', ta: 'வெளியேறு' },
  login: { en: 'Login', ta: 'உள்நுழைவு' },
  register: { en: 'Register', ta: 'பதிவு' },
  name: { en: 'Name', ta: 'பெயர்' },
  email: { en: 'Email', ta: 'மின்னஞ்சல்' },
  password: { en: 'Password', ta: 'கடவுச்சொல்' },
  edit: { en: 'Edit', ta: 'திருத்து' },
  delete: { en: 'Delete', ta: 'நீக்கு' },
} as const;

export type LabelKey = keyof typeof labels;

export function t(key: LabelKey, lang: Lang): string {
  return labels[key][lang];
}

export const functionTypeLabels: Record<string, { en: string; ta: string }> = {
  Wedding: { en: 'Wedding', ta: 'திருமணம்' },
  HouseWarming: { en: 'House Warming', ta: 'குடிபுகு விழா' },
  Birthday: { en: 'Birthday', ta: 'பிறந்தநாள்' },
  TempleFestival: { en: 'Temple Festival', ta: 'கோயில் திருவிழா' },
  Engagement: { en: 'Engagement', ta: 'நிச்சயதார்த்தம்' },
  Other: { en: 'Other', ta: 'மற்றவை' },
};

export const paymentModeLabels: Record<string, { en: string; ta: string }> = {
  Cash: { en: 'Cash', ta: 'பணம்' },
  UPI: { en: 'UPI', ta: 'UPI' },
  Card: { en: 'Card', ta: 'கார்டு' },
  Cheque: { en: 'Cheque', ta: 'காசோலை' },
};
