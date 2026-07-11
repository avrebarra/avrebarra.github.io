# simple makefile
@:
	@echo "no commands chosen.";
	@echo "try 'make help' to see available commands.";

## watch: Start dev server via Docker (no local Ruby/Jekyll needed)
watch:
	docker run --rm \
		--name avrebarra-blog \
		-p 4000:4000 \
		-v "$(PWD):/srv/jekyll" \
		jekyll/jekyll:4.4.1 \
		jekyll serve --host 0.0.0.0 --force_polling

.PHONY: help
all: help
help: Makefile
	@echo
	@echo " Choose a command run with parameter options: "
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
