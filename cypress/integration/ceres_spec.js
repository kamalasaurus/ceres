const append = (win, el) => win.document.body.appendChild(el)

describe('ceres interface test', () => {
  before(() => {
    cy.visit('/test.html')
  })

  it('successfully loads', () => {
    cy.window().its('C').should('be.a', 'function')
  })

  context('the various default invocations', () => {
    it('C() should return an empty div', () => {
      cy.window().then((win) => {
        let el = win.C()
        append(win, el)
      })

      cy.get('div').should('exist').and('be.empty')
    })

    it('C.html() should return an empty div', () => {
      cy.window().then((win) => {
        let el = win.C.html()
        append(win, el)
      })

      cy.get('div').should('exist').and('be.empty')
    })

    it('C.svg() should return an empty svg', () => {
      cy.window().then((win) => {
        let el = win.C.svg()
        append(win, el)
      })

      cy.get('svg').should('exist').and('be.empty')
    })

    it('C.math() should return an empty math', () => {
      cy.window().then((win) => {
        let el = win.C.math()
        append(win, el)
      })

      cy.get('math').should('exist').and('be.empty')
    })
  })

  context('string parsing invocations', () => {
    it('C(\'span#nothing.burger\') parses tag, id, class', () => {
      cy.window().then((win) => {
        let el = win.C('span#nothing.burger')
        append(win, el)
      })

      cy.get('span#nothing.burger').should('exist')
    })

    it('C(\'.hello\') parses class without tag', () => {
      cy.window().then((win) => {
        let el = win.C('.hello')
        append(win, el)
      })

      cy.get('div.hello').should('exist')
    })

    it('C(\'#goodbye\') parses id without tag', () => {
      cy.window().then((win) => {
        let el = win.C('#goodbye')
        append(win, el)
      })

      cy.get('div#goodbye').should('exist')
    })
  })

  context('setting different attributes', () => {
    it('C(\'a\', {href: \'hello\'} creates a link with href', () => {
      cy.window().then((win) => {
        let el = win.C('a', {href: 'hello'})
        append(win, el)
      })

      cy.get('a[href=\'hello\']').should('exist')
    })

    it('C.svg(\'g\', {x: 10, y: 10}) creates a g with x, y', () => {
      cy.window().then((win) => {
        let el = win.C.svg('g', {x: 10, y: 10})
        append(win, el)
      })

      cy.get('g[x=\'10\'][y=\'10\']').should('exist')
    })

    it('C.html(\'p\', {attrs: {mysterious: \'mushroom\'}}) creates a p with attr', () => {
      cy.window().then((win) => {
        let el = win.C.html('p', {attrs: {mysterious: 'mushroom'}})
        append(win, el)
      })

      cy.get('p[mysterious=\'mushroom\']').should('exist')
    })

    it('C({data-bridge: 10000}) creates a div with data-bridge attr', () => {
      cy.window().then((win) => {
        let el = win.C({'data-bridge': 10000})
        append(win, el)
      })

      cy.get('div[data-bridge=\'10000\']').should('exist')
    })

    it('C([\'hello\']) creates a div with child \'hello\'', () => {
      cy.window().then((win) => {
        let el = win.C(['hello'])
        append(win, el)
      })

      cy.get('div').should('have.text', 'hello')
    })
  })
})
