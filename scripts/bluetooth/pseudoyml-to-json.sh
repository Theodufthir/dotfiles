#!/bin/sh

sed -r 's/"/\\"/' \
  | sed -rn 's/\s+([^:]*): (.*)$/, "\1": "\2"/p' \
  | sed -r 's/"yes"/true/' \
  | sed -r 's/"no"/false/'
