const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Enable CORS for all origins
server.use(cors());

// Add custom routes from routes.json
const routes = require("./routes.json");
server.use(jsonServer.rewriter(routes));

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom middleware to handle query parameters properly
server.use((req, res, next) => {
  // Log incoming requests
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use the router
server.use(router);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}`);
});

// Made with Bob
