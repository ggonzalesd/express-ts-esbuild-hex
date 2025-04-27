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
  proxy.web(
    req,
    res,
    { target: `http://${target.host}:${target.port}` },
    (err) => {
      if (err) {
        console.error(
          `Error proxying to ${target.host}:${target.port}:`,
          err.message,
        );
        // Aquí puedes intentar el siguiente target o simplemente responder algo
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Service unavailable');
      }
    },
  );
  current = (current + 1) % targets.length;
});

// * WebSocket upgrade handler
server.on('upgrade', (req, socket, head) => {
  const target = targets[current];
  proxy.ws(
    req,
    socket,
    head,
    { target: `http://${target.host}:${target.port}` },
    (err) => {
      if (err) {
        console.error(
          `WebSocket proxy error to ${target.host}:${target.port}:`,
          err.message,
        );
        socket.destroy(); // Cerramos el socket si no se puede conectar
      }
    },
  );
  current = (current + 1) % targets.length;
});

// Error handling
proxy.on('error', (err, req, res) => {
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Proxy error.');
});

server.listen(8080, () => {
  console.log('Load balancer running on http://localhost:8080');
});
