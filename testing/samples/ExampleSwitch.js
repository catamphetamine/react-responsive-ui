window.ExampleSwitch = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="switch" title="Switch">

									<div style={{ marginBottom: '1em' }}>
										<Switch
											name="switch"
											value={this.state.value}
											onChange={ value => this.setState({ value }) }>
											iOS style switch
										</Switch>
									</div>

									Value: {this.state.value ? 'true' : 'false'}

<Highlight lang="jsx">{`
<Switch
  value={...}
  onChange={...}>
  iOS style switch
</Switch>
`}</Highlight>

<Highlight lang="css">{`
.rrui__switch__groove {
  background-color : green;
  color : white;
}
`}</Highlight>

			</Example>
		)
	}
})