const http = require('http');
const { app } = require('./lib/handlers');

const port = process.env;

const main = function(port = 4000) {
  const server = new http.Server(app.serve.bind(app));
  server.listen(port, () => console.log(`listening to ${port}`));
};

main(process.argv[2] || port);
