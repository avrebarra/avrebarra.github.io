# simple makefile
@:
	@echo "no commands chosen.";
	@echo "try 'make help' to see available commands.";

## serve-workspace: Serve workspace as static assets on port 7173
serve-workspace:
	ruby -run -ehttpd ./workspace/ -p7173

## watch: Start development mode with watcher
watch:
	@jekyll serve

## new_post: Create a new post file with current date and template content
new_post:
	@DATE=$$(date +%Y-%m-%d); \
	DATETIME=$$(date +"%Y-%m-%d %H:%M:%S %z"); \
	FILENAME="_posts/$$DATE-untitled.md"; \
	if [ -f "$$FILENAME" ]; then \
		echo "Error: File $$FILENAME already exists!"; \
		exit 1; \
	fi; \
	echo "---" > "$$FILENAME"; \
	echo "layout: post" >> "$$FILENAME"; \
	echo "title: Untitled Post" >> "$$FILENAME"; \
	echo "date: $$DATETIME" >> "$$FILENAME"; \
	echo "highlighted: false" >> "$$FILENAME"; \
	echo "categories:" >> "$$FILENAME"; \
	echo "tags: []" >> "$$FILENAME"; \
	echo "series:" >> "$$FILENAME"; \
	echo "---" >> "$$FILENAME"; \
	echo "" >> "$$FILENAME"; \
	echo "Created new post: $$FILENAME"

.PHONY: help
all: help
help: Makefile
	@echo
	@echo " Choose a command run with parameter options: "
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
