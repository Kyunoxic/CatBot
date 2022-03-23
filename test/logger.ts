import { Logger } from "../src/util/logger";
import { expect } from 'chai';
import 'mocha';

describe('Logging Methods Exist', () => {
    it('should have methods', () => {
        expect(Logger.log).to.be.a('function');
        expect(Logger.warn).to.be.a('function');
        expect(Logger.error).to.be.a('function');
        expect(Logger.fatal).to.be.a('function');
    });
});