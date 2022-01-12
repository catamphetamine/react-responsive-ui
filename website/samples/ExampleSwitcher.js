window.ExampleSwitcher = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="switcher" title="Switcher">

				<Switcher
					style={input_style}
					className="column-width"
					name="button_group"
					options={[{ value: 'A', label: 'Apple' }, { value: 'B', label: 'Banana' }, { value: 'C', label: 'Cranberry' }]}
					value={this.state.value}
					onChange={ value => this.setState({ value }) }/>

				Value: {this.state.value ? this.state.value : '(empty)'}

				<Highlight lang="jsx">{`
					<Switcher
						value={...}
						onChange={...}
						options={[{ value: 'A', label: 'Apple' }, ...]} />
				`}</Highlight>

				<Highlight lang="css">{`
					/* See \`--rrui-switcher-...\` variables in \`variables.css\` for customization. */
				`}</Highlight>

			</Example>
		)
	}
}