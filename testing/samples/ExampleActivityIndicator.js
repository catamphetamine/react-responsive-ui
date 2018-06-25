window.ExampleActivityIndicator = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="activity-indicator" title="Activity Indicator">

				<ActivityIndicator />

<Highlight lang="jsx">{`
<ActivityIndicator className="..." />
`}</Highlight>

<Highlight lang="css">{`
.rrui__activity-indicator {
  color     : black;
  font-size : 30px;
}
`}</Highlight>
			</Example>
		)
	}
})