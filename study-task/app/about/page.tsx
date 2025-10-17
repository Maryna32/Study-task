"use client";
import { Header } from "@/components/index";

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
            <img
              src="https://www.prostir.ua/wp-content/uploads/2020/02/3Z_029-e1581010556457-1024x778.jpg"
              alt="Проект"
              className="w-[300px] h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
