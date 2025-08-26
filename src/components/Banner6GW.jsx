import { Button } from "./ui/Button";

import PropTypes from 'prop-types';
import bannerImage from '../assets/bannerEstrategia6GW.png';
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg'
import { Link } from 'react-router-dom';

export function Banner6GW({ onClick }) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 mt-6">
      <img
        src={bannerImage}
        alt="Estrategia 6GW Plus"
        className="w-full object-cover h-[170px]"
      />
      
        <div className="absolute inset-0 flex flex-col justify-center items-start px-6">
          <h1 className="text-6xl font-semibold text-white mb-4">
            Estrategia 6GW+
          </h1>
          <Link to="/6GW+">
            <Button
            >
              Consultar
            </Button>
          </Link>
        </div>
        <img src={GWOff} className="w-24 h-24 shrink-0 absolute right-6 top-7"/>
      
    </div>
  );
}

Banner6GW.propTypes = {
  onClick: PropTypes.func,
};
Banner6GW.defaultProps = {
  onClick: () => {},
};
