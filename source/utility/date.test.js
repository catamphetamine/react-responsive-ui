import
{
	parseDateCustom,
	formatDateCustom,
	correspondsToTemplate,
	trimInvalidPart,
	normalizeDate
}
from './date'

describe('utility/date', () =>
{
	it('should parse dates', () =>
	{
		expect(parseDateCustom('fadsfasd', 'DD.MM.YYYY', false, true)).to.be.undefined
		expect(parseDateCustom('28.02.2017', 'DD.MM.YYYY', false, true).toISOString()).to.equal('2017-02-28T00:00:00.000Z')
		expect(parseDateCustom('12/02/2017', 'MM/DD/YYYY', false, true).toISOString()).to.equal('2017-12-02T00:00:00.000Z')
		expect(parseDateCustom('99/99/2017', 'MM/DD/YYYY', false, true).toISOString()).to.equal('2025-06-07T00:00:00.000Z')
		expect(parseDateCustom('02/03/17', 'MM/DD/YY', false, true).toISOString()).to.equal('2017-02-03T00:00:00.000Z')
	})

	it('should format dates', () =>
	{
		const date = new Date(2018, 3, 5);

		expect(formatDateCustom(date, 'DD.MM.YYYY')).to.equal('05.04.2018')
		expect(formatDateCustom(date, 'MM/DD/YYYY')).to.equal('04/05/2018')
		expect(formatDateCustom(date, 'MM/DD/YY')).to.equal('04/05/18')
	})

	it('should detect if a string corresponds to template', () =>
	{
		expect(correspondsToTemplate('1231231234', 'DD.MM.YYYY')).to.equal(false)
		expect(correspondsToTemplate('12.12.1234', 'DD.MM.YYYY')).to.equal(true)
	})

	it('should trim invalid part', () =>
	{
		expect(trimInvalidPart('fasdf', 'DD.MM.YYYY')).to.equal('')
		expect(trimInvalidPart('01.01.1234', 'DD.MM.YYYY')).to.equal('01.01.1234')
		expect(trimInvalidPart('01/02/34', 'MM/DD/YY')).to.equal('01/02/34')
		expect(trimInvalidPart('01/a2/34', 'MM/DD/YY')).to.equal('01/')
	})

	it('should normalize dates', () =>
	{
		const date = new Date(2018, 3, 5);

		expect(normalizeDate(date)).to.equal(date)
		expect(normalizeDate(null)).to.be.undefined
		expect(normalizeDate(new Date('a'))).to.be.undefined
	})
})