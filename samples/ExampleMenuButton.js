window.ExampleMenuButton = class ExampleComponent extends React.Component
{
	render()
	{
		return (
			<Example name="slideout-menu" title="Slideout Menu">
				<MenuButton/>

				<p>
					<br/>
					<code className="colored">{'<SlideOutMenu/>'}</code> takes an optional <code className="colored">anchor</code> property which can be one of: <code className="colored">"left"</code>, <code className="colored">"right"</code>, <code className="colored">"top"</code>, <code className="colored">"bottom"</code>.
					<br/>
					<br/>
					<code className="colored">{'<SlideOutMenu/>'}</code> also takes an optional <code className="colored">fullscreen: true/false</code> property.
					<br/>
					<br/>
					<code className="colored">{'<SlideOutMenu/>'}</code> component instance also provides <code className="colored">.hide()</code> and <code className="colored">.show()</code> methods.
				</p>

				<Highlight lang="jsx" style={{ marginTop: '40px' }}>{`
					// \`menuRef\` is an optional property that can be
					// used for focusing the menu upon expanding.
					const menuRef = React.createRef()
					const clearFocus = () => menuRef.current.clearFocus()

					<PageAndMenu>
						<SlideOutMenu anchor="right" menuRef={menuRef} onExpand={clearFocus}>
							<List role="menu">
								<List.Item role="none">
									<a href="/1" role="menuitem"> Item 1 </a>
								</List.Item>
								<List.Item role="none">
									<a href="/2" role="menuitem"> Item 2 </a>
								</List.Item>
								<List.Item role="none">
									<a href="/3" role="menuitem"> Item 3 </a>
								</List.Item>
							</List>
						</SlideOutMenu>
						<div>
							<MenuButton />
							Page content
						</div>
					</PageAndMenu>
				`}</Highlight>
			</Example>
		)
	}
}