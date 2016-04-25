#!/bin/bash
# Copyright (c) QNAP Systems, Inc. All rights reserved. Licensed under the MIT
# license. See LICENSE file in the project root for full license
# information.

# Tested on RPi3 Model B

install_root="$HOME"
build_root=$(cd "$(dirname "$0")/.." && pwd)
cd $build_root
