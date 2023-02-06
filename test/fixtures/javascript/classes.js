class Shape {
  // ...
  toString () {
    return `Shape(${this.id})`
  }
}
class Rectangle extends Shape {
  constructor (id, x, y, width, height) {
    super(id, x, y);
    // ...
  }
  toString () {
    return "Rectangle > " + super.toString();
  }

  set width (newWidth) {
    this._width = newWidth;
  }

  get width () {
    return this._width;
  }

  static defaultCircle () {
    return new Circle("default", 0, 0, 100);
  }
}
class Circle extends Shape {
  constructor (id, x, y, radius) {
    super(id, x, y);
    // ...
  }
  toString () {
    return "Circle > " + super.toString();
  }
}

class View extends React.Component {
  render () {
    return null;
  }
}
