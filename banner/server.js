const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'iframe_db',
};

app.use(cors());
app.use(express.json());

app.route('/api/iframes')
  .get(async (req, res) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.query('SELECT * FROM iframes');
      connection.end();
      res.json(rows);
    } catch (error) {
      console.error('Error fetching data from the database:', error);
      res.status(500).send('Internal Server Error');
    }
  })
  .post(async (req, res) => {
    const { title, url } = req.body;

    try {
      const connection = await mysql.createConnection(dbConfig);
      const [result] = await connection.query('UPDATE iframes SET url = ? WHERE title = ?', [url, title]);
      connection.end();

      if (result.affectedRows > 0) {
        res.json({ success: true, message: 'URL updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Iframe not found in the database' });
      }
    } catch (error) {
      console.error('Error updating data in the database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

app.route('/api/styles/:id')
  .get(async (req, res) => {
    const styleId = req.params.id;

    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.query('SELECT * FROM styles WHERE id = ?', [styleId]);
      connection.end();

      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ success: false, message: 'Style not found in the database' });
      }
    } catch (error) {
      console.error('Error fetching style from the database:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
