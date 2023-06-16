/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  return {
    width: this.width,
    height: this.height,
    getArea() {
      return width * height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const objFromJson = JSON.parse(json);
  Object.setPrototypeOf(objFromJson, proto);
  return (objFromJson);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssCreator {
  constructor(value) {
    this.value = value;
    this.template = '';
    this.counterE = 0;
    this.counterId = 0;
    this.counterPe = 0;
    this.sort = [];
    this.sequence = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
  }

  checkValid(selector) {
    if (this.sort.length > 1) {
      const prevSelector = this.sort[this.sort.length - 2];
      if (this.sequence.indexOf(selector) < this.sequence.indexOf(prevSelector)) {
        throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }
  }

  element(value) {
    this.sort.push('element');
    this.checkValid('element');
    this.counterE += 1;
    if (this.counterE > 1) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else {
      this.template += value;
      return this;
    }
  }

  id(value) {
    this.sort.push('id');
    this.checkValid('id');
    this.counterId += 1;
    if (this.counterId > 1) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else {
      this.template += `#${value}`;
      return this;
    }
  }

  class(value) {
    this.sort.push('class');
    this.checkValid('class');
    this.template += `.${value}`;
    return this;
  }

  attr(value) {
    this.sort.push('attr');
    this.checkValid('attr');
    this.template += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.sort.push('pseudoClass');
    this.checkValid('pseudoClass');
    this.template += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.sort.push('pseudoElement');
    this.checkValid('pseudoElement');
    this.counterPe += 1;
    if (this.counterPe > 1) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else {
      this.template += `::${value}`;
      return this;
    }
  }

  combine(selector1, combinator, selector2) {
    this.template += `${selector1} ${combinator} ${selector2}`;
    return this;
  }

  stringify() {
    return this.template;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const Css = new CssCreator();
    Css.element(value, 'element');
    return Css;
  },
  id(value) {
    const Css = new CssCreator();
    Css.id(value, 'id');
    return Css;
  },
  class(value) {
    const Css = new CssCreator();
    Css.class(value, 'class');
    return Css;
  },
  attr(value) {
    const Css = new CssCreator();
    Css.attr(value, 'attr');
    return Css;
  },
  pseudoClass(value) {
    const Css = new CssCreator();
    Css.pseudoClass(value, 'pseudoClass');
    return Css;
  },
  pseudoElement(value) {
    const Css = new CssCreator();
    Css.pseudoElement(value, 'pseudoElement');
    return Css;
  },
  combine(selector1, combinator, selector2) {
    const Css = new CssCreator();
    Css.combine(selector1.stringify(), combinator, selector2.stringify());
    return Css;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
