school_list = ["MIT", "Stanford", "UCB"];

function GoFunc(e) {
	$.ajax({
		type: "GET",
		url: "webdoge/" + e + "/" + e + ".xml",
		dataType: "xml",
		success: function (xml) {
			$("#select-person").empty();
			$("#people").empty();
			$("#people").get()[0].scrollTop = 0;
			first = [];
			dict = new Object();
			$(xml).find("professor name").each(function () {
				f = $(this).text().trim()[0].toLocaleUpperCase();
				if (!dict.hasOwnProperty(f)) {
					dict[f] = [];
					first.push(f);
				}
				dict[f].push($(this).text());
			});
			first.sort();
			$.each(first, function (i, e) {
				div = $("<div>").append($("<span>").text(e));
				$("#select-person").append(div);
				div.hover(function () {
					$("#people").stop();
					$("#people").animate({scrollTop: $("#person-" + e).get()[0].offsetTop - 20}, 300);
				});
				div = $("<div id='person-" + e + "'>");
				div.append($("<h2>").text(e));
				$.each(dict[e], function (i, e) {
					a = $("<a href='#' onclick='return false;'>").text(e);
					a.click(function () {GoFunc(e);});
					div.append(a);
					div.append($("<br>"));
				});
				$("#people").append(div);
				if (i != first.length - 1) {
					$("#people").append($("<hr>"));
				}
			});
			$("#PageSchool").stop();
			$("#PageSchool").animate({left: "26%"}, 300);
			$("#PagePerson").stop();
			$("#PagePerson").animate({left: "74%"}, 300);
		}
	});
}

$(document).ready(function() {
	first = [];
	dict = new Object();
	$.each(school_list, function (i, e) {
		f = e[0].toLocaleUpperCase();
		if (!dict.hasOwnProperty(f)) {
			dict[f] = [];
			first.push(f);
		}
		dict[f].push(e);
	});
	first.sort();
	$.each(first, function (i, e) {
		div = $("<div>").append($("<span>").text(e));
		$("#select-school").append(div);
		div.hover(function () {
			$("#schools").stop();
			$("#schools").animate({scrollTop: $("#school-" + e).get()[0].offsetTop - 20}, 300);
		});
		div = $("<div id='school-" + e + "'>");
		div.append($("<h2>").text(e));
		$.each(dict[e], function (i, e) {
			a = $("<a href='#' onclick='return false;'>").text(e);
			a.click(function () {GoFunc(e);});
			div.append(a);
			div.append($("<br>"));
		});
		$("#schools").append(div);
	});
});

