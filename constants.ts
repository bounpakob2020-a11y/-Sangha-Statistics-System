
export const PROVINCES = [
  'ນະຄອນຫຼວງວຽງຈັນ', 'ຜົ້ງສາລີ', 'ຫຼວງນໍ້າທາ', 'ອຸດົມໄຊ', 'ບໍ່ແກ້ວ', 'ຫຼວງພຣະບາງ',
  'ຫົວພັນ', 'ໄຊຍະບູລີ', 'ຊຽງຂວາງ', 'ວຽງຈັນ', 'ບໍລິຄໍາໄຊ', 'ຄໍາມ່ວນ', 'ສະຫວັນນະເຂດ',
  'ສາລະວັນ', 'ເຊກອງ', 'ຈໍາປາສັກ', 'ອັດຕະປື', 'ໄຊສົມບູນ'
];

export const NATIONALITIES = ['ລາວ', 'ອື່ນໆ'];
export const RACES = ['ລາວ', 'ອື່ນໆ'];
export const ETHNICITIES = ['ລາວ', 'ມົ້ງ', 'ກຶມມຸ', 'ໄທ', 'ພວນ', 'ລື້', 'ອື່ນໆ'];

export const ETHNIC_LANG_GROUPS = [
  { id: 'Lao-Tai', label: 'ໝວດພາສາລາວ-ໄຕ' },
  { id: 'Mon-Khmer', label: 'ໝວດພາສາມອນ-ຂະແມ' },
  { id: 'Tibeto-Burman', label: 'ໝວດພາສາຈີນ-ຕີເບດ' },
  { id: 'Hmong-IuMien', label: 'ໝວດພາສາມົ້ງ-ອິວມ້ຽນ' }
];

export const EDUCATION_LEVELS = ['ບໍ່ໄດ້ຮຽນ', 'ປະຖົມ', 'ມັດທະຍົມຕົ້ນ', 'ມັດທະຍົມປາຍ', 'ປະລິນຍາຕີ', 'ປະລິນຍາໂທ', 'ປະລິນຍາເອກ'];

export const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - 30 + i).toString());

export const TEMPLES = [
  'ວັດອົງຕື້', 'ວັດສີສະເກດ', 'ວັດທາດຫຼວງ', 'ວັດສີເມືອງ', 'ວັດໄຊຍະພູມ', 'ວັດພຣະບາດ', 'ອື່ນໆ'
];
