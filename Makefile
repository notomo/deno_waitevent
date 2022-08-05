MAIN := ./waitevent.ts
DENO_ARGS:= --allow-run --allow-net

test: 
	deno test ${DENO_ARGS}
.PHONY: test

check:
	deno fmt --check
	deno check ${MAIN}
	deno lint
.PHONY: check

install:
	deno install ${DENO_ARGS} ${MAIN}
