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

}, false);
