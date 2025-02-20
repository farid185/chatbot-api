const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// Middleware aktivieren
app.use(cors()); // Aktiviert CORS für Cross-Origin-Anfragen
app.use(express.json()); // Ermöglicht JSON-Parsing in Anfragen

// Dynamischer Pfad für SQLite-Datenbank (Railway-kompatibel)
const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'db.sqlite');

// Prüfen, ob die Datenbankdatei existiert
if (!fs.existsSync(dbPath)) {
  console.error(`❌ Fehler: Die SQLite-Datenbank wurde nicht gefunden: ${dbPath}`);
  process.exit(1);
}

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('❌ Fehler bei der Verbindung zur SQLite-Datenbank:', err.message);
    process.exit(1);
  }
  console.log(`✅ Erfolgreich mit der SQLite-Datenbank verbunden: ${dbPath}`);
});

// Sicherheits-Header entfernen
app.disable('x-powered-by');

// 🛒 API-Endpunkt für Produktinformationen
app.get('/api/product-info', (req, res) => {
  db.all('SELECT * FROM product_info', [], (err, rows) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen der Produktinformationen:', err.message);
      return res.status(500).json({ error: 'Fehler beim Abrufen der Produktinformationen.' });
    }
    res.json({ data: rows });
  });
});

// 🔄 Weiterleitung für Produktanfragen
app.get('/api/products', (req, res) => {
  res.status(307).redirect('/api/product-info'); // 307 erhält die HTTP-Methode
});

// ❓ API-Endpunkt für FAQs
app.get('/api/faq', (req, res) => {
  db.all('SELECT * FROM faq', [], (err, rows) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen der FAQs:', err.message);
      return res.status(500).json({ error: 'Fehler beim Abrufen der FAQs.' });
    }
    res.json({ data: rows });
  });
});

// ℹ️ Statische Antworten für allgemeine Anfragen
app.get('/api/company', (req, res) => {
  res.json({ message: 'PeakTech ist ein führender Anbieter von Mess- und Prüfgeräten.' });
});

app.get('/api/support', (req, res) => {
  res.json({ message: 'Kontakt: support@peaktech.de, +49 4102 97398-0.' });
});

app.get('/api/orders', (req, res) => {
  res.json({ message: 'Bitte geben Sie Ihre Bestellnummer ein.' });
});

app.get('/api/other', (req, res) => {
  res.json({ message: 'Bitte beschreiben Sie Ihr Anliegen.' });
});

// 🏁 Server starten
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server läuft unter http://

