const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');
const db = require('./db/db');
const upload = multer({dest: 'tmp/csv/'}).single('file');

app.post('/upload-csv', upload, (request, response) => {
	let fileRows = [];
	// open uploaded file
	fs.createReadStream(request.file.path)
		.pipe(csv.parse({headers: true, delimiter: ';'}))
		.on("data", function (data) {
			fileRows.push(data);
		})
		.on("end", function () {
			fs.unlink(request.file.path, (err) => {
				if (err) {
					response.json({
						status: 500,
						message: err
					})
				} else {
					fileRows = fileRows.map((a) => {
						return [a.UserName, a.FirstName, a.LastName, a.Age]
					});
					insertDataToDb(fileRows, (error) => {
						if (error) {
							response.json({
								status: 500,
								message: error
							})
						} else {
							response.json({
								status: 200,
								message: 'Successfully added to DB!'
							})
						}
					});
				}
			});
		})
});

app.get('/get-accounts', (request, response) => {
	db.query('SELECT * FROM accounts', [], (error, result) => {
		if (error) {
			response.json({
				status: 500,
				message: error
			})
		} else {
			response.json({
				status: 200,
				accounts: result
			})
		}
	})
});

app.get('/export-accounts', (request, response) => {
	let time = Math.floor(Date.now() / 1000);
	let path = "out_" + time + ".csv";
	let ws = fs.createWriteStream(path);
	db.query('SELECT * FROM accounts', [], (error, result) => {
		if (error) {
			response.json({
				status: 500,
				message: error
			})
		} else {
			csv
				.write(result, {headers: true})
				.pipe(ws)
				.on('close', function () {
					response.download(path, (err) => {
						if (err) {
							response.json({
								status: 500,
								message: err
							})
						}
						fs.unlink(path, (err) => {
							if (err) {
								console.error(err);
							}
						});
					})
				});
		}
	})
});

function insertDataToDb(data, cb) {
	db.query('INSERT IGNORE INTO accounts(username, firstname, lastname, age) VALUES ?', [data], (err) => {
		cb(err)
	})
}

// Start server
app.listen(3000);