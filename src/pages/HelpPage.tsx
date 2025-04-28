import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Breadcrumbs from "@/components/Breadcrumbs";

export default function HelpPage() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow w-full px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-[40px] font-semibold mb-10 text-black text-left tracking-wider sm:tracking-widest font-semibold mb-10 text-black text-left uppercase">
        КОНТАКТНАЯ ИНФОРМАЦИЯ
    </h1>
        

        <div className="flex flex-col gap-6 text-[18px] leading-snug">
          <div>
            <p className="font-semibold">ОАНО ДПО «СКАЕНГ»</p>
          </div>

          <div>
            <p className="font-semibold">Дата создания:</p>
            <p className="text-[#333]">9 декабря 2017 г.</p>
          </div>

          <div>
            <p className="font-semibold">Учредитель:</p>
            <p className="text-[#333]">Общество с ограниченной ответственностью <span className="text-[#0A57FF] font-semibold">«СКАЕНГ»</span></p>
          </div>

          <div>
            <p className="font-semibold">Наименование представительств и филиалов образовательной организации:</p>
            <p className="text-[#333]">Отсутствуют филиалы и представительства</p>
          </div>

          <div>
            <p className="font-semibold">Режим и график работы:</p>
            <p className="text-[#333]">С понедельника по пятницу <span className="text-[#0A57FF]">10:00–19:00</span></p>
          </div>

          <div>
            <p className="font-semibold">Адрес местонахождения:</p>
            <p className="text-[#333]">
              109004, г. Москва, вн. тер. г. муниципальный округ Таганский, ул. Александра Солженицына, д. 23А, стр. 4, этаж/помещ. 1/III, ком. 1
            </p>
          </div>

          <div>
            <p className="font-semibold">Контакты:</p>
            <p className="text-[#0A57FF] font-semibold">skypro-support@skyeng.ru</p>
            <p className="text-[#0A57FF] font-semibold">+7 495 137 85 99</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
