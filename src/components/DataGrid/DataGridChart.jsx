// src/components/DataGrid/DataGridChart.jsx

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { highchartsTheme } from './styles/highcharts';

const DataGridChart = ({ options, loading, error }) => {
  if (loading) return <div className="text-center py-8 text-gray-400">Cargando gráfico...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="mt-6 bg-[#262626] p-4 rounded-lg shadow-sm">
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...highchartsTheme, ...options }}
      />
    </div>
  );
};

export default DataGridChart;