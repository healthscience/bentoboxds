// https://docs.cypress.io/api/introduction/api.html

describe('mobile language change', () => {
  it('change from english to spannish', () => {
    cy.viewport(375, 667)
    cy.visit('https://localhost:4173/')
    cy.get('.mobile-menu-butto:nth-child(3)').click()
    cy.get('.menu-item').find('a')
  })

})
