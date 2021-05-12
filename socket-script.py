import socketio

# standard Python
sio = socketio.Client()

@sio.event
def message(data):
    print('dta revc')

@sio.event
def connect():
    print('connected')

sio.connect('http://127.0.0.1:3019', {}, None, 'websocket')