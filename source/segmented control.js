import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { flat as styler } from 'react-styling'
import classNames from 'classnames'

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
				value: React.PropTypes.string.isRequired,
				// Option label
				label: React.PropTypes.string.isRequired
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

	constructor()
	{
		super()

		this.on_key_down = this.on_key_down.bind(this)
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

		const markup =
		(
			<div
				onKeyDown={ this.on_key_down }
				className={ classNames('rrui__segmented-control',
				{
					'rrui__rich'                        : fallback,
					'rrui__segmented-control--disabled' : disabled
				},
				className) }
				style={ style ? { ...styles.container, ...style } : styles.container }>

				<div className="rrui__input">
					{ options.map((option, index) => this.render_button(option, index)) }
				</div>

				{ fallback && !this.state.javascript && this.render_static() }

				{ indicateInvalid && error && <div className="rrui__input-error">{ error }</div> }
			</div>
		)

		return markup
	}

	render_button(option, index)
	{
		const { value, disabled } = this.props

		const selected = value === option.value

		const markup =
		(
			<button
				key={ option.value }
				ref={ ref => this[`button_${index}`] = ref }
				type="button"
				tabIndex={ index === 0 ? undefined : '-1' }
				disabled={ disabled }
				onClick={ this.chooser(option.value) }
				className={ classNames
				(
					'rrui__segmented-control__option',
					{
						'rrui__segmented-control__option--selected' : selected,
						// CSS selector performance optimization
						'rrui__segmented-control__option--disabled' : disabled
					}
				) }
				style={ this.option_style(option, index) }>
				{ option.label }
			</button>
		)

		return markup
	}

	// supports disabled javascript
	render_static()
	{
		const { options } = this.props

		const markup =
		(
			<div className="rrui__rich__fallback">
				{ options.map((option, index) => this.render_static_option(option, index)) }
			</div>
		)

		return markup
	}

	render_static_option(option, index)
	{
		const { name, value } = this.props

		const markup =
		(
			<span
				key={ option.value }
				className="rrui__segmented-control__option"
				style={ this.option_style(option, index) }>
				<input
					type="radio"
					name={ name }
					checked={ value === option.value }/>
				{ option.label }
			</span>
		)

		return markup
	}

	option_style(option, index)
	{
		let option_style

		if (index === 0)
		{
			option_style = { ...styles.option_first }
		}
		else if (index === this.props.options.length - 1)
		{
			option_style = { ...styles.option_last }
		}
		else
		{
			option_style = { ...styles.option_middle }
		}

		return option_style
	}

	chooser(value)
	{
		return event =>
		{
			const { disabled, onChange } = this.props

			if (disabled)
			{
				return
			}

			onChange(value)
		}
	}

	focus()
	{
		ReactDOM.findDOMNode(this.button_0).focus()
	}

	on_key_down(event)
	{
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

const styles = styler
`
	container
		position    : relative
		display     : inline-block
		white-space : nowrap

	option
		&first
			border-top-right-radius    : 0
			border-bottom-right-radius : 0
			border-right               : none

		&middle
			border-radius : 0
			border-right  : none

		&last
			border-top-left-radius    : 0
			border-bottom-left-radius : 0
`