import React from 'react'

// The original idea is by `what-input` library.
// https://github.com/ten1seven/what-input
//
// Still, seems that "Screen Readers" emit all sorts of
// pointer events even when using only keyboard navigation.
// https://patrickhlauke.github.io/touch/tests/results/#desktop-assistive-technology-events
//
// So, listening to pointer events and deciding on the input method
// is not a 100%-formally-correct technique (though it does make perfect sense).
// So, for having one's ass covered it's not considered a reliable strategy.
//
// There's a script listening for `mousedown` events on each button/link/input
// which then removes the outline (and adds it when it detects a keyboard event).
// https://github.com/lindsayevans/outline.js

export default class KeyboardNavigationListener extends React.Component {
	componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown)
		// "Pointer" events are mouse/stylus/pen/touch events.
		// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
		if (window.PointerEvent) {
			window.addEventListener('pointermove', this.onPointerEvent)
			window.addEventListener('pointerdown', this.onPointerEvent)
		} else {
			// Mouse events.
			window.addEventListener('mousemove', this.onPointerEvent)
			window.addEventListener('mousedown', this.onPointerEvent)
			// Touch events.
			if ('ontouchstart' in window) {
				window.addEventListener('touchstart', this.onPointerEvent)
				window.addEventListener('touchend', this.onPointerEvent)
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown)
		// "Pointer" events are mouse/stylus/pen/touch events.
		// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
		if (window.PointerEvent) {
			window.removeEventListener('pointermove', this.onPointerEvent)
			window.removeEventListener('pointerdown', this.onPointerEvent)
		} else {
			// Mouse events.
			window.removeEventListener('mousemove', this.onPointerEvent)
			window.removeEventListener('mousedown', this.onPointerEvent)
			// Touch events.
			if ('ontouchstart' in window) {
				window.removeEventListener('touchstart', this.onPointerEvent)
				window.removeEventListener('touchend', this.onPointerEvent)
			}
		}
	}

	onKeyDown = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// "Tab".
			case 9:
				if (!this.tabbing) {
					this.tabbing = true
					document.body.classList.add('rrui__tabbing')
				}
				return
		}
	}

	onPointerEvent = (event) => {
		if (this.tabbing) {
			this.tabbing = false
			document.body.classList.remove('rrui__tabbing')
		}
	}

	render() {
		return null
	}
}