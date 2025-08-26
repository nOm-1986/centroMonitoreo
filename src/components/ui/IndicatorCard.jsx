// src/components/ui/IndicatorCard.jsx
import { HelpCircle } from 'lucide-react';

export default function IndicatorCard({ icon, label, value, updated }) {
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString('es-CO') 
    : value;

  return (
    <div className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow-sm">
      <div className="flex items-center mb-2">
        {icon}
        <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
          {label}
        </span>
      </div>
      <div className="flex text-white text-3xl font-bold">
        {displayValue}
        <HelpCircle
          className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1 ml-4"
          title="Ayuda"
        />
      </div>
      <div className="text-xs text-[#B0B0B0] mt-1">
        Actualizado el: {updated}
      </div>
    </div>
  );
}