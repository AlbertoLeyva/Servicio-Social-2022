/*

========================================================================================

    Game.js

    Archivo principal para el juego NOMBRE_JUEGO.

    Hecho por Alberto Leyva

    Servicio Social 2022 | FMAT | UADY 

    Ultima modificación: 2/10/22

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

// Colo del carro

var carColor = 'blueCar';

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

        this.load.image('road', 'road2.png');
        this.load.image('car', 'car.png');
        this.load.image('btJugar', 'btJugar.png');
        this.load.image('btVamos', 'btVamos.png');
        this.load.image('btSiguiente', 'btSiguiente.png');
        this.load.image('btPlay', 'play.png');
        this.load.image('title', 'title2.png');
        this.load.image('btFacil', 'btFacil.png');
        this.load.image('btMedio', 'btMedio.png');
        this.load.image('btDificil', 'btDificil.png');
        this.load.image('btBack', 'btBack.png')
        this.load.image('btBlue', 'btBlue.png');
        this.load.image('btYellow', 'btYellow.png');
        this.load.image('btRed', 'btRed.png');
        this.load.image('btGreen', 'btGreen.png');
        this.load.image('blueCar', 'blue_car.png');
        this.load.image('yellowCar', 'yellow_car.png');
        this.load.image('redCar', 'red_car.png');
        this.load.image('greenCar', 'green_car.png');

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

        //var titulo = this.add.text(w/2, h/2 - 100, "Título de\nesta wea xd", {fontSize: '100px', fill: '#FFF', align: 'center'})
        //.setOrigin(0.5, 0.5);

        var titulo = this.add.image(w/2, h/2 - 130, 'title')
        .setScale(0.65);

        var btJugar = this.add.image(w/2, h/2 + 150 , 'btPlay')
        .setInteractive()
        .on('pointerover', () => btJugar.setScale(1.2))
        .on('pointerout', () => btJugar.setScale(1))                
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

        var inst = this.add.text(w/2, h/2 - 230,
        
        "INSTRUCCIONES"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 50, fill: '#FFF300', align: 'center'})
        .setStroke('#FF0000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var inst2 = this.add.text(w/2, h/2,
        
        "Aparecerán en la pantalla operaciones\nmatemáticas que tendrás que hacer mentalmente.\n\nUsa las flechas del teclado para mover tu\ncarro a la respuesta que creas correcta.\n\n¡Escoge rápido porque tendrás poco tiempo!\n\nEl juego se acaba cuando hayas contestado todas\nlas operaciones o hayas tenido 3 errores."
        
        ,{fontFamily: 'BoldnessRace', fontSize: 30, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        //Boton

        var s = 0.5;

        var btJugar = this.add.image(w/2, h/2 + 240 , 'btSiguiente')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btJugar.setScale(s+0.2))
        .on('pointerout', () => btJugar.setScale(s))                 
        .once('pointerdown', () => { this.scene.start('seleccion'); });

        //Atras

        var btBack = this.add.image(55, 55 , 'btBack')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btBack.setScale(s+0.2))
        .on('pointerout', () => btBack.setScale(s))                 
        .once('pointerdown', () => { this.scene.start('menu'); });

    }

    update(){

        // Movimiento del fondo
        road.tilePositionY -= 3;
    }

}

class Seleccion extends Phaser.Scene{

    constructor(){
        super('seleccion');
    }

    create(){

        //Camino de fondo que da vueltas
        road = this.add.tileSprite(400, 300, 0, 0, "road");
        road.alpha = 0.5;

        //Seleccion

        var inst = this.add.text(w/2, h/2 - 230,
        
        "SELECCIÓN"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 50, fill: '#FFF300', align: 'center'})
        .setStroke('#FF0000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var inst2 = this.add.text(w/2, h/2 - 180,
        
        "Selecciona la dificultad y tu carro."
        
        ,{fontFamily: 'BoldnessRace', fontSize: 30, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var inst3 = this.add.text(w/2, h/2 - 150,
        
        "¡Completa los niveles para conseguir los demás carros!"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 20, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        //Dificulltades

        var s = 0.5;
        var gris = 0x1A1A1A;

        var btFacil = this.add.image(w/4, h/3 + 30, 'btFacil')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btFacil.setScale(s + 0.2))
        .on('pointerout', () => btFacil.setScale(s))
        .on('pointerdown', () => btFacil.clearTint() && btMedio.setTint(gris) && btDificil.setTint(gris));

        var btMedio = this.add.image(w/4, h/3 + 130, 'btMedio')
        .setTint(gris)
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btMedio.setScale(s + 0.2))
        .on('pointerout', () => btMedio.setScale(s))
        .on('pointerdown', () => btFacil.setTint(gris) && btMedio.clearTint() && btDificil.setTint(gris));

        var btDificil = this.add.image(w/4, h/3 + 230, 'btDificil')
        .setTint(gris)
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btDificil.setScale(s + 0.2))
        .on('pointerout', () => btDificil.setScale(s))
        .on('pointerdown', () => btFacil.setTint(gris) && btMedio.setTint(gris) && btDificil.clearTint());

        //Carros

        var btBlue = this.add.image(450, 270, 'btBlue')
        .setScale(s - 0.2)
        .setInteractive()
        .on('pointerover', () => btBlue.setScale(s-0.1))
        .on('pointerout', () => btBlue.setScale(s-0.2))
        .on('pointerdown', () => btBlue.clearTint() && btYellow.setTint(gris) && btRed.setTint(gris) && btGreen.setTint(gris))
        .on('pointerdown', () => carColor = 'blueCar');

        var btYellow = this.add.image(650, 270, 'btYellow')
        .setScale(s - 0.2)
        .setTint(gris)
        .setInteractive()
        .on('pointerover', () => btYellow.setScale(s-0.1))
        .on('pointerout', () => btYellow.setScale(s-0.2))
        .on('pointerdown', () => btBlue.setTint(gris) && btYellow.clearTint() && btRed.setTint(gris) && btGreen.setTint(gris))
        .on('pointerdown', () => carColor = 'yellowCar');

        var btRed = this.add.image(450, 380, 'btRed')
        .setScale(s - 0.2)
        .setTint(gris)
        .setInteractive()
        .on('pointerover', () => btRed.setScale(s-0.1))
        .on('pointerout', () => btRed.setScale(s-0.2))
        .on('pointerdown', () => btBlue.setTint(gris) && btYellow.setTint(gris) && btRed.clearTint() && btGreen.setTint(gris))
        .on('pointerdown', () => carColor = 'redCar');     

        var btGreen = this.add.image(650, 380, 'btGreen')
        .setScale(s - 0.2)
        .setTint(gris)
        .setInteractive()
        .on('pointerover', () => btGreen.setScale(s-0.1))
        .on('pointerout', () => btGreen.setScale(s-0.2))
        .on('pointerdown', () => btBlue.setTint(gris) && btYellow.setTint(gris) && btRed.setTint(gris) && btGreen.clearTint())
        .on('pointerdown', () => carColor = 'greenCar');

        //Boton

        var btJugar = this.add.image(w/2, h/2 + 240 , 'btJugar')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btJugar.setScale(s+0.2))
        .on('pointerout', () => btJugar.setScale(s))                
        .once('pointerdown', () => { this.scene.start('juego'); });

        //Atras

        var btBack = this.add.image(55, 55 , 'btBack')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btBack.setScale(s+0.2))
        .on('pointerout', () => btBack.setScale(s))                 
        .once('pointerdown', () => { this.scene.start('instrucciones'); });

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
        car = this.physics.add.image(400, 475, carColor)
        .setScale(0.45);

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
    
    scene: [Boot, Menu, Juego, Seleccion, Instrucciones]
};

document.fonts.load('10pt BoldnessRace').then(() => new Phaser.Game(config));

//Juego
//var game = new Phaser.Game(config);