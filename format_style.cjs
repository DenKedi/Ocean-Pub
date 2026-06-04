const fs = require('fs');
let content = fs.readFileSync('pages/events.vue', 'utf8');

// Also update page-title colors manually in CSS
content = content.replace(
  /\.page-title {/g,
  '.page-title { color: var(--theme-textPrimary) !important; '
);
content = content.replace(
  /\.page-subtitle {/g,
  '.page-subtitle { color: var(--theme-textSecondary) !important; '
);

// We need to fix `.event-card` and other `.event-` related black backgrounds
content = content.replace(
  /\.event-card {([\s\S]*?)}/,
  (match, inner) => {
    let newInner = inner.replace(/background:\s*#111;/, '');
    newInner = newInner.replace(/background:\s*rgba\(17,\s*17,\s*17,\s*0\.6\);/, '');
    newInner += '\n  /* Fallback in case var missing */\n  background: var(--theme-containerBg);';
    return `.event-card {${newInner}}`;
  }
);
// In list-view, .event-image
content = content.replace(
  /.view-mode-list \.event-image {([^}]*)}/,
  (match) => {
    return match.replace(/background:\s*#111;/, 'background: var(--theme-itemBg);');
  }
);
// Same for grid view fallback
content = content.replace(
  /\.event-image {([^}]*)}/,
  (match) => {
    return match.replace(/background-color:\s*transparent;/, 'background-color: var(--theme-itemBg);');
  }
);

content = content.replace(/color:\s*#fff/g, 'color: var(--theme-textPrimary)');
content = content.replace(/rgba\(17, 17, 17, 0\.9\)/g, 'var(--theme-containerBg)');
content = content.replace(/rgba\(255, 255, 255, 0\.15\)/g, 'var(--theme-border)');
fs.writeFileSync('pages/events.vue', content);
