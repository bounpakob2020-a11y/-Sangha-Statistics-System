
export enum FamilyRelation {
  TOGETHER = 'ພໍ່ແມ່ຢູ່ນໍາກັນ',
  SEPARATED = 'ແຍກກັນ',
  DIVORCED = 'ຢ່າຮ້າງ',
  OTHER = 'ອື່ນໆ'
}

export enum SanghaTitle {
  MONK = 'ພຣະ',
  NOVICE = 'ສ.ນ'
}

export interface Address {
  temple?: string;
  village: string;
  district: string;
  province: string;
}

export interface FamilyMember {
  fullName: string;
  age: number | string;
  occupation: string;
  nationality: string;
  race: string;
  ethnicity: string;
  currentAddress: Address;
  phone: string;
}

export interface SanghaMember {
  id: string;
  recordYear: string;
  photoUrl?: string;
  idCode: string;
  fullName: string;
  birthDate: string;
  age: number;
  pansa: number;
  title: SanghaTitle;
  originalAddress: Address;
  ordinationPlace: Address;
  ordinationDate: string;
  ordinationPermissionNumber: string; // New field
  ordinationPermissionDate: string;   // New field
  upajjhayaName: string;
  transferDate: string;
  suttiBookNumber: string;
  educationLevel: string;
  nationality: string;
  race: string;
  ethnicity: string;
  birthPlace: Address;
  
  currentAddress: Address;
  phone: string;

  father: FamilyMember;
  mother: FamilyMember;
  guardian: FamilyMember;
  
  familyRelation: FamilyRelation;
  familyRelationOther?: string;
  
  documents: string[];
  
  // Status Section 10
  moveOut: { monk: number; novice: number; date: string; note: string };
  moveIn: { monk: number; novice: number; date: string; note: string };
  resigned: { monk: number; novice: number; date: string; note: string };
  dead: { monk: number; novice: number };
  
  allTemples: string;
  hasTempleMonks: 'ມີ' | 'ບໍ່ມີ';
  noTempleMonks: 'ມີ' | 'ບໍ່ມີ';
  hasSim: 'ມີ' | 'ບໍ່ມີ';
  simTemple: string;
  
  ethnicGroup: 'Lao-Tai' | 'Mon-Khmer' | 'Tibeto-Burman' | 'Hmong-IuMien';
  createdAt: string;
}

export interface StatsSummary {
  totalSangha: number;
  totalMonks: number;
  totalNovices: number;
  totalMoveOut: { monk: number; novice: number };
  totalMoveIn: { monk: number; novice: number };
  totalResigned: { monk: number; novice: number };
  totalDead: { monk: number; novice: number };
  totalTemples: number;
  templesWithMonks: number;
  templesWithoutMonks: number;
  totalSims: number;
  ethnicGroups: {
    laoTai: number;
    monKhmer: number;
    tibetoBurman: number;
    hmongIuMien: number;
  };
}
