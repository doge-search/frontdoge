now_left = 0;
now_right = 0;
prof_list = ["name", "school", "title", "office", "email",
		  "phone", "website"];

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
						tr_list.push($("<tr>").append($("<td>").text(data[i][prof_list[j]])));
					}
				}
				tr_list[0].prepend($("<td class='score' rowspan='" + tr_list.length.toString() + "'>").text(data[i]["papers"]));
				if (i != data.length - 1) {
					tr_list[tr_list.length - 1].addClass("border");
				}
				$("#prof .main > table").append(tr_list);
			}
			$("#prof .main").scrollTop(0);
		}
	});
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
				$("#group .main > table").append(
						$("<tr>").append(
							$("<td>").text(data[i]["school"])
							).append(
								$("<td>").text(data[i]["name"])
								)
						);
			}
			$("#group .main").scrollTop(0);
		}
	});
}

$(document).ready(function () {
	get_left(0);
	get_right(0);

	$("#name").keyup(function () {
		get_left(0);
		get_right(0);
	});
});
