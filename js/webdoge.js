now_left = 0;
now_right = 0;
prof_list = [
	"name", "school", "title", "office", "email",
	"phone", "website", "rank"
];
wd_list = [
	"subfields",
	"h-index",
	"h-index-2011",
	"citation-count",
	"citation-count-2011",
	"histogram",
	"rising-star",
	"paper-count",
	"paper-count-2011",
	"rank-a-paper-count",
	"rank-a-paper-count-2011"
];
ssy_list = [
	"acm-fellow",
	"ieee-fellow",
	"nsf-funding"
];


function show_person(data) {
	return function () {
		$(".content").addClass("blur");
		$("#detail").show();
		$("#detail #detail-content").empty();
		$("#detail #detail-content").append($("<div>").append($("<h3>").text("Information")));
		for (j = 0; j < prof_list.length; j++) {
			if (data[prof_list[j]]) {
				$("#detail #detail-content").append($("<div>").text(prof_list[j] + ": " + data[prof_list[j]]));
			}
		}
		if (data["group"] != "|") {
			$("#detail #detail-content").append($("<hr>"));
			$("#detail #detail-content").append($("<div>").append($("<h3>").text("Group")));
			$.ajax({
				type: "GET",
				url: "/prof_group",
				data: {
					"ids": data["group"]
				},
				async: false,
				dataType: "json",
				success: function (data) {
					$.each(data, function (i, e) {
						$("#detail #detail-content").append($("<div>").text(e["name"]));
					});
				}
			});
		}
		flag = true;
		for (j = 0; j < ssy_list.length; j++) {
			if (data[ssy_list[j]]) {
				if (flag) {
					flag = false;
					$("#detail #detail-content").append($("<hr>"));
				}
				$("#detail #detail-content").append($("<div>").text(ssy_list[j] + ": " +
							(data[ssy_list[j]] == "True" ? "Yes" : "No")));
			}
		}
		flag = true;
		for (j = 0; j < wd_list.length; j++) {
			if (data[wd_list[j]]) {
				if (flag) {
					flag = false;
					$("#detail #detail-content").append($("<hr>"));
				}
				$("#detail #detail-content").append($("<div>").text(wd_list[j] + ": " + data[wd_list[j]]));
			}
		}
	}
}

function show_group(ids, names, name, school) {
	return function () {
		$(".content").addClass("blur");
		$("#detail").show();
		$("#detail #detail-content").empty();
		$("#detail #detail-content").append($("<div>").append($("<h3>").text("Information")));
		$("#detail #detail-content").append($("<div>").text("name: " + name));
		$("#detail #detail-content").append($("<div>").text("school: " + school));
		if (ids != "|") {
			$("#detail #detail-content").append($("<hr>"));
			$("#detail #detail-content").append($("<div>").append($("<h3>").text("Professors")));
			$.ajax({
				type: "GET",
				url: "/group_prof",
				data: {
					"ids": ids
				},
				async: false,
				dataType: "json",
				success: function (data) {
					$.each(data, function (i, e) {
						$("#detail #detail-content").append($("<div>").text(e["name"]));
					});
				}
			});
		}
	}
}

function get_left(new_left) {
	now_left = new_left;
	$.ajax({
		type: "GET",
		url: "/prof_list",
		data: {
			"search": $("#name").val(),
			"skip": now_left
		},
		dataType: "json",
		success: function (data) {
			$("#prof .main > table").empty();
			$("#prof a#prev").addClass("inactive");
			$("#prof a#next").addClass("inactive");
			if (data.length == 0)
				return;
			$("#prof a#prev").unbind("click");
			$("#prof a#next").unbind("click");
			if (now_left) {
				$("#prof a#prev").removeClass("inactive");
				$("#prof a#prev").unbind("click");
				$("#prof a#prev").click(function () {
					get_left(now_left > 10 ? now_left - 10 : 0);
				});
			}
			if (data.length == 11) {
				$("#prof a#next").removeClass("inactive");
				$("#prof a#next").unbind("click");
				$("#prof a#next").click(function () {
					get_left(now_left +10);
				});
				data.pop();
			}
			for (i = 0; i < data.length; i++) {
				tr_list = [];
				for (j = 0; j < prof_list.length; j++) {
					if (data[i][prof_list[j]]) {
						if (prof_list[j] == "name") {
							a = $("<a class='name' href='#' onclick='return false;'>").text(data[i][prof_list[j]]);
							a.click(show_person(data[i]));
							tr_list.push($("<tr>").append($("<td>").append(a)));
						} else {
							tr_list.push($("<tr>").append($("<td>").text(data[i][prof_list[j]])));
						}
					}
				}
				tr_list[0].prepend($("<td class='score' rowspan='" + tr_list.length.toString() + "'>").text(data[i]["papers"]));
				tr_list[0].prepend($("<td class='id' rowspan='" + tr_list.length.toString() + "'>").text((now_left + i + 1).toString()));
				if (i != data.length - 1) {
					tr_list[tr_list.length - 1].addClass("border");
				}
				$("#prof .main > table").append(tr_list);
			}
			$("#prof .main").scrollTop(0);
		}
	});
}

function get_group_a(ids, names, name, school) {
	a = $("<a href='#'>").text(name);
	a.click(show_group(ids, names, name, school));
	return a;
}

function get_right(new_right) {
	now_right = new_right;
	$.ajax({
		type: "GET",
		url: "/group_list",
		data: {
			"search": $("#name").val(),
			"skip": now_right
		},
		dataType: "json",
		success: function (data) {
			$("#group .main > table").empty();
			$("#group a#prev").addClass("inactive");
			$("#group a#next").addClass("inactive");
			if (data.length == 0)
				return;
			$("#group a#prev").unbind("click");
			$("#group a#next").unbind("click");
			if (now_right) {
				$("#group a#prev").removeClass("inactive");
				$("#group a#prev").unbind("click");
				$("#group a#prev").click(function () {
					get_right(now_right > 10 ? now_right - 10 : 0);
				});
			}
			if (data.length == 31) {
				$("#group a#next").removeClass("inactive");
				$("#group a#next").unbind("click");
				$("#group a#next").click(function () {
					get_right(now_right +10);
				});
				data.pop();
			}
			for (i = 0; i < data.length; i++) {
				a = get_group_a(data[i]["prof_id"], data[i]["prof_name"], data[i]["name"], data[i]["school"]);
				$("#group .main > table").append(
						$("<tr>").append(
							$("<td>").append($("<a href='2/" + data[i]["school"] + ".html'>").text(data[i]["school"]))
							).append(
								$("<td>").append(a)
								)
						);
			}
			$("#group .main").scrollTop(0);
		}
	});
}

val = "";
function update() {
	now_val = $("#name").val();
	if (val != now_val) {
		val = now_val;
		get_left(0);
		get_right(0);
	}
	setTimeout(update, 1000);
}
$(document).ready(function () {
	get_left(0);
	get_right(0);

	$("#detail").click(function () {
		$(this).hide();
		$(".content").removeClass("blur");

	});

	setTimeout(update, 1000);
});
