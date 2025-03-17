describe('base layout browser - desktop', () => {
  // Run the setup before all tests
  before(() => {
    // const hop = spawn('npm', ['run', 'start'], { stdio: 'inherit', cwd: baseHOPStepsUp });
    cy.task("startServer"); 
  })

  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    cy.contains(".logo-words", 'BentoBox-DS').should('exist')
  })

  it('mission image and text', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#app').find('#space-shaper').should('be.visible')
    cy.get('.beebee-home').find('#mission-statement').should('be.visible')
    cy.contains("#mission-statement", 'Sovereign Intelligences that shapes health').should('exist')
  })

  it('no HOP connection feedback message', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#connection-warn').should('not.exist')
    cy.get('#connection-warn-loss').should('not.exist')
  })

})