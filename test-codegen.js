const cp = require('child_process');
try {
  cp.execSync('npx graphql-codegen --config codegen-main.ts', { stdio: 'pipe' });
  console.log('success');
} catch(e) {
  console.error('error:', e.message);
  console.error(e.stdout.toString());
  console.error(e.stderr.toString());
}
