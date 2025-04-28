import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import arrowDown from '@/images/arrow_down.svg';
import arrowUp from '@/images/arrow_up.svg';
import Breadcrumbs from "@/components/Breadcrumbs";

interface Anamnes {
  fio: string;
  birthday: string;
  scan_date: string;
  anamnes: string;
  uid: string;
}

type SortKey = 'fio' | 'birthday' | 'scan_date' | 'anamnes';

export default function PatientsPage() {
  const [data, setData] = useState<Anamnes[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('fio');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/anamnes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки карточек пациентов:', error);
      }
    };

    fetchData();
  }, []);

  const calculateAge = (birthday: string): number => {
    const birth = new Date(birthday);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const hasHadBirthdayThisYear =
      now.getMonth() > birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
  };

  const filtered = data
    .filter((item) =>
      item.fio.toLowerCase().includes(search.toLowerCase()) ||
      item.birthday.includes(search) ||
      item.scan_date.includes(search) ||
      item.anamnes.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      return sortAsc
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
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

      <Breadcrumbs
              items={[
                { label: "Все пациенты" } 
              ]}
       />

      <main className="flex-grow w-full px-8 py-10">
      <h1 className="text-[60px] font-semibold mb-10 text-black text-left tracking-wider sm:tracking-widest font-semibold mb-10 text-black text-left uppercase">
    ПАЦИЕНТЫ
    </h1>


        <input
          type="text"
          placeholder="Поиск по ФИО, возрасту, дате или диагнозу"
          className="w-full max-w-3xl mx-auto mb-20 border-4 border-[#9BBBFE] rounded-full px-6 py-3 text-lg focus:ring-3 focus:ring-[#9BBBFE] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="w-full overflow-x-auto sm:overflow-visible">
          <table className="w-full text-left">
            <thead className="text-black font-bold text-[18px]">
              <tr>
                <th className="px-4 py-2 border-r-4 border-[#9BBBFE]">№</th>
                <th className="px-4 py-2 border-r-4 border-[#9BBBFE] cursor-pointer" onClick={() => handleSort('fio')}>
                  ФИО {sortIcon('fio')}
                </th>
                <th className="px-4 py-2 border-r-4 border-[#9BBBFE] cursor-pointer" onClick={() => handleSort('birthday')}>
                  Возраст {sortIcon('birthday')}
                </th>
                <th className="px-4 py-2 border-r-4 border-[#9BBBFE] cursor-pointer" onClick={() => handleSort('scan_date')}>
                  Обновление данных {sortIcon('scan_date')}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('anamnes')}>
                  Тип обследований {sortIcon('anamnes')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}><div className="border-b-4 border-[#9BBBFE] mt-2 mb-2 hover:border-[#0957FF]" /></td>
              </tr>
              {filtered.map((item, index) => (
                <tr
                  key={item.uid}
                  className={`cursor-pointer transition duration-200 text-[18px] font-semibold border-b-4 border-[#9BBBFE] hover:bg-[#0957FF] hover:border-[#0957FF] hover:text-white ${
                    selectedUid === item.uid ? 'bg-[#0957FF] text-white' : 'text-black'
                  }`}
                  onClick={() => setSelectedUid(item.uid)}
                >
                  <td className="px-4 py-6 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-6 whitespace-nowrap">{item.fio}</td>
                  <td className="px-4 py-6 whitespace-nowrap">{calculateAge(item.birthday)}</td>
                  <td className="px-4 py-6 whitespace-nowrap">{new Date(item.scan_date).toLocaleDateString()}</td>
                  <td className="px-4 py-6 whitespace-nowrap uppercase">{item.anamnes}</td>
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
