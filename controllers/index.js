const csv = require('fast-csv');
const fs = require('fs');
const db = require('../db/db');

exports.importAccounts = function (request, response) {
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
					fileRows = fileRows.filter(a => a.UserName && a.FirstName && a.LastName && a.Age).map((a) => {
						return [a.UserName, a.FirstName, a.LastName, a.Age]
					});
					if (!fileRows.length) {
						response.json({
							status: 400,
							message: 'Unverified format of CSV file!'
						})
					} else {
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
				}
			});
		})
};

exports.getAccounts = function (request, response) {
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
};

exports.exportAccounts = function (request, response) {
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
};

function insertDataToDb(data, cb) {
	db.query('INSERT IGNORE INTO accounts(username, firstname, lastname, age) VALUES ?', [data], (err) => {
		cb(err)
	})
}