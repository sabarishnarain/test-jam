#!/bin/sh

rm -rf db/test
npm run test-ci
sleep 5 # TODO: Wait for server
npm run test-integ
EXIT_CODE=$?
npm run stop
exit $EXIT_CODE