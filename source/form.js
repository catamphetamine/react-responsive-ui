import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import Button from './button'

// Prevents `<form/> submission when `busy` is `true`.
// And also inserts `<Form.Error/>` when `error` is passed.
// Using `Component` here instead of `PureComponent`
// because `<Form.Actions>` depends on `context` and therefore
// should be rerendered even if the `props` haven't changed.
// And probably that was also why it would keep displaying an old error
// (and not resetting it for some reason).
export default class Form extends Component
{
	static propTypes =
	{
		// `onSubmit` handler
		submit      : PropTypes.func,

		// On `Escape` keydown handler
		cancel      : PropTypes.func,

		// `error` can be passed for non-javascript old-school forms.
		// e.g. when a form submitted via HTTP POST request had an error,
		// then this error is rendered as part of the form.
		error       : PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),

		// The HTML form `action` attribute,
		// i.e. the URL to which the form will be posted
		// in case of a non-javascript old-school POST submission.
		post        : PropTypes.string,

		// Is form submission in progress
		busy        : PropTypes.bool.isRequired,

		// CSS class
		className   : PropTypes.string,

		// CSS style object
		style       : PropTypes.object
	}

	static defaultProps =
	{
		busy : false
	}

	constructor()
	{
		super()

		this.submit      = this.submit.bind(this)
		this.on_key_down = this.on_key_down.bind(this)
	}

	render()
	{
		const { post, error, className, style } = this.props

		const markup =
		(
			<form
				onSubmit={ this.submit }
				onKeyDown={ this.on_key_down }
				action={ post }
				method="POST"
				className={ classNames('rrui__form', className) }
				style={ style }
				noValidate>

				{ this.render_children(error) }
			</form>
		)

		return markup
	}

	// Adds `error` element to the form
	render_children(error)
	{
		const { children } = this.props

		const form_elements = React.Children.toArray(children)

		// Insert `error` element
		if (error)
		{
			// Will be set to `null` upon insertion
			let error_element = <Form.Error key="form-error">{ error }</Form.Error>

			// Show form error above form actions,
			// so that the error will be visible and won't be overlooked.
			let index = 0
			for (let child of form_elements)
			{
				if (child.type === Form.Error)
				{
					form_elements[index] = React.cloneElement(child, { key: 'form-error' }, error)
					error_element = null
					break
				}

				if (child.type === Form.Actions)
				{
					form_elements.insert_at(index, error_element)
					error_element = null
					break
				}

				index++
			}

			if (error_element)
			{
				form_elements.push(error_element)
			}
		}

		return form_elements
	}

	submit(event)
	{
		if (event)
		{
			event.preventDefault()
		}

		const { busy, submit } = this.props

		// Prevent form double submit
		// (because not only buttons submit a form,
		//  therefore just disabling buttons is not enough).
		if (busy)
		{
			return
		}

		if (submit)
		{
			return submit()
		}
	}

	on_key_down(event)
	{
		// Cancel editing on "Escape" key
		if (event.keyCode === 27)
		{
			const { cancel } = this.props

			if (cancel)
			{
				cancel()
			}

			event.preventDefault()
		}
	}
}

Form.Error = function({ children })
{
	return (
		<div className="rrui__form__error">
			{ children }
		</div>
	)
}

// Using `Component` here instead of `PureComponent`
// because it depends on `context` and therefore should be
// rerendered even if the `props` haven't changed.
Form.Actions = class Actions extends Component
{
	componentWillMount()
	{
		const { rrui__modal } = this.context

		if (rrui__modal)
		{
			rrui__modal.register_form()
		}
	}

	componentWillUnmount()
	{
		const { rrui__modal } = this.context

		if (rrui__modal)
		{
			rrui__modal.unregister_form()
		}
	}

	render()
	{
		const { children, className, style } = this.props
		const { rrui__modal } = this.context

		return (
			<div
				className={ classNames('rrui__form__actions', className) }
				style={ style }>
				{ rrui__modal &&
					<Button action={ rrui__modal.close_if_not_busy }>
						{ rrui__modal.closeLabel }
					</Button>
				}
				{ children }
			</div>
		)
	}
}

Form.Actions.contextTypes =
{
	rrui__modal : PropTypes.object
}