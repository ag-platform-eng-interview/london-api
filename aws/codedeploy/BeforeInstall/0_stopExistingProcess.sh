#!/bin/sh

deployment_dir=/opt/london-api/dev-server
if [ -d "$deployment_dir" ] && [ -x "$deployment_dir" ]; then
    cd $deployment_dir

    node -e 'try{require("child_process").execSync("pm2 stop dev-server")}catch(e){}';
fi
