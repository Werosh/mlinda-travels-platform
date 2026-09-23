const fs = require('fs');
const path = './supabase/seed.sql';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/'h1000000-/g, "'10000000-");
content = content.replace(/'rt00000/g, "'2000000");
content = content.replace(/'c1000000-/g, "'30000000-");
fs.writeFileSync(path, content);
console.log('Seed UUIDs fixed.');
