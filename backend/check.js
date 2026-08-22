const bcrypt = require('bcrypt');
async function run() {
  const hash = '$2b$10$YjyxOk5X4SEfQr4ijTerHeD.qXK1fGSb2GLL/8SgFRBWNHRlh2HXm';
  const match = await bcrypt.compare('password123', hash);
  console.log('password123:', match);
}
run();
