class ToggleSidebar {
	addedSidebar = false;
	initialized = false;
	body = false;
	sidebars = false;
	sidebarElements = false;
	sidebarList = false;

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
	//********************
	//USER RELATIVE METHODS
	//********************

	addSidebar(sidebar) {
		//function to add a sidebar. This adds to HTML nodes sidebar data- attributes using and fill class information using child functions
		const errorText = "Configuration error when adding a toggle sidebar:";
		let errorMsg = [];

		//check addSidebar({}) Object Errors
		this.addSidebar_SBOE(sidebar);

		//check or generate sidebar name
		sidebar.name = this.addSidebar_autoNaming(sidebar.name);

		//set autoClose to true (close when click out of container) when no close node was specified.
		//OR if sidebar.autoClose is specified it will be used.
		//Default is false
		const autoClose = !sidebar.closeSidebarNode || sidebar.autoClose || false;

		//set close nodes
		this.addSidebar_setCloseSidebarNodes(sidebar);

		//set container node
		this.addSidebar_setContainerSidebarNode(sidebar, autoClose);

		if (typeof sidebar.omitCloseNode !== "undefined") {
			this.addSidebar_setOmitCloseSidebarNodes(sidebar);
		}

		this.addSidebar_setOpenSidebarNode(sidebar);

		this.addedSidebar = true;
		this.init();
	}

	hide(sidebarName) {
		setTimeout(
			function () {
				this.sidebarList.forEach((sidebar) => {
					if (sidebar.name == sidebarName) {
						if (sidebar.openStatus) {
							this.closeActionHandler(sidebar, true);
						}
					}
				});
			}
				.bind(this, sidebarName)
				.bind(this, this),
			1
		);
	}

	init() {
		//Plugin initialization to reading sidebar data- attributes

		//sidebar containers
		this.sidebars = document.querySelectorAll("[data-sidebar-container]");

		//sidebar action buttons (open and close)
		this.sidebarElements = document.querySelectorAll("[data-sidebar-action]");
		//check existence of sidebar container AND elements
		if (this.sidebars.length == 0 || this.sidebars.length == 0) {
			return;
		}
		if (this.sidebars.length > 0) {
			this.addedSidebar = true;
		}
		//Getting HTML body tag
		this.body = document.querySelector("body");

		this.sidebarList = [];
		//getting and setting sidebars relative data (name, activation class,
		//autoclose, openStatus) and open close nodes
		this.sidebars.forEach((node) => {
			let sidebarInfo = {};
			sidebarInfo.name = node.dataset.sidebar;
			sidebarInfo.activationClass = node.dataset.sidebarActivateClass;
			sidebarInfo.containerNode = node;
			sidebarInfo.openSidebarNode = [];
			sidebarInfo.closeSidebarNode = [];
			sidebarInfo.omitClose = [];
			this.sidebarElements.forEach((el) => {
				if (sidebarInfo.name == el.dataset.sidebar) {
					if (el.dataset.sidebarAction == "open") {
						sidebarInfo.openSidebarNode.push(el);
					}
					if (el.dataset.sidebarAction == "close") {
						sidebarInfo.closeSidebarNode.push(el);
					}
				}
				if (
					el.dataset.sidebarAction == "omit-close" &&
					el.dataset.sidebarOmit.includes(sidebarInfo.name)
				) {
					sidebarInfo.omitClose.push(el);
				}
			});

			let autoClose = node.dataset.sidebarAutoClose == "true" || false;
			if (!sidebarInfo.closeSidebarNode) {
				autoClose = true;
			}
			sidebarInfo.autoClose = autoClose;
			sidebarInfo.openStatus = false;
			this.sidebarList.push(sidebarInfo);
		});
		if (this.sidebars.length > 0 && this.addedSidebar) {
			this.execute();
			this.initialized = true;
		}
	}

	toggle(sidebarName) {
		setTimeout(
			function () {
				this.sidebarList.forEach((sidebar) => {
					if (sidebar.name == sidebarName) {
						if (sidebar.openStatus) {
							this.hide(sidebarName);
						} else {
							this.show(sidebarName);
						}
					}
				});
			}
				.bind(this, sidebarName)
				.bind(this, this),
			1
		);
	}

	show(sidebarName) {
		//show sidebar emulating the mouse up event
		setTimeout(
			function () {
				let openNode = false;
				this.sidebarList.forEach((sidebar) => {
					if (sidebar.name == sidebarName && !openNode) {
						this.sidebarElements.forEach((node) => {
							if (
								node.dataset.sidebar == sidebarName &&
								node.dataset.sidebarAction == "open"
							) {
								openNode = node;
								return;
							}
						});
					}
				});
				if (openNode !== false) {
					const clickEvent = new MouseEvent("mouseup");
					openNode.dispatchEvent(clickEvent);
				} else {
					this.die("Can't show sidebar", [
						"Sidebar '" + sidebarName + "' not found or initialized",
					]);
				}
			}
				.bind(this, sidebarName)
				.bind(this, this),
			1
		);
	}
	//********************************
	//PLUGIN INTERNAL RELATIVE METHODS
	//********************************

	addSidebar_autoNaming(name) {
		//if not sidebar name was specified a sidebar name will be created with current timestamp

		if (this.sidebarList.length > 0) {
			this.sidebarList.forEach((sidebar) => {
				if (sidebar.name == name) {
					this.die("Sidebar name exists!", [
						"A sidebar called '" + name + "' is already added.",
					]);
				}
			});
		}

		if (typeof name === "undefined") {
			name = "ToggleSidebar-" + Date.now();
			console.warn(
				'A sidebar name was not specified. "' +
					name +
					'" will be used instead '
			);
		}
		return name;
	}

	addSidebar_SBOE(sidebar) {
		//addSidebar({sidebar}) Object Error
		const errorText = "Configuration error when adding a toggle sidebar:";
		let errorMsg = [];

		/*
		verifying errors
		*/
		if (!(sidebar instanceof Object) && sidebar !== null) {
			//if function param is not and object
			errorMsg.push("addSidebar function requires pass an JS object");
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
	}

	addSidebar_setCloseSidebarNodes(sidebar) {
		//if close node was specified in function parameter object will add the dataset propierties
		if (typeof sidebar.closeSidebarNode !== "undefined") {
			sidebar.closeSidebarNode = this.getArrayNodes(
				sidebar.closeSidebarNode,
				"close sidebar node"
			);
			if (!(sidebar.closeSidebarNode instanceof Array)) {
				this.die("Close sidebar node error:", [
					"Especified close sidebar node is not valid or not found",
				]);
			} else {
				//loop trought all nodes in all node list
				sidebar.closeSidebarNode.forEach((nodeList) => {
					nodeList.forEach((node) => {
						node.dataset.sidebar = sidebar.name;
						node.dataset.sidebarAction = "close";
						node.addEventListener("click", function (evt) {
							evt.preventDefault();
						});
					});
				});
			}
		}
	}

	addSidebar_setContainerSidebarNode(sidebar, autoClose) {
		//verifying container nodes
		sidebar.containerNode = this.getArrayNodes(
			sidebar.containerNode,
			"sidebar container node"
		);
		if (!(sidebar.containerNode instanceof Array)) {
			this.die("Container sidebar node error:", [
				"The specified sidebar HTML node container is invalid or not found",
			]);
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
	}

	addSidebar_setOmitCloseSidebarNodes(sidebar) {
		/* omitClose nodes*/
		sidebar.omitCloseNode = this.getArrayNodes(sidebar.omitCloseNode);
		if (!(sidebar.omitCloseNode instanceof Array)) {
			this.die("Omit Close node(s) error", [
				"'omitCloseNode' attribute can be an array or string but needs to exists in the HTML code",
			]);
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
					node.addEventListener("click", function (evt) {
						evt.preventDefault();
					});
				});
			});
		}
	}

	addSidebar_setOpenSidebarNode(sidebar) {
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
					node.addEventListener("click", function (evt) {
						evt.preventDefault();
					});
				});
			});
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

	getArrayNodes(data, node) {
		// getArrayNodes will search for nodes in current document and returns an array of nodeLists
		let errorText = "";
		const errorMsg = [];
		const arrayNodes = [];
		// verifying for string
		if (typeof data === "string") {
			//Strings only can start with dot (.) or hastag(#)
			const firstChar = data.charAt(0);
			if (firstChar !== "." && firstChar !== "#") {
				errorMsg.push(
					"String needs to start with dot (.) for class or hastag(#) for id to find the node"
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

		// verifying for node list (instance of NodeList)
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
			window.removeEventListener("mouseup", this.bodyActionHandler, false);
			// removing activation class
			this.body.classList.remove(sidebar.activationClass);
			// remove saidebar open status
			sidebar.openStatus = false;
			// adding event listener to sidebar open node
			sidebar.openSidebarNode.forEach((node) => {
				node.addEventListener("mouseup", this.openActionHandler, false);
			});
		} else {
			// adding listener to body. This will compare the next user clicked node
			window.addEventListener("mouseup", this.bodyActionHandler, false);
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

		window.removeEventListener("mouseup", this.bodyActionHandler, false);
		this.sidebarList.forEach((sidebar) => {
			if (typeof sidebar.containerNode.dataset.initialized == "undefined") {
				sidebar.openSidebarNode.forEach((node) => {
					node.removeEventListener(
						"mouseup",
						this.openActionHandler,
						false
					);
				});
				sidebar.openSidebarNode.forEach((node) => {
					node.addEventListener("mouseup", this.openActionHandler, false);
				});
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
			this.sidebarList.forEach((sidebar) => {
				if (clickedElement.dataset.sidebar == sidebar.name) {
					//removing open listener to add later a close function to
					//sidebar open node
					sidebar.openSidebarNode.forEach((node) => {
						node.removeEventListener(
							"mouseup",
							this.openActionHandler,
							false
						);
					});
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
			this.sidebarList.forEach((testbar) => {
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

			//Checking if the clicked element has or is inside one with a dataset "sidebar-omit" property and the name of the currently open sidebar
			let omitClose = false;
			if (
				clicked.closest("[data-sidebar-omit*=" + sidebar.name + "]") !==
				null
			) {
				omitClose = true;
			}
			// comparing clicked element with any of the possible close elements
			let clickedCloseNode = false;

			sidebar.closeSidebarNode.forEach((closeNode) => {
				if (
					closeNode.dataset.sidebar == clicked.dataset.sidebar &&
					closeNode.dataset.sidebarAction == clicked.dataset.sidebarAction
				) {
					clickedCloseNode = true;
				}
			});
			let closeWithOpenNode = false;
			if (
				(clicked == sidebar.openSidebarNode ||
					sidebar.openSidebarNode.includes(clicked)) &&
				!omitClose
			) {
				closeWithOpenNode = true;
			}

			if (
				(clicked == sidebar.openSidebarNode ||
					sidebar.openSidebarNode.includes(clicked) ||
					clickedCloseNode ||
					(sidebar.autoClose && sidebarClicked === null) ||
					linkClicked !== null) &&
				!omitClose
			) {
				//comparing clicked element with open node (two first lines), close or inside sidebar
				//removing body event listener in body (this helps avoid double listener)
				window.removeEventListener(
					"mouseup",
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
