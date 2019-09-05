from flask import Flask, session, redirect, url_for, escape, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import wtforms
from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired
import flask_wtf, flask_wtf.file
import os

from time import sleep

################################################
# Flask
################################################
DBG = 1

app = Flask(__name__)

DB_FILE = 'usize.sqlite'
DB_URI = 'sqlite:///%s' % DB_FILE

secret_key = b'_5#y2L"Fqqqqqa14Q8z\n\xec]/'

if os.path.isfile('SECRET_KEY'):
	with open('SECRET_KEY') as f:
		secret_key = f.read().strip()
		secret_key = bytes(secret_key, encoding='utf-8')

app.config.update(
    #TESTING=True,
    SECRET_KEY=secret_key,
	SQLALCHEMY_DATABASE_URI = DB_URI,
	SQLALCHEMY_TRACK_MODIFICATIONS = False,
	TEMPLATES_AUTO_RELOAD = True
)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

################################################
# TensorFlow
# Se instancia a la clase tfManager() para inicializar el modelo retinanet de deteccion de personas
# TF_ENABLED indica si es que se va a usar TF o no, para ganar tiempo en caso de debugging
# TODO Requests queue, since TF person_detector can't handle simultaneous requests
################################################
TF_ENABLED = 0
from tf import tfManager
tf = tfManager(TF_ENABLED)
#from scripts.testpersona2 import a, b
#x = person_detector(photo)
#xx, yy = a()
#human = 'samples\\single2.jpg'


######################
# Base de datos
# Uso de SQLite y SQLAlchemy
######################
from model import initModel, Usuario
#initModel() # Si no existe el .sqlite, usar esta funcion para crear la BD segun los modelos definidos
Usuario.populate()


################################################
# Rutas de Flask
################################################
WEB_BROWSER_ENABLED = 0
LOG_FORM = 1
IGNORE_FORM_VALIDATE = 1
FAKE_TIMEOUT = 0

def responder(s='null', d=None):
	RESPUESTA = 'response'
	RESULTADO_BASE = 'null'
	RESPUESTA_BASE = {RESPUESTA: RESULTADO_BASE} # {'response': 'null'}

	resp = RESPUESTA_BASE

	# Si d es un diccionario, se usa como base
	if isinstance(d, dict):
		resp = d

	# Si s es un string, se usa como respuesta
	if isinstance(s, str):
		resp[RESPUESTA] = s # {'response': s}
			
	# Si el resultado final de resp es un diccionario, se retorna
	if isinstance(d, dict):
		return jsonify(resp)
	else:
		return jsonify(RESPUESTA_BASE)


class UserForm(FlaskForm):
	defaultemail = None
	defaultpwd = None

	#if DBG:
		#defaultemail = 'example@email.com'
		#defaultpwd = 'holahola'

	email = StringField('email', validators=[DataRequired()], default=defaultemail)
	pwd = PasswordField('pwd', validators=[DataRequired()], default=defaultpwd)
	# Para filtrar requests desde la app o desde otra fuente (Python o un navegador web via HTML)
	source = PasswordField('source')


class UploadForm(FlaskForm):
	photo = flask_wtf.file.FileField('photo', validators=[flask_wtf.file.FileRequired()])
	height = wtforms.IntegerField('height', validators=[DataRequired()])


# url_for('home') redirige a una funcion! No a la ruta de app.route()

@app.route('/')
def home():
	query = Usuario.query.all()
	return render_template('home.html', q=query) if WEB_BROWSER_ENABLED else 'Usize'


@app.route('/login', methods=['GET', 'POST'])
def login():
	form = UserForm()

	if request.method == 'POST':
		if IGNORE_FORM_VALIDATE or form.validate_on_submit():
			email = form.email.data
			pwd = form.pwd.data
			source = form.source.data # Para diferenciar app de web-browser

			if LOG_FORM: print('>>> LOG_FORM: %s %s %s' % (email, pwd, source))

			# Buscamos al usuario en la BD con el email
			u = Usuario.getUsuarioByEmail(email)
			# Si existe
			if u is not None:
				# Validamos la password con su hash
				if u.check_pwd(pwd):
					# Si es exitoso, guardamos la ID en la sesion
					session.clear()
					session['user_id'] = u.id
					if DBG: print('>>> /login: user_id %d logueado' % u.id)
					
					sleep(FAKE_TIMEOUT)
					resul = 'logueado'
					
					#else:
						#print('not app')
						#return redirect(url_for('home'))
				else:
					resul = 'pwd incorrecta'					
			else:
				resul = 'email no existe'
		else:
			resul = 'bad_POST_request'
		
		return responder(resul)

	return render_template('login.html', form=form) if WEB_BROWSER_ENABLED else 'Usize_login'


@app.route('/register', methods=['GET', 'POST'])
def register():
	form = UserForm()
	errors = None

	if form.validate_on_submit():
		email = form.email.data
		pwd = form.pwd.data
		source = form.source.data

		if LOG_FORM: print('>>> LOG_FORM: %s %s' % (email, pwd))

		# Buscamos un posible usuario en la BD con el email
		u = Usuario.getUsuarioByEmail(email)
		# Si existe, entonces dicho email ya esta registrado
		if u is not None:
			errors = 'email ya existe'
		# Else, registramos al usuario
		else:
			u = Usuario.addUsuario(email=email, pwd=pwd)
			# E iniciamos la sesion inmediatamente
			session.clear()
			session['user_id'] = u.id

			if source == 'app':
				sleep(FAKE_TIMEOUT)
				return 'registered'

			return redirect(url_for('home'))
			
	return render_template('register.html', form=form, errors=errors) if WEB_BROWSER_ENABLED else 'Usize'


@app.route('/logout', methods=['GET'])
def logout():
	session.clear()
	return redirect(url_for('home'))


@app.route('/profile', methods=['GET'])
def profile():
	# Si hay una id guardada en la sesion
	if 'user_id' in session.keys():
		# Retornamos el perfil de usuario
		id = session['user_id']
		u = Usuario.getUsuarioByID(id)
		if u is not None:
			if DBG: print('usuario %d encontrado' % id)
			sleep(FAKE_TIMEOUT)
			return jsonify({'email': u.email})
		if DBG: print('user no encontrado')
		return 'user no encontrado'		
	
	if DBG: print('sesion vacia')
	return 'bad_request'


@app.route('/upload', methods=['GET', 'POST'])
def upload():
	form = UploadForm()

	if request.method == 'POST':
		if IGNORE_FORM_VALIDATE or form.validate_on_submit():
			photo = form.photo.data
			height = form.height.data
			#photo = request.files['photo']
			#photo_strea = photo.read()

			result = tf.handle_photo(photo, height)
			
			if DBG: print(result)

			if isinstance(result, dict):
				return jsonify(result)
			else:
				return jsonify({'result': 'fatal_error'})
		else:
			s = 'bad_POST_request'
			if DBG: print(s)
			return jsonify({'result': s})
	
	return render_template('upload.html', form=form) if WEB_BROWSER_ENABLED else 'Usize'

