import getDateForMonth from './getDateForMonth'

describe('getDateForMonth', function() {
	it('should get date for month', function() {
		expect(getDateForMonth(0).toDateString()).to.equal('Sat Jan 01 2000')
		expect(getDateForMonth(1).toDateString()).to.equal('Tue Feb 01 2000')
		expect(getDateForMonth(2).toDateString()).to.equal('Wed Mar 01 2000')
		expect(getDateForMonth(3).toDateString()).to.equal('Sat Apr 01 2000')
		expect(getDateForMonth(4).toDateString()).to.equal('Mon May 01 2000')
		expect(getDateForMonth(5).toDateString()).to.equal('Thu Jun 01 2000')
		expect(getDateForMonth(6).toDateString()).to.equal('Sat Jul 01 2000')
		expect(getDateForMonth(7).toDateString()).to.equal('Tue Aug 01 2000')
		expect(getDateForMonth(8).toDateString()).to.equal('Fri Sep 01 2000')
		expect(getDateForMonth(9).toDateString()).to.equal('Sun Oct 01 2000')
		expect(getDateForMonth(10).toDateString()).to.equal('Wed Nov 01 2000')
		expect(getDateForMonth(11).toDateString()).to.equal('Fri Dec 01 2000')
	})
})