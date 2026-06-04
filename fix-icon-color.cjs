const fs = require('fs');
let content = fs.readFileSync('pages/drinks.vue', 'utf8');

content = content.replace(
  /\.pdf-corner-btn:hover {[\s\S]*?}/,
  `.pdf-corner-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff !important;
}

.pdf-corner-btn svg,
.pdf-corner-btn svg * {
  color: inherit !important;
}`
);

fs.writeFileSync('pages/drinks.vue', content);
