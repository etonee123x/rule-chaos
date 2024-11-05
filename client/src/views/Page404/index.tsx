import { Link } from 'react-router-dom';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';

export const Page404 = () => {
  const { HOME } = ROUTER_ID_TO_PATH_BUILDER;

  return (
    <>
      <div>Page404!</div>
      <Link to={HOME()}>Домой</Link>
    </>
  );
};
