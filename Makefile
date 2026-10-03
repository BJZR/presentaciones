JS = $(addprefix src/js/,estado lienzo diaps elementos props presentar archivo main)
JS := $(addsuffix .js,$(JS))
OUT = dist/presentador.html

all: $(OUT)

$(OUT): src/index.html src/style.css $(JS)
	@mkdir -p dist
	@cat $(JS) > dist/.app.js
	@sed -e '/<!--CSS-->/{r src/style.css' -e 'd}' -e '/<!--JS-->/{r dist/.app.js' -e 'd}' src/index.html > $@
	@rm dist/.app.js

clean:
	@rm -rf dist

.PHONY: all clean
