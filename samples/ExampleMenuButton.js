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
					<br/>
					<br/>
					<code className="colored">{'<SlideOutMenu/>'}</code> also takes an optional <code className="colored">fullscreen: true/false</code> property.
				</p>

				<Highlight lang="jsx" style={{ marginTop: '40px' }}>{`
					<PageAndMenu>
						<SlideOutMenu anchor="right">
							<a href="#" className="rrui__slideout-menu__item"> Item 1 </a>
							<a href="#" className="rrui__slideout-menu__item"> Item 2 </a>
							<a href="#" className="rrui__slideout-menu__item"> Item 3 </a>
						</SlideOutMenu>
						<Page>
							<MenuButton />
							Page content
						</Page>
					</PageAndMenu>
				`}</Highlight>
			</Example>
		)
	}
}