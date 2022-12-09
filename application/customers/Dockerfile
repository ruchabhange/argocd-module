FROM golang:1.15.2
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN go build ./main.go

CMD ["./main"]