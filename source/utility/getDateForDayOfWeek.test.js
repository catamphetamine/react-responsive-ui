import getDateForDayOfWeek from './getDateForDayOfWeek'

describe('getDateForDayOfWeek', function() {
	it('should get date for day of week', function() {
		expect(getDateForDayOfWeek(0).toDateString()).to.equal('Sun Jan 02 2000')
		expect(getDateForDayOfWeek(1).toDateString()).to.equal('Mon Jan 03 2000')
		expect(getDateForDayOfWeek(2).toDateString()).to.equal('Tue Jan 04 2000')
		expect(getDateForDayOfWeek(3).toDateString()).to.equal('Wed Jan 05 2000')
		expect(getDateForDayOfWeek(4).toDateString()).to.equal('Thu Jan 06 2000')
		expect(getDateForDayOfWeek(5).toDateString()).to.equal('Fri Jan 07 2000')
		expect(getDateForDayOfWeek(6).toDateString()).to.equal('Sat Jan 08 2000')
	})
})