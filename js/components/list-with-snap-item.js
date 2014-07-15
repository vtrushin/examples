(function($){

	$.widget("knb.listWithSnapItem", {
		options: {
			activeClass: "active",
			stickClass: "offset",
			placeholderClass: "placeholder"
		},

		_create: function(){
			this.$items = $("a", this.element);
			this.$active = this.$items.filter("." + this.options.activeClass);
			this.$placeholder = $(document.createElement("span")).addClass(this.options.placeholderClass);
			this.$activePointItem = this.$active;

            this.activeHeight = this.$activePointItem.outerHeight();

			this.element.on("scroll", this._calcDimensions.bind(this));
			$(window).on("resize", this._calcDimensions.bind(this));
			this._calcDimensions();
		},

		_calcDimensions: function(){
            var scrollTop = this.element.get(0).scrollTop;
            var offsetTop = this.$activePointItem.position().top;
            this.listHeight = this.element.height();

            var isStickInTop = offsetTop < 0;
			var isStickInBottom = offsetTop > this.listHeight - this.activeHeight;

			if (isStickInTop || isStickInBottom){
                if (this.$active == this.$activePointItem){
					this.$placeholder
						.insertBefore(this.$active)
						.css({
                            display: "block",
							height: this.$active.outerHeight()
						});
				}

				this.$active
					.css({
                        position: "absolute",
						left: 0,
						top: isStickInTop ? scrollTop : scrollTop + this.listHeight - this.activeHeight,
                        right: 0
					})
					.addClass(this.options.stickClass);

				this.$activePointItem = this.$placeholder;

			} else {
				this.$active.removeClass(this.options.stickClass);
                this.$active.css({
                    position: "",
                    left: "",
                    top: "",
                    right: ""
                });
				this.$placeholder.remove();
				this.$activePointItem = this.$active;
			}
		}

	});

})(jQuery);