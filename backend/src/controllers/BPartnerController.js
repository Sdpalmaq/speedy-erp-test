const BPartnerModel = require('../models/BPartnerModel');
const { validateTaxID } = require('../utils/validators');

class BPartnerController {
    /** 
     * GET /api/bpartners
     * Obtener todos los socios de negocio
     */

    static async getAllBPartners(req, res) {
        try {
            const { search = '' } = req.query;

            const bpartners = await BPartnerModel.getAll(search);

            res.json({
                success: true,
                count: bpartners.length,
                data: bpartners
            });
        } catch (error) {
            console.error('Error al obtener terceros:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener terceros',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });

        }
    }

    /** 
     * POST /api/bpartners
     * Crear un nuevo socio de negocio
     */

    static async createBPartner(req, res) {
        try {
            const { value, name, taxId, groupId } = req.body;

            // Validar campos obligatorios
            if (!value || !name || !taxId || !groupId) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos value, name, taxId y groupId son obligatorios',
                    required: ['value', 'name', 'taxId', 'groupId']
                });
            }

            // Validar formato del taxId (ruc o cedula)
            const validation = validateTaxID(taxId);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    message: validation.message
                });
            }

            // crear nuevo tercero
            const newBPartner = await BPartnerModel.create({
                value: value.trim(),
                name: name.trim(),
                taxId: taxId.trim(),
                groupId: groupId
            });

            res.status(201).json({
                success: true,
                message: 'Tercero creado exitosamente',
                data: newBPartner,
                validation: {
                    taxIdType: validation.type,
                    taxIdMessage: validation.message
                }
            });

        } catch (error) {
            console.error('Error al crear nuevo tercero (controller):', error);

            // Manejo de errores específicos de Oracle
            if (error.errorNum) {
                // ORA-00001: Constraint unique violated
                if (error.errorNum === 1) {
                    return res.status(409).Json({
                        success: false,
                        message: 'El codigo de tercero (value) ya existe. Por favor, elija un código diferente.'
                    });
                }

                // ORA-02291: Foreign key constraint violated
                if (error.errorNum === 2291) {
                    return res.status(400).json({
                        success: false,
                        message: 'El grupo de tercero seleccionado no es válido'
                    });
                }
            }

            res.status(500).json({
                success: false,
                message: 'Error al crear nuevo tercero',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * GET /api/bpartner/groups
     * Obtener los grupos de terceros disponibles
     *  */

    static async getGroups(req, res) {
        try {
            const groups = await BPartnerModel.getGroups();

            res.json({
                success: true,
                count: groups.length,
                data: groups
            });
        } catch (error) {
            console.error('Error al obtener grupos de terceros (controller): ', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener grupos de terceros',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = BPartnerController;