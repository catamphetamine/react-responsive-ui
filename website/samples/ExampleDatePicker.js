window.ExampleDatePicker = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	// disabledDays={[{
	// 	after: new Date(2022, 0, 0),
	// 	before: new Date(2022, 1, 10)
	// }]}

	// defaultMonthDate={new Date(2022, 2, 1)}

	render()
	{
		return (
			<Example name="date-picker" title="Date Picker">

				<DatePicker
					style={input_style}
					className="column-width"
					label="Date"
					placeholder="mm/dd/yyyy"
					format="mm/dd/yyyy"
					value={this.state.value}
					onChange={value => this.setState({ value })}
				/>

				{/* disabledDays={new Date(Date.now() - 24 * 60 * 60 * 1000)} */}

				Value: {this.state.value ? this.state.value.toString() : '(empty)'}

				<Highlight lang="jsx">{`
					<DatePicker
						label="Date"
						placeholder="mm/dd/yyyy"
						format="mm/dd/yyyy"
						value={...}
						onChange={...}
					/>
				`}</Highlight>

				<code className="colored">{'<DatePicker/>'}</code> also takes optional properties:

				<ul className="list">
					<li><code className="colored">format</code> — is <code className="colored">"mm/dd/yyyy"</code> by default.</li>
					<li><code className="colored">locale</code> — A <a target="_blank" href="https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/lang">BCP47 "language tag"</a>. Examples: <code className="colored">en</code>, <code className="colored">en-US</code>.</li>
					<li><code className="colored">utc</code> — is <code className="colored">false</code> by default meaning that the selected date is gonna be in the user's timezone. Change to <code className="colored">true</code> for the selected date to be in UTC+0 timezone.</li>
					<li><code className="colored">defaultMonthDate</code> — A <code className="colored">date</code> from which the initially shown month of the calendar will be derived when no <code className="colored">value</code> is selected. Is today by default.</li>
					<li><code className="colored">disabledDays</code> — A list of days to disable. Example: <code className="colored">[date1, date2, {'{'} after: afterDate, before: beforeDate {'}'}, {'{'} from: fromDate, to: toDate {'}'}]</code>.</li>
					<li><code className="colored">selectYearsIntoPast</code> and <code className="colored">selectYearsIntoFuture</code> — Numbers that determine the range of the "Year" select. They only affect the "Year" select and don't affect the "Prev"/"Next" navigation buttons. Both of them are set to <code className="colored">100</code> by default.</li>
					<li><code className="colored">alignment</code> — is <code className="colored">"left"</code> by default. Can be set to <code className="colored">"right"</code> to align the expandable calendar to the right side of the input.</li>
				</ul>
			</Example>
		)
	}
}