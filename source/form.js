import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class Form extends Component
{
	static propTypes =
	{
		// `onSubmit` handler
		action      : PropTypes.func,

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

		// CSS class
		className   : PropTypes.string,

		// CSS style object
		style       : PropTypes.object
	}

	constructor(props, context)
	{
		super(props, context)

		this.on_submit   = this.on_submit.bind(this)
		this.submit      = this.submit.bind(this)
		this.on_key_down = this.on_key_down.bind(this)
	}

	render()
	{
		const { post, error, className, style } = this.props

		const markup =
		(
			<form
				onSubmit={this.on_submit}
				onKeyDown={this.on_key_down}
				action={post}
				method="POST"
				className={className}
				style={style}
				noValidate>

				{this.children(error)}
			</form>
		)

		return markup
	}

	// Adds `errors` element to the form
	children(errors)
	{
		const { children } = this.props

		const form_elements = React.Children.toArray(children)

		// Insert `errors` element
		if (errors)
		{
			let errors_inserted = false

			// Show form errors above form actions,
			// so that the errors will be visible and won't be overlooked.
			let index = 0
			for (let child of form_elements)
			{
				if (child.type === Form.Error)
				{
					form_elements[index] = React.cloneElement(child, { key: 'form-errors' }, errors)
					errors_inserted = true
					break
				}

				if (child.type === Form.Actions)
				{
					form_elements.insert_at(index, <Form.Error key="form-errors">{errors}</Form.Error>)
					errors_inserted = true
					break
				}

				index++
			}

			if (!errors_inserted)
			{
				form_elements.push(<Form.Error key="form-errors">{errors}</Form.Error>)
			}
		}

		return form_elements
	}

	// "Enter" key handler
	on_submit(event)
	{
		event.preventDefault()

		// Prevent form double submit
		if (this.props.busy)
		{
			return
		}

		this.submit()
	}

	// Submit form
	submit()
	{
		if (this.props.action)
		{
			this.props.action()
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
	return <div className="rrui__form__error">{children}</div>
}

Form.Actions = function(props, context)
{
	const { children, className, style } = props

	return <div className={classNames('rrui__form__actions', className)} style={style}>{children}</div>
}