chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		var img = document.querySelector(".infobox.vcard").querySelector("img");
		img.id = 'wiki-portrait';
		$(img).wrap("<div id='portrait-canvas' style='position:absolute'>");
		// $('#portrait-wrapper').prepend("<div id='portrait-canvas' style='position:absolute;height:0;width:0;'></div>");

		console.log(img);



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

			event.data.forEach(function(rect) {
				window.plot(rect.x, rect.y, rect.width, rect.height);
			});
		});
		window.plot = function(x, y, w, h) {
			var rect = document.createElement('div');
			document.querySelector('#portrait-canvas').appendChild(rect);
			rect.classList.add('rect');
			rect.style.border = '2px solid #a64ceb';
			// rect.top = '-1000px';
			// rect.left = '-1000px';
			rect.style.position = 'absolute';
			rect.style.width = w + 'px';
			rect.style.height = h + 'px';
			rect.style.left = (img.offsetLeft + x) + 'px';
			rect.style.top = (img.offsetTop + y) + 'px';
		};

	}
	}, 10);
});