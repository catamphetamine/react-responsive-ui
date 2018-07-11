window.ExampleDatePickerMonthYear = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="date-picker-with-month-and-year" title="Date Picker (with month and year selectors)">

				<DatePicker
					style={input_style}
					className="column-width"
					label="Date"
					selectYearsIntoPast={118}
					selectYearsIntoFuture={10}
					value={this.state.value}
					onChange={value => this.setState({ value })}/>

				Value: {this.state.value ? this.state.value.toString() : '(empty)'}

				<Highlight lang="jsx">{`
					<DatePicker
						label="Date"
						selectYearsIntoPast={118}
						selectYearsIntoFuture={10}
						value={...}
						onChange={...} />
				`}</Highlight>

			</Example>
		)
	}
})