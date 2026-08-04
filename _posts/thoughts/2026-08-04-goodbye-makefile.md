---
layout: post
title: Goodbye, Makefile
date: 2026-08-04 00:00:00 +0000
highlighted: true
categories: thoughts
tags: []
series: Thoughts
---

I replaced my Makefiles with something else this week.

Makefiles, a classic way to run commands in a project. We define targets, and each target has a recipe. With this file, we run commands like `make dev` or `make build`. Simple and effective way to manage tasks in a project.

Those Makefiles are fine. But I think I found a way that fits me better.

## Why I Switched

I used Makefiles for years, like everyone else. They do what they're for. But what they're for is narrow: a list of targets, each with a recipe, and every recipe is a shell fragment with invisible rules around it. Tabs matter. Quoting gets weird. The moment a command needs real logic, a condition or an env check, you're doing shell gymnastics inside a DSL that keeps getting in the way.

Now that AI is here, the last reason to stay is gone. Writing a script used to cost setup time; now my agent writes it for me. All that remains is the tool itself, and Makefile's feature set is too restrictive to justify keeping it.

What I actually want from a task runner is simple. I want to type a short command and have the right thing happen. I want to read the file later and see every command it offers at a glance. And I want scripting flexibility when one of my commands needs real logic.

I call mine **runtask**. By runtask I mean a single executable Ruby file at the root of the repo. No gems, no dependencies, nothing to learn. Commands are entries in a hash, arguments get matched and dispatched, and anything complicated is just Ruby.

## The Skill That Writes It for Me

The part that changed how I build is not the file itself. It's that I stopped writing it by hand.

My coding agent loads skills, small instruction files that package a pattern. I made one for this pattern, called runtask-maker. Now when I start a project I say "set up my runtask" and the agent produces the same file, in the same shape, every time. The skill is short. It holds the rules and a template:

- always `chmod +x` the file
- stdlib Ruby only, no gems
- every command must appear in the usage text
- use `bail` and `run` helpers, never a raw `system()` call

The chmod one matters most. It's the difference between `./runtask` working and a cold "command not found".

## The File

Every runtask file has four blocks: config, helpers, commands, dispatch. Config holds the script directory and constants. Helpers load `.env` files and run commands with loud errors. Commands is a hash of argument arrays to lambdas. Dispatch matches your input and prints usage when nothing matches.

```ruby
COMMANDS = {
  %w[core dev]  => -> { run "cd core && gow run ." },
  %w[web build] => -> { run "cd web && npm run build" },
  %w[deploy]    => -> {
    bail("VM_USER missing, add it to .env") if ENV["VM_USER"].to_s.empty?
    run "ssh #{ENV["VM_USER"]}@vm 'docker compose up -d'"
  },
}.freeze
```

That's the whole surface. No phony targets, no variable plumbing, no tab rules. Two of those commands are from real projects. One of them stops before touching the server if the env is wrong. In a Makefile, that same guard is a shell script sitting inside a target.

## Using It

The part I like most: run the file with no arguments and it tells you everything.

```
$ ./runtask
Usage: ./runtask <command>

Commands:
  core dev    Start Go API with hot reload
  web build   Build frontend for production
  deploy      Sync and restart services on the VM
```

`./runtask core dev` runs the command. Adding a new one is a line in the hash and a line in the usage block. That's the whole maintenance story.

## Closing Thoughts

Thats how I replaced my Makefiles with a Ruby script file this week. Makefile is fine. But I think I found out that we are entitled to a better way going forward.

This is just one more stuff that made me more convinced that nowadays with AI, there's more reason to ditch restrictive stuffs as we can get the better stuffs in a practically easier, but still more flexible, readable, and maintainable way.

This one usecase of runtask pattern is simple, but it works better. Guess what comes next?

## Appendix

**The skill my agent loads: `runtask-maker/SKILL.md`**

````
---
name: runtask-maker
description: >
  Create or extend the "runtask" file — a single executable Ruby script at the repo
  root that replaces a Makefile with a typed command table (`./runtask core dev`).
  Use when user says "set up my runtask", "make a task runner", "add a command to
  runtask", "replace the makefile with a script", "create my scripts file", "add a
  deploy/dev command script", or when a project needs a Makefile and a script would
  be cleaner. Backs the runtask with a copy-paste template and always sets chmod +x.
---

# runtask — the Ruby task-runner file

One executable Ruby file at repo root. Replaces Makefile. Runs arbitrary shell
commands with typed args: `./runtask core dev`, `./runtask deploy`.

Runs anywhere (macOS/Linux, no gems, stdlib only). Better than Makefile: real
language for conditionals/env checks, readable errors, no tab-sensitivity.

## When to use

- Multi-command project (dev/test/build/deploy/lint across domains) — use runtask.
- Monorepo with multiple apps → namespace commands: `%w[core dev]`, `%w[web release]`.
- Deploy/ops workflows with env checks (SSH, scp, docker compose) — use runtask.

**When NOT to use (YAGNI):**
- Single command → just run it, no file.
- Single-language simple app with package.json → use its built-in `scripts` block.
- User explicitly asks for a Makefile — don't override.

## Non-negotiable rules

1. **ALWAYS `chmod +x runtask`** after creating or copying the file. Verify with `ls -l`.
2. File name: `runtask`, no extension, repo root. (Existing projects may call it
   `scripts` — same pattern, leave their name unless user asks to rename.)
3. Ruby only, stdlib only. No gems, no bundler.
4. Run via `./runtask <cmd...>` — never `ruby runtask`. Usage text must say `./runtask`.
5. Every command must be in the USAGE heredoc — file self-documents.
6. Exit codes: 0 success, 1 failure or unknown command.
7. `bail` + `run` helpers always included (see template). Never raw `system()` without error handling.

## Structure (follow exactly)

1. `#!/usr/bin/env ruby` + `frozen_string_literal: true`
2. `# ─── config ───` — `SCRIPT_DIR = File.dirname(File.expand_path(__FILE__))`, constants
3. Helpers: `load_env(path)` (parses `.env`-style files), `bail(msg)`, `run(cmd)`
4. `# ─── commands ───` — `COMMANDS` hash: array of downcase args → lambda
5. `# ─── dispatch ───` — `ARGV.map(&:downcase)` → lookup → `exit cmd.call ? 0 : 1`
   or print USAGE heredoc + exit 1

Section comments lowercase, one line, no numbering (project convention).

## Template

Full skeleton: `template/runtask` in this skill dir. Copy it, edit COMMANDS +
USAGE, `chmod +x`. Command bodies use `run "..."` (prints + bails on failure)
or lambdas with `bail(...)` for preconditions (env vars, files, SSH reachability).

## Conventions

- Commands lowercase. Namespaced pairs for monorepo: `%w[core dev]`, `%w[web release]`.
- Secrets/env → `.env` at repo root, loaded by `load_env`. Never hardcode.
- `.env` stays gitignored. `load_env` silently skips missing file — no crash.
- Multi-step command → `run` each step, print `>>>` progress lines, end with status.
- Long helper output (e.g. cron hints) → print as `#`-prefixed comment block.

## Example

```ruby
COMMANDS = {
  %w[dev]      => -> { run "npm run dev" },
  %w[deploy]   => -> {
    bail("VM_USER not set — put it in .env") if ENV["VM_USER"].to_s.empty?
    run "ssh #{ENV["VM_USER"]}@vm 'cd app && docker compose up -d'"
  },
}.freeze
```
````

**The template it generates: `template/runtask`**

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

# ─── config ──────────────────────────────────────────────────────────────────

SCRIPT_DIR = File.dirname(File.expand_path(__FILE__))

def load_env(path)
  return unless File.exist?(path)

  File.readlines(path).each do |line|
    line = line.strip
    next if line.empty? || line.start_with?("#")

    key, value = line.split("=", 2)
    ENV[key.strip] = value.strip.delete(%q('"))
  end
end

def bail(msg)
  warn "❌ #{msg}"
  exit 1
end

def run(cmd)
  puts "  $ #{cmd}"
  bail("#{cmd.split.first} failed") unless system(cmd)
end

load_env("#{SCRIPT_DIR}/.env")

# ─── commands ────────────────────────────────────────────────────────────────

COMMANDS = {
  # %w[dev] => -> { run "npm run dev" },
  # %w[test] => -> { run "npm test" },
  # %w[core dev] => -> { run "cd core && gow run ." },
}.freeze

# ─── dispatch ────────────────────────────────────────────────────────────────

input = ARGV.map(&:downcase)
cmd   = COMMANDS[input]

if cmd
  exit cmd.call ? 0 : 1
else
  puts <<~USAGE
    Usage: ./runtask <command>

    Commands:
      dev     Start dev server with HMR
      test    Run tests
  USAGE
  exit 1
end
```
