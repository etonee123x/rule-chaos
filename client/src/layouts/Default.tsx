import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import type { FC } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

interface Props {
  hasNoFooter?: boolean;
}

export const Default: FC<Props> = ({ hasNoFooter }) => {
  const { HOME, RULES, SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;
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
      to: SESSIONS(),
      text: 'Играть',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="z-50 sticky top-0 bg-white">
        <div className="min-h-16 py-2 text-lg mx-auto container flex flex-wrap justify-between gap-y-4 items-center">
          <nav className="text-lg">
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
        </div>
        <hr />
      </header>
      <main className="mx-auto flex-1 container flex flex-col">
        <Outlet />
      </main>
      {!hasNoFooter && (
        <footer className="mt-auto">
          <hr />
          <div className="py-2 mx-auto container">footer</div>
        </footer>
      )}
    </div>
  );
};
