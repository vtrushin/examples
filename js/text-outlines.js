function addTextOutlines(el, color, offsetX, offsetY){
	var _offsetX = offsetX || 0,
		_offsetY = offsetY || offsetX || _offsetX;

	var strips = [];

	var elBR = el.getBoundingClientRect();

	// Оборачивание в спаны. Вебкит не получает координаты строк у блочных элементов
	function foldTextWithSpan(elem){
		var span = document.createElement("span");
		span.innerHTML = elem.innerHTML;
		elem.innerHTML = "";
		elem.appendChild(span);
		return span;
	}

	function getParagraphs(){
		var list = [];
		for (var i = 0; i < el.childNodes.length; i++){
			var childNode = el.childNodes[i];
			if (childNode.nodeName.toLowerCase() === "p"){
				list.push(childNode);
			}
		}
		return list;
	}

	function addClientRects(elem){
		var text = foldTextWithSpan(elem);

		var clientRects = text.getClientRects();
		for (var i = 0; i < clientRects.length; i ++){
			var clientRect = clientRects[i];
			strips.push({
				left: clientRect.left - _offsetX,
				top: clientRect.top - _offsetY,
				width: clientRect.width + _offsetX * 2,
				height: clientRect.height + _offsetY * 2
			});
		}
	}

	function drawClientRects(){
		var canvas = document.createElement("canvas");

		canvas.width = el.offsetWidth + _offsetX * 2;
		canvas.height = el.offsetHeight + _offsetY * 2;
		canvas.className = "pseudo-outline-bg";
		canvas.style.position = "absolute";
		canvas.style.zIndex = -1;
		canvas.style.marginLeft = - _offsetX + "px";
		canvas.style.marginTop = - _offsetY + "px";

		var ctx = canvas.getContext("2d");

		ctx.fillStyle = color || "#000";

		ctx.beginPath();
		ctx.translate(_offsetX, _offsetY);
		for (var i = 0; i < strips.length; i++) {
			var strip = strips[i];
			ctx.rect(strip.left - elBR.left, strip.top - elBR.top, strip.width, strip.height);
		}
		ctx.closePath();
		ctx.fill();

		el.insertBefore(canvas, el.childNodes[0]);
	}

	var pars = getParagraphs();

	if (pars.length > 0){
		for (var i = 0; i < pars.length; i++){
			addClientRects(pars[i]);
		}
	} else {
		addClientRects(el);
	}

	drawClientRects();
}