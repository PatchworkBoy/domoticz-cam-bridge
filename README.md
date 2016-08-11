# domoticz-cam-bridge
IP Camera HTTP Alarm to Domoticz Virtual Switch

Clone the repo...

```
cd ~/
git clone https://github.com/PatchworkBoy/domoticz-cam-bridge.git
```

Then head to ~/domoticz-cam-bridge/ and bring in the dependencies by running...

```
cd ~/domoticz-cam-bridge/
npm install
```

Edit the source code (server.js), creating enough servers/ports/idx's for your Cameras / Domoticz sensors... all should make itself apparent from the comments. The script is set up for 2 cameras. Just replicate the necessary bits for more.

Create Virtual Switches in Domoticz, edit them and set their Switch Type to 'Motion Sensor', and specify an off timeout. Get their IDX Numbers from Domoticz > Setup > Devices, and enter into the code, replacing mine. 

The script will send the 'On' command to Domoticz while it detects motion, and Domoticz will reset the switch after the timeout period in seconds of inactivity.

Set each IP Camera's HTTP Alarm to the relevant IP & Port via the camera's GUI or CLI:

- Cam1: http://[domoticzip]:8091
- Cam2: http://[domoticzip]:8092

Launch with forever (replace {path}):

```
sudo npm install -g forever  //if you don't already have it!
forever start ~/domoticz-cam-bridge/server.js
```

Run at boot on Jessie via...

```
sudo pico /lib/systemd/system/domoticz-cam-bridge.service
```

Copy & Paste in...
```
[Unit]
Description=Domotic Cam Bridge Service
After=multi-user.target

[Service]
User=pi
Type=idle
ExecStart=/usr/bin/forever start /home/pi/domoticz-cam-bridge/server.js

[Install]
WantedBy=multi-user.target
```

{ctrl-o to save, ctrl-x to quit}

Now run:
```
sudo chmod 644 /lib/systemd/system/domoticz-cam-bridge.service
sudo systemctl daemon-reload
sudo systemctl enable domoticz-cam-bridge.service
sudo reboot
```

You now no longer need to manually start the cam bridge. It should run automatically at boot up.

To check bridge Status...

```
sudo systemctl status domoticz-cam-bridge.service -l
```

To restart the bridge...

```
sudo systemctl restart domoticz-cam-bridge
```
