const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url instanceof RegExp && route.url.test(req.url)) return true;
  if (route.url && req.url != route.url) return false;
	return true;
};

class App {
  constructor() {
    this.routes = [];
	}
  use(handler) {
    this.routes.push({ handler });
	}
  get(url, handler) {
    this.routes.push({ method: 'GET', url, handler });
	}
  post(url, handler) {
    this.routes.push({ method: 'POST', url, handler });
	}
  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(r => isMatching(req, r));
    let remaining = [...matchingRoutes];

    let next = () => {
      let current = remaining.shift();
      if (!current) return;
      current.handler(req, res, next);
    }
    next();
  }
};

module.exports = App;