const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'catalogoms',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const traerProductos = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM catalogo');
        return rows;
    } catch (error) {
        console.error('Error in traerProductos:', error);
        throw error;
    }
};

const traerProducto = async (id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM catalogo WHERE id = ?', [id]);
        return rows;
    } catch (error) {
        console.error('Error in traerProducto:', error);
        throw error;
    }
};

const crearProducto = async (productoData) => {
    // Remove id if it exists in the request body
    const { id, ...datosProducto } = productoData;
    const {
        Back_Camera,
        Battery_Capacity,
        Company_Name,
        Front_Camera,
        Launched_Price_China,
        Launched_Price_Dubai,
        Launched_Price_India,
        Launched_Price_Pakistan,
        Launched_Price_USA,
        Launched_Year,
        Mobile_Weight,
        Model_Name,
        Processor,
        RAM,
        Screen_Size
    } = datosProducto;

    try {
        const [result] = await pool.query(
            `INSERT INTO catalogo (
                Back_Camera, Battery_Capacity, Company_Name, Front_Camera,
                Launched_Price_China, Launched_Price_Dubai, Launched_Price_India,
                Launched_Price_Pakistan, Launched_Price_USA, Launched_Year,
                Mobile_Weight, Model_Name, Processor, RAM, Screen_Size
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Back_Camera, Battery_Capacity, Company_Name, Front_Camera,
                Launched_Price_China, Launched_Price_Dubai, Launched_Price_India,
                Launched_Price_Pakistan, Launched_Price_USA, Launched_Year,
                Mobile_Weight, Model_Name, Processor, RAM, Screen_Size
            ]
        );
        return { id: result.insertId, ...datosProducto };
    } catch (error) {
        console.error('Error in crearProducto:', error);
        throw error;
    }
};

const actualizarProducto = async (id, productoData) => {
    // Remove id if it exists in the request body
    const { id: idBody, ...datosProducto } = productoData;
    const {
        Back_Camera,
        Battery_Capacity,
        Company_Name,
        Front_Camera,
        Launched_Price_China,
        Launched_Price_Dubai,
        Launched_Price_India,
        Launched_Price_Pakistan,
        Launched_Price_USA,
        Launched_Year,
        Mobile_Weight,
        Model_Name,
        Processor,
        RAM,
        Screen_Size
    } = datosProducto;

    try {
        const [result] = await pool.query(
            `UPDATE catalogo SET 
                Back_Camera = ?, Battery_Capacity = ?, Company_Name = ?, Front_Camera = ?,
                Launched_Price_China = ?, Launched_Price_Dubai = ?, Launched_Price_India = ?,
                Launched_Price_Pakistan = ?, Launched_Price_USA = ?, Launched_Year = ?,
                Mobile_Weight = ?, Model_Name = ?, Processor = ?, RAM = ?, Screen_Size = ?
            WHERE id = ?`,
            [
                Back_Camera, Battery_Capacity, Company_Name, Front_Camera,
                Launched_Price_China, Launched_Price_Dubai, Launched_Price_India,
                Launched_Price_Pakistan, Launched_Price_USA, Launched_Year,
                Mobile_Weight, Model_Name, Processor, RAM, Screen_Size,
                id
            ]
        );
        return result;
    } catch (error) {
        console.error('Error in actualizarProducto:', error);
        throw error;
    }
};

const eliminarProducto = async (id) => {
    try {
        const [result] = await pool.query('DELETE FROM catalogo WHERE id = ?', [id]);
        return result;
    } catch (error) {
        console.error('Error in eliminarProducto:', error);
        throw error;
    }
};

module.exports = {
    traerProductos,
    traerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};