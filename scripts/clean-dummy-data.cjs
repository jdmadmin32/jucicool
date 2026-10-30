const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'jucicool.db');
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
console.log('Tables in DB:', tables);

for (const t of ['retail_order_items', 'retail_orders', 'wholesale_orders', 'quotation_items', 'quotations', 'bulk_enquiry_items', 'bulk_enquiries']) {
  if (tables.includes(t)) {
    db.prepare(`DELETE FROM ${t}`).run();
    console.log(`Cleared ${t}`);
  }
}

if (tables.includes('users')) {
  db.prepare("DELETE FROM users WHERE email NOT IN ('admin@jucicool.com', 'jucicooladmin', 'dealer@jucicool.com')").run();
}

console.log('Cleaned DB successfully!');
console.log('Retail orders:', db.prepare('SELECT count(*) as c FROM retail_orders').get());
console.log('Bulk enquiries:', db.prepare('SELECT count(*) as c FROM bulk_enquiries').get());
console.log('Wholesale orders:', db.prepare('SELECT count(*) as c FROM wholesale_orders').get());
console.log('Users remaining:', db.prepare('SELECT email, role, customer_type FROM users').all());
