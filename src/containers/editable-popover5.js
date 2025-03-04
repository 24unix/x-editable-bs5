/*
 * Editable Popover (for Bootstrap 5, No jQuery)
 */
import { Popover } from "bootstrap";

class EditablePopover {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            placement: "top",
            trigger: "manual",
            content: " ",
            container: "body"
        }, options);

        this.popoverInstance = null;
        this.initPopover();
    }

    initPopover() {
        this.popoverInstance = new Popover(this.element, {
            placement: this.options.placement,
            trigger: this.options.trigger,
            content: this.options.content,
            html: true
        });

        if (this.element.dataset.template) {
            this.template = this.element.dataset.template;
            this.element.removeAttribute("data-template");
        }

        this.show();
    }

    show() {
        if (this.popoverInstance) {
            this.popoverInstance.show();
        }
    }

    hide() {
        if (this.popoverInstance) {
            this.popoverInstance.hide();
        }
    }

    destroy() {
        if (this.popoverInstance) {
            this.popoverInstance.dispose();
            this.popoverInstance = null;
        }
    }

    setOption(key, value) {
        if (this.popoverInstance) {
            this.popoverInstance._config[key] = value;
        }
    }

    setPosition() {
        if (!this.popoverInstance) {
            return;
        }

        const tip = this.element.nextElementSibling; // Popover element
        if (!tip) {
            return;
        }

        let placement = typeof this.options.placement === "function" ? this.options.placement(tip, this.element) : this.options.placement;

        const autoToken = /\s?auto?\s?/i;
        const autoPlace = autoToken.test(placement);
        if (autoPlace) {
            placement = placement.replace(autoToken, "") || "top";
        }

        const pos = this.element.getBoundingClientRect();
        const actualWidth = tip.offsetWidth;
        const actualHeight = tip.offsetHeight;

        if (autoPlace) {
            const parent = this.element.parentElement || document.body;
            const docScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const parentWidth = parent === document.body ? window.innerWidth : parent.offsetWidth;
            const parentHeight = parent === document.body ? window.innerHeight : parent.offsetHeight;
            const parentLeft = parent === document.body ? 0 : parent.getBoundingClientRect().left;

            placement = placement === "bottom" && pos.top + pos.height + actualHeight - docScroll > parentHeight ? "top" :
                placement === "top" && pos.top - docScroll - actualHeight < 0 ? "bottom" :
                    placement === "right" && pos.right + actualWidth > parentWidth ? "left" :
                        placement === "left" && pos.left - actualWidth < parentLeft ? "right" :
                            placement;

            tip.classList.remove(...["top", "bottom", "left", "right"]);
            tip.classList.add(placement);
        }

        const calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
        this.applyPlacement(tip, calculatedOffset, placement);
    }

    getCalculatedOffset(placement, pos, actualWidth, actualHeight) {
        switch (placement) {
            case "bottom":
                return { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 };
            case "top":
                return { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 };
            case "left":
                return { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth };
            case "right":
                return { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
        }
    }

    applyPlacement(tip, offset, placement) {
        tip.style.top = `${offset.top}px`;
        tip.style.left = `${offset.left}px`;
        tip.classList.add("show", placement);
    }
}

