import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { submitFormOnCtrlEnter } from './utility/dom'

export default class Segmented_control extends PureComponent
{
	state = {}

	static propTypes =
	{
		// A list of selectable options
		options : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Option value
				value: PropTypes.string.isRequired,
				// Option label
				label: PropTypes.string.isRequired
			})
		)
		.isRequired,

		// HTML form input `name` attribute
		name         : PropTypes.string,

		// If `true` then will be disabled
		disabled     : PropTypes.bool,

		// The selected option value
		value        : PropTypes.any,

		// Is called when an option is selected
		onChange     : PropTypes.func.isRequired,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback  : PropTypes.bool.isRequired,

		// CSS class
		className    : PropTypes.string,

		// CSS style object
		style        : PropTypes.object
	}

	static defaultProps =
	{
		fallback : false
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { fallback } = this.props

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	render()
	{
		const
		{
			disabled,
			options,
			fallback,
			indicateInvalid,
			error,
			style,
			className
		}
		= this.props

		return (
			<div
				ref={ this.storeContainerComponent }
				onKeyDown={ this.onKeyDown }
				className={ classNames('rrui__segmented-control',
				{
					'rrui__rich'                        : fallback,
					'rrui__segmented-control--disabled' : disabled
				},
				className) }
				style={ style }>

				<div className="rrui__input">
					{ options.map((option, index) => this.render_button(option, index)) }
				</div>

				{ fallback && !this.state.javascript && this.render_static() }

				{ indicateInvalid && error &&
					<div className="rrui__input-error">
						{ error }
					</div>
				}
			</div>
		)
	}

	render_button(option, index)
	{
		const { options, value, disabled } = this.props

		const selected = value === option.value

		const first = index === 0
		const last  = index === options.length - 1

		return (
			<button
				key={ option.value }
				ref={ ref => this[`button_${index}`] = ref }
				type="button"
				tabIndex={ index === 0 ? undefined : '-1' }
				disabled={ disabled }
				onClick={ this.chooser(option.value) }
				className={ classNames
				(
					'rrui__button-reset',
					'rrui__segmented-control__option',
					{
						'rrui__segmented-control__option--selected' : selected,
						// CSS selector performance optimization
						'rrui__segmented-control__option--disabled' : disabled,
						// Ordering
						'rrui__segmented-control__option--first'    : first,
						'rrui__segmented-control__option--last'     : last,
						'rrui__segmented-control__option--middle'   : !first && !last
					}
				) }>
				{ option.label }
			</button>
		)
	}

	// supports disabled javascript
	render_static()
	{
		const { options } = this.props

		return (
			<div className="rrui__rich__fallback">
				{ options.map((option, index) => this.render_static_option(option, index)) }
			</div>
		)
	}

	render_static_option(option, index)
	{
		const { options, name, value } = this.props

		const first = index === 0
		const last  = index === options.length - 1

		return (
			<span
				key={ option.value }
				className={ classNames('rrui__button-reset', 'rrui__segmented-control__option',
				{
					'rrui__segmented-control__option--first'  : first,
					'rrui__segmented-control__option--last'   : last,
					'rrui__segmented-control__option--middle' : !first && !last
				}) }>
				<input
					type="radio"
					name={ name }
					checked={ value === option.value }/>
				{ option.label }
			</span>
		)
	}

	chooser(value)
	{
		return (event) =>
		{
			const { disabled, onChange, value: previous_value } = this.props

			if (disabled)
			{
				return
			}

			// Call `onChange` only if `value` did actually change
			if (value !== previous_value)
			{
				onChange(value)
			}
		}
	}

	focus()
	{
		ReactDOM.findDOMNode(this.button_0).focus()
	}

	storeContainerComponent = _ => this.container = _

	onKeyDown = (event) =>
	{
		const { onKeyDown } = this.props

		if (onKeyDown)
		{
			onKeyDown(event)
		}

		if (submitFormOnCtrlEnter(event, this.container))
		{
			return
		}

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		const { onChange, options } = this.props

		switch (event.keyCode)
		{
			// Select the previous option (if present) on left arrow
			case 37:
				event.preventDefault()

				const previous_option_index = this.previous_option_index()

				if (previous_option_index !== undefined)
				{
					// Focus the option <button/> so that
					// a subsequent "Spacebar" keyDown
					// doesn't select the previously selected
					// option (e.g. the first one)
					this[`button_${previous_option_index}`].focus()

					// Change the `value`
					return onChange(options[previous_option_index].value)
				}

				return

			// Select the next option (if present) on right arrow
			case 39:
				event.preventDefault()

				const next_option_index = this.next_option_index()

				if (next_option_index !== undefined)
				{
					// Focus the option <button/> so that
					// a subsequent "Spacebar" keyDown
					// doesn't select the previously selected
					// option (e.g. the first one)
					this[`button_${next_option_index}`].focus()

					// Change the `value`
					return onChange(options[next_option_index].value)
				}

				return
		}
	}

	// Get the previous option index (relative to the currently selected option)
	previous_option_index()
	{
		const { options, value } = this.props

		let i = 0
		while (i < options.length)
		{
			if (options[i].value === value)
			{
				if (i - 1 >= 0)
				{
					return i - 1
				}
			}
			i++
		}
	}

	// Get the next option index (relative to the currently selected option)
	next_option_index()
	{
		const { options, value } = this.props

		let i = 0
		while (i < options.length)
		{
			if (options[i].value === value)
			{
				if (i + 1 < options.length)
				{
					return i + 1
				}
			}
			i++
		}
	}
}