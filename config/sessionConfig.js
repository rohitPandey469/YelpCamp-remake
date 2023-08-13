const store=require('./mongoStore');

const sessionConfig = {
  store,
  name: "session",
  secret: process.env.SECRET || "woooohhhhooooo",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // not accessible through javascript
    // secure: true, // this cookie will only work on https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
module.exports = sessionConfig;
