import { Module } from "@nestjs/core/injector/module";
import { Lobby } from "./lobby/lobby";
import { GameData, GameMode, GameSettings, GameState, Player } from "./types/game.type";
import { getMiniModeSettings, getNormalModeSettings, initGameData } from "./utils/game.settings";


export class GameInstance
{
	private gameData:       GameData;
    private settings:       GameSettings;

    constructor(public lobby: Lobby, public mode: GameMode)
	{
        this.gameData = initGameData();

		if (mode == GameMode.Normal)
		{
			this.settings = getNormalModeSettings();
		}
		else if (mode == GameMode.Mini)
		{
			this.settings = getMiniModeSettings();
			this.gameData.ball.radius = this.gameData.ball.radius / 5;
		}
		else if (mode == GameMode.Speed)
		{
			this.settings = getNormalModeSettings();
			this.gameData.ball.speed *= 2;
		}
	}

    handleGoal(nextPos)
    {
        this.gameData.state = GameState.Goal;
        const winner = nextPos.x - this.gameData.ball.radius < 0 ? 1 : 0;
        this.gameData.players[winner].score += 1;
		this.lobby.sendToUsers("goalScored", this.gameData.players);
        
		if (this.gameData.players[winner].score === this.settings.scoreToWin)
        {
            this.gameData.state = GameState.Stopped;
			this.lobby.sendToUsers('gameOver', this.gameData.players[winner].id);
        }
    }

    checkGoals(nextPos): boolean
    {
        if (nextPos.x - this.gameData.ball.radius < 0 ||
			nextPos.x + this.gameData.ball.radius > this.settings.width)
			return true;
		return false
    }

	ballHitsLeftPaddel(nextPos: {x: number, y: number})
	{
		if (nextPos.y <= this.gameData.players[0].pos + this.settings.paddleHeight / 2 &&
				nextPos.y >= this.gameData.players[0].pos - this.settings.paddleHeight / 2)
		{
			if (nextPos.x - this.gameData.ball.radius < this.settings.paddleWidth)
			{
				 //this.updateBall(this.gameData.ball.x, this.gameData.ball.y, (Math.random() * Math.PI) / 2 - Math.PI / 4);
				return true;
			}
		}
		return false;
	}

	ballHitsRightPaddel(nextPos: {x: number, y: number})
	{
		if (nextPos.y <= this.gameData.players[1].pos + this.settings.paddleHeight / 2 &&
				nextPos.y >= this.gameData.players[1].pos - this.settings.paddleHeight / 2)
		{
			if (nextPos.x + this.gameData.ball.radius > this.settings.width - this.settings.paddleWidth)
			{
				return true;//return this.updateBall(this.gameData.ball.x, this.gameData.ball.y, (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI);
			}
		}
		return false;
	}

	ballHitsTopOrBottom(nextPos: {x: number, y: number})
	{
		if (nextPos.y - this.gameData.ball.radius < 0 || nextPos.y + this.gameData.ball.radius > this.settings.height)
			return true;
		return false;
	}

    gameLoop()
    {
        if (this.gameData.state === GameState.Started)
        {
			const nextPos = {	x: this.gameData.ball.x + this.gameData.ball.delta.x,
								y: this.gameData.ball.y + this.gameData.ball.delta.y };

            if (this.checkGoals(nextPos) == true)
            {
				this.handleGoal(nextPos)
				this.resetRound();
            }
			else
			{
				if (this.ballHitsLeftPaddel(nextPos) || this.ballHitsRightPaddel(nextPos))
					this.gameData.ball.delta.x *= -1;
				else if (this.ballHitsTopOrBottom(nextPos))
					this.gameData.ball.delta.y *= -1;

				this.gameData.ball.x += this.gameData.ball.delta.x;
				this.gameData.ball.y += this.gameData.ball.delta.y;
				this.lobby.sendToUsers('updateBall', this.gameData.ball);
			}
            
        }
		if (this.gameData.state != GameState.Stopped)
			setTimeout(() => this.gameLoop(), 30);

    }

	getDelta(speed: number, radian: number) {		return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };	};

	updateBall(x: number, y: number, radian: number)
	{
		this.gameData.ball.x = x;
		this.gameData.ball.y = y;
		this.gameData.ball.delta = this.getDelta((this.gameData.ball.speed *= 1.01), radian);

		this.lobby.sendToUsers('updateBall', this.gameData.ball);
	}

	resetRound()
	{
		if (this.gameData.state == GameState.Stopped)
			return ;
		let radian = (Math.random()*  Math.PI) / 2 - Math.PI / 4;
		
		//1 chance on 2 to go left
		if (Math.random() < 0.5)
			radian += Math.PI;

		this.updateBall(
			this.settings.width / 2,
			this.settings.height / 2,
			radian)
		this.gameData.state = GameState.Started;
	}

    public stop()
    {
        this.gameData.players = [];
        this.gameData.state = GameState.Stopped;
    }

    public addPlayer(clientId: string)
    {
		const newPlayer: Player = {
			id: clientId,
			pos: this.settings.height / 2,
			score: 0,
		}
        this.gameData.players.push(newPlayer);
    }

	public sendReady()	{ this.lobby.sendToUsers("gameReady", { gameData: this.gameData, gameSettings: this.settings }); }

    public isPlayer(clientId: string): boolean
    {  
        for (let i = 0; i < this.gameData.players.length; i++)
        {
            if (this.gameData.players[i].id == clientId)
                return true;
        }
        return false;
    }

	public getPlayer(playerId: string)
	{
		let res: Player = null;

		this.gameData.players.forEach((player) => {
			if (player.id == playerId)
				res = player;
		})
		return res;
	}

    public playersId(): string[]
    {
        let res: string[] = [];
        this.gameData.players.forEach((player) => {
            res.push(player.id);
        })
        return res;

    }
}