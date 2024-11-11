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

  return (
    <div className="">
      <header className="z-50 sticky top-0 bg-white">
        <nav className="py-2 text-lg mx-auto container">
          <ul className="flex gap-4">
            {NAV_LINKS.map((navLink) => (
              <li key={navLink.id}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'text-primary-500 font-semibold relative after:absolute after:bottom-0 after:block after:w-full after:h-px after:bg-current'
                      : ''
                  }
                  to={navLink.to}
                >
                  {navLink.text}
                </NavLink>
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
        <div className="py-2 mx-auto container">footer</div>
      </footer>
    </div>
  );
};
