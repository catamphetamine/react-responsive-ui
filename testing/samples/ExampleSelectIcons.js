window.ExampleSelectIcons = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="select-icons" title="Select (icons)">

									<Select
										style={{ ...input_style, width: 'auto' }}
										className="column-width"
										concise
										name="dropdown"
										value={this.state.value}
										options={[{
											value: 'A',
											label: 'Afghanistan',
											icon: <img className="country-icon" src="https://lipis.github.io/flag-icon-css/flags/4x3/af.svg"/>
										},
										{
											value: 'B',
											label: 'Barbados',
											icon: <img className="country-icon" src="https://lipis.github.io/flag-icon-css/flags/4x3/bb.svg"/>
										},
										{
											value: 'C',
											label: 'Canada',
											icon: <img className="country-icon" src="https://lipis.github.io/flag-icon-css/flags/4x3/ca.svg"/>
										}]}
										placeholder="Choose"
										onChange={ value => this.setState({ value }) } />

									<div>
										Value: {this.state.value ? this.state.value : '(empty)'}
									</div>

<Highlight lang="jsx">{`
<Select
  concise
  placeholder="Choose"
  value={...}
  onChange={...}
  options={[{ value: 'A', label: 'Afghanistan', icon: <img src="..."/> }, ...]} />
`}</Highlight>

			</Example>
		)
	}
})