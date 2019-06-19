import time
from scripts.testpersona import person_detector, MyDetector
import os
from datetime import datetime as dt

NEW = 1


if (NEW):
    from scripts.OpenPoseImageV2_unstable import open_pose_image
else:
    # Original script
    from scripts.OpenPoseImage import open_pose_image

DBG = 1

PHOTO_FOLDER = "input"
if not os.path.exists(PHOTO_FOLDER):
    os.makedirs(PHOTO_FOLDER)

t1 = time.time()
MyDetector = MyDetector()
t2 = time.time()
print(t2-t1)


def handle_photo(photo, height):
    szNow = dt.now().strftime("%Y-%m-%d %H.%M.%S")
    photo_path = "%s/photo_%s.jpg" % (PHOTO_FOLDER, szNow)

    # photo.save(photo_path)
    full_path = photo
    print(">> Saved: %s" % full_path)

    result = None

    # Si pPersona >= 0.7...
    # if person_detector(full_path):
    if MyDetector.person_detector(full_path):
        try:
            medidas = open_pose_image(full_path, height)
            if (DBG):
                print(medidas)

            for i in ['left', 'right']:
                if i in medidas.keys():
                    medidas[i] = "%.2f [cm]" % medidas[i]

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
            return result
    # Si pPersona < 0.7
    else:
        s = "No pudimos detectar a una persona."
        result = {
            'result': 'no_human',
            'reason': s,
            'exception': "none"
        }

    return result


human = 'samples\\single2.jpg'

#result = handle_photo(human, 174)
# print(result)
