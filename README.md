# API on Express and MYSQL DB

Service where you can POST data from CSV file to DB
and GET data from DB in two options:
- in JSON format
- export in CSV file

# Getting started

**1. Install modules**
```bash
$ npm install
```
**2. Configure your database**

- Create database 'usernames';

- Execute _usernames.sql_ file from "db/" directory;

- Open _db.js_ file and input your details:
```bash
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'users'
```

**3. Run your server**
```bash
node app.js
```