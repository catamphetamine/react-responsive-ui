import transformDateInputAccordingToTemplate from './transformDateInputAccordingToTemplate'

describe('transformDateInputAccordingToTemplate', () => {
	it('should trim invalid part', () => {
		expect(transformDateInputAccordingToTemplate('fasdf', 'dd.mm.yyyy')).to.equal('')
		expect(transformDateInputAccordingToTemplate('01.01.1234', 'dd.mm.yyyy')).to.equal('01.01.1234')
		expect(transformDateInputAccordingToTemplate('01/02/34', 'mm/dd/yy')).to.equal('01/02/34')
		expect(transformDateInputAccordingToTemplate('01/a2/34', 'mm/dd/yy')).to.equal('01/')
	})
})