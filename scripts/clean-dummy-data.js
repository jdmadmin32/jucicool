const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'jucicool.db');
const db = new Database(dbPath);

db.prepare('DELETE FROM retail_order_items').run();
db.prepare('DELETE FROM retail_orders').run();
db.prepare('DELETE FROM quotation_items').run();
db.prepare('DELETE FROM wholesale_orders').run();
db.prepare('DELETE FROM quotations').run();
db.prepare('DELETE FROM bulk_enquiry_status_history').run();
db.prepare('DELETE FROM bulk_enquiry_items').run();
db.prepare('DELETE FROM bulk_enquiries').run();
db.prepare("DELETE FROM users WHERE email NOT IN ('admin@jucicool.com', 'jucicooladmin', 'dealer@jucicool.com')").run();

console.log('Cleaned DB successfully!');
console.log('Retail orders:', db.prepare('SELECT count(*) as c FROM retail_orders').get());
console.log('Bulk enquiries:', db.prepare('SELECT count(*) as c FROM bulk_enquiries').get());
console.log('Wholesale orders:', db.prepare('SELECT count(*) as c FROM wholesale_orders').get());
console.log('Users remaining:', db.prepare('SELECT email, role, customer_type FROM users').all());
