const fs = require('fs');
const diffPath = '/Users/cedricbleck/Library/Application Support/Code/User/workspaceStorage/dce93b0328e19a951b1a815b2f20d343/GitHub.copilot-chat/chat-session-resources/e5e8d88f-74ca-4342-819b-e32a8c30bd7f/call_MHx2UEFMZGVCOGw2bDU1OHIybXY__vscode-1780526768297/content.txt';
const lines = fs.readFileSync(diffPath, 'utf8').split('\n');

let cleaned = [];
for (let i = 0; i < lines.length; i++) {
  let l = lines[i];
  if (l.endsWith('\r')) l = l.slice(0, -1);
  if (!l) continue;
  
  if (i === 0) { cleaned.push(l); continue; }
  
  // if line doesn't start with space, +, -, @, \, or index, diff, ---, +++, it was wrapped
  const validStart = /^([ +\-@\\]|index |diff |--- |\+\+\+ )/;
  if (!validStart.test(l)) {
    // join with previous line
    if (cleaned.length > 0) {
      cleaned[cleaned.length - 1] += l;
    }
  } else {
    cleaned.push(l);
  }
}

// Fix header manually just in case
cleaned[0] = 'diff --git a/components/sections/HeroSection.vue b/components/sections/HeroSection.vue';
// Find --- and +++
for(let i=0; i<5; i++) {
  if (cleaned[i] && cleaned[i].startsWith('---')) cleaned[i] = '--- a/components/sections/HeroSection.vue';
  if (cleaned[i] && cleaned[i].startsWith('+++')) cleaned[i] = '+++ b/components/sections/HeroSection.vue';
}

fs.writeFileSync('patch_fixed.diff', cleaned.join('\n') + '\n');
