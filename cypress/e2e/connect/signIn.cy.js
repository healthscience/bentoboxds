describe('main sign in & view beebee', () => {
  // Run the setup before all tests
  before(() => {
    // const hop = spawn('npm', ['run', 'start'], { stdio: 'inherit', cwd: baseHOPStepsUp });
    cy.task("startServer"); 
  })

  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get("#self-auth-connect").should('exist')
    cy.get('#self-auth-connect').click()
    cy.get("#connect-hop").should('exist')
    cy.get("#self-auth").should('exist')
    cy.get('#self-auth').click()
    cy.get('#beebee-shaper').should('exist')
  })

})