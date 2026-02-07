import { useState } from 'react';
import BPartnerList from './components/BPartnerList';
import BPartnerForm from './components/BPartnerForm';
import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('list');

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setActiveTab('list');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Header - Responsivo */}
        <header className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">🚀</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Speedy ERP
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Sistema de Gestión de Socios de Negocio
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-900 font-medium">Sistema Activo</span>
          </div>
        </header>

        {/* Tabs - Mejorado para móvil */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${activeTab === 'list'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <span className="text-lg sm:text-xl">📋</span>
                <span className="hidden xs:inline">Listado</span>
                <span className="xs:hidden">Lista</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${activeTab === 'create'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <span className="text-lg sm:text-xl">➕</span>
                <span className="hidden xs:inline">Nuevo Tercero</span>
                <span className="xs:hidden">Nuevo</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content con animación */}
        <main className="mb-12">
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'list' && (
              <div className="animate-fadeIn">
                <BPartnerList refreshTrigger={refreshTrigger} />
              </div>
            )}

            {activeTab === 'create' && (
              <div className="animate-fadeIn">
                <BPartnerForm onSuccess={handleFormSuccess} />
              </div>
            )}
          </div>
        </main>

        {/* Footer - Mejorado */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">Speedy</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Prueba Técnica - Departamento de Tecnología e Innovación
            </p>
            <p className="text-xs text-gray-500">
              © 2026 Speedy. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;