describe('base layout browser - desktop', () => {
  it('visits the app root url', () => {
    cy.viewport(1024, 768)
    cy.visit('/')
    cy.get('#app').find('.bentobox-main-nav').should('be.visible')
    cy.get('.bentobox-main-nav').find('.bentobox-browser').should('be.visible')
    cy.contains(".logo-words", 'BentoBox-DS').should('exist')
  })

})