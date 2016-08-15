# domoticz-cam-bridge
IP Camera HTTP & FTP Alarm to Domoticz Virtual Switch

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

Edit the source code (server_http.js & server_ftp.js), creating enough servers/ports/idx's for your Cameras / Domoticz sensors... all should make itself apparent from the comments. Each script is set up for 2 cameras. Just replicate the necessary bits for more.

Create Virtual Switches in Domoticz, edit them and set their Switch Type to 'Motion Sensor', and specify an off timeout. Get their IDX Numbers from Domoticz > Setup > Devices, and enter into the code, replacing mine. 

The script will send the 'On' command to Domoticz while it detects motion, and Domoticz will reset the switch after the timeout period in seconds of inactivity.

Set each IP Camera's FTP Alarm to the relevant IP & Port via the camera's GUI or CLI:

- Cam1: http://[domoticzip]:8089
- Cam2: http://[domoticzip]:8090

Set each IP Camera's HTTP Alarm to the relevant IP & Port via the camera's GUI or CLI:

- Cam3: http://[domoticzip]:8091
- Cam4: http://[domoticzip]:8092

Launch with forever (replace {path}):

```
sudo npm install -g forever  //if you don't already have it!
forever start ~/domoticz-cam-bridge/server_http.js
forever start ~/domoticz-cam-bridge/server_ftp.js
```

Run at boot on Jessie via...

```
sudo pico /lib/systemd/system/domoticz-http-cam-bridge.service
```

Copy & Paste in...
```
[Unit]
Description=Domotic HTTP Cam Bridge Service
After=multi-user.target

[Service]
User=pi
Type=idle
ExecStart=/usr/bin/forever start /home/pi/domoticz-cam-bridge/server_http.js

[Install]
WantedBy=multi-user.target
```

{ctrl-o to save, ctrl-x to quit}

```
sudo pico /lib/systemd/system/domoticz-ftp-cam-bridge.service
```

Copy & Paste in...
```
[Unit]
Description=Domotic FTP Cam Bridge Service
After=multi-user.target

[Service]
User=pi
Type=idle
ExecStart=/usr/bin/forever start /home/pi/domoticz-cam-bridge/server_ftp.js

[Install]
WantedBy=multi-user.target
```

{ctrl-o to save, ctrl-x to quit}

Now run:
```
sudo chmod 644 /lib/systemd/system/domoticz-http-cam-bridge.service
sudo chmod 644 /lib/systemd/system/domoticz-ftp-cam-bridge.service
sudo systemctl daemon-reload
sudo systemctl enable domoticz-http-cam-bridge.service
sudo systemctl enable domoticz-ftp-cam-bridge.service
sudo reboot
```

You now no longer need to manually start the cam bridge. It should run automatically at boot up.

To check bridge Status...

```
sudo systemctl status domoticz-http-cam-bridge.service -l
sudo systemctl status domoticz-ftp-cam-bridge.service -l
```

To restart the bridge...

```
forever restart /home/pi/domoticz-http-cam-bridge/server.js
forever restart /home/pi/domoticz-ftp-cam-bridge/server.js
```

See https://github.com/foreverjs/forever for proper 'forever' usage.
