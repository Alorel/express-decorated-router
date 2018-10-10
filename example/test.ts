import * as e from 'express';
import {ExpressDecoratedRouter} from 'express-decorated-router';
import * as st from 'supertest';
import './src/controllers/BlogCommentsController';
import './src/controllers/BlogHomeController';
import './src/controllers/UserController';
import {HttpStatusCode} from './src/HttpStatusCode';

//tslint:disable:no-identical-functions no-duplicate-string

describe('Express-decorated-router example', () => {
  let app: e.Application;
  let request: st.SuperTest<st.Test>;

  function expectNoUser(res: st.Response): void {
    if (res.header['is-user']) {
      throw new Error('Header contains is-user');
    }
  }

  function expectNoBlog(res: st.Response): void {
    if (res.header['is-blog']) {
      throw new Error('Header contains is-user');
    }
  }

  function expectNoComment(res: st.Response): void {
    if (res.header['is-comment']) {
      throw new Error('Header contains is-comment');
    }
  }

  beforeEach('IInit new express app', () => {
    app = e();
    request = st(app);
    ExpressDecoratedRouter.applyRoutes(app);
  });

  after('Reset library', () => {
    ExpressDecoratedRouter.reset();
  });

  describe('/blog', () => {
    it('GET /blog', done => {
      request.get('/blog')
        .expect('is-blog', '1')
        .expect(expectNoUser)
        .expect(expectNoComment)
        .expect(HttpStatusCode.OK, '<span>The fanciest of blog homepages</span>', done);
    });

    describe('/blog/comments', () => {
      it('POST /blog/comments', done => {
        request.post('/blog/comments')
          .send({foo: 'bar'})
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.CREATED, {foo: 'bar'}, done);
      });

      it('DELETE /blog/comments/foo', done => {
        request.delete('/blog/comments/foo')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.OK, {name: 'foo', comment: 'Nice'}, done);
      });

      it('DELETE /blog/comments/bar', done => {
        request.delete('/blog/comments/bar')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.OK, {name: 'bar', comment: 'Also nice'}, done);
      });

      it('DELETE /blog/comments/qux', done => {
        request.delete('/blog/comments/qux')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.NOT_FOUND, done);
      });

      it('GET /blog/comments/qux', done => {
        request.get('/blog/comments/qux')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.NOT_FOUND, done);
      });

      it('GET /blog/comments/foo', done => {
        request.get('/blog/comments/foo')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.OK, {name: 'foo', comment: 'Nice'}, done);
      });

      it('GET /blog/comments/bar', done => {
        request.get('/blog/comments/bar')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.OK, {name: 'bar', comment: 'Also nice'}, done);
      });

      it('GET /blog/comments', done => {
        request.get('/blog/comments')
          .expect('is-comment', '1')
          .expect('is-blog', '1')
          .expect(expectNoUser)
          .expect(HttpStatusCode.OK, [{name: 'foo', comment: 'Nice'}, {name: 'bar', comment: 'Also nice'}], done);
      });
    });
  });

  describe('/user', () => {
    it('POST /user', done => {
      request.post('/user')
        .send({qux: 'baz'})
        .expect('is-user', '1')
        .expect(expectNoBlog)
        .expect(expectNoComment)
        .expect(HttpStatusCode.CREATED, {qux: 'baz'}, done);
    });

    it('GET /user', done => {
      request.get('/user')
        .expect('is-user', '1')
        .expect(expectNoBlog)
        .expect(expectNoComment)
        .expect(HttpStatusCode.OK, [{name: 'foo'}, {name: 'bar'}], done);
    });

    it('GET /user/foo', done => {
      request.get('/user/foo')
        .expect('is-user', '1')
        .expect(expectNoBlog)
        .expect(expectNoComment)
        .expect(HttpStatusCode.OK, {name: 'foo'}, done);
    });

    it('GET /user/bar', done => {
      request.get('/user/bar')
        .expect('is-user', '1')
        .expect(expectNoBlog)
        .expect(expectNoComment)
        .expect(HttpStatusCode.OK, {name: 'bar'}, done);
    });

    it('GET /user/qux', done => {
      request.get('/user/qux')
        .expect('is-user', '1')
        .expect(expectNoBlog)
        .expect(expectNoComment)
        .expect(HttpStatusCode.NOT_FOUND, '', done);
    });
  });
});
