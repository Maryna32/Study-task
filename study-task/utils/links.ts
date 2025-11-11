type NavLink = {
  href: string;
  label: string;
  public: boolean;
};

export const links: NavLink[] = [
  { href: "/", label: "Головна сторінка", public: true },
  { href: "/about", label: "Про додаток", public: true },
  { href: "/add-task", label: "Додати завдання", public: false },
  { href: "/statistic", label: "Статистика", public: false },
  { href: "/tasks", label: "Всі завдання", public: false },
];
