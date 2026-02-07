import { useState, useEffect } from 'react';
import { bpartnerService } from '../services/api';

function BPartnerForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        value: '',
        name: '',
        taxId: '',
        groupId: '',
    });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoadingGroups(true);
            const response = await bpartnerService.getGroups();
            setGroups(response.data);
        } catch (err) {
            setError('Error al cargar grupos: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.value.trim()) {
            errors.value = 'El código es obligatorio';
        }

        if (!formData.name.trim()) {
            errors.name = 'El nombre es obligatorio';
        }

        if (!formData.taxId.trim()) {
            errors.taxId = 'El RUC/Cédula es obligatorio';
        } else if (!/^\d+$/.test(formData.taxId)) {
            errors.taxId = 'La identificación solo debe contener números';
        } else if (formData.taxId.length !== 10 && formData.taxId.length !== 13) {
            errors.taxId = 'Debe tener 10 dígitos (Cédula) o 13 dígitos (RUC)';
        }

        if (!formData.groupId) {
            errors.groupId = 'Debe seleccionar un grupo';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await bpartnerService.create(formData);

            setSuccess(`✅ Tercero creado exitosamente: ${response.data.name}`);
            setFormData({
                value: '',
                name: '',
                taxId: '',
                groupId: '',
            });

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (err) {
            setError(err.message || 'Error al crear el tercero');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            value: '',
            name: '',
            taxId: '',
            groupId: '',
        });
        setValidationErrors({});
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header del módulo */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 sm:px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">➕</span>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Registrar Nuevo Tercero
                        </h2>
                        <p className="text-green-100 text-sm mt-0.5">
                            Complete el formulario con los datos del socio de negocio
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Alertas */}
                {success && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-6 animate-slideIn">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl">✓</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-green-900 font-semibold">¡Éxito!</p>
                                <p className="text-green-700 text-sm mt-1">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-4 mb-6 animate-slideIn">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl">⚠</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-red-900 font-semibold">Error</p>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Código */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2">
                                <span>Código</span>
                                <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="value"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-gray-900 ${validationErrors.value
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                                placeholder="Ej: CLIE001"
                                value={formData.value}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {validationErrors.value && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <span className="text-red-500 text-xl">⚠</span>
                                </div>
                            )}
                        </div>
                        {validationErrors.value && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <span>•</span>
                                <span>{validationErrors.value}</span>
                            </p>
                        )}
                    </div>

                    {/* Nombre */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2">
                                <span>Nombre Completo</span>
                                <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-gray-900 ${validationErrors.name
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                                placeholder="Ej: Juan Pérez García"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {validationErrors.name && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <span className="text-red-500 text-xl">⚠</span>
                                </div>
                            )}
                        </div>
                        {validationErrors.name && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <span>•</span>
                                <span>{validationErrors.name}</span>
                            </p>
                        )}
                    </div>

                    {/* Identificación */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2">
                                <span>RUC / Cédula</span>
                                <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="taxId"
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-gray-900 ${validationErrors.taxId
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                                placeholder="1234567890 ó 1234567890001"
                                value={formData.taxId}
                                onChange={handleChange}
                                disabled={loading}
                                maxLength="13"
                            />
                            {validationErrors.taxId && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <span className="text-red-500 text-xl">⚠</span>
                                </div>
                            )}
                        </div>
                        {validationErrors.taxId ? (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <span>•</span>
                                <span>{validationErrors.taxId}</span>
                            </p>
                        ) : (
                            <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                                <span>ℹ️</span>
                                <span>10 dígitos para Cédula o 13 dígitos para RUC</span>
                            </p>
                        )}
                    </div>

                    {/* Grupo */}
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2">
                                <span>Grupo de Tercero</span>
                                <span className="text-red-500">*</span>
                            </span>
                        </label>
                        {loadingGroups ? (
                            <div className="flex items-center gap-3 text-gray-600 py-3 px-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-300 border-t-blue-600"></div>
                                <span className="text-sm">Cargando grupos...</span>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <select
                                        name="groupId"
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all appearance-none text-gray-900 ${validationErrors.groupId
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                        value={formData.groupId}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="">Seleccione un grupo</option>
                                        {groups.map((group) => (
                                            <option key={group.ID} value={group.ID}>
                                                {group.NAME} {group.DESCRIPTION ? `- ${group.DESCRIPTION}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {validationErrors.groupId && (
                                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                        <span>•</span>
                                        <span>{validationErrors.groupId}</span>
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                            disabled={loading || loadingGroups}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl">💾</span>
                                    <span>Guardar Tercero</span>
                                </>
                            )}
                        </button>

                        {!loading && (
                            <button
                                type="button"
                                className="flex-1 sm:flex-none px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold flex items-center justify-center gap-2"
                                onClick={handleClear}
                            >
                                <span className="text-xl">🔄</span>
                                <span>Limpiar</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BPartnerForm;