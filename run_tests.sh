#!/bin/bash

find -type f -name "*tests.py" | xargs grep -l "class Test" | xargs pytest
