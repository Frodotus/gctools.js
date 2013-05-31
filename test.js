var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/gctools'
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
//query = client.query('create database gctools');
query = client.query('SELECT * FROM mytable');
query.on('end', function() { client.end(); });
