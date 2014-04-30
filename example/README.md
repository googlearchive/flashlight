# Running this Example

 - Create a dev [Firebase instance](https://www.firebase.com/account)
 - Import example/seed/data.json into your dev instance
 - [Start ElasticSearch](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup.html)
    - [Download ElasticSearch](http://www.elasticsearch.org/download)
    - Unzip/Untar
    - `./bin/elasticsearch`
 - Configure `config.js` with your settings (you can use defaults if you set up ElasticSearch locally)
 - `node app.js`
 - Edit `example/example.js` to point to your Firebase URL
 - Start a local web server
    - `npm install -g serve`
    - `cd example/`
    - `serve`
 - Open [example/index.html in your browser](http://localhost:3000)
