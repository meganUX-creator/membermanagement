const fs = require('fs');
console.log(fs.readFileSync('style.css', 'utf-8').includes('.filter-card.collapsed'));
