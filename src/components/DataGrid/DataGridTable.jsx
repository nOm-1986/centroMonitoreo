// src/components/DataGrid/DataGridTable.jsx
// src/components/DataGrid/DataGridTable.jsx
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { darkTheme } from './styles/darkTheme';
import ojoAmarillo from '../../assets/ojoAmarillo.svg';
import curvaSAmarillo from '../../assets/curvaSAmarillo.svg';

const DataGridTable = ({ 
  columns, 
  data, 
  loading, 
  error, 
  onExport, 
  onViewChart,
  filters,
  setFilters,
  globalFilter,
  setGlobalFilter,
  showActionsColumn = false,
  isSTR = false,
  openFilter,
  setOpenFilter,
  showCurveButton = false
}) => {
  // Estilos personalizados mejorados para coincidir con ProjectGrid
  const customStyles = {
    tableWrapper: {
      style: {
        overflow: 'visible',
      }
    },
    table: {
      style: {
        overflow: 'visible',
      }
    },
    headCells: {
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#ffffff',
        backgroundColor: '#262626',
        overflow: 'visible',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#cccccc',
        overflow: 'visible',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      style: {
        backgroundColor: '#262626',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#1d1d1d',
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: '#3a3a3a',
        transition: '0.2s ease-in-out',
      },
      stripedStyle: {
        backgroundColor: '#1d1d1d',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#262626',
        color: '#cccccc',
        borderTop: '1px solid #1d1d1d',
        padding: '8px',
      },
    },
    paginationButtons: {
      style: {
        color: '#cccccc',
        '&:hover': {
          backgroundColor: '#3a3a3a',
        },
        '& svg': {
          stroke: '#cccccc',
        },
        '& svg path': {
          stroke: '#cccccc',
        },
      },
    },
  };

  // Función para capitalizar texto (similar a ProjectGrid)
  const titleCase = (raw) => {
    const connectors = ['y','de','la','el','los','las','en','a','por','para','con','sin','del','al','o','u'];
    return raw
      .split(' ')
      .map((word, index) => {
        if (word.includes('.')) return word.toUpperCase();
        const lower = word.toLowerCase();
        if (index > 0 && connectors.includes(lower)) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  };

  if (loading) return (
    <div className="bg-[#262626] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0s' }} />
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0.2s' }} />
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-gray-300 mt-4">Cargando datos...</p>
    </div>
  );

  if (error) return (
    <div className="bg-[#262626] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-64">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-500 text-center max-w-md">{error}</p>
    </div>
  );

  // Aplicar filtros (versión mejorada)
  const filteredData = data.filter(row => {
    // Filtro global
    if (globalFilter && !Object.values(row).some(val => 
      String(val || '').toLowerCase().includes(globalFilter.toLowerCase()))
    ) return false;
    
    // Filtros por columna
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      // Manejo de campos anidados
      if (key.includes('.')) {
        const keys = key.split('.');
        const nestedValue = keys.reduce((obj, k) => (obj || {})[k], row);
        return String(nestedValue || '').toLowerCase().includes(value.toLowerCase());
      }
      
      return String(row[key] || '').toLowerCase().includes(value.toLowerCase());
    });
  });

  // Procesar columnas para agregar filtros y formato consistente
  const processedColumns = columns.map(col => {
    if (!col.filterable) return col;
    
    return {
      ...col,
      name: (
        <div className="relative inline-block pb-11">
          <span>{col.name}</span>
          <Filter
            className={`inline ml-1 cursor-pointer ${
              filters[col.selector] ? 'text-yellow-400' : 'text-gray-500'
            }`}
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilter(openFilter === col.selector ? '' : col.selector);
            }}
          />
          {openFilter === col.selector && (
            <div className="absolute bg-[#1f1f1f] p-2 mt-1 rounded-sm shadow-sm z-50">
              <input
                type="text"
                placeholder="Buscar..."
                value={filters[col.selector] || ''}
                onChange={e => setFilters({ ...filters, [col.selector]: e.target.value })}
                className="bg-[#262626] text-white p-1 text-sm w-32"
              />
            </div>
          )}
        </div>
      ),
      cell: col.cell || ((row) => {
        const raw = row[col.selector] || '';
        if (typeof raw !== 'string') return raw;
        
        const formatted = titleCase(raw);
        const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
        return <span title={formatted}>{disp}</span>;
      })
    };
  });

  // Añadir columna de acciones si es necesario
  const finalColumns = showActionsColumn 
    ? [
        {
          /* name: (
            <div className="relative inline-block pb-0">
              Acciones
            </div>
          ), */
          name: 'Acciones',
          cell: row => (
            <div className="flex space-x-2">
              <Link 
                to={isSTR 
                  ? `/transmision_str_pages?projectId=${row.id}` 
                  : `/transmision_pages?projectId=${row.numero_convocatoria}`
                }
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={ojoAmarillo} 
                  alt="Ver proyecto" 
                  className="w-5 h-5 cursor-pointer hover:opacity-80"
                />
              </Link>
              {showCurveButton && (
                <img
                  src={curvaSAmarillo}
                  alt="Ver curva S"
                  className="w-5 h-5 cursor-pointer hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewChart && onViewChart(row);
                  }}
                />
              )}
            </div>
          ),
          ignoreRowClick: true,
          //width: showCurveButton ? '120px' : '80px',
          width:'100px',
          button: true,
          compact: true
        },
        ...processedColumns
      ]
    : processedColumns;

  return (
    <div className="bg-[#262626] p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded-sm p-2 w-1/3 focus:outline-hidden focus:ring-1 focus:ring-yellow-400"
        />
        <button
          className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded-sm hover:bg-yellow-500 transition-colors"
          onClick={() => onExport(filteredData)}
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <DataTable
        columns={finalColumns}
        data={filteredData}
        theme="customDark"
        customStyles={customStyles}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        paginationIconPrevious={<ChevronLeft size={20} stroke="#cccccc"/>}
        paginationIconNext={<ChevronRight size={20} stroke="#cccccc" />}
        paginationIconFirstPage={<ChevronLeft size={16} stroke="#cccccc" style={{ transform: 'rotate(180deg)' }} />}
        paginationIconLastPage={<ChevronRight size={16} stroke="#cccccc" style={{ transform: 'rotate(180deg)' }} />}
        highlightOnHover
        onRowClicked={undefined}
        striped
        pointerOnHover
      />
    </div>
  );
};

export default DataGridTable;