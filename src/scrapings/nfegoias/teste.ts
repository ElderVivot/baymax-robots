import windowsRootCerts from 'node-windows-root-certs'

// to read windows root certs
var rootCerts = windowsRootCerts.getCerts()
console.log(rootCerts)

// result:
// ["-----BEGIN CERTIFICATE-----\nMIIF.....Da\n-----END CERTIFICATE-----","-----BEGIN CERTIFICATE-----...."]

// to patch tls with any cert list as above:
// windowsRootCerts.patchTls( rootCerts );