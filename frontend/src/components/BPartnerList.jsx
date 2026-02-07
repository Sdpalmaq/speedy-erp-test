import { useState, useEffect } from 'react';
import { bpartnerService } from '../services/api';

function BPartnerList({ refreshTrigger }) {
    const [bpartners, setBpartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBPartners();
    }, [refreshTrigger]);

    const fetchBPartners = async (search = '') => {
        try {
            setLoading(true);
            setError(null);
            const response = await bpartnerService.getAll(search);
            setBpartners(response.data);
        } catch (err) {
            setError(err.message || 'Error al cargar los terceros');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBPartners(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchBPartners('');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className='flex flex-col items-center justify-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4'></div>
                    <p className="text-gray-600 font-medium">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header del módulo */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📋</span>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Listado de Terceros
                        </h2>
                        <p className="text-blue-100 text-sm mt-0.5">
                            Gestiona tus socios de negocio
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Barra de búsqueda mejorada */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                🔍
                            </span>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="Buscar por nombre o RUC/Cédula..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                            >
                                <span className="hidden sm:inline">Buscar</span>
                                <span className="sm:hidden">🔍</span>
                            </button>
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
                                    onClick={handleClearSearch}
                                >
                                    <span className="hidden sm:inline">Limpiar</span>
                                    <span className="sm:hidden">✕</span>
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Mensaje de error */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <p className="text-red-800 font-medium">Error</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Sin resultados */}
                {bpartners.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📭</span>
                        </div>
                        <p className="text-gray-600 font-medium text-lg mb-2">
                            No se encontraron terceros
                        </p>
                        <p className="text-gray-500 text-sm">
                            {searchTerm ? 'Intenta con otra búsqueda' : 'Comienza agregando un nuevo tercero'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Contador de resultados */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">{bpartners.length}</span>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    {bpartners.length === 1 ? 'Registro encontrado' : 'Registros encontrados'}
                                </p>
                            </div>
                        </div>

                        {/* Vista de tabla para desktop */}
                        <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Código
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            RUC/Cédula
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Grupo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bpartners.map((bp) => (
                                        <tr key={bp.C_BPARTNER_ID} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                                                    {bp.CODE}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-gray-900">{bp.NAME}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-700 font-medium">{bp.TAXID || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                                    {bp.GROUP_NAME || '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Vista de cards para móvil y tablet */}
                        <div className="lg:hidden space-y-4">
                            {bpartners.map((bp) => (
                                <div
                                    key={bp.C_BPARTNER_ID}
                                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all"
                                >
                                    {/* Código - Header del card */}
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                                            {bp.CODE}
                                        </span>
                                    </div>

                                    {/* Información principal */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                                                Nombre
                                            </label>
                                            <p className="text-gray-900 font-semibold text-lg">{bp.NAME}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                                                    RUC/Cédula
                                                </label>
                                                <p className="text-gray-700 font-medium">{bp.TAXID || '-'}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                                                    Grupo
                                                </label>
                                                <span className="inline-block text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded-lg font-medium">
                                                    {bp.GROUP_NAME || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BPartnerList;