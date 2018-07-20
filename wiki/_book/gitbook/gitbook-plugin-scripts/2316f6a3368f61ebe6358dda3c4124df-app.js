// $(document).ready(function(e) {});

gitbook.events.bind("page.change", function() {
	// $(".chapter").each(function(index, elem) {
	//     var self = elem;
	//     if ($(self).find("ul.articles").length !== 0) {
	//         $(self)
	//             .find("ul.articles")
	//             .slideUp(0)
	//             .addClass("hidden");
	//         $(self)
	//             .children("*:first-child")
	//             .append("<i class='articles-state-icon fa fa-angle-down'></i>");
	//     }
	// });
	// $(".chapter > *:first-child").click(function(e) {
	//     var self = this;
	//     var articles = $(self).siblings(".articles");
	//     $(self)
	//         .siblings(".articles")
	//         .stop()
	//         .toggleClass("hidden")
	//         .slideToggle();
	//     if (articles.hasClass("hidden")) {
	//         $(self)
	//             .children(".articles-state-icon")
	//             .removeClass("rotate");
	//     } else {
	//         $(self)
	//             .children(".articles-state-icon")
	//             .addClass("rotate");
	//     }
	// })
	$(".ext-link").click(function(e) {
		var url = $(this).attr("href");
		var windowUrl = window.location.origin;
		window.location.href = windowUrl + "/" + url;
	});
});
