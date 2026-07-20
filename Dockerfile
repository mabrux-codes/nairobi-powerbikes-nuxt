FROM alpine:3.20
RUN apk add --no-cache curl ca-certificates unzip
WORKDIR /pb

ARG PB_VERSION=0.39.5
RUN curl -Lo pocketbase.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
  && unzip -q pocketbase.zip \
  && rm pocketbase.zip

COPY pb_migrations /pb/pb_migrations
EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--dir=/pb_data", "--http=0.0.0.0:8090"]
