/* 

========================================================================================

    Game.js

    Archivo principal para el juego Carrera de Estimaciones.

    Hecho por Alberto Leyva

    Servicio Social 2022 | FMAT | UADY 

    Ultima modificación: 2/10/22

========================================================================================

 */

// Niveles

// Fácil => 5 operaciones, 1 a 2 digitos, 2 minutos
// Medio => 5 operaciones, 2 a 3 digitos, 3 minutos
// Medio => 5 operaciones, 3 a 4 digitos, 3 minutos

class Operacion{
    constructor(op, res, t1, t2){
        this.op = op;
        this.res = res;
        this.t1 = t1;
        this.t2 = t2;
    }
}

var Banco = {
    Facil: [
        new Operacion ('2+2','4','3','5'),
        new Operacion ('3+3','6','4','7'),
        new Operacion ('5+5','10','15','9')
    ],

    Medio: [
        new Operacion ('2+3','5','3','6'),
        new Operacion ('3+5','8','4','7'),
        new Operacion ('5+9','14','12','8')
    ],

    Dificil: [
        new Operacion ('7+3','10','9','12'),
        new Operacion ('8+5','13','10','9'),
        new Operacion ('10-5','5','4','6')
    ],
};

// VARIABLES 

// Tamaño de la ventana 
const w = 800;
const h = 600;

//Para el teclado
var cursors;

//Carro principal
var car;

// Colo del carro por default
var carColor = 'blueCar';

//Carretera de fondo
var road;

//Puntos a donde se mueve el carro
var centro = 400;
var derecha = 650;
var izquierda = 150;

// Direcciones
var der_cen;
var cen_der;
var cen_izq;
var izq_cen;

//Vidas
var nVidas;
var v1;
var v2;
var v3;

// Timer
var timer;
var tiempo;

//Funcion simple que convierte a segundos
function seg(s){
    return (s) * 1000;
};

//Progreso (Entero)
//
// 0 => Facil / Azul
// 1 => Medio / Azul y amarillo
// 2 => Dificil / Azul, amarillo y rojo
// 3 => Todo

var jProgreso;

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
        this.load.image('lock', 'candado.png');
        this.load.image('vida', 'gear.png');

        if (!localStorage.getItem('progreso')){
    
            localStorage.setItem('progreso', 0);
        
        }

        jProgreso = localStorage.getItem('progreso');

        // PARA VER TODO EL JUEGO REMOVER AL FINAL
        jProgreso = 3;
        console.log("jProgreso: " + jProgreso);
        //***************************************************************************************************************** */

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

        //Titulos
        var titulo = this.add.image(w/2, h/2 - 130, 'title')
        .setScale(0.65);

        this.tweens.add({
            targets: titulo,
            scaleX: 0.67,
            scaleY: 0.67,
            ease: 'Power2',
            duration: 500,
            delay: 50,
            repeat: -1,
            yoyo: true,
            repeatDelay: 500

        });

        //Boton
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

        if (jProgreso == 0){

            this.add.image(w/4, h/3 + 130, 'lock').setScale(0.2);
            this.add.image(w/4, h/3 + 230, 'lock').setScale(0.2);
            this.add.image(650, 270, 'lock').setScale(0.2);
            this.add.image(450, 380, 'lock').setScale(0.2);
            this.add.image(650, 380, 'lock').setScale(0.2);

            btMedio.disableInteractive();
            btDificil.disableInteractive();

            btYellow.disableInteractive();
            btRed.disableInteractive();
            btGreen.disableInteractive();
        }
        else if (jProgreso == 1){
            this.add.image(w/4, h/3 + 230, 'lock').setScale(0.2);
            this.add.image(450, 380, 'lock').setScale(0.2);
            this.add.image(650, 380, 'lock').setScale(0.2);

            btDificil.disableInteractive();

            btRed.disableInteractive();
            btGreen.disableInteractive();
        }
        else if (jProgreso == 2){
            this.add.image(650, 380, 'lock').setScale(0.2);

            btGreen.disableInteractive();
        }

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

class Juego extends Phaser.Scene{

    constructor(){
        super('juego');
    }

    //Creacion de elementos
    create ()
    {

        //Camino de fondo que da vueltas
        road = this.add.tileSprite(400, 300, 0, 0, "road");

        //Vidas
        nVidas = 3;

        v1 = this.add.image(50, 50, 'vida').setScale(0.17);
        v2 = this.add.image(120, 50, 'vida').setScale(0.17);
        v3 = this.add.image(190, 50, 'vida').setScale(0.17);

        //Definicion del carro
        car = this.physics.add.image(400, 475, carColor)
        .setScale(0.9);

        //Que no se salga del canvas
        car.setCollideWorldBounds(true);

        //Definicion del teclado
        cursors = this.input.keyboard.createCursorKeys();

        //Animacion
        var anim = 'Quad';

        //Tweens de direccion: orgigen_destino
        cen_der = this.tweens.add({
            targets: car,
            duration: seg(1),
            x: derecha,
            paused: true,
            ease: anim,
            onActive: () => car.setAngle(10),
            onComplete: () => car.setAngle(0)
        });

        der_cen = this.tweens.add({
            targets: car,
            duration: seg(1),
            x: centro,
            paused: true,
            ease: anim,
            onActive: () => car.setAngle(-10),
            onComplete: () => car.setAngle(0)
        });

        cen_izq = this.tweens.add({
            targets: car,
            duration: seg(1),
            x: izquierda,
            paused: true,
            ease: anim,
            onActive: () => car.setAngle(-10),
            onComplete: () => car.setAngle(0)
        });

        izq_cen = this.tweens.add({
            targets: car,
            duration: seg(1),
            x: centro,
            paused: true,
            ease: anim,
            onActive: () => car.setAngle(10),
            onComplete: () => car.setAngle(0)
        });

        //Timer

        timer = this.time.addEvent({delay: seg(4), callback: this.girar})

        tiempo = this.add.text(w-120,20);
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
            if (car.x < centro + 10 && car.x > centro - 10)
            {
                cen_der.play();
            }

            //Si esta en el cajon de la izquiera se va en medio
            else if (car.x < izquierda + 10 && car.x > izquierda - 10)
            {
                izq_cen.play();
            }
            
        }
        //A la izquierda
        else if (cursors.left.isDown)
        {
            
            //Si esta en el cajon de la derecha se va en medio
            if (car.x < derecha + 10 && car.x > derecha - 10)
            {
                der_cen.play();
            }

            //Si está en el cajon de en medio se va a la izquierda
            else if (car.x < centro + 10 && car.x > centro - 10)
            {
                cen_izq.play();
            }
        }

        tiempo
        .setText(timer.getRemainingSeconds().toString().substr(0,1))
        .setFontFamily('Arial')
        .setFill('#FF0000')
        .setFontSize(60)
        .setStroke('#000', 5);
    }

    girar()
    {
        console.log("xd");
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