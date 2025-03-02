import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { ViewPage404 } from '@/views/ViewPage404';
import { ViewHome } from '@/views/ViewHome';
import { ViewRules } from '@/views/ViewRules';

import { Default as LayoutDefault } from '@/layouts/Default';
import { Empty as LayoutEmpty } from '@/layouts/Empty';
import type { Session } from '@/api/sessions';
import { ViewSessions } from '@/views/ViewSessions/ViewSessions';
import { ViewSession } from '@/views/ViewSessions/ViewSession';

const ROUTER_IDS = Object.freeze({
  HOME: 'HOME',
  RULES: 'RULES',
  PAGE_404: 'PAGE_404',
  PLAY: 'PLAY',
  SESSIONS: 'SESSIONS',
  SESSION: 'SESSION',
});

export const ROUTER_ID_TO_PATH_BUILDER = Object.freeze({
  [ROUTER_IDS.HOME]: () => '/',
  [ROUTER_IDS.RULES]: () => '/rules',
  [ROUTER_IDS.SESSIONS]: () => '/sessions',
  [ROUTER_IDS.SESSION]: (id: Session['id']) => `/sessions/${id}`,
  [ROUTER_IDS.PAGE_404]: () => '/404',
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<LayoutDefault />}>
        <Route path="/" id={ROUTER_IDS.HOME} element={<ViewHome />} />
        <Route path="/rules" id={ROUTER_IDS.RULES} element={<ViewRules />} />
        <Route path="/sessions">
          <Route index id={ROUTER_IDS.SESSIONS} element={<ViewSessions />} />
        </Route>
      </Route>
      <Route element={<LayoutDefault hasNoFooter />}>
        <Route path="/sessions/:id" id={ROUTER_IDS.SESSION} element={<ViewSession />} />
      </Route>
      <Route element={<LayoutEmpty />}>
        <Route path="/404" id={ROUTER_IDS.PAGE_404} element={<ViewPage404 />} />
        <Route path="*" element={<ViewPage404 />} />
      </Route>
    </>,
  ),
);
