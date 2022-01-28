import ignoreInvalidDateObjects from './ignoreInvalidDateObjects'

describe('ignoreInvalidDateObjects', () => {
	it('should ignore invalid date objects', () => {
		const date = new Date(2018, 3, 5);

		expect(ignoreInvalidDateObjects(date)).to.equal(date)
		expect(ignoreInvalidDateObjects(null)).to.be.undefined
		expect(ignoreInvalidDateObjects(new Date('a'))).to.be.undefined
	})
})