import
{
	KeyboardNavigationListener,
	PageAndMenu,
	Page,
	SlideOutMenu,
	MenuButton,
	MenuIcon,
	FadeInOut,
	Form,
	List,
	Snackbar,
	Tooltip,
	ActivityIndicator,
	Ellipsis,
	TextInput,
	Select,
	Autocomplete,
	ExpandableMenu,
	ExpansionPanel,
	Button,
	Switch,
	Checkbox,
	Switcher,
	DatePicker,
	FileUpload,
	DropFileUpload,
	DropMultiFileUpload,
	Modal,
	// Deprecated.
	DragAndDrop,
	CanDrop,
	File,
	FILE,
	Files,
	FILES,
	setModularGridUnit
}
from '../index'

import { expect } from 'chai'

describe('React Responsive UI', function()
{
	it('should export ES6', function()
	{
		expect(KeyboardNavigationListener).to.be.a('function')
		expect(PageAndMenu).to.be.a('function')
		expect(Page).to.be.a('function')
		expect(SlideOutMenu).to.be.a('function')
		expect(MenuButton).to.be.a('function')
		expect(MenuIcon).to.be.a('function')
		expect(FadeInOut).to.be.a('function')
		expect(Form).to.be.a('function')
		expect(List).to.be.a('function')
		expect(Snackbar).to.be.a('function')
		expect(Tooltip).to.be.a('function')
		expect(ActivityIndicator).to.be.a('function')
		expect(Ellipsis).to.be.a('function')
		expect(TextInput.render).to.be.a('function')
		expect(Select).to.be.a('function')
		expect(Autocomplete).to.be.a('function')
		expect(ExpandableMenu).to.be.a('function')
		expect(ExpansionPanel.render).to.be.a('function')
		expect(Button.render).to.be.a('function')
		expect(Switch).to.be.a('function')
		expect(Checkbox).to.be.a('function')
		expect(Switcher).to.be.a('function')
		expect(DatePicker.render).to.be.a('function')
		expect(FileUpload.render).to.be.a('function')
		expect(DropFileUpload.render).to.be.a('function')
		expect(DropMultiFileUpload.render).to.be.a('function')
		expect(Modal).to.be.a('function')

		// Drag'n'drop.
		// Deprecated.
		expect(() => DragAndDrop({})).to.throw('`react-dnd` has been removed from `react-responsive-ui` starting from version `0.14.124`')
		expect(() => CanDrop(File, () => {})).to.throw('`react-dnd` has been removed from `react-responsive-ui` starting from version `0.14.124`')
		expect(File).to.be.a('string')
		expect(FILE).to.be.a('string')
		expect(Files).to.be.a('string')
		expect(FILES).to.be.a('string')

		expect(setModularGridUnit).to.be.a('function')
	})

	it('should export CommonJS', function()
	{
		const _ = require('../index.common')

		expect(_.KeyboardNavigationListener).to.be.a('function')
		expect(_.PageAndMenu).to.be.a('function')
		expect(_.Page).to.be.a('function')
		expect(_.SlideOutMenu).to.be.a('function')
		expect(_.MenuButton).to.be.a('function')
		expect(_.MenuIcon).to.be.a('function')
		expect(_.FadeInOut).to.be.a('function')
		expect(_.Form).to.be.a('function')
		expect(_.List).to.be.a('function')
		expect(_.Snackbar).to.be.a('function')
		expect(_.Tooltip).to.be.a('function')
		expect(_.ActivityIndicator).to.be.a('function')
		expect(_.Ellipsis).to.be.a('function')
		expect(_.TextInput.render).to.be.a('function')
		expect(_.Select).to.be.a('function')
		expect(_.Autocomplete).to.be.a('function')
		expect(_.ExpandableMenu).to.be.a('function')
		expect(_.ExpansionPanel.render).to.be.a('function')
		expect(_.Button.render).to.be.a('function')
		expect(_.Switch).to.be.a('function')
		expect(_.Checkbox).to.be.a('function')
		expect(_.Switcher).to.be.a('function')
		expect(_.DatePicker.render).to.be.a('function')
		expect(_.FileUpload.render).to.be.a('function')
		expect(_.DropFileUpload.render).to.be.a('function')
		expect(_.DropMultiFileUpload.render).to.be.a('function')
		expect(_.Modal).to.be.a('function')

		// Drag'n'drop.
		// Deprecated.
		expect(() => _.DragAndDrop({})).to.throw('`react-dnd` has been removed from `react-responsive-ui` starting from version `0.14.124`')
		expect(() => _.CanDrop(_.File, () => {})).to.throw('`react-dnd` has been removed from `react-responsive-ui` starting from version `0.14.124`')
		expect(_.File).to.be.a('string')
		expect(_.FILE).to.be.a('string')
		expect(_.Files).to.be.a('string')
		expect(_.FILES).to.be.a('string')

		expect(_.setModularGridUnit).to.be.a('function')
	})
})