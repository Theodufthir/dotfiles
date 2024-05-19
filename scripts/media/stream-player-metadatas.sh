#!/bin/sh

playerctl -F metadata -f '{ "title": "{{title}}", "author": "{{artist}}",  "album": "{{album}}" }'
