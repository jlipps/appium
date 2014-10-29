#!/bin/bash

traceur=$(npm bin)/traceur

function transpile {
  in=$1
  out=$2
  echo "* Running traceur from $in to $out"

  echo "* Clearing out old build: $out"
  rm -rf $out

  echo "* Copying assets"
  cp -R $in $out

  echo "* Removing js files from assets"
  find $out -name "*.js" -delete

  echo "* Transpiling js files"
  js_files=$(find $in -name "*.js")
  IFS=$'\n'
  for file in $js_files
  do
    sub="$in/"
    file=${file#$sub}
    $traceur \
      --out $out/$file \
      --script $in/$file \
      --async-functions \
      --array-comprehension \
      --types true \
      --type-assertions \
      --type-assertion-module ../node_modules/rtts-assert/src/assert \
      --annotations
    perl -pi -e '!$x && s|^("use strict";)?|"use strict";\nrequire("traceur/bin/traceur-runtime");\n| && ($x=1)' $out/$file
  done
}

transpile lib lib_es5
transpile bin bin_es5
