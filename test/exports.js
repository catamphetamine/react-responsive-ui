import
{
	PageAndMenu,
	Page,
	CollapsibleMenu,
	MenuButton,
	Form,
	Snackbar,
	Tooltip,
	ActivityIndicator,
	Ellipsis,
	TextInput,
	Select,
	Button,
	Switch,
	Checkbox,
	SegmentedControl,
	DatePicker,
	FileUpload,
	Modal,
	DragAndDrop,
	CanDrop,
	File,
	FILE,
	Files,
	FILES,
	set_modular_grid_unit,
	setModularGridUnit
}
from '../index'

import { expect } from 'chai'

describe('React Responsive UI', function()
{
	it('should export ES6', function()
	{
		expect(PageAndMenu).to.be.a('function')
		expect(Page).to.be.a('function')
		expect(CollapsibleMenu).to.be.a('function')
		expect(MenuButton).to.be.a('function')
		expect(Form).to.be.a('function')
		expect(Snackbar).to.be.a('function')
		expect(Tooltip).to.be.a('function')
		expect(ActivityIndicator).to.be.a('function')
		expect(Ellipsis).to.be.a('function')
		expect(TextInput).to.be.a('function')
		expect(Select).to.be.a('function')
		expect(Button).to.be.a('function')
		expect(Switch).to.be.a('function')
		expect(Checkbox).to.be.a('function')
		expect(SegmentedControl).to.be.a('function')
		expect(DatePicker).to.be.a('function')
		expect(FileUpload).to.be.a('function')
		expect(Modal).to.be.a('function')

		// Drag'n'drop
		expect(DragAndDrop({})).to.be.a('function')
		expect(CanDrop(File, () => {})).to.be.a('function')
		expect(File).to.be.a('string')
		expect(FILE).to.be.a('string')
		expect(Files).to.be.a('string')
		expect(FILES).to.be.a('string')

		expect(set_modular_grid_unit).to.be.a('function')
		expect(setModularGridUnit).to.be.a('function')
	})

	it('should export CommonJS', function()
	{
		const _ = require('../index.common')

		expect(_.PageAndMenu).to.be.a('function')
		expect(_.Page).to.be.a('function')
		expect(_.CollapsibleMenu).to.be.a('function')
		expect(_.MenuButton).to.be.a('function')
		expect(_.Form).to.be.a('function')
		expect(_.Snackbar).to.be.a('function')
		expect(_.Tooltip).to.be.a('function')
		expect(_.ActivityIndicator).to.be.a('function')
		expect(_.Ellipsis).to.be.a('function')
		expect(_.TextInput).to.be.a('function')
		expect(_.Select).to.be.a('function')
		expect(_.Button).to.be.a('function')
		expect(_.Switch).to.be.a('function')
		expect(_.Checkbox).to.be.a('function')
		expect(_.SegmentedControl).to.be.a('function')
		expect(_.DatePicker).to.be.a('function')
		expect(_.FileUpload).to.be.a('function')
		expect(_.Modal).to.be.a('function')

		// Drag'n'drop
		expect(_.DragAndDrop({})).to.be.a('function')
		expect(_.CanDrop(_.File, () => {})).to.be.a('function')
		expect(_.File).to.be.a('string')
		expect(_.FILE).to.be.a('string')
		expect(_.Files).to.be.a('string')
		expect(_.FILES).to.be.a('string')

		expect(_.set_modular_grid_unit).to.be.a('function')
		expect(_.setModularGridUnit).to.be.a('function')
	})
})