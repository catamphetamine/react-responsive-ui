import getLanguageFromLocale from './getLanguageFromLocale'

describe('getLanguageFromLocale', function() {
	it('should get language from locale', function() {
		expect(getLanguageFromLocale('ru')).to.equal('ru')
		expect(getLanguageFromLocale('en-US')).to.equal('en')
		expect(getLanguageFromLocale('en-Latn-US')).to.equal('en')
		expect(getLanguageFromLocale('he-IL-u-ca-hebrew-tz-jeruslm')).to.equal('he')
	})
})