var express = require('express');
var router = express.Router();
const { pool } = require('../database/Db'); // Pastikan ini mengarah ke file yang benar

// Rute untuk menampilkan semua produk
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// Rute untuk menampilkan produk berdasarkan ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});


// POST new product
router.post('/', async (req, res) => {
  const { name, category, quantity, price } = req.body;
  if (!name || !category || typeof quantity !== 'number' || typeof price !== 'number') {
    return res.status(400).json({ error: 'All fields are required and must be valid' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, quantity, price) VALUES (?, ?, ?, ?)',
      [name, category, quantity, price]
    );
    res.status(201).json({ id: result.insertId, name, category, quantity, price });
  } catch (err) {
    console.error('Insert query failed:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price } = req.body;
  if (!name || !category || typeof quantity !== 'number' || typeof price !== 'number') {
    return res.status(400).json({ error: 'All fields are required and must be valid' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?',
      [name, category, quantity, price, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Update query failed:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Delete query failed:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

module.exports = router;
