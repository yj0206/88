class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('ball', 'assets/ball.png');
        this.load.image('paddle', 'assets/paddle.png');
        this.load.image('brick', 'assets/brick.png');
    }

    create() {
        this.scene.start('MainScene');
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.ball = this.physics.add.image(400, 300, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.paddle = this.physics.add.image(400, 550, 'paddle').setImmovable();
        this.bricks = this.physics.add.staticGroup({
            key: 'brick',
            repeat: 9,
            setXY: { x: 65, y: 65, stepX: 70 }
        });

        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.ball.y > this.game.config.height) {
            this.resetBall();
        }

        if (this.cursors.left.isDown) {
            this.paddle.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.paddle.setVelocityX(500);
        } else {
            this.paddle.setVelocityX(0);
        }
    }

    hitBrick(ball, brick) {
        brick.disableBody(true, true);
        if (this.bricks.countActive() === 0) {
            alert("You Win!");
            this.scene.stop();
        }
    }

    hitPaddle(ball, paddle) {
        let diff = 0;
        if (ball.x < paddle.x) {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        } else if (ball.x > paddle.x) {
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        } else {
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    resetBall() {
        this.ball.setVelocity(0);
        this.ball.setPosition(400, 300);
        this.paddle.setPosition(400, 550);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MainScene]
};

const game = new Phaser.Game(config);
