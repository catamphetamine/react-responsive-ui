window.ExampleTextInputIcon = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="text-input-icon" title="Text input field (icon)">

				<form>
					<TextInput
						icon={Icon}
						focus={false}
						style={input_style}
						className="column-width"
						name="text_input"
						value={this.state.value}
						onChange={value => this.setState({ value })}
						placeholder="Enter some text"/>
				</form>

				Value:  {this.state.value}

<Highlight lang="jsx">{`
function Icon({ className }) {
	return (
		<svg viewBox="0 0 100 100" className={className}>
			<circle cx="40" cy="40" r="30" strokeWidth="8" stroke="#7f7f7f" fill="none"/>
			<line x1="65" y1="65" x2="90" y2="90" strokeWidth="8" stroke="#7f7f7f"/>
		</svg>
	)
}
<TextInput
  placeholder="Enter some text"
  icon={Icon}
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

function Icon({ className }) {
	return (
		<svg viewBox="0 0 100 100" className={className}>
			<circle cx="40" cy="40" r="30" strokeWidth="8" stroke="#7f7f7f" fill="none"/>
			<line x1="65" y1="65" x2="90" y2="90" strokeWidth="8" stroke="#7f7f7f"/>
		</svg>
	)
}
