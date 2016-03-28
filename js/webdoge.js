school_list = ["MIT", "Stanford", "UCB", "Princeton"];

function PersonFunc(s, e) {
	$(".content").addClass("blur");
	$("#PageDetail").show();
	$("#PageDetail #head").empty();
	if (e.children("image").length != 0) {
		img = $("<img src='webdoge/" + s + "/" + $(e.children("image")[0]).text() + "' />");
	} else {
		img = $("<img src='images/default.jpg' />");
	}
	$("#PageDetail #head").append(img);
	$("#PageDetail #detail-content").empty();
	e.children().each(function () {
		x = $(this)[0].tagName;
		if (x != "image") {
			$("#PageDetail #detail-content").append($("<div>").text(x + ": " + $($(this)[0]).text()));
		}
	})
}

function SchoolFunc(e) {
	school_now = e;
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
			$(xml).find("professor").each(function () {
				f = $($(this).children("name")[0]).text().trim()[0].toLocaleUpperCase();
				if (!dict.hasOwnProperty(f)) {
					dict[f] = [];
					first.push(f);
				}
				dict[f].push($(this));
			});
			first.sort();
			$.each(first, function (i, e) {
				div = $("<div>").append($("<span>").text(e));
				$("#select-person").append(div);
				div.hover(function () {
					$("#people").stop().animate({scrollTop: $("#person-" + e).get()[0].offsetTop - 20}, 300);
				});
				div = $("<div id='person-" + e + "'>");
				div.append($("<h2>").text(e));
				$.each(dict[e], function (i, e) {
					a = $("<a href='#' onclick='return false;'>").append($(e.children("name")[0]).text());
					a.click(function () {PersonFunc(school_now, e);});
					div.append(a);
					div.append($("<br>"));
				});
				$("#people").append(div);
			});
			$("#PageSchool").stop().addClass("first", 300);
			$("#PagePerson").stop().addClass("second", 300);
		}
	});
}

$(document).ready(function() {
	$("#PageDetail").click(function () {
		$(this).hide();
		$(".content").removeClass("blur");
	});
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
			$("#schools").stop().animate({scrollTop: $("#school-" + e).get()[0].offsetTop - 20}, 300);
		});
		div = $("<div id='school-" + e + "'>");
		div.append($("<h2>").text(e));
		$.each(dict[e], function (i, e) {
			a = $("<a href='#' onclick='return false;'>").text(e);
			a.click(function () {SchoolFunc(e);});
			div.append(a);
			div.append($("<br>"));
		});
		$("#schools").append(div);
	});
});

