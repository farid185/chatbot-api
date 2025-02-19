const sqlite3 = require('sqlite3').verbose();

// اتصال به پایگاه‌داده PeakTech 4390
const db = new sqlite3.Database('./peaktech_4390.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the PeakTech 4390 database.');
  }
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT
  )`);
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT
  )`);

  db.run(`INSERT INTO faq (question, answer) VALUES ('Was ist PeakTech?', 'PeakTech ist ein führender Anbieter von Mess- und Prüfgeräten.')`);
  db.run(`INSERT INTO faq (question, answer) VALUES ('Wie kontaktiere ich den Support?', 'Kontakt: support@peaktech.de')`);
  db.run(`INSERT INTO faq (question, answer) VALUES ('Welche Produkte bietet PeakTech an?', 'PeakTech bietet Multimeter, Oszilloskope, Netzteile und vieles mehr an.')`);
});

module.exports = db;
