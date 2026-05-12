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
I was listening to Andreaj Karpathy's talk on .... mentioning chess as an example of an area on which models had a significant improvement due to focused fine-tuning by the labs.
I recalled all the mockery the chess community had over ChatGPT attempts to play chess back in 2023-2024 and wondered if the models really got so much better.
I wanted to examine this but at the same time I had not interest in games which drifted into gibberish.
So I designed a little tool which I named notleko (after the one and only Peter Leko).
The idea was simple - it should allow agentic tools, like Claude Code or Codex, to play chess against the mighty Stockfish. As LLMs have no state that I can truly address, the idea is to have the game's PGN file as the source of truth.
The agent uses notleko to read the game's state, print the board, list possible legal moves and pick the chosen move. It also the model's endpoint for getting Stockfish's move (technically an agent could run Stockfish by itself but I wanted to make the game flow consistent on parts which are not the moves choice part).
In addition, as I previously had an interesting experiment with ChatGPT o3 chain-of-thoughts while playing chess, I incorporated a commenting aspect to the tool (hence the reference to Leko of course). On each move the agent is asked to add a comment, using a dedicated flag in the CLI. The comment will be embedded on the PGN in a standard fashion. In addition after observing Stockfish's move the agent is asked to add to it his "thoughts" about it, using a dedicated 'comment' subcommand.
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

I run 4 games. Two using Claude Haiku, One using Claude Sonnet and one using MinMax.
