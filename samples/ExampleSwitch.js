window.ExampleSwitch = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

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
					/* See \`--rrui-switch-...\` variables in \`variables.css\` for customization. */
				`}</Highlight>

				Properties:

				<ul className="list">
					<li><code className="colored">onChange(true/false)</code>.</li>
					<li><code className="colored">placement</code> — (optional) Set to <code className="colored">"left"</code> to render the toggle to the left of <code className="colored">children</code>. Is historically <code className="colored">"right"</code> by default.</li>
				</ul>
			</Example>
		)
	}
}