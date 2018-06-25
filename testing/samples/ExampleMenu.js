const MenuToggler = (props) => <button type="button" {...props}> Menu </button>

window.ExampleMenu = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="menu" title="Menu">

									<Menu
										toggler={MenuToggler}
										className="column-width"
										style={{ ...input_style, marginBottom: 0, width: 'auto' }}>

										<div onClick={() => alert('Google')}> Google </div>
										<div onClick={() => alert('Yandex')}> Yandex </div>
										<Divider/>
										<div onClick={() => alert('Other')}> Other </div>
									</Menu>

<Highlight lang="jsx">{`
const MenuToggler = (props) => <button type="button" {...props}> Menu </button>

<Menu toggler={MenuToggler}>
  <div onClick={() => alert('Google')}> Google </div>
  <div onClick={() => alert('Yandex')}> Yandex </div>
  <Divider/>
  <div onClick={() => alert('Other')}> Other </div>
</Menu>
`}</Highlight>

			</Example>
		)
	}
})