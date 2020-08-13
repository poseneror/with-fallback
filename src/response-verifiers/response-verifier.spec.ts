import { fetchResponseVerifier } from './response-verifier';
describe('response verifiers', () => {
    describe('fetch verifier', () => {
        it('should fail on response not ok', () => {
            const fetchResponse: Partial<Response> = {
                ok: false
            }
            expect(fetchResponseVerifier(fetchResponse as Response)).toBe(false);
        })

        it('should verify on response ok', () => {
            const fetchResponse: Partial<Response> = {
                ok: true
            }
            expect(fetchResponseVerifier(fetchResponse as Response)).toBe(true);
        })
    });
})