// src/components/ui/ImpactBadge.jsx

import { COLORS_SCHEMES } from '../../config/colors';

export const ImpactBadge = ({ classification }) => {
  const IMPACT_CLASSES = {
    'A': {
      bg: COLORS_SCHEMES.BLUE.bg,
      text: COLORS_SCHEMES.BLUE.text,
      tooltip: 'Aumento de Confiabilidad'
    },
    'B': {
      bg: COLORS_SCHEMES.GREEN.bg,
      text: COLORS_SCHEMES.GREEN.text,
      tooltip: 'Disminución o eliminación de Restricciones operativas'
    },
    'C': {
      bg: COLORS_SCHEMES.PURPLE.bg,
      text: COLORS_SCHEMES.PURPLE.text,
      tooltip: 'Disminución o eliminación de Restricciones eléctricas'
    },
    'D': {
      bg: COLORS_SCHEMES.GRAY.bg,
      text: COLORS_SCHEMES.GRAY.text,
      tooltip: 'Disminución DNA'
    },
    default: {
      bg: COLORS_SCHEMES.RED.bg,
      text: COLORS_SCHEMES.RED.text,
      tooltip: 'Clasificación no definida'
    }
  };

  const impactClass = IMPACT_CLASSES[classification] || IMPACT_CLASSES.default;

  return (
    <div className="group relative inline-block">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${impactClass.bg} ${impactClass.text}`}>
        {classification}
      </span>
      <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded-sm p-2 whitespace-nowrap bottom-full mb-2 transform -translate-x-1/2 left-1/2 shadow-lg">
        {impactClass.tooltip}
        <div className="absolute w-2 h-2 bg-gray-800 rotate-45 bottom-0 left-1/2 -mb-1 -ml-1"></div>
      </div>
    </div>
  );
};