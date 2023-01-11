MAIN := ./waitevent.ts
LOCK := --lock=deno.lock
DENO_ARGS:= ${LOCK} --allow-run --allow-net

test: 
	deno test ${DENO_ARGS}
.PHONY: test

check:
	deno fmt --check
	deno check ${LOCK} ${MAIN}
	deno lint
.PHONY: check

install:
	deno install -f ${DENO_ARGS} ${MAIN}
