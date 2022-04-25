const append = (win, el) => win.document.body.appendChild(el)

describe('ceres interface test for', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(5000)
  })

  it('successful loading', () => {
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
  })

  context('adding children', () => {
    it('C([\'hello\']) creates a div with child \'hello\'', () => {
      cy.window().then((win) => {
        let el = win.C(['hello'])
        append(win, el)
      })

      cy.get('div').should('have.text', 'hello')
    })

    it(`C('nav', [C('button'), C('span'), 'hello'],
      'hello', {onclick: function() { document.body.bgColor = 'blue' }})`, () => {
        cy.window().then((win) => {
          let el = win.C('nav', [win.C('button'), win.C('span'), 'hello'], 'hello', {
            onclick: function() { win.document.body.bgColor = 'blue' }
          })
          append(win, el)
        })

        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').children('button').should('have.length', 1)
        cy.get('nav').children('span').should('have.length', 1)
        cy.get('nav').should('have.text', 'hellohello')
        cy.get('nav').click()
        cy.document().its('bgColor').should('equal', 'blue')
    })
  })

  context('adding style', () => {
    it('C(\'span\', \'hi\'{style: \'color: blue;\'}) creates a span with blue color style', () => {
      cy.window().then((win) => {
        let el = win.C('span', 'hi', {style: 'color: blue;'})
        append(win, el)
      })

      cy.get('span').then(($el) => {
        const color = $el[0].style.color
        cy.wrap(color).should('equal', 'blue')
      })
    })

    it('C(\'span\', \'hi\', {style: {color: red}}) creates a span with red color style', () => {
      cy.window().then((win) => {
        let el = win.C('span', 'hi', {style: {color: 'red'}})
        append(win, el)
      })

      cy.get('span').then(($el) => {
        const color = $el[0].style.color
        cy.wrap(color).should('equal', 'red')
      })
    })
  })

  context('handling dynamic content', () => {
    it('C(\'div\', () => Date.now()) prints a numeric string', () => {
      cy.window().then((win) => {
        let el = win.C('div', () => Date.now())
        append(win, el)
      })

      cy.get('div').then(($el) => {
        cy.wrap($el).invoke('text').should('match', /^[0-9]*$/)
      })
    })


    it('C(Date.now) prints a numeric string', () => {
      cy.window().then((win) => {
        let el = win.C(Date.now)
        append(win, el)
      })

      cy.get('div').then(($el) => {
        cy.wrap($el).invoke('text').should('match', /^[0-9]*$/)
      })
    })

    it('C(\'section\', Date.now()) prints a numeric string', () => {
      cy.window().then((win) => {
        let el = win.C('section', Date.now())
        append(win, el)
      })

      cy.get('section').then(($el) => {
        cy.wrap($el).invoke('text').should('match', /^[0-9]*$/)
      })
    })
  })
})
