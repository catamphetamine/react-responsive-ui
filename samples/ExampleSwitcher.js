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
					:root {
						--rrui-switcher-background-color : white;
						--rrui-switcher-text-color : blue;
						--rrui-switcher-background-color-active : cyan;
						--rrui-switcher-text-color-active : white;
						--rrui-switcher-background-color-selected : blue;
						--rrui-switcher-text-color-selected : white;
					}
				`}</Highlight>

			</Example>
		)
	}
}