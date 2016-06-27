/*
| Build - build site with `node ./lib/build.js` or `npm start`
|
| This project was released under MIT license.
|
| @link      http://websemantics.ca
| @author    Web Semantics, Inc. Dev Team <team@websemantics.ca>
| @author    Adnan M.Sagar, PhD. <adnan@websemantics.ca>
└ */

'use strict'

var pkg = require('../../package.json')
var env = (process.env.NODE_ENV || '').trim().toLowerCase() || 'development' /* or 'production' */

var metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var publish = require('metalsmith-publish')
var wordcount = require('metalsmith-word-count')
var collections = require('metalsmith-collections')
var permalinks = require('metalsmith-permalinks')
var inplace = require('metalsmith-in-place')
var layouts = require('metalsmith-layouts')
var htmlmin = require('metalsmith-html-minifier')
var setdate = require('./plugins/metalsmith-setdate')
var moremeta = require('./plugins/metalsmith-moremeta')
var debug = require('./plugins/metalsmith-debug')

metalsmith(__dirname + '/../..')
.clean(env === 'production')
.source(pkg.config.dir.html)
.destination(pkg.config.dir.dist)
.metadata(pkg)
.use(publish())
.use(setdate())
.use(collections(pkg.collections))
.use(markdown())
.use(permalinks({pattern: ':mainCollection/:title'}))
.use(wordcount({
    raw: true
}))
.use(moremeta())
.use(inplace(pkg.config.template))
.use(layouts(pkg.config.template))
.use(htmlmin())
.use(debug())
.build(function(err) {
    if (err) throw err
})
