#!/bin/bash

npx webpack b --config ./webpack.config.prod.js

rsync -avzhL prod/* ethhack.org:/var/www/ethhack.org/
