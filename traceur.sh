#!/bin/bash

set -e

only_modified=false
traceur=$(npm bin)/traceur

while test $# != 0
do
    case "$1" in
        "--modified") only_modified=true;;
        "-m") only_modified=true;;
    esac

    shift
done

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
    run_traceur $in $out $file
  done
}

function run_traceur {
    in=$1
    out=$2
    file=$3
    $traceur \
      --out $out/$file \
      --script $in/$file \
      --async-functions \
      --array-comprehension
}

function transpile_files {
    in=$1
    out=$2
    mod_files="`$(npm bin)/gitmodified -p \"$1/\" -e \".js\"`"
    echo "* Running traceur on modified files only from $in to $out"
    mkdir -p $out
    if [[ $mod_files == "" ]]; then
        echo "  * No modified files in $in"
    else
        for file in $mod_files
        do
            echo "  * Transpiling $in/$file to $out/$file..."
            run_traceur $in $out $file
        done
    fi
}


if $only_modified ; then
    transpile_files lib lib_es5
    transpile_files bin bin_es5
else
    transpile lib lib_es5
    transpile bin bin_es5
fi
