type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "Головна сторінка" },
  { href: "/about", label: "Про додаток" },
  { href: "/add-task", label: "Додати завдання" },
  { href: "/statistic", label: "Статистика" },
  { href: "/tasks", label: "Всі завдання" },
];
