#!/bin/sh
cd /opt/london-api/
mv .production.env .env
mv yarn.lock yarn.lock.bkup
yarn 