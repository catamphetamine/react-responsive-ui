window.ExampleSlideOutMenu = class ExampleComponent extends React.Component
{
	menuRef = {}
	setMenuRef = (ref) => this.menuRef.current = ref
	onExpand = () => this.menuRef.current.clearFocus()
	render() {
		return (
			<SlideOutMenu anchor="right" menuRef={this.menuRef} onExpand={this.onExpand}>
				<List ref={this.setMenuRef} role="menu" className="slideout-menu">
					<List.Item role="none">
						<a role="menuitem" target="_blank" href="https://google.com" className="rrui__slideout-menu__item">
							Google.com
						</a>
					</List.Item>
					<List.Item role="none">
						<a role="menuitem" target="_blank" href="https://yandex.ru" className="rrui__slideout-menu__item">
							Yandex.ru
						</a>
					</List.Item>
					<List.Item role="none">
						<a role="menuitem" target="_blank" href="https://www.baidu.com" className="rrui__slideout-menu__item">
							Baidu.com
						</a>
					</List.Item>
				</List>
				{/*
				<ul role="menu" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
					<li role="none">
						<a target="_blank" role="menuitem" href="https://google.com" className="rrui__slideout-menu__item">
							Google.com
						</a>
					</li>
					<li role="none">
						<a target="_blank" role="menuitem" href="https://yandex.ru" className="rrui__slideout-menu__item">
							Yandex.ru
						</a>
					</li>
					<li role="none">
						<a target="_blank" role="menuitem" href="https://www.baidu.com" className="rrui__slideout-menu__item">
							Baidu.com
						</a>
					</li>
				</ul>
				*/}
			</SlideOutMenu>
		)
	}
}