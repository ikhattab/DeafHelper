from flask import Flask
from flask import request
import pyttsx

app = Flask(__name__)

@app.route('/')
def say():
	text = request.args.get('text', '')
	engine = pyttsx.init()
	engine.say(text)
	engine.runAndWait()
 	return 'you said: ' + text

@app.errorhandler(500)
def internal_error(error):

    return error

if __name__ == '__main__':
    app.run(host='0.0.0.0')