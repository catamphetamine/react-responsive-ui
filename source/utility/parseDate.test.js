import parseDate, { correspondsToTemplate } from './parseDate'

describe('parseDate', () =>
{
	it('should parse dates', () =>
	{
		expect(parseDate('fadsfasd', 'dd.mm.yyyy', true)).to.be.undefined
		expect(parseDate('28.02.2017', 'dd.mm.yyyy', true).toISOString()).to.equal('2017-02-28T00:00:00.000Z')
		expect(parseDate('12/02/2017', 'mm/dd/yyyy', true).toISOString()).to.equal('2017-12-02T00:00:00.000Z')
		expect(parseDate('99/99/2017', 'mm/dd/yyyy', true).toISOString()).to.equal('2025-06-07T00:00:00.000Z')
		expect(parseDate('02/03/17', 'mm/dd/yy', true).toISOString()).to.equal('2017-02-03T00:00:00.000Z')
	})

	it('should detect if a string corresponds to template', () =>
	{
		expect(correspondsToTemplate('1231231234', 'dd.mm.yyyy')).to.equal(false)
		expect(correspondsToTemplate('12.12.1234', 'dd.mm.yyyy')).to.equal(true)
	})
})