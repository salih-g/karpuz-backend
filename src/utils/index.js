const urlify = (text) => {
	var urlRegex = /(https?:\/\/[^\s]+)/g;
	return text?.replace(urlRegex, function (url) {
		return `<a target="_blank" style="text-decoration: underline;" href=" ${url} " >${new URL(url).host}${new URL(url).pathname} </a>`;
	});
};

module.exports = { urlify };
