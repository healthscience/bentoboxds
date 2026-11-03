describe('Basic Chat Functionality', { testIsolation: false }, () => {
  // Run the setup before all tests
  before(() => {
    cy.task("startServer")
    cy.wait(3000)
  })

  // Clean up after all tests
  after(() => {
    // Stop the server after all tests are complete
    cy.task("stopServer")
  })

  describe('Chat Panel Toggle & Sections', () => {
    it('should open and close the chat panel and render inner sections', () => {
    
      cy.setupGenesis()
      // Try to open the right panel using the thought bubble button if it exists
      cy.get('.thought-bubble-button', { timeout: 10000 }).should('be.visible').click()

      // Verify core chat dialogue and header sections are present
      cy.get('#life-dialogue', { timeout: 15000 }).should('be.visible')
      cy.get('#chatspace-modal-header').should('be.visible')
      cy.get('#spacechat').should('be.visible')
      cy.get('#return-modal-close').should('be.visible') // History button
      cy.get('.space-chat').should('be.visible')
      cy.get('.chat-input').should('be.visible')

      cy.get('.thought-bubble-button').first().click()
      cy.wait(500)
      // Reopen for message interaction tests
      cy.get('.thought-bubble-button').first().click()
      cy.wait(500)
      cy.get('#life-dialogue', { timeout: 15000 }).should('be.visible')
      // close dialogue
      cy.get('.thought-bubble-button').first().click()
  })

  it('should open dialogue and enter text check display in conversation flow, peer & beebee parts', () => {
      // open dialogue
      cy.get('.thought-bubble-button').first().click()
      cy.wait(500)
      // Verify conversation and input elements inside chat interface
      cy.get('#chat-interface', { timeout: 15000 }).should('be.visible')
      cy.get('#conversation').should('be.visible')
      cy.get('textarea#askinput').first().should('exist')
      cy.get('button#natlang-ask').first().should('exist')

      // Type and send a message
      const testMessage = 'how to attune health by practicing biopoiesis?'
      cy.get('textarea#askinput').first().clear().type(testMessage)
      cy.get('button#natlang-ask').first().click()

      // Verify the message appears in conversation history
      // cy.get('#conversation').should('contain', testMessage)
      
    })

    /*
    it('should receive a response from the AI', () => {
      // Check for streaming response indicator
      cy.get('.loading-text', { timeout: 10000 }).should('contain', 'beebee is shaping a reply...')

      // Verify the AI response container appears
      cy.get('.ai-message .ai-text-message', { timeout: 15000 }).should('exist')
      cy.get('.ai-message').should('have.length.at.least', 1)
    })

    it('should not send empty messages', () => {
      // Clear input and attempt to send
      cy.get('textarea#askinput').clear()
      cy.get('button#natlang-ask').click()

      // Ensure no new empty message is appended
      cy.get('.peer-message').should('have.length.at.least', 1)
    }) */
  })
})