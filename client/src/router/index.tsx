import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { Page404 } from '@/views/Page404';
import { Home } from '@/views/Home';
import { Rules } from '@/views/Rules';
import { Play } from '@/views/Play';

import { Default as LayoutDefault } from '@/layouts/Default';
import { Empty as LayoutEmpty } from '@/layouts/Empty';

const ROUTER_IDS = Object.freeze({
  HOME: 'HOME',
  RULES: 'RULES',
  PAGE_404: 'PAGE_404',
  PLAY: 'PLAY',
});

export const ROUTER_ID_TO_PATH_BUILDER = Object.freeze({
  [ROUTER_IDS.HOME]: () => '/',
  [ROUTER_IDS.RULES]: () => '/rules',
  // TODO: переписать на qs
  [ROUTER_IDS.PLAY]: ({ sessionCode }: { sessionCode?: string } = {}) =>
    ['/play', ...(sessionCode ? [`session_code=${sessionCode}`] : [])].join('?'),
  [ROUTER_IDS.PAGE_404]: () => '/404',
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<LayoutDefault />}>
        <Route path="/" id={ROUTER_IDS.HOME} element={<Home />} />
        <Route path="/rules" id={ROUTER_IDS.RULES} element={<Rules />} />
        <Route path="/play" id={ROUTER_IDS.PLAY} element={<Play />} />
      </Route>
      <Route element={<LayoutEmpty />}>
        <Route path="/404" id={ROUTER_IDS.PAGE_404} element={<Page404 />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </>,
  ),
);
