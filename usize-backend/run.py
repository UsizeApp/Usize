# Instanciamos app.py y activamos la variable app en este archivo
from app import app

# main()
# Iniciamos el servidor Flask

DEBUG = 1
PORT = 3333

if __name__ == '__main__':
	#app.run(host='0.0.0.0', debug=False, port=3333)
	app.run(host='0.0.0.0', port=5000, debug=False, threaded=False)
