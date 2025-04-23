const http = require('http');
const { createProxyServer } = require('http-proxy');

const proxy = createProxyServer({});

const targets = [
  { host: 'localhost', port: 3001 },
  { host: 'localhost', port: 3002 },
  { host: 'localhost', port: 3003 },
];

let current = 0;

const server = http.createServer((req, res) => {
  const target = targets[current];
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
  current = (current + 1) % targets.length;
});

server.listen(8080, () => {
  console.log('Load balancer running on http://localhost:8080');
});
