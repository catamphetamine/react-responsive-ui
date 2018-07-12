window.ExampleSegmentedControl = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="segmented-control" title="Segmented Control">

									<SegmentedControl
										style={input_style}
										className="column-width"
										name="button_group"
										options={[{ value: 'A', label: 'Apple' }, { value: 'B', label: 'Banana' }, { value: 'C', label: 'Cranberry' }]}
										value={this.state.value}
										onChange={ value => this.setState({ value }) }/>

									Value: {this.state.value ? this.state.value : '(empty)'}

<Highlight lang="jsx">{`
<SegmentedControl
  value={...}
  onChange={...}
  options={[{ value: 'A', label: 'Apple' }, ...]} />
`}</Highlight>

<Highlight lang="css">{`
.rrui__segmented-control__option {
  background-color : white;
  color : black;
}
.rrui__segmented-control__option:active {
  background-color : cyan;
}
.rrui__segmented-control__option--selected {
  background-color : blue;
  color : white;
}
`}</Highlight>

			</Example>
		)
	}
})