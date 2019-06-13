@echo off
@set FLASK_APP=server.py
@set FLASK_DEBUG=1
@python -m flask run --host 0.0.0.0 --port 3333