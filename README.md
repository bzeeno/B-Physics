# B-Physics
A website I made in 2019 using node, express, and mongodb. (https://bphysics.herokuapp.com/)

Table of Contents
=================

   * [Introduction](#introduction)
   * [Directory Structure](#directory-structure)
   * [How To Use](#how-to-use)

## Introduction
B-Physics is a website that allows users to access about 10 hours worth of educational on-demand videos. These videos are intended to be 
watched in-order, as they walk the user through computational research methods in physics and astrophysics. The website uses the Stripe API in order to 
accept payments. Users are asked to make a payment before they can make their account since there is no reason to have an account other than to access the videos.
- The backend uses node and express
- User authentication is handled through passport
- User information is saved using MongoDB
- Videos are hosted on Vimeo
- Web app is deployed on Heroku

## Directory Structure
<pre>
├── app.js
├── node_modules
│   ├── ...
├── package.json
├── package-lock.json
├── Procfile
├── public
│   ├── css
│   │   ├── bootstrap-social.css
│   │   └── styles.css
│   ├── images
│   │   ├── ...
│   └── js
│       └── register.js
└── views
    ├── buynow.ejs
    ├── freetrial-register.ejs
    ├── home.ejs
    ├── lesson.ejs
    ├── login.ejs
    ├── partials
    │   ├── footer.ejs
    │   └── header.ejs
    ├── paysuccess.ejs
    ├── register.ejs
    ├── sections.ejs
    └── submit.ejs
    
</pre>

## How To Use
- To use the application, you do not have to pay. First, visit the link at the top of this README. Then, register for an account.
I've deployed the application in test mode so you can enter the following payment information to create an account:
  - Card Number: 4242424242424242
  - CVC: Any 3 digits
  - Expiration Date: Any date in the future
