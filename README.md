# Ninjy
I programmed this game over the course of a week. The objective is to collect as many apples as possible, while avoiding the enemies. You can also collect mushroom powerups throughout the game.

# Motivation
I made this game because I love to program! It was also good practice. A lot of the time, I have trouble following through and finishing projects, so I'm proud that I was able to complete this game.

# Tools and Frameworks
I used Javascript and the [Phaser library](https://phaser.io/phaser3), a framework for creating 2d games. In addition, I used the [mathjs library](https://mathjs.org/) to assist in calculating the trigonometry in the game.

# Gameplay 
(Note: The actual gameplay is not this laggy. The GIFs just have a low resolution and frame rate.)

![ninjy-gameplay1](https://user-images.githubusercontent.com/30969561/78857178-8b4c7b00-79dd-11ea-95db-3d2866c757c3.gif)
![ninjy-gameplay-archers](https://user-images.githubusercontent.com/30969561/78857203-956e7980-79dd-11ea-977a-5a99b8cdd3c2.gif)
![ninjy-gameplay-maelstrom](https://user-images.githubusercontent.com/30969561/78857207-9acbc400-79dd-11ea-8d75-004206f77b22.gif)

# Difficulties and What I Learned
Because this was my first time programming in Javascript, I had to get used to the syntax. Although learning a new language initially slowed me down, I'm glad I did because I have developed somewhat of an understanding of how Javascript works. 

Furthermore, because this was my first time using Phaser, I had trouble learning how to use the framework, in particular the Sprite and Scene classes. While Phaser 3 has documentation, the online resources and tutorials are pretty sparse compared to Phaser 2. 

[This YouTube tutorial series](https://www.youtube.com/watch?v=frRWKxB9Hm0) by Luis Zuno :pray: helped me a ton. In the future, I'm going to practice reading documentation so that I can be better equipped in situations where the framework is fairly recent.

I also had trouble with my prototypes/objects. I didn't create a main player object by extending the Phaser Sprite class. Instead, I created it inside the main scene, which was a mistake. As a result of my design error, I had to code all the player movements inside the scene, which made it very disorganized. I should have made the main player be its own seperate prototype, which would have been so much easier to code. In the future, I know not to do this.
