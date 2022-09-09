/*

========================================================================================

    Game.js

    Archivo principal para el juego NOMBRE_JUEGO.

    Hecho por Alberto Leyva

    Servicio Social 2022 | FMAT | UADY 

    Ultima modificación: 7/09/22

========================================================================================

 */

// Configuracion del Phaser y fisica    
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {x: 0, y:0}
        }
    },
    
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// VARIABLES 

//Juego
var game = new Phaser.Game(config);

//Para el teclado
var cursors;

//Carro principal
var car;

//Carretera de fondo
var road;

//Puntos a donde se mueve el carro
var point1 = new Phaser.Math.Vector2();
var point2 = new Phaser.Math.Vector2();
var point3 = new Phaser.Math.Vector2();

// PRELOAD

// Carga de assets
function preload ()
{
    this.load.image('road', 'assets/road.png');
    this.load.image('car', 'assets/car.png');
}

// CREATE

//Creacion de elementos
function create ()
{

    //Camino de fondo que da vueltas
    road = this.add.tileSprite(400, 300, 0, 0, "road");

    //Definicion del carro
    car = this.physics.add.image(400, 475, 'car').setScale(0.4);
    car.setAngle(90);

    //Que no se salga del canvas
    car.setCollideWorldBounds(true);

    //Definicion del teclado
    cursors = this.input.keyboard.createCursorKeys();

    //Puntos donde se detiene el carro

    //Derecha
    point1.x = 650;
    point1.y = 475;

    //En medio
    point2.x = 400;
    point2.y = 475;

    //Izquierda
    point3.x = 150;
    point3.y = 475;

    //Si, tal vez sea mas facil llamando los point como la direccion pero me dio flojera cambiarlo

}

function update ()
{

    // Movimiento del fondo
    road.tilePositionY -= 3;

    //TECLADO

    //A la derecha
    if (cursors.right.isDown)
    {
        
        //Si esta en el cajon del medio se va a la derecha
        if (car.x < 410 && car.x > 390)
        {
            this.physics.moveToObject(car, point1, 200);
        }

        //Si esta en el cajon de la izquiera se va en medio
        else if (car.x < 160 && car.x > 140)
        {
            this.physics.moveToObject(car, point2, 200);
        }
        
    }
    //A la izquierda
    else if (cursors.left.isDown)
    {
        
        //Si esta en el cajon de la derecha se va en medio
        if (car.x < 660 && car.x > 640)
        {
            this.physics.moveToObject(car, point2, 200);
        }

        //Si está en el cajon de en medio se va a la izquierda
        else if (car.x < 410 && car.x > 390)
        {
            this.physics.moveToObject(car, point3, 200);
        }
    }
    else
    {

        // COMPRUEBA SI YA LLEGÓ

        //Al punto 1 (derecha)
        var distance1 = Phaser.Math.Distance.Between(car.x, car.y, point1.x, point1.y);
        if (distance1 < 4)
        {
            car.body.stop()
        }

        //Al punto 2 (en medio)
        var distance2 = Phaser.Math.Distance.Between(car.x, car.y, point2.x, point2.y);
        if (distance2 < 4)
        {
            car.body.stop()
        }

        //Al punto 3 (izquierda)
        var distance3 = Phaser.Math.Distance.Between(car.x, car.y, point3.x, point3.y);
        if (distance3 < 4)
        {
            car.body.stop()
        }
    }
}