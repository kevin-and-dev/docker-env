const http = require('http');
const mongoose = require('mongoose');

const mongo_url = process.env.NODEJS_MONGO_URL;

// App Started
console.log("Server Started: (env: " + process.env.NODE_ENV + ")");

// Define Collection Model
const Healthy = mongoose.model('healthy', {
  text: String,
  checkTime: { type: Number, default: Date.now },
});

http.createServer(function (req, res) {

  // TODO: Ignore favicon request for Development environment ONLY
  if (req.url === "/favicon.ico") { res.writeHead(204, { 'Content-Type': 'text/json' }).end(); return; }


  res.writeHead(200, {'Content-Type': 'text/html'});

  try {

    // Establish DB Connection
    res.write("<ol><li>Establish MongoDB Connection</li><ol>");
    mongoose.connect('mongodb://nodeuser:nodepwd@mongodb:27017/nodejs', {useNewUrlParser: true, useUnifiedTopology: true});

    res.write("<li>Performing health check</li>");

    const ts = new Date();
    const healthyObj = new Healthy({ text: 'Healthy', checkTime: ts.valueOf() });

    const promise = healthyObj.save()
    promise.then( () => {

      res.write("<li>Health Check Saved on " + ts.toLocaleString() + "</li>");

      Healthy.find().sort({checkTime : -1}).limit(1).exec(function (err, obj) {
        let delayms = (obj[0].checkTime - ts.valueOf());
        let colorTxt = (delayms <= 8) ? '#228B22' : '#800000';
        res.write("<li>Validation Result: delay in <span style='color:"+colorTxt+" '>" + delayms + "ms</span></li>");
        res.end('<li>The End</li></ol></ol>');
      });

    });

  } catch (e) {
    console.error("MongoDB Error: \n" + mongo_url + "\n" + e );
    res.end();
  } finally {
  }


}).listen(8080);
