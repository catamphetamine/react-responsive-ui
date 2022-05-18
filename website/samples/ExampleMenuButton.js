window.ExampleMenuButton = class ExampleComponent extends React.Component
{
	render()
	{
		return (
			<Example name="slideout-menu" title="Slideout Menu">
				<MenuButton aria-label="Menu" aria-haspopup="menu"/>

				<br/>
				<br/>
				<br/>

				<code className="colored">{'<SlideOutMenu/>'}</code> accepts optional properties:

				<ul className="list">
					<li><code className="colored">anchor</code> — One of: <code className="colored">"left"</code>, <code className="colored">"right"</code>, <code className="colored">"top"</code>, <code className="colored">"bottom"</code>.</li>
					<li><code className="colored">fullscreen</code> — <code className="colored">true</code> or <code className="colored">false</code>.</li>
					<li><code className="colored">expandAnimationDuration</code> — The animation duration. By default, it's <code className="colored">220ms</code>. When changing the <code className="colored">--rrui-slide-out-menu-animation-duration</code> CSS variable value, also pass that value as this property.</li>
				</ul>

				<br/>

				<code className="colored">{'<SlideOutMenu/>'}</code> component instance also provides <code className="colored">.hide()</code> and <code className="colored">.show()</code> methods.

				<br/>
				<br/>
				<br/>

				<p>
					Simple Example:
				</p>

				<Highlight lang="jsx">{`
					<PageAndMenu>
						<SlideOutMenu anchor="right">
							<nav>
								<ul>
									<li><a href="/1"> Item 1 </a></li>
									<li><a href="/2"> Item 2 </a></li>
									<li><a href="/3"> Item 3 </a></li>
								</ul>
							</nav>
						</SlideOutMenu>
						<div>
							<MenuButton />
							Page content
						</div>
					</PageAndMenu>
				`}</Highlight>

				<br/>

				<details>
				<summary>A more complex example:</summary>

				<Highlight lang="jsx">{`
					state = {
						isExpanded: false
					}

					// \`menuRef\` is an optional property that can be
					// used for focusing the menu upon expanding.
					const menuRef = React.createRef()

					const onExpand = () => {
						this.setState({ isExpanded: true })
					}

					const onCollapse = () => {
						menuRef.current.clearFocus()
						this.setState({ isExpanded: false })
					}

					// The menu items will only be tabbable when expanded.
					const tabIndex = this.state.isExpanded ? undefined : -1

					<PageAndMenu>
						<SlideOutMenu
							anchor="right"
							menuRef={menuRef}
							onExpand={onExpand}
							onCollapse={onCollapse}>
							<nav>
								<List role="menu" aria-label="Menu" tabbable={isExpanded}>
									<List.Item role="presentation">
										<a href="/1" role="menuitem"> Item 1 </a>
									</List.Item>
									<List.Item role="presentation">
										<a href="/2" role="menuitem"> Item 2 </a>
									</List.Item>
									<List.Item role="presentation">
										<a href="/3" role="menuitem"> Item 3 </a>
									</List.Item>
								</List>
							</nav>
						</SlideOutMenu>
						<div>
							<MenuButton aria-label="Menu" aria-haspopup />
							Page content
						</div>
					</PageAndMenu>
				`}</Highlight>
				</details>
			</Example>
		)
	}
}