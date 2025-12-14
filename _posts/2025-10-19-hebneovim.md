---
layout: single
title: "Hebrew & RTL in Neovim: a small, practical journey"
date: 2025-10-15
toc: true
toc_sticky: true
collection: posts
author: Meni
tags: [neovim, vim, hebrew, rtl, kitty, markdown]
---

I've been using Neovim as my daily driver for coding tasks for two years now. 
Meanwhile, for anything not code-related: thoughts, ideas, plans, I've been using MS Word or Google Docs. 
This is because, besides coding, I write in Hebrew, and since Hebrew is written from right to left and uses its own set of letters, I avoided using Neovim for those tasks.  
As anyone who uses Vim or Neovim knows, once you get used to it, any other text editing tool feels weird.  
So, I wanted to give Neovim a try and start writing my Hebrew stuff **inside Neovim**.

It took some time (not too much, though), but I think I made it. For the last several days, I've been slowly migrating my Hebrew writing into Neovim. 
So here's the path I took. For those who just want the final config [here it is](#my-full-hebrew-rtl-configuration).

---

## Step 1 - Read the docs

I started by looking at the [official Neovim Hebrew docs](https://neovim.io/doc/user/hebrew.html) and found out that Neovim exposes the following essentials:

- [`rightleft`](https://neovim.io/doc/user/options.html#'rightleft') to draw lines from right to left.
- [`keymap=hebrew`](https://neovim.io/doc/user/options.html#'keymap') to map keys, while the keyboard is actually set to English, for typing Hebrew.

In addition, from skimming various configurations online, I learned that I also needed the following:

- [`iminsert`](https://neovim.io/doc/user/options.html#'iminsert') and [`imsearch`](https://neovim.io/doc/user/options.html#'imsearch') to switch input method for insert/search.

From what I understand, those two tell Neovim to actually use the keymap instead of relying on the OS typing setup.  
Note that Neovim automatically modifies those when you change the keymap, but I think it’s better to state this explicitly and not rely on that underlying behavior. 
Also, there’s a key binding that can toggle this automatically, and I don’t want to allow it. 
The docs mention some more options like `rlc` and `revins`, but for now I found that either their default values were already fine for me or their behavior was shadowed by one of the other commands.

I started by simply applying those settings manually. 
It worked, but I didn’t love the experience, and lots of people online say the same: Vim/Neovim isn’t great for **bidi** (bi-directional writing) in the first place. That’s actually by design, as they *inherit* this limitation from the terminal itself[^salt].  
Instead, threads online suggested that Emacs, which relies on its own rendering system and supports bidi, is the preferred option ([see discussion](https://github.com/neovim/neovim/issues/553), [SuperUser thread](https://superuser.com/questions/455155/bidi-support-in-vim-should-i-revert-to-notepad)).  
Okay, I figured I could give Emacs a try. I’m not a hater or anything.

---

## Step 2 - A brief Emacs tangent (and why I returned)

I decided to go with [Doom Emacs](https://github.com/doomemacs/doomemacs), which seems like the best way to enter the Emacs world. 
The installation process wasn’t too bad, and I managed to get a basic, usable Emacs configuration running in about half an hour. 
Emacs rendered Hebrew nicely, the people online were right, I guess. 
Next, I wanted to tweak it a bit to make my writing flow more smoothly. 
I started reading about elisp, but then I suddenly stopped.  
I realized that I was entering a completely new and rich territory, and to be honest, I didn’t want to invest so much time learning a whole new paradigm, a new language, and an entirely new ecosystem right now. 
Also, my little Emacs experiment made me realize that I rarely use Hebrew and English mixed, so I don’t really need bidi support, I only need **one direction at a time**!  
So I went back to Neovim to give it a deeper try.

---

## Step 3 - Make a tiny RTL toggle (the minimally useful bit)

I picked up where I left off and found that wrapping those basic options behind a tiny toggle helped a lot. 
It wasn’t perfect yet, but it was a usable start. 
At this point, all I added was a simple working toggle and a hotkey:

```lua
local function HebrewToggle()
  if not vim.b.hebrew_mode_enabled then
    vim.opt_local.keymap   = "hebrew"
    vim.opt_local.iminsert = 1
    vim.opt_local.imsearch = 1
    vim.opt_local.rightleft = true
    vim.b.hebrew_mode_enabled = true
    vim.notify("Hebrew mode: ON")
  else
    vim.opt_local.keymap   = ""
    vim.opt_local.iminsert = 0
    vim.opt_local.imsearch = 0
    vim.opt_local.rightleft = false
    vim.b.hebrew_mode_enabled = false
    vim.notify("Hebrew mode: OFF")
  end
end

vim.api.nvim_create_user_command("HebrewToggle", HebrewToggle, {})
vim.keymap.set("n", "<leader>hb", function() vim.cmd.HebrewToggle() end,
  { silent = true, desc = "Toggle Hebrew mode (RTL/LTR)" })
````

That alone made Hebrew sessions feel deliberate: press `<leader>hb`, and start typing in Hebrew.
Want to switch back? Just press it again. Neat.

---

## Step 4 - Small quality-of-life fixes (later improvements)

### Cursor shapes

While living with the minimal toggle for a while, I kept feeling that movement was acting strangely.
When I examined it closely, I realized that the cursor was to blame.
I use a vertical cursor (┃) in insert mode, and it’s left-aligned, which, when writing RTL, gave the feeling of jumping back and forth.
I couldn’t find any right-aligned version, so I settled on an underline as a replacement. 
So, I added a small bit to my toggle that changed the cursor from a vertical line to an underline (see [`guicursor`](https://neovim.io/doc/user/options.html#'guicursor')).

### Spellchecking (Hebrew + English)

Next, I noticed that my spellchecker was marking the entire buffer.
Since it was set to English, that made sense.
At first, I simply turned it off, but after a while, I decided to give Hebrew spell-checking a try.
To my surprise, it was quite easy: [Neovim can prompt you to download missing dictionaries](https://neovim.io/doc/user/spell.html) when you enable `spell` and set `spelllang` to a language you don’t have yet.

Example:

```lua
-- Note: 'opt_local' makes this a buffer-local preference
vim.opt_local.spell = true
vim.opt_local.spelllang = { "he", "en_us" }
```

If you need to fetch the files manually, you can grab `he.utf-8.spl` from Vim’s mirrors and place it in your spell directory (create it if needed).
See also [this post on spellchecking in Neovim](https://willcodefor.beer/posts/spellnvim).

---

## My Full Hebrew RTL configuration

```lua
-- Defining the different cursors in a table
local guicursor_ltr = table.concat({
  'n-v-c:block', -- normal/visual/cmdline: block
  'i-ci-ve:ver25', -- insert/insert-cmd/visual-exclude: vertical bar (steady)
  'r-cr:hor20', -- replace modes: underline
  'o:hor50', -- operator-pending
}, ',')

local guicursor_rtl = table.concat({
  'n-v-c:block', -- normal/visual/cmdline: block
  'i-ci-ve:hor20', -- insert becomes underline (steady) for RTL
  'r-cr:hor20',
  'o:hor50',
}, ',')

-- Default to LTR cursor shapes
vim.o.guicursor = guicursor_ltr

local function enable_hebrew_spell()
  vim.opt_local.spelllang = { 'he', 'en_us' }
  -- Disable capitalization check, as Hebrew doesn’t have caps
  vim.opt_local.spellcapcheck = ''
  vim.opt_local.spellsuggest = 'best,9'
end

local function enable_english_spell()
  vim.opt_local.spelllang = { 'en_us' }
  vim.opt_local.spellcapcheck = vim.api.nvim_get_option_value('spellcapcheck', { scope = 'global' })
  vim.opt_local.spellsuggest = 'best,9'
end

local function ToggleHebrewMode()
  local heb_mode = vim.b.hebrew_mode_enabled

  if not heb_mode then
    vim.opt_local.keymap = 'hebrew'
    vim.opt_local.iminsert = 1
    vim.opt_local.imsearch = 1
    vim.opt_local.rightleft = true
    vim.b.hebrew_mode_enabled = true

    vim.o.guicursor = guicursor_rtl

    enable_hebrew_spell()

    vim.notify('Hebrew mode: ON', vim.log.levels.INFO)
  else
    vim.opt_local.keymap = ''
    vim.opt_local.iminsert = 0
    vim.opt_local.imsearch = 0
    vim.opt_local.rightleft = false
    vim.b.hebrew_mode_enabled = false

    vim.o.guicursor = guicursor_ltr

    enable_english_spell()

    vim.notify('Hebrew mode: OFF', vim.log.levels.INFO)
  end
end

-- Expose as a command, just in case
vim.api.nvim_create_user_command('HebrewToggle', function()
  ToggleHebrewMode()
end, {})

-- And as a keymap
vim.keymap.set('n', '<leader>hb', function()
  vim.cmd.HebrewToggle()
end, { silent = true, desc = 'Toggle Hebrew mode (RTL/LTR)' })
```

---

## Bonus 1 - Terminal & font details (Kitty)

I didn’t like the default Hebrew font, so I decided to replace it manually.
I use [Kitty terminal](https://sw.kovidgoyal.net/kitty/conf/) and wanted a clean, legible Hebrew mono look.
Mapping the **Hebrew Unicode block** to a specific font was quite straightforward:
Kitty has a variable named `symbol_map` which lets it use a different font for specific codepoint ranges, in this case, the Hebrew block.
A quick lookup online shows it’s U+0590–U+05FF.
So, I just needed to add the following to my config:

```conf
# ~/.config/kitty/kitty.conf
symbol_map U+0590-U+05FF Cousine
```

---

## Bonus 2 - Markdown rendering

I’ve had a great experience using [render-markdown.nvim](https://github.com/MeanderingProgrammer/render-markdown.nvim) for nicer Markdown in Neovim.
I was pleased to find out that it behaved well even when my paragraphs were RTL.
Highly recommended.

On the CLI side, I hoped to pipe Markdown through [Glow](https://github.com/charmbracelet/glow/) for pretty previews, but Glow doesn’t render RTL correctly today (reversed text, left-aligned).
I [opened an issue](https://github.com/charmbracelet/glow/issues/725) there.
Until that’s addressed, I made a little Bash alias which uses [FriBidi](https://manpages.org/fribidi) (the Unicode BiDi reference implementation) as a sort of Hebrew variant of `cat` (so no pizzazz, just text):

```bash
alias hat='fribidi --width $(tput cols)'

# Usage:
hat README.md
```

FriBidi’s CLI converts logical strings to visual ones, and `tput cols` gives you the current terminal width so the result is right-aligned.

Now back to actually writing something...

*PS: If you have a good bidi-aware Markdown previewer for the terminal, I’m all ears.*

[^salt]: I’m not an expert, so take this with a grain of salt.

---

## References

* [Neovim Hebrew Docs](https://neovim.io/doc/user/hebrew.html)
* [Neovim Options – rightleft](https://neovim.io/doc/user/options.html#'rightleft')
* [Neovim Options – iminsert](https://neovim.io/doc/user/options.html#'iminsert')
* [Neovim GitHub issue #553](https://github.com/neovim/neovim/issues/553)
* [Superuser: Bidi support in Vim](https://superuser.com/questions/455155/bidi-support-in-vim-should-i-revert-to-notepad)
* [Doom Emacs](https://github.com/doomemacs/doomemacs)
* [Neovim Options – guicursor](https://neovim.io/doc/user/options.html#'guicursor')
* [Neovim Spell Documentation](https://neovim.io/doc/user/spell.html)
* [“Spellchecking in Neovim” by Will Code for Beer](https://willcodefor.beer/posts/spellnvim)
* [Kitty Config Docs](https://sw.kovidgoyal.net/kitty/conf/)
* [render-markdown.nvim](https://github.com/MeanderingProgrammer/render-markdown.nvim)
* [Glow](https://github.com/charmbracelet/glow/)
* [Glow Issue #725 – RTL rendering](https://github.com/charmbracelet/glow/issues/725)
* [FriBidi manpage](https://manpages.org/fribidi)
