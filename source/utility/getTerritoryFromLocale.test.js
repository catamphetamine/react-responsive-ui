import getTerritoryFromLocale from './getTerritoryFromLocale'

describe('getTerritoryFromLocale', function() {
	it('should get territory from locale', function() {
		// Doesn't have territory.
		expect(getTerritoryFromLocale('ru')).to.be.undefined
		expect(getTerritoryFromLocale('en-001')).to.be.undefined
		expect(getTerritoryFromLocale('en-Latn')).to.be.undefined

		// Has territory.
		expect(getTerritoryFromLocale('en-US')).to.equal('US')
		expect(getTerritoryFromLocale('en-Latn-US')).to.equal('US')
		expect(getTerritoryFromLocale('he-IL-u-ca-hebrew-tz-jeruslm')).to.equal('IL')
	})
})