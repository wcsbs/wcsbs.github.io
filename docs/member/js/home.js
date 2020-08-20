var Parse = window.Parse;

customElements.define(
	'member-func',
	class extends HTMLElement {
		constructor() {
			super();
			const template = document.getElementById('member-template');
			const templateContent = template.content;
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(templateContent.cloneNode(true));

			this.shadowRoot.querySelector('#logoutButton').addEventListener('click', this.logout);
		}

		logout() {
			Parse.User.logOut().catch(() => {}).then(() => {
				window.location.href = '/index.html';
			});
		}

		connectedCallback() {
			// prevent flicker
			window.addEventListener(
				'load',
				() => {
					if (Parse.User.current()) {
						this.shadowRoot.querySelector('#member').setAttribute('style', 'display: block;');
					} else {
						this.shadowRoot.querySelector('#non-member').setAttribute('style', 'display: block;');
					}
				},
				false
			);
		}
	}
);

customElements.define(
	'member-menu',
	class extends HTMLElement {
		constructor() {
			super();
			const template = document.getElementById('member-menu');
			const templateContent = template.content;
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(templateContent.cloneNode(true));

			this.shadowRoot.querySelector('#logoutButton').addEventListener('click', this.logout, false);
		}

		logout() {
			Parse.User.logOut().catch(() => {}).then(() => {
				window.location.href = '/index.html';
				return false;
			});
		}

		connectedCallback() {
			// prevent flicker
			window.addEventListener(
				'load',
				() => {
					if (Parse.User.current()) {
						this.shadowRoot.querySelector('#member').setAttribute('style', 'display: block;');
					} else {
						this.shadowRoot.querySelector('#non-member').setAttribute('style', 'display: block;');
					}
				},
				false
			);
		}
	}
);
