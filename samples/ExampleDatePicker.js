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
					format="MM/DD/YY"
					style={input_style}
					className="column-width"
					label="Date"
					value={this.state.value}
					onChange={value => this.setState({ value })}/>

				{/* disabledDays={new Date(Date.now() - 24 * 60 * 60 * 1000)} */}

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
					<li><code className="colored">format</code> — is <code className="colored">"MM/DD/YYYY"</code> by default.</li>
					<li><code className="colored">firstDayOfWeek</code> — is <code className="colored">0</code> by default meaning that "Sunday" is the first day of week. Change to <code className="colored">0</code> for non-USA countries.</li>
					<li><code className="colored">utc</code> — is <code className="colored">false</code> by default meaning that the selected date is gonna be in the user's timezone. Change to <code className="colored">true</code> for the selected date to be in UTC+0 timezone.</li>
					<li><code className="colored">noon</code> — is <code className="colored">true</code> by default meaning that the selected date's time is gonna be <code>12:00</code>. Change to <code className="colored">false</code> for the selected date's time to be <code>00:00</code>.</li>
					<li><code className="colored">disabledDays</code> — <a target="_blank" href="http://react-day-picker.js.org/examples/disabled">days to disable</a>.</li>
					<li><code className="colored">months</code> — <a target="_blank" href="http://react-day-picker.js.org/docs/localization/">months labels</a>.</li>
					<li><code className="colored">weekdaysShort</code> — <a target="_blank" href="http://react-day-picker.js.org/docs/localization/">short week day labels</a>.</li>
					<li><code className="colored">weekdaysLong</code> — <a target="_blank" href="http://react-day-picker.js.org/docs/localization/">long week day labels</a>.</li>
					<li><code className="colored">locale</code> — <a target="_blank" href="http://react-day-picker.js.org/docs/localization/"><code>locale</code> for <code>localeUtils</code></a>.</li>
					<li><code className="colored">localeUtils</code> — <a target="_blank" href="http://react-day-picker.js.org/docs/localization/">month and weekday labels for all supported locales</a>.</li>
				</ul>
			</Example>
		)
	}
}