const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const config = {
    user: 'Saad_Rahi\\saadr',
    password: '12345',
    server: 'SAAD_RAHI\\MSSQLSERVER05',
    database: 'Dummy',
    options: {
        encrypt: true, 
        trustServerCertificate: true,
    }
};

app.get('/api/books', async (req, res) => {
    let pool;
    try {
        pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT Libraries.name AS libraryName, Books.title AS bookTitle, Books.genre AS bookType
            FROM Library_Books
            INNER JOIN Libraries ON Library_Books.library_id = Libraries.library_id
            INNER JOIN Books ON Library_Books.book_id = Books.book_id;
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Database query error:', err.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (pool) {
            pool.close(); 
        }
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
