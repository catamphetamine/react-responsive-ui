window.ExampleTextInput = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="text-input-placeholder" title="Text input field (placeholder)">

				<form>
					<TextInput
						autoComplete="tel"
						style={input_style}
						className="column-width"
						name="text_input"
						value={this.state.value}
						onChange={value => this.setState({ value })}
						placeholder="Enter some text"/>
				</form>

				Value:  {this.state.value}

<Highlight lang="jsx">{`
<TextInput
  placeholder="Enter some text"
  value={...}
  onChange={...} />
`}</Highlight>

<Highlight lang="css">{`
/* See \`--rrui-input-...\` variables in \`variables.css\` for customization. */

/* Historically \`--rrui-input-field-border-width\` only means \`border-bottom-width\`. */
/* To add a border around \`<TextInput/>\` and \`<Select/>\`: */
.rrui__input-field,
.rrui__select__button {
	border-width: var(--rrui-input-field-border-width);
}
`}</Highlight>

				<code className="colored">{'<TextInput/>'}</code> also receives optional properties:

				<ul className="list">
					<li><code className="colored">initialHeight</code> — The initial height for a <code className="colored">multiline</code> text input.</li>
					<li><code className="colored">onHeightChange(height)</code> — Is called when the height of a <code className="colored">multiline</code> text input changes.</li>
				</ul>
			</Example>
		)
	}
}
