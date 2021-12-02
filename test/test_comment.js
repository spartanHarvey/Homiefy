
test.use(require('anyPlugin'));

test.$di
  .set('hello', function(name) {
    return 'Hello ' + name;
  })
  .provider('logHello', 'hello', function(hello) {
    return test.dump(hello('World'));
  })
;
test
  .given(function() {
    this.hello('from "given()"');
  })
  .when(function() {
    this.hello('from "when()"');
  })
  .then(function() {
    this.hello('from "then()"');
  })
  .case(function() {
    this.hello('from "case()"');
  })
  .$di.get('logHello')
;

test.use(require('anyPlugin'));

test.$di
  .set('sample@email.com', email_verification(name) {
    return 'valid' + email;
  })
  .provider('email1', 'email2', email_verification(hello) {
    return test.dump(sample('@email'));
  })
;
test
  .given(function() {
    this.email('from "given()"');
  })
  .when(function() {
    this.email('from "when()"');
  })
  .then(function() {
    this.email('from "then()"');
  })
  .case(function() {
    this.email('from "case()"');
  })
  .$di.get('email')
;

test.use(require('anyPlugin'));

test.$di
  .set('posts_comment', function(Comment) {
    return 'Hello ' + name;
  })
  .provider('like', 'comment', function(comment) {
    return test.dump(like('comment'));
  })
;
test
  .given(function() {
    this.comment('from "given()"');
  })
  .when(function() {
    this.comment('from "when()"');
  })
  .then(function() {
    this.comment('from "then()"');
  })
  .case(function() {
    this.comment('from "case()"');
  })
  .$di.get('comment')
;