FROM python:3.6-alpine

WORKDIR /app

COPY ./* ./

RUN python -m pip install -r ./requirements.txt

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk update
RUN apk add mongodb=3.4.4-r0

RUN mongo --version

CMD python3 wsgi.py