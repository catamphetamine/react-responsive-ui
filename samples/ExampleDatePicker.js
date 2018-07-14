window.ExampleDatePicker = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="date-picker" title="Date Picker">

				<DatePicker
					style={input_style}
					className="column-width"
					label="Date"
					value={this.state.value}
					onChange={value => this.setState({ value })}
					disabledDays={new Date(Date.now() - 24 * 60 * 60 * 1000)}/>

				Value: {this.state.value ? this.state.value.toString() : '(empty)'}

				<Highlight lang="jsx">{`
					<DatePicker
						label="Date"
						value={...}
						onChange={...} />
				`}</Highlight>

				<code className="colored">{'<DatePicker/>'}</code> also takes optional properties:

				<ul className="list">
					<li><code className="colored">selectYearsIntoPast</code> and <code className="colored">selectYearsIntoFuture</code> properties must be numbers. They determine the range of the "Year" select. They only affect the "Year" select and don't affect the "Prev"/"Next" navigation buttons. Both of them are set to <code className="colored">100</code> by default.</li>
				</ul>
			</Example>
		)
	}
}