# MischMart1

**Introduction**

MischMart is a small retail application that intends to let the user do the following:

- Browse products by categories
- Log in using OpenID
- Add products to his cart
- Checkout using the popular Stripes application.

**Design and implementation**

I started the project by exploring [Dribbble](https://dribbble.com/) and other retail apps on the web such as [Aliexpress](https://www.aliexpress.com) to try and draw inspiration from these. Along the way, I inspected the HTML code and jotted down details about certain elements that could be reused in my own app. This permitted me to land a simple visual design with basic functionalities. I made use of the following tools to design my prototypes:

- The [Justinmind prototyper](https://www.justinmind.com/) for the web application
- [Ionic Creator](https://creator.ionic.io/share/0990d92231a7) for the mobile app

However, the look and feel of the app changed along the way...

After this stage, I scaffolded my express application using the application generation tool (*express-generator*). I then reorganized the directory structure to suit my needs. 

I started building the application from the backend by creating schemas and a mongodb database locally. I added mock products to my database for testing purposes. The reason for my using a NOSQL database is simply that I don't have a thorough knowledge of relational databases (though I somtimes use SQLite). 

I implemented the business logic in NodeJS. But I didn't write all the code from scratch which would have been tedious. I adapted parts 
of it from various sources, including the [MongoDB for NodeJS developers](https://university.mongodb.com/courses/M101JS/about) course by the [MongoDB University](https://university.mongodb.com/) which I recently completed. Of course, it is always good practice to reuse code where possible. 

For the templating, I used the *html* template engine. And the client side was formatted using html5 and Twitter Bootstrap.

**Here are a few screenshots**

![Web app without data](MischMart1/data/m1.png)
