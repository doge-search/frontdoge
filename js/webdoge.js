school_list = ["MIT", "Stanford", "UCB"];

$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "webdoge/" + school_list[0] + "/" + school_list[0] + ".xml",
		dataType: "xml",
		success: function (xml) {
		}
	});
});