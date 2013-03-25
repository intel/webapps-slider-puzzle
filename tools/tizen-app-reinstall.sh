# kill, uninstall, install and debug start a Tizen app;
# intended for installation on a Tizen handset
APP_ID=$1
PACKAGE=$2

if [[ $APP_ID = "" || $PACKAGE = "" ]] ; then
  echo "Usage: $0 <app ID> <path to .wgt package>"
  exit 1
fi

# check whether app is installed
APP_EXISTS=`wrt-launcher -l | grep $APP_ID`

NOT_RUNNING=

# this is a workaround for wrt-launcher reporting that an app
# has been killed when it is actually still in a state where
# it can't be uninstalled
if [ "x$APP_EXISTS" != "x" ] ; then
  while [ "x$NOT_RUNNING" = "x" ] ; do
    RESULT=`wrt-launcher -k $APP_ID | grep "App isn't running"`

    if [ "x" != "x$RESULT" ] ; then
      NOT_RUNNING=true
    else
      echo "$APP_ID is still alive"
      sleep 0.25
    fi
  done

  echo "$APP_ID really is dead"

  wrt-installer -ug $APP_ID
else
  echo "App with ID $APP_ID does not exist, so not killing or uninstalling"
fi

wrt-installer -i $PACKAGE
PORT=`wrt-launcher -d -s $APP_ID | grep port | awk -F": " '{print $2}'`

if [ "x$PORT" = "x" ] ; then
  echo "No debug port available; resolve by ensuring phone screen is not locked"
else
  echo "PORT $PORT"
fi
