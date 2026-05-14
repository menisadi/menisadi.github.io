---
layout: single
title: ""
toc: true
toc_sticky: true
# collection: posts
mathjax: true
tags:
  - chess
  - ai
  - llm
  - cli
  - claude
---

Few days ago I was playing around with some chess related CLI stuff Claude help me create.
I was listening to [Andrej Karpathy's talk at Sequoia Ascent](https://www.youtube.com/watch?v=96jN2OCOfLs) mentioning chess as an example of an area on which models had a significant improvement due to focused fine-tuning by the labs.
I recalled all the mockery the chess community had over ChatGPT attempts to play chess back in 2023-2024 and wondered if the models really got so much better.
I wanted to examine this but at the same time I had not interest in games which drifted into gibberish.

## The tool

The idea was simple - it should allow agentic tools, like Claude Code or Codex, to play chess against the mighty Stockfish.
I designed a little tool which I named notleko (after the one and only Peter Leko).
The core constraint was that each invocation should do exactly one thing. Agents don't hold state between shell calls, so instead of sessions or a running server, `notleko` uses a PGN file as its single source of truth. Every command reads from it and writes to it. Nothing lives in memory.
The agent uses notleko to read the game's state, print the board, list possible legal moves and pick the chosen move. It also the model's endpoint for getting Stockfish's move (technically an agent could run Stockfish by itself but I wanted to make the game flow consistent on parts which are not the moves choice part).
The commands look like this:

```bash
```text
notleko --file game.pgn new --color white
notleko --file game.pgn move e2e4 --reason "Controls the center"
notleko --file game.pgn engine
notleko --file game.pgn status
notleko --file game.pgn legal-moves
```

In addition, as I previously had an interesting experiment with ChatGPT o3 chain-of-thoughts while playing chess, I incorporated a commenting aspect to the tool (hence the reference to Leko of course). On each move the agent is asked to add a comment, using a dedicated flag in the CLI. The comment will be embedded on the PGN in a standard fashion. In addition after observing Stockfish's move the agent is asked to add to it his "thoughts" about it, using a dedicated 'comment' subcommand.
The game file accumulates a fully annotated record as it goes, written move by move.

Putting all this together the only think left is the initial prompt which was the following:

```md
I have here a cool CLI names notleko. I want you to use it to play a game against Stockfish.
First run:
notleko --help
notleko new --help
notleko move --help
notleko engine --help
notleko comment --help
And then use it to play a game on which you play as white and let Stockfish play black.
At the start pass you name to the 'notleko new --name' flag.
On each of your moved use the --reason flag to explain you logic.
After each of Stockfish moves use the comment subcommand to express your thoughts about it.
You can use the --json flag when cheking status (via 'status' subcommand), if you need it.
Don't rewrite your comments.
Play untill the end of the game.
Use the file_name: {yourname}_game_{YYYY-MM-DD}.pgn
```

I also have the option to limit Stockfish level, so in order to use it, if I wanted, I just add:

```md
Limit Stockfish skill to 1 (using --skill falg on the engine subcommand).
```

That's the entire prompt. No chess instruction whatsoever.

## The Games

I run 4 games. Two using Claude Haiku, One using Claude Sonnet and one using MinMax M2.5. All three played as White. All three lost.
The games are available as a Lichess study [here](https://lichess.org/study/7LSb5U2L/RnT28TaZ) — worth playing through with annotations visible. Reading the moves alone doesn't do it justice.

### Haiku

#### First Game

Haiku starts with phrases like "takes the center" and "developing the knight to suport". At the same time, already as we reach move 3 he miss read the board by claiming that Bb5 "pinnes the knight" which is simply wrong as the pawn on d7 didn't move yet.
A move later he praissed a simplt Nf6 saying "Excellent development. The knight attacks my center" and yet ignores the threat completly, allowing the e4 pawn to be taken.
On move 9 it blunders a knight, ignoring the option to capture black's knight in return.
On move 16 it claims that Bc5 "attacking the d6 pawn".
On move 20 it claimed that its d-pawn is a "dangerous passed pawn" (it isn't dangerous and it isn't a passed pawn).
The mate comes at move 26 with the final comment:
"26... Re1#: Checkmate! The rook delivers the final blow on e1. A dominant performance by Stockfish, who exploited my weakened king position and accumulated material advantage."

#### Second Game

On this game I asked Haiku to restrict Stockfish to its lowest strenght.
The game started with some standard stuff ("French Defense. Solid choice, preparing d5 and limiting my space."Develop knight to natural square - supports center" "control key squares d5").
On move 4 Stockfish played h6 to which Haiku responded with the immediate Bg5 ("Exploit the weakened kingside by pinning the knight - forces Black to make a decision about defending or moving the knight").
It was a downhill from there, accompanied by the same "develop bishop to aggressive diagonal" "putting pressure on my position." "maintaining central control and piece activity" "Reposition bishop to e4 - active square controlling the long diagonal " (the kanight takes this bishop immidiatly) and so on.
On move 25, after blundering a rook in one move Haiku resigned saying: "This is a devastating tactical blow - I've lost my last active piece. Resigned due to overwhelming material disadvantage - Stockfish's tactics throughout the game, especially the queen sacrifice and final rook capture, were too strong."

Note, there was no queen sacrifice, it was just a simple queen trade on d1.

### Sonnet

### MiniMax

## Conclusion

I know I know, there is no reason a language based model will be able to reason well on a visual-structured game like chess. Yet the gap between the informed, jargon heavy comments and the acctual cluelesness of the possitions all throuhgh the games is amusing and interesting.
We all know that LLMs are guilty of this but when you see a clear nonsensical move on the chess board followed by "solidifying my positional compensation", it helps to tighten this point, at least for me.
