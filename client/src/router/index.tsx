import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { ViewPage404 } from '@/views/ViewPage404';
import { ViewHome } from '@/views/ViewHome';
import { ViewRules } from '@/views/ViewRules';
import { ViewPlay } from '@/views/ViewPlay';
import { FormSessionConnection } from '@/components/FormSessionConnection';

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
  [ROUTER_IDS.PLAY]: () => '/play',
  [ROUTER_IDS.PAGE_404]: () => '/404',
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<LayoutDefault />}>
        <Route path="/" id={ROUTER_IDS.HOME} element={<ViewHome />} />
        <Route path="/rules" id={ROUTER_IDS.RULES} element={<ViewRules />} />
      </Route>
      <Route element={<LayoutDefault componentHeaderEnd={<FormSessionConnection />} />}>
        <Route path="/play" id={ROUTER_IDS.PLAY} element={<ViewPlay />} />
      </Route>
      <Route element={<LayoutEmpty />}>
        <Route path="/404" id={ROUTER_IDS.PAGE_404} element={<ViewPage404 />} />
        <Route path="*" element={<ViewPage404 />} />
      </Route>
    </>,
  ),
);