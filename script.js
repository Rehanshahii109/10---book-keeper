const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// Show modal, focus on input
function showModal() {
	modal.classList.add("show-modal");
	websiteNameEl.focus();
}

// Modal event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
	modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
	e.target === modal ? modal.classList.remove("show-modal") : false
);

// Function to show messages in the bookmarks container
function showMessage(message) {
	const messageEl = document.createElement("div");
	messageEl.classList.add("message");
	messageEl.textContent = message;
	bookmarksContainer.appendChild(messageEl);

	// Remove the message after a few seconds
	setTimeout(() => {
		messageEl.remove();
	}, 2000);
}

// Validate form
function validate(nameValue, urlValue) {
	const expression =
		/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

	const regex = new RegExp(expression);
	if (!nameValue || !urlValue) {
		showMessage("Please provide a valid web address");
		return false;
	}

	if (!urlValue.match(regex)) {
		showMessage("Please provide a valid web address");
		return false;
	}
	return true;
}

// Build bookmarks DOM
function buildBookmarks() {
	bookmarksContainer.textContent = "";
	bookmarks.forEach((bookmark) => {
		const { name, url } = bookmark;

		// Item
		const item = document.createElement("div");
		item.classList.add("item");

		// Close icon
		const closeIcon = document.createElement("i");
		closeIcon.classList.add("fas", "fa-times");
		closeIcon.setAttribute("title", "delete bookmark");
		closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

		// Favicon / link container
		const linkInfo = document.createElement("div");
		linkInfo.classList.add("name");

		// Favicon
		const favicon = document.createElement("img");
		favicon.setAttribute(
			"src",
			`https://s2.googleusercontent.com/s2/favicons?domain=${url}`
		);
		favicon.setAttribute("alt", "favicon");

		// Link
		const link = document.createElement("a");
		link.setAttribute("href", `${url}`);
		link.setAttribute("target", "_blank");
		link.textContent = name;

		// Append to bookmarks container
		linkInfo.append(favicon, link);
		item.append(closeIcon, linkInfo);
		bookmarksContainer.appendChild(item);
	});
}

// Fetch bookmarks
function fetchBookmarks() {
	if (localStorage.getItem("bookmarks")) {
		bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
	} else {
		bookmarks = [
			{
				name: "jacinto design",
				url: "https://jacinto.design",
			},
		];
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	}
	buildBookmarks();
}

// Delete bookmark
function deleteBookmark(url) {
	bookmarks.forEach((bookmark, i) => {
		if (bookmark.url === url) {
			bookmarks.splice(i, 1);
		}
	});
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameEl.value;
	let urlValue = websiteUrlEl.value;

	if (!urlValue.includes("https://")) {
		urlValue = `https://${urlValue}`;
	}

	if (!validate(nameValue, urlValue)) {
		return false;
	}

	const bookmark = {
		name: nameValue,
		url: urlValue,
	};

	bookmarks.push(bookmark);
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	bookmarkForm.reset();
	websiteNameEl.focus();
	modal.classList.remove("show-modal"); // Close the modal
	buildBookmarks(); // Refresh bookmarks
}

// Event listener for the form submission
bookmarkForm.addEventListener("submit", storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();
