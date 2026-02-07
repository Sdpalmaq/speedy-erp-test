const { parse } = require('dotenv');
const { getPool } = require('../config/database');

class BPartnerModel {
    // Método para obtener todos los terceros con busqueda 

    static async getAll(searchTerm = '') {
        let connection;

        try {
            const pool = getPool();
            connection = await pool.getConnection();

            let query = `
            SELECT 
            bp.C_BPARTNER_ID,
            bp.VALUE as CODE,
            bp.NAME,
            bp.TAXID,
            bg.NAME as GROUP_NAME
        FROM C_BPARTNER bp
        LEFT JOIN C_BP_GROUP bg ON bp.C_BP_GROUP_ID = bg.C_BP_GROUP_ID
        WHERE bp.AD_CLIENT_ID = :clientId
            AND bp.ISACTIVE = 'Y'
        `;
            const binds = { clientId: parseInt(process.env.AD_CLIENT_ID) };

            // Agregar condición de búsqueda si se proporciona un término de búsqueda
            if (searchTerm && searchTerm.trim() !== '') {
                query += ` AND (UPPER(bp.NAME) LIKE :searchTerm OR bp.TAXID LIKE :searchTerm)`;
                binds.searchTerm = `%${searchTerm.trim().toUpperCase()}%`;
            }

            query += ` ORDER BY bp.NAME ASC`;

            const result = await connection.execute(query, binds);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener terceros:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    };

    // Generar un nuevo ID para un tercero  en el rango de 1000-5000
    static async generateNewID() {
        let connection;

        try {
            const pool = getPool();
            connection = await pool.getConnection();

            const result = await connection.execute(`
                SELECT MAX(C_BPARTNER_ID) AS MAX_ID
                FROM C_BPARTNER
                WHERE C_BPARTNER_ID BETWEEN 1000 AND 5000
                AND AD_CLIENT_ID = :clientId
            `, {
                clientId: parseInt(process.env.AD_CLIENT_ID)
            });

            const maxId = result.rows[0].MAX_ID || 0;
            return maxId + 1;
        } catch (error) {
            console.error('Error al generar nuevo ID:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    // Método para crear un nuevo tercero
    static async create(data) {
        let connection;

        try {
            const pool = getPool();
            connection = await pool.getConnection();

            const newId = await this.generateNewID();

            // DEBUG: Ver qué ID se generó
            console.log('ID generado:', newId);
            console.log('Datos a insertar:', {
                id: newId,
                value: data.value,
                name: data.name,
                taxId: data.taxId,
                groupId: data.groupId
            });

            const query = `
                INSERT INTO C_BPARTNER (
                C_BPARTNER_ID,
                AD_CLIENT_ID,
                AD_ORG_ID,
                ISACTIVE,
                CREATED,
                CREATEDBY,
                UPDATED,
                UPDATEDBY,
                VALUE,
                NAME,
                C_BP_GROUP_ID,
                TAXID,
                ISSUMMARY,
                ISONETIME,
                ISPROSPECT,
                ISVENDOR,
                ISEMPLOYEE,
                ISSALESREP,
                ISCUSTOMER
            ) VALUES (
                :id,
                :clientId,
                :orgId,
                :isActive,
                SYSDATE,
                :createdBy,
                SYSDATE,
                :updatedBy,
                :value,
                :name,
                :groupId,
                :taxId,
                :isSummary,
                :isOneTime,
                :isProspect,
                :isVendor,
                :isEmployee,
                :isSalesRep,
                :isCustomer
            )`
                ;

            const binds = {
                id: newId,
                clientId: parseInt(process.env.AD_CLIENT_ID),
                orgId: parseInt(process.env.AD_ORG_ID),
                isActive: 'Y',
                createdBy: parseInt(process.env.CREATED_BY),
                updatedBy: parseInt(process.env.UPDATED_BY),
                value: data.value,
                name: data.name,
                groupId: parseInt(data.groupId),
                taxId: data.taxId,
                isSummary: 'N',
                isOneTime: 'N',
                isProspect: 'N',
                isVendor: 'N',
                isEmployee: 'N',
                isSalesRep: 'N',
                isCustomer: 'Y'
            };

            await connection.execute(query, binds);
            await connection.commit();

            return { id: newId, ...data };

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }

            console.error('Error al crear nuevo tercero:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    // Metodo para obtener los grupos de terceros
    static async getGroups() {
        let connection;

        try {
            const pool = getPool();
            connection = await pool.getConnection();

            const result = await connection.execute(`
            SELECT 
            C_BP_GROUP_ID as ID,
            NAME,
            DESCRIPTION
        FROM C_BP_GROUP
        WHERE AD_CLIENT_ID = :clientId
        AND ISACTIVE = 'Y'
        ORDER BY NAME ASC
        `, {
                clientId: parseInt(process.env.AD_CLIENT_ID)
            });

            return result.rows;

        } catch (error) {
            console.error('Error en obtener grupos de terceros:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = BPartnerModel;