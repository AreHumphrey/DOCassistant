import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import arrowDown from '@/images/arrow_down.svg';
import arrowUp from '@/images/arrow_up.svg';

interface SavedPrompt {
  id: number;
  prompt_name: string;
  prompt: string;
  purpose: string;
  gpt_answer: string;
  filenames: string[];
  thread_id: string;
  created_at: string;
  full_name?: string;
  age?: number;
}

type SortKey = 'id' | 'full_name' | 'age' | 'created_at' | 'purpose';

const fakeData: SavedPrompt[] = [
  {
    id: 1,
    prompt_name: '',
    prompt: '',
    purpose: '',
    gpt_answer: '',
    filenames: [],
    thread_id: '',
    created_at: '',
    full_name: 'Иванов Иван Иванович',
    age: 45,
  },
  {
    id: 2,
    prompt_name: '',
    prompt: '',
    purpose: '',
    gpt_answer: '',
    filenames: [],
    thread_id: '',
    created_at: '',
    full_name: 'Петрова Анна Сергеевна',
    age: 32,
  },
  {
    id: 3,
    prompt_name: '',
    prompt: '',
    purpose: '',
    gpt_answer: '',
    filenames: [],
    thread_id: '',
    created_at: '',
    full_name: 'Сидоров Николай Павлович',
    age: 60,
  },
];

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Токен отсутствует. Невозможно загрузить историю.');
        return;
      }
  
      try {
        const response = await axios.get('/api/saved_prompts/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const fetched = response.data?.saved_prompts ?? [];
  
        const enriched = fetched.map((item: any) => {
          const fio = item.anamnes?.fio || 'ФИО не указано';
          const birthDate = item.anamnes?.birthday;
          let age: number | undefined;
  
          if (birthDate) {
            const birth = new Date(birthDate);
            const now = new Date();
            age = now.getFullYear() - birth.getFullYear();
            const hasHadBirthdayThisYear =
              now.getMonth() > birth.getMonth() ||
              (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
            if (!hasHadBirthdayThisYear) age -= 1;
          }
  
          return {
            ...item,
            full_name: fio,
            age: age ?? 0,
          };
        });
  
        setPrompts(enriched);
      } catch (error) {
        console.error('Ошибка загрузки истории запросов:', error);
      }
    };
  
    fetchPrompts();
  }, []);
  
  

  const filtered = prompts
    .filter(
      (p) =>
        p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(p.age).includes(search) ||
        new Date(p.created_at).toLocaleDateString().includes(search) ||
        p.purpose.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortIcon = (key: SortKey) => {
    if (key !== sortKey) return <img src={arrowDown} alt="sort" className="inline w-4 h-4 ml-1 opacity-30" />;
    return sortAsc
      ? <img src={arrowUp} alt="asc" className="inline w-4 h-4 ml-1" />
      : <img src={arrowDown} alt="desc" className="inline w-4 h-4 ml-1" />;
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full px-8 py-10">

        <h1 className="text-[50px] font-semibold mb-10 text-black text-left tracking-wider sm:tracking-widest font-semibold mb-10 text-black text-left uppercase">
  ЗАПРОСЫ ИИ
</h1>

        <input
          type="text"
          placeholder="Поиск по ФИО, возрасту, дате или типу обследования"
          className="w-full max-w-3xl mx-auto mb-20 border-4 border-[#9BBBFE] rounded-full px-6 py-3 text-lg focus:ring-3 focus:ring-[#9BBBFE] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        <div className="w-full overflow-x-auto sm:overflow-visible">

          <table className="w-full text-left">
            <thead className="text-black font-bold text-[18px]">
              <tr>
                <th className="px-4 py-2 border-r-4 border-[#9BBBFE] cursor-pointer" onClick={() => handleSort('id')}>
                  № {sortIcon('id')}
                </th>
                <th className="px-4 py-2 cursor-pointer border-r-4 border-[#9BBBFE]" onClick={() => handleSort('full_name')}>
                  ФИО {sortIcon('full_name')}
                </th>
                <th className="px-4 py-2 cursor-pointer border-r-4 border-[#9BBBFE]" onClick={() => handleSort('age')}>
                  Возраст {sortIcon('age')}
                </th>
                <th className="px-4 py-2 cursor-pointer border-r-4 border-[#9BBBFE]" onClick={() => handleSort('created_at')}>
                  Обновление данных {sortIcon('created_at')}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('purpose')}>
                  Тип обследований {sortIcon('purpose')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}><div className="border-b-4 border-[#9BBBFE] mt-2 mb-2 hover:border-[#0957FF]"  /></td>
              </tr>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className={`cursor-pointer transition duration-200 text-[18px] font-semibold border-b-4 border-[#9BBBFE] hover:bg-[#0957FF] hover:border-[#0957FF] hover:text-white ${
                    selectedId === item.id ? 'bg-[#0957FF] text-white' : 'text-black'
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <td className="px-4 py-6 whitespace-nowrap">{item.id}</td>
                  <td className="px-4 py-6 whitespace-nowrap">{item.full_name}</td>
                  <td className="px-4 py-6 whitespace-nowrap">{item.age}</td>
                  <td className="px-4 py-6 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-6 whitespace-nowrap uppercase">{item.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-24" />
      </main>

      <Footer />
    </div>
  );
}