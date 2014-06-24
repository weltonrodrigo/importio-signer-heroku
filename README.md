importio-signer-heroku
======================

A simple node.js app, deployable to Heroku, for signing import.io queries for your zumbi clients out there.

## Rationale

If you use Import.IO for scraping (and you should!), you must use a signing server for signing(!) your clients queries. In other words, its a _bad idea_ to let your api key lay open on the source of your super index.html or even on a hyper uglyfied javascript compiled from typescript compiled from Visual Basic 2013 Web Express or something like that.

That being said, you should:

## Step-by-step

## Get the code:

Via GitHub:
```bash
git clone https://github.com/weltonrodrigo/importio-signer-heroku.git
cd importio-signer-heroku
```

Via npm:
```bash
npm install --save importio-signer-heroku
cd node_modules/importio-signer-heroku
```

Send app to Heroku:
```bash
heroku login
heroku create
git push heroku master

heroku config:set IMPORTIO_USERGUID=21fe0000-0000-0000-0000-af4300007640
heroku config:set IMPORTIO_APIKEY=your_long_api_key_string

heroku ps:scale web=1
```

On your code:

```javascript

this.importio.init({
             "auth": "http://adjective-noum-9999.herokuapp.com/",
             "host": "import.io"
});
```

## References

This doc explains how to use signed queries:
http://docs.import.io/35/signedserver.html

## A word of caution

Please be warned that _you_ are the sole responsible for securing your 
keys and you should not blame anyone but you if something bad happen with them.

Keys being stolen from heroku via 0-day exploits or accidentaly being commited on
a public GitHub repo are examples of that.
