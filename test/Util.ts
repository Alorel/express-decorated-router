import {expect} from 'chai';
import {Util} from '../src/Util';

describe('Util', function () {
  describe('validateMiddleware', function () {
    it('Should throw if argument is not a function', function () {
      expect(() => Util.validateMiddleware(<any>1))
        .to.throw(Error, 'Middleware must be a function');
    });

    it('Should pass if argument is a function', () => {
      Util.validateMiddleware(() => {
      });
    });
  });

  describe('validatePath', () => {
    it('Should throw if a path is not given', function () {
      expect(() => Util.validatePath(''))
        .to.throw(Error, 'Path is required');
    });

    it('Should throw if path is not a string', function () {
      expect(() => Util.validatePath(<any>1))
        .to.throw(Error, 'Path must be a string');
    });

    it('Should pass if path is a non-empty string', () => {
      Util.validatePath('foo');
    });
  });
});