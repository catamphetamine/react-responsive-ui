window.ExampleMenuButton = class ExampleComponent extends React.Component
{
	render()
	{
		return (
			<Example name="slideout-menu" title="Slideout Menu">
				<MenuButton title="Show menu"/>

				<p>
					<br/>
					<code className="colored">{'<SlideOutMenu/>'}</code> takes an optional <code className="colored">anchor</code> property which can be one of: <code className="colored">"left"</code>, <code className="colored">"right"</code>, <code className="colored">"top"</code>, <code className="colored">"bottom"</code>.
				</p>

				<Highlight lang="jsx" style={{ marginTop: '40px' }}>{`
					<PageAndMenu>
						<SlideOutMenu anchor="right">
							<div>Item 1</div>
							<div>Item 2</div>
							<div>Item 3</div>
						</SlideOutMenu>
						<Page>
							<MenuButton />
							Page content
						</Page>
					</PageAndMenu>
				`}</Highlight>

				<Highlight lang="css">{`
					.rrui__slideout-menu {
						padding-top    : calc(0.3rem * 4);
						padding-bottom : calc(0.3rem * 4);
					}

					.rrui__slideout-menu__item {
						height        : calc(0.3rem * 7);
						padding-left  : calc(0.3rem * 5);
						padding-right : calc(0.3rem * 5);
						color         : white;
					}

					.rrui__slideout-menu__item:active {
						color : yellow;
					}
				`}</Highlight>
			</Example>
		)
	}
}