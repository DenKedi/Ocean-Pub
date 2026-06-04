const fs = require('fs');
let content = fs.readFileSync('pages/drinks.vue', 'utf8');

content = content.replace(
  /.pdf-corner-btn svg,[\s\S]*?color: inherit !important;\n}/,
  `.pdf-corner-btn svg,
.pdf-corner-btn svg * {
  color: inherit !important;
  stroke: currentColor !important;
}`
);

fs.writeFileSync('pages/drinks.vue', content);
