window.ExampleSelect = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="select" title="Select">

				<Select
					style={input_style}
					className="column-width"
					name="dropdown"
					label="Fruit"
					value={this.state.value}
					options={[{
						value: 'A',
						label: 'Apple'
					},
					{
						value: 'B',
						label: 'Banana'
					},
					{
						value: 'C',
						label: 'Cranberry'
					},
					{
						divider: true
					},
					{
						value: 'D',
						label: 'Date'
					},
					{
						value: 'E',
						label: 'Elderberry'
					},
					{
						value: 'F',
						label: 'Fig'
					},
					{
						value: 'G',
						label: 'Garlic'
					}]}
					onChange={ value => this.setState({ value }) }/>

				Value: {this.state.value ? this.state.value : '(empty)'}

				<Highlight lang="jsx">{`
					<Select
						label="Fruit"
						value={...}
						onChange={...}
						options={[{ value: 'A', label: 'Apple' }, ..., { divider: true }, ...]} />
				`}</Highlight>

				<Highlight lang="css">{`
					.rrui__select .rrui__list__item--focused {
						background-color : cyan;
					}
					.rrui__select .rrui__list__item:hover {
						background-color : gray;
					}
					.rrui__select .rrui__list__item:active {
						background-color : blue;
						color : white;
					}
				`}</Highlight>

			</Example>
		)
	}
}