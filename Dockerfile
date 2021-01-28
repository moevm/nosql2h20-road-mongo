FROM python:3.6-alpine

WORKDIR /app

COPY ./* ./

RUN python -m pip install -r ./requirements.txt

CMD python3 wsgi.py