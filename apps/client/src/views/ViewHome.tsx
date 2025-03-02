import { BasePage } from '@/components/BasePage';
import { UI } from '@rule-chaos/helpers/ui';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

export const ViewHome = () => {
  const { SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;

  return (
    <BasePage>
      <div>
        <div>Фигня для наполнения главной страницы контентом</div>
        <div>Играй и, сука, выигрывай</div>
        <Link className={classNames([UI.BUTTON._name, 'text-3xl h-unset py-2 px-4 inline-block'])} to={SESSIONS()}>
          Играть!
        </Link>
      </div>
    </BasePage>
  );
};
