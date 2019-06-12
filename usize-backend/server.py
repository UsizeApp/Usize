from flask import Flask, session, redirect, url_for, escape, request, jsonify
from scripts.OpenPoseImage import open_pose_image
from scripts.persona import person_detector
import os

app = Flask(__name__)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

def handle_uploaded_file(photo, height):
    uploaded_photo = "input/photo.jpg"
    photo.save(uploaded_photo)
    full_path = os.path.abspath(uploaded_photo)
    if person_detector(full_path):
        return open_pose_image(full_path, height)
    else:
        print("No pudimos detectar a una persona.")
        raise

@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        #print(request)
        #print(request.data)
        #print(request.form)
        #print(request.files)
        #print(request.values)
        #session['username'] = request.form['username']
        photo = request.files['photo']
        height = int(request.form['height'])
        try:
            medidas = handle_uploaded_file(photo, height)
            print(medidas)
        except:
            print("No pudimos tomar las medidas. ¡Intenta otra vez!")
        return redirect(url_for('index'))
    return'''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
        '''

@app.route('/response', methods=['GET', 'POST']) #GET requests will be blocked
def response():
    return "response"

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=3333)

