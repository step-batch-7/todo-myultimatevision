class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  getAll(handler) {
    this.get('', handler);
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }

  postAll(handler) {
    this.post('', handler);
  }

  use(middleware) {
    this.routes.push({ handler: middleware });
  }

  serve(req, res) {
    console.log('Request: ', req.url, req.method);
    const matchingHandlers = this.routes.filter((route) => matchRoute(route, req));
    const next = function () {
      if (matchingHandlers) {
        const router = matchingHandlers.shift();
        router.handler(req, res, next);
      }
    };
    next();
  }
}

const matchRoute = function (route, req) {
  if (route.method) {
    const isUrlMatching = req.url.match(route.path);
    return req.method === route.method && isUrlMatching;
  }
  return true;
};

module.exports = { App };
