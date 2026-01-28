
import React, { useState, useEffect, useRef } from 'react';
import { SanghaMember, SanghaTitle, FamilyRelation, Address } from '../types';
import { YEARS, PROVINCES, NATIONALITIES, ETHNICITIES, RACES, EDUCATION_LEVELS, TEMPLES } from '../constants';
import Swal from 'sweetalert2';
import { Save, Trash2, Edit2, RotateCcw, Upload, FileText, User, Home, Users, Settings, Info, Camera, MapPin, BookOpen } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AdminTabProps {
  onSave: (member: SanghaMember) => void;
  members: SanghaMember[];
  onEdit: (member: SanghaMember) => void;
  onDelete: (id: string) => void;
  editingMember: SanghaMember | null;
}

const emptyAddress = (): Address => ({ village: '', district: '', province: PROVINCES[0] });
const emptyFamily = () => ({
  fullName: '',
  age: '',
  occupation: '',
  nationality: NATIONALITIES[0],
  race: RACES[0],
  ethnicity: ETHNICITIES[0],
  currentAddress: emptyAddress(),
  phone: ''
});

const initialFormState = (): SanghaMember => ({
  id: Math.random().toString(36).substr(2, 9),
  recordYear: new Date().getFullYear().toString(),
  photoUrl: '',
  idCode: '',
  fullName: '',
  birthDate: new Date().toISOString().split('T')[0],
  age: 0,
  pansa: 0,
  title: SanghaTitle.MONK,
  originalAddress: { ...emptyAddress(), temple: '' },
  ordinationPlace: { ...emptyAddress(), temple: '' },
  ordinationDate: new Date().toISOString().split('T')[0],
  ordinationPermissionNumber: '',
  ordinationPermissionDate: '',
  upajjhayaName: '',
  transferDate: '',
  suttiBookNumber: '',
  educationLevel: EDUCATION_LEVELS[0],
  nationality: NATIONALITIES[0],
  race: RACES[0],
  ethnicity: ETHNICITIES[0],
  birthPlace: emptyAddress(),
  currentAddress: emptyAddress(),
  phone: '',
  father: emptyFamily(),
  mother: emptyFamily(),
  guardian: emptyFamily(),
  familyRelation: FamilyRelation.TOGETHER,
  documents: [],
  moveOut: { monk: 0, novice: 0, date: '', note: '' },
  moveIn: { monk: 0, novice: 0, date: '', note: '' },
  resigned: { monk: 0, novice: 0, date: '', note: '' },
  dead: { monk: 0, novice: 0 },
  allTemples: TEMPLES[0],
  hasTempleMonks: 'ມີ',
  noTempleMonks: 'ບໍ່ມີ',
  hasSim: 'ມີ',
  simTemple: TEMPLES[0],
  ethnicGroup: 'Lao-Tai',
  createdAt: new Date().toISOString()
});

export const AdminTab: React.FC<AdminTabProps> = ({ onSave, members, onEdit, onDelete, editingMember }) => {
  const [formData, setFormData] = useState<SanghaMember>(initialFormState());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMember) {
      setFormData(editingMember);
    }
  }, [editingMember]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parts = name.split('.');

    setFormData(prev => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newState;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'ກໍາລັງບັນທຶກຂໍ້ມູນ...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(formData);
    
    Swal.fire({
      icon: 'success',
      title: 'ບັນທຶກຂໍ້ມູນສໍາເລັດ!',
      timer: 1500,
      showConfirmButton: false
    });
    setFormData(initialFormState());
  };

  const handleClear = () => {
    setFormData(initialFormState());
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Swal.fire({
      title: 'ກໍາລັງໂຫລດຂໍ້ມູນ...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setTimeout(() => {
          Swal.fire({ icon: 'success', title: 'Import ສໍາເລັດ!', text: `ນໍາເຂົ້າ ${json.length} ລາຍການ`, timer: 2000 });
        }, 1000);
      } catch (err) {
        Swal.fire('ຜິດພາດ', 'ບໍ່ສາມາດອ່ານໄຟລ໌ໄດ້', 'error');
      }
    };
    reader.readAsBinaryString(file);
  };

  const SectionHeader = ({ icon: Icon, title, number }: { icon: any, title: string, number?: string }) => (
    <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-3">
      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm ring-1 ring-amber-100">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">{number ? `${number}. ` : ''}{title}</h3>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FileText size={28} /> ຟອມປ້ອນຂໍ້ມູນ
              </h2>
              <p className="text-amber-100 text-sm mt-1"> Sangha Statistics Admin Panel</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">ປະຈໍາປີ (ຄ.ສ)</label>
              <select 
                name="recordYear" 
                value={formData.recordYear} 
                onChange={handleInputChange}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-lg"
              >
                {YEARS.map(y => <option key={y} value={y} className="text-slate-800">{y}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSave} className="p-10 space-y-16">
          {/* Section 1 */}
          <section>
            <SectionHeader icon={User} title="ຂໍ້ມູນສ່ວນຕົວ" number="1" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 p-8 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group">
                <div className="w-36 h-48 bg-white rounded-2xl shadow-md flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden border border-slate-100 relative">
                  <Camera className="text-slate-300 group-hover:text-amber-500" size={48} />
                </div>
                <p className="text-sm font-bold text-slate-400 group-hover:text-amber-600 transition-colors">ຮູບພາບ (3x4)</p>
                <input type="file" className="hidden" />
              </div>
              
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ລະຫັດ</label>
                  <input name="idCode" value={formData.idCode} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none" placeholder="ປ້ອນລະຫັດ" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600">ຊື່ ແລະ ນາມສະກຸນ</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none" placeholder="ປ້ອນຊື່ ແລະ ນາມສະກຸນ" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ວັນເດືອນປີເກີດ (ຄ.ສ)</label>
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 transition-all outline-none focus:border-amber-500" />
                </div>
                <div className="space-y-2 flex gap-4">
                  <div className="w-1/2">
                    <label className="text-sm font-bold text-slate-600">ອາຍຸ (ປີ)</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" />
                  </div>
                  <div className="w-1/2">
                    <label className="text-sm font-bold text-slate-600">ພັນສາ</label>
                    <input type="number" name="pansa" value={formData.pansa} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ຄໍານໍາໜ້າ</label>
                  <select name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-amber-500">
                    <option value={SanghaTitle.MONK}>ພຣະ</option>
                    <option value={SanghaTitle.NOVICE}>ສ.ນ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ວັນເດືອນປີບວດ (ຄ.ສ)</label>
                  <input type="date" name="ordinationDate" value={formData.ordinationDate} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ເລກທີ່ອະນຸຍາດບວດ</label>
                  <input name="ordinationPermissionNumber" value={formData.ordinationPermissionNumber} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 transition-all outline-none focus:border-amber-500" placeholder="ປ້ອນເລກທີ່" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ລົງວັນທີ</label>
                  <input type="date" name="ordinationPermissionDate" value={formData.ordinationPermissionDate} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 transition-all outline-none focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ຊື່ພຣະອຸປັດຊາ</label>
                  <input name="upajjhayaName" value={formData.upajjhayaName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" placeholder="ປ້ອນຊື່" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="md:col-span-4 flex items-center gap-2 mb-2 font-bold text-slate-700">ທີ່ຢູ່ເດີມ</div>
               <input placeholder="ວັດ" name="originalAddress.temple" value={formData.originalAddress.temple} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
               <input placeholder="ບ້ານ" name="originalAddress.village" value={formData.originalAddress.village} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
               <input placeholder="ເມືອງ" name="originalAddress.district" value={formData.originalAddress.district} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
               <select name="originalAddress.province" value={formData.originalAddress.province} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
               </select>

               <div className="md:col-span-4 flex items-center gap-2 mt-4 font-bold text-slate-700">ບ່ອນບວດ</div>
               <input placeholder="ວັດ" name="ordinationPlace.temple" value={formData.ordinationPlace.temple} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
               <input placeholder="ບ້ານ" name="ordinationPlace.village" value={formData.ordinationPlace.village} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
               <input placeholder="ເມືອງ" name="ordinationPlace.district" value={formData.ordinationPlace.district} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
               <select name="ordinationPlace.province" value={formData.ordinationPlace.province} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
               </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ວັນເດືອນປີຍ້າຍ (ຄ.ສ)</label>
                  <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ເລກທີ່ປຶ້ມສຸດທິ</label>
                  <input name="suttiBookNumber" value={formData.suttiBookNumber} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" placeholder="ປ້ອນເລກທີ່" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ລະດັບການສຶກສາ</label>
                  <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ສັນຊາດ</label>
                  <select name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                    {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ເຊື້ອຊາດ</label>
                  <select name="race" value={formData.race} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                    {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ຊົນເຜົ່າ</label>
                  <select name="ethnicity" value={formData.ethnicity} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                    {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="md:col-span-3 font-bold text-slate-700 text-sm">ສະຖານທີ່ເກີດ</div>
                <input placeholder="ບ້ານ" name="birthPlace.village" value={formData.birthPlace.village} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
                <input placeholder="ເມືອງ" name="birthPlace.district" value={formData.birthPlace.district} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
                <select name="birthPlace.province" value={formData.birthPlace.province} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <SectionHeader icon={Home} title="ຂໍ້ມູນທີ່ຢູ່ / ການຕິດຕໍ່" number="2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600">ທີ່ຢູ່ປັດຈຸບັນ</label>
                  <input name="currentAddress.temple" value={formData.currentAddress.temple || ''} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" placeholder="ວັດ..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ບ້ານ</label>
                  <input name="currentAddress.village" value={formData.currentAddress.village} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ເມືອງ</label>
                  <input name="currentAddress.district" value={formData.currentAddress.district} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ແຂວງ</label>
                  <select name="currentAddress.province" value={formData.currentAddress.province} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">ເບີໂທ</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5" placeholder="020..." />
                </div>
            </div>
          </section>

          {/* Family Sections */}
          <section className="space-y-12">
            <SectionHeader icon={Users} title="ຂໍ້ມູນຄອບຄົວ / ຜູ້ປົກຄອງ" number="3, 5, 7" />
            
            {['father', 'mother', 'guardian'].map((key) => (
              <div key={key} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
                <h4 className="text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-4">
                  {key === 'father' ? 'ຂໍ້ມູນພໍ່' : key === 'mother' ? 'ຂໍ້ມູນແມ່' : 'ຂໍ້ມູນຜູ້ປົກຄອງ'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-1"><input placeholder="ຊື່ ແລະ ນາມສະກຸນ" name={`${key}.fullName`} value={(formData as any)[key].fullName} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5" /></div>
                  <input placeholder="ອາຍຸ" type="number" name={`${key}.age`} value={(formData as any)[key].age} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5" />
                  <input placeholder="ອາຊີບ" name={`${key}.occupation`} value={(formData as any)[key].occupation} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5" />
                  <select name={`${key}.nationality`} value={(formData as any)[key].nationality} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5">
                    {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <select name={`${key}.race`} value={(formData as any)[key].race} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5">
                    {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select name={`${key}.ethnicity`} value={(formData as any)[key].ethnicity} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5">
                    {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="font-bold text-slate-600 text-sm mt-4">ຂໍ້ມູນທີ່ຢູ່ / ການຕິດຕໍ່</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <input placeholder="ທີ່ຢູ່ປັດຈຸບັນບ້ານ" name={`${key}.currentAddress.village`} value={(formData as any)[key].currentAddress.village} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
                   <input placeholder="ເມືອງ" name={`${key}.currentAddress.district`} value={(formData as any)[key].currentAddress.district} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
                   <select name={`${key}.currentAddress.province`} value={(formData as any)[key].currentAddress.province} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                     {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                   <input placeholder="ເບີໂທ" name={`${key}.phone`} value={(formData as any)[key].phone} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5" />
                </div>
              </div>
            ))}
          </section>

          {/* Section 8 */}
          <section>
            <SectionHeader icon={Info} title="ສະຖານະພາບຄອບ / ຄວາມສໍາພັນ" number="8" />
            <div className="flex flex-wrap gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
              {Object.values(FamilyRelation).map(rel => (
                <label key={rel} className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 cursor-pointer hover:border-amber-400">
                  <input type="radio" name="familyRelation" value={rel} checked={formData.familyRelation === rel} onChange={handleInputChange} className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-slate-700">{rel}</span>
                </label>
              ))}
              {formData.familyRelation === FamilyRelation.OTHER && (
                <input name="familyRelationOther" value={formData.familyRelationOther || ''} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-full px-6 py-3 min-w-[300px]" placeholder="ລະບຸ..." />
              )}
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <SectionHeader icon={BookOpen} title="ເອກະສານ" number="9" />
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 flex flex-col items-center">
              <Upload size={48} className="text-slate-300 mb-4" />
              <p className="font-bold text-slate-600">ເພິ່ມໄຟລ໌ໄດ້ (ແນບໄຟລ໌ຫຼາຍໄຟລ໌)</p>
              <input type="file" multiple className="mt-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <SectionHeader icon={Settings} title="ໝາຍເຫດ ແລະ ສະຖານະການປ່ຽນແປງ" number="10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                 <h5 className="font-bold text-slate-700 underline">ຍ້າຍອອກ</h5>
                 <div className="grid grid-cols-2 gap-4">
                   <input type="number" name="moveOut.monk" value={formData.moveOut.monk} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" placeholder="ພຣະ: (ລະບຸ)" />
                   <input type="number" name="moveOut.novice" value={formData.moveOut.novice} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" placeholder="ເນນ: (ລະບຸ)" />
                 </div>
                 <input type="date" name="moveOut.date" value={formData.moveOut.date} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" />
               </div>

               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                 <h5 className="font-bold text-slate-700 underline">ຍ້າຍເຂົ້າ</h5>
                 <div className="grid grid-cols-2 gap-4">
                   <input type="number" name="moveIn.monk" value={formData.moveIn.monk} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" placeholder="ພຣະ: (ລະບຸ)" />
                   <input type="number" name="moveIn.novice" value={formData.moveIn.novice} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" placeholder="ເນນ: (ລະບຸ)" />
                 </div>
                 <input type="date" name="moveIn.date" value={formData.moveIn.date} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" />
               </div>

               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                 <h5 className="font-bold text-slate-700 underline">ລາສິກຂາ</h5>
                 <div className="grid grid-cols-2 gap-4">
                   <input type="number" name="resigned.monk" value={formData.resigned.monk} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" placeholder="ພຣະ: (ລະບຸ)" />
                   <input type="number" name="resigned.novice" value={formData.resigned.novice} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" placeholder="ເນນ: (ລະບຸ)" />
                 </div>
                 <input type="date" name="resigned.date" value={formData.resigned.date} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2" />
               </div>

               <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">ວັດທັງໝົດ</label>
                    <select name="allTemples" value={formData.allTemples} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                      {TEMPLES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">ວັດມີພຣະສົງ</label>
                    <select name="hasTempleMonks" value={formData.hasTempleMonks} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                      <option value="ມີ">ມີ</option>
                      <option value="ບໍ່ມີ">ບໍ່ມີ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">ວັດມີບໍ່ພຣະສົງ</label>
                    <select name="noTempleMonks" value={formData.noTempleMonks} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                      <option value="ບໍ່ມີ">ບໍ່ມີ</option>
                      <option value="ມີ">ມີ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">ມໍລະນະພາບ</label>
                    <div className="flex gap-2">
                      <input type="number" name="dead.monk" value={formData.dead.monk} onChange={handleInputChange} className="w-1/2 bg-white border border-slate-200 rounded-xl px-4 py-2.5" placeholder="ພຣະ: (ລະບຸ)" />
                      <input type="number" name="dead.novice" value={formData.dead.novice} onChange={handleInputChange} className="w-1/2 bg-white border border-slate-200 rounded-xl px-4 py-2.5" placeholder="ເນນ: (ລະບຸ)" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold">ສິມ</label>
                    <div className="flex gap-2">
                      <select name="simTemple" value={formData.simTemple} onChange={handleInputChange} className="w-1/2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                        <option value="">ວັດ: (ເລືອກ)</option>
                        {TEMPLES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <select name="hasSim" value={formData.hasSim} onChange={handleInputChange} className="w-1/4 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                        <option value="ມີ">ມີ</option>
                        <option value="ບໍ່ມີ">ບໍ່ມີ</option>
                      </select>
                    </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-6 pt-12 border-t border-slate-200">
            <button type="submit" className="gradient-btn bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl">
              <Save size={24} /> ບັນທຶກຂໍ້ມູນ
            </button>
            <button type="button" onClick={handleClear} className="bg-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-slate-300 shadow-md">
              <RotateCcw size={24} /> ລ້າງຟອມ
            </button>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <input type="file" ref={fileInputRef} onChange={handleImportExcel} className="hidden" accept=".xlsx, .xls" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-indigo-700 border border-indigo-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 shadow-sm">
                <Upload size={20} /> ເລືອກໄຟລ໌ Excel
              </button>
              <button type="button" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700">
                ອັບໂຫລດແລະບັນທຶກ
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800">ຕາຕະລາງຂໍ້ມູນ (ຈັດການ)</h2>
          <span className="bg-amber-100 text-amber-700 px-6 py-2 rounded-full text-sm font-black shadow-sm ring-1 ring-amber-200">
            ທັງໝົດ {members.length} ລາຍການ
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-8 py-5">ລະຫັດ</th>
                <th className="px-8 py-5">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="px-8 py-5">ຕໍາແໜ່ງ</th>
                <th className="px-8 py-5">ອາຍຸ/ພັນສາ</th>
                <th className="px-8 py-5 text-right">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5 font-mono text-sm">{m.idCode}</td>
                  <td className="px-8 py-5 font-bold text-slate-700">{m.fullName}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ring-1 ${m.title === SanghaTitle.MONK ? 'bg-orange-50 text-orange-700 ring-orange-100' : 'bg-blue-50 text-blue-700 ring-blue-100'}`}>
                      {m.title}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-500">{m.age} ປີ / {m.pansa} ພັນສາ</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => onEdit(m)} className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all shadow-sm ring-1 ring-amber-100">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => onDelete(m.id)} className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm ring-1 ring-rose-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
