FROM golang:1.23-alpine AS builder

RUN apk add --no-cache curl ca-certificates && \
    curl -L -o /tmp/pocketbase.zip https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_linux_amd64.zip && \
    unzip /tmp/pocketbase.zip -d /tmp && \
    mv /tmp/pocketbase /usr/local/bin/pocketbase && \
    chmod +x /usr/local/bin/pocketbase && \
    rm -rf /tmp/pocketbase.zip /tmp/pocketbase

FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata && \
    adduser -D -u 1000 pocketbase

WORKDIR /pb_data

COPY --from=builder /usr/local/bin/pocketbase /usr/local/bin/pocketbase

USER pocketbase

CMD ["pocketbase", "serve", "--dir=/pb_data", "--http=0.0.0.0:8080"]
