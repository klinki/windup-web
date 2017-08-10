import {utils} from "../../../../src/app/shared/utils";

describe('utils.helpers', () => {

    describe('nullCoalesce', () => {

        it('should return default value for null|undefined expression', () => {
            let object = null;

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should return default value for null|undefined expression in the middle', () => {
            let object = { a: { } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should return default value for invalid expression', () => {
            let object = { a: { b: 42 } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should return real value of existing expression', () => {
            let object = { a: { b: { c: 'world ' } } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(object.a.b.c);
        });
    });
});
