PROJECTNAME := articles

# -------------------------------------------------
# -------------------------------------------------

## watch: watch development build
watch: build
	bundle exec jekyll serve --livereload

## build: build binary
build:
	bundle exec jekyll build

.PHONY: help
all: help
help: Makefile
	@echo
	@echo " Choose a command run with parameter options: "
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
