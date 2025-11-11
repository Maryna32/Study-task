"use client";
import { Header } from "@/components/index";
import Image from "next/image";
import image1 from "@/app/image/photo.png";

function AboutPage() {
  return (
    <div>
      <Header />
      <div className="max-w-7xl pl-[30px] pt-[20px]">
        <h1 className="text-3xl font-bold mb-8">Про додаток</h1>
        <div className="flex items-start space-x-6">
          <div className="flex-1 space-y-6 text-left">
            <p>
              Цей додаток допомагає робити день організованішим, зменшити хаос і
              стрес, концентруватися на важливих завданнях та виконувати їх
              більш ефективно.
            </p>

            <p>
              Як ним користуватись? Все дуже просто: спершу потрібно
              зареєструватися або увійти у свій акаунт. Потім можна додавати
              завдання з усіма деталями, переглядати список та статистику, а
              також за потреби редагувати або видаляти завдання. Також можна
              фільтрувати. Якщо буде наближатися дедлайн, система попередить про
              це.
            </p>

            <p>
              Цей сайт розробила Бурда Марина, студентка групи КІУКІу-23-1.
              Осінь 2025 року.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src={image1}
              alt="Проект"
              className="w-[300px] h-auto rounded-lg mix-blend-screen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
