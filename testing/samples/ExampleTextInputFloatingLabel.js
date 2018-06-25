window.ExampleTextInputFloatingLabel = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="text-input-floating-label" title="Text input field (with floating label)">

				<TextInput
					style={input_style}
					className="column-width"
					name="text_input"
					value={this.state.value}
					onChange={value => this.setState({ value })}
					label="Text"/>

				Value:  {this.state.value}

<Highlight lang="jsx">{`
<TextInput
  label="Text"
  value={...}
  onChange={...} />
`}</Highlight>

			</Example>
		)
	}
})
