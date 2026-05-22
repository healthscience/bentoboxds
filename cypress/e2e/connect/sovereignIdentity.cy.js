describe('Sovereign Identity Management', () => {
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })

  beforeEach(() => {
    // Clear localStorage to ensure a clean state for each test
    cy.clearLocalStorage()
    cy.login()
    // Open the account modal and navigate to the Sovereign tab
    cy.get('#self-auth-connect').click()
    cy.get('#sovereign-tab').should('be.visible').click()
  })

  it('shows setup section when no identity exists', () => {
    cy.get('.setup-section').should('be.visible')
    cy.get('.status').should('contain', 'Status: Identity Not Found')
    cy.get('.btn-primary').should('contain', 'Generate Genesis Identity')
  })

  it('allows generating a new identity (placeholder check)', () => {
    // Note: currently generateNewIdentity is a placeholder in the component
    cy.get('.btn-primary').click()
    // Verify console log or state change if implemented
    // Since it's a placeholder, we might just check if it was clicked
    // and wait for future implementation
  })

  it('displays existing identity from localStorage', () => {
    const fakePubKey = 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
    cy.window().then((win) => {
      win.localStorage.setItem('hop_sovereign_pubkey', fakePubKey)
    })
    // Reload or trigger the component to re-check localStorage
    cy.get('#datastores-tab').click()
    cy.get('#sovereign-tab').click()

    cy.get('.key-card').should('be.visible')
    cy.get('.status', { timeout: 10000 }).should('contain', 'Status: Active')
    cy.get('code').should('contain', 'abc123de...u901vwx2')
  })

  it('performs identity destruction flow', () => {
    const fakePubKey = 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
    cy.window().then((win) => {
      win.localStorage.setItem('hop_sovereign_pubkey', fakePubKey)
    })
    cy.get('#datastores-tab').click()
    cy.get('#sovereign-tab').click()

    // Verify initial state
    cy.get('.status', { timeout: 10000 }).should('contain', 'Status: Active')
    cy.get('.btn-warn').click()
    cy.get('.confirmation-flow').should('be.visible')
    
    // Confirm destruction button should be disabled initially
    cy.get('.btn-danger').should('be.disabled')
    
    // Type incorrect text
    cy.get('.verify-input').type('NOT_BURN')
    cy.get('.btn-danger').should('be.disabled')

    // Test Cancel button
    cy.get('.btn-ghost').contains('Cancel').click()
    cy.get('.confirmation-flow').should('not.exist')
    cy.get('.btn-warn').should('be.visible')
    
    // Re-open and confirm destruction
    cy.get('.btn-warn').click()
    cy.get('.verify-input').clear().type('BURN')
    cy.get('.btn-danger').should('not.be.disabled').click()

    // Verify reset
    cy.get('.setup-section').should('be.visible')
    cy.get('.status').should('contain', 'Status: Identity Not Found')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('hop_sovereign_pubkey')).to.be.null
    })
  })

  after(() => {
    cy.task("stopServer")
  })
})
