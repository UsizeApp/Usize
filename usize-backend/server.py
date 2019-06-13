from flask import Flask, session, redirect, url_for, escape, request, jsonify

import os
from datetime import datetime as dt

from scripts.OpenPoseImage import open_pose_image
from scripts.persona import person_detector

app = Flask(__name__)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

def handle_uploaded_file(photo, height):
    photo_folder = "input"
    
    if not os.path.exists(photo_folder):
        os.makedirs(photo_folder)
        
    szNow = dt.now().strftime("%Y-%M-%d %H.%M.%S")
    
    photo_path = "%s/photo_%s.jpg" % (photo_folder, szNow)
    
    photo.save(photo_path)
    
    full_path = os.path.abspath(photo_path)
    
    if person_detector(full_path):
        return open_pose_image(full_path, height)
    else:
        s = "No pudimos detectar a una persona."
        print(s)
        #raise
        return s

@app.route('/')
def index():
    return 'Usize'

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        photo = request.files['photo']
        height = int(request.form['height'])
        medidas = {'basura' : -1}
        try:
            medidas = handle_uploaded_file(photo, height)
            print(medidas)
            print(medidas['left'])
            return jsonify(medidas)            
        except Exception as e:
            print(e)
            s = "No pudimos tomar las medidas. ¡Intenta otra vez!"
            print(s)
            return s
    return'''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
        '''

@app.route('/response', methods=['GET', 'POST']) #GET requests will be blocked
def response():
    return "response"

   
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=3333)

