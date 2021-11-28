const http = require('http');
const Persons = require('./model');

const App = http.createServer((req, res) => {
  const DATABASE = new Persons('./dataBase.json');
  const PATHS = req.url.split('/');

  const notFound = 'page not found';
  const incorrectFormat = 'incorrect format';
  const incorrectID = 'incorrect ID';
  const notImplemented = 'not implemented';

  if (PATHS.length > 3) {
    res.statusCode = 404;
    res.statusMessage = notFound;
    res.end(notFound);
  } else {
    if (PATHS[1] == 'person') {

      if (req.method == 'GET') {
        const databaseData = DATABASE.get(PATHS[2]);
        res.statusCode = databaseData.status;
        if (res.statusCode === 200) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(databaseData.data));
        } else {
          res.statusMessage = databaseData.message;
          res.end(databaseData.message);
        }

      } else if (req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          let data;
          try {
            data = JSON.parse(body);
          } catch (e) {
            res.statusCode = 500;
            res.statusMessage = incorrectFormat;
          }
          if (res.statusCode == 500) {
            res.end(res.statusMessage);
          } else {
            const databaseData = DATABASE.post(data.name, data.age, data.hobbies);
            res.statusCode = databaseData.status;
            if (res.statusCode == 201) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(databaseData.data));
            }
            res.statusMessage = databaseData.message;
            res.end(databaseData.message);
          }
        });

      } else if (req.method == 'PUT') {
        if (PATHS[2]) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            let data;
            try {
              data = JSON.parse(body);
            } catch {
              res.statusCode = 500;
              res.statusMessage = incorrectFormat;
            }
            if (res.statusCode == 500) {
              res.end(res.statusMessage);
            } else {
              const databaseData = DATABASE.put(
                PATHS[2],
                data.name,
                data.age,
                data.hobbies
              );
              res.statusCode = databaseData.status;
              if (res.statusCode == 200) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(databaseData.data));
              }
              res.statusMessage = databaseData.message;
              res.end(databaseData.message);
            }
          });
        } else {
          res.statusCode = 404;
          res.statusMessage = incorrectID;
          res.end(incorrectID);
        }

      } else if (req.method == 'DELETE') {
        if (PATHS[2]) {
          const databaseData = DATABASE.delete(PATHS[2]);
          res.statusCode = databaseData.status;
          res.statusMessage = databaseData.message;
          res.end(databaseData.message);
        } else {
          res.statusCode = 404;
          res.statusMessage = incorrectID;
          res.end(incorrectID);
        }

      } else {
        res.statusCode = 501;
        res.statusMessage = notImplemented;
        res.end(notImplemented);
      }
    } else {
      res.statusCode = 404;
      res.statusMessage = notFound;
      res.end(notFound);
    }
  }
});

module.exports = App;