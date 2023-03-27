GO ?= go
GOFMT ?= gofmt "-s"
GOFILES := $(shell find . -name "*.go")
VETPACKAGES ?= $(shell $(GO) list ./... | grep -v /example/)

VER ?= 2.0.3

.PHONY: fmt
fmt:
	$(GOFMT) -w $(GOFILES)

.PHONY: vet
vet:
	$(GO) vet $(VETPACKAGES)

.PHONY: lint
lint:
	revive -exclude epoll.go -formatter friendly ./...

.PHONY: build
build:

	$(GO) build -o bin/prscd2

.PHONY: dist
dist: clean
	GOOS=linux GOARCH=amd64 $(GO) build -ldflags "-s -w" -o dist/prscd-${VER}-x86_64-linux
	GOOS=linux GOARCH=arm64 $(GO) build -ldflags "-s -w" -o dist/prscd-${VER}-arm64-linux
	GOOS=darwin GOARCH=amd64 $(GO) build -ldflags "-s -w" -o dist/prscd-${VER}-x86_64-darwin
	GOOS=darwin GOARCH=arm64 $(GO) build -ldflags "-s -w" -o dist/prscd-${VER}-arm64-darwin
	GOOS=windows GOARCH=amd64 $(GO) build -ldflags "-s -w" -o dist/prscd-${VER}-x86_64-windows.exe
	GOOS=windows GOARCH=arm64 $(GO) build -ldflags "-s -w" -o dist/prscd-${VER}-arm64-windows.exe

.PHONY: dev
dev:
	DEBUG=true PORT=8443 $(GO) run -race .

.PHONY: test
test:
	MESH_ID=test go test -v chirp/*

.PHONY: bench
bench:
	MESH_ID=bench LOG_LEVEL=2 go test -bench=. -benchmem yomo.run/prscd2/chirp

.PHONY: testpage
testpage:
	@mkdir -p ./test_pages
	@cp msgpack.js ./test_pages
	@cp websocket.html test_pages/.
	@sed -i '' 's/URL_DEBG/URL_PROD/g' test_pages/websocket.html
	@cp webtrans.html test_pages/.
	@sed -i '' 's/URL_DEBG/URL_PROD/g' test_pages/webtrans.html

.PHONY: clean
clean:
	@rm -rf dist
	@rm -rf bin
