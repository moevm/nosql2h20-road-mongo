FROM python:3.6-alpine

WORKDIR /app

RUN ls

COPY ./* ./

RUN ls
RUN python -m pip install -r ./requirements.txt

RUN echo "Hello"
RUN ls

CMD python3 wsgi.py