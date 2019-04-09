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
						focus={false}
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
  icon={...}
  value={...}
  onChange={...} />
`}</Highlight>

<Highlight lang="css">{`
/* See \`variables.css\` for customization. */
:root {
	--rrui-input-height : 60px;
	--rrui-input-field-font-size : 16px;
	--rrui-input-field-side-padding : 15px;
	--rrui-input-field-border-width : 1px;
	--rrui-input-field-border-radius : 0px;
	--rrui-input-field-border-color : black;
	--rrui-input-field-border-color-focus : blue;
}

/* Adds a border around \`<TextInput/>\` and \`<Select/>\`. */
.rrui__input-field,
.rrui__select__button {
	border-width : var(--rrui-input-field-border-width);
}
`}</Highlight>
			</Example>
		)
	}
}
