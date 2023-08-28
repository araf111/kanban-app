/**
 * Module dependencies.
 */

const app = require('./app');
const debug = require('debug')('server:server');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
mongoose.connect(process.env.MONGODB_URL).then(() => {
  server.listen(port);
  console.log(`mongodb connected ${process.env.MONGODB_URL}`)
}).catch(err => {
  console.log(err);
  process.exit(1);
});


