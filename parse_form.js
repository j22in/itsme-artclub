const fs = require('fs');
const data = fs.readFileSync('/tmp/form_data.txt', 'utf8');
const match = data.match(/FB_PUBLIC_LOAD_DATA_ = (.*?);/);
if (match) {
  const json = JSON.parse(match[1]);
  const items = json[1][1];
  items.forEach(item => {
    if (item[1]) {
      const fieldName = item[1];
      const entryId = item[4] && item[4][0] ? item[4][0][0] : null;
      if (entryId) {
         console.log(`Field: ${fieldName} -> entry.${entryId}`);
      }
    }
  });
}
