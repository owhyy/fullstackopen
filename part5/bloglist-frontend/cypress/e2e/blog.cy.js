describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    const user = {
      name: 'john',
      username: 'vanyusha',
      password: 'password',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000');
  });

  describe('When authenticated', () => {
    beforeEach(() => {
      cy.login({ username: 'vanyusha', password: 'password' });
    });
    it('A blog can be created', () => {
      cy.contains('add a new blog').click();
      cy.get('#title').type('this is a new blog');
      cy.get('#author').type('john smith');
      cy.get('#url').type('https://stackoverflow.com');
      cy.get('#create-blog').click();
      cy.get('.success')
        .should('contain', 'a new blog this is a new blog by john smith was added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid');
      cy.contains('this is a new blog by john smith');
    });

    describe("When there's a blog", () => {
      beforeEach(() => {
        cy.login({ username: 'vanyusha', password: 'password' });
        cy.createBlog({
          title: 'this is a blog',
          author: 'joe mama',
          url: 'https://google.com',
        });
      });
      it('Can like a blog', () => {
        cy.contains('display').click();
        cy.contains('likes 0');
        cy.get('#like-button').click();
        cy.contains('likes 1');
      });
      it('Can delete blog if authenticated as user who created it', () => {
        cy.contains('display').click();
        cy.contains('this is a blog by joe mama');
        cy.get('#delete-button').click();
        cy.get('this is a blog by joe mama').should('not.exist');
        cy.get('display').should('not.exist');
      });
    });
  });

  it('Login form is shown', function () {
    cy.contains('log in to application');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login').click();
    cy.get('.error')
      .should('contain', 'invalid username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');
    cy.get('html').should('not.contain', 'logged in succesfully');
  });

  // it('Login succeeds with correct credentials', () => {
  //   // const user = {
  //   //   name: 'john',
  //   //   username: 'vanyusha',
  //   //   password: 'password',
  //   // };
  //   // cy.request('POST', 'http://localhost:3003/api/users/', user);
  //   cy.visit('http://localhost:3000');
  //   cy.get('#username').type('vanyusha');
  //   cy.get('#password').type('password');
  //   cy.get('#login-button').click();
  //   cy.contains('blogs');
  //   cy.get('.success')
  //     .should('contain', 'logged in succesfully')
  //     .and('have.css', 'color', 'rgb(0, 128, 0)')
  //     .and('have.css', 'border-style', 'solid');
  // });
});
