const Utils = require('../../../src/utils/common.utils');

describe('Utils tests, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: basicResponse', () => {
            const mockParam_body = { result: 'success', process: 'test' };
            const mockParam_success = 1;
            const mockParam_message = 'basicResponse created correctly';
            
            const testFn = Utils.basicResponse(
                mockParam_body,
                mockParam_success,
                mockParam_message
            )
            const expectResult = {
                headers: { success: mockParam_success, message: mockParam_message },
                body: mockParam_body
            }

            expect(testFn).toMatchObject(expectResult);
        })

        test('fn: isObjEmpty', () => {
            const mockParam_obj = {};
            const testFn = Utils.isObjEmpty(mockParam_obj);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isObjEmpty', () => {
            const mockParam_obj = { val: 'test' };
            const testFn = Utils.isObjEmpty(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })
    })
})