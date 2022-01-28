import getFirstDayOfWeek from './getFirstDayOfWeek'

describe('getFirstDayOfWeek', function() {
	it('should get first day of week', function() {
		expect(getFirstDayOfWeek('ru')).to.equal(1)
		expect(getFirstDayOfWeek('ru-UA')).to.equal(1)
		expect(getFirstDayOfWeek('en')).to.equal(0)
		expect(getFirstDayOfWeek('en-US')).to.equal(0)
		expect(getFirstDayOfWeek('en-Latn-US')).to.equal(0)
	})
})