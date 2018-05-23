(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Accordion = function () {
	//
	function Accordion(_ref) {
		var _this = this;

		var selectors = _ref.selectors,
		    _ref$accordion = _ref.accordion,
		    accordion = _ref$accordion === undefined ? '.accordion' : _ref$accordion,
		    _ref$activeClass = _ref.activeClass,
		    activeClass = _ref$activeClass === undefined ? 'active' : _ref$activeClass,
		    _ref$singleOpen = _ref.singleOpen,
		    singleOpen = _ref$singleOpen === undefined ? true : _ref$singleOpen,
		    _ref$transitionTime = _ref.transitionTime,
		    transitionTime = _ref$transitionTime === undefined ? 500 : _ref$transitionTime,
		    _ref$transitionType = _ref.transitionType,
		    transitionType = _ref$transitionType === undefined ? 'linear' : _ref$transitionType;
		classCallCheck(this, Accordion);

		//plugin properties
		this.accordion = Array.from(document.querySelectorAll(accordion));
		this.activeClass = activeClass;
		this.singleOpen = singleOpen;
		this.transitionTime = transitionTime;
		this.transitionType = transitionType;
		this.transitionEnd; // class variable for timer
		this.elements;

		this.accordion.forEach(function (accordion) {
			_this.elements = selectors.reduce(function (obj, selector, index) {

				//obj with keys of index
				//property value is an array of elements with a css class equal to the selector			
				obj[index] = Array.from(accordion.querySelectorAll(selector));

				//check for exceptions in the markup
				obj[index].forEach(function (item) {
					//eliminate br elements introduced in wyziwyg markup
					if (item.nextElementSibling != null && item.nextElementSibling.nodeName == 'BR') item.parentNode.removeChild(item.nextElementSibling);

					//filter elements specified by the selector that don't have siblings with children (non-accordion items)
					if (item.nextElementSibling == null || item.nextElementSibling.children.length == 0) {
						obj[index] = obj[index].filter(function (elem) {
							return elem == item ? false : true;
						});
					}
				});

				//set up the accordion
				obj[index].forEach(function (item) {
					//set data attribute values unique to each layer
					item.dataset.level = index;

					_this.setSiblingStyles(item);

					//add event listener for each selector in the accordion
					item.addEventListener('click', function (e) {
						var targetLvl = e.target.dataset.level;
						_this.elements[targetLvl].forEach(function (item) {
							return item == e.target ? _this.toggle(item) : _this.close(item);
						});
						_this.setHeight();
						_this.isInViewport(e.target);
					});
				});
				return obj;
			}, {});
		});

		//resize listener to change accordion height 
		//when switching to a smaller screen
		var resizeListener = void 0;
		window.addEventListener('resize', function (e) {
			clearTimeout(resizeListener);
			resizeListener = setTimeout(function () {
				_this.setHeight();
			}, 100);
		});
	}

	createClass(Accordion, [{
		key: 'toggle',
		value: function toggle(elem) {
			var _this2 = this;

			//if only a single panel is allowed to be open, close all children panels
			if (this.singleOpen) {

				//when toggling a selector closed
				//toggle the child accordion items as well
				var activeChildren = Array.from(elem.nextElementSibling.querySelectorAll('.' + this.activeClass));
				if (activeChildren.length > 0) {
					activeChildren.forEach(function (child) {
						return child.classList.remove(_this2.activeClass);
					});
				}
			}
			elem.classList.toggle(this.activeClass);
		}
	}, {
		key: 'close',
		value: function close(elem) {
			if (this.singleOpen) elem.classList.remove(this.activeClass);
		}
	}, {
		key: 'setHeight',
		value: function setHeight() {
			var _this3 = this;

			var layerCount = Object.keys(this.elements).length;
			//set the height for each layer of the accordion starting at the inner most layer
			for (var i = layerCount - 1; i >= 0; i--) {
				this.elements[i].forEach(function (elem) {
					var sib = elem.nextElementSibling;

					//only change the height from 0 if it's the active accordion element
					//clone the node, append to elem, calc height, remove clone			
					if (elem.classList.contains(_this3.activeClass)) {
						var clone = sib.cloneNode(true);
						clone.style.height = 'auto';
						elem.parentNode.appendChild(clone);
						sib.style.height = clone.offsetHeight + "px";
						clone.parentNode.removeChild(clone);
					} else {
						sib.style.height = 0;
					}
				});
			}
		}
	}, {
		key: 'isInViewport',
		value: function isInViewport(elem) {
			//instead of setting a transition on transition end use a timeout. 
			//Transition end would fire multiple times if the accordion has child accordion items.
			if (elem.classList.contains(this.activeClass)) {
				clearTimeout(this.transitionEnd);

				this.transitionEnd = setTimeout(function () {
					var rect = elem.getBoundingClientRect();
					var sibRect = elem.nextElementSibling.getBoundingClientRect();
				}, this.transitionTime);
			}
		}
	}, {
		key: 'setSiblingStyles',
		value: function setSiblingStyles(elem) {
			//set initial styles of accordion items
			var sib = elem.nextElementSibling;
			sib.style.overflow = 'hidden';
			sib.style.height = 0;
			sib.style.transition = this.transitionTime / 1000 + 's ' + this.transitionType;
			elem.parentNode.classList.add('accordion-item');
		}
	}]);
	return Accordion;
}();
