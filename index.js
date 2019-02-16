const fs = require('fs');
const http = require('http');
const url = require('url');

// Using syncchronous here because this only gets read when the server stard
const json = fs.readFileSync(`./city.list.json`, 'utf-8');
const locationData = JSON.parse(json);

// Creating server with http package
const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const name = url.parse(req.url, true).query.q;

  // --- ROUTES ---
  // if route equals products
  if (pathName === '/' && name) {
    const results = locationData.filter(item => {
      const regex = new RegExp(name, 'gi');
      return item.name.match(regex) || item.country.match(regex);
    });
    console.log(results);
    if (results.length === 0) {
      res.writeHead(404, { 'Content-type': 'text/html' });
      res.end('Url was not found on the server!');
    } else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(results));
    }
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('Url was not found on the server!');
  }
});

// Listen for server on URL and PORT
server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for requests now.');
});
