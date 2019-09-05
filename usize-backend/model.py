from app import db

from werkzeug.security import generate_password_hash as genpw
from werkzeug.security import check_password_hash as checkpw

class Usuario(db.Model):
	__tablename__ = 'Usuarios'

	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(80), unique=True, nullable=False)
	hash = db.Column(db.String(128), nullable=False)

	def set_pwd(self, pwd):
		self.hash = genpw(pwd)

	def check_pwd(self, pwd):
		return checkpw(self.hash, pwd)

	@staticmethod
	def populate(): # Not __init__
		if Usuario.query.count() <= 0:
			Usuario.addUsuario(email='example@email.com', pwd='holahola')

	@staticmethod
	def getUsuarioByEmail(email):
		q = None
		try:
			q = Usuario.query.filter_by(email=email).one_or_none()
		#except Exception as e: # MultipleResultsFound
		except: # MultipleResultsFound
			#print(e)
			print("WARNING: email %s duplicado" % email)
		
		return q

	@staticmethod
	def getUsuarioByID(id):
		q = None
		try:
			q = Usuario.query.get(id)
		except:
			print(e)
		
		return q

	@staticmethod
	def addUsuario(email, pwd):
		u = Usuario(email=email)
		u.set_pwd(pwd)
		db.session.add(u)
		db.session.commit()
		return u

	@staticmethod
	def all():
		return Usuario.query.all()

# Usar si es que se quiere empezar la BD desde cero
def initModel():
	db.create_all()
	db.session.commit()