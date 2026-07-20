FROM alpine:3.20
RUN apk add --no-cache curl ca-certificates
WORKDIR /pb

ARG PB_VERSION=0.39.5
RUN curl -Lo pocketbase.tar.gz "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.tar.gz" \
  && tar -xzf pocketbase.tar.gz \
  && rm pocketbase.tar.gz

COPY pb_migrations /pb/pb_migrations
EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--dir=/pb_data", "--http=0.0.0.0:8090"]
