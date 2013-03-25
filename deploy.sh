# build widget and deploy to handset;
# if the handset doesn't have the tizen-app-reinstall.sh
# script, this script will first copy it to /opt/home/tizen/;
reset

# get the app URL from config.xml
APP_ID=`grep xmlns:tizen config.xml | tr ' ' '\n' | awk -F= '/id=/ {print $2}' | tr -d '"'`
FILE_PREFIX=`basename $APP_ID`

echo "APP_ID = $APP_ID; FILE_PREFIX = $FILE_PREFIX"

# make the widget package
grunt pkg

# get the name of the widget package
WIDGET_PACKAGE=`ls -t -1 build/*.wgt | head -n1`
WIDGET_TMP_DIR=/tmp/$FILE_PREFIX-output
SCRIPT=./tools/tizen-app-reinstall.sh
REMOTE_DIR=/opt/home/developer
SCRIPT_FILE=`basename $SCRIPT`
REMOTE_SCRIPT=$REMOTE_DIR/$SCRIPT_FILE

HAS_SCRIPT=`sdb shell "ls $REMOTE_DIR | grep $SCRIPT_FILE"`

if [ "x$HAS_SCRIPT" = "x" ] ; then
  sdb push $SCRIPT $REMOTE_DIR/
  sdb shell "chmod +x $REMOTE_SCRIPT"
fi

echo "Copying file to device..."
sdb push $WIDGET_PACKAGE $REMOTE_DIR

sdb shell "$REMOTE_SCRIPT $APP_ID $REMOTE_DIR/`basename $WIDGET_PACKAGE`" | tee $WIDGET_TMP_DIR

PORT=`cat $WIDGET_TMP_DIR | grep PORT | awk '{print $2}'`

rm $WIDGET_TMP_DIR

if [ "x$PORT" != "x" ] ; then
  echo "forwarding to tcp port $PORT"

  sdb forward tcp:8888 tcp:$PORT

  echo "****************************************************"
  echo "debug at http://localhost:8888/inspector.html?page=1"
fi
