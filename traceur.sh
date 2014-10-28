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
    $traceur --out $out/$file --script $in/$file \
        --async-functions \
        --array-comprehension \
        --type-assertions
  done
}

transpile lib lib_es5
transpile bin bin_es5
