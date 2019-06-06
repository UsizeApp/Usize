from flask import Flask, session, redirect, url_for, escape, request
from scripts.OpenPoseImage import open_pose_image
from scripts.persona import person_detector
import os

app = Flask(__name__)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

def handle_uploaded_file(f):
	uploaded_photo = "input/photo.jpg"
	f.save(uploaded_photo)
	full_path = os.path.abspath(uploaded_photo)
	object_type, probability = person_detector(full_path)
	if object_type and probability and probability >= 0.7:
		open_pose_image(full_path)
	else:
		raise

@app.route('/')
def index():
	if 'username' in session:
		return 'Logged in as %s' % escape(session['username'])
	return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		#print(request)
		#print(request.data)
		#print(request.form)
		print(request.files)
		#print(request.values)
		handle_uploaded_file(request.files['photo'])
		#session['username'] = request.form['username']
		return redirect(url_for('index'))
	return '''
		<form method="post">
			<p><input type=text name=username>
			<p><input type=submit value=Login>
		</form>
	'''

@app.route('/logout')
def logout():
	# remove the username from the session if it's there
	session.pop('username', None)
	return redirect(url_for('index'))
	
if __name__ == '__main__':
	app.run(host='0.0.0.0', debug=False, port=3333)

