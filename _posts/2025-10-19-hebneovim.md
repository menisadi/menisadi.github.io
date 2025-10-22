---
layout: single
title: "Hebrew & RTL in Neovim: a small, practical journey"
date: 2025-10-15
tags: [neovim, vim, hebrew, rtl, kitty, markdown]
toc: true
collection: posts
author: Meni
---

I've been using Neovim as my daily driver at coding tasks for a 2 years now.
Meanwhile, anything which is not code related - thoughts, ideas, plans, I been using MS Word or Google Docs.
This is due to the fact that, beside coding, I write on Hebrew, and as Hebrew is written from right to left and uses its own set of letters I avoided using Neovim for those tasks.
As anyone who uses Vim / Neovim knows, as soon as you become used to it any other text editing tool feels weird.
So, I wanted to do give a Neovim a try and write my Hebrew stuff **inside Neovim**.

It took some time (not too much, though), but I think I made it, and for the last several days I've been slowly migrating my Hebrew writing into Neovim.
So here's the path I took, for those who just want the final config - [here it is](#my-full-hebrew-rtl-configuration).

---

## Step 1 — Read the docs

I started by looking at the official docs and found out that Neovim exposes the following essentials:

- `rightleft` to draw lines from right to left.
- `keymap=hebrew` to map keys, while the keyboard is in fact set to English, for typing Hebrew.

In addition from skimming various configurations online I understood that I also need the following:

- `iminsert` and `imsearch` to switch input method for insert/search.

From what I understand those two tells Neovim to actually use the keymap and not rely on the OS typing setup.
Note that Neovim automatically modify those when you change the keymap, but I guess it is better to state this explicitly and not rely on this underlying behaviour.
Also, there is a key-binding which can toggle this when it is set automatically, and I don't want to allow it.

I started with simply applying those settings.
It worked, but I didn't love the experience and lots of people online say the same: Vim/Neovim isn't great for **bidi** (as in bi-directional writing) in the first place, and that is actually by design as they "inherent" this from the terminal itself.
Instead threads online suggested that Emacs, as it relies on its own rendering system, which supports bidi, is the preferred option.
Ok, I guess I could give Emacs a try, I'm not a hater or something.

---

## Step 2 — A brief Emacs tangent (and why I returned)

I decided to go with Doom Emacs, which seems like the best way to enter the Emacs world.
The installation process was not too bad and I could get a basic, usable Emacs configuration to work in half an hour or so.
Emacs rendered Hebrew nicely, the people online were right, I guess.
Next thing was to tweak it a bit to make my writing flow more smooth.
I started reading about elisp, but then I suddenly stooped.
I realized that I'm entering complete new and rich territory and to be honest, I didn't want to invest so much time to learn a whole new paradigm and a new language and overall get in a new ecosystem/config right now.
Also, my little Emacs experiment made me realize that in fact I rarely use Hebrew and English mixed, so I don't really need bidi support, I only needed **one direction at a time**! So I went back to Neovim to give it a deeper try.

---

## Step 3 — Make a tiny RTL toggle (the minimally useful bit)

I took off from the place I left and found out that wrapping those basic options behind a tiny toggle helped a lot.
It wasn't yet good enough in my opinion but it was a usable start.
At this point all I added was just the simplest working toggle and a hotkey:

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
```

That alone made Hebrew sessions feel deliberate: press `<leader>hb`, and start to type in Hebrew. Want to change back? Just press is again. Neat.

---

## Step 4 — Small quality-of-life fixes (later improvements)

### Cursor shapes

While living with the minimal toggle for a while, I kept having a feeling that the movement was acting strange.
When I examined it closely I realized that the cursor was to blame.
I use a vertical cursor (┃) on insert mode and it is left aligned which, when writing RTL gave the filling of jumping back and forth.
I checked and couldn't find any right-aligned version so I settled on underline as a replacement.
So, I added to my toggle a little part which changed the cursor from vertical line to underline.

### Spellchecking (Hebrew + English)

Next, I noted that my spellchecker is marking the entire butter.
As it is set to English it made sense.
At first I simply turned it off, but after a little while I decided to give Hebrew spell-check a try.
The nice surprise: it is quite easy as **Neovim can prompt to download missing dictionaries** when you enable `spell` and set `spelllang` to a language you don't have yet. 

Examples:

```lua
-- Note: 'opt_local' makes this a buffer-local preferences
vim.opt_local.spell = true
vim.opt_local.spelllang = { "he", "en_us" }
```

If you need to fetch files manually, I'm told that you should grab `he.utf-8.spl` from Vim's mirrors and place them in your spell dir (create it if needed).

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
  -- Disables the capitalization check, as Hebrew don't have caps
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

## Bonus 1 — Terminal & font details (Kitty)

I didn't like the default Hebrew font.
I decided to replace it manually.
I use Kitty terminal and wanted a clean, legible Hebrew mono look.
Mapping the **Hebrew Unicode block** to a specific font was quite straightforward:
Kitty have a variable named `symbol_map` which let Kitty use a different font for specific "codepoint" ranges—in this case, the Hebrew block, let's see online...
OK, it's U+0590–U+05FF. So, I just need to add the following to my config:

```conf
# ~/.config/kitty/kitty.conf
symbol_map U+0590-U+05FF Cousine
```

**Note:** `Some sources empethised that symbol_map` was designed for _symbols_, not body text.
I still need to test some edge cases to understand this one better.

---

## Bonus 2 — Markdown rendering inside Neovim

I've had a great experience using **render-markdown.nvim** for nicer Markdown in Neovim.I was pleased to find out that it behaved well even when my paragraphs were RTL.
Highly recommended.

On the CLI side, I hoped to pipe Markdown through **Glow** for pretty previews—but **Glow doesn't render RTL correctly** today (reversed text, left-aligned).
I opened an issue there.
Until that's addressed, I made a little bash alias which uses **FriBidi** (the Unicode BiDi reference implementation) as a sort of Hebrew variant of "cat" (so no "pizzazz", just text).

```bash
alias hat='fribidi --width $(tput cols)'

# Usage:
hat README.md
```

FriBidi's CLI converts logical strings to visual, and `tput cols` gives you the current terminal width so the result is right aligned.

Now back to actually writing something...

_PS: If you have a good bidi-aware Markdown previewer for the terminal, I'm all ears._

---

## References & further reading

[1]: https://neovim.io/doc/user/hebrew.html
[2]: https://neovim.io/doc/user/options.html#'rightleft'
[3]: https://neovim.io/doc/user/options.html#'iminsert'
[4]: https://willcodefor.beer/posts/spellnvim?utm_source=chatgpt.com "Spellcheck multiple languages in Neovim - willcodefor.beer"
[5]: https://sw.kovidgoyal.net/kitty/conf/?utm_source=chatgpt.com "kitty.conf - kitty"
[6]: https://github.com/MeanderingProgrammer/render-markdown.nvim?utm_source=chatgpt.com "GitHub - MeanderingProgrammer/render-markdown.nvim: Plugin to improve ..."
[7]: https://github.com/charmbracelet/glow/issues/725?utm_source=chatgpt.com "RTL text is not presented properly (reveresed and left-aligned)"
[8]: https://manpages.org/fribidi?utm_source=chatgpt.com "man fribidi (1): a command line interface for the fribidi library ..."
