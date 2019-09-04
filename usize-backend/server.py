from flask import Flask, session, redirect, url_for, escape, request, jsonify

import os
from datetime import datetime as dt

from scripts.OpenPoseImage import open_pose_image
from scripts.persona import person_detector

DBG = 1

PHOTO_FOLDER = "input"
if not os.path.exists(PHOTO_FOLDER):
    os.makedirs(PHOTO_FOLDER)

app = Flask(__name__)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


def handle_photo(photo, height, test):
    szNow = dt.now().strftime("%Y-%M-%d %H.%M.%S")
    if test:
        photo_path = "samples/test/front1.jpg"
    else:
        photo_path = "%s/photo_%s.jpg" % (PHOTO_FOLDER, szNow)
        photo.save(photo_path)

    full_path = os.path.abspath(photo_path)
    print(">> Saved: %s" % full_path)

    result = None

    # Si persona >= 0.7...
    if person_detector(full_path):
        try:
            medidas = open_pose_image(full_path, height)
            if (DBG):
                print(medidas)

            medidas['result'] = 'success'
            result = medidas
        # Si la medicion falla...
        except Exception as e:
            if (DBG):
                print(e)

            s = "No pudimos tomar las medidas. ¡Intenta otra vez!"
            result = {
                'result': 'sys_error',
                'reason': s,
                'exception': str(e)
            }
            return jsonify(result)
    # Si persona < 0.7
    else:
        s = "No pudimos detectar a una persona."
        result = {
            'result': 'no_human',
            'reason': s,
            'exception': "none"
        }

    return result    

@app.route('/')
def index():
    return 'Usize/'

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        photo = request.files['photo']
        height = int(request.form['height'])
        test = True
        result = handle_photo(photo, height, test)

        if isinstance(result, dict):
            return jsonify(result)
        else:
            return jsonify({'result': 'fatal_error'})
    return "Usize/upload"


# GET requests will be blocked
@app.route('/response', methods=['GET', 'POST'])
def response():
    return "response"


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=3333)
