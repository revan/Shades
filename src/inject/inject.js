chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		var img = document.querySelector(".infobox.vcard").querySelector("img");
		img.id = 'wiki-portrait';
		$(img).wrap("<div id='portrait-canvas' style='position:absolute'>");
		$('#portrait-canvas').wrap("<div style='height:" + img.height + "px;margin:10px'></div>");

		var tracker = new tracking.ObjectTracker(['eye']);
		tracker.setStepSize(1);
		tracking.track('#wiki-portrait', tracker);
		tracker.on('track', function(event) {
			console.log(event);

			var shades = document.createElement('img');
			shades.src = chrome.extension.getURL('shades.png');

			shades.width = Math.max(event.data[0].width + event.data[0].x,
				event.data[1].width + event.data[1].x) -
				Math.min(event.data[0].x, event.data[1].x);

			shades.height = Math.max(event.data[0].height + event.data[0].y,
				event.data[1].height + event.data[1].y) -
				Math.min(event.data[0].y, event.data[0].y);

			shades.style.left = (img.offsetLeft + Math.min(event.data[0].x, event.data[1].x)) + 'px';
			shades.style.top = (img.offsetTop + Math.min(event.data[0].y, event.data[1].y)) + 'px';
			shades.style.position = 'absolute';

			document.querySelector('#portrait-canvas').appendChild(shades);
		});

	}
	}, 10);
});