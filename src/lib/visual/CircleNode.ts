import p5, { Vector, Color } from "p5";

export class CircleNode {
    private _position: Vector;
    private _color: Color;
    private _size: number;
    private _age: number = 0;
    private _opacity: number;
    private _velocity: Vector = new Vector(0, 0);
    private _onDeathListeners: ((circleNode: CircleNode) => void)[] = [];

    constructor(
        position: Vector,
        color: Color,
        size: number,
        opacity: number = 1,
        velocity: Vector = new Vector(0, 0)
    ) {
        this._position = position;
        this._color = color;
        this._size = size;
        this._opacity = opacity;
        this._velocity = velocity;
    }

    public addOnDeathListener(listener: (circleNode: CircleNode) => void) {
        this._onDeathListeners.push(listener);
    }

    public die() {
        for (let listener of this._onDeathListeners) {
            listener(this);
        }
    }

    public get velocity() {
        return this._velocity;
    }

    public get position() {
        return this._position;
    }

    public get color() {
        return this._color;
    }

    public get size() {
        return this._size;
    }

    public get age() {
        return this._age;
    }

    public draw(p: p5) {
        p.fill(this._color);
        p.ellipse(
            this._position.x,
            this._position.y,
            this._size * p.pow(this._age, 0.1),
        );
    }

    public lerpToPosition(target: Vector, amount: number) {
        this._position = this._position.lerp(target, amount);
    }

    public lerpToVelocity(amount: number) {
        this._position = this._position.add(this.velocity.copy().mult(amount));
    }

    public checkMouseOver(mousePosition: Vector) {
        let d = p5.Vector.dist(mousePosition, this._position);
        if (d < this._size) {
            return true;
        }
        return false;
    }

    public advanceAge(amount: number = 0.01) {
        this._age += amount;
        // this._size *= 0.9;
        this._opacity *= 0.95;
        // this._opacity = 1 - this._age;
        this._color.setAlpha(this._opacity);
        // this.velocity.add(
        //     new Vector(Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05)
        // );

        if (this._age > 1) {
            this.die();
        }
        // this._size = ((Math.cos(this._age * 0.05) + 1) / 2) * this._size;
        // this._size = ((Math.sin(this._age * 0.01) + 1) / 2) * this._size;
    }
}
