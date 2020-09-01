var Parse = window.Parse;

document.addEventListener('DOMContentLoaded', () => {
	const loggedInUser = Parse.User.current();

	var element = document.getElementById(loggedInUser ? 'member' : 'non-member');

	if (element) {
		element.setAttribute('style', 'display: block;');
	}

	element = document.getElementById(loggedInUser ? 'member-func' : 'non-member-func');

	if (element) {
		element.setAttribute('style', 'display: block;');
	}

	element = document.getElementById('logoutButton');

	if (element) {
		element.addEventListener('click', () => {
			Parse.User.logOut().catch(() => { }).then(() => {
				window.location.href = '/index.html';
				return false;
			});
		}, false);
	}

	element = document.getElementById('logoutButton2');

	if (element) {
		element.addEventListener('click', () => {
			Parse.User.logOut().catch(() => { }).then(() => {
				window.location.href = '/index.html';
				return false;
			});
		}, false);
	}

	if (loggedInUser) {
		element = document.getElementById('chuanchengCheck');

		if (element) {
			const pathname = window.location.pathname;
			Parse.Cloud.run("home:getAttendance", { pathname })
				.then(result => {
					console.log(
						`getAttendance - result: ${JSON.stringify(result)}`
					);
					element.setAttribute('type', 'checkbox');
					element.checked = result.chuanCheng;

					element.addEventListener('change', function () {
						const attendance = { chuanCheng: this.checked };

						Parse.Cloud.run("home:updateAttendance", { pathname, attendance })
							.then(result => {
								console.log(
									`updateAttendance - result: ${JSON.stringify(result)}`
								);
							})
							.catch(e => {
								console.log(`error in updateAttendance: ${e}`);
							});
					});


					element = document.getElementById('fabenCheck');

					if (element) {
						element.setAttribute('type', 'checkbox');
						element.checked = result.faBen;

						element.addEventListener('change', function () {
							const attendance = { faBen: this.checked };

							Parse.Cloud.run("home:updateAttendance", { pathname, attendance })
								.then(result => {
									console.log(
										`updateAttendance - result: ${JSON.stringify(result)}`
									);
								})
								.catch(e => {
									console.log(`error in updateAttendance: ${e}`);
								});
						});
					}

					element = document.getElementById('fudaoCheck');

					if (element) {
						element.setAttribute('type', 'checkbox');
						element.checked = result.fuDao;

						element.addEventListener('change', function () {
							const attendance = { fuDao: this.checked };
	
							Parse.Cloud.run("home:updateAttendance", { pathname, attendance })
								.then(result => {
									console.log(
										`updateAttendance - result: ${JSON.stringify(result)}`
									);
								})
								.catch(e => {
									console.log(`error in updateAttendance: ${e}`);
								});
						});
						}

				})
				.catch(e => {
					console.log(`error in getAttendance: ${e}`);
				});
		}
	}
}, false);
