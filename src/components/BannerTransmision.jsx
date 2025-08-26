// src/components/BannerTransmision.jsx
import React from 'react';
import PropTypes from 'prop-types';
import bannerImage from '../assets/bannerCentroMonitoreoTransmision.png';
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg'

export default function BannerTransmision({ onClick }) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 mt-6">
      <img
        src={bannerImage}
        alt="Transmisión"
        className="w-full object-cover h-[170px]"
      />
      <div className="absolute inset-0 flex justify-between items-center px-6">
        <h1 className="text-6xl font-semibold text-white mb-4">
           Transmisión
        </h1>
        <img src={GWOff} className="w-24 h-24 shrink-0"/>
      </div>
    </div>
  );
}

BannerTransmision.propTypes = {
  onClick: PropTypes.func,
};
BannerTransmision.defaultProps = {
  onClick: () => {},
};