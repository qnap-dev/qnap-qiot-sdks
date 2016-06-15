#!/bin/sh

# Copyright (c) QNAP Systems, Inc. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.

node_root=$(cd "$(dirname "$0")/.." && pwd)


cd $node_root/device/examples
echo "\n-- Creating links for `pwd` --"
# for Raspberry
npm install node-grovepi
# mqtt module
npm install mqtt --save
#dashboard module
npm install blessed blessed-contrib

[ $? -eq 0 ] || exit $?