/*

========================================================================================

    Game.js

    Archivo principal para el juego NOMBRE_JUEGO.

    Hecho por Alberto Leyva

    Servicio Social 2022 | FMAT | UADY 

    Ultima modificación: 7/09/22

========================================================================================

 */

// Declaración de los niveles en forma de objetos

// Fácil, medio y difícil 

// Explicación de niveles*

const nivelesObjs = {

    Facil: {
        titulo: "facil",
        carro: 'car'
    },

    Normal: {
        titulo: "normal",
        carro: 'car'
    },

    Dificil: {
        titulo: "dificil",
        carro: 'car'
    }
}

// Nivel fácil por defecto
var level = nivelesObjs.Facil;

// VARIABLES 

// Tamaño de la ventana 
const w = 800;
const h = 600;

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

// Timer
var timer;
var tiempo;

function seg(s){
    return (s + 1) * 1000;
};

//Cargar recursos 

class Boot extends Phaser.Scene{

    constructor(){
        super('boot');
    }

    // PRELOAD

    // Carga de assets
    preload ()
    {
        this.load.setPath('assets/');

        this.load.image('road', 'road.png');
        this.load.image('car', 'car.png');
        this.load.image('btJugar', 'zote.jpeg');
        this.load.image('btVamos', '00750225152202L.jpg')

        var p = this.add.text(w/2, h/2, "Cargando... 0%", {fontSize: 30}).setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => { p.setText(`Cargando... ${Math.floor(value*100)}%`) });
        this.load.on('complete', () => { this.scene.start('menu'); });
    }

}

class Menu extends Phaser.Scene{

    constructor(){
        super('menu');
    }

    create()
    {
        //Camino de fondo que da vueltas
        road = this.add.tileSprite(w/2, h/2, 0, 0, "road");

        var titulo = this.add.text(w/2, h/2 - 100, "Título de\nesta wea xd", {fontSize: '100px', fill: '#FFF', align: 'center'})
        .setOrigin(0.5, 0.5);

        var btJugar = this.add.image(w/2, h/2 + 50 , 'btJugar')
        .setInteractive()
        .setScale(0.2)                
        .once('pointerdown', () => { this.scene.start('instrucciones'); });
    }

    update ()
    {

        // Movimiento del fondo
        road.tilePositionY -= 3;
    }

}

class Instrucciones extends Phaser.Scene{

    constructor(){
        super('instrucciones');
    }

    create(){

        //Camino de fondo que da vueltas
        road = this.add.tileSprite(400, 300, 0, 0, "road");
        road.alpha = 0.5;

        //Instrucciones

        var inst = this.add.text(w/2, h/2 - 100, "Instrucciones,\npero en bonito", {fontSize: 50, fill: '#FFF', align: 'center'})
        .setOrigin(0.5, 0.5);

        //Boton

        var btJugar = this.add.image(w/2, h/2 + 100 , 'btVamos')
        .setInteractive()
        .setScale(0.1)                
        .once('pointerdown', () => { this.scene.start('dificultad'); });

    }

    update(){

        // Movimiento del fondo
        road.tilePositionY -= 3;
    }

}

class Dificultad extends Phaser.Scene{

    constructor(){
        super('dificultad');
    }

    create(){

        //Camino de fondo que da vueltas
        road = this.add.tileSprite(400, 300, 0, 0, "road");
        road.alpha = 0.5;

        //Instrucciones

        var inst = this.add.text(w/2, h/2 - 150, "Selecciona la dificultad", {fontSize: 30, fill: '#FFF', align: 'center'})
        .setOrigin(0.5, 0.5);

        var inst = this.add.text(w/2, h/2 - 100, "En cuanto la selecciones\niniciará el juego", {fontSize: 25, fill: '#FFF', align: 'center'})
        .setOrigin(0.5, 0.5);

        //Boton

        var btJugar = this.add.image(w/2, h/2 + 100 , 'btVamos')
        .setInteractive()
        .setScale(0.1)                
        .once('pointerdown', () => { this.scene.start('juego'); });

    }

    update(){

        // Movimiento del fondo
        road.tilePositionY -= 3;
    }
}

// IMPORTANTE
//
// ACTUALIZAR COLLIDER PORQUE SI DEJAS PRESIONADO SE VA A LA VERGA

class Juego extends Phaser.Scene{

    constructor(){
        super('juego');
    }

    //Creacion de elementos
    create ()
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

        //Timer

        timer = this.time.addEvent({delay: seg(4), callback: this.girar})

        tiempo = this.add.text(32,32);

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

    update ()
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

        tiempo.setText("Tiempo: " + timer.getRemainingSeconds().toString().substr(0,1));
    }

    girar()
    {
        car.setAngle(45);
    }
}

// Configuracion del Phaser y fisica    
const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {x: 0, y:0}
        }
    },
    
    scene: [Boot, Menu, Juego, Dificultad, Instrucciones]
};

//Juego
var game = new Phaser.Game(config);