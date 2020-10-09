const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const https = require('https');
const http = require('http');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const port = process.env.PORT || 3000;
const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port, hostname: 'nice-box.herokuapp.com' },
  development: { ssl: false, port: 8080, hostname: 'localhost' }
}

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const environment = process.env.NODE_ENV || 'production'
const config = configurations[environment]

console.log("environment", environment);

const app = express();
const apollo = new ApolloServer({ typeDefs, resolvers });
apollo.applyMiddleware({ app });

// Create the HTTPS or HTTP server, per configuration
let server
if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root
  // Make sure the files are secured
  server = https.createServer(
    {
      key: process.env.SERVER_KEY,
      cert: process.env.SERVER_CRT
    },
    app
  )
} else {
  server = http.createServer(app)
}

server.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}/graphql`)
)
