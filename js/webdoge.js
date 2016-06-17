now_left = 0;
now_right = 0;
prof_list = [
	"name", "school", "title", "office", "email",
	"phone", "website", "rank"
];
wd_list = [
	"subfields",
	"h-index",
	"citation-count",
	"paper-count",
	"rank-a-paper-count",
];
ssy_list = [
	"acm-fellow",
	"ieee-fellow",
	"nsf-funding"
];

dblp_cont = "学校中计算机系教授在dblp上的论文得分情况，分数是dblp上该教授的所有论文作者序的倒数累加。比如第一作者权重为1，第二作者为0.5，第三作者为0.333，以此类推。该分数我们定义为active分数，该分数较高的教授说明发论文比较积极主动。如果分数为-1或0说明在dblp上没有找到相应的人，或dblp没有收录该教授的论文信息。";

function show_person(data) {
	return function () {
		$(".content").addClass("blur");
		$("#detail").show();
		$("#detail #detail-content").empty();
		$("#detail #detail-content").append($("<div>").append($("<h3>").text("Information")));
		for (j = 0; j < prof_list.length; j++) {
			if (data[prof_list[j]]) {
				if (prof_list[j] == 'website') {
					$("#detail #detail-content").append($("<div>").append(
								$("<span>").text(prof_list[j] + ": ")).append(
								$("<a target='_blank'>").text(data[prof_list[j]])
								.attr("href", data[prof_list[j]])
								));
				} else {
					$("#detail #detail-content").append($("<div>").text(prof_list[j] + ": " + data[prof_list[j]]));
				}
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
				ssy = data[ssy_list[j]] == 'True' ? "Yes" : "No";
				$("#detail #detail-content").append(
						$("<div class='" + ssy + "'>").text(
							ssy_list[j] + ": " + ssy
							)
						);
			}
		}
		flag = true;
		for (j = 0; j < wd_list.length; j++) {
			if (data[wd_list[j]] ||
					(data.hasOwnProperty(wd_list[j] + "-2011") &&
					 data[wd_list[j] + "-2011"])) {
				if (flag) {
					flag = false;
					$("#detail #detail-content").append($("<hr>"));
				}
				wd_cont = wd_list[j] + ": ";
				if (data[wd_list[j]]) {
					wd_cont += data[wd_list[j]];
					if (data.hasOwnProperty(wd_list[j] + "-2011") &&
							data[wd_list[j] + "-2011"]) {
						wd_cont += " (" +
							data[wd_list[j] + "-2011"] +
							" after 2011)";
					}
				} else {
					wd_cont += data[wd_list[j] + "-2011"] + " after 2011";
				}
				$("#detail #detail-content").append(
						$("<div>").text(wd_cont)
						);
			}
		}
		if (data["histogram"]) {
			$("#detail #detail-content").append($("<hr>"));
			svg = $('<svg xmlns="http://www.w3.org/2000/svg" version="1.1">');
			$("#detail #detail-content").append(
					$("<div class='svg-container'>").append(svg)
					);
			svg_cont = "<text x=0 y=12>citation</text>";
			svg_cont += "<text x=370 y=240>year</text>";
			svg_cont += "<line x1=45 y1=0 x2=45 y2=225/>";
			svg_cont += "<line x1=45 y1=225 x2=390 y2=225/>";
			max_citation = Math.max.apply(null, data["histogram"]);
			for (i = 0; i <= 4; i++) {
				l = Math.round((i / 4) * max_citation);
				x = 37 - l.toString().length * 7;
				y = 230 - i * 50;
				svg_cont += "<text x=";
				svg_cont += x.toString();
				svg_cont += " y=";
				svg_cont += y.toString();
				svg_cont += ">";
				svg_cont += l.toString();
				svg_cont += "</text>";
			}
			len = data["histogram"].length;
			last_x = last_y = 0;
			delta_x = 325 / len;
			$.each(data["histogram"], function (i, e) {
				svg_cont += "<text x=";
				svg_cont += (delta_x * i + 45).toString();
				svg_cont += " y=240>";
				svg_cont += (2017 - (len - i)).toString();
				svg_cont += "</text>";
				svg_cont += "<circle citation=";
				svg_cont += e.toString();
				svg_cont += " cx=";
				now_x = delta_x * (i + 0.5) + 45;
				svg_cont += now_x.toString();
				svg_cont += " cy=";
				now_y = 225 - (e / max_citation) * 195;
				svg_cont += now_y.toString();
				svg_cont += " r=3/>";
				if (i != 0) {
					l = Math.sqrt(
							(now_x - last_x) * (now_x - last_x) +
							(now_y - last_y) * (now_y - last_y)
							);
					svg_cont += "<line";
					if (i == len - 1) {
						svg_cont += ' stroke-dasharray="3,3"';
					}
					svg_cont += " x1=";
					svg_cont += (last_x +
							(now_x - last_x) * 3 / l).toString();
					svg_cont += " y1=";
					svg_cont += (last_y +
							(now_y - last_y) * 3 / l).toString();
					svg_cont += " x2=";
					svg_cont += (now_x -
							(now_x - last_x) * 3 / l).toString();
					svg_cont += " y2=";
					svg_cont += (now_y -
							(now_y - last_y) * 3 / l).toString();
					svg_cont += "/>";
				}
				last_x = now_x;
				last_y = now_y;
			});
			svg.html(svg_cont);
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

group = "";

function get_left(new_left) {
	now_left = new_left;
	$.ajax({
		type: "GET",
		url: "/prof_list",
		data: {
			"search": $("#name").val(),
			"group": group,
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
					get_left(now_left + 10);
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
						} else if (prof_list[j] == "website") {
							tr_list.push($("<tr>").append($("<td>").append(
											$("<a target='_blank'>").text(data[i][prof_list[j]])
											.attr("href", data[i][prof_list[j]])
											)));
						} else {
							tr_list.push($("<tr>").append($("<td>").text(data[i][prof_list[j]])));
						}
					}
				}
				tr_list[0].prepend(
						$("<td rowspan='" +
							tr_list.length.toString() +
							"'>"
							).append(
								$("<a class='score'>").text(
									data[i]["papers"]
									)
								).click(function () {
								$(".content").addClass("blur");
								$("#detail").show();
								$("#detail #detail-content").text(
										dblp_cont
										);
							})
						);
				tr_list[0].prepend(
						$("<td class='id' rowspan='" +
							tr_list.length.toString() +
							"'>"
							).text((now_left + i + 1).toString()));
				if (i != data.length - 1) {
					tr_list[tr_list.length - 1].addClass("border");
				}
				$("#prof .main > table").append(tr_list);
			}
			$("#prof .main").scrollTop(0);
		}
	});
}

function get_group_a(ids, name) {
	a = $("<a href='#" + ids.toString() + "'>").text(name);
	//a.click(show_group(ids, names, name, school));
	a.click(function () {
		group = ids;
		get_left(0);
	});
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
					get_right(now_right > 30 ? now_right - 30 : 0);
				});
			}
			if (data.length == 31) {
				$("#group a#next").removeClass("inactive");
				$("#group a#next").unbind("click");
				$("#group a#next").click(function () {
					get_right(now_right + 30);
				});
				data.pop();
			}
			for (i = 0; i < data.length; i++) {
				//a = get_group_a(data[i]["prof_id"], data[i]["prof_name"], data[i]["name"], data[i]["school"]);
				a = get_group_a(data[i]["id"], data[i]["name"]);
				$("#group .main > table").append(
						$("<tr>").append(
							$("<td>").append($("<a target='_blank' href='2/" + data[i]["school"] + ".html'>").text(data[i]["school"]))
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
		group = "";
		val = now_val;
		get_left(0);
		get_right(0);
	}
	setTimeout(update, 500);
}
$(document).ready(function () {
	get_left(0);
	get_right(0);

	$("#detail").click(function () {
		$(this).hide();
		$(".content").removeClass("blur");
	});
	$(document).keydown(function (e) {
		if (e && e.keyCode == 27) {
			$("#detail").hide();
			$(".content").removeClass("blur");
		}
	});

	setTimeout(update, 500);
});
