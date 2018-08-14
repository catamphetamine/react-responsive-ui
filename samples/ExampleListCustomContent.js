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

					<List.Item>
						<a
							target="_blank"
							href="https://twitter.com/durov"
							className="new-message-notification"
							style={{ outline: 'none', height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem', textDecoration: 'none' }}>

							<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/658376777258151936/-Jz8l4Rr_200x200.jpg"/>
							<span className="new-message-notification__text"> Pavel Durov </span>
						</a>
					</List.Item>

					<List.Item>
						<a
							target="_blank"
							href="https://twitter.com/realdonaldtrump"
							className="new-message-notification"
							style={{ outline: 'none', height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem', textDecoration: 'none' }}>

							<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_200x200.jpg"/>
							<span className="new-message-notification__text"> Donald Trump </span>
						</a>
					</List.Item>

					<List.Item>
						<a
							target="_blank"
							href="https://twitter.com/medvedevrussia"
							className="new-message-notification"
							style={{ outline: 'none', height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem', textDecoration: 'none' }}>

							<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/2348558617/x0vh6bui3sq97vt4jd2n_200x200.png"/>
							<span className="new-message-notification__text"> Dmitry Medvedev </span>
						</a>
					</List.Item>
				</List>

				<Highlight lang="jsx">{`
					<List className="rrui__shadow">
						<List.Item>
							<a href="...">
								<img src="..."/> Pavel Durov
							</a>
						</List.Item>

						<List.Item>
							<a href="...">
								<img src="..."/> Donald Trump
							</a>
						</List.Item>

						<List.Item>
							<a href="...">
								<img src="..."/> Monica Lent
							</a>
						</List.Item>
					</List>
				`}</Highlight>

			</Example>
		)
	}
}