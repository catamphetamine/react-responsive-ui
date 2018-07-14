window.ExampleListCustomContent = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="list-custom-content" title="List (custom content)">

				<List
					style={input_style}
					className="column-width rrui__shadow">

					<List.Item target="_blank" link="https://twitter.com/durov" value="PD" className="new-message-notification" style={{ height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
						<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/658376777258151936/-Jz8l4Rr_200x200.jpg"/>
						<span className="new-message-notification__text"> Pavel Durov </span>
					</List.Item>

					<List.Item target="_blank" link="https://twitter.com/realdonaldtrump" value="DT" className="new-message-notification" style={{ height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
						<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_200x200.jpg"/>
						<span className="new-message-notification__text"> Donald Trump </span>
					</List.Item>

					<List.Item target="_blank" link="https://twitter.com/monicalent" className="new-message-notification" style={{ height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
						<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/871032082805510144/7GvHJc-c_200x200.jpg"/>
						<span className="new-message-notification__text"> Monica Lent </span>
					</List.Item>
				</List>

				<Highlight lang="jsx">{`
					<List className="rrui__shadow">
						<List.Item value="PD">
							<img src="..."/> Pavel Durov
						</List.Item>
						<List.Item value="DT">
							<img src="..."/> Donald Trump
						</List.Item>
						<List.Item value="ML">
							<img src="..."/> Monica Lent
						</List.Item>
					</List>
				`}</Highlight>

			</Example>
		)
	}
}