import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from './Button'
import { ModalContext } from './Modal'

// Prevents `<form/> submission when `wait` is `true`.
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
		wait        : PropTypes.bool,

		// (deprecated)
		// (use `wait` instead)
		// Is form submission in progress
		busy        : PropTypes.bool,

		// CSS class
		className   : PropTypes.string,

		// CSS style object
		style       : PropTypes.object
	}

	static defaultProps =
	{
		wait : false,
		busy : false
	}

	render()
	{
		const { post, error, className, style } = this.props

		return (
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
			let error_element = <FormError key="form-error">{ error }</FormError>

			// Show form error above form actions,
			// so that the error will be visible and won't be overlooked.
			let index = 0
			for (const child of form_elements)
			{
				// Workaround for `react-hot-loader`.
				// https://github.com/gaearon/react-hot-loader#checking-element-types
				if (child.type.displayName === 'FormError')
				{
					form_elements[index] = React.cloneElement(child, { key: 'form-error' }, error)
					error_element = null
					break
				}
				// Workaround for `react-hot-loader`.
				// https://github.com/gaearon/react-hot-loader#checking-element-types
				if (child.type.displayName === 'FormActions')
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

	submit = (event) =>
	{
		if (event)
		{
			event.preventDefault()
		}

		const { wait, busy, submit } = this.props

		// Prevent form double submit
		// (because not only buttons submit a form,
		//  therefore just disabling buttons is not enough).
		if (wait || busy)
		{
			return
		}

		if (submit)
		{
			return submit()
		}
	}

	on_key_down = (event) =>
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

// I guess `<Form.Error/>` isn't used anywhere
// and is therefore considered deprecated.
function FormError({ children }) {
	return (
		<div className="rrui__form__error">
			{ children }
		</div>
	)
}

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
FormError.displayName = 'FormError'

// I guess `<Form.Error/>` isn't used anywhere
// and is therefore considered deprecated.
Form.Error = FormError

// I guess `<Form.Actions/>` aren't used anywhere
// and are therefore considered deprecated.
class FormActions extends Component {
	componentDidMount() {
		const { context } = this.props
		if (context) {
			context.registerForm()
		}
	}

	componentWillUnmount() {
		const { context } = this.props
		if (context) {
			context.unregisterForm()
		}
	}

	render() {
		const {
			context,
			children,
			className,
			style
		} = this.props

		return (
			<div
				className={ classNames('rrui__form__actions', className) }
				style={ style }>
				{ context &&
					<Button action={ context.closeIfNotBusy }>
						{ context.closeLabel }
					</Button>
				}
				{ children }
			</div>
		)
	}
}

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
FormActions.displayName = 'FormActions'

// I guess `<Form.Actions/>` aren't used anywhere
// and are therefore considered deprecated.
Form.Actions = function({ children }) {
	return (
		<ModalContext.Consumer>
			{context => (
				<FormActions context={ context }>
					{ children }
				</FormActions>
			)}
		</ModalContext.Consumer>
	)
}