# Copyright (c) 2013, Intel Corporation.
#
# This program is licensed under the terms and conditions of the
# Apache License, version 2.0.  The full text of the Apache License is at
# http://www.apache.org/licenses/LICENSE-2.0
APP_ID=$2
KEY=perf-data

PATH=/opt/usr/apps/$APP_ID/data/.webkit/localStorage/file__0.localstorage
SQL="SELECT value FROM ItemTable WHERE key='$KEY'"

echo
echo "*******************************************************"
echo "DUMP OF LOCALSTORAGE FOR APP $2"
echo
/usr/bin/sqlite3 $PATH "$SQL"
