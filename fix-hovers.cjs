const fs = require('fs');
let content = fs.readFileSync('pages/events.vue', 'utf8');

content = content.replace(
  /\.event-list-item:hover {[\s\S]*?}/,
  `.event-list-item:hover {
  border-left-color: #FF9d66;
  background: var(--theme-itemBg);
}`
);
content = content.replace(
  /background: rgba\(255, 255, 255, 0\.1\);/,
  'background: var(--theme-itemBg);'
);

fs.writeFileSync('pages/events.vue', content);
