class ToggleSidebar {
	name = "";
	evtOpts = false;
	addedSidebar = false;
	initialized = false;

	constructor(element) {
		//Generating bind actions to listener functionality
		this.openActionHandler = this.openSidebar.bind(this);
		this.closeActionHandler = this.closeSidebar.bind(this);
		this.bodyActionHandler = this.sidebarBodyListener.bind(this);

		//verifying constructor element or initializing sidebars functionality
		if (typeof element !== "undefined") {
			this.addSidebar(element);
		} else {
			//if not sidebar was added, the plugin will search for nodes with data-sidebar-* attributes
			this.init();
		}
	}

	addSidebar(sidebar) {
		//function to add a sidebar. This adds to HTML nodes sidebar data- attributes
		const errorText = "Configuration error when adding a toggle sidebar:";
		let errorMsg = [];

		/*
		verifying errors
		*/
		if (!(sidebar instanceof Object) && sidebar !== null) {
			//if function param is not and object
			errorMsg.push("addSidebar function requires an JS object");
		}

		if (typeof sidebar.activationClass === "undefined") {
			//if container activation class name was not specified
			errorMsg.push("An activation CSS class was not specified");
		}

		if (
			typeof sidebar.autoClose !== "undefined" &&
			typeof sidebar.autoClose !== "boolean"
		) {
			errorMsg.push(
				"'autoClose' parameter is not boolean (true or false without quotes)"
			);
		}
		if (typeof sidebar.containerNode === "undefined") {
			//if container HTML node was not specified
			errorMsg.push(
				"An sidebar node (container or wrapper) was not specified"
			);
		}

		if (typeof sidebar.openSidebarNode === "undefined") {
			//if HTML open node was not specified
			errorMsg.push("An opener (activate) node was not specified");
		}
		if (errorMsg.length > 0) {
			//throw error (finalize executuion) if any error was found
			this.die(errorText, errorMsg);
		}

		//if not sidebar name was specified a sidebar name will be created with current timestamp
		if (typeof sidebar.name === "undefined") {
			sidebar.name = "ToggleSidebar-" + Date.now();
			console.warn(
				'A sidebar name was not specified. "' +
					sidebar.name +
					'" will be used instead '
			);
		}

		//set autoClose to true (close when click out of container) when no close node was specified.
		//OR if sidebar.autoClose is specified it will be used.
		//Default is false
		const autoClose = !sidebar.closeSidebarNode || sidebar.autoClose || false;

		//if close node was specified in function parameter object will add the dataset propierties
		if (typeof sidebar.closeSidebarNode !== "undefined") {
			sidebar.closeSidebarNode = this.getArrayNodes(
				sidebar.closeSidebarNode,
				"close sidebar node"
			);
			if (!(sidebar.closeSidebarNode instanceof Array)) {
				errorMsg.push(
					"Especified close sidebar node is not valid or not found"
				);
			} else {
				//loop trought all nodes in all node list
				sidebar.closeSidebarNode.forEach((nodeList) => {
					nodeList.forEach((node) => {
						node.dataset.sidebar = sidebar.name;
						node.dataset.sidebarAction = "close";
					});
				});
			}
		}

		//verifying container nodes
		sidebar.containerNode = this.getArrayNodes(
			sidebar.containerNode,
			"sidebar container node"
		);
		if (!(sidebar.containerNode instanceof Array)) {
			errorMsg.push(
				"The specified sidebar HTML node container is invalid or not found"
			);
		} else {
			//setting the HTML container node data- attributes in function parameter object
			sidebar.containerNode.forEach((nodeList) => {
				nodeList.forEach((node) => {
					node.dataset.sidebarContainer = "true";
					node.dataset.sidebar = sidebar.name;
					node.dataset.sidebarActivateClass = sidebar.activationClass;
					node.dataset.sidebarAutoClose = autoClose;
				});
			});
		}

		/* omitClose nodes*/
		if (typeof sidebar.closeSidebarNode !== "undefined") {
			// getArrayNodes will search for nodes in current document
			sidebar.omitCloseNode = this.getArrayNodes(sidebar.omitCloseNode);
			if (!(sidebar.omitCloseNode instanceof Array)) {
				errorMsg.push(
					"'omitCloseNode' attribute can be an array or string but needs to exists in the HTML code"
				);
			} else {
				sidebar.omitCloseNode.forEach((nodeList) => {
					nodeList.forEach((node) => {
						let barsArray = [];
						if (typeof node.dataset.sidebarOmit === "undefined") {
							barsArray.push(sidebar.name);
						} else {
							barsArray.push(node.dataset.sidebarOmit.split(","));
							barsArray.push(sidebar.name);
						}
						node.dataset.sidebarOmit = barsArray;
						node.dataset.sidebarAction = "omit-close";
					});
				});
			}
		}

		//verifying open sidebar nodes exists
		sidebar.openSidebarNode = this.getArrayNodes(
			sidebar.openSidebarNode,
			"open sidebar node"
		);
		if (!(sidebar.openSidebarNode instanceof Array)) {
			errorMsg.push(
				"Especified open sidebar node is not valid or not found"
			);
		} else {
			sidebar.openSidebarNode.forEach((nodeList) => {
				nodeList.forEach((node) => {
					//setting the HTML open node data- attributes in function parameter object
					node.dataset.sidebar = sidebar.name;
					node.dataset.sidebarAction = "open";
				});
			});
		}

		if (errorMsg.length > 0) {
			//throw error (finalize executuion) if any error was found
			this.die(errorText, errorMsg);
		} else {
			this.addedSidebar = true;
			this.init();
		}
	}

	die(text, msgArray) {
		//Function to show an error in console and end execution of JS script
		let errorCounter = 0;
		text = "\n" + text + "\n";
		msgArray.forEach((msg) => {
			errorCounter++;
			text += errorCounter + ". " + msg + "\n";
		});
		throw new Error(text);
	}

	init() {
		//Plugin initialization reading sidebar data- attributes

		//Getting HTML body tag
		this.body = document.querySelector("body");
		//sidebar containers
		this.sidebars = document.querySelectorAll("[data-sidebar-container]");
		//sidebar action buttons (open and close)
		this.sidebarsElements = document.querySelectorAll(
			"[data-sidebar-action]"
		);

		if (this.sidebars.length > 0) {
			this.addedSidebar = true;
		}
		this.sidebarsList = [];
		//getting and setting sidebars relative data (name, activation class,
		//autoclose, openStatus) and action nodes
		this.sidebars.forEach((node) => {
			let sidebarInfo = {};
			sidebarInfo.name = node.dataset.sidebar;
			sidebarInfo.activationClass = node.dataset.sidebarActivateClass;
			sidebarInfo.containerNode = node;
			sidebarInfo.omitClose = [];
			this.sidebarsElements.forEach((el) => {
				if (sidebarInfo.name == el.dataset.sidebar) {
					if (el.dataset.sidebarAction == "open") {
						console.log(el);
						sidebarInfo.openSidebarNode = el;
					}
					if (el.dataset.sidebarAction == "close") {
						sidebarInfo.closeSidebarNode = el;
					}
					if (el.dataset.sidebarAction == "omit-close") {
						sidebarInfo.omitClose.push(el);
					}
				}
			});
			let autoClose = node.dataset.sidebarAutoClose == "true" || false;
			if (!sidebarInfo.closeSidebarNode) {
				autoClose = true;
			}
			sidebarInfo.autoClose = autoClose;
			sidebarInfo.openStatus = false;
			this.sidebarsList.push(sidebarInfo);
		});
		if (this.sidebars.length > 0 && this.addedSidebar) {
			this.execute();
			this.initialized = true;
		}
	}

	getArrayNodes(data, node) {
		let errorText = "";
		const errorMsg = [];
		const arrayNodes = [];
		// verifying for string
		if (typeof data === "string") {
			//Strings only can start with dot (.) or hastag(#)
			const firstChar = data.charAt(0);
			if (firstChar !== "." && firstChar !== "#") {
				errorMsg.push(
					"String needs to start with dot (.) or hastag(#) to find the node"
				);
			} else {
				arrayNodes.push(document.querySelectorAll(data));
			}
		}
		// verifying for node (.nodeType === 1)
		if (data !== null && data.nodeType === 1) {
			//if node is passed it will create a unique attribute
			const attName = "togglesidebarwrapnodelist" + Date.now();
			data.setAttribute(attName, "");
			arrayNodes.push(document.querySelectorAll("[" + attName + "]"));
			data.removeAttribute(attName);
		}

		// verifyiong for node list (instance of NodeList)
		if (data instanceof NodeList) {
			arrayNodes.push(data);
		}

		//verifyng for an array passed to function (one or more nodes required as omit close)
		if (data instanceof Array) {
			data.forEach((slice) => {
				arrayNodes.push(this.getArrayNodes(slice, node)[0]);
			});
		}

		// verifying for array to has a nodeList only in content
		if (
			(data === null ||
				typeof data !== "string" ||
				!(data instanceof Array)) &&
			arrayNodes[0].length == 0
		) {
			errorText = "The node is not valid or mistyped";
			if (typeof data === "string" || typeof data === "number") {
				errorText += ": '" + data + "'";
			}
			errorMsg.push(errorText);
		}
		if (errorMsg.length > 0) {
			if (typeof data === "string" && typeof node === "undefined") {
				errorText = "'" + data + "'";
			} else {
				errorText = "The node '" + node + "' ";
			}
			errorText += " is not valid or not found:";

			//throw error (finalize executuion) if any error was found
			this.die(errorText, errorMsg);
		}
		return arrayNodes;
	}

	closeSidebar(sidebar, force) {
		// function to close sidebar. If force parameter is not true or present a
		// body listener is added to run sidebarBodyListener function
		// (this.bodyActionHandler) on next user click. The only action to
		// close sidebar is remove the sidebar activation CSS class in body HTML tag

		if (force) {
			//removing body listener
			window.removeEventListener("mousedown", this.bodyActionHandler, false);
			// removing activation class
			this.body.classList.remove(sidebar.activationClass);
			// remove saidebar open status
			sidebar.openStatus = false;
			// adding event listener to sidebar open node
			sidebar.openSidebarNode.addEventListener(
				"mousedown",
				this.openActionHandler,
				false
			);
		} else {
			// adding listener to body. This will compare the next user clicked node
			window.addEventListener("mousedown", this.bodyActionHandler, false);
		}
	}

	execute() {
		// function to create listeners on sidebars open nodes

		// console warning if plugins was not initlialized (init()) or sidebar added
		if (!this.addedSidebar && !this.initialized) {
			console.warn(
				'\nNo sidebar specified with "data-sidebar" attributes in HTML or an JS object.\n'
			);
			return;
		}
		//removing any possible event listener relative to ToggleSidebar in
		//HTML body tag or sidebars open nodes

		window.removeEventListener("mousedown", this.bodyActionHandler, false);
		this.sidebarsList.forEach((sidebar) => {
			if (typeof sidebar.containerNode.dataset.initialized == "undefined") {
				sidebar.openSidebarNode.removeEventListener(
					"mousedown",
					this.openActionHandler,
					false
				);
				sidebar.openSidebarNode.addEventListener(
					"mousedown",
					this.openActionHandler,
					false
				);
				sidebar.containerNode.dataset.initialized = true;
			}
		});
	}

	openSidebar(event) {
		//function to open sidebars
		//The real action to open a sidebar is adding to body the activation CSS class
		//stop event propagation to avoid double click actions
		event.stopPropagation();
		if (event.button == 0) {
			//clicked element
			const clickedElement = event.target;
			this.sidebarsList.forEach((sidebar) => {
				if (clickedElement.dataset.sidebar == sidebar.name) {
					//removing open listener to add later a close function to
					//sidebar open node
					sidebar.openSidebarNode.removeEventListener(
						"mousedown",
						this.openActionHandler,
						false
					);
					// adding sidebar activation class to HTML body node
					this.body.classList.add(sidebar.activationClass);
					sidebar.openStatus = true;
					//Timeout to add the close functionality in open node
					setTimeout(
						(that) => {
							that.closeActionHandler(sidebar, false);
						},
						50,
						this
					);
				} else if (sidebar.openStatus === true) {
					//if any sidebar is opened for any reason and is not the
					//clicked open sidebar node relative sidebar node, foreced sidebar
					//close command is triggered to avoid showing double sidebar
					this.closeActionHandler(sidebar, true);
				}
			});
		}
	}

	sidebarBodyListener(evt) {
		//function to listen any click and compare if click will trigger
		//the close sidebar action

		//stop event propagation to avoid double click actions
		evt.stopPropagation();
		if (evt.button == 0) {
			//clicked element
			const clicked = evt.target;
			let sidebar;

			//searching the first sidebar with openStatus = true.
			//Any other sidebar was closed in openSidebar function
			this.sidebarsList.forEach((testbar) => {
				if (testbar.openStatus) {
					sidebar = testbar;
					return;
				}
			});

			//getting sidebar container node
			const sidebarClicked = clicked.closest(
				"[data-sidebar=" + sidebar.name + "]"
			);
			// getting if link was clicked
			const linkClicked = clicked.closest("a");

			//comparing clicked element with open, close or inside sidebar
			///aqui va lo que se debe omitir
			let omitClose = false;

			if (
				typeof clicked.dataset.sidebarAction != "undefined" &&
				clicked.dataset.sidebarAction == "omit-close"
			) {
				clicked.dataset.sidebarOmit.split(",").forEach((name) => {
					if (sidebar.name == name) {
						omitClose = true;
					}
				});
			}

			if (
				(clicked == sidebar.openSidebarNode ||
					clicked == sidebar.closeSidebarNode ||
					(sidebar.autoClose && sidebarClicked === null) ||
					linkClicked !== null) &&
				!omitClose
			) {
				//removing body event listener in body (this helps avoid double listener)
				window.removeEventListener(
					"mousedown",
					this.bodyActionHandler,
					false
				);
				//forcing sidebar close
				this.closeActionHandler(sidebar, true);
			}
		}
	}
}

/*
USE EXAMPLE
window.addEventListener("DOMContentLoaded", (event) => {
	const sidebar = new ToggleSidebar();

	sidebar.addSidebar({
		name: "login-sidebar",
		activationClass: "show-login",
		autoClose: true,
		closeSidebarNode: document.querySelector("#login-container .icon-close"),
		containerNode: document.getElementById("login-container"),
		openSidebarNode: document.querySelector("#login-button"),
	});
});
*/
