import formatDate from './formatDate'

describe('formatDate', () => {
	it('should format dates', () => {
		const date = new Date(2018, 3, 5)

		expect(formatDate(date, 'dd.mm.yyyy')).to.equal('05.04.2018')
		expect(formatDate(date, 'mm/dd/yyyy')).to.equal('04/05/2018')
		expect(formatDate(date, 'mm/dd/yy')).to.equal('04/05/18')
	})
})