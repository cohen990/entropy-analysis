rm ./out/results.csv
run () {
    npm run download-and-analyse -- -o $1 -r $2 -f $3 -x "**/*.min.*" -x "**/*.map" -x "**/locale/**"
}

run cohen990 mars-rover-again main
run lodash lodash main
run chalk chalk main
run request request master
run tj commander.js master
run facebook react main
run expressjs express master
run debug-js debug master
run caolan async master
run jprichardson node-fs-extra master
run moment moment develop
run facebook prop-types main