export default (function(
  { Boolean, Date, RegExp, Array, Node, document } = window
) {
  let __init = false
  let NS = 'html'

  return new function C(target, ...args) {
    const ns = {
      html: 'http://www.w3.org/1999/xhtml',
      svg: 'http://www.w3.org/2000/svg',
      math: 'http://www.w3.org/1998/Math/MathML'
    }

    const type = {
      node: (t) => t instanceof Node,
      string: (t) => 'string' === typeof t,
      stringable: (t) => {
        return 'number' === typeof t ||
          'boolean' === typeof t ||
          t instanceof Date ||
          t instanceof RegExp
      },
      array: (t) => Array.isArray(t),
      object: (t) => 'object' === typeof t,
      function: (t) => 'function' === typeof t,
      selector: (t) => /^\.|#/.test(t),
      handler: (t) => /^on\w+/.test(t),
      style: (t) => 'style' === t,
      attrs: (t) => 'attrs' === t,
      data: (t) => "data-" === t.substr(0,5),
      class: (t) => '.' === t[0],
      id: (t) => '#' === t[0],
      undef: (t) => 'undefined' === typeof t,
      null: (t) => null === t
    }

    const returnable = (t) => {
      return type.string(t) ||
        type.node(t) ||
        type.undef(t) ||
        type.null(t)
    }

    const parse = (tag = '') => {
      return tag
        .split(/([\.#]?[^\s#.]+)/)
        .filter(Boolean)
        .reduce((a, b, i) => {
          try
          {
            const el = (0 === i && !type.selector(b)) ?
              document.createElementNS(ns[NS], b) :
              a;

            if(type.class(b)) el.classList.add(b.substr(1))
            if(type.id(b)) el.setAttribute('id', b.substr(1))

            return el
          }
          catch(e)
          {
            return a
          }
        }, defaultElement())
    }

    const initialize = (target) => {
      return type.node(target) ?
        target :
        type.string(target) ?
          parse(target) :
          __init ?
            defaultElement() :
            (__init = true && C)
    }

    const text = (str = '') => {
      return document.createTextNode(str)
    }

    const defaultElement = () => {
      const defaults = {
        html: () => document.createElement('div'),
        svg: () => document.createElementNS(ns[NS], 'svg'),
        math: () => document.createElementNS(ns[NS], 'math')
      }

      return defaults[NS]()
    }

    const snowball = (e, arg) => {
      if (type.node(arg))
        e.appendChild(arg)
      else if(type.string(arg))
        e.appendChild(text(arg))
      else if(type.stringable(arg))
        e.appendChild(text(arg.toString()))
      else if (type.array(arg))
        arg.reduce(snowball, e)
      else if (type.object(arg))
      {
        Object.entries(arg).forEach(([key, val]) => {
          if(type.function(val)) {
            if(type.handler(key))
              e.addEventListener(key.substr(2), val, false)
            else
              e.setAttribute(key, val())
          }
          else if(type.style(key))
          {
            if(type.string(val))
              e.style.cssText = val
            else
            {
              Object.entries(val).forEach(([style, prop]) => {
                if(type.function(prop))
                  e.style.setProperty(style, prop())
                else
                {
                  const match = prop.match(/(.*)\W+!important\W*$/);
                  if (match)
                    e.style.setProperty(style, match[1], 'important')
                  else
                    e.style.setProperty(style, prop)
                }
              })
            }
          }
          else if(type.attrs(key))
            Object.entries(val).forEach(([attr, att]) => e.setAttribute(attr, att))
          else if (type.data(key))
            e.setAttribute(key, val)
          else
            e.setAttribute(key, val)
        })
      }
      else if (type.function(arg))
      {
        const val = arg()
        e.appendChild(type.node(val) ? val : text(val))
      }

      return e
    }

    C.html = (target, ...args) => {
      NS = 'html'
      return C(target, ...args)
    }

    C.svg = (target, ...args) => {
      NS = 'svg'
      return C(target, ...args)
    }

    C.math = (target, ...args) => {
      NS = 'math'
      return C(target, ...args)
    }

    if(!returnable(target)) {
      args.unshift(target)
      target = undefined
    }

    const e = args.reduce(snowball, initialize(target))
    NS = 'html'
    return e
  }
})(window);
