import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { NavLink, Outlet } from 'react-router-dom';

export const Default = () => {
  const { HOME, RULES, PLAY } = ROUTER_ID_TO_PATH_BUILDER;
  const NAV_LINKS = [
    {
      id: 0,
      to: HOME(),
      text: 'Главная',
    },
    {
      id: 1,
      to: RULES(),
      text: 'Правила',
    },
    {
      id: 2,
      to: PLAY(),
      text: 'Играть',
    },
  ];

  console.log('Баден!');

  return (
    <div className="">
      <header className="sticky top-0">
        <nav className="m-auto mx-auto container">
          <ul className="flex gap-2">
            {NAV_LINKS.map((navLink) => (
              <li key={navLink.id}>
                <NavLink to={navLink.to}>{navLink.text}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <hr />
      </header>
      <main className="min-h-screen mx-auto container">
        <Outlet />
      </main>
      <footer className="mt-auto">
        <hr />
        <div className="mx-auto container">footer</div>
      </footer>
    </div>
  );
};
