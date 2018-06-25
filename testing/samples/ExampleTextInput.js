window.ExampleTextInput = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="text-input-placeholder" title="Text input field (with placeholder)">

				<TextInput
					focus={false}
					style={input_style}
					className="column-width"
					name="text_input"
					value={this.state.value}
					onChange={value => this.setState({ value })}
					placeholder="Enter some text"/>

				Value:  {this.state.value}

<Highlight lang="jsx">{`
<TextInput
  placeholder="Enter some text"
  value={...}
  onChange={...} />
`}</Highlight>

<Highlight lang="css">{`
/* See \`variables.css\` for height customization. */
.rrui__input-field {
  border-bottom : 1px solid blue;
}
.rrui__input-field--invalid {
  border-color : red;
}
`}</Highlight>
			</Example>
		)
	}
})