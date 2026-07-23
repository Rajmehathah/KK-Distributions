const os = require('os');

function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIp = getLocalIPv4();
console.log('Detected Local IPv4:', localIp);
console.log('\nLaptop:');
console.log(`http://localhost:1432`);
console.log('\nMobile:');
console.log(`http://${localIp}:1432`);
