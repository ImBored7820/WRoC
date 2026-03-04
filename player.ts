type Circle = {
    radius: number;
    color: string;
};

const myCircle: Circle = {
    radius: 5,
    color: "red",
};

export class Player {
   x:  number;
   y: number;
   speed: number ;

   // TODO Player should move

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = myCircle.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, myCircle.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}


