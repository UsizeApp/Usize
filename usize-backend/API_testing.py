import requests

API_addr = "http://127.0.0.1:3333/upload"

API_files = {
	'photo': open('samples\\single2.jpg','rb')
}

height = 174

API_values = {
	'height': height
}

r = requests.post(API_addr, files = API_files, data = API_values)

print(r.status_code)

if (1):
	print(r.text)
else:
	print(r.text[:50])