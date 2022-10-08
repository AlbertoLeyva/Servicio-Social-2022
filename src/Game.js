/* 

========================================================================================

    Game.js

    Archivo principal para el juego Carrera de Estimaciones.

    Hecho por Alberto Leyva

    Servicio Social 2022 | FMAT | UADY 

    Ultima modificación: 7/10/22

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

const Banco = {
    Facil: [
        new Operacion ('85+11','96','74','97'),
        new Operacion ('36+79','115','116','105'),
        new Operacion ('75-25','50','55','100'),
        new Operacion ('7+8','15','14','16'),
        new Operacion ('20-7','13','12','15'),
        new Operacion ('90-36','54','45','64'),
        new Operacion ('14+7','21','20','23'),
        new Operacion ('52+24','76','86','96'),
        new Operacion ('61+28','89','99','98'),
        new Operacion ('15-7','8','9','7'),
        new Operacion ('9+5','14','13','15'),
        new Operacion ('90-30','60','50','70'),
        new Operacion ('45-15','30','35','40'),
        new Operacion ('60-24','36','40','44'),
        new Operacion ('13-7','6','5','8')
    ],

    Medio: [
        new Operacion ('450-75','375','225','325'),
        new Operacion ('675+150','825','850','925'),
        new Operacion ('375-175','200','300','275'),
        new Operacion ('120+65','185','195','205'),
        new Operacion ('150-85','65','70','95'),
        new Operacion ('186+238','424','224','324'),
        new Operacion ('335-185','150','250','450'),
        new Operacion ('270+185','455','355','555'),
        new Operacion ('425-140','285','385','265'),
        new Operacion ('275+425','700','675','600'),
        new Operacion ('750-55','695','595','625'),
        new Operacion ('90+315','405','505','485'),
        new Operacion ('115-60','55','70','65'),
        new Operacion ('350+125','475','425','375'),
        new Operacion ('567-203','364','274','304')

    ],

    Dificil: [
        new Operacion ('1900+100','2000','2100','1890'),
        new Operacion ('1970-880','1090','1080','1780'),
        new Operacion ('4300+900','5200','5400','5190'),
        new Operacion ('7639-700','6939','6900','5839'),
        new Operacion ('2170+990','3160','2860','3100'),
        new Operacion ('101+7305','7406','7316','8216'),
        new Operacion ('8909-199','8710','7700','8080'),
        new Operacion ('7305+1001','8306','7300','8206'),
        new Operacion ('4020-766','3254','3200','2374'),
        new Operacion ('2054-1115','939','800','839'),
        new Operacion ('6817 +2700','9517','8500','9407'),
        new Operacion ('5060-2089','2971','2700','3070'),
        new Operacion ('4000+1700','5700','6070','6070'),
        new Operacion ('409+2350','2759','2509','2709'),
        new Operacion ('7142-7090','52','150','102')
    ],
};

// VARIABLES 

// Tamaño de la ventana 
const w = 800;
const h = 600;

//Para el teclado
var cursors;
var keys;

//Carro principal
var car;

// Colo del carro por default
var carColor = 'blueCar';

//Dificultad
var lvl = 'Facil';
var nivel;

var tiempoNivel = 60*2;

//Carretera de fondo
var road;

//Roca y aceite
var roca;
var aceite;

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
var v;
var v1;
var v2;
var v3;

//Variables del juego

// Timer
var timer;
var tiempo;

//Textos

var pregunta;
var preguntas;

const nPreguntas = 5;
var contPreg;
var contPregT;

var opcion1;
var opcion2;
var opcion3;

var opciones;

var derrape;
var avanzar;
var chocar;

var tAnim = 2;

//Funcion simple que convierte a segundos
function seg(s){
    return (s) * 1000;
};

//Funcion que randomiza elementos en un array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  //Funcion de segundo a minutos xd
  function fmtMSS(s){s = Math.floor(s); return(s-(s%=60))/60+(9<s?':':':0')+s}

//Progreso (Entero)
//
// 0 => Facil / Azul
// 1 => Medio / Azul y amarillo
// 2 => Dificil / Azul, amarillo y rojo
// 3 => Todo

var jProgreso;

var parar;

var count = 0;

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
        this.load.image('oil', 'Oil.png');
        this.load.image('rock', 'Rock.png');
        this.load.image('difBox', 'diff_box.png');
        this.load.image('carBox', 'car_box.png');
        this.load.image('opBox', 'op_box1.png');
        this.load.image('qBox', 'q_box2.png');

        
        if (!localStorage.getItem('progreso')){
    
            localStorage.setItem('progreso', 0);
        
        }

        jProgreso = parseInt(localStorage.getItem('progreso'));
        
        // PARA VER TODO EL JUEGO REMOVER AL FINAL ******************************************************************************
        //jProgreso = 0;
        //console.log("jProgreso: " + jProgreso);
        //
        // Resetear el navegador con "localStorage.setItem('progreso',0);" en la consola o donde sea
        //
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
        .once('pointerdown', () => { this.scene.start('instrucciones1'); });
    }

    update ()
    {

        // Movimiento del fondo
        road.tilePositionY -= 3;
    }

}

class Instrucciones1 extends Phaser.Scene{

    constructor(){
        super('instrucciones1');
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
        
        "¿YA ARRANCARON SUS MOTORES?\n\nEn este juego tendrás que poner\na prueba tu mente y ser veloz estimando.\n\nEn la pantalla aparecerán operaciones\nmatemáticas que tendrás que hacer mentalmente."
        
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
        .once('pointerdown', () => { this.scene.start('instrucciones2'); });

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

class Instrucciones2 extends Phaser.Scene{

    constructor(){
        super('instrucciones2');
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
        
        "Usa las flechas del teclado para mover tu\ncarro a la respuesta que creas correcta.\n\n¡Escoge rápido porque tendrás poco tiempo!\n\nEl juego se acaba cuando hayas contestado todas\nlas operaciones o hayas tenido 3 errores."
        
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
        .once('pointerdown', () => { this.scene.start('instrucciones1'); });

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

        var inst = this.add.text(w/2, h/2 - 260,
        
        "SELECCIÓN"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 50, fill: '#FFF300', align: 'center'})
        .setStroke('#FF0000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var inst2 = this.add.text(w/2, h/2 - 210,
        
        "Selecciona la dificultad y tu carro."
        
        ,{fontFamily: 'BoldnessRace', fontSize: 30, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var inst3 = this.add.text(w/2, h/2 - 180,
        
        "¡Completa los niveles para conseguir los demás carros!"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 20, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        //Dificulltades

        var boxD = this.add.image(w/4, h/3 + 120, 'difBox');

        var s = 0.5;
        var gris = 0x1A1A1A;

        lvl = 'Facil';

        var btFacil = this.add.image(w/4, h/3 + 40, 'btFacil')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btFacil.setScale(s + 0.2))
        .on('pointerout', () => btFacil.setScale(s))
        .on('pointerdown', () => btFacil.clearTint() && btMedio.setTint(gris) && btDificil.setTint(gris))
        .on('pointerdown', () => {lvl = 'Facil'; tiempoNivel = 60*2;});

        var btMedio = this.add.image(w/4, h/3 + 140, 'btMedio')
        .setTint(gris)
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btMedio.setScale(s + 0.2))
        .on('pointerout', () => btMedio.setScale(s))
        .on('pointerdown', () => btFacil.setTint(gris) && btMedio.clearTint() && btDificil.setTint(gris))
        .on('pointerdown', () => {lvl = 'Medio'; tiempoNivel = 60*3;});

        var btDificil = this.add.image(w/4, h/3 + 240, 'btDificil')
        .setTint(gris)
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btDificil.setScale(s + 0.2))
        .on('pointerout', () => btDificil.setScale(s))
        .on('pointerdown', () => btFacil.setTint(gris) && btMedio.setTint(gris) && btDificil.clearTint())
        .on('pointerdown', () => {lvl = 'Dificil'; tiempoNivel = 60*3;});

        //Carros

        var boxC = this.add.image(550, 325, 'carBox');

        var btBlue = this.add.image(450, 300, 'btBlue')
        .setScale(s - 0.2)
        .setInteractive()
        .on('pointerover', () => btBlue.setScale(s-0.1))
        .on('pointerout', () => btBlue.setScale(s-0.2))
        .on('pointerdown', () => btBlue.clearTint() && btYellow.setTint(gris) && btRed.setTint(gris) && btGreen.setTint(gris))
        .on('pointerdown', () => carColor = 'blueCar');

        var btYellow = this.add.image(650, 300, 'btYellow')
        .setScale(s - 0.2)
        .setTint(gris)
        .setInteractive()
        .on('pointerover', () => btYellow.setScale(s-0.1))
        .on('pointerout', () => btYellow.setScale(s-0.2))
        .on('pointerdown', () => btBlue.setTint(gris) && btYellow.clearTint() && btRed.setTint(gris) && btGreen.setTint(gris))
        .on('pointerdown', () => carColor = 'yellowCar');

        var btRed = this.add.image(450, 400, 'btRed')
        .setScale(s - 0.2)
        .setTint(gris)
        .setInteractive()
        .on('pointerover', () => btRed.setScale(s-0.1))
        .on('pointerout', () => btRed.setScale(s-0.2))
        .on('pointerdown', () => btBlue.setTint(gris) && btYellow.setTint(gris) && btRed.clearTint() && btGreen.setTint(gris))
        .on('pointerdown', () => carColor = 'redCar');     

        var btGreen = this.add.image(650, 400, 'btGreen')
        .setScale(s - 0.2)
        .setTint(gris)
        .setInteractive()
        .on('pointerover', () => btGreen.setScale(s-0.1))
        .on('pointerout', () => btGreen.setScale(s-0.2))
        .on('pointerdown', () => btBlue.setTint(gris) && btYellow.setTint(gris) && btRed.setTint(gris) && btGreen.clearTint())
        .on('pointerdown', () => carColor = 'greenCar');

        if (jProgreso == 0){

            this.add.image(w/4, h/3 + 140, 'lock').setScale(0.2);
            this.add.image(w/4, h/3 + 240, 'lock').setScale(0.2);
            this.add.image(650, 300, 'lock').setScale(0.2);
            this.add.image(450, 400, 'lock').setScale(0.2);
            this.add.image(650, 400, 'lock').setScale(0.2);

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
        .once('pointerdown', () => { this.scene.start('juego');});

        //Atras

        var btBack = this.add.image(55, 55 , 'btBack')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btBack.setScale(s+0.2))
        .on('pointerout', () => btBack.setScale(s))                 
        .once('pointerdown', () => { this.scene.start('instrucciones2'); });

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

        //Nivel
        nivel = Banco[lvl];

        //Camino de fondo que da vueltas
        road = this.add.tileSprite(400, 300, 0, 0, "road");

        //Roca y Aceite
        roca = this.add.image(izquierda, 0, 'rock').setOrigin(0.5,1).setScale(0.3);
        aceite = this.add.image(centro, 0, 'oil').setOrigin(0.5,1).setScale(0.3);

        //Vidas
        nVidas = 3;

        v = [this.add.image(50, 50, 'vida').setScale(0.17), this.add.image(120, 50, 'vida').setScale(0.17), this.add.image(190, 50, 'vida').setScale(0.17)];

        //Definicion del carro
        car = this.physics.add.image(centro, 475, carColor)
        .setScale(0.9);

        //Que no se salga del canvas
        car.setCollideWorldBounds(true);

        //Definicion del teclado
        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard;

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

        derrape = this.tweens.timeline({

            targets: car,
            paused: true,
            duration: seg(tAnim * 0.35),
            ease: anim,
            loop: -1,

            tweens: [
                {
                    y: 300,
                    angle: 45
                },
                {
                    y: 550,
                    angle: -45
                },
                {
                    y: 475,
                    angle: 0
                }
            ],

            onLoop: () => {

                this.mostrarOpciones(); 
                derrape.pause();
                if (nVidas == 0){
                    this.scene.start('perder');
                };
    
                if (count == nPreguntas && nVidas > 0){
                    this.scene.start('ganar');
                };
            }
            
        });

        avanzar = this.tweens.timeline({

            targets: car,
            paused: true,
            duration: seg(tAnim * 0.5),
            loop: -1,
            ease: anim,

            tweens: [
                {
                    y: 300,
                },
                {
                    y: 475,
                }
            ],

            onLoop: () => {

                this.mostrarOpciones(); 
                avanzar.pause();
    
                if (count == nPreguntas && nVidas > 0){
                    this.scene.start('ganar');
                };
            }
            
        });

        chocar = this.tweens.add({
            targets: [roca, aceite],
            paused: true,
            y : h,
            duration: seg(tAnim),
            ease: anim,
            onComplete: () => { roca.y = 1; aceite.y = 1;}
        });

        //Respuestas

        var pBox = this.add.image(centro, 75, 'qBox').setOrigin(0.5);
        pregunta = this.add.text(centro, 75).setOrigin(0.5);

        preguntas = new Array(nivel.length);

        for (var i = 0; i < nivel.length; i++){
            preguntas[i] = nivel[i];
        }

        shuffle(preguntas);

        var op1Box = this.add.image(izquierda, 220, 'opBox').setOrigin(0.5);
        opcion1 = this.add.text(izquierda, 220).setOrigin(0.5);

        var op2Box = this.add.image(centro, 220, 'opBox').setOrigin(0.5);
        opcion2 = this.add.text(centro, 220).setOrigin(0.5);

        var op2Box = this.add.image(derecha, 220, 'opBox').setOrigin(0.5);
        opcion3 = this.add.text(derecha,220).setOrigin(0.5);

        //Timer

        parar = this.time;

        keys.enabled = true
        this.mostrarOpciones();

        //seg(número de segundos totales del nivel)
        timer = this.time.addEvent({delay: seg(tiempoNivel), repeat: nPreguntas, callback: this.mostrarRespuesta});

        tiempo = this.add.text(w-120,25);

        contPreg = 1;

        contPregT = this.add.text(w-120,85);
    }

    update ()
    {
        
        // Movimiento del fondo
        road.tilePositionY -= 5;

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
        .setText(fmtMSS(timer.getRemainingSeconds().toString()))
        .setFontFamily('Arial')
        .setFill('#FF0000')
        .setFontSize(50)
        .setStroke('#000', 5).
        setOrigin(0.5,0);

        contPregT
        .setText(contPreg + [] + "/5")
        .setFontFamily('Arial')
        .setFill('#000')
        .setFontSize(50)
        .setStroke('#FFF', 5).
        setOrigin(0.5,0);

        //.setText(Math.floor(timer.getRemainingSeconds())+[])
    }

    mostrarOpciones()
    {
        if(count < nPreguntas){

            pregunta
            .setText(preguntas[count].op)
            .setFontFamily('Arial')
            .setFill('#FFF')
            .setFontSize(60)
            .setStroke('#000', 5);

            opciones = [opcion1, opcion2, opcion3]

            shuffle(opciones);

            opciones[0].setText(preguntas[count].res)
            .setFontFamily('Arial')
            .setFill('#FFF')
            .setFontSize(60)
            .setStroke('#000', 5);

            opciones[1].setText(preguntas[count].t1)
            .setFontFamily('Arial')
            .setFill('#FFF')
            .setFontSize(60)
            .setStroke('#000', 5);

            roca.x = opciones[1].x;
            aceite.x = opciones[2].x;

            opciones[2].setText(preguntas[count].t2)
            .setFontFamily('Arial')
            .setFill('#FFF')
            .setFontSize(60)
            .setStroke('#000', 5);
        } 

    }

    mostrarRespuesta(){

        keys.enabled = false;  
        timer.paused = true;
        tiempo.visible = false;
        contPregT.visible = false; 

        opciones[0]
        .setFill('#00FF00');

        opciones[1]
        .setFill('#FF0000');

        opciones[2]
        .setFill('#FF0000');

        if (car.x != opciones[0].x){
            derrape.play();
            derrape.resume();
            chocar.play();
            nVidas = nVidas - 1;
            v[nVidas].setTint('#FF0000'); 
            v.pop();
        }
        else{
            avanzar.play();
            avanzar.resume();
            chocar.play();
        }

        parar.delayedCall(seg(tAnim), () => {
            keys.enabled = true; 
            timer.paused = false;
            tiempo.visible = true;
            contPregT.visible = true;
            contPreg = contPreg + 1;
            //opciones[0]
            //.setBackgroundColor();

            //opciones[1]
            //.setBackgroundColor();

            //opciones[2]
            //.setBackgroundColor();
        } , [], this);

        count++;

    }
}

class Ganar extends Phaser.Scene{

    constructor(){
        super('ganar');
    }

    create(){

        if(parseInt(localStorage.getItem('progreso')) < 3){
            jProgreso = jProgreso + 1;
            localStorage.setItem('progreso', jProgreso);
        }

        count = 0;

        //Fondo
        road = this.add.tileSprite(400, 300, 0, 0, "road");
        road.alpha = 0.5;

        // Mensajes
        var msgG_G = this.add.text(w/2, h/2 - 70,
        
        "¡FELICIDADES!"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 100, fill: '#FFF300', align: 'center'})
        .setStroke('#FF0000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var msgP_G = this.add.text(w/2, h/2 + 70,
        
        "Has demostrado ser un gran corredor\n¡Sigue así!"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 30, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        //Boton

        var s = 0.5;

        var btJugar = this.add.image(w/2, h/2 + 200 , 'btVamos')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btJugar.setScale(s+0.2))
        .on('pointerout', () => btJugar.setScale(s))                 
        .once('pointerdown', () => { this.scene.start('menu'); });

    }

    update(){
        
        // Movimiento del fondo
        road.tilePositionY -= 3;
    }

}

class Perder extends Phaser.Scene{

    constructor(){
        super('perder');
    }

    create(){

        count = 0;

        //Fondo
        road = this.add.tileSprite(400, 300, 0, 0, "road");
        road.alpha = 0.5;

        // Mensajes
        var msgG_P = this.add.text(w/2, h/2 - 70,
        
        "¡SUERTE LA\nPRÓXIMA! "
        
        ,{fontFamily: 'BoldnessRace', fontSize: 100, fill: '#FFF300', align: 'center'})
        .setStroke('#FF0000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        var msgP_P = this.add.text(w/2, h/2 + 70,
        
        "Fallaste esta vez, pero no importa\n¡Sigue intentando!"
        
        ,{fontFamily: 'BoldnessRace', fontSize: 30, fill: '#FFF', align: 'center'})
        .setStroke('#000', 3)
        .setOrigin(0.5, 0.5)
        .setPadding(10,10,10,10);

        //Boton

        var s = 0.5;

        var btJugar = this.add.image(w/2, h/2 + 200 , 'btVamos')
        .setScale(s)
        .setInteractive()
        .on('pointerover', () => btJugar.setScale(s+0.2))
        .on('pointerout', () => btJugar.setScale(s))                 
        .once('pointerdown', () => { this.scene.start('menu'); });
    }

    update(){
        
        // Movimiento del fondo
        road.tilePositionY -= 3;
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
    
    scene: [Boot, Menu, Juego, Seleccion, Instrucciones1, Instrucciones2, Ganar, Perder]
};

document.fonts.load('10pt BoldnessRace').then(() => new Phaser.Game(config));